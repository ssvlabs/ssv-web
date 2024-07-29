export const MainnetV4SetterABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address'
      }
    ],
    name: 'AddressIsWhitelistingContract',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ApprovalNotWithinTimeframe',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CallerNotOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'CallerNotOwnerWithData',
    type: 'error'
  },
  {
    inputs: [],
    name: 'CallerNotWhitelisted',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'CallerNotWhitelistedWithData',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ClusterAlreadyEnabled',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ClusterDoesNotExists',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ClusterIsLiquidated',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ClusterNotLiquidatable',
    type: 'error'
  },
  {
    inputs: [],
    name: 'EmptyPublicKeysList',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'ExceedValidatorLimit',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'ExceedValidatorLimitWithData',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FeeExceedsIncreaseLimit',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FeeIncreaseNotAllowed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FeeTooHigh',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FeeTooLow',
    type: 'error'
  },
  {
    inputs: [],
    name: 'IncorrectClusterState',
    type: 'error'
  },
  {
    inputs: [],
    name: 'IncorrectValidatorState',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      }
    ],
    name: 'IncorrectValidatorStateWithData',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InsufficientBalance',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidContractAddress',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidOperatorIdsLength',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidPublicKeyLength',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidWhitelistAddressesLength',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address'
      }
    ],
    name: 'InvalidWhitelistingContract',
    type: 'error'
  },
  {
    inputs: [],
    name: 'MaxValueExceeded',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NewBlockPeriodIsBelowMinimum',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NoFeeDeclared',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotAuthorized',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OperatorAlreadyExists',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OperatorDoesNotExist',
    type: 'error'
  },
  {
    inputs: [],
    name: 'OperatorsListNotUnique',
    type: 'error'
  },
  {
    inputs: [],
    name: 'PublicKeysSharesLengthMismatch',
    type: 'error'
  },
  {
    inputs: [],
    name: 'SameFeeChangeNotAllowed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TargetModuleDoesNotExist',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'moduleId',
        type: 'uint8'
      }
    ],
    name: 'TargetModuleDoesNotExistWithData',
    type: 'error'
  },
  {
    inputs: [],
    name: 'TokenTransferFailed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'UnsortedOperatorsList',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ValidatorAlreadyExists',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      }
    ],
    name: 'ValidatorAlreadyExistsWithData',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ValidatorDoesNotExist',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ZeroAddressNotAllowed',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address'
      }
    ],
    name: 'AdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address'
      }
    ],
    name: 'BeaconUpgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'ClusterDeposited',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'ClusterLiquidated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'ClusterReactivated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'ClusterWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'value',
        type: 'uint64'
      }
    ],
    name: 'DeclareOperatorFeePeriodUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'value',
        type: 'uint64'
      }
    ],
    name: 'ExecuteOperatorFeePeriodUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipientAddress',
        type: 'address'
      }
    ],
    name: 'FeeRecipientAddressUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'value',
        type: 'uint64'
      }
    ],
    name: 'LiquidationThresholdPeriodUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'MinimumLiquidationCollateralUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'enum SSVModules',
        name: 'moduleId',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'moduleAddress',
        type: 'address'
      }
    ],
    name: 'ModuleUpgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      }
    ],
    name: 'NetworkEarningsWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldFee',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newFee',
        type: 'uint256'
      }
    ],
    name: 'NetworkFeeUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'OperatorAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'OperatorFeeDeclarationCancelled',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'OperatorFeeDeclared',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'OperatorFeeExecuted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'value',
        type: 'uint64'
      }
    ],
    name: 'OperatorFeeIncreaseLimitUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'maxFee',
        type: 'uint64'
      }
    ],
    name: 'OperatorMaximumFeeUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'whitelistAddresses',
        type: 'address[]'
      }
    ],
    name: 'OperatorMultipleWhitelistRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'whitelistAddresses',
        type: 'address[]'
      }
    ],
    name: 'OperatorMultipleWhitelistUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'toPrivate',
        type: 'bool'
      }
    ],
    name: 'OperatorPrivacyStatusUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'OperatorRemoved',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'whitelisted',
        type: 'address'
      }
    ],
    name: 'OperatorWhitelistUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'whitelistingContract',
        type: 'address'
      }
    ],
    name: 'OperatorWhitelistingContractUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256'
      }
    ],
    name: 'OperatorWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferStarted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'shares',
        type: 'bytes'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'ValidatorAdded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      }
    ],
    name: 'ValidatorExited',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        indexed: false,
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'ValidatorRemoved',
    type: 'event'
  },
  {
    stateMutability: 'nonpayable',
    type: 'fallback'
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'publicKeys',
        type: 'bytes[]'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      }
    ],
    name: 'bulkExitValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'publicKeys',
        type: 'bytes[]'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'bytes[]',
        name: 'sharesData',
        type: 'bytes[]'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'bulkRegisterValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'publicKeys',
        type: 'bytes[]'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'bulkRemoveValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'cancelDeclaredOperatorFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'declareOperatorFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'clusterOwner',
        type: 'address'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'executeOperatorFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      }
    ],
    name: 'exitValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getVersion',
    outputs: [
      {
        internalType: 'string',
        name: 'version',
        type: 'string'
      }
    ],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20',
        name: 'token_',
        type: 'address'
      },
      {
        internalType: 'contract ISSVOperators',
        name: 'ssvOperators_',
        type: 'address'
      },
      {
        internalType: 'contract ISSVClusters',
        name: 'ssvClusters_',
        type: 'address'
      },
      {
        internalType: 'contract ISSVDAO',
        name: 'ssvDAO_',
        type: 'address'
      },
      {
        internalType: 'contract ISSVViews',
        name: 'ssvViews_',
        type: 'address'
      },
      {
        internalType: 'uint64',
        name: 'minimumBlocksBeforeLiquidation_',
        type: 'uint64'
      },
      {
        internalType: 'uint256',
        name: 'minimumLiquidationCollateral_',
        type: 'uint256'
      },
      {
        internalType: 'uint32',
        name: 'validatorsPerOperatorLimit_',
        type: 'uint32'
      },
      {
        internalType: 'uint64',
        name: 'declareOperatorFeePeriod_',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'executeOperatorFeePeriod_',
        type: 'uint64'
      },
      {
        internalType: 'uint64',
        name: 'operatorMaxFeeIncrease_',
        type: 'uint64'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'clusterOwner',
        type: 'address'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'liquidate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'reactivate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'reduceOperatorFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'setPrivate',
        type: 'bool'
      }
    ],
    name: 'registerOperator',
    outputs: [
      {
        internalType: 'uint64',
        name: 'id',
        type: 'uint64'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'bytes',
        name: 'sharesData',
        type: 'bytes'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'registerValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'removeOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      }
    ],
    name: 'removeOperatorsWhitelistingContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'address[]',
        name: 'whitelistAddresses',
        type: 'address[]'
      }
    ],
    name: 'removeOperatorsWhitelists',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'publicKey',
        type: 'bytes'
      },
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'removeValidator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipientAddress',
        type: 'address'
      }
    ],
    name: 'setFeeRecipientAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      }
    ],
    name: 'setOperatorsPrivateUnchecked',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      }
    ],
    name: 'setOperatorsPublicUnchecked',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'contract ISSVWhitelistingContract',
        name: 'whitelistingContract',
        type: 'address'
      }
    ],
    name: 'setOperatorsWhitelistingContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'address[]',
        name: 'whitelistAddresses',
        type: 'address[]'
      }
    ],
    name: 'setOperatorsWhitelists',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'timeInSeconds',
        type: 'uint64'
      }
    ],
    name: 'updateDeclareOperatorFeePeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'timeInSeconds',
        type: 'uint64'
      }
    ],
    name: 'updateExecuteOperatorFeePeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'blocks',
        type: 'uint64'
      }
    ],
    name: 'updateLiquidationThresholdPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'maxFee',
        type: 'uint64'
      }
    ],
    name: 'updateMaximumOperatorFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'updateMinimumLiquidationCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'enum SSVModules',
        name: 'moduleId',
        type: 'uint8'
      },
      {
        internalType: 'address',
        name: 'moduleAddress',
        type: 'address'
      }
    ],
    name: 'updateModule',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256'
      }
    ],
    name: 'updateNetworkFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'percentage',
        type: 'uint64'
      }
    ],
    name: 'updateOperatorFeeIncreaseLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      }
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64[]',
        name: 'operatorIds',
        type: 'uint64[]'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'validatorCount',
            type: 'uint32'
          },
          {
            internalType: 'uint64',
            name: 'networkFeeIndex',
            type: 'uint64'
          },
          {
            internalType: 'uint64',
            name: 'index',
            type: 'uint64'
          },
          {
            internalType: 'bool',
            name: 'active',
            type: 'bool'
          },
          {
            internalType: 'uint256',
            name: 'balance',
            type: 'uint256'
          }
        ],
        internalType: 'struct ISSVNetworkCore.Cluster',
        name: 'cluster',
        type: 'tuple'
      }
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      }
    ],
    name: 'withdrawAllOperatorEarnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawNetworkEarnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'operatorId',
        type: 'uint64'
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawOperatorEarnings',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
