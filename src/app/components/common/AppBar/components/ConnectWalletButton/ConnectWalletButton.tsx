import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './ConnectWalletButton.styles';
import { setIsShowSsvLoader, setIsShowWalletPopup } from '~app/redux/appState.slice';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import notifyService from '~root/services/notify.service';
import { getNetworkInfoIndexByNetworkId, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { checkIfWalletIsContractAction, getAccountAddress, getWalletLabel, setConnectedNetwork, setWallet } from '~app/redux/wallet.slice';
import { initContracts } from '~root/services/contracts.service';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { METAMASK_LABEL } from '~app/constants/constants';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import config from '~app/common/config';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider';

const ConnectWalletButton = () => {
  const [{  wallet, connecting }, connect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();
  const dispatch = useAppDispatch();
  const storedWalletLabel = useAppSelector(getWalletLabel);
  const storedWalletAddress = useAppSelector(getAccountAddress);
  const classes = useStyles({ walletConnected: !!storedWalletAddress });
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const initiateWallet = async ({ connectedWallet, chain }: { connectedWallet: WalletState; chain: ConnectedChain }) => {
    dispatch(setIsShowSsvLoader(true));
    dispatch(setWallet({ label: connectedWallet.label, address: connectedWallet.accounts[0].address }));
    wallet && await dispatch(checkIfWalletIsContractAction(wallet.provider));
    notifyService.init(chain.id);
    const index = getNetworkInfoIndexByNetworkId(Number(chain.id));
    dispatch(setConnectedNetwork(index));
    initContracts({ provider: connectedWallet.provider, network: getStoredNetwork(), shouldUseRpcUrl: connectedWallet.label !== METAMASK_LABEL });
    await ssvStore.initUser();
    await operatorStore.initUser();
    await myAccountStore.getOwnerAddressOperators({});
    await myAccountStore.getOwnerAddressClusters({});
    if (myAccountStore.ownerAddressClusters?.length) {
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD));
    } else if (myAccountStore.ownerAddressOperators?.length) {
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD));
    } else {
      dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
    }
    await operatorStore.updateOperatorValidatorsLimit();
    dispatch(setIsShowSsvLoader(false));
  };

  useEffect(() => {
    if (storedWalletAddress && wallet && storedWalletAddress !== wallet.accounts[0].address) {
      window.location.reload();
    }
    if (wallet && connectedChain && !connecting) {
      initiateWallet({ connectedWallet: wallet, chain: connectedChain });
    }
    if (!getFromLocalStorageByKey('onboard.js:last_connected_wallet')) {
      dispatch(setIsShowSsvLoader(false));
    }
  }, [wallet, connectedChain, connecting]);

  const onClick = async () => {
    if (storedWalletAddress) {
      dispatch(setIsShowWalletPopup(true));
    } else {
      await connect();
    }
  };

  let icon;
  if (storedWalletLabel === 'Ledger') {
    icon = '/images/wallets/ledger.svg';
  } else if (storedWalletLabel === 'Trezor') {
    icon = '/images/wallets/trezor.svg';
  } else if (storedWalletLabel === 'WalletConnect') {
    icon = '/images/wallets/walletconnect.svg';
  } else if (storedWalletLabel === 'Ledger') {
  } else {
    icon = '/images/wallets/metamask.svg';
  }

  const walletDisplayName = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <Grid item container className={classes.ConnectWalletWrapper} onClick={onClick}>
      {!storedWalletAddress && <Grid item>Connect Wallet</Grid>}
      {storedWalletAddress && (
        <Grid item container>
          <Grid item><img className={classes.WalletImage} src={icon}
                          alt={`Connected to ${storedWalletLabel}`}/></Grid>
          <Grid item className={classes.WalletAddress}>{walletDisplayName(storedWalletAddress)}</Grid>
        </Grid>
      )}
    </Grid>
  );
};
export default ConnectWalletButton;
