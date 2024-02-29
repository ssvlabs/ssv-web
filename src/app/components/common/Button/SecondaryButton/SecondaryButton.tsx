import React from 'react';
import { observer } from 'mobx-react';
import Button from '@mui/material/Button';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/components/common/Spinner';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { useStyles } from './SecondaryButton.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';

type Props = {
    children: string | JSX.Element,
    disable?: boolean,
    className?: string,
    submitFunction: any,
    dataTestId?: string,
    noCamelCase?: boolean,
    withoutLoader?: boolean,
    withVerifyConnection?: boolean
    withoutBackgroundColor?: boolean
};

const SecondaryButton = (props: Props) => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const { children, submitFunction, className, disable, withoutLoader, dataTestId, noCamelCase, withVerifyConnection, withoutBackgroundColor } = props;
    const classes = useStyles({ noCamelCase, withoutBackgroundColor });
    const isLoading = useAppSelector(getIsLoading);

    // TODO: reduce to single component for wallet connection
    const submit = async () => {
        // if (walletStore.isWrongNetwork) {
        //     notificationsStore.showMessage('Please change network to Goerli', 'error');
        //     return;
        // }
        if (withVerifyConnection && !walletStore.wallet) {
            // await walletStore.connect();
        }
        submitFunction();
    };

    return (
      <Button
        type="submit"
        onClick={submit}
        data-testid={dataTestId}
        className={className ?? classes.SecondaryButton}
        disabled={disable || isLoading}
      >
        {isLoading && !withoutLoader && <Spinner />}
        {children}
      </Button>
    );
};

export default observer(SecondaryButton);
