import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '~app/hooks/redux.hook';
import { ICluster } from '~app/model/cluster.model';
import { getOptimisticDeletedValidators, removeOptimisticDeletedValidators } from '~app/redux/account.slice';
import { add0x } from '~lib/utils/strings';
import { getClusterHash } from '~root/services/cluster.service';
import { fetchValidatorsByClusterHash } from '~root/services/validator.service';

type Options = {
  per_page?: number;
};

export const useClusterValidators = (cluster: ICluster | undefined, { per_page = 14 }: Options = {}) => {
  const queryClient = useQueryClient();

  const infiniteQuery = useInfiniteQuery({
    staleTime: 60000,
    initialPageParam: 1,
    queryKey: ['cluster-validators', cluster?.clusterId, per_page],
    queryFn: ({ pageParam }) => fetchValidatorsByClusterHash(pageParam, getClusterHash(cluster!.operators, cluster!.ownerAddress), per_page),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    enabled: !!cluster
  });

  const optimisticDeletedValidatorPks = useAppSelector((state) => getOptimisticDeletedValidators(state, cluster?.clusterId ?? ''));

  const fetchAll = useMutation({
    mutationFn: async () => {
      const lastPage = infiniteQuery.data?.pages[infiniteQuery.data.pages.length - 1];
      if (!lastPage || !cluster || !infiniteQuery.data) return;
      queryClient.cancelQueries({
        queryKey: ['cluster-validators', cluster.clusterId, per_page]
      });

      const max = lastPage.pagination.total;
      const { page } = lastPage.pagination;
      const loaded = page * per_page;
      const elementsToLoad = max - loaded + optimisticDeletedValidatorPks.length;
      const pagesToLoad = Array.from({ length: Math.ceil(elementsToLoad / per_page) }, (_, i) => page + i + 1);
      const result = await Promise.all(pagesToLoad.map((page) => fetchValidatorsByClusterHash(page, getClusterHash(cluster!.operators, cluster!.ownerAddress), per_page)));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(['cluster-validators', cluster?.clusterId, per_page], (old: any) => {
        return {
          pageParams: [...old.pageParams, ...pagesToLoad],
          pages: [...old.pages, ...result]
        };
      });

      const validators = [...infiniteQuery.data.pages.flatMap((page) => page.validators), ...result.flatMap((page) => page.validators)].filter(
        (validator) => !optimisticDeletedValidatorPks.includes(add0x(validator.public_key))
      );

      return validators;
    }
  });

  const responseValidators = infiniteQuery.data?.pages.flatMap((page) => page.validators) ?? [];
  const validators = useAppSelector((state) =>
    removeOptimisticDeletedValidators(state, {
      clusterId: cluster?.clusterId ?? '',
      validators: responseValidators
    })
  );

  return {
    infiniteQuery,
    responseValidators,
    validators,
    fetchAll
  };
};
