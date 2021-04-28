const config = {
  routes: {
    START: '/start',
    OPERATOR: {
      HOME: '/',
      START: '/operator',
      GENERATE_KEYS: '/operator/generate',
    },
    VALIDATOR: {
      SHARE: '/validator/share',
    },
  },
  links: {
    LINK_SSV_DEV_DOCS: process.env.REACT_APP_LINK_SSV_DEV_DOCS,
  },
  ONBOARD: {
    API_KEY: process.env.REACT_APP_BLOCKNATIVE_KEY,
    NETWORK_ID: process.env.REACT_APP_BLOCKNATIVE_NETWORK_ID,
  },
  CONTRACT: {
    ADDRESS: '0x555fe4a050Bb5f392fD80dCAA2b6FCAf829f21e9',
    PAYMENT_ADDRESS: '0xe52350A8335192905359c4c3C2149976dCC3D8bF',
    ABI: [
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
            'name': 'pubkey',
            'type': 'bytes',
          },
          {
            'indexed': false,
            'internalType': 'address',
            'name': 'paymentAddress',
            'type': 'address',
          },
        ],
        'name': 'OperatorAdded',
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
            'internalType': 'string',
            'name': '_pubkey',
            'type': 'string',
          },
          {
            'internalType': 'address',
            'name': '_paymentAddress',
            'type': 'address',
          },
        ],
        'name': 'addOperator',
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
    ],
  },
};

export default config;
