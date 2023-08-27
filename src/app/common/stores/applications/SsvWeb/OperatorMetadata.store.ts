import * as _ from 'lodash';
import { makeObservable, observable } from 'mobx';
import Operator from '~lib/api/Operator';
import { translations } from '~app/common/config';
import BaseStore from '~app/common/stores/BaseStore';
import { checkSpecialCharacters } from '~lib/utils/strings';
import {
    exceptions,
    camelToSnakeFieldsMapping,
    FIELD_CONDITIONS,
    FIELD_KEYS,
    MetadataEntity,
    FIELDS,
    isLink,
    OPERATOR_NODE_TYPES, CountryType, checkDkgAddress,
} from '~lib/utils/operatorMetadataHelper';

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
    FIELD_KEYS.OPERATOR_IMAGE,
];

class OperatorMetadataStore extends BaseStore  {
    metadata: Map<string, MetadataEntity> = new Map<string, MetadataEntity>();
    locationsData: CountryType[] = [];
    locationsList: Record<string, string> = {};

    constructor() {
        super();
        makeObservable(this, {
            locationsList: observable,
            locationsData: observable,
            metadata: observable,
            getMetadataValue: observable,
            setMetadataValue: observable,
        });
    }

    // Init operator metadata
    async initMetadata(operator: any) {
        const metadata = new Map<string, MetadataEntity>();
        Object.values(FIELD_KEYS).forEach(metadataFieldName => {
            if (camelToSnakeFieldsMapping.includes(metadataFieldName)){
                if (metadataFieldName === FIELD_KEYS.MEV_RELAYS) {
                    metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], value: operator[exceptions[metadataFieldName]].split(',') || '' });
                } else {
                    metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], value: operator[exceptions[metadataFieldName]] || '' });
                }
            } else {
                if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE){
                    metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], imageFileName: operator[metadataFieldName] || '' });
                } else {
                    metadata.set(metadataFieldName, { ...FIELDS[metadataFieldName], value: operator[_.snakeCase(metadataFieldName)] || '' });
                }
            }
        });
        this.metadata = metadata;
    }

    async updateOperatorNodeOptions() {
        for (const key of Object.keys(OPERATOR_NODE_TYPES)){
            const options = await Operator.getInstance().getOperatorNodes(OPERATOR_NODE_TYPES[key]);
            const data = this.metadata.get(key);
            data!.options = options;
            this.metadata.set(key, data!);
        }
    }

    async updateOperatorLocations() {
            const options: CountryType[] = await Operator.getInstance().getOperatorAvailableLocations();
            options.forEach((option: CountryType) => this.locationsList[`${option.name} (${option['alpha-3']})`] = option.name);
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
        let payload: Record<string, string> = {};
        fieldsToValidateSignature.forEach((field: string) => {
            let value = this.getMetadataValue(field);
            if (field === FIELD_KEYS.MEV_RELAYS && typeof value !== 'string') {
                value = value.join(',');
            }
                payload[field] = value || '';
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
                } else if (fieldEntity.value && !checkSpecialCharacters(fieldEntity.value)){
                    this.setErrorMessage(metadataFieldName, translations.OPERATOR_METADATA.SPECIAL_CHARACTERS_ERROR);
                    metadataContainsError = true;
                } else {
                    this.setErrorMessage(metadataFieldName, '');
                }
            } else if ([FIELD_KEYS.LINKEDIN_URL, FIELD_KEYS.WEBSITE_URL, FIELD_KEYS.TWITTER_URL, FIELD_KEYS.DKG_ADDRESS].includes(metadataFieldName) && typeof fieldEntity.value === 'string') {
                const isDkgField = metadataFieldName === FIELD_KEYS.DKG_ADDRESS;
                const res = isDkgField ? checkDkgAddress(fieldEntity.value) : isLink(fieldEntity.value);
                const errorMessage = isDkgField ? translations.OPERATOR_METADATA.DKG_ADDRESS_ERROR : translations.OPERATOR_METADATA.LINK_ERROR;
                if (fieldEntity.value && res){
                    metadataContainsError = true;
                    this.setErrorMessage(metadataFieldName, errorMessage);
                } else {
                    this.setErrorMessage(metadataFieldName, '');
                }
            }  else if (metadataFieldName === FIELD_KEYS.OPERATOR_IMAGE) {
                metadataContainsError = !!fieldEntity.errorMessage || metadataContainsError;
            }
        }
        return metadataContainsError;
    }
}

export default OperatorMetadataStore;
