
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
};


export type FieldEntity = {
    label: string;
    value: string | any;
    errorMessage: string;
    placeholderText: string;
    options?: string[];
    imageFileName?: string;
};

type FieldCondition = {
    maxLength: number;
    errorMessage: string;
};

export const FIELD_CONDITIONS: Record<string, FieldCondition> = {
    [FIELD_KEYS.OPERATOR_NAME]: { maxLength: 30, errorMessage: 'Operator name up to 30 characters' },
    [FIELD_KEYS.DESCRIPTION]: { maxLength: 350, errorMessage: 'Description up to 350 characters' },
    [FIELD_KEYS.SETUP_PROVIDER]: { maxLength: 50, errorMessage: 'Cloud provider up to 50 characters' },
};

export const exceptions: Record<string, string> =   {
    operatorName: 'name',
    eth1NodeClient: 'eth1_node_client',
    eth2NodeClient: 'eth2_node_client',
};

export const exceptionsField = [FIELD_KEYS.EXECUTION_CLIENT, FIELD_KEYS.CONSENSUS_CLIENT, FIELD_KEYS.OPERATOR_NAME];

export const FIELDS: { [key: string]: FieldEntity } = {
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
        placeholderText: 'Geth, Nethermind, Besu...',
        options: ['Aestus', 'Agnostic Gnosis', 'Blocknative', 'bloXroute Ethical', 'bloXroute Max Profit', 'bloXroute Regulated', 'Eden Network', 'Flashbots', 'Manifold', 'Ultra Sound'],
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
        options: ['Geth', 'Nethermind', 'Besu', 'Erigon'],
    },
    [FIELD_KEYS.CONSENSUS_CLIENT]: {
        label: 'Consensus Client',
        value: '',
        errorMessage: '',
        placeholderText: 'Prism, Lighthouse, Teku...',
        options: ['Prysm', 'Lighthouse', 'Teku', 'Nimbus', 'Lodestar'],
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

export const isLink = (value: string) => {
    const linkRegex = /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/i;
    return !linkRegex.test(value);
};
