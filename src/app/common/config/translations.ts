const translations = {
  VALIDATOR: {
    HOME: {
      TITLE: 'Run Validator with the SSV Network',
      DESCRIPTION: 'Any validator can run on the SSV network: create a new validator or import your existing one to begin.',
    },
    CREATE: {
      NAVIGATION_TEXT: 'Create Validator',
      TITLE: 'Generate Validator Key',
      DESCRIPTION: '',
      BODY_TEXT: [
          'Ethereum launchpad has developed a CLI app that you can download and use to generate your keys locally.',
          'After you create your own keys, new files will be generated in your computer which are required for our setup:',
          ' (1)   ‘Keystore’ (aka “validator key”) file',
           '(2)   ‘Deposit data’ file',
          'Follow the launchpad instructs and get your files and return to this setup.',
          'Please note - any other action other than the key generation is not required.',
      ],
    },
    IMPORT: {
      TITLE: 'Enter Validator Key',
      DESCRIPTION: 'Your validator key is secured - it’s not stored anywhere and never sent to our servers.',
      FILE_ERRORS: {
        INVALID_FILE: 'Invalid file type.',
        INVALID_PASSWORD: 'Invalid keystore file password.',
      },
    },
    CONFIRMATION: {
      TITLE: 'Confirm Transaction',
      DESCRIPTION: '',
      RUN_VALIDATOR: 'Run validator',
      WAITING_FOR_CONFIRMATION: 'Waiting for confirmation...',
      WAITING_FOR_TRANSACTION: 'WAITING_FOR_TRANSACTION',
    },
    SLASHING_WARNING: {
      TITLE: 'Slashing Warning',
      DESCRIPTION: 'Your validator is currently active on beacon chain:',
    },
    SELECT_OPERATORS: {
      TITLE: 'Select Operators',
      DESCRIPTION: 'Pick the team of network operators to run your validator.',
    },
    SUCCESS: {
      TITLE: 'Welcome to the SSV Network!',
      DESCRIPTION: 'With every new operator, our network grows stronger.',
    },
  },
  HOME: {
    TITLE: 'Join SSV Network',
    DESCRIPTION: 'Run your validator on the decentralized infrastructure      of Ethereum staking or help maintain it as one of it`s operators.',
    MENUS: {
      NEW_OPERATOR: {
        TITLE: 'Create new Operator',
      },
      SHARE_VALIDATOR_KEY: {
        TITLE: 'Share Validator Key',
      },
    },
  },
  SUCCESS: {
    TITLE: 'Welcome to the SSV Network!',
    OPERATOR_DESCRIPTION: 'With every new operator, our network grows stronger',
    VALIDATOR_DESCRIPTION: 'Your validator is now running on the robust and secure infrastructure of our network',
  },
  OPERATOR: {
    OPERATOR_EXIST: 'Operator key has already been registered.',
    REGISTER: {
      TOOL_TIP_KEY: 'Generated as part of the SSV node setup - see our ',
      TOOL_TIP_ADDRESS: 'Operators identifier in the SSV network, it also serves as its owner for management purposes. Make sure you enter an address you have ownership over.',
      TITLE: 'Register Operator',
      DESCRIPTION: 'Register to the networks registry to enable others to discover and select you as one of their validator’s operators.',
    },
    CONFIRMATION: {
      TITLE: 'Confirmation Transaction',
      DESCRIPTION: '',
      REGISTER_OPERATOR: 'Register Operator',
      WAITING_FOR_CONFIRMATION: 'Waiting for confirmation...',
      WAITING_FOR_TRANSACTION: 'WAITING_FOR_TRANSACTION',
    },

    HOME: {
      TITLE: 'Join the SSV Network Operators',
      DESCRIPTION: 'To join the network of operators you must run an SSV node.\nSetup your node, generate operator keys and register to the network.',
      MENUS: {

      },
    },
  },
  CTA_BUTTON: {
    CONNECT: 'Connect Wallet',
  },
};

export default translations;