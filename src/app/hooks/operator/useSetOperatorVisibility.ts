import { useMutation } from '@tanstack/react-query';
import { EContractName } from '~app/model/contracts.model';
import { transactionExecutor } from '~root/services/transaction.service';
import { getContractByName } from '~root/wagmi/utils';

export const useSetOperatorVisibility = () => {
  return useMutation({
    mutationFn: async (status: 'public' | 'private') => {
      switch (status) {
        case 'public': {
          const contract = getContractByName(EContractName.SETTER);
          return transactionExecutor({
            contractMethod: contract.setOperatorsPrivateUnchecked,
            payload: []
          });
          break;
        }
        case 'private':
          break;
      }
    }
  });
};
