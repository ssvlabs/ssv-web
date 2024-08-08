import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { TxProps, transactionExecutor } from '~root/services/transaction.service';

export const useTransactionExecutor = () => {
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);

  return useCallback(
    (args: Omit<TxProps, 'isContractWallet' | 'dispatch'>) => {
      return transactionExecutor({ ...args, isContractWallet, dispatch, shouldThrowError: true });
    },
    [dispatch, isContractWallet]
  );
};
