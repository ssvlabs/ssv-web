import { useAppDispatch, useAppSelector } from '~app/hooks/redux.hook.ts';
import { getMetadata } from '~app/redux/operatorMetadata.slice.ts';
import { FIELD_KEYS, HTTPS_PREFIX, processField, sortMevRelays } from '~lib/utils/operatorMetadataHelper.ts';

export const fieldsToValidateSignature = [
  FIELD_KEYS.OPERATOR_NAME,
  FIELD_KEYS.DESCRIPTION,
  FIELD_KEYS.LOCATION,
  FIELD_KEYS.SETUP_PROVIDER,
  FIELD_KEYS.EXECUTION_CLIENT,
  FIELD_KEYS.CONSENSUS_CLIENT,
  FIELD_KEYS.MEV_RELAYS,
  FIELD_KEYS.WEBSITE_URL,
  FIELD_KEYS.TWITTER_URL,
  FIELD_KEYS.LINKEDIN_URL,
  FIELD_KEYS.DKG_ADDRESS,
  FIELD_KEYS.OPERATOR_IMAGE
];

export const useOperatorMetadataStore = () => {
  const dispatch = useAppDispatch();
  const metadata = useAppSelector(getMetadata);

  // return payload for transaction
  const createMetadataPayload = (): Record<string, string> => {
    const payload: Record<string, string> = {};
    fieldsToValidateSignature.forEach((field: string) => {
      let value = metadata.get(field)!.value;
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
    for (const [metadataFieldName, fieldEntity] of metadata.entries()) {
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
