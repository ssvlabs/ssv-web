import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

export const useOperatorPermissions = (_operatorId?: number) => {
  const selectedOperator = useAppSelector(getSelectedOperator);
  const operatorId = _operatorId || selectedOperator.id;

  const query = useQuery({
    queryKey: ['operatorPermissions', operatorId],
    queryFn: async () => {
      const addresses = [
        '0x32Be343B94f860124dC4fEe278FDCBD38C102D88',
        '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        '0x53d284357ec70cE289D6D64134DfAc8E511c8a3D',
        '0x66f820a414680B5bcda5eECA5dea238543F42054',
        '0x267be1c1D684F78cb4F6a176C4911b741E4Ffdc0'
      ] as `0x${string}`[];
      return {
        isPrivate: true,
        addresses,
        externalContract: ''
      };
    },
    enabled: Boolean(operatorId)
  });

  const addressesMap = useMemo(
    () =>
      query.data?.addresses.reduce(
        (acc, address) => {
          acc[address] = true;
          return acc;
        },
        {} as Record<string, boolean>
      ) || {},
    [query.data?.addresses]
  );

  return {
    query,
    ...query.data,
    addressesMap
  };
};
