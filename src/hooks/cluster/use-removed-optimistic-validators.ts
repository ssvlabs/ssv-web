import { type QueryConfig } from "@/lib/react-query";
import { ms } from "@/lib/utils/number";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getRemovedOptimisticValidatorsQueryOptions = () => {
  return queryOptions({
    staleTime: ms(1, "minutes"),
    gcTime: ms(1, "minutes"),
    queryKey: ["removed-optimistic-validators"],
    placeholderData: () => [],
    queryFn: async () => [] as string[],
  });
};

type Options = {
  options?: QueryConfig<typeof getRemovedOptimisticValidatorsQueryOptions>;
};

export const useRemovedOptimisticValidators = ({ options }: Options = {}) => {
  return useQuery({
    ...getRemovedOptimisticValidatorsQueryOptions(),
    ...options,
  });
};
