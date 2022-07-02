import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './SetOperatorFee.styles';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import { validateFeeInput } from '~lib/utils/validatesInputs';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';
import BorderScreen from '~app/components/common/BorderScreen';

const SetOperatorFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const history = useHistory();
  const operatorStore: OperatorStore = stores.Operator;
  const [userInput, setUserInput] = useState(0);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);
  const [error, setError] = useState({ shouldDisplay: false, errorMessage: '' });

  useEffect(() => {
    const isRegisterButtonEnabled = !userInput || error.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [error.shouldDisplay, userInput]);

  const moveToSubmitConfirmation = () => {
    const operatorWithFee = operatorStore.newOperatorKeys;
    operatorWithFee.fee = userInput;
    operatorStore.setOperatorKeys(operatorWithFee);
    history.push(config.routes.SSV.OPERATOR.CONFIRMATION_PAGE);
  };

  return (
    <BorderScreen
      body={[
        <Grid container style={{ position: 'relative' }}>
          <HeaderSubHeader title={'Set Operator Fee'} />
          <Grid item container style={{ gap: 24 }}>
            <Typography className={classes.Text}>The ssv network utilizes the SSV token to facilitate payments between stakers to operators for maintaining their validators.</Typography>
            <Typography className={classes.Text}>Operators set their own fees, denominated in SSV tokens, to be charged per each validator that selects them as one of their operators.</Typography>
            <Typography className={classes.Text}>Fees are presented as annual payments, but in practice are paid to operators continuously as an ongoing process - per each passed block.</Typography>
            <Grid className={classes.Text}>Please note that you could always change your fee (according to <br /> the <LinkText text={'limitations'} link={''} />) to align with market dynamics, such as competitiveness and SSV price fluctuations.</Grid>
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
            <Grid item container style={{ marginBottom: 24 }}>
              <TextInput
                withSideText
                value={userInput}
                placeHolder={'0.0'}
                showError={error.shouldDisplay}
                dataTestId={'edit-operator-fee'}
                onChangeCallback={(e: any) => setUserInput(e.target.value)}
                onBlurCallBack={(event: any) => { validateFeeInput(event.target.value, setError); }} />
              {error.shouldDisplay && <Typography className={classes.TextError}>{error.errorMessage}</Typography>}
            </Grid>
            <PrimaryButton text={'Next'} disable={!registerButtonEnabled} submitFunction={moveToSubmitConfirmation} />
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(SetOperatorFee);
