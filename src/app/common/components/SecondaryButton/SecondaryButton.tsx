import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './SecondaryButton.styles';

type Props = {
    text: string,
    onClick: any,
    dataTestId?: string,
    withVerifyConnection?: boolean
};

const SecondaryButton = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, onClick, dataTestId, withVerifyConnection } = props;

    const submit = async () => {
        if (walletStore.isWrongNetwork) {
            notificationsStore.showMessage('Please change network to Goerli', 'error');
            return;
        }
        if (withVerifyConnection && !walletStore.connected) {
            await walletStore.connect();
        }
        onClick();
    };

    return (
      <Button
        className={classes.SecondaryButton}
        data-testid={dataTestId}
        onClick={submit}
        >
        {text}
      </Button>
    );
};

export default observer(SecondaryButton);
