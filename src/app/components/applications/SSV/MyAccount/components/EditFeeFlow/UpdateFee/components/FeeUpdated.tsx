
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import config from '~app/common/config';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import { IncreaseFlowProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import { useStyles, StepperSteps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';

const FeeUpdated = ({ oldFee, newFee, currentCurrency }: IncreaseFlowProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

    const backToMyAccount = async () => {
        dispatch(setIsLoading(true));
        setTimeout(() => {
            dispatch(setIsLoading(false));
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
              <PrimaryButton disable={false} children={'Back to My Account'} submitFunction={backToMyAccount} />
            </Grid>
          </Grid>,
        ]}
      />
    );
};

export default FeeUpdated;
