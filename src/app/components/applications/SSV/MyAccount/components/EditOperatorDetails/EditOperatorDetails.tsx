import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper';
import WalletStore from '~app/common/stores/applications/SsvWeb/Wallet.store';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import ApplicationStore from '~app/common/stores/applications/SsvWeb/Application.store';
import OperatorMetadataStore from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import ProcessStore, { SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';
import FieldWrapper from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/FieldWrapper';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';

const EditOperatorDetails = () => {
    const classes = useStyles({});
    const stores = useStores();
    const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
    const applicationStore: ApplicationStore = stores.Application;
    const myAccountStore: MyAccountStore = stores.MyAccount;
    const walletStore: WalletStore = stores.Wallet;
    const processStore: ProcessStore = stores.Process;
    const process: SingleOperator =  processStore.getProcess;
    const operator = process?.item;
    const [buttonDisable, setButtonDisable] = useState<boolean>(false);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
            if (buttonDisable) {
            setButtonDisable(metadataStore.validateOperatorMetaData());
        }
    }, [JSON.stringify(metadataStore.operatorMetadataList)]);

    const submitHandler = async () => {
        setButtonDisable(metadataStore.validateOperatorMetaData());

        if (!buttonDisable) {
            let payload = metadataStore.createMetadataPayload();
            let rawDataToValidate: any = [];
            Object.values(payload).map(value =>
                rawDataToValidate.push(value),
            );
            
            rawDataToValidate = rawDataToValidate.join('|');
            applicationStore.setIsLoading(true);

            const signatureHash = await walletStore.web3.eth.personal.sign(rawDataToValidate, walletStore.accountAddress);
            await Operator.getInstance().updateOperatorMetadata(operator.id, signatureHash, payload).then((response) => {
                operator.name = response.name;
                applicationStore.setIsLoading(false);
                const selectedOperator = myAccountStore.ownerAddressOperators.find((op: any) => op.id === operator.id);
                selectedOperator.name = response.name;
                navigate(-1);
            }).catch((error: any) => {
                setErrorMessage(error.response.data.error.message);
                applicationStore.setIsLoading(false);
            });
        }
    };

    return (
        <BorderScreen
            wrapperClass={classes.bodyWrapperClass}
            withoutBorderBottom={true}
            sectionClass={classes.sectionWrapperClass}
            blackHeader
            header={'Edit details'}
            body={[
            ...Object.values(FIELD_KEYS).map((key: string) =>{
                return (<FieldWrapper fieldKey={key} />);
            }),
                <Typography className={classes.ErrorMessage}>{errorMessage}</Typography>,
                <PrimaryButton text={'Update'}
                               disable={buttonDisable}
                               wrapperClass={classes.marginBottom}
                               submitFunction={submitHandler}/>,
        ]}
        />
    );
};

export default observer(EditOperatorDetails);
