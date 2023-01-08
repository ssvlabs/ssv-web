import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import Button from '~app/components/common/Button';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import MessageDiv from '~app/components/common/MessageDiv';
import InputLabel from '~app/components/common/InputLabel';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import BorderScreen from '~app/components/common/BorderScreen';
import { getRandomOperatorKey } from '~lib/utils/contract/operator';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { validateAddressInput, validatePublicKeyInput } from '~lib/utils/validatesInputs';
import OperatorStore, { NewOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/applications/SSV/GenerateOperatorKeys/GenerateOperatorKeys.styles';

const GenerateOperatorKeys = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const walletStore: WalletStore = stores.Wallet;
  const operatorStore: OperatorStore = stores.Operator;
  const applicationStore: ApplicationStore = stores.Application;
  let initialOperatorKey = '';
  if (config.FEATURE.TESTING.GENERATE_RANDOM_OPERATOR_KEY) {
    initialOperatorKey = getRandomOperatorKey(false);
  }
  const [operatorExist, setOperatorExist] = useState(false);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);
  const [inputsData, setInputsData] = useState({ publicKey: initialOperatorKey });
  const [addressError, setAddressError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });

  // Inputs validation
  useEffect(() => {
    const isRegisterButtonEnabled = !inputsData.publicKey
      || !walletStore.accountAddress
      || publicKeyError.shouldDisplay
      || addressError.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [inputsData,
    inputsData.publicKey,
    walletStore.accountAddress,
    addressError.shouldDisplay,
    publicKeyError.shouldDisplay,
  ]);

  const onInputChange = (name: string, value: string) => {
    if (operatorExist) setOperatorExist(false);
    setInputsData({ ...inputsData, [name]: value });
  };

  const onRegisterClick = async () => {
    setOperatorExist(false);
    applicationStore.setIsLoading(true);

    const operatorKeys: NewOperator = {
      fee: 0,
      id: '0',
      address: walletStore.accountAddress,
      pubKey: walletStore.encodeKey(inputsData.publicKey),
    };
    operatorStore.setOperatorKeys(operatorKeys);
    const isExists = await Operator.getInstance().getOperator(
      sha256(walletStore.decodeKey(operatorKeys.pubKey)),
      true,
    );
    setOperatorExist(isExists);
    if (!isExists) navigate(config.routes.SSV.OPERATOR.SET_FEE_PAGE);
    applicationStore.setIsLoading(false);
  };

  return (
    <BorderScreen
      overFlow={'visible'}
      body={[
        <Grid container>
          <HeaderSubHeader title={translations.OPERATOR.REGISTER.TITLE}
            subtitle={translations.OPERATOR.REGISTER.DESCRIPTION} />
          <Grid container direction={'column'}>
            <Grid item className={classes.GridItem}>
              <InputLabel title="Owner Address" withHint
                toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_ADDRESS} />
              <TextInput
                disable
                data-testid="new-operator-address"
                value={walletStore.accountAddress}
                onBlurCallBack={(event: any) => {
                  validateAddressInput(event.target.value, setAddressError);
                }}
              />
              {addressError.shouldDisplay &&
                <Typography className={classes.TextError}>{addressError.errorMessage}</Typography>}
            </Grid>
            <Grid item className={classes.GridItem}>
              <InputLabel
                title="Operator Public Key"
                withHint
                toolTipText={(
                  <div>{translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
                    <LinkText text={'documentation.'} link={'https://docs.ssv.network/run-a-node/operator-node'} />
                  </div>
                )}
              />
              <TextInput
                value={inputsData.publicKey}
                dataTestId={'new-operator-key'}
                showError={publicKeyError.shouldDisplay}
                onChangeCallback={(event: any) => {
                  onInputChange('publicKey', event.target.value);
                }}
                onBlurCallBack={(event: any) => {
                  validatePublicKeyInput(event.target.value, setPublicKeyError);
                }}
              />
              {publicKeyError.shouldDisplay &&
                <Typography className={classes.TextError}>{publicKeyError.errorMessage}</Typography>}
            </Grid>
            {operatorExist && <MessageDiv text={translations.OPERATOR.OPERATOR_EXIST} />}
          </Grid>
          <Button disable={!registerButtonEnabled} text={'Next'} onClick={onRegisterClick} />
        </Grid>,
      ]}
    />
  );
};

export default observer(GenerateOperatorKeys);
