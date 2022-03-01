import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/common/components/Spinner';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './PrimaryButton.styles';

type Props = {
    text: string,
    onClick: any,
    disable?: boolean,
    dataTestId?: string,
    wrapperClass?: string,
    withVerifyConnection?: boolean
};

const PrimaryButton = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, onClick, disable, wrapperClass, dataTestId, withVerifyConnection } = props;
    
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
        await onClick();
    };

    return (
      <Grid container item>
        <Button
          className={`${applicationStore.isLoading ? classes.Loading : classes.PrimaryButton} ${wrapperClass}`}
          data-testid={dataTestId}
          disabled={disable || applicationStore.isLoading}
          onClick={submit}
        >
          {applicationStore.isLoading && <Spinner />}
          {text}
        </Button>
      </Grid>
    );
};

export default observer(PrimaryButton);
