import { useCallback } from 'react';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setOptimisticOperator } from '~app/redux/account.slice';

export const useSetOptimisticOperator = () => {
  const dispatch = useAppDispatch();
  return useCallback((...args: Parameters<typeof setOptimisticOperator>) => dispatch(setOptimisticOperator(...args)), [dispatch]);
};
