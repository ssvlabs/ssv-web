import { getOperatorLocations } from "@/api/operator";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export const useOperatorLocations = () => {
  const chainId = useChainId();

  return useQuery({
    staleTime: 1000 * 60 * 60 * 24,
    queryKey: ["operator-locations", chainId],
    queryFn: getOperatorLocations,
  });
};
