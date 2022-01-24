const config = {
    routes: {
        HOME: '/',
        MY_ACCOUNT: {
            DASHBOARD: '/dashboard',
            DEPOSIT: '/dashboard/deposit',
            WITHDRAW: '/dashboard/withdraw',
            ENABLE_ACCOUNT: '/dashboard/enable_account',
        },
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
            DEPOSIT_VALIDATOR: '/validator/deposit',
            SUCCESS_PAGE: '/validator/success',
            DECRYPT: '/validator/keystore/decrypt',
            CONFIRMATION_PAGE: '/validator/confirm',
            SELECT_OPERATORS: '/validator/operators',
            SLASHING_WARNING: '/validator/slashing-warning',
            ACCOUNT_BALANCE_AND_FEE: '/validator/balance-and-fee',
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
        COMPLIANCE_URL: process.env.REACT_APP_COMPLIANCE_URL,
        LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
        LINK_COIN_EXCHANGE_API: process.env.REACT_APP_COIN_EXCHANGE_URL,
        ETHER_SCAN_LINK: process.env.REACT_APP_ETHER_SCAN_URL,
        TOOL_TIP_KEY_LINK: 'https://docs.ssv.network/operators/install-instructions',
        LAUNCHPAD_LINK: 'https://prater.launchpad.ethereum.org/en/',
        LINK_EXPLORER: process.env.REACT_APP_EXPLORER_URL || 'https://explorer.stage.ssv.network',
        EXPLORER_CENTER: String(process.env.REACT_APP_OPERATORS_ENDPOINT),
        GASNOW_API_URL: 'https://www.gasnow.org/api/v3/gas/price?utm_source=ssv.network',
    },
    GLOBAL_VARIABLE: {
        BLOCKS_PER_DAY: 6570,
        BLOCKS_PER_YEAR: 2398050,
        NUMBERS_OF_WEEKS_IN_YEAR: 52.1429,
        VALIDATORS_PER_OPERATOR_LIMIT: 1,
    },
    ONBOARD: {
        API_KEY: process.env.REACT_APP_BLOCKNATIVE_KEY,
        NETWORK_ID: process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID,
    },
    COIN_KEY: {
        COIN_EXCHANGE_KEY: process.env.REACT_APP_COIN_EXCHANGE_KEY,
    },
    CONTRACTS: {
        SSV: {
            ADDRESS: String(process.env.REACT_APP_SSV_CONTRACT_ADDRESS),
            ABI: [
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'owner',
                            'type': 'address',
                        },
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'spender',
                            'type': 'address',
                        },
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'value',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'Approval',
                    'type': 'event',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'previousOwner',
                            'type': 'address',
                        },
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'newOwner',
                            'type': 'address',
                        },
                    ],
                    'name': 'OwnershipTransferred',
                    'type': 'event',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'from',
                            'type': 'address',
                        },
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'to',
                            'type': 'address',
                        },
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'value',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'Transfer',
                    'type': 'event',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'owner',
                            'type': 'address',
                        },
                        {
                            'internalType': 'address',
                            'name': 'spender',
                            'type': 'address',
                        },
                    ],
                    'name': 'allowance',
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
                            'internalType': 'address',
                            'name': 'spender',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'approve',
                    'outputs': [
                        {
                            'internalType': 'bool',
                            'name': '',
                            'type': 'bool',
                        },
                    ],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'account',
                            'type': 'address',
                        },
                    ],
                    'name': 'balanceOf',
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
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'burn',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'account',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'burnFrom',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'decimals',
                    'outputs': [
                        {
                            'internalType': 'uint8',
                            'name': '',
                            'type': 'uint8',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'spender',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'subtractedValue',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'decreaseAllowance',
                    'outputs': [
                        {
                            'internalType': 'bool',
                            'name': '',
                            'type': 'bool',
                        },
                    ],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'spender',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'addedValue',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'increaseAllowance',
                    'outputs': [
                        {
                            'internalType': 'bool',
                            'name': '',
                            'type': 'bool',
                        },
                    ],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'initialize',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'to',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'mint',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'name',
                    'outputs': [
                        {
                            'internalType': 'string',
                            'name': '',
                            'type': 'string',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'owner',
                    'outputs': [
                        {
                            'internalType': 'address',
                            'name': '',
                            'type': 'address',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'renounceOwnership',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'symbol',
                    'outputs': [
                        {
                            'internalType': 'string',
                            'name': '',
                            'type': 'string',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'totalSupply',
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
                            'internalType': 'address',
                            'name': 'recipient',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'transfer',
                    'outputs': [
                        {
                            'internalType': 'bool',
                            'name': '',
                            'type': 'bool',
                        },
                    ],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'sender',
                            'type': 'address',
                        },
                        {
                            'internalType': 'address',
                            'name': 'recipient',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'transferFrom',
                    'outputs': [
                        {
                            'internalType': 'bool',
                            'name': '',
                            'type': 'bool',
                        },
                    ],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'newOwner',
                            'type': 'address',
                        },
                    ],
                    'name': 'transferOwnership',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
            ],
        },
        SSV_NETWORK: {
            ADDRESS: String(process.env.REACT_APP_NETWORK_CONTRACT_ADDRESS),
            ABI: [
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'oldFee',
                            'type': 'uint256',
                        },
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'newFee',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'NetworkFeeUpdated',
                    'type': 'event',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
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
                    'name': 'OperatorActivated',
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
                            'indexed': true,
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
                            'indexed': true,
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
                    'name': 'OperatorDeleted',
                    'type': 'event',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
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
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'blockNumber',
                            'type': 'uint256',
                        },
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'fee',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'OperatorFeeUpdated',
                    'type': 'event',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
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
                    'name': 'OperatorInactivated',
                    'type': 'event',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
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
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'blockNumber',
                            'type': 'uint256',
                        },
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'score',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'OperatorScoreUpdated',
                    'type': 'event',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'previousOwner',
                            'type': 'address',
                        },
                        {
                            'indexed': true,
                            'internalType': 'address',
                            'name': 'newOwner',
                            'type': 'address',
                        },
                    ],
                    'name': 'OwnershipTransferred',
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
                    ],
                    'name': 'ValidatorActivated',
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
                            'indexed': false,
                            'internalType': 'bytes[]',
                            'name': 'operatorPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'indexed': false,
                            'internalType': 'bytes[]',
                            'name': 'sharesPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'indexed': false,
                            'internalType': 'bytes[]',
                            'name': 'encryptedKeys',
                            'type': 'bytes[]',
                        },
                    ],
                    'name': 'ValidatorAdded',
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
                    ],
                    'name': 'ValidatorDeleted',
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
                    ],
                    'name': 'ValidatorInactivated',
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
                            'indexed': false,
                            'internalType': 'bytes[]',
                            'name': 'operatorPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'indexed': false,
                            'internalType': 'bytes[]',
                            'name': 'sharesPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'indexed': false,
                            'internalType': 'bytes[]',
                            'name': 'encryptedKeys',
                            'type': 'bytes[]',
                        },
                    ],
                    'name': 'ValidatorUpdated',
                    'type': 'event',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'activateOperator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'tokenAmount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'activateValidator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'addressNetworkFee',
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
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'burnRate',
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
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'deactivateOperator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'deactivateValidator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'deleteOperator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'deleteValidator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'tokenAmount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'deposit',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'getNetworkTreasury',
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
                            'name': 'operatorPublicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'getOperatorCurrentFee',
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
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'getOperatorsByOwnerAddress',
                    'outputs': [
                        {
                            'internalType': 'bytes[]',
                            'name': '',
                            'type': 'bytes[]',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'getOperatorsByValidator',
                    'outputs': [
                        {
                            'internalType': 'bytes[]',
                            'name': '',
                            'type': 'bytes[]',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'getValidatorsByOwnerAddress',
                    'outputs': [
                        {
                            'internalType': 'bytes[]',
                            'name': '',
                            'type': 'bytes[]',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'contract ISSVRegistry',
                            'name': 'registryAddress',
                            'type': 'address',
                        },
                        {
                            'internalType': 'contract IERC20',
                            'name': 'token',
                            'type': 'address',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'minimumBlocksBeforeLiquidation',
                            'type': 'uint256',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'operatorMaxFeeIncrease',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'initialize',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'liquidatable',
                    'outputs': [
                        {
                            'internalType': 'bool',
                            'name': '',
                            'type': 'bool',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'liquidate',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'address[]',
                            'name': 'ownerAddresses',
                            'type': 'address[]',
                        },
                    ],
                    'name': 'liquidateAll',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'minimumBlocksBeforeLiquidation',
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
                    'inputs': [],
                    'name': 'networkFee',
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
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'operatorEarningsOf',
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
                    'inputs': [],
                    'name': 'operatorMaxFeeIncrease',
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
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'operators',
                    'outputs': [
                        {
                            'internalType': 'string',
                            'name': '',
                            'type': 'string',
                        },
                        {
                            'internalType': 'address',
                            'name': '',
                            'type': 'address',
                        },
                        {
                            'internalType': 'bytes',
                            'name': '',
                            'type': 'bytes',
                        },
                        {
                            'internalType': 'uint256',
                            'name': '',
                            'type': 'uint256',
                        },
                        {
                            'internalType': 'bool',
                            'name': '',
                            'type': 'bool',
                        },
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
                    'inputs': [],
                    'name': 'owner',
                    'outputs': [
                        {
                            'internalType': 'address',
                            'name': '',
                            'type': 'address',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'string',
                            'name': 'name',
                            'type': 'string',
                        },
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'fee',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'registerOperator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                        {
                            'internalType': 'bytes[]',
                            'name': 'operatorPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'internalType': 'bytes[]',
                            'name': 'sharesPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'internalType': 'bytes[]',
                            'name': 'encryptedKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'tokenAmount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'registerValidator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'renounceOwnership',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'test_operatorIndexOf',
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
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'totalBalanceOf',
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
                            'internalType': 'address',
                            'name': 'ownerAddress',
                            'type': 'address',
                        },
                    ],
                    'name': 'totalEarningsOf',
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
                            'internalType': 'address',
                            'name': 'newOwner',
                            'type': 'address',
                        },
                    ],
                    'name': 'transferOwnership',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'minimumBlocksBeforeLiquidation',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'updateMinimumBlocksBeforeLiquidation',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'fee',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'updateNetworkFee',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'fee',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'updateOperatorFee',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'operatorMaxFeeIncrease',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'updateOperatorMaxFeeIncrease',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
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
                    'name': 'updateOperatorScore',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                        {
                            'internalType': 'bytes[]',
                            'name': 'operatorPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'internalType': 'bytes[]',
                            'name': 'sharesPublicKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'internalType': 'bytes[]',
                            'name': 'encryptedKeys',
                            'type': 'bytes[]',
                        },
                        {
                            'internalType': 'uint256',
                            'name': 'tokenAmount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'updateValidator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'tokenAmount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'withdraw',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'withdrawNetworkFees',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
            ],
            OLD_ABI: [
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
                            'internalType': 'string',
                            'name': 'name',
                            'type': 'string',
                        },
                        {
                            'indexed': false,
                            'internalType': 'bytes',
                            'name': 'publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'OperatorDeleted',
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
                    ],
                    'name': 'ValidatorDeleted',
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
                    'name': 'ValidatorUpdated',
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
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': '_publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'deleteOperator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': '_publicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'deleteValidator',
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
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': '_operatorPublicKey',
                            'type': 'bytes',
                        },
                        {
                            'internalType': 'uint256',
                            'name': '_validatorsPerOperator',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'setValidatorsPerOperator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': '_validatorsPerOperatorLimit',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'setValidatorsPerOperatorLimit',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
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
                    'name': 'updateValidator',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
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
                {
                    'inputs': [
                        {
                            'internalType': 'bytes',
                            'name': '_operatorPublicKey',
                            'type': 'bytes',
                        },
                    ],
                    'name': 'validatorsPerOperatorCount',
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
                    'inputs': [],
                    'name': 'validatorsPerOperatorLimit',
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
    },
};

export default config;
