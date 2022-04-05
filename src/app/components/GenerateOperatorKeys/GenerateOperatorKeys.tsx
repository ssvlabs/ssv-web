import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/common/components/LinkText';
// import Checkbox from '~app/common/components/CheckBox';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
import MessageDiv from '~app/common/components/MessageDiv';
import InputLabel from '~app/common/components/InputLabel';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { getRandomOperatorKey } from '~lib/utils/contract/operator';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import PrimaryButton from '~app/common/components/Buttons/PrimaryButton';
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import OperatorStore, { NewOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import {
    validatePublicKeyInput,
    validateDisplayNameInput,
    validateAddressInput,
    validateFeeInput,
} from '~lib/utils/validatesInputs';

const GenerateOperatorKeys = () => {
    const stores = useStores();
    const classes = useStyles();
    const history = useHistory();
    const walletStore: WalletStore = stores.Wallet;
    const operatorStore: OperatorStore = stores.Operator;
    const applicationStore: ApplicationStore = stores.Application;
    let initialOperatorKey = '';
    if (config.FEATURE.TESTING.GENERATE_RANDOM_OPERATOR_KEY) {
        initialOperatorKey = getRandomOperatorKey(false);
    }
    const [operatorExist, setOperatorExist] = useState(false);
    // const [userAgreement, setUserAgreement] = useState(false);
    const [registerButtonEnabled, setRegisterButtonEnabled] = useState(false);
    const [feeError, setFeeError] = useState({ shouldDisplay: false, errorMessage: '' });
    const [addressError, setAddressError] = useState({ shouldDisplay: false, errorMessage: '' });
    const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });
    const [inputsData, setInputsData] = useState({ publicKey: initialOperatorKey, name: '', fee: 0 });
    const [displayNameError, setDisplayNameError] = useState({ shouldDisplay: false, errorMessage: '' });

    // Inputs validation
    useEffect(() => {
        const isRegisterButtonEnabled = !inputsData.name
            || !inputsData.publicKey || (!inputsData.fee && process.env.REACT_APP_NEW_STAGE)
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
        applicationStore.setIsLoading(true);
        const operatorKeys: NewOperator = {
            name: inputsData.name,
            address: walletStore.accountAddress,
            pubKey: walletStore.encodeKey(inputsData.publicKey),
            fee: inputsData.fee / config.GLOBAL_VARIABLE.BLOCKS_PER_YEAR,
        };
        operatorStore.setOperatorKeys(operatorKeys);
        const isExists = await operatorStore.checkIfOperatorExists(operatorKeys.pubKey);
        setOperatorExist(isExists);
        if (!isExists) {
            try {
                await operatorStore.addNewOperator(true);
                history.push(config.routes.OPERATOR.CONFIRMATION_PAGE);
            } catch {
                console.log('error!!!!!');
            }
        }
        applicationStore.setIsLoading(false);
    };

    return (
      <BorderScreen
        navigationLink={config.routes.OPERATOR.HOME}
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
                  onBlurCallBack={(event: any) => { validateAddressInput(event.target.value, setAddressError); }}
                />
                {addressError.shouldDisplay &&
                <Typography className={classes.TextError}>{addressError.errorMessage}</Typography>}
              </Grid>
              <Grid item className={classes.GridItem}>
                <InputLabel title="Display Name" />
                <TextInput
                  data-testid="new-operator-name"
                  showError={displayNameError.shouldDisplay}
                  onChangeCallback={(event: any) => { onInputChange('name', event.target.value); }}
                  onBlurCallBack={(event: any) => { validateDisplayNameInput(event.target.value, setDisplayNameError); }}
                />
                {displayNameError.shouldDisplay &&
                <Typography className={classes.TextError}>{displayNameError.errorMessage}</Typography>}
              </Grid>
              <Grid item className={classes.GridItem}>
                <InputLabel
                  title="Operator Public Key"
                  withHint
                  toolTipText={(
                    <div>{translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
                      <LinkText text={'documentation.'} link={config.links.TOOL_TIP_KEY_LINK} />
                    </div>
                  )}
                />
                <TextInput
                  value={inputsData.publicKey}
                  dataTestId={'new-operator-key'}
                  showError={publicKeyError.shouldDisplay}
                  onChangeCallback={(event: any) => { onInputChange('publicKey', event.target.value); }}
                  onBlurCallBack={(event: any) => { validatePublicKeyInput(event.target.value, setPublicKeyError); }}
                />
                {publicKeyError.shouldDisplay &&
                <Typography className={classes.TextError}>{publicKeyError.errorMessage}</Typography>}
              </Grid>
              {operatorExist && <MessageDiv text={translations.OPERATOR.OPERATOR_EXIST} />}
              {process.env.REACT_APP_NEW_STAGE && (
                <Grid item className={classes.GridItem}>
                  <InputLabel
                    withHint
                    title="Yearly Fee Per Validator"
                    // toolTipLink={config.links.TOOL_TIP_KEY_LINK}
                    toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
                  />
                  <TextInput
                    withSideText
                    value={inputsData.fee}
                    dataTestId={'new-operator-fee'}
                    showError={feeError.shouldDisplay}
                    onChangeCallback={(event: any) => { onInputChange('fee', event.target.value); }}
                    onBlurCallBack={(event: any) => { validateFeeInput(event.target.value, setFeeError); }}
                  />
                  {feeError.shouldDisplay &&
                  <Typography className={classes.TextError}>{feeError.errorMessage}</Typography>}
                </Grid>
              )}
            </Grid>
            {/* <Checkbox onClickCallBack={setUserAgreement} text={'I understand that running my validator simultaneously in multiple setups will cause slashing to my validator'} /> */}
            <PrimaryButton disable={!registerButtonEnabled} text={'Next'} submitFunction={onRegisterClick} />
          </Grid>,
        ]}
      />
    );
};

export default observer(GenerateOperatorKeys);
