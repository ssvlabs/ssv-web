import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { getImage } from '~lib/utils/filePath';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './ConnectWalletButton.styles';

type ConnectWalletButtonProps = {
    buttonComponent?: any;
    buttonText?: string;
};

const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
    const { buttonComponent, buttonText } = props;
    buttonComponent;
    buttonText;
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const classes = useStyles({ walletConnected: walletStore.connected });
    const applicationStore: ApplicationStore = stores.Application;

    const onClick = () => {
      if (walletStore.connected) {
        return applicationStore.showWalletPopUp(true);
      }
      return walletStore.connect();
    };

    let icon;
    if (walletStore.wallet?.name) {
        switch (walletStore.wallet.name) {
            case 'Ledger':
                icon = getImage('wallets/metamask.svg');
                break;
            case 'Trezor':
                icon = getImage('wallets/metamask.svg');
                break;
            default:
                icon = getImage('wallets/metamask.svg');
                break;
        }
    }

    const walletDisplayName = (address: string) => {
      if (!address) {
        return '';
      }
      return `${address.substr(0, 6)}...${address.substr(address.length - 4, 4)}`;
    };

    return (
      <Grid container className={classes.ConnectWalletWrapper} onClick={onClick}>
        {!walletStore.connected && <Grid item>Connect Wallet</Grid>}
        {walletStore.connected && (
        <Grid item container>
          <Grid item><img className={classes.WalletImage} src={icon} alt={`Connected to ${walletStore.wallet.name}`} /></Grid>
          <Grid item className={classes.WalletAddress}>{walletDisplayName(walletStore.accountAddress)}</Grid>
        </Grid>
        )}
      </Grid>
    );
};
export default observer(ConnectWalletButton);
