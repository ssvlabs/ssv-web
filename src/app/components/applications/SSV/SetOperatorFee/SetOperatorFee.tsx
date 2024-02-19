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

const INITIAL_ERROR_STATE = { shouldDisplay: false, errorMessage: '' };

const SetOperatorFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const [error, setError] = useState(INITIAL_ERROR_STATE);
  const [zeroError, setZeroError] = useState(false);
  const [userInput, setUserInput] = useState<UserInput>('');
  const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);

  useEffect(() => {
   if ( userInput === '') {
     setZeroError(false);
     setError(INITIAL_ERROR_STATE);
     setRegisterButtonDisabled(true);
     return;
    }
    validateFeeInput(userInput, setError);
    setUserInput(removeLeadingZeros(userInput));
    setZeroError(userInput === '0');
    const isRegisterButtonDisabled = typeof userInput === 'object' || error.shouldDisplay;
    setRegisterButtonDisabled(isRegisterButtonDisabled);
  }, [error.shouldDisplay, userInput]);

  const moveToSubmitConfirmation = () => {
    const operatorWithFee = operatorStore.newOperatorKeys;
    // @ts-ignore
    operatorWithFee.fee = parseFloat(userInput) || 0;
    operatorStore.setOperatorKeys(operatorWithFee);
    navigate(config.routes.SSV.OPERATOR.CONFIRMATION_PAGE);
  };

  const removeLeadingZeros = (num: string): string =>  {
    let stripped = num.toString().replace(/^0+(?!\.)/, '');
    return stripped === '' ? '0' : stripped;
  };

  const verifyFeeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value.trim());
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
            <Grid className={classes.Text}>Please note that you could always change your fee (according to <br /> the <LinkText text={'limitations'} link={config.links.SSV_UPDATE_FEE_DOCS} />) to align with market dynamics, such as competitiveness and SSV price fluctuations.</Grid>
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
                onChangeCallback={verifyFeeNumber}/>
              {error.shouldDisplay && <Typography className={classes.TextError}>{error.errorMessage}</Typography>}
            </Grid>
            {zeroError && <WarningBox text={'If you set your fee to 0 you will not be able to change it in the future'}/>}
              <PrimaryButton children={'Next'} disable={registerButtonDisabled} submitFunction={moveToSubmitConfirmation} />
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(SetOperatorFee);
