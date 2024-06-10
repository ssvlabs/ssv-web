import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { selectMetadata } from '~app/redux/operatorMetadata.slice.ts';
import { FIELD_KEYS, fieldsToValidateSignature, HTTPS_PREFIX, MetadataEntity, processField, sortMevRelays } from '~lib/utils/operatorMetadataHelper.ts';

export const useOperatorMetadataStore = () => {
  const dispatch = useAppDispatch();
  const metadata = useAppSelector(selectMetadata);

  // return payload for transaction
  const createMetadataPayload = (): Record<string, string> => {
    const payload: Record<string, string> = {};
    fieldsToValidateSignature.forEach((field: FIELD_KEYS) => {
      let value = metadata[field].value;
      if (field === FIELD_KEYS.MEV_RELAYS && typeof value !== 'string') {
        value = sortMevRelays(value);
      } else if (field === FIELD_KEYS.DKG_ADDRESS && value === HTTPS_PREFIX) {
        value = '';
      }
      payload[field] = value || '';
    });
    return payload;
  };

  // validate metadata values
  const validateOperatorMetaData = (): boolean => {
    let metadataContainsError = false;
    for (const [metadataFieldName, fieldEntity] of Object.entries(metadata) as [FIELD_KEYS, MetadataEntity][]) {
      if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE) {
        metadataContainsError = !!fieldEntity.errorMessage || metadataContainsError;
      } else {
        metadataContainsError = processField(metadataFieldName, fieldEntity, metadataContainsError, dispatch);
      }
    }
    return metadataContainsError;
  };

  return { createMetadataPayload, validateOperatorMetaData };
};
