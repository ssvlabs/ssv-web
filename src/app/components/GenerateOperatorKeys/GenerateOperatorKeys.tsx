import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useStores } from '~app/hooks/useStores';
// import Checkbox from '~app/common/components/CheckBox';
import TextInput from '~app/common/components/TextInput';
import config, { translations } from '~app/common/config';
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
import BorderScreen from '~app/components/MyAccount/common/componenets/BorderScreen';
import HeaderSubHeader from '~app/common/components/HeaderSubHeader';
import PrimaryButton from '~app/common/components/PrimaryButton';
// import SecondaryButton from '~app/common/components/SecondaryButton/SecondaryButton';

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
      <BorderScreen
        navigationLink={config.routes.OPERATOR.HOME}
        body={[
          <Grid container>
            <HeaderSubHeader title={translations.OPERATOR.REGISTER.TITLE}
              subtitle={translations.OPERATOR.REGISTER.DESCRIPTION} />
            <Grid container direction={'column'}>
              <Grid item className={classes.gridItem}>
                <InputLabel title="Owner Address" withHint
                  toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_ADDRESS} />
                <TextInput
                  disable
                  data-testid="new-operator-address"
                  value={walletStore.accountAddress}
                  onBlur={(event: any) => { validateAddressInput(event.target.value, setAddressError); }}
                />
                {addressError.shouldDisplay &&
                <Typography className={classes.textError}>{addressError.errorMessage}</Typography>}
              </Grid>
              <Grid item className={classes.gridItem}>
                <InputLabel title="Display Name" />
                <TextInput
                  data-testid="new-operator-name"
                  showError={displayNameError.shouldDisplay}
                  onChange={(event: any) => { onInputChange('name', event.target.value); }}
                  onBlur={(event: any) => { validateDisplayNameInput(event.target.value, setDisplayNameError); }}
                />
                {displayNameError.shouldDisplay &&
                <Typography className={classes.textError}>{displayNameError.errorMessage}</Typography>}
              </Grid>
              <Grid item className={classes.gridItem}>
                <InputLabel
                  title="Operator Public Key"
                  withHint
                  toolTipText={(
                    <div>{translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
                      <a target={'_blank'} href={'https://docs.ssv.network/operators/install-instructions'}>documentation.</a>
                    </div>
                  )}
                  toolTipLink={config.links.TOOL_TIP_KEY_LINK}
                />
                <TextInput
                  value={inputsData.publicKey}
                  dataTestId={'new-operator-key'}
                  showError={publicKeyError.shouldDisplay}
                  onChange={(event: any) => { onInputChange('publicKey', event.target.value); }}
                  onBlur={(event: any) => { validatePublicKeyInput(event.target.value, setPublicKeyError); }}
                />
                {publicKeyError.shouldDisplay &&
                <Typography className={classes.textError}>{publicKeyError.errorMessage}</Typography>}
              </Grid>
              {operatorExist && <MessageDiv text={translations.OPERATOR.OPERATOR_EXIST} />}
              {process.env.REACT_APP_NEW_STAGE && (
                <Grid item className={classes.gridItem}>
                  <InputLabel
                    title="yearly fee per validator"
                    withHint
                    toolTipText={translations.OPERATOR.REGISTER.TOOL_TIP_KEY}
                    toolTipLink={config.links.TOOL_TIP_KEY_LINK}
                  />
                  <TextInput
                    withSideText
                    value={inputsData.fee}
                    dataTestId={'new-operator-fee'}
                    showError={feeError.shouldDisplay}
                    onChange={(event: any) => { onInputChange('fee', event.target.value); }}
                    onBlur={(event: any) => { validateFeeInput(event.target.value, setFeeError); }}
                  />
                  {feeError.shouldDisplay &&
                  <Typography className={classes.textError}>{feeError.errorMessage}</Typography>}
                </Grid>
              )}
            </Grid>
            {/* <Checkbox onClickCallBack={setUserAgreement} text={'I understand that running my validator simultaneously in multiple setups will cause slashing to my validator'} /> */}
            <PrimaryButton disable={!registerButtonEnabled} text={'Next'} onClick={onRegisterClick} />
          </Grid>,
        ]}
      />
    );
};

export default observer(GenerateOperatorKeys);
