import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useStores } from '~app/hooks/useStores';
import Spinner from '~app/components/common/Spinner';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import NotificationsStore from '~app/common/stores/applications/SsvWeb/Notifications.store';
import { useStyles } from './PrimaryButton.styles';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getIsLoading } from '~app/redux/appState.slice';

type Props = {
    text: string;
    disable?: boolean;
    isLoading?: boolean;
    submitFunction: any;
    dataTestId?: string;
    wrapperClass?: string;
    errorButton?: boolean;
    withoutLoader?: boolean;
    withVerifyConnection?: boolean;
};

const PrimaryButton = (props: Props) => {
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const notificationsStore: NotificationsStore = stores.Notifications;
    const { text, submitFunction, disable, wrapperClass, dataTestId, errorButton, withoutLoader, isLoading, withVerifyConnection } = props;
    const classes = useStyles({ errorButton });
    const appStateIsLoading = useAppSelector(getIsLoading);


    // useEffect(() => {
    //     const callback = (event: any) => {
    //         if (event.code === 'Enter' || event.code === 'NumpadEnter') {
    //             if (!disable && !applicationStore.isLoading) {
    //                 submitHandler();
    //             }
    //         }
    //     };
    //
    //     document.addEventListener('keydown', callback);
    //     return () => {
    //         document.removeEventListener('keydown', callback);
    //     };
    // }, [applicationStore.isLoading, disable, submitFunction]);

    // TODO: reduce to single component for wallet connection
    const submitHandler = async () => {
        if (walletStore.isWrongNetwork) notificationsStore.showMessage('Please change network to Goerli', 'error');
        if (withVerifyConnection && !walletStore.wallet) {
            // await walletStore.connect();
        }
        await submitFunction();
    };

    const showLoaderCondition = appStateIsLoading || isLoading && !withoutLoader;
    const isLoadingClassCondition = appStateIsLoading || isLoading;
    const isDisabledCondition = disable || appStateIsLoading;

    return (
        <Grid container item>
            <Button
                type="submit"
                onClick={submitHandler}
                data-testid={dataTestId}
                disabled={isDisabledCondition}
                className={`${isLoadingClassCondition ? classes.Loading : classes.PrimaryButton} ${wrapperClass}`}
            >
                {showLoaderCondition && <Spinner errorSpinner={errorButton}/>}
                {text}
            </Button>
        </Grid>
    );
};

export default observer(PrimaryButton);
