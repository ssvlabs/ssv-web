import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AllEvents } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import { createDefaultOperator } from "@/lib/utils/operator";
import { applyOptimisticOperatorUpdate } from "./operator-optimistic-update";
import { setOptimisticData } from "@/lib/react-query";

vi.mock("@/lib/contract-interactions/hooks/query-options", () => ({
  fetchIsAddressWhitelistedInWhitelistingContract: vi.fn(),
}));

vi.mock("@/lib/react-query", () => ({
  setOptimisticData: vi.fn(),
}));

vi.mock("@/hooks/operator/use-operator", () => ({
  getOperatorQueryOptions: (id?: number) => ({
    queryKey: ["operator", id?.toString(), 99],
  }),
}));

describe("applyOptimisticOperatorUpdate", () => {
  const operatorId = 42;

  beforeEach(() => {
    vi.mocked(setOptimisticData).mockClear();
  });

  it("does nothing when there are no handled events", () => {
    applyOptimisticOperatorUpdate(operatorId, [] as AllEvents[]);
    applyOptimisticOperatorUpdate(operatorId, [
      { eventName: "OperatorMaximumFeeUpdated", args: { maxFee: 1n } },
    ] as unknown as AllEvents[]);

    expect(setOptimisticData).not.toHaveBeenCalled();
  });

  it("merges OperatorFeeExecuted fee into cached operator", () => {
    const events = [
      {
        eventName: "OperatorFeeExecuted" as const,
        args: { fee: 12_345n },
      },
    ] as unknown as AllEvents[];

    applyOptimisticOperatorUpdate(operatorId, events);

    expect(setOptimisticData).toHaveBeenCalledWith(
      ["operator", "42", 99],
      expect.any(Function),
    );

    const updater = vi.mocked(setOptimisticData).mock.calls[0][1] as (
      prev: ReturnType<typeof createDefaultOperator> | undefined,
    ) => ReturnType<typeof createDefaultOperator> | undefined;

    const prev = createDefaultOperator({
      id: operatorId,
      fee: "0",
      eth_fee: "0",
    });
    expect(updater(prev)).toEqual(
      expect.objectContaining({
        ...prev,
        fee: "0",
        eth_fee: "12345",
      }),
    );
  });

  it("marks operator removed on OperatorRemoved", () => {
    const events = [
      {
        eventName: "OperatorRemoved" as const,
        args: { operatorId: BigInt(operatorId) },
      },
    ] as unknown as AllEvents[];

    applyOptimisticOperatorUpdate(operatorId, events);

    const updater = vi.mocked(setOptimisticData).mock.calls[0][1] as (
      prev: ReturnType<typeof createDefaultOperator> | undefined,
    ) => ReturnType<typeof createDefaultOperator> | undefined;

    const prev = createDefaultOperator({ id: operatorId });
    expect(updater(prev)).toEqual(
      expect.objectContaining({
        is_deleted: true,
        status: "Removed",
      }),
    );
  });

  it("leaves cache unchanged when previous operator is missing", () => {
    const events = [
      {
        eventName: "OperatorFeeDeclared" as const,
        args: { fee: 1n },
      },
    ] as unknown as AllEvents[];

    applyOptimisticOperatorUpdate(operatorId, events);

    const updater = vi.mocked(setOptimisticData).mock.calls[0][1] as (
      prev: unknown,
    ) => unknown;
    expect(updater(undefined)).toBeUndefined();
  });
});
