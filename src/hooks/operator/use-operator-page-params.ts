import { useParams } from "react-router";

export const useOperatorPageParams = () => {
  return useParams<{ operatorId: string }>();
};
