import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import LinkText from '~app/components/common/LinkText';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import { encodeParameter } from '~root/services/conversions.service';
import { useStyles } from '~app/components/applications/SSV/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import { validateAddressInput, validatePublicKeyInput } from '~lib/utils/validatesInputs';
import { useAppSelector } from '~app/hooks/redux.hook';
import { getAccountAddress, getIsMainnet } from '~app/redux/wallet.slice';
import { Grid, PrimaryButton } from '~app/atomicComponents';
import { ButtonSize } from '~app/enums/Button.enum';
import { getOperatorByPublicKey } from '~root/services/operator.service.ts';
import { IOperatorRawData } from '~app/model/operator.model.ts';
import RegisterOperatorStatus from '~app/components/applications/SSV/OperatorAccessSettingsV2/RegisterOperatorStatus.tsx';

const GenerateOperatorKeys = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const accountAddress = useAppSelector(getAccountAddress);
  const isMainnet = useAppSelector(getIsMainnet);
  const [operatorExist, setOperatorExist] = useState(false);
  const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);
  const [inputsData, setInputsData] = useState({ publicKey: '' });
  const [addressError, setAddressError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  // Inputs validation
  useEffect(() => {
    const isRegisterButtonEnabled = !inputsData.publicKey || !accountAddress || publicKeyError.shouldDisplay || addressError.shouldDisplay;
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

    const operatorRawData: IOperatorRawData = {
      fee: 0,
      id: 0,
      address: accountAddress,
      publicKey: encodeParameter('string', inputsData.publicKey)
    };
    const isExists = await getOperatorByPublicKey(inputsData.publicKey);
    setOperatorExist(isExists.data);
    if (!isExists.data) {
      navigate(config.routes.SSV.OPERATOR.SET_FEE_PAGE, { state: { operatorRawData, isPrivate } });
    }
    setIsLoading(false);
  };

  const components = [
    <Grid container>
      <HeaderSubHeader title={translations.OPERATOR.REGISTER.TITLE} subtitle={translations.OPERATOR.REGISTER.DESCRIPTION} />
      <Grid container direction={'column'} style={{ gap: 24 }}>
        <Grid item className={classes.GridItem}>
          <InputLabel title="Owner Address" withHint toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_ADDRESS} />
          <TextInput
            disable
            data-testid="new-operator-address"
            value={accountAddress}
            onBlurCallBack={(event: any) => {
              validateAddressInput(event.target.value, setAddressError);
            }}
          />
          {addressError.shouldDisplay && <Typography className={classes.TextError}>{addressError.errorMessage}</Typography>}
        </Grid>
        <Grid item className={classes.GridItem}>
          <InputLabel
            title="Operator Public Key"
            withHint
            toolTipText={
              <div>
                {translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
                <LinkText text={'documentation.'} link={'https://docs.ssv.network/run-a-node/operator-node/installation#generate-operator-keys'} />
              </div>
            }
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
          {publicKeyError.shouldDisplay && <Typography className={classes.TextError}>{publicKeyError.errorMessage}</Typography>}
        </Grid>
        {operatorExist && <ErrorMessage text={translations.OPERATOR.OPERATOR_EXIST} />}
      </Grid>
    </Grid>,
    <Grid container direction={'column'}>
      {!isMainnet && <RegisterOperatorStatus isPrivate={isPrivate} setIsPrivate={setIsPrivate} />}
      <PrimaryButton isDisabled={!registerButtonEnabled} text={'Next'} onClick={onRegisterClick} size={ButtonSize.XL} isLoading={isLoading} />
    </Grid>
  ];

  return <BorderScreen subHeaderText={'Join the SSV Network Operators'} overFlow={'visible'} body={components} />;
};

export default GenerateOperatorKeys;
