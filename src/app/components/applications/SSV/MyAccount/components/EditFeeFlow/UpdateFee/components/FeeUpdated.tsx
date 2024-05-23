import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { IncreaseFlowProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import { StepperSteps, useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import BorderScreen from '~app/components/common/BorderScreen';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';

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
            <ChangeFeeDisplayValues currentCurrency={currentCurrency} newFee={newFee} oldFee={oldFee} />
          </Grid>
          <Grid item container className={classes.ButtonsWrapper}>
            <PrimaryButton isLoading={isLoading} text={'Back to My Account'} onClick={backToMyAccount} size={ButtonSize.XL} />
          </Grid>
        </Grid>
      ]}
    />
  );
};

export default FeeUpdated;
