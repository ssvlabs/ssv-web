import { ABI_VERSION } from '~app/common/config/abi';
import { getCurrentNetwork } from '~lib/utils/envHelper';
import { distributionHelper } from '~lib/utils/distributionHelper';

const {
  networkId,
  api,
  tokenAddress,
  setterContractAddress,
  getterContractAddress,
  explorerUrl,
  apiVersion,
} = getCurrentNetwork();

const { abi, contract } = distributionHelper(networkId);

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
        KEYSHARE_UPLOAD_UNSAFE: '/my-account/upload-keyshare-unsafe',
        OPERATOR: {
          ROOT: '/my-account/operator',
          WITHDRAW: '/my-account/operator/withdraw',
          META_DATA: '/my-account/operator/edit-metadata',
          ACCESS_SETTINGS: '/my-account/operator/permission-change',
          META_DATA_CONFIRMATION: '/my-account/operator/edit-metadata/confirmation',
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
        MIGRATION: {
          START_MIGRATION: '/my-account/migration',
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
          UPLOAD_KEYSHARES: '/my-account/cluster/register/upload-keyshares',
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
          DISTRIBUTE_SUMMARY: '/join/validator/ceremony-summary',
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
    SSV_API_ENDPOINT: api,
    EXPLORER_URL: explorerUrl,
    SSV_WEB_SITE: 'https://ssv.network/',
    TWITTER_LINK: 'https://twitter.com/ssv_network',
    GOVERNANCE_FORUM_LINK: 'https://forum.ssv.network/',
    ETHER_SCAN_LINK: process.env.REACT_APP_ETHER_SCAN_URL,
    DISCORD_LINK: 'https://discord.gg/ssvnetworkofficial',
    TERMS_OF_USE_LINK: 'https://ssv.network/terms-of-use/',
    PRIVACY_POLICY_LINK: 'https://ssv.network/privacy-policy/',
    LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
    LAUNCHPAD_LINK: 'https://prater.launchpad.ethereum.org/en/',
    SNAPSHOT_LINK: 'https://snapshot.org/#/mainnet.ssvnetwork.eth',
    SSV_DOCUMENTATION: 'https://docs.ssv.network/learn/introduction',
    LINK_COIN_EXCHANGE_API: process.env.REACT_APP_COIN_EXCHANGE_URL,
    MORE_ON_CLUSTERS: 'https://docs.ssv.network/learn/stakers/clusters',
    SSV_UPDATE_FEE_DOCS: 'https://docs.ssv.network/learn/operators/update-fee',
    TOOL_TIP_KEY_LINK: 'https://docs.ssv.network/operators/install-instructions',
    GASNOW_API_URL: 'https://www.gasnow.org/api/v3/gas/price?utm_source=ssv.network',
    ETHER_RESPONSIBILITIES: 'https://launchpad.ethereum.org/en/faq#responsibilities',
    REACTIVATION_LINK: 'https://docs.ssv.network/learn/stakers/clusters/reactivation',
    COMPLIANCE_URL: `${process.env.REACT_APP_BLOX_API}/compliance/countries/restricted`,
    UPDATE_OPERATORS_LINK: 'https://docs.ssv.network/learn/stakers/validators/update-operators',
    MORE_ABOUT_UPDATE_FEES: 'https://docs.ssv.network/learn/operators/update-fee#_nn1qsdauoghf',
    MORE_ON_FEES: 'https://docs.ssv.network/learn/protocol-overview/tokenomics/fees#_k4tw9to38r3v',
    MORE_ON_LIQUIDATION_LINK: 'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations',
    MONITOR_YOUR_NODE_URL: 'https://docs.ssv.network/run-a-node/operator-node/maintenance/monitoring-grafana',
    DKG_TROUBLESHOOTING_LINK: 'https://docs.ssv.network/developers/tools/ssv-dkg-client/generate-key-shares#troubleshooting',
  },
  GLOBAL_VARIABLE: {
    GAS_FIXED_PRICE: {
      GAS_PRICE: process.env.REACT_APP_GAS_PRICE,
      GAS_LIMIT: process.env.REACT_APP_GAS_LIMIT,
    },
    BLOCKS_PER_DAY: 7160,
    OPERATORS_PER_PAGE: 50,
    BLOCKS_PER_YEAR: 2613400,
    DEFAULT_CLUSTER_PERIOD: 730,
    NUMBERS_OF_WEEKS_IN_YEAR: 52.1429,
    CLUSTER_VALIDITY_PERIOD_MINIMUM: 30,
    MINIMUM_OPERATOR_FEE_PER_BLOCK: 0.00000001,
    DEFAULT_ADDRESS_WHITELIST: '0x0000000000000000000000000000000000000000',
  },
  ONBOARD: {
    API_KEY: process.env.REACT_APP_BLOCKNATIVE_KEY,
    NETWORK_ID: networkId,
  },
  COIN_KEY: {
    COIN_EXCHANGE_KEY: process.env.REACT_APP_COIN_EXCHANGE_KEY,
  },
  CONTRACTS: {
    SSV_TOKEN: {
      ADDRESS: tokenAddress,
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
      ADDRESS: setterContractAddress,
      ABI: ABI_VERSION.setterContract[`${networkId}_${apiVersion}`],
    },
    SSV_NETWORK_GETTER: {
      ADDRESS: getterContractAddress,
      ABI: ABI_VERSION.getterContract[`${networkId}_${apiVersion}`],
    },
    SSV_DISTRIBUTION: {
      ADDRESS: contract,
      ABI: abi,
    },
  },
};

export default config;
