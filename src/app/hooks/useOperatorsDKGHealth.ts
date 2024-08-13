import { useQuery } from '@tanstack/react-query';
import { IOperator } from '~app/model/operator.model';
import { checkOperatorDKGHealth } from '~root/services/operator.service';

type Props = {
  operators: IOperator[];
  enabled: boolean;
};

export const useOperatorsDKGHealth = ({ operators, enabled }: Props) => {
  return useQuery({
    gcTime: 0,
    staleTime: 0,
    queryKey: ['checkOperatorsDKGHealth', operators.map(({ id }) => id)],
    queryFn: async () => {
      return await Promise.all(
        operators.map(async ({ id, dkg_address }) => {
          return {
            id,
            isHealthy: await checkOperatorDKGHealth(dkg_address)
              .then(({ data }) => Boolean(data))
              .catch(() => false)
          };
        })
      );
    },
    enabled
  });
};
