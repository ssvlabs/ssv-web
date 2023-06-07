import React from 'react';
import { Grid, Typography } from '@mui/material';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { formatNumberToUi } from '~lib/utils/numbers';
import LinkText from '~app/components/common/LinkText/LinkText';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import UpdateFeeState
    from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/UpdateFeeState';
import Stepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import UpdateFeeProcesses
    from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/UpdateFeeProcesses';
import {
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/NotificationPopUp.styles';

type NotificationPopUpProps = {
    closePopUp: Function,
    operator: any,
    currentStep: number,
    newFee: string;
};

const NotificationPopUp = ({ operator, closePopUp, currentStep, newFee }: NotificationPopUpProps) => {
    const classes = useStyles({});
    const stores = useStores();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;

    return (
        <Grid className={classes.PopUpWrapper}>
            <Grid className={classes.CloseButtonWrapper}>
                 <Typography className={classes.PopUpTitle}>{operator.name} has started a fee change</Typography>
                 <Grid className={classes.ClosePopUpButton} onClick={() => closePopUp()}/>
            </Grid>
            <Grid item container>
                 <Grid>
                    <ChangeFeeDisplayValues currentCurrency={'SSV'} newFee={newFee} oldFee={formatNumberToUi(ssvStore.getFeeForYear(walletStore.fromWei(operator.fee)))}/>
                 </Grid>
                 <Grid>
                    <UpdateFeeState operatorId={operator.id}/>
                 </Grid>
            </Grid>
            <Grid className={classes.Line}/>
            <Typography className={classes.PopUpTitle}>Update Fee Process Overview</Typography>
            <Stepper step={currentStep} subTextAlign={''}/>
            <UpdateFeeProcesses />
            <LinkText text={'Read documentation'} link={config.links.SSV_UPDATE_FEE_DOCS} />
        </Grid>
    );
};

export default NotificationPopUp;