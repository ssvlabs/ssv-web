import { describe, it, expect } from "vitest";
import {
  computeFundingCost,
  effectiveBalanceToVUnits,
} from "@/lib/utils/keystore";
import { globals } from "@/config";

// Abbreviations: NF=networkFee, OF=operatorsFee, LCP=liquidationCollateralPeriod,
// MLC=minimumLiquidationCollateral, BPD=blocksPerDay

describe("util:keystore", () => {
  it("computeFundingCost calculates correctly for 1 validator, 1 day funding", () => {
    // 1 validator (effectiveBalance=32), 1 day, 7160 BPD
    // 1 NF, 1 OF → daily cost = fee × BPD = 7160
    // liquidation: (1 NF + 1 OF) × 2 LCP × 1 = 4, max(4, 10 MLC) = 10

    const operatorsFee = 1n;
    const networkFee = 1n;

    const liquidationCollateralPeriod = 2n;
    const minimumLiquidationCollateral = 10n;

    const result = computeFundingCost({
      fundingDays: 1,
      effectiveBalance: 32n,
      networkFee,
      operatorsFee,
      liquidationCollateralPeriod,
      minimumLiquidationCollateral,
    });

    const networkCost = networkFee * globals.BLOCKS_PER_DAY;
    const operatorsCost = operatorsFee * globals.BLOCKS_PER_DAY;

    // 1 NF × 7160 BPD = 7160
    expect(result.perValidator.networkCost).toBe(networkCost);
    expect(result.perValidator.operatorsCost).toBe(operatorsCost);
    // (1+1) × 2 LCP × 1 = 4; max(4, 10 MLC) = 10
    expect(result.perValidator.liquidationCollateral).toBe(
      minimumLiquidationCollateral,
    );

    // 1 validator → subtotal = perValidator
    expect(result.subtotal.networkCost).toBe(networkCost);
    expect(result.subtotal.operatorsCost).toBe(operatorsCost);
    expect(result.subtotal.liquidationCollateral).toBe(
      minimumLiquidationCollateral,
    );

    // total = network + operators + liquidation
    expect(result.total).toBe(networkCost + operatorsCost + 10n);
  });

  describe("liquidation collateral", () => {
    it("uses minimum when calculated collateral is below minimum", () => {
      // (1nf+1opf) × 2 LCP × 1 = 4; max(4, 10 MLC) = 10
      const result = computeFundingCost({
        fundingDays: 1,
        effectiveBalance: 32n,
        networkFee: 1n,
        operatorsFee: 1n,
        liquidationCollateralPeriod: 2n,
        minimumLiquidationCollateral: 10n,
      });

      // (1+1) × 2 LCP × 1 = 4 < 10 MLC → use 10 MLC
      expect(result.perValidator.liquidationCollateral).toBe(10n);
      // 1 validator × 10
      expect(result.subtotal.liquidationCollateral).toBe(10n);
    });

    it("uses calculated collateral when above minimum", () => {
      // (10+10) × 5 LCP × 2 = 200 > 50 MLC → 200/2 = 100
      const result = computeFundingCost({
        fundingDays: 1,
        effectiveBalance: 64n, // 2 validators
        networkFee: 10n,
        operatorsFee: 10n,
        liquidationCollateralPeriod: 5n,
        minimumLiquidationCollateral: 50n,
      });

      // (10+10) × 5 LCP × 2 = 200 > 50 MLC → 200/2 = 100 per validator
      expect(result.perValidator.liquidationCollateral).toBe(100n);
      // 2 validators × 100
      expect(result.subtotal.liquidationCollateral).toBe(200n);
    });
  });

  it("computeFundingCost uses contract-like vUnits scaling for fractional EB (48 effectiveBalance = 1.5)", () => {
    // 48/32 = 1.5 validators; vUnits = ceil(48 * 10000 / 32) = 15000
    const result = computeFundingCost({
      fundingDays: 1,
      effectiveBalance: 48n,
      networkFee: 1n,
      operatorsFee: 1n,
      liquidationCollateralPeriod: 2n,
      minimumLiquidationCollateral: 10n,
    });

    const networkCost = 1n * globals.BLOCKS_PER_DAY;
    const operatorsCost = 1n * globals.BLOCKS_PER_DAY;

    // perValidator unchanged (base rate for 1 validator)
    expect(result.perValidator.networkCost).toBe(networkCost);
    expect(result.perValidator.operatorsCost).toBe(operatorsCost);

    // subtotal = (cost * vUnits) / 10000 = (7160 * 15000) / 10000 = 10740
    expect(result.subtotal.networkCost).toBe(10740n);
    expect(result.subtotal.operatorsCost).toBe(10740n);

    // liquidation subtotal uses the same vUnits scaling and min-collateral guard.
    expect(result.perValidator.liquidationCollateral).toBe(6n);
    expect(result.subtotal.liquidationCollateral).toBe(10n);

    expect(result.total).toBe(10740n + 10740n + 10n);
  });

  it("covers EB examples used in scaled fee calculation", () => {
    const cases = [
      {
        effectiveBalance: 33n,
        expectedVUnits: 10313n,
        expectedNetworkSubtotal: 7384n,
      },
      {
        effectiveBalance: 48n,
        expectedVUnits: 15000n,
        expectedNetworkSubtotal: 10740n,
      },
      {
        effectiveBalance: 64n,
        expectedVUnits: 20000n,
        expectedNetworkSubtotal: 14320n,
      },
      {
        effectiveBalance: 100n,
        expectedVUnits: 31250n,
        expectedNetworkSubtotal: 22375n,
      },
      {
        effectiveBalance: 2048n,
        expectedVUnits: 640000n,
        expectedNetworkSubtotal: 458240n,
      },
    ] as const;

    const perValidatorDailyNetworkCost = globals.BLOCKS_PER_DAY;

    for (const c of cases) {
      const result = computeFundingCost({
        fundingDays: 1,
        effectiveBalance: c.effectiveBalance,
        networkFee: 1n,
        operatorsFee: 0n,
        liquidationCollateralPeriod: 0n,
        minimumLiquidationCollateral: 0n,
      });

      const vUnits = effectiveBalanceToVUnits(c.effectiveBalance);
      const subtotalViaVUnits =
        (perValidatorDailyNetworkCost * vUnits) / 10000n;

      expect(vUnits).toBe(c.expectedVUnits);
      expect(result.subtotal.networkCost).toBe(c.expectedNetworkSubtotal);
      expect(result.subtotal.networkCost).toBe(subtotalViaVUnits);
      expect(result.subtotal.operatorsCost).toBe(0n);
      expect(result.subtotal.liquidationCollateral).toBe(0n);
      expect(result.total).toBe(c.expectedNetworkSubtotal);
    }
  });

  it("computeFundingCost scales network and operators cost by funding days", () => {
    // 1 validator, 3 days → costs are 3× the 1-day amounts
    // liquidation is one-time collateral, unchanged by days
    const operatorsFee = 1n;
    const networkFee = 1n;
    const fundingDays = 3;

    const result = computeFundingCost({
      fundingDays,
      effectiveBalance: 32n,
      networkFee,
      operatorsFee,
      liquidationCollateralPeriod: 2n,
      minimumLiquidationCollateral: 10n,
    });

    const networkCost =
      networkFee * BigInt(fundingDays) * globals.BLOCKS_PER_DAY;
    const operatorsCost =
      operatorsFee * BigInt(fundingDays) * globals.BLOCKS_PER_DAY;

    // 1 NF × 3 days × 7160 BPD = 21480
    expect(result.perValidator.networkCost).toBe(networkCost);
    expect(result.perValidator.operatorsCost).toBe(operatorsCost);
    // liquidation one-time, not scaled by days → (1+1) × 2 LCP × 1 = 4, max(4, 10 MLC) = 10
    expect(result.perValidator.liquidationCollateral).toBe(10n);

    // 1 validator × (network + operators) + liquidation
    expect(result.total).toBe(networkCost + operatorsCost + 10n);
  });
});
