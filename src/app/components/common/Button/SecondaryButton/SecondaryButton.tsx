import React from 'react';
import { observer } from 'mobx-react';
import Button from '@mui/material/Button';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/components/common/Spinner';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './SecondaryButton.styles';

type Props = {
    text: string,
    disable?: boolean,
    className?: string,
    submitFunction: any,
    dataTestId?: string,
    noCamelCase?: boolean,
    withoutLoader?: boolean,
    withVerifyConnection?: boolean
};

const SecondaryButton = (props: Props) => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, submitFunction, className, disable, withoutLoader, dataTestId, noCamelCase, withVerifyConnection } = props;
    const classes = useStyles({ noCamelCase });

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
        className={className ?? classes.SecondaryButton}
        disabled={disable || applicationStore.isLoading}
      >
        {applicationStore.isLoading && !withoutLoader && <Spinner />}
        {text}
      </Button>
    );
};

export default observer(SecondaryButton);
