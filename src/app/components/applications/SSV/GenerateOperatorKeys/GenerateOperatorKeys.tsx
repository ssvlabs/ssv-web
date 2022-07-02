import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
import LinkText from '~app/components/common/LinkText';
// import Checkbox from '~app/common/components/CheckBox';
import TextInput from '~app/components/common/TextInput';
import config, { translations } from '~app/common/config';
import MessageDiv from '~app/components/common/MessageDiv';
import InputLabel from '~app/components/common/InputLabel';
import WalletStore from '~app/common/stores/Abstracts/Wallet';
import { getRandomOperatorKey } from '~lib/utils/contract/operator';
import HeaderSubHeader from '~app/components/common/HeaderSubHeader';
import BorderScreen from '~app/components/common/BorderScreen';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import { useStyles } from '~app/components/applications/SSV/GenerateOperatorKeys/GenerateOperatorKeys.styles';
import OperatorStore, { NewOperator } from '~app/common/stores/applications/SsvWeb/Operator.store';
import {
    validatePublicKeyInput,
    validateDisplayNameInput,
    validateAddressInput,
} from '~lib/utils/validatesInputs';
import Button from '~app/components/common/Button';

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
    // const [feeError, setFeeError] = useState({ shouldDisplay: false, errorMessage: '' });
    const [addressError, setAddressError] = useState({ shouldDisplay: false, errorMessage: '' });
    const [publicKeyError, setPublicKeyError] = useState({ shouldDisplay: false, errorMessage: '' });
    const [inputsData, setInputsData] = useState({ publicKey: initialOperatorKey, name: '' });
    const [displayNameError, setDisplayNameError] = useState({ shouldDisplay: false, errorMessage: '' });

    // Inputs validation
    useEffect(() => {
        const isRegisterButtonEnabled = !inputsData.name
            || !inputsData.publicKey
            || !walletStore.accountAddress
            || displayNameError.shouldDisplay
            || publicKeyError.shouldDisplay
            || addressError.shouldDisplay;
            // || feeError.shouldDisplay;
        setRegisterButtonEnabled(!isRegisterButtonEnabled);
        return () => {
            setRegisterButtonEnabled(false);
        };
    }, [inputsData,
        walletStore.accountAddress,
        displayNameError.shouldDisplay,
        // feeError.shouldDisplay,
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
        applicationStore.setIsLoading(true);

        const operatorKeys: NewOperator = {
            fee: 0,
            name: inputsData.name,
            address: walletStore.accountAddress,
            pubKey: walletStore.encodeKey(inputsData.publicKey),
        };
        operatorStore.setOperatorKeys(operatorKeys);
        const isExists = await operatorStore.checkIfOperatorExists(operatorKeys.pubKey);
        setOperatorExist(isExists);
        if (!isExists) history.push(config.routes.SSV.OPERATOR.SET_FEE_PAGE);
        applicationStore.setIsLoading(false);
    };

    return (
      <BorderScreen
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
                  value={inputsData.name}
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
            </Grid>
            {/* <Checkbox onClickCallBack={setUserAgreement} text={'I understand that running my validator simultaneously in multiple setups will cause slashing to my validator'} /> */}
            <Button disable={!registerButtonEnabled} text={'Next'} onClick={onRegisterClick} />
          </Grid>,
        ]}
      />
    );
};

export default observer(GenerateOperatorKeys);
