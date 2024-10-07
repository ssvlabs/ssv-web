import { getAllValidators } from "@/api/validators";
import { useMutation } from "@tanstack/react-query";

export const useGetAllValidators = (clusterHash: string) => {
  return useMutation({
    mutationKey: ["get-all-validators", clusterHash],
    mutationFn: getAllValidators,
  });
};
