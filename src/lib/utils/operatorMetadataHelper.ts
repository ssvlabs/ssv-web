import { translations } from '~app/common/config';

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
    DKG_ADDRESS: 'dkgAddress',
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
    additionalLabelText?: string,
};

type FieldCondition = {
    maxLength: number;
    errorMessage: string;
};

export const ALLOWED_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];

export const FIELD_CONDITIONS: Record<string, FieldCondition> = {
    [FIELD_KEYS.OPERATOR_NAME]: { maxLength: 30, errorMessage: 'Operator name up to 30 characters' },
    [FIELD_KEYS.DESCRIPTION]: { maxLength: 350, errorMessage: 'Description up to 350 characters' },
    [FIELD_KEYS.SETUP_PROVIDER]: { maxLength: 50, errorMessage: 'Cloud provider up to 50 characters' },
};

export const exceptions: Record<string, string> = {
    operatorName: 'name',
    eth1NodeClient: 'eth1_node_client',
    eth2NodeClient: 'eth2_node_client',
};

export const OPERATOR_NODE_TYPES = {
    [FIELD_KEYS.EXECUTION_CLIENT]: 1,
    [FIELD_KEYS.CONSENSUS_CLIENT]: 2,
};

export const camelToSnakeFieldsMapping = [FIELD_KEYS.EXECUTION_CLIENT, FIELD_KEYS.CONSENSUS_CLIENT, FIELD_KEYS.OPERATOR_NAME];

export const HTTP_PREFIX = 'http://';

export const FIELDS: { [key: string]: MetadataEntity } = {
    [FIELD_KEYS.OPERATOR_NAME]: {
        label: 'Display Name',
        value: '',
        errorMessage: '',
        placeholderText: 'Enter your operator name',
    },
    [FIELD_KEYS.OPERATOR_IMAGE]: {
        label: 'Operator Image',
        value: '',
        errorMessage: '',
        placeholderText: '',
        imageFileName: '',
        additionalLabelText: '(Icons should be square and at least 400 x 400 PX)',
    },
    [FIELD_KEYS.DESCRIPTION]: {
        label: 'Description',
        value: '',
        errorMessage: '',
        placeholderText: 'Describe your operation',
    },
    [FIELD_KEYS.SETUP_PROVIDER]: {
        label: 'Cloud Provider',
        value: '',
        errorMessage: '',
        placeholderText: 'AWS, Azure, Google Cloud...',
    },
    [FIELD_KEYS.MEV_RELAYS]: {
        label: 'Mev Relays',
        value: '',
        errorMessage: '',
        placeholderText: 'Aestus, Agnostic Gnosis, Blocknative...',
        options: ['Aestus', 'Agnostic Gnosis', 'bloXroute Max Profit', 'bloXroute Regulated', 'Eden Network', 'Flashbots', 'Manifold', 'Ultra Sound'],
    },
    [FIELD_KEYS.LOCATION]: {
        label: 'Server Geolocation',
        value: '',
        errorMessage: '',
        placeholderText: 'Select your server geolocation',
    },
    [FIELD_KEYS.EXECUTION_CLIENT]: {
        label: 'Execution Client',
        value: '',
        errorMessage: '',
        placeholderText: 'Geth, Nethermind, Besu...',
        options: [],
    },
    [FIELD_KEYS.CONSENSUS_CLIENT]: {
        label: 'Consensus Client',
        value: '',
        errorMessage: '',
        placeholderText: 'Prism, Lighthouse, Teku...',
        options: [],
    },
    [FIELD_KEYS.DKG_ADDRESS]: {
        label: 'DKG Endpoint',
        value: HTTP_PREFIX,
        errorMessage: '',
        placeholderText: 'http://ip:port',
        toolTipText: 'The IP address or domain name of the machine running the operator DKG client, along with the port number ("3030" is the default port). Example: "http://192.168.1.1:3030 or "http://my.example.com:3030"',
    },
    [FIELD_KEYS.WEBSITE_URL]: {
        label: 'Website Link',
        value: '',
        errorMessage: '',
        placeholderText: 'Enter your Website Link',
    },
    [FIELD_KEYS.TWITTER_URL]: {
        label: 'Twitter Link',
        value: '',
        errorMessage: '',
        placeholderText: 'Enter your Twitter Link',
    },
    [FIELD_KEYS.LINKEDIN_URL]: {
        label: 'Linkedin Link',
        value: '',
        errorMessage: '',
        placeholderText: 'Enter your LinkedIn Link',
    },
};

export const photoValidation = (file: any, callback: Function) => {
    let errorMessage = '';
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errorMessage = translations.OPERATOR_METADATA.IMAGE_TYPE_ERROR;
        return callback('', file.name, errorMessage);
    }
    if ((file.size / 1024) > 200) {
        errorMessage = translations.OPERATOR_METADATA.IMAGE_SIZE_ERROR;
    }
    const reader = new FileReader();
    reader.onloadend = function (e) {
        if (e?.target?.readyState === FileReader.DONE) {
            const base64ImageString = e.target.result;
            let img = new Image();
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

export const isLink = (value: string) => {
    const linkRegex = /^(https?:\/\/)?[a-zA-Z0-9][\w.-]*\.[a-zA-Z]{2,}(\/\S*)?$/;
    return !linkRegex.test(value);
};

export const checkDkgAddress = (value: string, isForm?: boolean) => {
    if (isForm && value === HTTP_PREFIX) return false;

    if (!value.startsWith(HTTP_PREFIX)) return true;

    const addressWithoutHttp = value.substring(HTTP_PREFIX.length);

    const domainPattern = '(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,6}';
    const ipPattern = '((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';
    const portPattern = ':\\d{1,5}';

    const pattern = new RegExp(`^(${domainPattern}|${ipPattern})${portPattern}$`);

    return !pattern.test(addressWithoutHttp);
};
