import { useParams } from "react-router-dom";

export const useOperatorPageParams = () => {
  return useParams<{ operatorId: string }>();
};
