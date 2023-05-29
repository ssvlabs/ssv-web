import React from 'react';
import { Grid, Typography } from '@mui/material';
import LinkText from '~app/components/common/LinkText/LinkText';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import UpdateFeeProcesses
    from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/UpdateFeeProcesses';
import {
    useStyles,
} from '~app/components/applications/SSV/MyAccount/components/Validator/SingleCluster/components/OperatorBox/NotificationPopUp/NotificationPopUp.styles';

type NotificationPopUpProps = {
    closePopUp: Function,
};

const NotificationPopUp = ({ closePopUp }: NotificationPopUpProps) => {
    const classes = useStyles({});
    
    return (
        <Grid className={classes.PopUpWrapper}>
            <Grid className={classes.CloseButtonWrapper}>
                  <Grid className={classes.ClosePopUpButton} onClick={() => closePopUp()}/>
            </Grid>
            <Typography className={classes.PopUpTitle}>Lucca has started a fee change</Typography>
            <ChangeFeeDisplayValues   currentCurrency={'SSV'} newFee={11} oldFee={10}/>
            <Grid className={classes.Line}/>
            <Typography className={classes.PopUpTitle}>Update Fee Process Overview</Typography>
            <UpdateFeeProcesses />
            <LinkText text={'Read documentation'} link={'asdas'} />
        </Grid>
    );
};

export default NotificationPopUp;