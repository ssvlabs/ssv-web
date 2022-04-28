const config = {
    routes: {
        HOME: '/',
        DISTRIBUTION: {
            CLAIM: '/',
            SUCCESS: '/success',
        },
        MY_ACCOUNT: {
            DASHBOARD: '/dashboard',
            DEPOSIT: '/dashboard/deposit',
            WITHDRAW: '/dashboard/withdraw',
            ENABLE_ACCOUNT: '/dashboard/enable_account',
            OPERATOR: '/dashboard/operator/:public_key',
            VALIDATOR: '/dashboard/validator/:public_key',
            EDIT_VALIDATOR: '/dashboard/validator/:public_key/edit',
            REMOVE_VALIDATOR: '/dashboard/validator/:public_key/remove',
            VALIDATOR_REMOVED: '/dashboard/validator/:public_key/removed',
            CONFIRM_OPERATORS: '/dashboard/validator/:public_key/confirm',
            UPLOAD_KEY_STORE: '/dashboard/validator/:public_key/upload_key_store',
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
            VALID_KEY_LENGTH: 612,
            SELECT_MINIMUM_OPERATORS: 4,
            AUTO_SELECT: process.env.REACT_APP_FEATURE_AUTO_SELECT_OPERATORS,
        },
        TESTING: {
            GENERATE_RANDOM_OPERATOR_KEY: process.env.REACT_APP_DEBUG,
        },
    },
    links: {
        COMPLIANCE_URL: process.env.REACT_APP_COMPLIANCE_URL,
        ETHER_SCAN_LINK: process.env.REACT_APP_ETHER_SCAN_URL,
        LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
        LAUNCHPAD_LINK: 'https://prater.launchpad.ethereum.org/en/',
        LINK_COIN_EXCHANGE_API: process.env.REACT_APP_COIN_EXCHANGE_URL,
        EXPLORER_CENTER: String(process.env.REACT_APP_OPERATORS_ENDPOINT),
        TOOL_TIP_KEY_LINK: 'https://docs.ssv.network/operators/install-instructions',
        GASNOW_API_URL: 'https://www.gasnow.org/api/v3/gas/price?utm_source=ssv.network',
        LINK_EXPLORER: process.env.REACT_APP_EXPLORER_URL || 'https://explorer.stage.ssv.network',
    },
    GLOBAL_VARIABLE: {
        BLOCKS_PER_DAY: 6570,
        OPERATORS_PER_PAGE: 50,
        BLOCKS_PER_YEAR: 2398050,
        VALIDATORS_PER_OPERATOR_LIMIT: 1,
        NUMBERS_OF_WEEKS_IN_YEAR: 52.1429,
    },
    ONBOARD: {
        API_KEY: process.env.REACT_APP_BLOCKNATIVE_KEY,
        NETWORK_ID: process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID,
    },
    COIN_KEY: {
        COIN_EXCHANGE_KEY: process.env.REACT_APP_COIN_EXCHANGE_KEY,
    },
    CONTRACTS: {
        SSV_TOKEN: {
            ADDRESS: String(process.env.REACT_APP_REGISTRY_CONTRACT_ADDRESS),
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
                                'indexed': true,
                                'internalType': 'address',
                                'name': 'ownerAddress',
                                'type': 'address',
                            },
                        ],
                        'name': 'AccountEnabled',
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
                        ],
                        'name': 'AccountLiquidated',
                        'type': 'event',
                    },
                    {
                        'anonymous': false,
                        'inputs': [
                            {
                                'indexed': false,
                                'internalType': 'uint256',
                                'name': 'value',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'ApproveOperatorFeePeriodUpdated',
                        'type': 'event',
                    },
                    {
                        'anonymous': false,
                        'inputs': [
                            {
                                'indexed': false,
                                'internalType': 'uint256',
                                'name': 'value',
                                'type': 'uint256',
                            },
                            {
                                'indexed': false,
                                'internalType': 'address',
                                'name': 'ownerAddress',
                                'type': 'address',
                            },
                        ],
                        'name': 'FundsDeposited',
                        'type': 'event',
                    },
                    {
                        'anonymous': false,
                        'inputs': [
                            {
                                'indexed': false,
                                'internalType': 'uint256',
                                'name': 'value',
                                'type': 'uint256',
                            },
                            {
                                'indexed': false,
                                'internalType': 'address',
                                'name': 'ownerAddress',
                                'type': 'address',
                            },
                        ],
                        'name': 'FundsWithdrawn',
                        'type': 'event',
                    },
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
                                'indexed': false,
                                'internalType': 'uint256',
                                'name': 'value',
                                'type': 'uint256',
                            },
                            {
                                'indexed': false,
                                'internalType': 'address',
                                'name': 'recipient',
                                'type': 'address',
                            },
                        ],
                        'name': 'NetworkFeesWithdrawn',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
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
                                'internalType': 'uint256',
                                'name': 'id',
                                'type': 'uint256',
                            },
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
                            {
                                'indexed': false,
                                'internalType': 'uint256',
                                'name': 'fee',
                                'type': 'uint256',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'OperatorDeactivated',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
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
                        'name': 'OperatorFeeApproved',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
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
                        'name': 'OperatorFeeSet',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'OperatorFeeSetCanceled',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'OperatorRemoved',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
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
                                'internalType': 'uint256',
                                'name': 'value',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'SetOperatorFeePeriodUpdated',
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
                                'internalType': 'uint256[]',
                                'name': 'operatorIds',
                                'type': 'uint256[]',
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
                        'name': 'ValidatorRemoved',
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
                                'internalType': 'uint256[]',
                                'name': 'operatorIds',
                                'type': 'uint256[]',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'activateOperator',
                        'outputs': [

                        ],
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'approveOperatorFee',
                        'outputs': [

                        ],
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'cancelSetOperatorFee',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'deactivateOperator',
                        'outputs': [

                        ],
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
                        'outputs': [

                        ],
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
                        'name': 'enableAccount',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [

                        ],
                        'name': 'getApproveOperatorFeePeriod',
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

                        ],
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'getOperatorFeeChangeRequest',
                        'outputs': [
                            {
                                'internalType': 'uint256',
                                'name': '',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'uint256',
                                'name': '',
                                'type': 'uint256',
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
                                'internalType': 'uint256[]',
                                'name': '',
                                'type': 'uint256[]',
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
                                'internalType': 'uint256[]',
                                'name': '',
                                'type': 'uint256[]',
                            },
                        ],
                        'stateMutability': 'view',
                        'type': 'function',
                    },
                    {
                        'inputs': [

                        ],
                        'name': 'getSetOperatorFeePeriod',
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

                        ],
                        'name': 'getValidatorsPerOperatorLimit',
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
                                'internalType': 'contract ISSVRegistry',
                                'name': 'registryAddress_',
                                'type': 'address',
                            },
                            {
                                'internalType': 'contract IERC20',
                                'name': 'token_',
                                'type': 'address',
                            },
                            {
                                'internalType': 'uint256',
                                'name': 'minimumBlocksBeforeLiquidation_',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'uint256',
                                'name': 'operatorMaxFeeIncrease_',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'uint256',
                                'name': 'setOperatorFeePeriod_',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'uint256',
                                'name': 'approveOperatorFeePeriod_',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'uint256',
                                'name': 'validatorsPerOperatorLimit_',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'initialize',
                        'outputs': [

                        ],
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
                        'name': 'isOwnerValidatorsDisabled',
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
                                'internalType': 'address[]',
                                'name': 'ownerAddresses',
                                'type': 'address[]',
                            },
                        ],
                        'name': 'liquidate',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [

                        ],
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
                        'inputs': [

                        ],
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
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
                        'inputs': [

                        ],
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
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
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
                        'name': 'operatorsByPublicKey',
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
                        ],
                        'stateMutability': 'view',
                        'type': 'function',
                    },
                    {
                        'inputs': [

                        ],
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
                        'outputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
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
                                'internalType': 'uint256[]',
                                'name': 'operatorIds',
                                'type': 'uint256[]',
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
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'removeOperator',
                        'outputs': [

                        ],
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
                        'name': 'removeValidator',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [

                        ],
                        'name': 'renounceOwnership',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'uint256',
                                'name': 'fee',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'setOperatorFee',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'validatorsPerOperatorLimit_',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'setValidatorsPerOperatorLimit',
                        'outputs': [

                        ],
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
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'newApproveOperatorFeePeriod',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'updateApproveOperatorFeePeriod',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'newMinimumBlocksBeforeLiquidation',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'updateMinimumBlocksBeforeLiquidation',
                        'outputs': [

                        ],
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
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'newOperatorMaxFeeIncrease',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'updateOperatorMaxFeeIncrease',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'operatorId',
                                'type': 'uint256',
                            },
                            {
                                'internalType': 'uint256',
                                'name': 'score',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'updateOperatorScore',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'newSetOperatorFeePeriod',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'updateSetOperatorFeePeriod',
                        'outputs': [

                        ],
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
                                'internalType': 'uint256[]',
                                'name': 'operatorIds',
                                'type': 'uint256[]',
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
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'operatorId_',
                                'type': 'uint256',
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
                        'inputs': [
                            {
                                'internalType': 'uint256',
                                'name': 'tokenAmount',
                                'type': 'uint256',
                            },
                        ],
                        'name': 'withdraw',
                        'outputs': [

                        ],
                        'stateMutability': 'nonpayable',
                        'type': 'function',
                    },
                    {
                        'inputs': [

                        ],
                        'name': 'withdrawAll',
                        'outputs': [

                        ],
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
                        'outputs': [

                        ],
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
        SSV_DISTRIBUTION: {
            ADDRESS: String(process.env.REACT_APP_DISTRIBUTION_CONTRACT_ADDRESS),
            ABI: [
                {
                    'inputs': [
                        {
                            'internalType': 'address',
                            'name': 'token_',
                            'type': 'address',
                        },
                        {
                            'internalType': 'bytes32',
                            'name': 'merkleRoot_',
                            'type': 'bytes32',
                        },
                        {
                            'internalType': 'address',
                            'name': 'treasury_',
                            'type': 'address',
                        },
                    ],
                    'stateMutability': 'nonpayable',
                    'type': 'constructor',
                },
                {
                    'anonymous': false,
                    'inputs': [
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'index',
                            'type': 'uint256',
                        },
                        {
                            'indexed': false,
                            'internalType': 'address',
                            'name': 'account',
                            'type': 'address',
                        },
                        {
                            'indexed': false,
                            'internalType': 'uint256',
                            'name': 'amount',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'Claimed',
                    'type': 'event',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'index',
                            'type': 'uint256',
                        },
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
                        {
                            'internalType': 'bytes32[]',
                            'name': 'merkleProof',
                            'type': 'bytes32[]',
                        },
                    ],
                    'name': 'claim',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'endAirdrop',
                    'outputs': [],
                    'stateMutability': 'nonpayable',
                    'type': 'function',
                },
                {
                    'inputs': [
                        {
                            'internalType': 'uint256',
                            'name': 'index',
                            'type': 'uint256',
                        },
                    ],
                    'name': 'isClaimed',
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
                    'inputs': [],
                    'name': 'merkleRoot',
                    'outputs': [
                        {
                            'internalType': 'bytes32',
                            'name': '',
                            'type': 'bytes32',
                        },
                    ],
                    'stateMutability': 'view',
                    'type': 'function',
                },
                {
                    'inputs': [],
                    'name': 'timeout',
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
                    'name': 'token',
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
                    'name': 'treasury',
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
            ],
        },
    },
};

export default config;
