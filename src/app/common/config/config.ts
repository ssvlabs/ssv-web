const config = {
    routes: {
        TEST: '/guy',
        HOME: '/',
        OPERATOR: {
            HOME: '/operator',
            SUCCESS_PAGE: '/operator/success',
            GENERATE_KEYS: '/operator/generate',
            CONFIRMATION_PAGE: '/operator/confirm',
        },
        VALIDATOR: {
            HOME: '/validator',
            IMPORT: '/validator/import',
            CREATE: '/validator/create',
            SUCCESS_PAGE: '/validator/success',
            DECRYPT: '/validator/keystore/decrypt',
            CONFIRMATION_PAGE: '/validator/confirm',
            SELECT_OPERATORS: '/validator/operators',
            SLASHING_WARNING: '/validator/slashing-warning',
        },
    },
    FEATURE: {
        DOLLAR_CALCULATION: process.env.REACT_APP_SHOULD_CALCULATE_DOLLAR,
        OPERATORS: {
            AUTO_SELECT: process.env.REACT_APP_FEATURE_AUTO_SELECT_OPERATORS,
            SELECT_MINIMUM_OPERATORS: 4,
            REQUEST_MINIMUM_OPERATORS: 1000,
            VALID_KEY_LENGTH: 612,
        },
        TESTING: {
            GENERATE_RANDOM_OPERATOR_KEY: process.env.REACT_APP_DEBUG,
        },
    },
    links: {
        LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
        LINK_COIN_EXCHANGE_API: process.env.REACT_APP_COIN_EXCHANGE_URL,
        ETHER_SCAN_LINK: process.env.REACT_APP_ETHER_SCAN_URL,
        TOOL_TIP_KEY_LINK: 'https://docs.ssv.network/operators/install-instructions',
        LAUNCHPAD_LINK: 'https://prater.launchpad.ethereum.org/en/',
        LINK_EXPLORER: process.env.REACT_APP_EXPLORER_URL || 'https://explorer.stage.ssv.network',
    },
    ONBOARD: {
        API_KEY: process.env.REACT_APP_BLOCKNATIVE_KEY,
        NETWORK_ID: process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID,
    },
    COIN_KEY: {
        COIN_EXCHANGE_KEY: process.env.REACT_APP_COIN_EXCHANGE_KEY,
    },
    CONTRACT: {
        ADDRESS: String(process.env.REACT_APP_CONTRACT_ADDRESS),
        ABI: [
            {
                'anonymous': false,
                'inputs': [
                    {
                        'indexed': false,
                        'internalType': 'bytes',
                        'name': 'validatorPublicKey',
                        'type': 'bytes',
                    },
                    {
                        'indexed': false,
                        'internalType': 'uint256',
                        'name': 'index',
                        'type': 'uint256',
                    },
                    {
                        'indexed': false,
                        'internalType': 'bytes',
                        'name': 'operatorPublicKey',
                        'type': 'bytes',
                    },
                    {
                        'indexed': false,
                        'internalType': 'bytes',
                        'name': 'sharedPublicKey',
                        'type': 'bytes',
                    },
                    {
                        'indexed': false,
                        'internalType': 'bytes',
                        'name': 'encryptedKey',
                        'type': 'bytes',
                    },
                ],
                'name': 'OessAdded',
                'type': 'event',
            },
            {
                'anonymous': false,
                'inputs': [
                    {
                        'indexed': false,
                        'internalType': 'string',
                        'name': 'name',
                        'type': 'string',
                    },
                    {
                        'indexed': false,
                        'internalType': 'address',
                        'name': 'ownerAddress',
                        'type': 'address',
                    },
                    {
                        'indexed': false,
                        'internalType': 'bytes',
                        'name': 'publicKey',
                        'type': 'bytes',
                    },
                ],
                'name': 'OperatorAdded',
                'type': 'event',
            },
            {
                'anonymous': false,
                'inputs': [
                    {
                        'indexed': false,
                        'internalType': 'address',
                        'name': 'ownerAddress',
                        'type': 'address',
                    },
                    {
                        'indexed': false,
                        'internalType': 'bytes',
                        'name': 'publicKey',
                        'type': 'bytes',
                    },
                    {
                        'components': [
                            {
                                'internalType': 'uint256',
                                'name': 'index',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'bytes',
                                'name': 'operatorPublicKey',
                                'type': 'bytes',
                            },
                            {
                                'internalType': 'bytes',
                                'name': 'sharedPublicKey',
                                'type': 'bytes',
                            },
                            {
                                'internalType': 'bytes',
                                'name': 'encryptedKey',
                                'type': 'bytes',
                            },
                        ],
                        'indexed': false,
                        'internalType': 'struct ISSVNetwork.Oess[]',
                        'name': 'oessList',
                        'type': 'tuple[]',
                    },
                ],
                'name': 'ValidatorAdded',
                'type': 'event',
            },
            {
                'inputs': [
                    {
                        'internalType': 'string',
                        'name': '_name',
                        'type': 'string',
                    },
                    {
                        'internalType': 'address',
                        'name': '_ownerAddress',
                        'type': 'address',
                    },
                    {
                        'internalType': 'bytes',
                        'name': '_publicKey',
                        'type': 'bytes',
                    },
                ],
                'name': 'addOperator',
                'outputs': [],
                'stateMutability': 'nonpayable',
                'type': 'function',
            },
            {
                'inputs': [
                    {
                        'internalType': 'address',
                        'name': '_ownerAddress',
                        'type': 'address',
                    },
                    {
                        'internalType': 'bytes',
                        'name': '_publicKey',
                        'type': 'bytes',
                    },
                    {
                        'internalType': 'bytes[]',
                        'name': '_operatorPublicKeys',
                        'type': 'bytes[]',
                    },
                    {
                        'internalType': 'bytes[]',
                        'name': '_sharesPublicKeys',
                        'type': 'bytes[]',
                    },
                    {
                        'internalType': 'bytes[]',
                        'name': '_encryptedKeys',
                        'type': 'bytes[]',
                    },
                ],
                'name': 'addValidator',
                'outputs': [],
                'stateMutability': 'nonpayable',
                'type': 'function',
            },
            {
                'inputs': [],
                'name': 'operatorCount',
                'outputs': [
                    {
                        'internalType': 'uint256',
                        'name': '',
                        'type': 'uint256',
                    },
                ],
                'stateMutability': 'view',
                'type': 'function',
            },
            {
                'inputs': [
                    {
                        'internalType': 'bytes',
                        'name': '',
                        'type': 'bytes',
                    },
                ],
                'name': 'operators',
                'outputs': [
                    {
                        'internalType': 'string',
                        'name': 'name',
                        'type': 'string',
                    },
                    {
                        'internalType': 'address',
                        'name': 'ownerAddress',
                        'type': 'address',
                    },
                    {
                        'internalType': 'bytes',
                        'name': 'publicKey',
                        'type': 'bytes',
                    },
                    {
                        'internalType': 'uint256',
                        'name': 'score',
                        'type': 'uint256',
                    },
                ],
                'stateMutability': 'view',
                'type': 'function',
            },
            {
                'inputs': [],
                'name': 'validatorCount',
                'outputs': [
                    {
                        'internalType': 'uint256',
                        'name': '',
                        'type': 'uint256',
                    },
                ],
                'stateMutability': 'view',
                'type': 'function',
            },
        ],
    },
};

export default config;
