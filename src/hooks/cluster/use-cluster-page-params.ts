import { useParams } from "react-router";

export const useClusterPageParams = () => {
  return useParams<{ clusterHash: string }>();
};
