const translations = {
  VALIDATOR: {
    HOME: {
      TITLE: 'Run a Distributed Validator',
      SUB_TITLE: 'Distribute your validation duties among a set of distributed nodes to improve your validator resilience, safety, liveliness, and diversity.',
      DESCRIPTION: 'Any validator can run on the SSV network: create a new validator or import your existing one to begin.',
      PREREQUISITES: ['An active Ethereum validator (deposited to Beacon Chain)', 'SSV tokens to cover operational fees'],
      BUTTON: {
        NEW_KEYS: 'Generate new key shares',
        EXISTING_KEYS: 'I already have key shares'
      },
      TOOLTIP: {
        TEXT: "Don't have a validator? ",
        LINK_TEXT: 'Create via Ethereum Launchpad'
      }
    },
    FUNDING_NEW_VALIDATOR: {
      HEADER_TEXT: 'Select your validator funding period'
    },
    CREATE: {
      TITLE: 'Create Validator via Ethereum Launchpad',
      DESCRIPTION: '',
      BODY_TEXT: [
        'Follow Ethereum’s launchpad instructions to generate new keys and deposit your validator to the deposit contract.',
        'Please note to backup your newly created validator files, you will need them for our setup.'
      ]
    },
    DEPOSIT: {
      TITLE: 'Deposit Validator via Ethereum Launchpad',
      SUB_TITLE: 'You must deposit your validator before running it on the SSV network.',
      DESCRIPTION: '',
      BODY_TEXT: [
        "Follow Ethereum's launchpad instructions to deposit your validator to the deposit contract.",
        "There is no need to wait until your validator is active on the beacon chain, you can return to register your validator to our network while it's pending on the staking queue, once it gets activated, your selected operators will operate it immediately."
      ]
    },
    REMOVE_EXIT_VALIDATOR: {
      BULK_TITLES: {
        SELECT_REMOVE_VALIDATORS: 'Select Validators to Remove',
        SELECT_EXIT_VALIDATORS: 'Select Validators to Exit'
      },
      FLOW_CONFIRMATION_DATA: {
        REMOVE: {
          title: 'Remove Validator',
          texts: [
            'Removing your validator will cause your operators to stop managing it in your behalf, which will result in its inactivation (penalties on the Beacon Chain).',
            'Please note that this action only applies to its removal from our network and does not exit your validator from the Beacon Chain.'
          ],
          warningMessage: 'To avoid slashing, it is advised to wait at least 2 epochs prior to running the validator on an alternative service.',
          checkBoxes: ['I understand that my validator will be removed from the network and it will stop attesting on the beacon chain'],
          buttonText: (count: number, isLoading: boolean) => `${isLoading ? 'Removing' : 'Remove'} ${count > 1 ? `${count} validators` : 'validator'}`
        },
        EXIT: {
          title: 'Exit Validator ',
          texts: [
            "Exiting your validator signals to the network that you wish to permanently cease your validator's participation in the Beacon Chain and retrieve your 32 ETH stake principal.",
            "Initiating an exit places your validator in the exit queue. The duration in the queue depends on the number of validators already waiting. During this period, your validator must remain active, so it is crucial to maintain your validator's performance and keep it registered with the SSV network until it has fully exited."
          ],
          warningMessage: 'Exiting your validator from the Beacon Chain is permanent and cannot be reversed, preventing any future reactivation.',
          checkBoxes: [
            'I confirm that I have access to the withdrawal credentials of this validator.',
            "I understand that my validator must remain active to perform its duties while in the exit queue, and it's up to me to remove it from the SSV network once completed to stop incurring fees.",
            'I understand that a full exit is an irreversible decision. Once completed, the validator permanently leaves the Beacon Chain, and this action cannot be undone.'
          ],
          buttonText: (count: number, isLoading: boolean) => `${isLoading ? 'Exiting' : 'Exit'} ${count > 1 ? `${count} validators` : 'validator'}`
        }
      }
    },
    WITHDRAW: {
      BUTTON: {
        WITHDRAW: 'Withdraw',
        WITHDRAW_ALL: 'Withdraw All',
        LIQUIDATE_MY_CLUSTER: 'Liquidate my cluster'
      },
      CHECKBOX: {
        LIQUIDATION_RISK: 'I understand the risks of having my cluster liquidated.',
        LIQUIDATE_MY_CLUSTER: 'I understand that withdrawing this amount will liquidate my cluster.'
      }
    },
    BALANCE_AND_FEE: {
      TITLE: 'Cluster Balances and Fees',
      SUB_TITLE: '',
      DESCRIPTION: '',
      BODY_TEXT: [
        'Fees are presented as annual payments but are paid to operators continuously as an on-going process. They are set by each operator and could change according to their decision.'
        // 'When you register a new validator to the network you are required to deposit sufficient balance for a year, but it\'s under your sole responsibility to make sure your account always holds enough balance for it\'s operation.',
      ]
    },
    BULK_REGISTRATION: {
      SELECTED_VALIDATORS: 'Selected Validators',
      INCORRECT_OWNER_NONCE_ERROR_MESSAGE: 'Incorrect owner-nonce',
      SELECTED_VALIDATORS_TOOLTIP: (count: number) => `Bulk registration is capped at ${count} validators per batch.`,
      OPERATOR_REACHED_MAX_VALIDATORS: 'One of your chosen operators has reached its maximum validator capacity. Please select an alternative operator.',
      WHITELIST_OPERATOR: 'One of your chosen operators is a permissioned operator. Please select an alternative operator.',
      OPERATOR_CLOSE_REACH_MAX_VALIDATORS: (count: number) =>
        `The number of validators you wish to onboard would exceed the maximum validator capacity for one of your selected operators. You may proceed with onboarding only ${count} validators.`
    },
    IMPORT: {
      TITLE: 'Enter Validator Key',
      KEY_SHARES_TITLE: 'Enter KeyShares File',
      DESCRIPTION: 'Your validator key is secured - it’s not stored anywhere and never sent to our servers.',
      FILE_ERRORS: {
        INVALID_FILE: 'Invalid file type.',
        INVALID_PASSWORD: 'Invalid keystore file password.'
      }
    },
    DISTRIBUTE_OFFLINE: {
      TITLE: 'How do you want to generate your keyshares?',
      DKG: {
        DOCKER_INSTALLED: 'Docker installed',
        VALIDATOR_COUNT_ERROR: 'Invalid validators count. Only number between 1-100 allowed',
        OPERATOR_DOESNT_SUPPORT_DKG_ERROR_TEXT: 'DKG method is unavailable because some of your selected operators have not provided a DKG endpoint.',
        DKG_WITHDRAWAL_ADDRESS: 'Ethereum address to receive staking rewards and principle staked ETH. Please note that this cannot be changed in the future.'
      }
    },
    OFFLINE_KEY_SHARE_GENERATION: {
      linkText: 'SSV-Keys Github',
      HEADER: 'How do you want to generate your keyshares?',
      COMMAND_LINE_INSTRUCTIONS: {
        secondStep: '2. Launch your terminal',
        thirdStep: '3. Navigate to the directory you downloaded the CLI tool',
        fourthStep: '4. Run the tool with the following command:'
      },
      DESKTOP_APP: {
        secondStep: '2.Run the Starkeys app',
        thirdStep: '3. When prompted, copy and paste the following command:'
      },
      BUTTON: {
        NEXT: 'Next',
        CHANGE_OPERATORS: 'Change Operators'
      }
    },
    KEYSHARE_RESPONSE: {
      OK_RESPONSE: {
        name: '',
        errorMessage: ''
      },
      OPERATOR_NOT_EXIST_RESPONSE: {
        name: 'operator_not_exist',
        errorMessage: 'Operators data incorrect, check operator data and re-generate keyshares.json.'
      },
      OPERATOR_NOT_MATCHING_RESPONSE: {
        name: 'operators_not_matching',
        errorMessage: 'Operator ID and Key mismatch,',
        subErrorMessage: 'check operator data and re-generate keyshares.json'
      },
      VALIDATOR_EXIST_RESPONSE: {
        name: 'validator_exit',
        errorMessage: 'Validator is already registered to the network, ',
        subErrorMessage: 'please try a different keystore file.'
      },
      CHECKSUM_ERROR_RESPONSE: {
        name: 'ERROR',
        errorMessage: 'Invalid Ethereum address. Please check that you have entered the address correctly and try again.'
      },
      VALIDATOR_PUBLIC_KEY_ERROR: {
        name: 'ERROR',
        errorMessage: 'Validator key invalid, please go through key splitting and generate the keyshares files again.'
      },
      CATCH_ERROR_RESPONSE: {
        name: 'ERROR',
        errorMessage: 'file data incorrect, check operator data and re-generate keyshares.json'
      },
      INCORRECT_OWNER_ADDRESS_ERROR: {
        name: 'ERROR',
        errorMessage: 'Wrong wallet connected',
        subErrorMessage: 'please connect to wallet'
      },
      INVALID_OPERATOR_DETAILS: { message: 'Invalid operator details', subErrorMessage: 'Please contact support' },
      INCONSISTENT_OPERATOR_CLUSTER: {
        name: 'ERROR',
        errorMessage: 'The file contains key shares associated with different clusters. Please ensure that all key shares are consistent with the same operator cluster.'
      },
      DUPLICATED_KEY_SHARES: {
        name: 'ERROR',
        errorMessage: 'The file contains duplicated validator public keys. Please ensure that all public keys are unique.'
      }
    },
    CONFIRMATION: {
      TITLE: 'Transaction Details',
      DESCRIPTION: ''
    },
    SLASHING_WARNING: {
      TITLE: 'Slashing Warning',
      DESCRIPTION: 'Your validator is currently active on beacon chain:'
    },
    ACCOUNT_BALANCE: {
      TITLE: 'account balance',
      DESCRIPTION: 'Your validator is currently active on beacon chain:'
    },
    SELECT_OPERATORS: {
      TITLE: 'Pick the cluster of network operators to run your validator',
      DESCRIPTION: 'Pick the cluster of network operators to run your validator.'
    },
    SUCCESS: {
      TITLE: 'Welcome to the SSV Network!',
      DESCRIPTION: 'With every new operator, our network grows stronger.'
    },
    GENERATE_KEY_SHARES: {
      ONLINE: 'Online',
      OFFLINE: 'Offline',
      GENERATE_KEY_SHARES: 'Generate Validator KeyShares',
      SELECT_METHOD: 'Select your preferred method to split your key:',
      ALREADY_HAVE_KEY_SHARES: 'I already have key shares',
      SPLIT_VIA_WEB_APP: 'Split key via the webapp',
      SPLIT_ON_COMPUTER: 'Split key on your computer'
    }
  },
  HOME: {
    TITLE: 'Join the SSV Network',
    MENUS: {
      NEW_OPERATOR: {
        TITLE: 'Create new Operator'
      },
      SHARE_VALIDATOR_KEY: {
        TITLE: 'Share Validator Key'
      }
    }
  },
  SUCCESS: {
    TITLE: 'Welcome to the SSV Network!',
    OPERATOR_DESCRIPTION: 'Your operator has been successfully registered! With every new operator, our network grows stronger',
    VALIDATOR_DESCRIPTION: 'Your validator is now running on the robust and secure infrastructure of our network',
    FEEDBACK_HEADER: 'Lets hear your feedback!'
  },
  OPERATOR: {
    OPERATOR_EXIST: 'Operator key has already been registered.',
    REGISTER: {
      TOOL_TIP_KEY: 'Generated as part of the SSV node setup - see our ',
      TOOL_TIP_ADDRESS: 'The operator’s admin address for management purposes.',
      TITLE: 'Register Operator',
      DESCRIPTION: 'Register to the networks registry to enable others to discover and select you as one of their validator’s operators.'
    },
    CONFIRMATION: {
      TITLE: 'Transaction Details',
      DESCRIPTION: ''
    },

    HOME: {
      TITLE: 'Join the SSV Network Operators',
      DESCRIPTION: 'To join the network of operators you must run an SSV node. Setup your node, generate operator keys and register to the network.',
      MENUS: {}
    }
  },
  OPERATOR_METADATA: {
    IMAGE_SIZE_ERROR: 'File must be up to 200KB',
    IMAGE_TYPE_ERROR: 'File must be .jpg .jpeg .png',
    IMAGE_RESOLUTION_ERROR: 'Image dimensions must be at least 400x400px.',
    REQUIRED_FIELD_ERROR: 'Required field',
    LINK_ERROR: 'Enter a valid link i.e - https://ssv.network/',
    SPECIAL_CHARACTERS_ERROR: "Field accepts numbers, English characters and the following characters: _!$#'-|",
    DKG_ADDRESS_ERROR: 'Enter a valid IP address and port number',
    CONFIRMATION_CHANGE: {
      TITLE: 'Operator details has been updated',
      SUBTITLE: 'See your updated details on your operator page in the network Explorer',
      EXPLORER_BUTTON: 'View in Explorer',
      RETURN_TO_MY_ACCOUNT: 'Return to My Account'
    }
  },
  OPERATOR_WHITELIST_ADDRESS: {
    TITLE: 'Permission Settings',
    INPUT_LABEL: 'Authorized Address',
    INPUT_LABEL_TOOLTIP: 'Any Ethereum address, contract or wallet. Can be changed in the future',
    SECOND_TITLE: 'Permissioned Operator',
    TEXT: 'Enabling the permissioned operator setting will only allow the authorized owner address to register validators to your operator.'
  },
  CTA_BUTTON: {
    CONNECT: 'Connect to a wallet'
  },
  NA_DISPLAY: {
    TOOLTIP_TEXT: 'Balance and runway are pending calculation, please check again in a few minutes'
  },
  FAUCET: {
    FAUCET_DEPLETED: 'Depleted',
    REACHED_MAX_TRANSACTIONS: 'Reached max transactions per day'
  },
  DEFAULT: {
    DEFAULT_ERROR_MESSAGE: 'Failed to receive response from your wallet provider. Please try again.'
  }
};

export default translations;
