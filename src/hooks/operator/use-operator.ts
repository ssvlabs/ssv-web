import { getOperator } from "@/api/operator";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { queryClient, type QueryConfig } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { createDefaultOperator } from "@/lib/utils/operator";
import type { OperatorID } from "@/types/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const getOperatorQueryOptions = (id: OperatorID) => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    queryKey: ["operator", id.toString()],
    queryFn: () =>
      getOperator(id).catch((err) => {
        return isAxiosError(err) && err.response?.status === 404
          ? createDefaultOperator({
              id: Number(id),
              is_deleted: true,
              status: "Removed",
            })
          : Promise.reject(err);
      }),
    enabled: !!id,
  });
};

export const invalidateOperatorQuery = (id: OperatorID) => {
  return queryClient.invalidateQueries({
    queryKey: getOperatorQueryOptions(id).queryKey,
  });
};

type UseOperatorOptions = QueryConfig<typeof getOperatorQueryOptions>;

export const useOperator = (
  id?: OperatorID,
  options: UseOperatorOptions = { enabled: true },
) => {
  const params = useOperatorPageParams();
  const _id = (id ?? params.operatorId ?? "").toString();
  const queryOptions = getOperatorQueryOptions(_id);
  return useQuery({
    ...queryOptions,
    ...options,
    enabled: queryOptions.enabled && options?.enabled,
  });
};
