import config, { translations } from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { IOperator } from '~app/model/operator.model';
import { isEqualsAddresses } from '~lib/utils/strings';
import { MAINNET_NETWORK_ID, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { checkSpecialCharacters } from '~lib/utils/strings.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { setErrorMessage } from '~app/redux/operatorMetadata.slice.ts';
import { getContractByName } from '~root/wagmi/utils';

export enum FIELD_KEYS {
  OPERATOR_NAME = 'operatorName',
  OPERATOR_IMAGE = 'logo',
  DESCRIPTION = 'description',
  SETUP_PROVIDER = 'setupProvider',
  MEV_RELAYS = 'mevRelays',
  LOCATION = 'location',
  EXECUTION_CLIENT = 'eth1NodeClient',
  CONSENSUS_CLIENT = 'eth2NodeClient',
  WEBSITE_URL = 'websiteUrl',
  TWITTER_URL = 'twitterUrl',
  LINKEDIN_URL = 'linkedinUrl',
  DKG_ADDRESS = 'dkgAddress'
}

export const MEV_RELAYS = {
  AESTUS: 'Aestus',
  AGNOSTIC: 'Agnostic Gnosis',
  BLOXROUTE_MAX_PROFIT: 'bloXroute Max Profit',
  BLOXROUTE_REGULATED: 'bloXroute Regulated',
  EDEN: 'Eden Network',
  FLASHBOTS: 'Flashbots',
  MANIFOLD: 'Manifold',
  ULTRA_SOUND: 'Ultra Sound'
};

export const MEV_RELAYS_LOGOS = {
  [MEV_RELAYS.AESTUS]: 'Aestus',
  [MEV_RELAYS.AGNOSTIC]: 'agnostic',
  [MEV_RELAYS.BLOXROUTE_MAX_PROFIT]: 'blox-route',
  [MEV_RELAYS.BLOXROUTE_REGULATED]: 'blox-route',
  [MEV_RELAYS.EDEN]: 'eden',
  [MEV_RELAYS.FLASHBOTS]: 'Flashbots',
  [MEV_RELAYS.MANIFOLD]: 'manifold',
  [MEV_RELAYS.ULTRA_SOUND]: 'ultraSound'
};

export type CountryType = {
  'alpha-2': string;
  'alpha-3': string;
  'country-code': string;
  'intermediate-region': string;
  'intermediate-region-code': string;
  'iso_3166-2': string;
  name: string;
  region: string;
  'region-code': string;
  'sub-region': string;
  'sub-region-code': string;
};

export type MetadataEntity = {
  label: string;
  value: string | any;
  errorMessage: string;
  placeholderText: string;
  options?: string[];
  imageFileName?: string;
  toolTipText?: string;
  additionalLabelText?: string;
};

type FieldCondition = {
  maxLength: number;
  errorMessage: string;
};

const DKG_ADDRESS_MIN_LENGTH: number = 256;

export const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

export const FIELD_CONDITIONS: Record<string, FieldCondition> = {
  [FIELD_KEYS.OPERATOR_NAME]: { maxLength: 30, errorMessage: 'Operator name up to 30 characters' },
  [FIELD_KEYS.DESCRIPTION]: { maxLength: 350, errorMessage: 'Description up to 350 characters' },
  [FIELD_KEYS.SETUP_PROVIDER]: { maxLength: 50, errorMessage: 'Cloud provider up to 50 characters' }
} as const;

export const exceptions: { [key in (typeof FIELD_KEYS)[keyof typeof FIELD_KEYS]]?: keyof IOperator } = {
  [FIELD_KEYS.OPERATOR_NAME]: 'name',
  [FIELD_KEYS.EXECUTION_CLIENT]: 'eth1_node_client',
  [FIELD_KEYS.CONSENSUS_CLIENT]: 'eth2_node_client'
} as const;

export const OPERATOR_NODE_TYPES = {
  [FIELD_KEYS.EXECUTION_CLIENT]: 1,
  [FIELD_KEYS.CONSENSUS_CLIENT]: 2
} as const;

export const camelToSnakeFieldsMapping: (typeof FIELD_KEYS)[keyof typeof FIELD_KEYS][] = [FIELD_KEYS.EXECUTION_CLIENT, FIELD_KEYS.CONSENSUS_CLIENT, FIELD_KEYS.OPERATOR_NAME];
export const HTTPS_PREFIX = 'https://';

export const FIELDS: { [key: string]: MetadataEntity } = {
  [FIELD_KEYS.OPERATOR_NAME]: {
    label: 'Display Name',
    value: '',
    errorMessage: '',
    placeholderText: 'Enter your operator name'
  },
  [FIELD_KEYS.OPERATOR_IMAGE]: {
    label: 'Operator Image',
    value: '',
    errorMessage: '',
    placeholderText: '',
    imageFileName: '',
    additionalLabelText: '(Icons should be square and at least 400 x 400 PX)'
  },
  [FIELD_KEYS.DESCRIPTION]: {
    label: 'Description',
    value: '',
    errorMessage: '',
    placeholderText: 'Describe your operation'
  },
  [FIELD_KEYS.SETUP_PROVIDER]: {
    label: 'Cloud Provider',
    value: '',
    errorMessage: '',
    placeholderText: 'AWS, Azure, Google Cloud...'
  },
  [FIELD_KEYS.MEV_RELAYS]: {
    label: 'Mev Relays',
    value: '',
    errorMessage: '',
    placeholderText: 'Aestus, Agnostic Gnosis, Blocknative...',
    options: Object.values(MEV_RELAYS)
  },
  [FIELD_KEYS.LOCATION]: {
    label: 'Server Geolocation',
    value: '',
    errorMessage: '',
    placeholderText: 'Select your server geolocation'
  },
  [FIELD_KEYS.EXECUTION_CLIENT]: {
    label: 'Execution Client',
    value: '',
    errorMessage: '',
    placeholderText: 'Geth, Nethermind, Besu...',
    options: []
  },
  [FIELD_KEYS.CONSENSUS_CLIENT]: {
    label: 'Consensus Client',
    value: '',
    errorMessage: '',
    placeholderText: 'Prism, Lighthouse, Teku...',
    options: []
  },
  [FIELD_KEYS.DKG_ADDRESS]: {
    label: 'DKG Endpoint',
    value: HTTPS_PREFIX,
    errorMessage: '',
    placeholderText: 'https://ip:port',
    toolTipText:
      'The IP address or domain name of the machine running the operator DKG client, along with the port number ("3030" is the default port). Example: "http://192.168.1.1:3030 or "http://my.example.com:3030"'
  },
  [FIELD_KEYS.WEBSITE_URL]: {
    label: 'Website Link',
    value: '',
    errorMessage: '',
    placeholderText: 'Enter your Website Link'
  },
  [FIELD_KEYS.TWITTER_URL]: {
    label: 'Twitter Link',
    value: '',
    errorMessage: '',
    placeholderText: 'Enter your Twitter Link'
  },
  [FIELD_KEYS.LINKEDIN_URL]: {
    label: 'Linkedin Link',
    value: '',
    errorMessage: '',
    placeholderText: 'Enter your LinkedIn Link'
  }
};

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

export const photoValidation = (file: File, callback: Function) => {
  let errorMessage = '';
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errorMessage = translations.OPERATOR_METADATA.IMAGE_TYPE_ERROR;
    return callback('', file.name, errorMessage);
  }
  if (file.size / 1024 > 200) {
    errorMessage = translations.OPERATOR_METADATA.IMAGE_SIZE_ERROR;
  }
  const reader = new FileReader();
  reader.onloadend = function (e) {
    if (e?.target?.readyState === FileReader.DONE) {
      const base64ImageString = e.target.result;
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 400) {
          errorMessage = translations.OPERATOR_METADATA.IMAGE_RESOLUTION_ERROR;
        }
        callback(base64ImageString, file.name, errorMessage);
      };
      if (typeof base64ImageString === 'string') {
        img.src = base64ImageString;
      }
    }
  };
  reader.readAsDataURL(file);
};

export const isValidLink = (value: string) => {
  const linkRegex = /^(https?:\/\/)?[a-zA-Z0-9][\w.-]*\.[a-zA-Z]{2,}(\/\S*)?$/;
  return linkRegex.test(value);
};

export const isDkgAddressValid = (value: string, isForm?: boolean) => {
  if (isForm && value === HTTPS_PREFIX) return true;
  const addressWithoutHttps = value.substring(HTTPS_PREFIX.length);
  if (!value.startsWith(HTTPS_PREFIX)) return false;
  if (addressWithoutHttps.length === 0) return true;
  const domainPattern = '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,9}';
  const ipPattern = '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
  const portPattern = ':\\d{1,5}';

  const pattern = new RegExp(`(${domainPattern}|${ipPattern})${portPattern}$`);

  return value.length <= DKG_ADDRESS_MIN_LENGTH && pattern.test(addressWithoutHttps);
};

export const isOperatorPrivate = (operator: IOperator) => {
  const network = getStoredNetwork();

  // eslint-disable-next-line no-constant-condition
  if (network.networkId === MAINNET_NETWORK_ID) return Boolean(operator.address_whitelist && operator.address_whitelist !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST);
  return operator.is_private ?? false;
};

export const canAccountUseOperator = async (account: string | `0x${string}`, operator: IOperator): Promise<boolean> => {
  const network = getStoredNetwork();
  if (!isOperatorPrivate(operator)) return true;

  // eslint-disable-next-line no-constant-condition
  if (network.networkId === MAINNET_NETWORK_ID) {
    return isEqualsAddresses(operator.address_whitelist, account);
  }

  const hasExternalContract = Boolean(operator.whitelisting_contract && operator.whitelisting_contract !== config.GLOBAL_VARIABLE.DEFAULT_ADDRESS_WHITELIST);

  const isWhitelistedAddress = operator?.whitelist_addresses?.some((address) => isEqualsAddresses(address, account)) ?? false;
  if (!hasExternalContract) return isWhitelistedAddress;

  const contract = getContractByName(EContractName.GETTER);
  const isWhitelistedViaContract = hasExternalContract ? await contract.isAddressWhitelistedInWhitelistingContract(account, operator.id, operator.whitelisting_contract) : false;

  return isWhitelistedAddress || isWhitelistedViaContract;
};

/**
 * Sorting case-insensitively by each word in the string
 * @param relays
 * @private
 */
export const sortMevRelays = (relays: string | string[]): string => {
  if (!relays) {
    return relays;
  }
  let splitStr: string[];
  if (typeof relays === 'string') {
    splitStr = relays.split(',');
  } else {
    splitStr = relays;
  }
  const sortedStr: string[] = splitStr.sort((a, b) => {
    const aSplit = a.toLowerCase().split(' ');
    const bSplit = b.toLowerCase().split(' ');
    for (let i = 0; i < Math.min(aSplit.length, bSplit.length); ++i) {
      const cmp = aSplit[i].localeCompare(bSplit[i]);
      if (cmp !== 0) return cmp;
    }
    return 0;
  });
  return sortedStr.join(',');
};

export const checkWithConditions = (metadataFieldName: string, fieldEntity: MetadataEntity) => {
  const condition = FIELD_CONDITIONS[metadataFieldName];
  const response = {
    result: false,
    errorMessage: ''
  };

  if (condition) {
    const innerConditions: { condition: boolean; response: string }[] = [
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
};

export const checkExceptionFields = (fieldName: string, value: any): boolean => {
  return [FIELD_KEYS.LINKEDIN_URL, FIELD_KEYS.WEBSITE_URL, FIELD_KEYS.TWITTER_URL, FIELD_KEYS.DKG_ADDRESS].includes(fieldName as FIELD_KEYS) && typeof value === 'string';
};

export const checkFieldValue = (metadataFieldName: string, fieldValue: string): { result: boolean; errorMessage: string } => {
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
};

export const processField = (metadataFieldName: FIELD_KEYS, fieldEntity: MetadataEntity, metadataContainsError: boolean, dispatch: Dispatch) => {
  const exceptionField = checkExceptionFields(metadataFieldName, fieldEntity.value);
  const { result, errorMessage } = exceptionField ? checkFieldValue(metadataFieldName, fieldEntity.value) : checkWithConditions(metadataFieldName, fieldEntity);

  if (fieldEntity.value && result) {
    dispatch(setErrorMessage({ metadataFieldName, message: errorMessage }));
    return true;
  } else {
    dispatch(setErrorMessage({ metadataFieldName, message: '' }));
    return metadataContainsError;
  }
};
