import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import ReactStepper
  from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import {
  IncreaseFlowProps,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import {
  StepperSteps,
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';

const FeeUpdated = ({ oldFee, newFee, currentCurrency }: IncreaseFlowProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

    const backToMyAccount = async () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR_DASHBOARD);
        }, 5000);
    };

    const classes = useStyles({ step: StepperSteps.UPDATED });

    return (
      <BorderScreen
        blackHeader
        withoutNavigation
        body={[
          <Grid container item>
            <Grid container item className={classes.HeaderWrapper}>
              <Grid item>
                <Typography className={classes.Title}>Update Fee</Typography>
              </Grid>
              <Grid item className={classes.Step}>
                Success
              </Grid>
            </Grid>
            <ReactStepper step={StepperSteps.UPDATED} subTextAlign={'center'} />
            <Grid item container className={classes.TextWrapper}>
              <Grid item>
                <Typography>You have successfully updated your fee. The new fee will take effect immediately.</Typography>
              </Grid>
            </Grid>
            <Grid item container className={classes.FeesChangeWrapper}>
                <ChangeFeeDisplayValues currentCurrency={currentCurrency} newFee={newFee} oldFee={oldFee}/>
            </Grid>
            <Grid item container className={classes.ButtonsWrapper}>
              <PrimaryButton isLoading={isLoading} text={'Back to My Account'} onClick={backToMyAccount} size={ButtonSize.XL}/>
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default FeeUpdated;
