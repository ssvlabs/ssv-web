import React, { useEffect, useState } from 'react';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import Operator from '~lib/api/Operator';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import PrimaryButton from '~app/components/common/Button/PrimaryButton/PrimaryButton';
import ProcessStore, { SingleOperator } from '~app/common/stores/applications/SsvWeb/Process.store';
import FieldWrapper from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/FieldWrapper';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import OperatorMetadataStore, {
  fieldsToValidateSignature,
} from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { isSuccessful } from '~root/services/httpApi.service';
import { useAppDispatch } from '~app/hooks/redux.hook';
import { setIsLoading } from '~app/redux/appState.slice';

const EditOperatorDetails = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles({});
  const processStore: ProcessStore = stores.Process;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
  const process: SingleOperator = processStore.getProcess;
  const operator = process?.item;
  const [errorMessage, setErrorMessage] = useState(['']);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await metadataStore.updateOperatorLocations();
      await metadataStore.updateOperatorNodeOptions();
    })();
  }, []);

  useEffect(() => {
    setButtonDisable(metadataStore.validateOperatorMetaData());
  }, [JSON.stringify(metadataStore.metadata)]);

  const submitHandler = async () => {
    const isNotValidity = metadataStore.validateOperatorMetaData();
    setButtonDisable(isNotValidity);
    if (!isNotValidity) {
      let payload = metadataStore.createMetadataPayload();
      let rawDataToValidate: any = [];
      fieldsToValidateSignature.forEach(field => {
        if (payload[field]) {
          const newItem =
            field === FIELD_KEYS.OPERATOR_IMAGE ? `logo:sha256:${sha256(payload[field])}` : payload[field];
          rawDataToValidate.push(newItem);
        }
      });
      rawDataToValidate = rawDataToValidate.join(',');
      dispatch(setIsLoading(true));
      let signatureHash;
      try {
        const contract = getContractByName(EContractName.SETTER);
        signatureHash = await contract.signer.signMessage(rawDataToValidate);
        setErrorMessage(['']);
      } catch (e: any) {
        console.log(`Error message: ${e.message}`);
        setErrorMessage(['You must confirm the signature request through your wallet']);
        dispatch(setIsLoading(false));
        return;
      }
      const updateOperatorResponse = await Operator.getInstance().updateOperatorMetadata(operator.id, signatureHash, payload);
      if (isSuccessful(updateOperatorResponse)) {
        const selectedOperator = myAccountStore.ownerAddressOperators.find((op: any) => op.id === operator.id);
        for (let key in updateOperatorResponse.data) {
          operator[key] = updateOperatorResponse.data[key];
          selectedOperator[key] = updateOperatorResponse.data[key];
        }
        navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.META_DATA_CONFIRMATION);
      } else {
        setErrorMessage([updateOperatorResponse.error || 'Update metadata failed']);
      }
      dispatch(setIsLoading(false));
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
        ...Object.values(FIELD_KEYS).map((key: string) => {
          return (<FieldWrapper fieldKey={key}/>);
        }),
        ...errorMessage.map(error => <Typography className={classes.ErrorMessage}>{error}</Typography>),
        <PrimaryButton children={'Update'}
                       disable={buttonDisable}
                       wrapperClass={classes.marginBottom}
                       submitFunction={submitHandler}/>,
      ]}
    />
  );
};

export default observer(EditOperatorDetails);
