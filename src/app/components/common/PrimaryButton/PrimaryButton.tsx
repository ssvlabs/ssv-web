import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './PrimaryButton.styles';
import Spinner from '~app/components/common/Spinner';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';

type Props = {
    text: string,
    disable?: boolean,
    dataTestId?: string
    submitFunction: any,
    withLoader?: boolean,
    wrapperClass?: string,
    withVerifyConnection?: boolean
};

const PrimaryButton = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, submitFunction, disable, withLoader = true, wrapperClass, dataTestId, withVerifyConnection } = props;

    useEffect(() => {
        const listener = async (event: any) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                // event.preventDefault();
                if (!disable && !applicationStore.isLoading) {
                    await submit();
                }
            }
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [applicationStore.isLoading, disable]);

    const submit = async () => {
        if (walletStore.isWrongNetwork) notificationsStore.showMessage('Please change network to Goerli', 'error');
        if (withVerifyConnection && !walletStore.connected) {
            await walletStore.connect();
        }
        await submitFunction();
    };

    return (
      <Grid container>
        <Button
          onClick={submit}
          data-testid={dataTestId}
          disabled={disable || applicationStore.isLoading}
          className={`${applicationStore.isLoading ? classes.Loading : classes.PrimaryButton} ${wrapperClass}`}
        >
          {(applicationStore.isLoading && withLoader) && <Spinner />}
          {text}
        </Button>
      </Grid>
    );
};

export default observer(PrimaryButton);
