
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { timeDiffCalc } from '~lib/utils/time';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import SecondaryButton from '~app/components/common/Button/SecondaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import { IncreaseFlowProps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import { useStyles, StepperSteps } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

const WaitingPeriod = ({ oldFee, newFee, currentCurrency, cancelUpdateFee }: IncreaseFlowProps) => {
  const stores = useStores();
  const classes = useStyles({});
  const operatorStore: OperatorStore = stores.Operator;

  // @ts-ignore
  const operatorEndApprovalTime = new Date(operatorStore.operatorApprovalBeginTime * 1000);
  const endDay = operatorEndApprovalTime.getUTCDate();
  const today = new Date();
  const endMonth = operatorEndApprovalTime.toLocaleString('default', { month: 'long' });

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
              Waiting Period
            </Grid>
          </Grid>
          <ReactStepper subTextAlign={'center'} step={StepperSteps.WAITING}
            subText={`${timeDiffCalc(operatorEndApprovalTime, today)} Left`} />
          <Grid item container className={classes.TextWrapper}>
            <Grid item>
              <Typography>You have declared a new fee update and your managed validators has been <br />
                notified. Keep in mind that if you do not execute your new fee <b>until {endDay} {endMonth}</b> <br />
                it will expire and you will have to start the process anew.</Typography>
            </Grid>
          </Grid>
          <Grid item container className={classes.FeesChangeWrapper}>
            <ChangeFeeDisplayValues   currentCurrency={currentCurrency} newFee={newFee} oldFee={oldFee}/>
          </Grid>
          <Grid item className={classes.Notice}>
            <Grid item className={classes.BulletsWrapper}>
              <ul>
                <li> You can always cancel your declared fee (your managed validators will be notified accordingly).
                </li>
              </ul>
            </Grid>
          </Grid>
          <Grid item container className={classes.ButtonsWrapper}>
            <Grid item xs>
              <SecondaryButton withoutLoader className={classes.CancelButton} disable={false} children={'Cancel'}
                submitFunction={cancelUpdateFee} />
            </Grid>
            <Grid item xs>
              <PrimaryButton withoutLoader disable children={'Execute'} submitFunction={console.log} />
            </Grid>
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(WaitingPeriod);
