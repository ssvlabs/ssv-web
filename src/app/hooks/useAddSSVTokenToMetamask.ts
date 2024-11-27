import { useMutation } from '@tanstack/react-query';
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
            address: '0xad45A78180961079BFaeEe349704F411dfF947C6',
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
