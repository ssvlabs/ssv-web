import { Typography } from '@mui/material';
import { sha256 } from 'js-sha256';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignMessage } from 'wagmi';
import { PrimaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import OperatorMetadataStore, { fieldsToValidateSignature } from '~app/common/stores/applications/SsvWeb/OperatorMetadata.store';
import ProcessStore from '~app/common/stores/applications/SsvWeb/Process.store';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import FieldWrapper from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/FieldWrapper';
import BorderScreen from '~app/components/common/BorderScreen';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useStores } from '~app/hooks/useStores';
import { IOperator } from '~app/model/operator.model';
import { SingleOperator } from '~app/model/processes.model';
import { fetchOperators } from '~app/redux/account.slice';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { FIELD_KEYS } from '~lib/utils/operatorMetadataHelper';
import { updateOperatorMetadata } from '~root/services/operator.service';

const EditOperatorDetails = () => {
  const stores = useStores();
  const navigate = useNavigate();
  const classes = useStyles({});
  const processStore: ProcessStore = stores.Process;
  const metadataStore: OperatorMetadataStore = stores.OperatorMetadata;
  const process: SingleOperator = processStore.getProcess;
  const operator: IOperator = process?.item;
  const [errorMessage, setErrorMessage] = useState(['']);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);

  const signMessage = useSignMessage();

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
      const payload = metadataStore.createMetadataPayload();
      let rawDataToValidate: any = [];
      fieldsToValidateSignature.forEach((field) => {
        if (payload[field]) {
          const newItem = field === FIELD_KEYS.OPERATOR_IMAGE ? `logo:sha256:${sha256(payload[field])}` : payload[field];
          rawDataToValidate.push(newItem);
        }
      });
      rawDataToValidate = rawDataToValidate.join(',');
      setIsLoading(true);
      let signatureHash;
      try {
        signatureHash = await signMessage.signMessageAsync({
          message: rawDataToValidate
        });
        setErrorMessage(['']);
      } catch (e: any) {
        console.log(`Error message: ${e.message}`);
        setErrorMessage(['You must confirm the signature request through your wallet']);
        setIsLoading(false);
        return;
      }
      const updateOperatorResponse = await updateOperatorMetadata(operator.id, signatureHash, payload, isContractWallet);
      if (updateOperatorResponse.data) {
        dispatch(fetchOperators({}));
        navigate(config.routes.SSV.MY_ACCOUNT.OPERATOR.META_DATA_CONFIRMATION);
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
          return <FieldWrapper fieldKey={key} />;
        }),
        ...errorMessage.map((error) => <Typography className={classes.ErrorMessage}>{error}</Typography>),
        <PrimaryButton text={'Update'} isDisabled={buttonDisable} isLoading={isLoading} onClick={submitHandler} size={ButtonSize.XL} />
      ]}
    />
  );
};

export default observer(EditOperatorDetails);
