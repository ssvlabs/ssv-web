import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import { useStyles } from './SetOperatorFee.styles';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import WarningBox from '~app/components/common/WarningBox';
import { validateFeeInput } from '~lib/utils/validatesInputs';
import BorderScreen from '~app/components/common/BorderScreen';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import OperatorStore from '~app/common/stores/applications/SsvWeb/Operator.store';

type UserInput = string;

const SetOperatorFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const [zeroError, setZeroError] = useState(false);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(true);
  const [error, setError] = useState({ shouldDisplay: false, errorMessage: '' });

  useEffect(() => {
    const isRegisterButtonEnabled = typeof userInput === 'object' || error.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [error.shouldDisplay, userInput]);

  const moveToSubmitConfirmation = () => {
    const operatorWithFee = operatorStore.newOperatorKeys;
    // @ts-ignore
    operatorWithFee.fee = parseFloat(userInput) || 0;
    operatorStore.setOperatorKeys(operatorWithFee);
    navigate(config.routes.SSV.OPERATOR.CONFIRMATION_PAGE);
  };

  const removeLeadingZeros = (num: string): string =>  {
    let stripped = num.replace(/^0+/, '');
    return stripped === '' ? '0' : stripped;
  };

  const verifyFeeNumber = (value: string) => {
    setUserInput(value);
  };

  const checkIfNumberZero = (value: string) => {
    validateFeeInput(value, setError);
    if (typeof userInput === 'string') {
      setUserInput(removeLeadingZeros(userInput));
      if (userInput === '0') setZeroError(true);
      else setZeroError(false); 
    }
  };

  return (
    <BorderScreen
      body={[
        <Grid container style={{ position: 'relative', gap: 0 }}>
          <HeaderSubHeader title={'Set Operator Fee'} />
          <Grid item container style={{ gap: 24 }}>
            <Typography className={classes.Text}>The ssv network utilizes the SSV token to facilitate payments between stakers to operators for maintaining their validators.</Typography>
            <Typography className={classes.Text}>Operators set their own fees, denominated in SSV tokens, to be charged per each validator that selects them as one of their operators.</Typography>
            <Typography className={classes.Text}>Fees are presented as annual payments, but in practice are paid to operators continuously as an ongoing process - per each passed block.</Typography>
            <Typography className={classes.Text}>Your earnings are paid to your ssv operator balance, and can be withdrawn to your wallet at any time.</Typography>
            <Grid className={classes.Text}>Please note that you could always change your fee (according to <br /> the <LinkText text={'limitations'} link={'https://docs.ssv.network/learn/operators/update-fee'} />) to align with market dynamics, such as competitiveness and SSV price fluctuations.</Grid>
          </Grid>
          <Grid item container className={classes.InputWrapper} style={{ gap: 24 }}>
            <Grid item container>
              <Grid item container>
                <Grid item className={classes.InputText}>
                  <Typography>Annual fee</Typography>
                </Grid>
              </Grid>
              <TextInput
                withSideText
                value={userInput}
                placeHolder={'0.0'}
                showError={error.shouldDisplay}
                dataTestId={'edit-operator-fee'}
                onChangeCallback={(e: any) => verifyFeeNumber(e.target.value)}
                onBlurCallBack={(event: any) => { checkIfNumberZero(event.target.value); }} />
              {error.shouldDisplay && <Typography className={classes.TextError}>{error.errorMessage}</Typography>}
            </Grid>
            {zeroError && <WarningBox text={'If you set your fee to 0 you will not be able to change it in the future'}/>}
              <PrimaryButton text={'Next'} disable={!registerButtonEnabled} submitFunction={moveToSubmitConfirmation} />
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(SetOperatorFee);
