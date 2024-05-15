import { useEffect, useState } from 'react';
import { setIsShowSsvLoader } from '~app/redux/appState.slice';
import { getWalletBalance } from '~root/services/tokenContract.service';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';

const useFetchWalletBalance = () => {
  const [walletSsvBalance, setWalletSsvBalance] = useState(0);
  const accountAddress = useAppSelector(getAccountAddress);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchWalletBalance = async () => {
      dispatch(setIsShowSsvLoader(true));
      const balance = await getWalletBalance({ accountAddress });
      setWalletSsvBalance(balance);
      dispatch(setIsShowSsvLoader(false));
    };
    fetchWalletBalance();
  }, [accountAddress, dispatch]);

  return { walletSsvBalance };
};

export default useFetchWalletBalance;
