import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './SecondaryButton.styles';

type Props = {
    text: string,
    disable?: boolean,
    className?: string,
    dataTestId?: string,
    submitFunction: any,
    withVerifyConnection?: boolean
};

const SecondaryButton = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, submitFunction, disable, className, dataTestId, withVerifyConnection } = props;

    const submit = async () => {
        if (walletStore.isWrongNetwork) {
            notificationsStore.showMessage('Please change network to Goerli', 'error');
            return;
        }
        if (withVerifyConnection && !walletStore.connected) {
            await walletStore.connect();
        }
        submitFunction();
    };

    return (
      <Button
        onClick={submit}
        disabled={disable}
        data-testid={dataTestId}
        className={className ?? classes.SecondaryButton}
      >
        {text}
      </Button>
    );
};

export default observer(SecondaryButton);
