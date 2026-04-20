import { getClusterTotalEffectiveBalance } from "@/api/cluster";
import { useQuery } from "@tanstack/react-query";

export const useClusterTotalEffectiveBalance = (clusterHash: string) => {
  return useQuery({
    queryKey: ["cluster-total-effective-balance", clusterHash],
    queryFn: () => getClusterTotalEffectiveBalance(clusterHash),
  });
};
