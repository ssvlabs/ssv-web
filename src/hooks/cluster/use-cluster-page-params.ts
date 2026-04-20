import { useParams } from "react-router-dom";

export const useClusterPageParams = () => {
  return useParams<{ clusterHash: string; publicKeys?: string }>();
};
