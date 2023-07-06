import * as _ from 'lodash';
import { makeObservable, observable } from 'mobx';
import BaseStore from '~app/common/stores/BaseStore';
import {
    exceptions,
    exceptionsField,
    FIELD_CONDITIONS,
    FIELD_KEYS,
    FieldEntity,
    FIELDS,
    isLink,
} from '~lib/utils/operatorMetadataHelper';

class OperatorMetadataStore extends BaseStore  {
    operatorMetadataList: Map<string, FieldEntity> = new Map<string, FieldEntity>();

    constructor() {
        super();
        makeObservable(this, {
            operatorMetadataList: observable,
            getMetadataValue: observable,
            setMetadataValue: observable,

        });
    }

    initMetadata(operator: any) {
        const metadata = new Map<string, FieldEntity>();
        Object.values(FIELD_KEYS).forEach(key => {
           if (exceptionsField.includes(key)){
               metadata.set(key, { ...FIELDS[key], value: operator[exceptions[key]] });
           } else {
                metadata.set(key, { ...FIELDS[key], value: operator[_.snakeCase(key)] });
            }
        });
        this.operatorMetadataList = metadata;
    }

    getMetadata(key: string) {
        return this.operatorMetadataList.get(key)!;
    }

    setMetadata(key: string, value: FieldEntity) {
        this.operatorMetadataList.set(key, value);
    }

    getMetadataValue(key: string) {
        return this.operatorMetadataList.get(key)!.value;
    }

    setMetadataValue(key: string, value: string | string[]) {
        const data = this.operatorMetadataList.get(key)!;
        data.value = value;
        this.operatorMetadataList.set(key, data);
        return data.value;
    }

    setErrorMessage(key: string, message: string) {
        const data = this.operatorMetadataList.get(key)!;
        data.errorMessage = message;
        this.operatorMetadataList.set(key, data);
    }

    refreshMetadata() {
        const metadata = new Map<string, FieldEntity>();
        Object.values(FIELD_KEYS).forEach(key => metadata.set(key, { ...FIELDS[key] }));
        this.operatorMetadataList = metadata;
    }

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

    validateOperatorMetaData() {
        let metadataContainsError = false;
        for (const [key, fieldEntity] of this.operatorMetadataList.entries()) {
            const condition = FIELD_CONDITIONS[key];
            if (condition && fieldEntity) {
                if (key === FIELD_KEYS.OPERATOR_NAME && fieldEntity.value?.length === 0) {
                    this.setErrorMessage(key, 'Required field');
                    metadataContainsError = true;
                } else if (fieldEntity.value?.length > condition.maxLength) {
                    this.setErrorMessage(key, condition.errorMessage);
                    metadataContainsError = true;
                } else {
                    this.setErrorMessage(key, '');
                }
            } else if ([FIELD_KEYS.LINKEDIN_URL, FIELD_KEYS.WEBSITE_URL, FIELD_KEYS.TWITTER_URL].includes(key) && typeof fieldEntity.value === 'string') {
                const res = isLink(fieldEntity.value);
                if (fieldEntity.value && res){
                    metadataContainsError = true;
                    this.setErrorMessage(key, 'Must be link');
                } else {
                    this.setErrorMessage(key, '');
                }
            }
        }
        return metadataContainsError;
    }
}

export default OperatorMetadataStore;
