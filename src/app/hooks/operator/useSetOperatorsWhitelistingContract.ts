import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useAppSelector } from '~app/hooks/redux.hook';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
import { getSelectedOperator } from '~app/redux/account.slice';
import { getOperator } from '~root/services/operator.service';
import { ContractMethod, getContractByName } from '~root/wagmi/utils';

type MutationType = 'set' | 'remove';

type Mutation = UseMutationResult<
  boolean,
  Error,
  {
    type: MutationType;
    operatorIds: number[];
    contractAddress: string;
  },
  unknown
>;

const methods: Record<MutationType, ContractMethod> = {
  set: getContractByName(EContractName.SETTER).setOperatorsWhitelistingContract,
  remove: getContractByName(EContractName.SETTER).removeOperatorsWhitelistingContract
};

export const useSetOperatorsWhitelistingContract = () => {
  const operator = useAppSelector(getSelectedOperator);
  const executor = useTransactionExecutor();

  return useMutation({
    mutationFn: ({ type, operatorIds, contractAddress }) => {
      const isSet = type === 'set';
      return executor({
        contractMethod: methods[type],
        payload: isSet ? [operatorIds, contractAddress] : [operatorIds],
        prevState: operator?.whitelisting_contract,
        getterTransactionState: async () => getOperator(operatorIds[0]).then((res) => res.whitelisting_contract)
      });
    }
  }) satisfies Mutation;
};
