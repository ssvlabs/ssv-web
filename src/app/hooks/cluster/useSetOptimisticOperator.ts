import { useCallback } from 'react';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setOptimisticCluster } from '~app/redux/account.slice';

export const useSetOptimisticCluster = () => {
  const dispatch = useAppDispatch();
  return useCallback((...args: Parameters<typeof setOptimisticCluster>) => dispatch(setOptimisticCluster(...args)), [dispatch]);
};
