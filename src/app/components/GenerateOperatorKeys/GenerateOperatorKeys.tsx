import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { isMobile } from 'react-device-detect';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/common/components/TextInput';
import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import Screen from '~app/common/components/Screen/Screen';
import MessageDiv from '~app/common/components/MessageDiv';
import InputLabel from '~app/common/components/InputLabel';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
import { getRandomOperatorKey } from '~lib/utils/contract/operator';
import ApplicationStore from '~app/common/stores/Application.store';
import OperatorStore, { INewOperatorTransaction } from '~app/common/stores/Operator.store';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import {
  validatePublicKeyInput,
  validateDisplayNameInput,
  validateAddressInput,
  validateFeeInput,
} from '~lib/utils/validatesInputs';

const actionButtonMargin = isMobile ? '52px' : '102px';

const GenerateOperatorKeys = () => {
  const classes = useStyles();
  const stores = useStores();
  const history = useHistory();
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  let initialOperatorKey = '';
  if (config.FEATURE.TESTING.GENERATE_RANDOM_OPERATOR_KEY) {
     initialOperatorKey = getRandomOperatorKey(false);
  }
  const [inputsData, setInputsData] = useState({ publicKey: initialOperatorKey, name: '', fee: 0 });
  const [displayNameError, setDisplayNameError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [addressError, setAddressError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [feeError, setFeeError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [operatorExist, setOperatorExist] = useState(false);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);

  // Inputs validation
  useEffect(() => {
    const isRegisterButtonEnabled = !inputsData.name
        || !inputsData.publicKey
        || !inputsData.fee
        || !walletStore.accountAddress
        || displayNameError.shouldDisplay
        || publicKeyError.shouldDisplay
        || addressError.shouldDisplay
        || feeError.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [inputsData,
    walletStore.accountAddress,
    displayNameError.shouldDisplay,
    feeError.shouldDisplay,
    addressError.shouldDisplay,
    publicKeyError.shouldDisplay,
    inputsData.name,
    inputsData.publicKey,
    inputsData.fee,
  ]);

  const onInputChange = (name: string, value: string) => {
    if (operatorExist) setOperatorExist(false);
    setInputsData({ ...inputsData, [name]: value });
  };

  const onRegisterClick = async () => {
    setOperatorExist(false);
    const operatorKeys: INewOperatorTransaction = {
      pubKey: inputsData.publicKey,
      name: inputsData.name,
      address: walletStore.accountAddress,
      fee: inputsData.fee / config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR,
    };
    applicationStore.setIsLoading(true);
    operatorStore.setOperatorKeys(operatorKeys);
    await operatorStore.checkIfOperatorExists(inputsData.publicKey).then((isExists: boolean) => {
      setOperatorExist(isExists);
      if (!isExists) {
        operatorStore.addNewOperator(true).then(() => {
          applicationStore.setIsLoading(false);
          history.push(config.routes.OPERATOR.CONFIRMATION_PAGE);
        });
      } else {
        applicationStore.setIsLoading(false);
      }
    });
  };

  return (
    <Screen
      navigationText={translations.OPERATOR.HOME.TITLE}
      navigationLink={config.routes.OPERATOR.HOME}
      title={translations.OPERATOR.REGISTER.TITLE}
      subTitle={translations.OPERATOR.REGISTER.DESCRIPTION}
      styleOptions={{ actionButtonMarginTop: actionButtonMargin }}
      body={(
        <Grid container direction={'column'}>
          <Grid item className={classes.gridItem}>
            <InputLabel title="Owner Address" withHint toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_ADDRESS}>
              <TextInput
                data-testid="new-operator-address"
                className={classes.disable}
                type="text"
                disabled
                value={walletStore.accountAddress}
                onBlur={(event) => { validateAddressInput(event.target.value, setAddressError); }}
              />
              {addressError.shouldDisplay && <Typography className={classes.textError}>{addressError.errorMessage}</Typography>}
            </InputLabel>
          </Grid>
          <Grid item className={classes.gridItem}>
            <InputLabel title="Display Name">
              <TextInput
                data-testid="new-operator-name"
                className={displayNameError.shouldDisplay ? classes.inputError : ''}
                type="text"
                onBlur={(event) => { validateDisplayNameInput(event.target.value, setDisplayNameError); }}
                onChange={(event) => { onInputChange('name', event.target.value); }}
              />
              {displayNameError.shouldDisplay && <Typography className={classes.textError}>{displayNameError.errorMessage}</Typography>}
            </InputLabel>
          </Grid>
          <Grid item>
            <InputLabel
              title="operator public key"
              withHint
              toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
              toolTipLink={config.links.TOOL_TIP_KEY_LINK}
            >
              <TextInput type="text"
                data-testid="new-operator-key"
                className={publicKeyError.shouldDisplay ? classes.inputError : ''}
                onChange={(event) => { onInputChange('publicKey', event.target.value); }}
                onBlur={(event) => { validatePublicKeyInput(event.target.value, setPublicKeyError); }}
                value={inputsData.publicKey}
              />
              {publicKeyError.shouldDisplay && <Typography className={classes.textError}>{publicKeyError.errorMessage}</Typography>}
            </InputLabel>

            <br />
            {operatorExist && <MessageDiv text={translations.OPERATOR.OPERATOR_EXIST} />}
          </Grid>
          <Grid item>
            <InputLabel
              title="yearly fee per validator"
              withHint
              toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
              toolTipLink={config.links.TOOL_TIP_KEY_LINK}
            >
              <TextInput type="text"
                data-testid="new-operator-fee"
                className={`${classes.feeInput} ${feeError.shouldDisplay ? classes.inputError : ''}`}
                onChange={(event) => { onInputChange('fee', event.target.value); }}
                onBlur={(event) => { validateFeeInput(event.target.value, setFeeError); }}
                value={inputsData.fee}
               />
              {feeError.shouldDisplay && <Typography className={classes.textError}>{feeError.errorMessage}</Typography>}
            </InputLabel>

            <br />
          </Grid>
        </Grid>
      )}
      actionButton={(
        <CTAButton
          testId="register-operator-button"
          disable={!registerButtonEnabled}
          onClick={onRegisterClick}
          text={'Next'}
        />
      )}
    />
  );
};

export default observer(GenerateOperatorKeys);
