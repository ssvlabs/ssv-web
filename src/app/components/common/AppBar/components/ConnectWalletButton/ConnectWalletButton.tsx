import Grid from '@mui/material/Grid';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { useEffect } from 'react';
import { useAccount, useAccountEffect } from 'wagmi';
import config from '~app/common/config';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import ConnectWalletDialog from '~app/components/common/ConnectWalletDialog';
import { METAMASK_LABEL } from '~app/constants/constants';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useEthersProvider } from '~app/hooks/useEthersProvider';
import { useStores } from '~app/hooks/useStores';
import { getIsShowConnectWallet, setIsShowConnectWallet, setIsShowSsvLoader, setIsShowWalletPopup } from '~app/redux/appState.slice';
import { setStrategyRedirect } from '~app/redux/navigation.slice';
import { checkIfWalletIsContractAction, getAccountAddress, getWalletLabel, setConnectedNetwork, setWallet } from '~app/redux/wallet.slice';
import { getNetworkInfoIndexByNetworkId, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { initContracts } from '~root/services/contracts.service';
import notifyService from '~root/services/notify.service';
import { useStyles } from './ConnectWalletButton.styles';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const ConnectWalletButton = () => {
  useAccountEffect({
    

  })
  return <ConnectButton />; 
  const dispatch = useAppDispatch();

  const open = useAppSelector(getIsShowConnectWallet);
  const setOpen = (open: boolean) => dispatch(setIsShowConnectWallet(open));

  const account = useAccount();

  const [{ wallet, connecting }, connect] = useConnectWallet();
  const [{ connectedChain }] = useSetChain();
  const storedWalletLabel = useAppSelector(getWalletLabel);
  const storedWalletAddress = useAppSelector(getAccountAddress);
  const classes = useStyles({ walletConnected: !!storedWalletAddress });
  const stores = useStores();
  const ssvStore: SsvStore = stores.SSV;
  const operatorStore: OperatorStore = stores.Operator;
  const myAccountStore: MyAccountStore = stores.MyAccount;

  const provider = useEthersProvider();

  type InitProps = {
    walletAddress: string;
    connectorName: string;
    chainId: number;
    provider: ethers.providers.JsonRpcProvider;
  };

  const initiateWallet = async ({ walletAddress, chainId, connectorName, provider }: InitProps) => {
    dispatch(setIsShowSsvLoader(true));
    console.log('initiating wallet ');
    dispatch(setWallet({ label: connectorName, address: walletAddress }));
    wallet && (await dispatch(checkIfWalletIsContractAction(provider)));
    notifyService.init(chainId.toString());
    const index = getNetworkInfoIndexByNetworkId(Number(chainId));
    dispatch(setConnectedNetwork(index));
    initContracts({ provider: provider as any, network: getStoredNetwork(), shouldUseRpcUrl: connectorName !== METAMASK_LABEL });
    await ssvStore.initUser();
    await operatorStore.initUser();
    await myAccountStore.getOwnerAddressOperators({});
    await myAccountStore.getOwnerAddressClusters({});
    if (myAccountStore.ownerAddressClusters?.length) {
      console.log('were here');
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.CLUSTER_DASHBOARD));
    } else if (myAccountStore.ownerAddressOperators?.length) {
      console.log('were here 2');
      dispatch(setStrategyRedirect(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD));
    } else {
      console.log('were in root');

      dispatch(setStrategyRedirect(config.routes.SSV.ROOT));
    }
    await operatorStore.updateOperatorValidatorsLimit();
    dispatch(setIsShowSsvLoader(false));
  };

  useEffect(() => {
    if (provider && account.isConnected && account.chainId) {
      dispatch(setIsShowSsvLoader(true));
      console.log('initiateWallet');
      initiateWallet({
        chainId: account.chainId!,
        connectorName: account.connector?.name ?? '',
        provider: provider as ethers.providers.JsonRpcProvider,
        walletAddress: account.address as string
      });
    }
  }, [account.address, account.chainId, account.connector?.name, account.isConnected, provider]);

  useEffect(() => {
    if (storedWalletAddress && wallet && storedWalletAddress !== wallet.accounts[0].address) {
      window.location.reload();
    }
  }, [wallet, connectedChain, connecting]);

  const onClick = async () => {
    if (account.isConnected) {
      dispatch(setIsShowWalletPopup(true));
    } else {
      return open ? setOpen(false) : setOpen(true);
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
