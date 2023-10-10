import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useStores } from '~app/hooks/useStores';
import Typography from '@mui/material/Typography';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ApplicationStore from '~app/common/stores/Abstracts/Application';
import { useStyles } from '~app/components/applications/SSV/Migration/ConnectWallet/ConnectWallet.styles';

const ConnectWallet = () => {
    const classes = useStyles();
    const stores = useStores();
    const walletStore: WalletStore = stores.Wallet;
    const applicationStore: ApplicationStore = stores.Application;
    const [buttonLabel, setButtonLabel] = useState(walletStore.connected ? 'Register Validators' : 'Connect wallet');

    const connectToWallet = () => {
        if (walletStore.connected) {
            setButtonLabel('Register Validators');
            return applicationStore.showWalletPopUp(true);
        }
        return walletStore.connect();
    };

    return (
        <BorderScreen
            sectionClass={classes.ExtendWrapper}
            wrapperClass={classes.CustomWrapper}
            body={[
                <Grid className={classes.MigrationWrapper}>
                   <Grid className={classes.TextWrapper}>
                       <Typography className={classes.Title}>Welcome to the SSV Network!</Typography>
                       <Typography className={classes.Text}>In order to proceed with the migration connect the wallet you defined for the migration process in the Blox Live app</Typography>
                   </Grid>
                    <Grid className={classes.MigrationLogo} />
                    <PrimaryButton text={buttonLabel} submitFunction={connectToWallet} />
                </Grid>,
            ]}
        />
    );
};

export default ConnectWallet;