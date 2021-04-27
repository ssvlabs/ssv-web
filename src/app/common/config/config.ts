const config = {
  routes: {
    HOME: '/',
    OPERATOR: {
      KEYS: {
        GENERATE: '/operator/keys/generate',
      },
    },
    NETWORK: {
      REGISTER: '/network/register',
    },
  },
  links: {
    LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
  },
  ONBOARD: {
    API_KEY: process.env.REACT_APP_BLOCKNATIVE_KEY,
    NETWORK_ID: process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID,
  },
};

export default config;
