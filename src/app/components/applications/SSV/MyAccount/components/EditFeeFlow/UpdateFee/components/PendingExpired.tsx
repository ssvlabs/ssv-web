import React from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ChangeFeeDisplayValues from '~app/components/common/FeeUpdateTo/ChangeFeeDisplayValues';
import ReactStepper
  from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import {
  IncreaseFlowProps,
} from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/IncreaseFlow';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';

const PendingExpired = ({ oldFee, newFee, currentCurrency, declareNewFeeHandler } : IncreaseFlowProps) => {
  const stores = useStores();
  const classes = useStyles({ step: 4 });
  const operatorStore: OperatorStore = stores.Operator;

  const declareNewFee = () => {
    operatorStore.refreshOperatorFeeData();
    declareNewFeeHandler();
  };

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
              Expired
            </Grid>
          </Grid>
          <ReactStepper step={4} subTextAlign={'center'} />
          <Grid item container className={classes.TextWrapper}>
            <Grid item>
              <Typography>Your declare fee has expired because you have not executed it.</Typography>
            </Grid>
          </Grid>
          <Grid item container className={classes.FeesChangeWrapper}>
            <ChangeFeeDisplayValues negativeArrow={true} currentCurrency={currentCurrency} newFee={newFee} oldFee={oldFee}/>
          </Grid>
          <Grid item container className={classes.ButtonsWrapper}>
            <PrimaryButton disable={false} text={'Declare New Fee'} submitFunction={declareNewFee} />
          </Grid>
        </Grid>,

      ]}
    />
  );
};

export default observer(PendingExpired);
