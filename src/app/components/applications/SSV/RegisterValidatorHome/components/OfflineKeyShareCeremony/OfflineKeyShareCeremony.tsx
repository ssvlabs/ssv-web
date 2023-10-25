import React, { useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { ENV } from '~lib/utils/envHelper';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/RegisterValidatorHome/components/OfflineKeyShareCeremony/OfflineKeyShareCeremony.styles';

const OfflineKeyShareCeremony = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const processStore: ProcessStore = stores.Process;

    // State to manage button enable/disable condition
    const [isValidatorActivated, setValidatorActivated] = useState(false);

    const goToNextPage = {
        true: () => navigate(config.routes.SSV.MY_ACCOUNT.CLUSTER.UPLOAD_KEYSHARES),
        false: () => navigate(config.routes.SSV.VALIDATOR.DISTRIBUTION_METHOD.UPLOAD_KEYSHARES),
    };

    // Updated condition to determine if the "My validator has been activated" button is disabled
    const isValidatorButtonDisabled = () => isValidatorActivated;

    // Updated condition to determine if the "Register Validator" button is disabled
    const isRegisterButtonDisabled = () => !isValidatorActivated;

    // Handler when "My validator has been activated" is clicked
    const handleValidatorActivatedClick = () => {
        setValidatorActivated(true);
    };

    return (
        <Grid container>
            <BorderScreen
            blackHeader
            withoutNavigation={processStore.secondRegistration}
            header={'DKG Ceremony Summary'}
            overFlow={'none'}
            body={[
                <Grid container style={{ gap: 24 }}>
                    <Grid container item className={classes.DkgInstructionsWrapper}>
                        <Typography className={classes.DkgTitle}>Step 1: Validator Key Generation</Typography>
                        <Grid className={classes.DkgNotification}>
                            <Typography className={classes.DkgText}>
                                Following the successful completion of the DKG ceremony, several files have been generated and placed in the directory you initiated the command from:
                            </Typography>
                            <Typography variant="body2"><code className={classes.DkgCode}>deposit-[validator_key].json</code>: This file contains the deposit data needed to activate your validator on the Beacon Chain.</Typography>
                            <Typography variant="body2"><code className={classes.DkgCode}>keyshares-[validator_key].json</code>: This file contains the keyshares necessary to register your validator on the SSV Network.</Typography>
                            <Typography variant="body2"><code className={classes.DkgCode}>encrypted_private_key-[validator_key].json</code> and <code>password-[validator_key]</code>: These files contain the ceremony identifiers, which are crucial for resharing your validator to a different set of operators in the future.</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item className={classes.DkgInstructionsWrapper}>
                        <Typography className={classes.DkgTitle}>Step 2: Deposit Validator</Typography>
                        <Grid className={classes.DkgText}>
                            Activate your validator on the Beacon Chain by depositing 32 ETH into Ethereum's Deposit Contract.
                            You can deposit your validator using <LinkText text={'Ethereum\'s LaunchPad'} link={ENV().LAUNCHPAD_URL}/>&nbsp;or 
                            refer to the <LinkText text={'validator activation'} link={'https://docs.ssv.network/validator-user-guides/validator-management/creating-a-new-validator#activate-validator-keys'}/>&nbsp;guide for assistance.
                        </Grid>
                        <PrimaryButton text={'My validator has been activated'} submitFunction={handleValidatorActivatedClick} disable={isValidatorButtonDisabled()}/>
                    </Grid>
                    <Grid container item className={classes.DkgInstructionsWrapper}>
                        <Typography className={classes.DkgTitle}>Step 3: Register Validator</Typography>
                        <Typography className={classes.DkgText}>Run your validator on the SSV Network by registering and distributing its key shares to your cluster operators.</Typography>
                        <PrimaryButton text={'Register Validator'} submitFunction={goToNextPage[`${processStore.secondRegistration}`]} disable={isRegisterButtonDisabled()}/>
                    </Grid>
                </Grid>,
            ]}
            />
            <Grid container direction="column" spacing={4}>
                
                
            </Grid>
        </Grid>
    );
};

export default observer(OfflineKeyShareCeremony);
