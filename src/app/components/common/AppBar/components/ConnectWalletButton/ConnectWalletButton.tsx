import Grid from '@mui/material/Grid';
import { ConnectedChain, WalletState } from '@web3-onboard/core';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import config from '~app/common/config';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ConnectWalletDialog from '~app/components/common/ConnectWalletDialog';
import { METAMASK_LABEL } from '~app/constants/constants';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { setIsShowSsvLoader, setIsShowWalletPopup } from '~app/redux/appState.slice';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import { checkIfWalletIsContractAction, getAccountAddress, getWalletLabel, setConnectedNetwork, setWallet } from '~app/redux/wallet.slice';
import { getNetworkInfoIndexByNetworkId, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { initContracts } from '~root/services/contracts.service';
import notifyService from '~root/services/notify.service';
import { useStyles } from './ConnectWalletButton.styles';
import { useQuery } from '@tanstack/react-query';
import { getFromLocalStorageByKey } from '~root/providers/localStorage.provider';
import { useEthersProvider } from '~app/hooks/useEthersProvider';
import { useEthersSigner } from '~app/hooks/useEthersSigner';

const ConnectWalletButton = () => {
  const [open, setOpen] = useState(false);

  const account = useAccount();
  const result = useWalletClient();
  console.log('result:', result);

  const data = useQuery({
    queryKey: ['provider'],
    queryFn: () =>
      account.connector?.getProvider({
        chainId: account.chainId
      }),
    enabled: account.isConnected
  });
  console.log('data:', data);

  const [{ wallet, connecting }, connect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();
  const dispatch = useAppDispatch();
  const storedWalletLabel = useAppSelector(getWalletLabel);
  const storedWalletAddress = useAppSelector(getAccountAddress);
  const classes = useStyles({ walletConnected: !!storedWalletAddress });
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const provv = useEthersProvider();
  console.log('provv:', provv);
  const signer = useEthersSigner();
  console.log('signer:', signer);

  const initiateWallet = async ({ connectedWallet, chain }: { connectedWallet: WalletState; chain: ConnectedChain }) => {
    dispatch(setIsShowSsvLoader(true));
    dispatch(setWallet({ label: connectedWallet.label, address: connectedWallet.accounts[0].address }));
    wallet && (await dispatch(checkIfWalletIsContractAction(wallet.provider)));
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
    if (!account.isConnecting && account.isConnected) {
      // initiateWallet({
      //   connectedWallet: {
      //     accounts: account.addresses
      //   },
      //   chain: connectedChain
      // });
    }
  }, []);

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
    return open ? setOpen(false) : setOpen(true);
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
  } else {
    icon = '/images/wallets/metamask.svg';
  }

  const walletDisplayName = (address: string) => `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <>
      <ConnectWalletDialog open={open} onOpenChange={setOpen} />
      <Grid item container className={classes.ConnectWalletWrapper} onClick={onClick}>
        {!storedWalletAddress && <Grid item>Connect Wallet</Grid>}
        {storedWalletAddress && (
          <Grid item container>
            <Grid item>
              <img className={classes.WalletImage} src={icon} alt={`Connected to ${storedWalletLabel}`} />
            </Grid>
            <Grid item className={classes.WalletAddress}>
              {walletDisplayName(storedWalletAddress)}
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};
export default ConnectWalletButton;
