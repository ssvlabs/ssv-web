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

  const parseNodeData = (nodeData: string | string[]): string[] => {
    if (Array.isArray(nodeData)) return nodeData;
    try {
      return JSON.parse(nodeData) as string[];
    } catch {
      return [];
    }
  };

  const nodeClients = data
    ? {
        eth1_node_client: parseNodeData(data.ETH1_NODE),
        eth2_node_client: parseNodeData(data.ETH2_NODE),
        ssv_client: parseNodeData(data.SSV_NODE),
      }
    : {
        eth1_node_client: [],
        eth2_node_client: [],
        ssv_client: [],
      };

  return {
    ...rest,
    data: nodeClients,
  };
};
