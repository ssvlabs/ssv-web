export const globals = {
  MAX_WEI_AMOUNT:
    115792089237316195423570985008687907853269984665640564039457584007913129639935n,
  GAS_FIXED_PRICE: {
    GAS_PRICE: import.meta.env.VITE_GAS_PRICE,
    GAS_LIMIT: import.meta.env.VITE_GAS_LIMIT,
  },
  CLUSTER_SIZES: {
    QUAD_CLUSTER: 4,
    SEPT_CLUSTER: 7,
    DECA_CLUSTER: 10,
    TRISKAIDEKA_CLUSTER: 13,
  } as const,
  FIXED_VALIDATORS_COUNT_PER_CLUSTER_SIZE: {
    QUAD_CLUSTER: 80,
    SEPT_CLUSTER: 40,
    DECA_CLUSTER: 30,
    TRISKAIDEKA_CLUSTER: 20,
  },
  BLOCKS_PER_DAY: 7160n,
  OPERATORS_PER_PAGE: 50,
  BLOCKS_PER_YEAR: 2613400n,
  DEFAULT_CLUSTER_PERIOD: 730,
  NUMBERS_OF_WEEKS_IN_YEAR: 52.1429,
  MAX_VALIDATORS_COUNT_MULTI_FLOW: 50,
  CLUSTER_VALIDITY_PERIOD_MINIMUM: 30,
  OPERATOR_VALIDATORS_LIMIT_PRESERVE: 5,
  MINIMUM_OPERATOR_FEE_PER_BLOCK: 1000000000n,
  MIN_VALIDATORS_COUNT_PER_BULK_REGISTRATION: 1,
  DEFAULT_ADDRESS_WHITELIST: "0x0000000000000000000000000000000000000000",
};

export const links = {
  SSV_WEB_SITE: "https://ssv.network/",
  TWITTER_LINK: "https://twitter.com/ssv_network",
  GOVERNANCE_FORUM_LINK: "https://forum.ssv.network/",
  DISCORD_LINK: "https://discord.gg/ssvnetworkofficial",
  TERMS_OF_USE_LINK: "https://ssv.network/terms-of-use/",
  PRIVACY_POLICY_LINK: "https://ssv.network/privacy-policy/",
  LINK_SSV_DEV_DOCS: import.meta.env.VITE_LINK_SSV_DEV_DOCS,
  SNAPSHOT_LINK: "https://snapshot.org/#/mainnet.ssvnetwork.eth",
  SSV_DOCUMENTATION: "https://docs.ssv.network/learn/introduction",
  DKG_DOCKER_INSTALL_URL: "https://docs.docker.com/engine/install/",
  PERMISSIONED_OPERATORS:
    "https://docs.ssv.network/learn/operators/permissioned-operators",
  MORE_ON_CLUSTERS: "https://docs.ssv.network/learn/stakers/clusters",
  SSV_KEYS_RELEASES_URL: "https://github.com/ssvlabs/ssv-keys/releases",
  SSV_UPDATE_FEE_DOCS: "https://docs.ssv.network/learn/operators/update-fee",
  TOOL_TIP_KEY_LINK: "https://docs.ssv.network/operators/install-instructions",
  GASNOW_API_URL:
    "https://www.gasnow.org/api/v3/gas/price?utm_source=ssv.network",
  ETHER_RESPONSIBILITIES:
    "https://launchpad.ethereum.org/en/faq#responsibilities",
  REACTIVATION_LINK:
    "https://docs.ssv.network/learn/stakers/clusters/reactivation",
  UPDATE_OPERATORS_LINK:
    "https://docs.ssv.network/learn/stakers/validators/update-operators",
  MORE_ABOUT_UPDATE_FEES:
    "https://docs.ssv.network/learn/operators/update-fee#_nn1qsdauoghf",
  MORE_ON_FEES:
    "https://docs.ssv.network/learn/protocol-overview/tokenomics/fees#_k4tw9to38r3v",
  MORE_ON_LIQUIDATION_LINK:
    "https://docs.ssv.network/learn/protocol-overview/tokenomics/liquidations",
  MONITOR_YOUR_NODE_URL:
    "https://docs.ssv.network/operator-user-guides/operator-node/configuring-mev",
  INCORRECT_OWNER_NONCE_LINK:
    "https://docs.ssv.network/developers/tools/cluster-scanner#_x7nzjlwu00d0",
  DKG_TROUBLESHOOTING_LINK:
    "https://docs.ssv.network/developers/tools/ssv-dkg-client/generate-key-shares#troubleshooting",
};
