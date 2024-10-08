import { getOperatorNodes } from "@/api/operator";
import { ms } from "@/lib/utils/number";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export const useOperatorNodes = (layer: number) => {
  const chainId = useChainId();

  return useQuery({
    staleTime: ms(1, "days"),
    queryKey: ["operator-nodes", chainId, layer],
    queryFn: () => getOperatorNodes(layer),
  });
};
