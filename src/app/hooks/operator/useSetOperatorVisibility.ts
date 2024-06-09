import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useTransactionExecutor } from '~app/hooks/useTransactionExecutor';
import { EContractName } from '~app/model/contracts.model';
import { getOperator } from '~root/services/operator.service';
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
        getterTransactionState: () => getOperator(operatorIds[0]).then((o) => o.is_private),
        prevState: isPrivate
      });
    }
  }) satisfies Mutation;
};
