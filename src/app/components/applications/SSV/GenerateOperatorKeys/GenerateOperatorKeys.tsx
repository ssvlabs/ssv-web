import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { encodeParameter } from '~root/services/conversions.service';
import OperatorStore, { NewOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import { useStyles } from '~app/components/applications/SSV/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import { validateAddressInput, validateOperatorPublicKey, validatePublicKeyInput } from '~lib/utils/validatesInputs';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress } from '~app/redux/wallet.slice';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const GenerateOperatorKeys = () => {
  const stores = useStores();
  const classes = useStyles();
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);
  const operatorStore: OperatorStore = stores.Operator;
  const [operatorExist, setOperatorExist] = useState(false);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);
  const [inputsData, setInputsData] = useState({ publicKey: '' });
  const [addressError, setAddressError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Inputs validation
  useEffect(() => {
    const isRegisterButtonEnabled = !inputsData.publicKey
      || !accountAddress
      || publicKeyError.shouldDisplay
      || addressError.shouldDisplay;
    setRegisterButtonEnabled(!isRegisterButtonEnabled);
    return () => {
      setRegisterButtonEnabled(false);
    };
  }, [inputsData, inputsData.publicKey, accountAddress, addressError.shouldDisplay, publicKeyError.shouldDisplay]);

  const onInputChange = (name: string, value: string) => {
    if (operatorExist) setOperatorExist(false);
    setInputsData({ ...inputsData, [name]: value });
  };

  const onRegisterClick = async () => {
    setOperatorExist(false);
    setIsLoading(true);

    const operatorKeys: NewOperator = {
      fee: 0,
      id: 0,
      address: accountAddress,
      publicKey: encodeParameter('string', inputsData.publicKey),
    };
    operatorKeys.id = operatorStore.getOperatorId;
    operatorStore.setOperatorKeys(operatorKeys);
    const isExists = await validateOperatorPublicKey(inputsData.publicKey);
    setOperatorExist(isExists);
    if (!isExists) navigate(config.routes.SSV.OPERATOR.SET_FEE_PAGE);
    setIsLoading(false);
  };

  return (
    <BorderScreen
      overFlow={'visible'}
      body={[
        <Grid container>
          <HeaderSubHeader title={translations.OPERATOR.REGISTER.TITLE}
                           subtitle={translations.OPERATOR.REGISTER.DESCRIPTION}/>
          <Grid container direction={'column'}>
            <Grid item className={classes.GridItem}>
              <InputLabel title="Owner Address" withHint
                          toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_ADDRESS}/>
              <TextInput
                disable
                data-testid="new-operator-address"
                value={accountAddress}
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
                    <LinkText text={'documentation.'}
                              link={'https://docs.ssv.network/run-a-node/operator-node/installation#generate-operator-keys'}/>
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
            {operatorExist && <ErrorMessage text={translations.OPERATOR.OPERATOR_EXIST}/>}
          </Grid>
          <PrimaryButton isDisabled={!registerButtonEnabled} text={'Next'} onClick={onRegisterClick}
                         size={ButtonSize.XL} isLoading={isLoading}/>
        </Grid>,
      ]}
    />
  );
};

export default observer(GenerateOperatorKeys);
