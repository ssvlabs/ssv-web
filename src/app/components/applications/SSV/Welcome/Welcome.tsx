import React from 'react';
import Grid from '@mui/material/Grid';
import { observer } from 'mobx-react';
import config from '~app/common/config';
import { useNavigate } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import Deprecation from '~app/components/common/Depreciation';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import { useStyles } from '~app/components/applications/SSV/Welcome/Welcome.styles';

const Welcome = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;

    const connectToWallet = () => {
        if (walletStore.connected) {
            return applicationStore.showWalletPopUp(true);
        }
        return walletStore.connect();
    };

    return (
        <Grid style={{ marginTop: 28 }}>
            <Deprecation/>
            <BorderScreen
                withoutNavigation
                body={[
                    <Grid container>
                        <HeaderSubHeader
                            subtitle={'Distribute your validator to run on the SSV network or help maintain it as one of its operators.'}
                            title={'Join the SSV Network'}
                        />
                        <Grid container item className={classes.LinkButtonsWrapper}>
                            <Grid item className={classes.LinkButtonWrapper}>
                                <SecondaryButton
                                    withVerifyConnection
                                    text={'Distribute Validator'}
                                    submitFunction={() => {
                                        walletStore.connected && navigate(config.routes.SSV.VALIDATOR.HOME);
                                    }}
                                />
                            </Grid>
                            <Grid item className={classes.LinkButtonWrapper}>
                                <SecondaryButton
                                    withVerifyConnection
                                    text={'Join as Operator'}
                                    submitFunction={() => {
                                        walletStore.connected && navigate(config.routes.SSV.OPERATOR.HOME);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        {!walletStore.connected && false && (
                            <Grid container item className={classes.OrLineWrapper}>
                                <Grid item className={classes.Line} xs/>
                                <Grid item className={classes.Or}>OR</Grid>
                                <Grid item className={classes.Line} xs/>
                            </Grid>
                        )}
                        {!walletStore.connected && false && (
                            <PrimaryButton
                                withVerifyConnection
                                text={'Connect Wallet'}
                                submitFunction={connectToWallet}
                                dataTestId={'connect-to-wallet-button'}
                            />
                        )}
                    </Grid>,
                ]}
            />
        </Grid>
    );
};

export default observer(Welcome);
