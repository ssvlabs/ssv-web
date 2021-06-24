import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
// import Paper from '@material-ui/core/Paper';
import { useHistory } from 'react-router-dom';
import { useStores } from '~app/hooks/useStores';
// import Header from '~app/common/components/Header';
import Typography from '@material-ui/core/Typography';
import TextInput from '~app/common/components/TextInput';
import CTAButton from '~app/common/components/CTAButton';
import config, { translations } from '~app/common/config';
import MessageDiv from '~app/common/components/MessageDiv';
import InputLabel from '~app/common/components/InputLabel';
import WalletStore from '~app/common/stores/Wallet/Wallet.store';
// import BackNavigation from '~app/common/components/BackNavigation';
import { getRandomOperatorKey } from '~lib/utils/contract/operator';
import ApplicationStore from '~app/common/stores/Application.store';
import EmptyPlaceholder from '~app/common/components/EmptyPlaceholder';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import ContractOperator, { INewOperatorTransaction } from '~app/common/stores/contract/ContractOperator.store';
import { validatePublicKeyInput, validateDisplayNameInput, validateAddressInput } from '~lib/utils/validatesInputs';
import Screen from '~app/common/components/Screen/Screen';

const GenerateOperatorKeys = () => {
  const classes = useStyles();
  const stores = useStores();
  const history = useHistory();
  const contractOperator: ContractOperator = stores.ContractOperator;
  const applicationStore: ApplicationStore = stores.Application;
  const walletStore: WalletStore = stores.Wallet;
  const registerButtonStyle = { width: '100%', marginTop: 30 };
  let initialOperatorKey = '';
  if (config.FEATURE.TESTING.GENERATE_RANDOM_OPERATOR_KEY) {
     initialOperatorKey = getRandomOperatorKey(false);
  }
  const [inputsData, setInputsData] = useState({ publicKey: initialOperatorKey, name: '', address: walletStore.accountAddress });
  const [displayNameError, setDisplayNameError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [addressError, setAddressError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [operatorExist, setOperatorExist] = useState(false);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);

  // Inputs validation
  useEffect(() => {
    const isRegisterButtonEnabled = !inputsData.name
        || !inputsData.publicKey
        || !inputsData.address
        || displayNameError.shouldDisplay
        || publicKeyError.shouldDisplay
        || addressError.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [inputsData,
    walletStore.accountAddress,
    displayNameError.shouldDisplay,
    addressError.shouldDisplay,
    publicKeyError.shouldDisplay,
    inputsData.name,
    inputsData.publicKey,
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
      address: inputsData.address,
    };
    applicationStore.setIsLoading(true);
    contractOperator.setOperatorKeys(operatorKeys);
    await contractOperator.checkIfOperatorExists(inputsData.publicKey).then((isExists: boolean) => {
      setOperatorExist(isExists);
      if (!isExists) {
        contractOperator.addNewOperator(true).then(() => {
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
      body={(
        <Grid container direction={'column'}>
          <Grid item>
            <InputLabel title="Owner Address" withHint toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_ADDRESS}>
              <TextInput
                data-testid="new-operator-address"
                className={addressError.shouldDisplay ? classes.inputError : ''}
                type="text"
                disabled
                value={walletStore.accountAddress}
                onBlur={(event) => { validateAddressInput(event.target.value, setAddressError); }}
              />
              {addressError.shouldDisplay && <Typography className={classes.textError}>{addressError.errorMessage}</Typography>}
            </InputLabel>
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
            <InputLabel
              title="Operator Key"
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

            <EmptyPlaceholder height={110} />
          </Grid>
        </Grid>
      )}
      actionButton={(
        <CTAButton
          testId="register-operator-button"
          disable={!registerButtonEnabled}
          style={registerButtonStyle}
          onClick={onRegisterClick}
          text={'Next'}
          />
      )}
    />
  );
};

export default observer(GenerateOperatorKeys);
