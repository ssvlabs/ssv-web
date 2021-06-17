import React from 'react';
import { observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import { useStores } from '~app/hooks/useStores';
import { translations } from '~app/common/config';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';

type ButtonParams = {
    text: string,
    disable: boolean,
    onClick: any,
    testId: string,
    style: any
};

const CTAButton = ({ testId, disable, style, onClick, text }: ButtonParams) => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;

    const checkWalletConnected = async (fn: () => void) => {
        if (!walletStore.connected) await walletStore.connect();
        if (walletStore.isWrongNetwork) {
            walletStore.alertNetworkError();
        } else {
            fn();
        }
    };

    return (
      <Button
        data-testid={testId}
        disabled={disable}
        variant="contained"
        color="primary"
        style={style}
        onClick={async () => {
            await checkWalletConnected(onClick);
        }}
      >
        {walletStore.connected ? text : translations.CTA_BUTTON.CONNECT}
      </Button>
    );
};

export default observer(CTAButton);