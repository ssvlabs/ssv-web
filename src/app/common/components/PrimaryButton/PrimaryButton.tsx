import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { useStyles } from './PrimaryButton.styles';

type Props = {
    text: string,
    onClick: any,
    disable?: boolean,
    dataTestId?: string,
    withVerifyConnection?: boolean
};

const PrimaryButton = (props: Props) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;
    const { text, onClick, disable, dataTestId, withVerifyConnection } = props;
    const [inProgress, setInProgress] = useState(false);

    useEffect(() => {
        const listener = async (event: any) => {
            if (event.code === 'Enter' || event.code === 'NumpadEnter') {
                // event.preventDefault();
                if (!inProgress) {
                    setInProgress(true);
                    await onClick();
                }
            }
        };
        document.addEventListener('keydown', listener);
        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [inProgress]);

    const submit = async () => {
        if (withVerifyConnection && !walletStore.connected) {
            await walletStore.connect();
        }
        onClick();
    };

    return (
      <Grid container item className={classes.Wrapper}>
        <Button
          className={classes.PrimaryButton}
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
