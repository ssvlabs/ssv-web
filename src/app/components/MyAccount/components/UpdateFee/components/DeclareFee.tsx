import { observer } from 'mobx-react';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/common/components/TextInput';
import { validateFeeUpdate } from '~lib/utils/validatesInputs';
import SsvStore from '~app/common/stores/applications/SsvWeb/SSV.store';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import PrimaryButton from '~app/common/components/Button/PrimaryButton/PrimaryButton';
import ReactStepper from '~app/components/MyAccount/components/UpdateFee/components/Stepper';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from './index.styles';

const UpdateFee = () => {
    const stores = useStores();
    // @ts-ignore
    const { operator_id } = useParams();
    const ssvStore: SsvStore = stores.SSV;
    const walletStore: WalletStore = stores.Wallet;
    const [operator, setOperator] = useState(null);
    const [userInput, setUserInput] = useState('');
    const applicationStore: ApplicationStore = stores.Application;
    const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);
    const [error, setError] = useState({ shouldDisplay: false, errorMessage: '' });

    useEffect(() => {
        applicationStore.setIsLoading(true);
        Operator.getInstance().getOperator(operator_id).then((response: any) => {
            if (response) {
                setOperator(response);
                applicationStore.setIsLoading(false);
            }
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
    const classes = useStyles({ });

    if (!operator) return null;

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
            <ReactStepper step={0} />
            <Grid item container className={classes.TextWrapper}>
              <Grid item>
                <Typography>Updating your operator fee is done in a few steps:</Typography>
              </Grid>
              <Grid item>
                <Typography>Process starts by declaring a new fee, which is followed by <br />
                  a <b>3 day waiting period</b> in which your managed validators are notified. <br />
                  Once the waiting period has past you could finalize your new fee by <br /> executing it.</Typography>
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
                  onChangeCallback={(e: any) => setUserInput(e.target.value)}
                  onBlurCallBack={(event: any) => { // @ts-ignore
                      validateFeeUpdate(ssvStore.getFeeForYear(walletStore.fromWei(operator?.fee)), event.target.value, setError); }}
                />
              </Grid>
            </Grid>
            <Grid item className={classes.Notice}>
              <Grid item className={classes.BulletsWrapper}>
                <ul>
                  <li>Not executing or canceling your declared fee will cause it to expire within 10 days.</li>
                  <li> You can always cancel your declared fee (your managed validators will be notified accordingly).</li>
                </ul>
              </Grid>
            </Grid>
            <PrimaryButton disable={!registerButtonEnabled} text={'Declare New Fee'} submitFunction={console.log} />
          </Grid>,
        ]}
      />
    );
};

export default observer(UpdateFee);