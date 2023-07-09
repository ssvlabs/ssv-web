import * as _ from 'lodash';
import { makeObservable, observable } from 'mobx';
import { translations } from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import {
    exceptions,
    camelToSnakeFieldsMapping,
    FIELD_CONDITIONS,
    FIELD_KEYS,
    MetadataEntity,
    FIELDS,
    isLink,
} from '~lib/utils/operatorMetadataHelper';

class OperatorMetadataStore extends BaseStore  {
    metadata: Map<string, MetadataEntity> = new Map<string, MetadataEntity>();

    constructor() {
        super();
        makeObservable(this, {
            metadata: observable,
            getMetadataValue: observable,
            setMetadataValue: observable,
        });
    }

    // Init operator metadata
    initMetadata(operator: any) {
        const metadata = new Map<string, MetadataEntity>();
        Object.values(FIELD_KEYS).forEach(metadataFieldName => {
           if (camelToSnakeFieldsMapping.includes(metadataFieldName)){
               if (metadataFieldName === FIELD_KEYS.MEV_RELAYS) {
                   metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], value: operator[exceptions[metadataFieldName]].split(',') });
               } else {
                   metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], value: operator[exceptions[metadataFieldName]] });
               }
           } else {
               if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE){
                   metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], imageFileName: operator[metadataFieldName] });
               } else {
                   metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], value: operator[_.snakeCase(metadataFieldName)] });
               }
            }
        });
        this.metadata = metadata;
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
        const fieldsToValidateSignature = [
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
            FIELD_KEYS.OPERATOR_IMAGE,
        ];
        let payload: Record<string, string> = {};
        fieldsToValidateSignature.forEach((field: string) => {
            let value = this.getMetadataValue(field);
            if (field === FIELD_KEYS.MEV_RELAYS && typeof value !== 'string') {
                value = value.join(',');
            }
            if (value) {
                payload[field] = value;
            }
        });
        return payload;
    }

    // validate metadata values
    validateOperatorMetaData() {
        let metadataContainsError = false;
        for (const [metadataFieldName, fieldEntity] of this.metadata.entries()) {
            const condition = FIELD_CONDITIONS[metadataFieldName];
            if (condition && fieldEntity) {
                if (metadataFieldName === FIELD_KEYS.OPERATOR_NAME && fieldEntity.value?.length === 0) {
                    this.setErrorMessage(metadataFieldName, translations.OPERATOR_METADATA.REQUIRED_FIELD_ERROR);
                    metadataContainsError = true;
                } else if (fieldEntity.value?.length > condition.maxLength) {
                    this.setErrorMessage(metadataFieldName, condition.errorMessage);
                    metadataContainsError = true;
                } else {
                    this.setErrorMessage(metadataFieldName, '');
                }
            } else if ([FIELD_KEYS.LINKEDIN_URL, FIELD_KEYS.WEBSITE_URL, FIELD_KEYS.TWITTER_URL].includes(metadataFieldName) && typeof fieldEntity.value === 'string') {
                const res = isLink(fieldEntity.value);
                if (fieldEntity.value && res){
                    metadataContainsError = true;
                    this.setErrorMessage(metadataFieldName, translations.OPERATOR_METADATA.LINK_ERROR);
                } else {
                    this.setErrorMessage(metadataFieldName, '');
                }
            }  else if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE) {
                metadataContainsError = !!fieldEntity.errorMessage;
            }
        }
        return metadataContainsError;
    }
}

export default OperatorMetadataStore;
