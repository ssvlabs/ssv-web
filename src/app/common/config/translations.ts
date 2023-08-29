const translations = {
  VALIDATOR: {
    HOME: {
      TITLE: 'Run a Distributed Validator',
      DESCRIPTION: 'Any validator can run on the SSV network: create a new validator or import your existing one to begin.',
    },
    CREATE: {
      TITLE: 'Create Validator via Ethereum Launchpad',
      DESCRIPTION: '',
      BODY_TEXT: [
          'Follow Ethereum’s launchpad instructions to generate new keys and deposit your validator to the deposit contract.',
          'Please note to backup your newly created validator files, you will need them for our setup.',
      ],
    },
    DEPOSIT: {
      TITLE: 'Deposit Validator via Ethereum Launchpad',
      SUB_TITLE: 'You must deposit your validator before running it on the SSV network.',
      DESCRIPTION: '',
      BODY_TEXT: [
        'Follow Ethereum\'s launchpad instructions to deposit your validator to the deposit contract.',
        'There is no need to wait until your validator is active on the beacon chain, you can return to register your validator to our network while it\'s pending on the staking queue, once it gets activated, your selected operators will operate it immediately.',
      ],
    },
    WITHDRAW: {
      BUTTON: {
        WITHDRAW: 'Withdraw',
        WITHDRAW_ALL: 'Withdraw All',
        LIQUIDATE_MY_CLUSTER: 'Liquidate my cluster',
      },
      CHECKBOX: {
        LIQUIDATION_RISK:  'I understand the risks of having my cluster liquidated.',
        LIQUIDATE_MY_CLUSTER: 'I understand that withdrawing this amount will liquidate my cluster.',
      },
    },
    BALANCE_AND_FEE: {
      TITLE: 'Cluster Balances and Fees',
      SUB_TITLE: '',
      DESCRIPTION: '',
      BODY_TEXT: [
        'Fees are presented as annual payments but are paid to operators continuously as an on-going process. They are set by each operator and could change according to their decision.',
        // 'When you register a new validator to the network you are required to deposit sufficient balance for a year, but it\'s under your sole responsibility to make sure your account always holds enough balance for it\'s operation.',
      ],
    },
    IMPORT: {
      TITLE: 'Enter Validator Key',
      KEY_SHARES_TITLE: 'Enter KeyShares File',
      DESCRIPTION: 'Your validator key is secured - it’s not stored anywhere and never sent to our servers.',
      FILE_ERRORS: {
        INVALID_FILE: 'Invalid file type.',
        INVALID_PASSWORD: 'Invalid keystore file password.',
      },
    },
    KEYSHARE_RESPONSE: {
      OK_RESPONSE:{
        name: '',
        errorMessage: '',
      },
      OPERATOR_NOT_EXIST_RESPONSE: {
        name: 'operator_not_exist',
        errorMessage: 'Operators data incorrect, check operator data and re-generate keyshares.json.',
      },
      OPERATOR_NOT_MATCHING_RESPONSE : {
        name: 'operators_not_matching',
        errorMessage: 'Operator ID and Key mismatch,',
        subErrorMessage:  'check operator data and re-generate keyshares.json',
      },
      VALIDATOR_EXIST_RESPONSE: {
        name: 'validator_exit',
        errorMessage: 'Validator is already registered to the network, ',
        subErrorMessage:  'please try a different keystore file.',
      },
      CHECKSUM_ERROR_RESPONSE: {
        name: 'ERROR',
        errorMessage: 'Invalid Ethereum address. Please check that you have entered the address correctly and try again.',
      },
      VALIDATOR_PUBLIC_KEY_ERROR: {
        name: 'ERROR',
        errorMessage: 'Validator key invalid, please go through key splitting and generate the keyshares files again.',
      },
      CATCH_ERROR_RESPONSE: {
        name: 'ERROR', errorMessage: 'file data incorrect, check operator data and re-generate keyshares.json',
      },
    },
    CONFIRMATION: {
      TITLE: 'Transaction Details',
      DESCRIPTION: '',
    },
    SLASHING_WARNING: {
      TITLE: 'Slashing Warning',
      DESCRIPTION: 'Your validator is currently active on beacon chain:',
    },
    ACCOUNT_BALANCE: {
      TITLE: 'account balance',
      DESCRIPTION: 'Your validator is currently active on beacon chain:',
    },
    SELECT_OPERATORS: {
      TITLE: 'Pick the cluster of network operators to run you validator',
      DESCRIPTION: 'Pick the cluster of network operators to run your validator.',
    },
    SUCCESS: {
      TITLE: 'Welcome to the SSV Network!',
      DESCRIPTION: 'With every new operator, our network grows stronger.',
    },
  },
  HOME: {
    TITLE: 'Join the SSV Network',
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
    OPERATOR_DESCRIPTION: 'Your operator has been successfully registered! With every new operator, our network grows stronger',
    VALIDATOR_DESCRIPTION: 'Your validator is now running on the robust and secure infrastructure of our network',
    FEEDBACK_HEADER: 'Lets hear your feedback!',
  },
  OPERATOR: {
    OPERATOR_EXIST: 'Operator key has already been registered.',
    REGISTER: {
      TOOL_TIP_KEY: 'Generated as part of the SSV node setup - see our ',
      TOOL_TIP_ADDRESS: 'The operator’s admin address for management purposes.',
      TITLE: 'Register Operator',
      DESCRIPTION: 'Register to the networks registry to enable others to discover and select you as one of their validator’s operators.',
    },
    CONFIRMATION: {
      TITLE: 'Transaction Details',
      DESCRIPTION: '',
    },

    HOME: {
      TITLE: 'Join the SSV Network Operators',
      DESCRIPTION: 'To join the network of operators you must run an SSV node. Setup your node, generate operator keys and register to the network.',
      MENUS: {

      },
    },
  },
  OPERATOR_METADATA: {
    IMAGE_SIZE_ERROR: 'File must be up to 200KB',
    IMAGE_TYPE_ERROR: 'File must be .jpg .jpeg .png',
    IMAGE_RESOLUTION_ERROR: 'Image dimensions must be at least 400x400px.',
    REQUIRED_FIELD_ERROR: 'Required field',
    LINK_ERROR: 'Enter a valid link i.e - https://ssv.network/',
    SPECIAL_CHARACTERS_ERROR: 'Field accepts numbers, English characters and the following characters: _!$#\'-|',
    CONFIRMATION_CHANGE: {
      TITLE: 'Operator details has been updated',
      SUBTITLE: 'See your updated details on your operator page in the network Explorer',
      EXPLORER_BUTTON: 'View in Explorer',
      RETURN_TO_MY_ACCOUNT: 'Return to My Account',
    },
  },
  CTA_BUTTON: {
    CONNECT: 'Connect to a wallet',
  },
  NA_DISPLAY:{
    TOOLTIP_TEXT: 'Balance and runway are pending calculation, please check again in a few minutes',
  },
};

export default translations;
