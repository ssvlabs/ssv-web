import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import NotificationsStore from '~app/common/stores/Notifications.store';
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
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, onClick, disable, wrapperClass, dataTestId, withVerifyConnection } = props;
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        const listener = async (event: any) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                // event.preventDefault();
                if (!disable && !inProgress) {
                    setInProgress(true);
                    await onClick();
                    setInProgress(false);
                }
            }
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [inProgress, disable]);

    const submit = async () => {
        if (walletStore.isWrongNetwork) notificationsStore.showMessage('Please change network to Goerli', 'error');
        if (withVerifyConnection && !walletStore.connected) {
            await walletStore.connect();
        }
        onClick();
    };

    return (
      <Grid container item>
        <Button
          className={`${classes.PrimaryButton} ${wrapperClass}`}
          data-testid={dataTestId}
          disabled={disable || inProgress}
          onClick={submit}
        >
          {text}
        </Button>
      </Grid>
    );
};

export default observer(PrimaryButton);
