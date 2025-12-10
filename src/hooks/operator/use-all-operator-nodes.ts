import { getAllOperatorNodes } from "@/api/operator";
import { useQuery } from "@tanstack/react-query";
import { useChainId } from "wagmi";

export const useAllOperatorNodes = () => {
  const chainId = useChainId();

  return useQuery({
    queryKey: ["all-operator-nodes", chainId],
    queryFn: getAllOperatorNodes,
  });
};

export const useOperatorNodeClients = () => {
  const { data, ...rest } = useAllOperatorNodes();

  const nodeClients = data
    ? {
        eth1_node_client: data.ETH1_NODE,
        eth2_node_client: data.ETH2_NODE,
        ssv_client: data.SSV_NODE,
      }
    : undefined;

  return {
    ...rest,
    data: nodeClients,
  };
};