import { toSolidityClusterSnapshot } from "@/lib/utils/cluster";
import type { Cluster } from "@/types/api";
import { useMemo } from "react";

/**
 * Memoizes the `{ clusterOwner, cluster, operatorIds }` snapshot used as input
 * for SSVNetworkViews contract calls (e.g. `getBalance`, `getEffectiveBalance`,
 * `isLiquidated`). The owner is derived from `cluster.ownerAddress`.
 */
export const useClusterSnapshot = (
  cluster: Partial<Cluster> | null | undefined,
) => useMemo(() => toSolidityClusterSnapshot(cluster), [cluster]);
