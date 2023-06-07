import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import TextInput from '~app/components/common/TextInput';
import InputLabel from '~app/components/common/InputLabel';
import BorderScreen from '~app/components/common/BorderScreen';
import ErrorMessage from '~app/components/common/ErrorMessage';
import PrimaryButton from '~app/components/common/Button/PrimaryButton';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import ProcessStore, { SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/changeOperatorName/ChangeOperatorName.styles';

const ChangeOperatorName = () => {
    const stores = useStores();
    const classes = useStyles();
    const navigate = useNavigate();
    const walletStore: WalletStore = stores.Wallet;
    const processStore: ProcessStore = stores.Process;
    const myAccountStore: MyAccountStore = stores.MyAccount;
    const applicationStore: ApplicationStore = stores.Application;
    const process: SingleOperator = processStore.getProcess;
    const operator = process?.item;
    const [errorMessage, setErrorMessage] = useState('');
    const [readOnlyState, setReadOnlyState] = useState(true);
    const [isAddressValid, setIsAddressValid] = useState(true);
    setIsAddressValid;
    const [userInput, setUserInput] = useState(operator.name);

    const submitOperatorName = async () => {

        applicationStore.setIsLoading(true);
        const signatureHash = await walletStore.web3.eth.personal.sign(userInput, walletStore.accountAddress);
        setErrorMessage('');
        Operator.getInstance().updateOperatorName(operator.id, signatureHash, userInput).then((response) => {
            operator.name = response;
            applicationStore.setIsLoading(false);
            const selectedOperator = myAccountStore.ownerAddressOperators.find((op: any) => op.id === operator.id);
            selectedOperator.name = response;
            console.log(response);
            navigate(-1);
        }).catch((error: any) => {
            console.log('<<<<<<<<<<<error>>>>>>>>>>>');
            setErrorMessage(error.response.data.error.message);
            console.log('<<<<<<<<<<<error>>>>>>>>>>>');
            applicationStore.setIsLoading(false);
        });
    };


    const setOperatorName = async (e: any) => {
        const textInput = e.target.value.trim();
        setUserInput(textInput);
    };

    const submitDisable = userInput.length === 0;

    return (
        <BorderScreen
            blackHeader
            header={'Change Operator Name'}
            body={[
                (
                    <Grid container item>
                        <Grid container style={{ gap: 24 }}>
                            <Grid item className={classes.Text}>
                                {/*Enter an Ethereum address that will receive all of your validators block proposal rewards. <LinkText text={'What are proposal rewards?'} link={'http://google.com'} />*/}
                            </Grid>
                        </Grid>
                        <Grid container gap={{ gap: 17 }}>
                            <Grid item container>
                                <InputLabel title="Operator Name"/>
                                <TextInput
                                    value={userInput}
                                    disable={readOnlyState}
                                    showError={!isAddressValid}
                                    data-testid="new-operator-name"
                                    onChangeCallback={setOperatorName}
                                    icon={<Grid onClick={() => setReadOnlyState(false)} className={classes.EditIcon}/>}
                                />
                            </Grid>
                            {errorMessage && <ErrorMessage text={errorMessage} extendClasses={classes.Error}/>}
                            <PrimaryButton disable={readOnlyState || submitDisable} text={'Update'}
                                           submitFunction={submitOperatorName}/>
                        </Grid>
                    </Grid>
                ),
            ]}
        />
    );
};

export default observer(ChangeOperatorName);
