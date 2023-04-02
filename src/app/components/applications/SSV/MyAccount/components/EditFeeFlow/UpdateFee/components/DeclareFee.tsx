import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import { validateFeeUpdate } from '~lib/utils/validatesInputs';
import BorderScreen from '~app/components/common/BorderScreen';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ReactStepper from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/Stepper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditFeeFlow/UpdateFee/components/index.styles';


type Props = {
  getCurrentState: () => void,
};

const DeclareFee = (props: Props) => {
  const stores = useStores();
  const navigate = useNavigate();
  const ssvStore: SsvStore = stores.SSV;
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const [operator, setOperator] = useState(null);
  const [userInput, setUserInput] = useState('');
  const applicationStore: ApplicationStore = stores.Application;
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);
  const [error, setError] = useState({ shouldDisplay: false, errorMessage: '' });

  useEffect(() => {
    if (!operatorStore.processOperatorId) return navigate(applicationStore.strategyRedirect);
    applicationStore.setIsLoading(true);
    Operator.getInstance().getOperator(operatorStore.processOperatorId).then(async (response: any) => {
      if (response) {
        setOperator(response);
      }
      applicationStore.setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const isRegisterButtonEnabled = !userInput || error.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [error.shouldDisplay, userInput]);

  // @ts-ignore
  const classes = useStyles({ registerButtonEnabled });

  if (!operator) return null;
  // @ts-ignore
  const operatorFee = ssvStore.newGetFeeForYear(walletStore.fromWei(operator?.fee));

  const changeOperatorFee = async () => {
    applicationStore.setIsLoading(true);
    // @ts-ignore
    const response = await operatorStore.updateOperatorFee(operatorStore.processOperatorId, userInput);
    if (response) {
      // @ts-ignore
      let savedOperator = JSON.parse(localStorage.getItem('expired_operators'));
      if (savedOperator && savedOperator?.includes(operatorStore.processOperatorId)) {
        savedOperator = savedOperator.filter((item: any) => item !== operatorStore.processOperatorId);
        localStorage.setItem('expired_operators', JSON.stringify(savedOperator));
      }
      await props.getCurrentState();
    }
    applicationStore.setIsLoading(false);
  };

  const currentDate = new Date();
  // TODO: error with type script should be fix. here: currentDate.toLocaleTimeString('en-us', options)
  // const options = {
  //   day: 'short',
  //   hour: 'short',
  //   month: 'short',
  //   minute: 'short',
  // };

  const secondsToDhms = (seconds: any) => {
    // eslint-disable-next-line no-param-reassign
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    // eslint-disable-next-line no-mixed-operators
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    // eslint-disable-next-line no-mixed-operators
    const m = Math.floor(seconds % 3600 / 60);
    if (d > 0) return d + (d === 1 ? ' day' : ' days');
    if (h > 0) return h + (h === 1 ? ' hour' : ' hours');
    if (m > 0) return m + (m === 1 ? ' minute' : ' minutes');
    return '0 day';
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
                  Declare Fee
                </Grid>
              </Grid>
              <ReactStepper
                  step={0}
                  subTextAlign={'left'}
                  registerButtonEnabled={registerButtonEnabled}
                  subText={currentDate.toLocaleTimeString('en-us').replace('PM', '').replace('AM', '')}
              />
              <Grid item container className={classes.TextWrapper}>
                <Grid item>
                  <Typography>Updating your operator fee is done in a few steps:</Typography>
                </Grid>
                <Grid item>
                  <Typography>Process starts by declaring a new fee, which is followed by <br/>
                    a <b>{secondsToDhms(operatorStore.declaredOperatorFeePeriod)} waiting period</b> in which your
                    managed validators are notified. <br/>
                    Once the waiting period has past you could finalize your new fee by <br/> executing it.</Typography>
                </Grid>
              </Grid>
              <Grid item container className={classes.InputWrapper}>
                <Grid item container>
                  <Grid item className={classes.InputText}>
                    <Typography>Annual fee</Typography>
                  </Grid>
                  {/* <Grid item> */}
                  {/*  <Typography>Annual fee</Typography> */}
                  {/* </Grid> */}
                </Grid>
                <Grid item container style={{ marginBottom: 40 }}>
                  <TextInput
                      withSideText
                      value={userInput}
                      placeHolder={'0.0'}
                      showError={error.shouldDisplay}
                      dataTestId={'edit-operator-fee'}
                      onChangeCallback={(e: any) => {
                        setUserInput(e.target.value);
                        // @ts-ignore
                        validateFeeUpdate(operatorFee, e.target.value, operatorStore.maxFeeIncrease, setError);
                      }}
                  />
                  {error.shouldDisplay && <Typography className={classes.TextError}>{error.errorMessage}</Typography>}
                </Grid>
              </Grid>
              <Grid item className={classes.Notice}>
                <Grid item className={classes.BulletsWrapper}>
                  <ul>
                    <li>Not executing or canceling your declared fee will cause it to expire within 10 days.</li>
                    <li> You can always cancel your declared fee (your managed validators will be notified
                      accordingly).
                    </li>
                  </ul>
                </Grid>
              </Grid>
              <PrimaryButton disable={!registerButtonEnabled} text={'Declare New Fee'}
                             submitFunction={changeOperatorFee}/>
            </Grid>,
          ]}
      />
  );
};

export default observer(DeclareFee);