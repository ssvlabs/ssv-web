import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
import { getContractByName } from '~root/wagmi/utils';

type Mutation = UseMutationResult<
  boolean,
  Error,
  {
    operatorIds: number[];
    isPrivate: boolean;
  },
  unknown
>;

export const useSetOperatorVisibility = () => {
  const executor = useTransactionExecutor();

  return useMutation({
    mutationFn: ({ isPrivate, operatorIds }) => {
      const contract = getContractByName(EContractName.SETTER);
      return executor({
        contractMethod: isPrivate ? contract.setOperatorsPrivateUnchecked : contract.setOperatorsPublicUnchecked,
        payload: [operatorIds],
        onConfirmed: () => {}
        // prevState: operator?.is_private,
        // getterTransactionState: async () => getOperator(operatorIds[0]).then((res) => res.is_private)
      });
    }
  }) satisfies Mutation;
};
