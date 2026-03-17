import { useQuery } from "@tanstack/react-query";
import type { ValidatorsEffectiveBalanceByClusterResponse } from "@/api/validators";
import { getValidatorsEffectiveBalanceByCluster } from "@/api/validators";
import { useLocalStorage } from "react-use";

export const useClusterEffectiveBalanceBreakdown = (clusterHash: string) => {
  // TODO: remove this once tested
  const [mockData] = useLocalStorage<
    ValidatorsEffectiveBalanceByClusterResponse["effectiveBalance"] | undefined
  >("mockEbBreakdown", undefined);

  return useQuery({
    // TODO: remove mockData once tested
    queryKey: ["validators-status-counts", clusterHash, mockData],
    queryFn: () =>
      mockData || getValidatorsEffectiveBalanceByCluster(clusterHash),
  });
};
