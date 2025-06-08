import { getOperator } from "@/api/operator";
import { useOperatorPageParams } from "@/hooks/operator/use-operator-page-params";
import { queryClient, type UseQueryOptions } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { createDefaultOperator } from "@/lib/utils/operator";
import type { OperatorID } from "@/types/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useChainId } from "wagmi";
import { getDefaultChainedQueryOptions, enabled } from "@/lib/react-query";
import { boolify } from "@/lib/utils/boolean";
import { getSSVNetworkDetails } from "@/hooks/use-ssv-network-details";

export const getOperatorQueryOptions = (
  id?: OperatorID,
  {
    chainId = getSSVNetworkDetails().networkId,
    options,
  } = getDefaultChainedQueryOptions(),
) => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    queryKey: ["operator", id?.toString(), chainId],
    queryFn: () =>
      getOperator(id!).catch((err) => {
        return isAxiosError(err) &&
          [404, 500].includes(err.response?.status ?? 0)
          ? createDefaultOperator({
              id: Number(id),
              is_deleted: true,
              status: "Removed",
            })
          : Promise.reject(err);
      }),
    enabled: boolify(id) && enabled(options?.enabled),
  });
};

export const invalidateOperatorQuery = (id: OperatorID) => {
  return queryClient.invalidateQueries({
    queryKey: getOperatorQueryOptions(id).queryKey,
  });
};

export const useOperator = (id?: OperatorID, options: UseQueryOptions = {}) => {
  const params = useOperatorPageParams();
  const chainId = useChainId();
  const _id = (id ?? params.operatorId ?? "").toString();

  return useQuery(
    getOperatorQueryOptions(_id, {
      chainId,
      options,
    }),
  );
};
