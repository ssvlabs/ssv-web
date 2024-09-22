import type { OperatorMetadata } from "@/api/operator";
import { setOperatorMetadata } from "@/api/operator";
import { useMutation } from "@tanstack/react-query";

export const useSetOperatorMetadata = () => {
  return useMutation({
    mutationFn: (params: { operatorId: string; metadata: OperatorMetadata }) =>
      setOperatorMetadata(params.operatorId, params.metadata),
  });
};
