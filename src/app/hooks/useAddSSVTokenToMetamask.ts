import { useMutation } from '@tanstack/react-query';
import config from '~app/common/config';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setMessageAndSeverity } from '~app/redux/notifications.slice';

export const useAddSSVTokenToMetamask = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: config.CONTRACTS.SSV_TOKEN.ADDRESS,
            symbol: 'SSV',
            decimals: 18
          }
        }
      });
    },
    onSuccess: () => {
      dispatch(setMessageAndSeverity({ message: 'Added SSV token to the wallet!', severity: 'success' }));
    },
    onError: (error: any) => {
      dispatch(setMessageAndSeverity({ message: `Failed to add SSV token to the wallet: ${error.message}`, severity: 'error' }));
    }
  });
};
