import { describe, it, expect } from "vitest";
import type { Cluster, SolidityCluster } from "@/types/api";
import { mergeClusterSnapshot } from "@/lib/utils/cluster";

describe("util:mergeClusterSnapshot", () => {
  const createMockCluster = (
    overrides?: Partial<Cluster<{ operators: number[] }>>,
  ): Cluster<{ operators: number[] }> => ({
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
    isSSVCluster: true,
    operators: [1, 2, 3],
    ...overrides,
  });

  const createMockSnapshot = (
    overrides?: Partial<SolidityCluster>,
  ): SolidityCluster => ({
    validatorCount: 5,
    networkFeeIndex: 100n,
    index: 200n,
    balance: 1000n,
    active: true,
    ...overrides,
  });

  it("should update balance for non-migrated cluster and return same cluster type", () => {
    const cluster = createMockCluster({ migrated: false, ethBalance: "0" });
    const snapshot = createMockSnapshot({ balance: 2000n });
    const additionalData = {};

    const result = mergeClusterSnapshot(cluster, snapshot, additionalData);

    // Should return the same cluster but updated
    expect(result).toEqual(
      expect.objectContaining({
        ...cluster,
        balance: "2000",
        validatorCount: 5,
        networkFeeIndex: "100",
        index: "200",
        active: true,
      }),
    );
    expect(result.ethBalance).toBe("0"); // Should remain unchanged
  });

  it("should update ethBalance for migrated cluster and return same cluster type", () => {
    const cluster = createMockCluster({ migrated: true, balance: "1000" });
    const snapshot = createMockSnapshot({ balance: 3000n });
    const additionalData = {};

    const result = mergeClusterSnapshot(cluster, snapshot, additionalData);

    // Should return the same cluster but updated
    expect(result).toEqual(
      expect.objectContaining({
        ...cluster,
        ethBalance: "3000",
        validatorCount: 5,
        networkFeeIndex: "100",
        index: "200",
        active: true,
      }),
    );
    expect(result.balance).toBe("1000"); // Should remain unchanged
  });
});
