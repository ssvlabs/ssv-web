const config = {
  DEBUG: process.env.REACT_APP_DEBUG || false,
  retry: {
    default: {
      maxAttempts: 5,
      backOff: 500,
      exponentialOption: {
        maxInterval: 5000,
        multiplier: 2,
      },
      doRetry: (e: Error) => {
        console.error(`Error: ${e.message || e.stack || e}. Retrying..`);
        return true;
      },
    },
  },
  routes: {
    COUNTRY_NOT_SUPPORTED: '/compliance',
    DISTRIBUTION: {
      ROOT: '/',
      CLAIM: '/',
      SUCCESS: '/success',
    },
    FAUCET: {
      ROOT: '/',
      SUCCESS: '/success',
      DEPLETED: '/depleted',
    },
    SSV: {
      ROOT: '/join',
      MY_ACCOUNT: {
        ROOT: '/my-account',
        WITHDRAW: '/my-account/withdraw',
        CLUSTER_DASHBOARD: '/my-account/clusters-dashboard',
        OPERATOR_DASHBOARD: '/my-account/operators-dashboard',
        OPERATOR: {
          ROOT: '/my-account/operator',
          WITHDRAW: '/my-account/operator/withdraw',
          META_DATA: '/my-account/operator/edit_name',
          REMOVE: {
            ROOT: '/my-account/operator/remove',
            SUCCESS: '/my-account/operator/remove/success',
          },
          UPDATE_FEE: {
            ROOT: '/my-account/operator/fee-update',
            START: '/my-account/operator/fee-update/start',
            UPDATE: '/my-account/operator/fee-update/update',
            PENDING: '/my-account/operator/fee-update/pending',
            SUCCESS: '/my-account/operator/fee-update/success',
            EXPIRED: '/my-account/operator/fee-update/expired',
          },
        },
        CLUSTER: {
          ROOT: '/my-account/cluster',
          DEPOSIT: '/my-account/cluster/deposit',
          WITHDRAW: '/my-account/cluster/withdraw',
          FEE_RECIPIENT: '/my-account/fee-recipient',
          REACTIVATE: '/my-account/cluster/reactivate',
          SUCCESS_PAGE: '/my-account/cluster/register/success',
          ADD_VALIDATOR: '/my-account/cluster/register/funding',
          UPLOAD_KEY_STORE: '/my-account/cluster/register/upload-keystore',
          SLASHING_WARNING: '/my-account/cluster/register/slashing-warning',
          DISTRIBUTE_OFFLINE: '/my-account/cluster/register/distribute-offline',
          CONFIRMATION_PAGE: '/my-account/cluster/register/confirm-transaction',
          DISTRIBUTION_METHOD_START: '/my-account/cluster/register/distribution-method',
          VALIDATOR_UPDATE: {
            ROOT: '/my-account/validator/update',
            ENTER_KEYSTORE: '/my-account/validator/update/enter-key',
            CHOOSE_OPERATORS: '/my-account/validator/update/choose-operators',
            CONFIRM_TRANSACTION: '/my-account/validator/update/confirm-transaction',
            SUCCESS: '/my-account/validator/update/success',
          },
          VALIDATOR_REMOVE: {
            ROOT: '/my-account/cluster/remove-validator',
            REMOVED: '/my-account/cluster/removed',
          },
        },
        // EDIT_VALIDATOR: '/my-account/validator/:public_key/edit',
        REMOVE_VALIDATOR: '/my-account/validator/:public_key/remove',
        VALIDATOR_REMOVED: '/my-account/validator/:public_key/removed',
        CONFIRM_OPERATORS: '/my-account/validator/:public_key/confirm',
        UPLOAD_KEY_STORE: '/my-account/validator/:public_key/upload_key_store',
      },
      OPERATOR: {
        HOME: '/join/operator',
        GENERATE_KEYS: '/join/operator/register',
        SET_FEE_PAGE: '/join/operator/register-fee',
        CONFIRMATION_PAGE: '/join/operator/confirm-transaction',
        SUCCESS_PAGE: '/join/operator/success',
      },
      VALIDATOR: {
        HOME: '/join/validator',
        CREATE: '/join/validator/launchpad',
        SUCCESS_PAGE: '/join/validator/success',
        IMPORT: '/join/validator/upload-keystore',
        DISTRIBUTION_METHOD: {
          START: '/join/validator/distribution-method',
          DISTRIBUTE_OFFLINE: '/join/validator/distribute-offline',
          UPLOAD_KEYSHARES: '/join/validator/upload-keyshares',
        },
        FUNDING_PERIOD_PAGE: '/join/validator/funding',
        SELECT_OPERATORS: '/join/validator/choose-operators',
        SLASHING_WARNING: '/join/validator/slashing-warning',
        DEPOSIT_VALIDATOR: '/join/validator/deposit-validator',
        CONFIRMATION_PAGE: '/join/validator/confirm-transaction',
        ACCOUNT_BALANCE_AND_FEE: '/join/validator/balance-warning',
      },
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
    ETHER_SCAN_LINK: process.env.REACT_APP_ETHER_SCAN_URL,
    LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
    LAUNCHPAD_LINK: 'https://prater.launchpad.ethereum.org/en/',
    LINK_COIN_EXCHANGE_API: process.env.REACT_APP_COIN_EXCHANGE_URL,
    EXPLORER_VERSION: process.env.REACT_APP_EXPLORER_VERSION || 'v2',
    EXPLORER_NETWORK: process.env.REACT_APP_EXPLORER_NETWORK || 'prater',
    TOOL_TIP_KEY_LINK: 'https://docs.ssv.network/operators/install-instructions',
    GASNOW_API_URL: 'https://www.gasnow.org/api/v3/gas/price?utm_source=ssv.network',
    ETHER_RESPONSIBILITIES: 'https://launchpad.ethereum.org/en/faq#responsibilities',
    REACTIVATION_LINK: 'https://docs.ssv.network/learn/stakers/clusters/reactivation',
    COMPLIANCE_URL: `${process.env.REACT_APP_BLOX_API}/compliance/countries/restricted`,
    EXPLORER_URL: process.env.REACT_APP_EXPLORER_URL || 'https://explorer.stage.ssv.network',
    SSV_API_ENDPOINT: process.env.REACT_APP_SSV_API_ENDPOINT || 'https://api.stage.ssv.network/api/v2',
    MORE_ON_LIQUIDATION_LINK: 'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations',
    MONITOR_YOUR_NODE_URL: 'https://docs.ssv.network/run-a-node/operator-node/maintenance/monitoring-grafana',
  },
  GLOBAL_VARIABLE: {
    BLOCKS_PER_DAY: 7160,
    OPERATORS_PER_PAGE: 50,
    BLOCKS_PER_YEAR: 2613400,
    DEFAULT_CLUSTER_PERIOD: 730,
    NUMBERS_OF_WEEKS_IN_YEAR: 52.1429,
    CLUSTER_VALIDITY_PERIOD_MINIMUM: 30,
    MINIMUM_OPERATOR_FEE_PER_BLOCK: 0.00000001,
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
    SSV_NETWORK_SETTER: {
      ADDRESS: String(process.env.REACT_APP_NETWORK_SETTER_CONTRACT_ADDRESS),
      ABI: [
        {
          'inputs': [],
          'name': 'ApprovalNotWithinTimeframe',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'CallerNotOwner',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'CallerNotWhitelisted',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterAlreadyEnabled',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterDoesNotExists',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterIsLiquidated',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterNotLiquidatable',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ExceedValidatorLimit',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'FeeExceedsIncreaseLimit',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'FeeIncreaseNotAllowed',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'FeeTooLow',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'IncorrectClusterState',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'InsufficientBalance',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'InvalidOperatorIdsLength',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'InvalidPublicKeyLength',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'NewBlockPeriodIsBelowMinimum',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'NoFeeDelcared',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'OperatorDoesNotExist',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'SameFeeChangeNotAllowed',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'TokenTransferFailed',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'UnsortedOperatorsList',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ValidatorAlreadyExists',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ValidatorDoesNotExist',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ValidatorOwnedByOtherAddress',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ZeroFeeIncreaseNotAllowed',
          'type': 'error',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'address',
              'name': 'previousAdmin',
              'type': 'address',
            },
            {
              'indexed': false,
              'internalType': 'address',
              'name': 'newAdmin',
              'type': 'address',
            },
          ],
          'name': 'AdminChanged',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': true,
              'internalType': 'address',
              'name': 'beacon',
              'type': 'address',
            },
          ],
          'name': 'BeaconUpgraded',
          'type': 'event',
        },
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
              'indexed': false,
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'indexed': false,
              'internalType': 'uint256',
              'name': 'value',
              'type': 'uint256',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'indexed': false,
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'ClusterDeposited',
          'type': 'event',
        },
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
              'indexed': false,
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'indexed': false,
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'ClusterLiquidated',
          'type': 'event',
        },
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
              'indexed': false,
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'indexed': false,
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'ClusterReactivated',
          'type': 'event',
        },
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
              'indexed': false,
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'indexed': false,
              'internalType': 'uint256',
              'name': 'value',
              'type': 'uint256',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'indexed': false,
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'ClusterWithdrawn',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'uint64',
              'name': 'value',
              'type': 'uint64',
            },
          ],
          'name': 'DeclareOperatorFeePeriodUpdated',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'uint64',
              'name': 'value',
              'type': 'uint64',
            },
          ],
          'name': 'ExecuteOperatorFeePeriodUpdated',
          'type': 'event',
        },
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
              'indexed': false,
              'internalType': 'address',
              'name': 'recipientAddress',
              'type': 'address',
            },
          ],
          'name': 'FeeRecipientAddressUpdated',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'uint8',
              'name': 'version',
              'type': 'uint8',
            },
          ],
          'name': 'Initialized',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'uint64',
              'name': 'value',
              'type': 'uint64',
            },
          ],
          'name': 'LiquidationThresholdPeriodUpdated',
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
          'name': 'MinimumLiquidationCollateralUpdated',
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
          'name': 'NetworkEarningsWithdrawn',
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
              'indexed': true,
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
            {
              'indexed': true,
              'internalType': 'address',
              'name': 'owner',
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
              'name': 'owner',
              'type': 'address',
            },
            {
              'indexed': true,
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'OperatorFeeCancellationDeclared',
          'type': 'event',
        },
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
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
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
          'name': 'OperatorFeeDeclared',
          'type': 'event',
        },
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
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
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
          'name': 'OperatorFeeExecuted',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'uint64',
              'name': 'value',
              'type': 'uint64',
            },
          ],
          'name': 'OperatorFeeIncreaseLimitUpdated',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': true,
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
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
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
            {
              'indexed': false,
              'internalType': 'address',
              'name': 'whitelisted',
              'type': 'address',
            },
          ],
          'name': 'OperatorWhitelistUpdated',
          'type': 'event',
        },
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
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
            {
              'indexed': false,
              'internalType': 'uint256',
              'name': 'value',
              'type': 'uint256',
            },
          ],
          'name': 'OperatorWithdrawn',
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
          'name': 'OwnershipTransferStarted',
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
              'name': 'implementation',
              'type': 'address',
            },
          ],
          'name': 'Upgraded',
          'type': 'event',
        },
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
              'indexed': false,
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'indexed': false,
              'internalType': 'bytes',
              'name': 'publicKey',
              'type': 'bytes',
            },
            {
              'indexed': false,
              'internalType': 'bytes',
              'name': 'shares',
              'type': 'bytes',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'indexed': false,
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'ValidatorAdded',
          'type': 'event',
        },
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
              'indexed': false,
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
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
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'indexed': false,
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'ValidatorRemoved',
          'type': 'event',
        },
        {
          'inputs': [],
          'name': 'acceptOwnership',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'cancelDeclaredOperatorFee',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'bytes32',
              'name': '',
              'type': 'bytes32',
            },
          ],
          'name': 'clusters',
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
          'name': 'dao',
          'outputs': [
            {
              'internalType': 'uint32',
              'name': 'validatorCount',
              'type': 'uint32',
            },
            {
              'internalType': 'uint64',
              'name': 'balance',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'block',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
            {
              'internalType': 'uint256',
              'name': 'fee',
              'type': 'uint256',
            },
          ],
          'name': 'declareOperatorFee',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'declareOperatorFeePeriod',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'address',
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'internalType': 'uint256',
              'name': 'amount',
              'type': 'uint256',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'deposit',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'executeOperatorFee',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'executeOperatorFeePeriod',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'string',
              'name': 'initialVersion_',
              'type': 'string',
            },
            {
              'internalType': 'contract IERC20',
              'name': 'token_',
              'type': 'address',
            },
            {
              'internalType': 'uint64',
              'name': 'operatorMaxFeeIncrease_',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'declareOperatorFeePeriod_',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'executeOperatorFeePeriod_',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'minimumBlocksBeforeLiquidation_',
              'type': 'uint64',
            },
            {
              'internalType': 'uint256',
              'name': 'minimumLiquidationCollateral_',
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
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'liquidate',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'minimumBlocksBeforeLiquidation',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'minimumLiquidationCollateral',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'network',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': 'networkFee',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'networkFeeIndex',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'networkFeeIndexBlockNumber',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'name': 'operatorFeeChangeRequests',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': 'fee',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'approvalBeginTime',
              'type': 'uint64',
            },
            {
              'internalType': 'uint64',
              'name': 'approvalEndTime',
              'type': 'uint64',
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
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'name': 'operators',
          'outputs': [
            {
              'internalType': 'address',
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'uint64',
              'name': 'fee',
              'type': 'uint64',
            },
            {
              'internalType': 'uint32',
              'name': 'validatorCount',
              'type': 'uint32',
            },
            {
              'components': [
                {
                  'internalType': 'uint64',
                  'name': 'block',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'balance',
                  'type': 'uint64',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Snapshot',
              'name': 'snapshot',
              'type': 'tuple',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'name': 'operatorsWhitelist',
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
          'name': 'pendingOwner',
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
          'name': 'proxiableUUID',
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
          'inputs': [
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'internalType': 'uint256',
              'name': 'amount',
              'type': 'uint256',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'reactivate',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
            {
              'internalType': 'uint256',
              'name': 'fee',
              'type': 'uint256',
            },
          ],
          'name': 'reduceOperatorFee',
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
          'name': 'registerOperator',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': 'id',
              'type': 'uint64',
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
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'internalType': 'bytes',
              'name': 'shares',
              'type': 'bytes',
            },
            {
              'internalType': 'uint256',
              'name': 'amount',
              'type': 'uint256',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'registerValidator',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'removeOperator',
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
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'removeValidator',
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
              'internalType': 'address',
              'name': 'recipientAddress',
              'type': 'address',
            },
          ],
          'name': 'setFeeRecipientAddress',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
            {
              'internalType': 'address',
              'name': 'whitelisted',
              'type': 'address',
            },
          ],
          'name': 'setOperatorWhitelist',
          'outputs': [],
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
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'newDeclareOperatorFeePeriod',
              'type': 'uint64',
            },
          ],
          'name': 'updateDeclareOperatorFeePeriod',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'newExecuteOperatorFeePeriod',
              'type': 'uint64',
            },
          ],
          'name': 'updateExecuteOperatorFeePeriod',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'blocks',
              'type': 'uint64',
            },
          ],
          'name': 'updateLiquidationThresholdPeriod',
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
          'name': 'updateMinimumLiquidationCollateral',
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
              'internalType': 'uint64',
              'name': 'newOperatorMaxFeeIncrease',
              'type': 'uint64',
            },
          ],
          'name': 'updateOperatorFeeIncreaseLimit',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'address',
              'name': 'newImplementation',
              'type': 'address',
            },
          ],
          'name': 'upgradeTo',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'address',
              'name': 'newImplementation',
              'type': 'address',
            },
            {
              'internalType': 'bytes',
              'name': 'data',
              'type': 'bytes',
            },
          ],
          'name': 'upgradeToAndCall',
          'outputs': [],
          'stateMutability': 'payable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'bytes32',
              'name': '',
              'type': 'bytes32',
            },
          ],
          'name': 'validatorPKs',
          'outputs': [
            {
              'internalType': 'address',
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'bool',
              'name': 'active',
              'type': 'bool',
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
              'internalType': 'uint32',
              'name': '',
              'type': 'uint32',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'version',
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
          'inputs': [
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'internalType': 'uint256',
              'name': 'amount',
              'type': 'uint256',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
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
          'name': 'withdrawNetworkEarnings',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
            {
              'internalType': 'uint256',
              'name': 'amount',
              'type': 'uint256',
            },
          ],
          'name': 'withdrawOperatorEarnings',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'withdrawOperatorEarnings',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
      ],
    },
    SSV_NETWORK_GETTER: {
      ADDRESS: String(process.env.REACT_APP_NETWORK_GETTER_CONTRACT_ADDRESS),
      ABI: [
        {
          'inputs': [],
          'name': 'ApprovalNotWithinTimeframe',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'CallerNotOwner',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'CallerNotWhitelisted',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterAlreadyEnabled',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterDoesNotExists',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterIsLiquidated',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ClusterNotLiquidatable',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ExceedValidatorLimit',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'FeeExceedsIncreaseLimit',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'FeeIncreaseNotAllowed',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'FeeTooLow',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'IncorrectClusterState',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'InsufficientBalance',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'InvalidOperatorIdsLength',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'InvalidPublicKeyLength',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'NewBlockPeriodIsBelowMinimum',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'NoFeeDelcared',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'OperatorDoesNotExist',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'SameFeeChangeNotAllowed',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'TokenTransferFailed',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'UnsortedOperatorsList',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ValidatorAlreadyExists',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ValidatorDoesNotExist',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ValidatorOwnedByOtherAddress',
          'type': 'error',
        },
        {
          'inputs': [],
          'name': 'ZeroFeeIncreaseNotAllowed',
          'type': 'error',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'address',
              'name': 'previousAdmin',
              'type': 'address',
            },
            {
              'indexed': false,
              'internalType': 'address',
              'name': 'newAdmin',
              'type': 'address',
            },
          ],
          'name': 'AdminChanged',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': true,
              'internalType': 'address',
              'name': 'beacon',
              'type': 'address',
            },
          ],
          'name': 'BeaconUpgraded',
          'type': 'event',
        },
        {
          'anonymous': false,
          'inputs': [
            {
              'indexed': false,
              'internalType': 'uint8',
              'name': 'version',
              'type': 'uint8',
            },
          ],
          'name': 'Initialized',
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
          'name': 'OwnershipTransferStarted',
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
              'name': 'implementation',
              'type': 'address',
            },
          ],
          'name': 'Upgraded',
          'type': 'event',
        },
        {
          'inputs': [],
          'name': 'acceptOwnership',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'address',
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'getBalance',
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
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'getBurnRate',
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
          'name': 'getDeclaredOperatorFeePeriod',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'getExecuteOperatorFeePeriod',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'getLiquidationThresholdPeriod',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [],
          'name': 'getMinimumLiquidationCollateral',
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
          'name': 'getNetworkEarnings',
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
          'name': 'getNetworkFee',
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
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'getOperatorById',
          'outputs': [
            {
              'internalType': 'address',
              'name': '',
              'type': 'address',
            },
            {
              'internalType': 'uint256',
              'name': '',
              'type': 'uint256',
            },
            {
              'internalType': 'uint32',
              'name': '',
              'type': 'uint32',
            },
            {
              'internalType': 'bool',
              'name': '',
              'type': 'bool',
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
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'getOperatorDeclaredFee',
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
              'internalType': 'uint64',
              'name': 'id',
              'type': 'uint64',
            },
          ],
          'name': 'getOperatorEarnings',
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
              'internalType': 'uint64',
              'name': 'operatorId',
              'type': 'uint64',
            },
          ],
          'name': 'getOperatorFee',
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
          'name': 'getOperatorFeeIncreaseLimit',
          'outputs': [
            {
              'internalType': 'uint64',
              'name': '',
              'type': 'uint64',
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
          'name': 'getValidator',
          'outputs': [
            {
              'internalType': 'address',
              'name': '',
              'type': 'address',
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
          'inputs': [],
          'name': 'getVersion',
          'outputs': [
            {
              'internalType': 'string',
              'name': 'version',
              'type': 'string',
            },
          ],
          'stateMutability': 'view',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'contract SSVNetwork',
              'name': 'ssvNetwork_',
              'type': 'address',
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
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'isLiquidatable',
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
              'name': 'owner',
              'type': 'address',
            },
            {
              'internalType': 'uint64[]',
              'name': 'operatorIds',
              'type': 'uint64[]',
            },
            {
              'components': [
                {
                  'internalType': 'uint32',
                  'name': 'validatorCount',
                  'type': 'uint32',
                },
                {
                  'internalType': 'uint64',
                  'name': 'networkFeeIndex',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint64',
                  'name': 'index',
                  'type': 'uint64',
                },
                {
                  'internalType': 'uint256',
                  'name': 'balance',
                  'type': 'uint256',
                },
                {
                  'internalType': 'bool',
                  'name': 'active',
                  'type': 'bool',
                },
              ],
              'internalType': 'struct ISSVNetworkCore.Cluster',
              'name': 'cluster',
              'type': 'tuple',
            },
          ],
          'name': 'isLiquidated',
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
          'name': 'pendingOwner',
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
          'name': 'proxiableUUID',
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
          'name': 'renounceOwnership',
          'outputs': [],
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
        {
          'inputs': [
            {
              'internalType': 'address',
              'name': 'newImplementation',
              'type': 'address',
            },
          ],
          'name': 'upgradeTo',
          'outputs': [],
          'stateMutability': 'nonpayable',
          'type': 'function',
        },
        {
          'inputs': [
            {
              'internalType': 'address',
              'name': 'newImplementation',
              'type': 'address',
            },
            {
              'internalType': 'bytes',
              'name': 'data',
              'type': 'bytes',
            },
          ],
          'name': 'upgradeToAndCall',
          'outputs': [],
          'stateMutability': 'payable',
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
