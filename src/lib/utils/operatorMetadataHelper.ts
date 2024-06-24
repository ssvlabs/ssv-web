import config, { translations } from '~app/common/config';
import { EContractName } from '~app/model/contracts.model';
import { IOperator } from '~app/model/operator.model';
import { isEqualsAddresses } from '~lib/utils/strings';
import { MAINNET_NETWORK_ID, getStoredNetwork } from '~root/providers/networkInfo.provider';
import { getContractByName } from '~root/wagmi/utils';

export const FIELD_KEYS = {
  OPERATOR_NAME: 'operatorName',
  OPERATOR_IMAGE: 'logo',
  DESCRIPTION: 'description',
  SETUP_PROVIDER: 'setupProvider',
  MEV_RELAYS: 'mevRelays',
  LOCATION: 'location',
  EXECUTION_CLIENT: 'eth1NodeClient',
  CONSENSUS_CLIENT: 'eth2NodeClient',
  WEBSITE_URL: 'websiteUrl',
  TWITTER_URL: 'twitterUrl',
  LINKEDIN_URL: 'linkedinUrl',
  DKG_ADDRESS: 'dkgAddress'
};

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
};

export const exceptions: Record<string, string> = {
  operatorName: 'name',
  eth1NodeClient: 'eth1_node_client',
  eth2NodeClient: 'eth2_node_client'
};

export const OPERATOR_NODE_TYPES = {
  [FIELD_KEYS.EXECUTION_CLIENT]: 1,
  [FIELD_KEYS.CONSENSUS_CLIENT]: 2
};

export const camelToSnakeFieldsMapping = [FIELD_KEYS.EXECUTION_CLIENT, FIELD_KEYS.CONSENSUS_CLIENT, FIELD_KEYS.OPERATOR_NAME];
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

export const photoValidation = (file: any, callback: Function) => {
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
  if (isForm && value === HTTPS_PREFIX) return false;
  if (!value.startsWith(HTTPS_PREFIX)) return false;

  const addressWithoutHttps = value.substring(HTTPS_PREFIX.length);

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
