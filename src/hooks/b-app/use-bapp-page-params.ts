import type { Address } from "abitype";
import { useParams } from "react-router";

export const useBAppPageParams = () => {
  return useParams<{ bAppId: Address }>();
};
