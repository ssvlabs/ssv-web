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

const SetOperatorFee = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const operatorStore: OperatorStore = stores.Operator;
  const [userInput, setUserInput] = useState();
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
    operatorWithFee.fee = userInput || 0;
    operatorStore.setOperatorKeys(operatorWithFee);
    navigate(config.routes.SSV.OPERATOR.CONFIRMATION_PAGE);
  };

  return (
    <BorderScreen
      body={[
        <Grid container style={{ position: 'relative', gap: 0 }}>
          <HeaderSubHeader title={'Set Operator Fees'} />
          <Grid item container style={{ gap: 24 }}>
            <Typography className={classes.Text}>The ssv network utilizes the SSV token to facilitate payments between stakers to operators for maintaining their validators.</Typography>
            <Typography className={classes.Text}>Operators set their own fees, denominated in SSV tokens, to be charged per each validator that selects them as one of their operators.</Typography>
            <Typography className={classes.Text}>Fees are presented as annual payments, but in practice are paid to operators continuously as an ongoing process - per each passed block.</Typography>
            <Typography className={classes.Text}>Your earnings are paid to your operator balance, and ca be withdrawn to your wallet at any time.</Typography>
            <Grid className={classes.Text}>Please note that you could always change your fee (according to <br /> the <LinkText text={'limitations'} link={'https://docs.ssv.network/learn/introduction/network-overview#dao-ssv-token-holders'} />) to align with market dynamics, such as competitiveness and SSV price fluctuations.</Grid>
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
                showError={error.shouldDisplay}
                dataTestId={'edit-operator-fee'}
                onChangeCallback={(e: any) => setUserInput(e.target.value)}
                onBlurCallBack={(event: any) => { validateFeeInput(event.target.value, setError); }} />
              {error.shouldDisplay && <Typography className={classes.TextError}>{error.errorMessage}</Typography>}
            </Grid>
            {userInput === '0' && <WarningBox text={'If you set your fee to 0 you will not be able to change it in the future'}/>}
              <PrimaryButton text={'Next'} disable={!registerButtonEnabled} submitFunction={moveToSubmitConfirmation} />
          </Grid>
        </Grid>,
      ]}
    />
  );
};

export default observer(SetOperatorFee);
