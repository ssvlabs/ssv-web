import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/common/components/Spinner';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './SecondaryButton.styles';

type Props = {
    text: string,
    disable?: boolean,
    submitFunction: any,
    dataTestId?: string,
    withVerifyConnection?: boolean
};

const SecondaryButton = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, submitFunction, disable, dataTestId, withVerifyConnection } = props;

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
        type="submit"
        onClick={submit}
        data-testid={dataTestId}
        className={classes.SecondaryButton}
        disabled={disable || applicationStore.isLoading}
      >
        {applicationStore.isLoading && <Spinner />}
        {text}
      </Button>
    );
};

export default observer(SecondaryButton);
