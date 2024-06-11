import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
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
  const executor = useTransactionExecutor();

  return useMutation({
    mutationFn: ({ type, operatorIds, contractAddress }) => {
      return executor({
        contractMethod: methods[type],
        payload: [operatorIds, contractAddress],
        getterTransactionState: () => getOperator(operatorIds[0]).then((o) => o.whitelisting_contract),
        prevState: contractAddress
      });
    }
  }) satisfies Mutation;
};