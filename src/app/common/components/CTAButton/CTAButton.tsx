import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { useStyles } from '~app/common/components/CTAButton/CTAButton.styles';

type ButtonParams = {
    text: string,
    disable: boolean,
    onClick?: any,
    testId: string,
};

const CTAButton = ({ testId, disable, onClick, text }: ButtonParams) => {
    const stores = useStores();
    const classes = useStyles();
    const walletStore: WalletStore = stores.Wallet;

    const checkWalletConnected = async () => {
        if (!walletStore.connected) await walletStore.connect();
        if (walletStore.isWrongNetwork) {
            walletStore.alertNetworkError();
        } else if (onClick) onClick();
    };

    return (
      <Button
        data-testid={testId}
        disabled={disable}
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={checkWalletConnected}
      >
        {walletStore.connected ? text : translations.CTA_BUTTON.CONNECT}
      </Button>
    );
};

export default observer(CTAButton);