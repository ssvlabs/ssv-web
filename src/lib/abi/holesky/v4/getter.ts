export const HoleskyV4GetterABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "AddressIsWhitelistingContract",
    type: "error",
  },
  {
    inputs: [],
    name: "ApprovalNotWithinTimeframe",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerNotOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "CallerNotOwnerWithData",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerNotWhitelisted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "operatorId",
        type: "uint64",
      },
    ],
    name: "CallerNotWhitelistedWithData",
    type: "error",
  },
  {
    inputs: [],
    name: "ClusterAlreadyEnabled",
    type: "error",
  },
  {
    inputs: [],
    name: "ClusterDoesNotExists",
    type: "error",
  },
  {
    inputs: [],
    name: "ClusterIsLiquidated",
    type: "error",
  },
  {
    inputs: [],
    name: "ClusterNotLiquidatable",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyPublicKeysList",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "operatorId",
        type: "uint64",
      },
    ],
    name: "ExceedValidatorLimit",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "operatorId",
        type: "uint64",
      },
    ],
    name: "ExceedValidatorLimitWithData",
    type: "error",
  },
  {
    inputs: [],
    name: "FeeExceedsIncreaseLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "FeeIncreaseNotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "FeeTooHigh",
    type: "error",
  },
  {
    inputs: [],
    name: "FeeTooLow",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectClusterState",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectValidatorState",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "publicKey",
        type: "bytes",
      },
    ],
    name: "IncorrectValidatorStateWithData",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidContractAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidOperatorIdsLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidPublicKeyLength",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidWhitelistAddressesLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "InvalidWhitelistingContract",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxValueExceeded",
    type: "error",
  },
  {
    inputs: [],
    name: "NewBlockPeriodIsBelowMinimum",
    type: "error",
  },
  {
    inputs: [],
    name: "NoFeeDeclared",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAuthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "OperatorAlreadyExists",
    type: "error",
  },
  {
    inputs: [],
    name: "OperatorDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "OperatorsListNotUnique",
    type: "error",
  },
  {
    inputs: [],
    name: "PublicKeysSharesLengthMismatch",
    type: "error",
  },
  {
    inputs: [],
    name: "SameFeeChangeNotAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "TargetModuleDoesNotExist",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "moduleId",
        type: "uint8",
      },
    ],
    name: "TargetModuleDoesNotExistWithData",
    type: "error",
  },
  {
    inputs: [],
    name: "TokenTransferFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsortedOperatorsList",
    type: "error",
  },
  {
    inputs: [],
    name: "ValidatorAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "publicKey",
        type: "bytes",
      },
    ],
    name: "ValidatorAlreadyExistsWithData",
    type: "error",
  },
  {
    inputs: [],
    name: "ValidatorDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "ZeroAddressNotAllowed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "clusterOwner",
        type: "address",
      },
      {
        internalType: "uint64[]",
        name: "operatorIds",
        type: "uint64[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "validatorCount",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "networkFeeIndex",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "index",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
        ],
        internalType: "struct ISSVNetworkCore.Cluster",
        name: "cluster",
        type: "tuple",
      },
    ],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "clusterOwner",
        type: "address",
      },
      {
        internalType: "uint64[]",
        name: "operatorIds",
        type: "uint64[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "validatorCount",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "networkFeeIndex",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "index",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
        ],
        internalType: "struct ISSVNetworkCore.Cluster",
        name: "cluster",
        type: "tuple",
      },
    ],
    name: "getBurnRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLiquidationThresholdPeriod",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMaximumOperatorFee",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinimumLiquidationCollateral",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNetworkEarnings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNetworkFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNetworkValidatorsCount",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "operatorId",
        type: "uint64",
      },
    ],
    name: "getOperatorById",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "operatorId",
        type: "uint64",
      },
    ],
    name: "getOperatorDeclaredFee",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "id",
        type: "uint64",
      },
    ],
    name: "getOperatorEarnings",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "operatorId",
        type: "uint64",
      },
    ],
    name: "getOperatorFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOperatorFeeIncreaseLimit",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOperatorFeePeriods",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "clusterOwner",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "publicKey",
        type: "bytes",
      },
    ],
    name: "getValidator",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getValidatorsPerOperatorLimit",
    outputs: [
      {
        internalType: "uint32",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVersion",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64[]",
        name: "operatorIds",
        type: "uint64[]",
      },
      {
        internalType: "address",
        name: "whitelistedAddress",
        type: "address",
      },
    ],
    name: "getWhitelistedOperators",
    outputs: [
      {
        internalType: "uint64[]",
        name: "whitelistedOperatorIds",
        type: "uint64[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ISSVViews",
        name: "ssvNetwork_",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "addressToCheck",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "operatorId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "whitelistingContract",
        type: "address",
      },
    ],
    name: "isAddressWhitelistedInWhitelistingContract",
    outputs: [
      {
        internalType: "bool",
        name: "isWhitelisted",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "clusterOwner",
        type: "address",
      },
      {
        internalType: "uint64[]",
        name: "operatorIds",
        type: "uint64[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "validatorCount",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "networkFeeIndex",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "index",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
        ],
        internalType: "struct ISSVNetworkCore.Cluster",
        name: "cluster",
        type: "tuple",
      },
    ],
    name: "isLiquidatable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "clusterOwner",
        type: "address",
      },
      {
        internalType: "uint64[]",
        name: "operatorIds",
        type: "uint64[]",
      },
      {
        components: [
          {
            internalType: "uint32",
            name: "validatorCount",
            type: "uint32",
          },
          {
            internalType: "uint64",
            name: "networkFeeIndex",
            type: "uint64",
          },
          {
            internalType: "uint64",
            name: "index",
            type: "uint64",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "balance",
            type: "uint256",
          },
        ],
        internalType: "struct ISSVNetworkCore.Cluster",
        name: "cluster",
        type: "tuple",
      },
    ],
    name: "isLiquidated",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "isWhitelistingContract",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ssvNetwork",
    outputs: [
      {
        internalType: "contract ISSVViews",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;
