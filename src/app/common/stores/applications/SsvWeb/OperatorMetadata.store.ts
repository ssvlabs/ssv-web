import * as _ from 'lodash';
import { makeObservable, observable } from 'mobx';
import { translations } from '~app/common/config';
import {
  camelToSnakeFieldsMapping,
  CountryType,
  exceptions,
  FIELD_CONDITIONS,
  FIELD_KEYS,
  FIELDS,
  HTTPS_PREFIX,
  isDkgAddressValid,
  isValidLink,
  MetadataEntity,
  OPERATOR_NODE_TYPES,
  sortMevRelays
} from '~lib/utils/operatorMetadataHelper';
import { checkSpecialCharacters } from '~lib/utils/strings';
import { getOperatorAvailableLocations, getOperatorNodes } from '~root/services/operator.service';

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

class OperatorMetadataStore {
  metadata: Map<string, MetadataEntity> = new Map<string, MetadataEntity>();
  locationsData: CountryType[] = [];
  locationsList: Record<string, string> = {};

  constructor() {
    makeObservable(this, {
      locationsList: observable,
      locationsData: observable,
      metadata: observable,
      getMetadataValue: observable,
      setMetadataValue: observable
    });
  }

  // Init operator metadata
  initMetadata(operator: any) {
    const metadata = new Map<string, MetadataEntity>();
    Object.values(FIELD_KEYS).forEach((metadataFieldName) => {
      if (camelToSnakeFieldsMapping.includes(metadataFieldName)) {
        if (metadataFieldName === FIELD_KEYS.MEV_RELAYS) {
          metadata.set(metadataFieldName, {
            ...FIELDS[metadataFieldName],
            value: operator[exceptions[metadataFieldName]!].split(',') || ''
          });
        } else {
          metadata.set(metadataFieldName, {
            ...FIELDS[metadataFieldName],
            value: operator[exceptions[metadataFieldName]!] || ''
          });
        }
      } else {
        if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE) {
          metadata.set(metadataFieldName, {
            ...FIELDS[metadataFieldName],
            imageFileName: operator[metadataFieldName] || ''
          });
        } else {
          metadata.set(metadataFieldName, {
            ...FIELDS[metadataFieldName],
            value: operator[_.snakeCase(metadataFieldName)] || ''
          });
        }
      }
    });
    this.metadata = metadata;
  }

  async updateOperatorNodeOptions() {
    for (const key of Object.keys(OPERATOR_NODE_TYPES) as (keyof typeof OPERATOR_NODE_TYPES)[]) {
      const options = await getOperatorNodes(OPERATOR_NODE_TYPES[key]);
      const data = this.metadata.get(key);
      data!.options = options;
      this.metadata.set(key, data!);
    }
  }

  async updateOperatorLocations() {
    const options: CountryType[] = await getOperatorAvailableLocations();
    options.forEach((option: CountryType) => (this.locationsList[`${option.name} (${option['alpha-3']})`] = option.name));
    this.locationsData = options;
  }

  // return metadata entity by metadata field name
  getMetadataEntity(metadataFieldName: string) {
    return this.metadata.get(metadataFieldName)!;
  }

  // set metadata entity by field name
  setMetadataEntity(metadataFieldName: string, value: MetadataEntity) {
    this.metadata.set(metadataFieldName, value);
  }

  // return metadata value by metadata field name
  getMetadataValue(metadataFieldName: string) {
    return this.metadata.get(metadataFieldName)!.value;
  }

  // set metadata value by metadata field name
  setMetadataValue(metadataFieldName: string, value: string | string[]) {
    const data = this.metadata.get(metadataFieldName)!;
    data.value = value;
    this.metadata.set(metadataFieldName, data);
    return data.value;
  }

  // set field error message
  setErrorMessage(metadataFieldName: string, message: string) {
    const data = this.metadata.get(metadataFieldName)!;
    data.errorMessage = message;
    this.metadata.set(metadataFieldName, data);
  }

  // return payload for transaction
  createMetadataPayload() {
    const payload: Record<string, string> = {};
    fieldsToValidateSignature.forEach((field: string) => {
      let value = this.getMetadataValue(field);
      if (field === FIELD_KEYS.MEV_RELAYS && typeof value !== 'string') {
        value = sortMevRelays(value);
      } else if (field === FIELD_KEYS.DKG_ADDRESS && value === HTTPS_PREFIX) {
        value = '';
      }
      payload[field] = value || '';
    });
    return payload;
  }

  // validate metadata values
  validateOperatorMetaData() {
    let metadataContainsError = false;
    for (const [metadataFieldName, fieldEntity] of this.metadata.entries()) {
      if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE) {
        metadataContainsError = !!fieldEntity.errorMessage || metadataContainsError;
      } else {
        metadataContainsError = this.processField(metadataFieldName, fieldEntity, metadataContainsError);
      }
    }
    return metadataContainsError;
  }

  checkWithConditions(metadataFieldName: string, fieldEntity: MetadataEntity) {
    const condition = FIELD_CONDITIONS[metadataFieldName];
    const response = {
      result: false,
      errorMessage: ''
    };

    if (condition) {
      const innerConditions = [
        {
          condition: metadataFieldName === FIELD_KEYS.OPERATOR_NAME && fieldEntity.value?.length === 0,
          response: translations.OPERATOR_METADATA.REQUIRED_FIELD_ERROR
        },
        {
          condition: fieldEntity.value?.length > condition.maxLength,
          response: condition.errorMessage
        },
        {
          condition: fieldEntity.value && !checkSpecialCharacters(fieldEntity.value),
          response: translations.OPERATOR_METADATA.SPECIAL_CHARACTERS_ERROR
        }
      ];
      for (const innerCondition of innerConditions) {
        if (innerCondition.condition) {
          response.result = innerCondition.condition;
          response.errorMessage = innerCondition.response;
        }
      }
    }
    return response;
  }

  checkExceptionFields(fieldName: string, value: any): boolean {
    return [FIELD_KEYS.LINKEDIN_URL, FIELD_KEYS.WEBSITE_URL, FIELD_KEYS.TWITTER_URL, FIELD_KEYS.DKG_ADDRESS].includes(fieldName as FIELD_KEYS) && typeof value === 'string';
  }

  checkFieldValue(metadataFieldName: string, fieldValue: string) {
    if (metadataFieldName === FIELD_KEYS.DKG_ADDRESS) {
      return {
        result: !isDkgAddressValid(fieldValue, true),
        errorMessage: translations.OPERATOR_METADATA.DKG_ADDRESS_ERROR
      };
    } else {
      return {
        result: !isValidLink(fieldValue),
        errorMessage: translations.OPERATOR_METADATA.LINK_ERROR
      };
    }
  }

  processField(metadataFieldName: string, fieldEntity: MetadataEntity, metadataContainsError: boolean) {
    const exceptionField = this.checkExceptionFields(metadataFieldName, fieldEntity.value);
    const { result, errorMessage } = exceptionField ? this.checkFieldValue(metadataFieldName, fieldEntity.value) : this.checkWithConditions(metadataFieldName, fieldEntity);

    if (fieldEntity.value && result) {
      this.setErrorMessage(metadataFieldName, errorMessage);
      return true;
    } else {
      this.setErrorMessage(metadataFieldName, '');
      return metadataContainsError;
    }
  }
}

export const operatorMetadataStore = new OperatorMetadataStore();
export default OperatorMetadataStore;
