import React, { useEffect, useState } from 'react';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '~app/common/config';
import { useStores } from '~app/hooks/useStores';
import BorderScreen from '~app/components/common/BorderScreen';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper';
import MyAccountStore from '~app/common/stores/applications/SsvWeb/MyAccount.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import FieldWrapper from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/FieldWrapper';
import {
  useStyles,
} from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import OperatorMetadataStore, {
  fieldsToValidateSignature,
} from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import { getContractByName } from '~root/services/contracts.service';
import { EContractName } from '~app/model/contracts.model';
import { updateOperatorMetadata } from '~root/services/operator.service';
import { IOperator } from '~app/model/operator.model';
import { SingleOperator } from '~app/model/processes.model';
import PrimaryButton from '~app/atomicComponents/PrimaryButton';
import { ButtonSize } from '~app/enums/Button.enum';

const EditOperatorDetails = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles({});
  const processStore: ProcessStore = stores.Process;
  const myAccountStore: MyAccountStore = stores.MyAccount;
  const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
  const process: SingleOperator = processStore.getProcess;
  let operator: IOperator = process?.item;
  const [errorMessage, setErrorMessage] = useState(['']);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      let signatureHash;
      try {
        const contract = getContractByName(EContractName.SETTER);
        signatureHash = await contract.signer.signMessage(rawDataToValidate);
        setErrorMessage(['']);
      } catch (e: any) {
        console.log(`Error message: ${e.message}`);
        setErrorMessage(['You must confirm the signature request through your wallet']);
        setIsLoading(false);
        return;
      }
      const updateOperatorResponse = await updateOperatorMetadata(operator.id, signatureHash, payload);
      if (updateOperatorResponse.data) {
        let selectedOperator = myAccountStore.ownerAddressOperators.find((op: any) => op.id === operator.id);
        if (selectedOperator) {
          operator = { ...operator, ...updateOperatorResponse.data };
          Object.assign(selectedOperator, updateOperatorResponse.data);
          navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.META_DATA_CONFIRMATION);
        } else {
          setErrorMessage([updateOperatorResponse.error || 'Update metadata failed']);
        }
      } else {
        setErrorMessage([updateOperatorResponse.error || 'Update metadata failed']);
      }
      setIsLoading(false);
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
        <PrimaryButton text={'Update'}
                       isDisabled={buttonDisable}
                       isLoading={isLoading}
                       onClick={submitHandler}
                       size={ButtonSize.XL}/>,
      ]}
    />
  );
};

export default observer(EditOperatorDetails);
