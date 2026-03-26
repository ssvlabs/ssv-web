import { describe, it, expect, vi, beforeEach } from "vitest";
import type { AllEvents } from "@/lib/contract-interactions/utils/useWaitForTransactionReceipt";
import type { Cluster, SolidityCluster } from "@/types/api";
import { applyOptimisticClusterUpdate } from "./cluster-optimistic-update";
import { setOptimisticData } from "@/lib/react-query";

vi.mock("@/lib/react-query", () => ({
  setOptimisticData: vi.fn(),
}));

vi.mock("@/hooks/cluster/use-cluster", () => ({
  getClusterQueryOptions: (hash?: string) => ({
    queryKey: ["cluster", hash?.toLowerCase(), 99],
  }),
}));

describe("applyOptimisticClusterUpdate", () => {
  const createPrevCluster = (): Cluster<{ operators: number[] }> => ({
    id: 1,
    clusterId: "0x123",
    network: "mainnet",
    version: "v4",
    ownerAddress: "0xowner",
    validatorCount: 5,
    networkFeeIndex: "100",
    index: "200",
    balance: "1000",
    ethBalance: "0",
    effectiveBalance: "32",
    active: true,
    isLiquidated: false,
    blockNumber: 12345,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-02",
    operators: [1, 2, 3],
    migrated: false,
  });

  const snapshotFromEvent = (
    overrides?: Partial<SolidityCluster>,
  ): SolidityCluster => ({
    validatorCount: 5,
    networkFeeIndex: 100n,
    index: 200n,
    balance: 5000n,
    active: true,
    ...overrides,
  });

  beforeEach(() => {
    vi.mocked(setOptimisticData).mockClear();
  });

  it("does nothing when there is no cluster-bearing event", () => {
    applyOptimisticClusterUpdate("0xabc", [] as AllEvents[]);
    expect(setOptimisticData).not.toHaveBeenCalled();
  });

  it("passes the cluster query key and merges event args.cluster into cached cluster", () => {
    const events = [
      {
        eventName: "ClusterDeposited" as const,
        args: { cluster: snapshotFromEvent({ balance: 7777n }) },
      },
    ] as unknown as AllEvents[];

    applyOptimisticClusterUpdate("0xAbC", events);

    expect(setOptimisticData).toHaveBeenCalledTimes(1);
    expect(setOptimisticData).toHaveBeenCalledWith(
      ["cluster", "0xabc", 99],
      expect.any(Function),
    );

    const updater = vi.mocked(setOptimisticData).mock.calls[0][1] as (
      prev: Cluster<{ operators: number[] }> | undefined,
    ) => Cluster<{ operators: number[] }> | undefined;

    const merged = updater(createPrevCluster());
    expect(merged).toEqual(
      expect.objectContaining({
        balance: "7777",
        validatorCount: 5,
        active: true,
      }),
    );
  });

  it("leaves cache unchanged when previous cluster is missing", () => {
    const events = [
      {
        eventName: "ClusterDeposited" as const,
        args: { cluster: snapshotFromEvent() },
      },
    ] as unknown as AllEvents[];

    applyOptimisticClusterUpdate("0xabc", events);

    const updater = vi.mocked(setOptimisticData).mock.calls[0][1] as (
      prev: unknown,
    ) => unknown;
    expect(updater(undefined)).toBeUndefined();
  });
});
