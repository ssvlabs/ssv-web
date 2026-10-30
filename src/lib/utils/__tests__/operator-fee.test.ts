import { afterEach, describe, expect, it, vi } from "vitest";
import { globals } from "@/config";
import { calculateRunway } from "@/lib/utils/cluster";
import {
  createDefaultOperator,
  getOperatorEthFee,
  getOperatorSsvFee,
  sumOperatorsFee,
} from "@/lib/utils/operator";

// 3 live operators + 1 removed one. The API keeps the removed operator's last
// (stale) fee; on-chain it is 0.
const LIVE_ETH = 3n * 1_000_000_000n;
const LIVE_SSV = 3n * 2_000_000n;

const ops = [
  createDefaultOperator({ id: 1, fee: "2000000", eth_fee: "1000000000" }),
  createDefaultOperator({ id: 2, fee: "2000000", eth_fee: "1000000000" }),
  createDefaultOperator({ id: 3, fee: "2000000", eth_fee: "1000000000" }),
  createDefaultOperator({
    id: 4,
    fee: "2000000",
    eth_fee: "1000000000",
    is_deleted: true,
  }),
];
const removed = ops[3];

describe("util:operator fee sums exclude removed operators (SSV-WEB-001)", () => {
  it("getOperatorEthFee returns 0n for a removed operator", () => {
    expect(getOperatorEthFee(removed)).toBe(0n);
    expect(getOperatorEthFee(ops[0])).toBe(1_000_000_000n);
  });

  it("getOperatorSsvFee returns 0n for a removed operator", () => {
    expect(getOperatorSsvFee(removed)).toBe(0n);
    expect(getOperatorSsvFee(ops[0])).toBe(2_000_000n);
  });

  it("sumOperatorsFee eth excludes removed operators", () => {
    expect(sumOperatorsFee(ops, "eth")).toBe(LIVE_ETH);
  });

  it("sumOperatorsFee ssv excludes removed operators", () => {
    expect(sumOperatorsFee(ops, "ssv")).toBe(LIVE_SSV);
  });

  it("sumOperatorsFee defaults to eth", () => {
    expect(sumOperatorsFee(ops)).toBe(LIVE_ETH);
  });

  it("sumOperatorsFee treats empty or missing fee values as 0n", () => {
    const blank = createDefaultOperator({ id: 5, fee: "", eth_fee: "" });
    const missing = createDefaultOperator({
      id: 6,
      fee: undefined as unknown as string,
      eth_fee: undefined as unknown as string,
    });
    expect(sumOperatorsFee([blank, missing], "eth")).toBe(0n);
    expect(sumOperatorsFee([blank, missing], "ssv")).toBe(0n);
  });

  describe("runway built like use-cluster-runway is not shortened by a removed operator", () => {
    const runwayFor = (balance: bigint, feesPerBlock: bigint) =>
      calculateRunway({
        balance,
        feesPerBlock,
        effectiveBalance: 32n,
        liquidationThresholdBlocks: 0n,
        minimumLiquidationCollateral: 0n,
      }).runway;

    it("eth", () => {
      // balance funds exactly 100 days at live-operator fees
      const balance = LIVE_ETH * globals.BLOCKS_PER_DAY * 100n;
      expect(runwayFor(balance, sumOperatorsFee(ops, "eth"))).toBe(
        runwayFor(balance, LIVE_ETH),
      );
      expect(runwayFor(balance, sumOperatorsFee(ops, "eth"))).toBe(100n);
    });

    it("ssv", () => {
      const balance = LIVE_SSV * globals.BLOCKS_PER_DAY * 100n;
      expect(runwayFor(balance, sumOperatorsFee(ops, "ssv"))).toBe(
        runwayFor(balance, LIVE_SSV),
      );
      expect(runwayFor(balance, sumOperatorsFee(ops, "ssv"))).toBe(100n);
    });
  });
});

describe("util:operator warns when an active operator has no fee (SSV-WEB-001)", () => {
  const spy = () => vi.spyOn(console, "warn").mockImplementation(() => {});
  afterEach(() => vi.restoreAllMocks());

  it("returns 0n and warns once for an active operator with a missing eth_fee", () => {
    const warn = spy();
    const op = createDefaultOperator({
      id: 9001,
      fee: "2000000",
      eth_fee: undefined as unknown as string,
    });
    expect(getOperatorEthFee(op)).toBe(0n);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("9001");
    expect(warn.mock.calls[0][0]).toContain("eth_fee");
  });

  it("does not warn again for the same operator and field", () => {
    const warn = spy();
    const op = createDefaultOperator({ id: 9002, fee: "", eth_fee: "1" });
    expect(getOperatorSsvFee(op)).toBe(0n);
    expect(getOperatorSsvFee(op)).toBe(0n);
    expect(sumOperatorsFee([op], "ssv")).toBe(0n);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("fee");
  });

  it("does not warn for a removed operator with a missing fee", () => {
    const warn = spy();
    const op = createDefaultOperator({
      id: 9003,
      fee: "",
      eth_fee: "",
      is_deleted: true,
    });
    expect(getOperatorEthFee(op)).toBe(0n);
    expect(getOperatorSsvFee(op)).toBe(0n);
    expect(warn).not.toHaveBeenCalled();
  });

  it("does not warn for an active operator with a valid fee", () => {
    const warn = spy();
    const op = createDefaultOperator({
      id: 9004,
      fee: "2000000",
      eth_fee: "1000000000",
    });
    expect(getOperatorEthFee(op)).toBe(1_000_000_000n);
    expect(getOperatorSsvFee(op)).toBe(2_000_000n);
    expect(warn).not.toHaveBeenCalled();
  });
});
