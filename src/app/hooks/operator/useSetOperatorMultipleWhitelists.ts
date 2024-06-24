import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
import { getSelectedOperator } from '~app/redux/account.slice';
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
  const operator = useAppSelector(getSelectedOperator);
  const executor = useTransactionExecutor();

  return useMutation({
    mutationFn: ({ mode, operatorIds, addresses }) => {
      return executor({
        contractMethod: methods[mode],
        payload: [operatorIds, addresses],
        prevState: operator?.whitelist_addresses?.toSorted(),
        getterTransactionState: async () => getOperator(operatorIds[0]).then((res) => res.whitelist_addresses?.toSorted())
      });
    }
  }) satisfies Mutation;
};
