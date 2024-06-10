import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
import { getOperator } from '~root/services/operator.service';
import { ContractMethod, getContractByName } from '~root/wagmi/utils';

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
  add: getContractByName(EContractName.SETTER).setOperatosWhitelists,
  delete: getContractByName(EContractName.SETTER).removeOperatorsWhitelists
};

export const useSetOperatorMultipleWhitelists = () => {
  const executor = useTransactionExecutor();

  return useMutation({
    mutationFn: ({ mode, operatorIds, addresses }) => {
      return executor({
        contractMethod: methods[mode],
        payload: [operatorIds, addresses],
        getterTransactionState: () => getOperator(operatorIds[0]).then((o) => o.whitelist_addresses),
        prevState: addresses
      });
    }
  }) satisfies Mutation;
};
