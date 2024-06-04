import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
import { getContractByName } from '~root/services/contracts.service';
import { ContractMethod } from '~root/wagmi/utils';

type MutationType = 'add' | 'delete';

type Mutation = UseMutationResult<
  boolean,
  Error,
  {
    mode: MutationType;
    operatorIds: number[];
    addresses: string[];
  },
  unknown
>;

const methods: Record<MutationType, ContractMethod> = {
  add: getContractByName(EContractName.SETTER).setOperatorMultipleWhitelists,
  delete: getContractByName(EContractName.SETTER).removeOperatorMultipleWhitelists
};

export const useSetOperatorMultipleWhitelists = () => {
  const executor = useTransactionExecutor();

  return useMutation({
    mutationFn: ({ mode, operatorIds, addresses }) => {
      return executor({
        contractMethod: methods[mode],
        payload: [operatorIds, addresses]
      });
    }
  }) satisfies Mutation;
};
