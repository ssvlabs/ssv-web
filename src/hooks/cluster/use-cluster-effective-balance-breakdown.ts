import { useQuery } from "@tanstack/react-query";
import { getValidatorsStatusCounts } from "@/api/validators";

export const useClusterEffectiveBalanceBreakdown = (clusterHash: string) => {
  return useQuery({
    queryKey: ["validators-status-counts", clusterHash],
    queryFn: () => getValidatorsStatusCounts(clusterHash).then((res) => res.eb),
  });
};
