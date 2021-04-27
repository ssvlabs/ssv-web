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
};

export default config;
