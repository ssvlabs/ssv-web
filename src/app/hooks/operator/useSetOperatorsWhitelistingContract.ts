import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
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
  const executor = useTransactionExecutor();

  return useMutation({
    mutationFn: ({ type, operatorIds, contractAddress }) => {
      const isSet = type === 'set';
      return executor({
        contractMethod: methods[type],
        payload: isSet ? [operatorIds, contractAddress] : [operatorIds],
        onConfirmed: () => {}
        // prevState: operator?.whitelisting_contract,
        // getterTransactionState: async () => getOperator(operatorIds[0]).then((res) => res.whitelisting_contract)
      });
    }
  }) satisfies Mutation;
};
