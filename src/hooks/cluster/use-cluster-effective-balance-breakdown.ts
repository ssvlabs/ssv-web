import { useQuery } from "@tanstack/react-query";
import { getValidatorsEffectiveBalanceByCluster } from "@/api/validators";

export const useClusterEffectiveBalanceBreakdown = (clusterHash: string) => {
  return useQuery({
    queryKey: ["validators-status-counts", clusterHash],
    queryFn: () => getValidatorsEffectiveBalanceByCluster(clusterHash),
  });
};
