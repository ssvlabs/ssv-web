import { Typography } from '@mui/material';
import { sha256 } from 'js-sha256';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignMessage } from 'wagmi';
import { PrimaryButton } from '~app/atomicComponents';
import config from '~app/common/config';
import { useStyles } from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/EditOperatorDetails.styles';
import FieldWrapper from '~app/components/applications/SSV/MyAccount/components/EditOperatorDetails/FieldWrapper';
import BorderScreen from '~app/components/common/BorderScreen';
import { ButtonSize } from '~app/enums/Button.enum';
import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook';
import { useOperatorMetadataStore } from '~app/hooks/useOperatorMetadataStore.ts';
import { fetchOperators, getSelectedOperator } from '~app/redux/account.slice';
import { selectMetadata, updateOperatorLocations, updateOperatorNodeOptions } from '~app/redux/operatorMetadata.slice.ts';
import { getIsContractWallet } from '~app/redux/wallet.slice';
import { FIELD_KEYS, fieldsToValidateSignature } from '~lib/utils/operatorMetadataHelper';
import { updateOperatorMetadata } from '~root/services/operator.service';

const EditOperatorDetails = () => {
  const navigate = useNavigate();
  const classes = useStyles({});
  const operator = useAppSelector(getSelectedOperator)!;
  const [errorMessage, setErrorMessage] = useState(['']);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isContractWallet = useAppSelector(getIsContractWallet);

  const signMessage = useSignMessage();

  const { validateOperatorMetaData, createMetadataPayload } = useOperatorMetadataStore();

  useEffect(() => {
    dispatch(updateOperatorLocations());
    dispatch(updateOperatorNodeOptions());
  }, []);

  const metadataString = JSON.stringify(useAppSelector(selectMetadata));

  useEffect(() => {
    setButtonDisable(validateOperatorMetaData());
  }, [metadataString]);

  const submitHandler = async () => {
    const isNotValidity = validateOperatorMetaData();
    setButtonDisable(isNotValidity);
    if (!isNotValidity) {
      const payload = createMetadataPayload();
      const rawDataToValidate: string[] = [];
      fieldsToValidateSignature.forEach((field) => {
        if (payload[field]) {
          const newItem = field === FIELD_KEYS.OPERATOR_IMAGE ? `logo:sha256:${sha256(payload[field])}` : payload[field];
          rawDataToValidate.push(newItem);
        }
      });
      setIsLoading(true);
      let signatureHash;
      try {
        signatureHash = await signMessage.signMessageAsync({
          message: rawDataToValidate.join(',')
        });
        setErrorMessage(['']);
      } catch (e: any) {
        console.log(`Error message: ${e.message}`);
        setErrorMessage(['You must confirm the signature request through your wallet']);
        setIsLoading(false);
        return;
      }
      const updateOperatorResponse = await updateOperatorMetadata(operator?.id ?? 0, signatureHash, payload, isContractWallet);
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
        ...Object.values(FIELD_KEYS).map((key: FIELD_KEYS) => {
          return <FieldWrapper fieldKey={key} />;
        }),
        ...errorMessage.map((error) => <Typography className={classes.ErrorMessage}>{error}</Typography>),
        <PrimaryButton text={'Update'} isDisabled={buttonDisable} isLoading={isLoading} onClick={submitHandler} size={ButtonSize.XL} />
      ]}
    />
  );
};

export default EditOperatorDetails;
