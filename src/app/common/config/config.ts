import { ABI_VERSION } from '~app/common/config/abi';
import { distributionHelper } from '~lib/utils/distributionHelper';
import { getStoredNetwork } from '~root/providers/networkInfo.provider';

const {
  networkId,
  api,
  tokenAddress,
  setterContractAddress,
  getterContractAddress,
  explorerUrl,
  apiVersion,
} = getStoredNetwork();

const {
  abi,
  // contract,
} = distributionHelper(networkId);

const config = {
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
            REMOVED: '/my-account/cluster/removed',
            BULK: '/my-account/cluster/bulk',
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
  links: {
    SSV_API_ENDPOINT: api,
    EXPLORER_URL: explorerUrl,
    SSV_WEB_SITE: 'https://ssv.network/',
    TWITTER_LINK: 'https://twitter.com/ssv_network',
    GOVERNANCE_FORUM_LINK: 'https://forum.ssv.network/',
    DISCORD_LINK: 'https://discord.gg/ssvnetworkofficial',
    TERMS_OF_USE_LINK: 'https://ssv.network/terms-of-use/',
    PRIVACY_POLICY_LINK: 'https://ssv.network/privacy-policy/',
    LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
    LAUNCHPAD_LINK: 'https://prater.launchpad.ethereum.org/en/',
    SNAPSHOT_LINK: 'https://snapshot.org/#/mainnet.ssvnetwork.eth',
    SSV_DOCUMENTATION: 'https://docs.ssv.network/learn/introduction',
    DKG_DOCKER_INSTALL_URL: 'https://docs.docker.com/engine/install/',
    MORE_ON_CLUSTERS: 'https://docs.ssv.network/learn/stakers/clusters',
    SSV_KEYS_RELEASES_URL: 'https://github.com/bloxapp/ssv-keys/releases',
    SSV_UPDATE_FEE_DOCS: 'https://docs.ssv.network/learn/operators/update-fee',
    TOOL_TIP_KEY_LINK: 'https://docs.ssv.network/operators/install-instructions',
    GASNOW_API_URL: 'https://www.gasnow.org/api/v3/gas/price?utm_source=ssv.network',
    ETHER_RESPONSIBILITIES: 'https://launchpad.ethereum.org/en/faq#responsibilities',
    REACTIVATION_LINK: 'https://docs.ssv.network/learn/stakers/clusters/reactivation',
    // TODO: blox-infra-api calls organization-center, if organization center will be archived, need to update this endpoint
    COMPLIANCE_URL: `${process.env.REACT_APP_BLOX_API}/compliance/countries/restricted`,
    UPDATE_OPERATORS_LINK: 'https://docs.ssv.network/learn/stakers/validators/update-operators',
    MORE_ABOUT_UPDATE_FEES: 'https://docs.ssv.network/learn/operators/update-fee#_nn1qsdauoghf',
    MORE_ON_FEES: 'https://docs.ssv.network/learn/protocol-overview/tokenomics/fees#_k4tw9to38r3v',
    MORE_ON_LIQUIDATION_LINK: 'https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations',
    MONITOR_YOUR_NODE_URL: 'https://docs.ssv.network/operator-user-guides/operator-node/configuring-mev',
    INCORRECT_OWNER_NONCE_LINK: 'https://docs.ssv.network/developers/tools/cluster-scanner#_x7nzjlwu00d0',
    DKG_TROUBLESHOOTING_LINK: 'https://docs.ssv.network/developers/tools/ssv-dkg-client/generate-key-shares#troubleshooting',
  },
  GLOBAL_VARIABLE: {
    GAS_FIXED_PRICE: {
      GAS_PRICE: process.env.REACT_APP_GAS_PRICE,
      GAS_LIMIT: process.env.REACT_APP_GAS_LIMIT,
    },
    CLUSTER_SIZES: {
      QUAD_CLUSTER: 4,
      SEPT_CLUSTER: 7,
      DECA_CLUSTER: 10,
      TRISKAIDEKA_CLUSTER: 13,
    },
    FIXED_VALIDATORS_COUNT_PER_CLUSTER_SIZE: {
      QUAD_CLUSTER: 80,
      SEPT_CLUSTER: 40,
      DECA_CLUSTER: 30,
      TRISKAIDEKA_CLUSTER: 20,
    },
    BLOCKS_PER_DAY: 7160,
    OPERATORS_PER_PAGE: 50,
    BLOCKS_PER_YEAR: 2613400,
    DEFAULT_CLUSTER_PERIOD: 730,
    NUMBERS_OF_WEEKS_IN_YEAR: 52.1429,
    MAX_VALIDATORS_COUNT_MULTI_FLOW: 50,
    CLUSTER_VALIDITY_PERIOD_MINIMUM: 30,
    OPERATOR_VALIDATORS_LIMIT_PRESERVE: 5,
    MINIMUM_OPERATOR_FEE_PER_BLOCK: 0.000000001,
    MIN_VALIDATORS_COUNT_PER_BULK_REGISTRATION: 1,
    DEFAULT_ADDRESS_WHITELIST: '0x0000000000000000000000000000000000000000',
  },
  ONBOARD: {
    API_KEY: process.env.REACT_APP_BLOCKNATIVE_KEY,
    NETWORK_ID: networkId,
    PROJECT_ID: 'c93804911b583e5cacf856eee58655e6',
  },
  CONTRACTS: {
    SSV_TOKEN: {
      ADDRESS: tokenAddress,
      ABI: ABI_VERSION.tokenContract,
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
      // ADDRESS: contract,
      ADDRESS: '',
      ABI: abi,
    },
  },
};

const HOLESKY_RPC_URL = 'https://late-thrilling-arm.ethereum-holesky.quiknode.pro/b64c32d5e1b1664b4ed2de4faef610d2cf08ed26';
const MAINNET_RPC_URL = 'https://misty-purple-sailboat.quiknode.pro/7fea68f21d77d9b54fc35c3f6d68199a880f5cf0';

const DEFAULT_PAGINATION = {
  page: 1,
  pages: 1,
  total: 0,
  per_page: 10,
};

export { HOLESKY_RPC_URL, MAINNET_RPC_URL, DEFAULT_PAGINATION };

export default config;
