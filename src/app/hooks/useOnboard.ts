import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { InitOptions, OnboardAPI } from '@web3-onboard/core';
import { init, useConnectWallet, useSetChain } from '@web3-onboard/react';

import { useStores } from '~app/hooks/useStores';
import Wallet from '~app/common/stores/Abstracts/Wallet';
import { initOnboardOptions } from '~lib/utils/onboardHelper';


export interface SendTransactionProps {
  toAddress: string;
  value: any;
  gasPrice?: any;
  gasLimit?: any;
}

const onboardInstance = init(initOnboardOptions() as InitOptions);

export const useOnboard = () => {
  const stores = useStores();
  const walletStore: Wallet = stores.Wallet;
  const [{ wallet, connecting }] = useConnectWallet();
  const [{ chains, connectedChain }, setChain] = useSetChain();
  const [web3Onboard, setWeb3Onboard] = useState<OnboardAPI | null>(null);

  // Keep provider unchanged for wallet
  const provider = useMemo(() => {
    if (!wallet?.provider) {
      return null;
    }
    return new ethers.providers.Web3Provider(wallet.provider, 'any');
  }, [wallet?.provider]);

  useEffect(() => {
    setWeb3Onboard(onboardInstance);
  }, []);

  useEffect(() => {
    if (connectedChain && wallet?.accounts[0]) {
      walletStore.initWallet(wallet, connectedChain);
    }
    if (web3Onboard && !wallet?.accounts[0]) {
      walletStore.initWallet(null, null);
    }
  }, [web3Onboard, wallet?.accounts[0], connectedChain?.id]);

  return {
    setChain,
    web3Onboard,
    wallet,
    provider,
    connecting,
  };
};
