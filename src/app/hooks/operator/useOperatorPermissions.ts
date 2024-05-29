import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getSelectedOperator } from '~app/redux/account.slice';

export const useOperatorPermissions = (_operatorId?: number) => {
  const selectedOperator = useAppSelector(getSelectedOperator);
  const operatorId = _operatorId || selectedOperator.id;

  return useQuery({
    queryKey: ['operatorPermissions', operatorId],
    queryFn: async () => {
      return {
        visibility: 'public' as 'public' | 'private',
        addresses: [] as string[],
        externalContract: ''
      };
    },
    enabled: Boolean(operatorId)
  });
};
