import { describe, expect, it } from "vitest";
import { globals } from "@/config";
import { calculateRunway } from "@/lib/utils/cluster";
import { effectiveBalanceToVUnits } from "@/lib/utils/keystore";

describe("util:cluster runway uses contract-like vUnits scaling", () => {
  const effectiveBalance = 32n;
  const feesPerBlock = 10_000n;

  const expectedRunway = (balance: bigint, totalEffectiveBalance: bigint) => {
    const vUnits = effectiveBalanceToVUnits(totalEffectiveBalance);
    const burnRatePerBlock = (feesPerBlock * vUnits) / 10_000n;
    return balance / (burnRatePerBlock * globals.BLOCKS_PER_DAY);
  };

  it("covers deltaEffectiveBalance boundaries (0, 1, 32, 33, 64)", () => {
    const balance = 20_313n * globals.BLOCKS_PER_DAY * 1_000n;
    const cases = [
      { deltaEffectiveBalance: 0n, expectedVUnits: 10_000n },
      { deltaEffectiveBalance: 1n, expectedVUnits: 10_313n },
      { deltaEffectiveBalance: 32n, expectedVUnits: 20_000n },
      { deltaEffectiveBalance: 33n, expectedVUnits: 20_313n },
      { deltaEffectiveBalance: 64n, expectedVUnits: 30_000n },
    ] as const;

    for (const c of cases) {
      const totalEffectiveBalance = effectiveBalance + c.deltaEffectiveBalance;
      const result = calculateRunway({
        balance,
        feesPerBlock,
        effectiveBalance,
        deltaEffectiveBalance: c.deltaEffectiveBalance,
        liquidationThresholdBlocks: 0n,
        minimumLiquidationCollateral: 0n,
      });

      expect(effectiveBalanceToVUnits(totalEffectiveBalance)).toBe(
        c.expectedVUnits,
      );
      expect(result.runway).toBe(
        expectedRunway(balance, totalEffectiveBalance),
      );
    }
  });

  it("uses ceil vUnits for deltaEffectiveBalance=33 (not floor/32 behavior)", () => {
    const deltaEffectiveBalance = 33n;
    const totalEffectiveBalance = effectiveBalance + deltaEffectiveBalance; // 65 ETH
    const balance = 20_312n * globals.BLOCKS_PER_DAY;

    const result = calculateRunway({
      balance,
      feesPerBlock,
      effectiveBalance,
      deltaEffectiveBalance,
      liquidationThresholdBlocks: 0n,
      minimumLiquidationCollateral: 0n,
    });

    const newBurnRate =
      (feesPerBlock * effectiveBalanceToVUnits(totalEffectiveBalance)) /
      10_000n;
    const oldBurnRate = (feesPerBlock * totalEffectiveBalance) / 32n;
    const expectedRunwayNew = balance / (newBurnRate * globals.BLOCKS_PER_DAY);
    const expectedRunwayOld = balance / (oldBurnRate * globals.BLOCKS_PER_DAY);

    expect(expectedRunwayNew).toBe(0n);
    expect(expectedRunwayOld).toBe(1n);
    expect(result.runway).toBe(expectedRunwayNew);
  });
});
