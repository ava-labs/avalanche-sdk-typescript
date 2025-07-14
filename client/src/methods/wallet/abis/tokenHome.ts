export const tokenHomeABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "teleporterRegistryAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "teleporterManager",
        type: "address",
        internalType: "address",
      },
      {
        name: "minTeleporterVersion",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenDecimals",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ERC20_TOKEN_HOME_STORAGE_LOCATION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "TELEPORTER_REGISTRY_APP_STORAGE_LOCATION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "TOKEN_HOME_STORAGE_LOCATION",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addCollateral",
    inputs: [
      {
        name: "remoteBlockchainID",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "remoteTokenTransferrerAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getBlockchainID",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bytes32",
        internalType: "bytes32",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMinTeleporterVersion",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRemoteTokenTransferrerSettings",
    inputs: [
      {
        name: "remoteBlockchainID",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "remoteTokenTransferrerAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct RemoteTokenTransferrerSettings",
        components: [
          {
            name: "registered",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "collateralNeeded",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "tokenMultiplier",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "multiplyOnRemote",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTokenAddress",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransferredBalance",
    inputs: [
      {
        name: "remoteBlockchainID",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "remoteTokenTransferrerAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      {
        name: "teleporterRegistryAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "teleporterManager",
        type: "address",
        internalType: "address",
      },
      {
        name: "minTeleporterVersion",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenDecimals",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isTeleporterAddressPaused",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pauseTeleporterAddress",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "receiveTeleporterMessage",
    inputs: [
      {
        name: "sourceBlockchainID",
        type: "bytes32",
        internalType: "bytes32",
      },
      {
        name: "originSenderAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "message",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "send",
    inputs: [
      {
        name: "input",
        type: "tuple",
        internalType: "struct SendTokensInput",
        components: [
          {
            name: "destinationBlockchainID",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "destinationTokenTransferrerAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFeeTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "secondaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requiredGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "multiHopFallback",
            type: "address",
            internalType: "address",
          },
        ],
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "sendAndCall",
    inputs: [
      {
        name: "input",
        type: "tuple",
        internalType: "struct SendAndCallInput",
        components: [
          {
            name: "destinationBlockchainID",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "destinationTokenTransferrerAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipientContract",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipientPayload",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "requiredGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "recipientGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "multiHopFallback",
            type: "address",
            internalType: "address",
          },
          {
            name: "fallbackRecipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFeeTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "secondaryFee",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpauseTeleporterAddress",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateMinTeleporterVersion",
    inputs: [
      {
        name: "version",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CallFailed",
    inputs: [
      {
        name: "recipientContract",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CallSucceeded",
    inputs: [
      {
        name: "recipientContract",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CollateralAdded",
    inputs: [
      {
        name: "remoteBlockchainID",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "remoteTokenTransferrerAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "remaining",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint64",
        indexed: false,
        internalType: "uint64",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MinTeleporterVersionUpdated",
    inputs: [
      {
        name: "oldMinTeleporterVersion",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "newMinTeleporterVersion",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RemoteRegistered",
    inputs: [
      {
        name: "remoteBlockchainID",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "remoteTokenTransferrerAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "initialCollateralNeeded",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "tokenDecimals",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TeleporterAddressPaused",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TeleporterAddressUnpaused",
    inputs: [
      {
        name: "teleporterAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensAndCallRouted",
    inputs: [
      {
        name: "teleporterMessageID",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "input",
        type: "tuple",
        indexed: false,
        internalType: "struct SendAndCallInput",
        components: [
          {
            name: "destinationBlockchainID",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "destinationTokenTransferrerAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipientContract",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipientPayload",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "requiredGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "recipientGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "multiHopFallback",
            type: "address",
            internalType: "address",
          },
          {
            name: "fallbackRecipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFeeTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "secondaryFee",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensAndCallSent",
    inputs: [
      {
        name: "teleporterMessageID",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "input",
        type: "tuple",
        indexed: false,
        internalType: "struct SendAndCallInput",
        components: [
          {
            name: "destinationBlockchainID",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "destinationTokenTransferrerAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipientContract",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipientPayload",
            type: "bytes",
            internalType: "bytes",
          },
          {
            name: "requiredGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "recipientGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "multiHopFallback",
            type: "address",
            internalType: "address",
          },
          {
            name: "fallbackRecipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFeeTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "secondaryFee",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensRouted",
    inputs: [
      {
        name: "teleporterMessageID",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "input",
        type: "tuple",
        indexed: false,
        internalType: "struct SendTokensInput",
        components: [
          {
            name: "destinationBlockchainID",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "destinationTokenTransferrerAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFeeTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "secondaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requiredGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "multiHopFallback",
            type: "address",
            internalType: "address",
          },
        ],
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensSent",
    inputs: [
      {
        name: "teleporterMessageID",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "input",
        type: "tuple",
        indexed: false,
        internalType: "struct SendTokensInput",
        components: [
          {
            name: "destinationBlockchainID",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "destinationTokenTransferrerAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recipient",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFeeTokenAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "primaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "secondaryFee",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "requiredGasLimit",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "multiHopFallback",
            type: "address",
            internalType: "address",
          },
        ],
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "TokensWithdrawn",
    inputs: [
      {
        name: "recipient",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "AddressEmptyCode",
    inputs: [
      {
        name: "target",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "AddressInsufficientBalance",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "FailedInnerCall",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidInitialization",
    inputs: [],
  },
  {
    type: "error",
    name: "NotInitializing",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
];

export const tokenHomeBytecode =
  "0x608060405234801561000f575f80fd5b50604051614ffb380380614ffb83398101604081905261002e91610893565b61003b8585858585610048565b505050505061090d565b50565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000810460ff1615906001600160401b03165f811580156100915750825b90505f826001600160401b031660011480156100ac5750303b155b9050811580156100ba575080155b156100d85760405163f92ee8a960e01b815260040160405180910390fd5b84546001600160401b0319166001178555831561010657845460ff60401b1916680100000000000000001785555b6101138a8a8a8a8a610165565b831561015957845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050505050565b61016d61018a565b61017a85858585856101da565b610183826101ff565b5050505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a005468010000000000000000900460ff166101d857604051631afcd79f60e31b815260040160405180910390fd5b565b6101e261018a565b6101ed858585610248565b6101f5610268565b6101838282610278565b61020761018a565b7f914a9547f6c3ddce1d5efbd9e687708f0d1d408ce129e8e1a88bce4f40e2950080546001600160a01b0319166001600160a01b0392909216919091179055565b61025061018a565b61025a8382610404565b6102638261042a565b505050565b61027061018a565b6101d861043b565b61028061018a565b6001600160a01b0382166102db5760405162461bcd60e51b815260206004820152601d60248201527f546f6b656e486f6d653a207a65726f20746f6b656e206164647265737300000060448201526064015b60405180910390fd5b60128160ff16111561033a5760405162461bcd60e51b815260206004820152602260248201527f546f6b656e486f6d653a20746f6b656e20646563696d616c7320746f6f2068696044820152610ced60f31b60648201526084016102d2565b5f7f9316912b5a9db88acbe872c934fdd0a46c436c6dcba332d649c4d57c7bc9e60090507302000000000000000000000000000000000000056001600160a01b0316634213cf786040518163ffffffff1660e01b8152600401602060405180830381865afa1580156103ae573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906103d291906108f6565b8155600101805460ff909216600160a01b026001600160a81b03199092166001600160a01b0390931692909217179055565b61040c61018a565b610414610465565b61041c610475565b610426828261047d565b5050565b61043261018a565b61004581610607565b5f7fd2f1ed38b7d242bfb8b41862afb813a15193219a4bc717f2056607593e6c75005b6001905550565b61046d61018a565b6101d8610641565b6101d861018a565b61048561018a565b6001600160a01b0382166105015760405162461bcd60e51b815260206004820152603760248201527f54656c65706f7274657252656769737472794170703a207a65726f2054656c6560448201527f706f72746572207265676973747279206164647265737300000000000000000060648201526084016102d2565b5f7fde77a4dc7391f6f8f2d9567915d687d3aee79e7a1fc7300392f2727e9a0f1d0090505f8390505f816001600160a01b031663c07f47d46040518163ffffffff1660e01b8152600401602060405180830381865afa158015610566573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061058a91906108f6565b116105df5760405162461bcd60e51b815260206004820152603260248201525f80516020614fdb833981519152604482015271656c65706f7274657220726567697374727960701b60648201526084016102d2565b81546001600160a01b0319166001600160a01b03821617825561060183610670565b50505050565b61060f61018a565b6001600160a01b03811661063857604051631e4fbdf760e01b81525f60048201526024016102d2565b61004581610808565b61064961018a565b5f7f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f0061045e565b7fde77a4dc7391f6f8f2d9567915d687d3aee79e7a1fc7300392f2727e9a0f1d0080546040805163301fd1f560e21b815290515f926001600160a01b03169163c07f47d49160048083019260209291908290030181865afa1580156106d7573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906106fb91906108f6565b60028301549091508184111561075a5760405162461bcd60e51b815260206004820152603160248201525f80516020614fdb83398151915260448201527032b632b837b93a32b9103b32b939b4b7b760791b60648201526084016102d2565b8084116107cf5760405162461bcd60e51b815260206004820152603f60248201527f54656c65706f7274657252656769737472794170703a206e6f7420677265617460448201527f6572207468616e2063757272656e74206d696e696d756d2076657273696f6e0060648201526084016102d2565b60028301849055604051849082907fa9a7ef57e41f05b4c15480842f5f0c27edfcbb553fed281f7c4068452cc1c02d905f90a350505050565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a3505050565b80516001600160a01b038116811461088e575f80fd5b919050565b5f805f805f60a086880312156108a7575f80fd5b6108b086610878565b94506108be60208701610878565b9350604086015192506108d360608701610878565b9150608086015160ff811681146108e8575f80fd5b809150509295509295909350565b5f60208284031215610906575f80fd5b5051919050565b6146c18061091a5f395ff3fe608060405234801561000f575f80fd5b5060043610610127575f3560e01c806365690038116100a9578063c8511ada1161006e578063c8511ada146102b4578063c868efaa14610388578063d2cc7a701461039b578063f2fde38b146103c2578063fd658268146103d5575f80fd5b80636569003814610232578063715018a6146102455780638da5cb5b1461024d578063909a6ac01461027d5780639731429714610291575f80fd5b80634511243e116100ef5780634511243e146101d15780634797735f146101e45780635d16225d146101f85780635eb995141461020b57806362e3901b1461021e575f80fd5b806310fe9ae81461012b578063154d625a146101745780632b0d8f18146101955780633bb03890146101aa5780634213cf78146101bd575b5f80fd5b7f9316912b5a9db88acbe872c934fdd0a46c436c6dcba332d649c4d57c7bc9e601546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b61018761018236600461368c565b6103e8565b60405190815260200161016b565b6101a86101a33660046136ba565b610430565b005b6101a86101b83660046136e3565b610532565b5f8051602061461583398151915254610187565b6101a86101df3660046136ba565b610646565b6101875f8051602061467583398151915281565b6101a8610206366004613747565b610735565b6101a8610219366004613776565b610751565b6101875f8051602061461583398151915281565b6101a861024036600461378d565b610765565b6101a861078e565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b0316610157565b6101875f8051602061469583398151915281565b6102a461029f3660046136ba565b6107a1565b604051901515815260200161016b565b6103516102c236600461368c565b60408051608080820183525f808352602080840182905283850182905260609384018290529581525f8051602061463583398151915286528381206001600160a01b039590951681529385529282902082519384018352805460ff9081161515855260018201549585019590955260028101549284019290925260039091015490921615159181019190915290565b60405161016b9190815115158152602080830151908201526040808301519082015260609182015115159181019190915260800190565b6101a86103963660046137d3565b6107c1565b7fde77a4dc7391f6f8f2d9567915d687d3aee79e7a1fc7300392f2727e9a0f1d0254610187565b6101a86103d03660046136ba565b61097e565b6101a86103e3366004613854565b6109b8565b5f8281527f9316912b5a9db88acbe872c934fdd0a46c436c6dcba332d649c4d57c7bc9e603602090815260408083206001600160a01b03851684529091529020545b92915050565b5f805160206146958339815191526104466109c8565b6001600160a01b0382166104755760405162461bcd60e51b815260040161046c90613889565b60405180910390fd5b61047f81836109d0565b156104e25760405162461bcd60e51b815260206004820152602d60248201527f54656c65706f7274657252656769737472794170703a2061646472657373206160448201526c1b1c9958591e481c185d5cd959609a1b606482015260840161046c565b6001600160a01b0382165f81815260018381016020526040808320805460ff1916909217909155517f933f93e57a222e6330362af8b376d0a8725b6901e9a2fb86d00f169702b28a4c9190a25050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff1615906001600160401b03165f811580156105765750825b90505f826001600160401b031660011480156105915750303b155b90508115801561059f575080155b156105bd5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff1916600117855583156105e757845460ff60401b1916600160401b1785555b6105f48a8a8a8a8a6109f1565b831561063a57845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050505050565b5f8051602061469583398151915261065c6109c8565b6001600160a01b0382166106825760405162461bcd60e51b815260040161046c90613889565b61068c81836109d0565b6106ea5760405162461bcd60e51b815260206004820152602960248201527f54656c65706f7274657252656769737472794170703a2061646472657373206e6044820152681bdd081c185d5cd95960ba1b606482015260840161046c565b6001600160a01b0382165f818152600183016020526040808220805460ff19169055517f844e2f3154214672229235858fd029d1dfd543901c6d05931f0bc2480a2d72c39190a25050565b61074d61074736849003840184613989565b82610a16565b5050565b6107596109c8565b61076281610c27565b50565b61074d61077d5f805160206146158339815191525490565b303361078886613a8b565b85610dbf565b610796610fcb565b61079f5f611026565b565b5f5f805160206146958339815191526107ba81846109d0565b9392505050565b6107c9611096565b5f5f8051602061469583398151915260028101548154919250906001600160a01b0316634c1f08ce336040516001600160e01b031960e084901b1681526001600160a01b039091166004820152602401602060405180830381865afa158015610834573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906108589190613b59565b10156108bf5760405162461bcd60e51b815260206004820152603060248201527f54656c65706f7274657252656769737472794170703a20696e76616c6964205460448201526f32b632b837b93a32b91039b2b73232b960811b606482015260840161046c565b6108c981336109d0565b1561092f5760405162461bcd60e51b815260206004820152603060248201527f54656c65706f7274657252656769737472794170703a2054656c65706f72746560448201526f1c881859191c995cdcc81c185d5cd95960821b606482015260840161046c565b61096f858585858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f920191909152506110e092505050565b506109786114d3565b50505050565b610986610fcb565b6001600160a01b0381166109af57604051631e4fbdf760e01b81525f600482015260240161046c565b61076281611026565b6109c38383836114fd565b505050565b61079f610fcb565b6001600160a01b03165f908152600191909101602052604090205460ff1690565b6109f96116ed565b610a068585858585611736565b610a0f8261175b565b5050505050565b5f805160206146558339815191528054600114610a455760405162461bcd60e51b815260040161046c90613b70565b60028155610a5283611791565b60e08301516001600160a01b031615610a7d5760405162461bcd60e51b815260040161046c90613bb4565b5f80610a9b855f01518660200151868860600151896080015161183a565b915091505f604051806040016040528060016004811115610abe57610abe613bfa565b8152602001604051806040016040528089604001516001600160a01b0316815260200186815250604051602001610af59190613c0e565b60405160208183030381529060405281525090505f610bd46040518060c00160405280895f0151815260200189602001516001600160a01b0316815260200160405180604001604052808b606001516001600160a01b031681526020018781525081526020018960c0015181526020015f6001600160401b03811115610b7d57610b7d6138d7565b604051908082528060200260200182016040528015610ba6578160200160208202803683370190505b50815260200184604051602001610bbd9190613c7b565b6040516020818303038152906040528152506119ff565b9050336001600160a01b0316817f93f19bf1ec58a15dc643b37e7e18a1c13e85e06cd11929e283154691ace9fb528987604051610c12929190613cbd565b60405180910390a35050600190925550505050565b5f8051602061469583398151915280546040805163301fd1f560e21b815290515f926001600160a01b03169163c07f47d49160048083019260209291908290030181865afa158015610c7b573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610c9f9190613b59565b600283015490915081841115610d115760405162461bcd60e51b815260206004820152603160248201527f54656c65706f7274657252656769737472794170703a20696e76616c6964205460448201527032b632b837b93a32b9103b32b939b4b7b760791b606482015260840161046c565b808411610d865760405162461bcd60e51b815260206004820152603f60248201527f54656c65706f7274657252656769737472794170703a206e6f7420677265617460448201527f6572207468616e2063757272656e74206d696e696d756d2076657273696f6e00606482015260840161046c565b60028301849055604051849082907fa9a7ef57e41f05b4c15480842f5f0c27edfcbb553fed281f7c4068452cc1c02d905f90a350505050565b5f805160206146558339815191528054600114610dee5760405162461bcd60e51b815260040161046c90613b70565b60028155610dfb83611b1a565b60c08301516001600160a01b031615610e265760405162461bcd60e51b815260040161046c90613bb4565b5f80610e46855f015186602001518688610100015189610120015161183a565b915091505f604051806040016040528060026004811115610e6957610e69613bfa565b81526020016040518061010001604052808c81526020018b6001600160a01b031681526020018a6001600160a01b0316815260200189604001516001600160a01b03168152602001868152602001896060015181526020018960a0015181526020018960e001516001600160a01b0316815250604051602001610eec9190613d3e565b60405160208183030381529060405281525090505f610f756040518060c00160405280895f0151815260200189602001516001600160a01b0316815260200160405180604001604052808b61010001516001600160a01b03168152602001878152508152602001896080015181526020015f6001600160401b03811115610b7d57610b7d6138d7565b9050876001600160a01b0316817f5d76dff81bf773b908b050fa113d39f7d8135bb4175398f313ea19cd3a1a0b168987604051610fb3929190613ddc565b60405180910390a35050600190925550505050505050565b33610ffd7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b03161461079f5760405163118cdaa760e01b815233600482015260240161046c565b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a3505050565b7f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f008054600119016110da57604051633ee5aeb560e01b815260040160405180910390fd5b60029055565b5f5f8051602061461583398151915290505f828060200190518101906111069190613f00565b905060018151600481111561111d5761111d613bfa565b03611165575f816020015180602001905181019061113b9190613f88565b90505f61114d87878460200151611cff565b905061115c825f015182611d8a565b50505050505050565b60028151600481111561117a5761117a613bfa565b03611293575f81602001518060200190518101906111989190613fc0565b90505f6111aa87878460800151611cff565b825190915087146112105760405162461bcd60e51b815260206004820152602a60248201527f546f6b656e486f6d653a206d69736d61746368656420736f7572636520626c6f60448201526918dad8da185a5b88125160b21b606482015260840161046c565b856001600160a01b031682602001516001600160a01b0316146112895760405162461bcd60e51b815260206004820152602b60248201527f546f6b656e486f6d653a206d69736d617463686564206f726967696e2073656e60448201526a646572206164647265737360a81b606482015260840161046c565b61115c8282611ded565b6003815160048111156112a8576112a8613bfa565b0361137c575f81602001518060200190518101906112c6919061408a565b90505f806112de888885606001518660800151611fcd565b91509150611372604051806101000160405280855f0151815260200185602001516001600160a01b0316815260200185604001516001600160a01b03168152602001876001015f9054906101000a90046001600160a01b03166001600160a01b031681526020018381526020015f81526020018560a0015181526020018560c001516001600160a01b031681525083612078565b5050505050505050565b60048151600481111561139157611391613bfa565b0361148c575f81602001518060200190518101906113af9190614123565b90505f806113c888888560800151866101400151611fcd565b915091506113728888855f01516040518061016001604052808860200151815260200188604001516001600160a01b0316815260200188606001516001600160a01b031681526020018860a00151815260200188610100015181526020018860c0015181526020018861012001516001600160a01b031681526020018860e001516001600160a01b031681526020018a6001015f9054906101000a90046001600160a01b03166001600160a01b031681526020018681526020015f81525086612203565b5f815160048111156114a0576114a0613bfa565b03610a0f575f81602001518060200190518101906114be919061421b565b90506114cb8686836123e0565b505050505050565b5f7f9b779b17422d0df92223018b32b4d1fa46e071723d6817e2486d003becc55f005b6001905550565b5f80516020614655833981519152805460011461152c5760405162461bcd60e51b815260040161046c90613b70565b60028082555f8581525f80516020614635833981519152602090815260408083206001600160a01b03881684528252918290208251608081018452815460ff9081161515808352600184015494830194909452948201549381019390935260030154909216151560608201525f80516020614615833981519152916115c35760405162461bcd60e51b815260040161046c90614281565b5f8160200151116116205760405162461bcd60e51b815260206004820152602160248201527f546f6b656e486f6d653a207a65726f20636f6c6c61746572616c206e656564656044820152601960fa1b606482015260840161046c565b611629846127e7565b93505f80826020015186106116585760208301515f925061164a90876142ca565b90508260200151955061166b565b85836020015161166891906142ca565b91505b5f88815260028501602090815260408083206001600160a01b038b168085529083529281902060010185905580518981529182018590528a917f6769a5f9bfc8b6e0db839ab981cbf9239274ae72d2d035081a9157d43bd33cb6910160405180910390a380156116df576116df3382611d8a565b505060019092555050505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff1661079f57604051631afcd79f60e31b815260040160405180910390fd5b61173e6116ed565b61174985858561280e565b611751612829565b610a0f8282612839565b6117636116ed565b5f8051602061467583398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b60408101516001600160a01b03166117f55760405162461bcd60e51b815260206004820152602160248201527f546f6b656e486f6d653a207a65726f20726563697069656e74206164647265736044820152607360f81b606482015260840161046c565b5f8160c00151116118185760405162461bcd60e51b815260040161046c906142dd565b60a0810151156107625760405162461bcd60e51b815260040161046c9061431f565b5f8581525f80516020614635833981519152602090815260408083206001600160a01b038816845282528083208151608081018352815460ff90811615158083526001840154958301959095526002830154938201939093526003909101549091161515606082015282915f8051602061461583398151915291906118d15760405162461bcd60e51b815260040161046c90614281565b6020810151156119335760405162461bcd60e51b815260206004820152602760248201527f546f6b656e486f6d653a20636f6c6c61746572616c206e656564656420666f726044820152662072656d6f746560c81b606482015260840161046c565b61193c876127e7565b965084156119525761194f8633876129a0565b94505b5f611966826040015183606001518a612af9565b90505f81116119b75760405162461bcd60e51b815260206004820152601d60248201527f546f6b656e486f6d653a207a65726f207363616c656420616d6f756e74000000604482015260640161046c565b5f8a815260038401602090815260408083206001600160a01b038d168452909152812080548392906119ea908490614360565b90915550909a95995094975050505050505050565b5f80611a09612b0f565b60408401516020015190915015611aae576040830151516001600160a01b0316611a8b5760405162461bcd60e51b815260206004820152602d60248201527f54656c65706f7274657252656769737472794170703a207a65726f206665652060448201526c746f6b656e206164647265737360981b606482015260840161046c565b604083015160208101519051611aae916001600160a01b03909116908390612bff565b604051630624488560e41b81526001600160a01b03821690636244885090611ada908690600401614373565b6020604051808303815f875af1158015611af6573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906107ba9190613b59565b60408101516001600160a01b0316611b875760405162461bcd60e51b815260206004820152602a60248201527f546f6b656e486f6d653a207a65726f20726563697069656e7420636f6e7472616044820152696374206164647265737360b01b606482015260840161046c565b5f816080015111611baa5760405162461bcd60e51b815260040161046c906142dd565b5f8160a0015111611c095760405162461bcd60e51b815260206004820152602360248201527f546f6b656e486f6d653a207a65726f20726563697069656e7420676173206c696044820152621b5a5d60ea1b606482015260840161046c565b80608001518160a0015110611c6f5760405162461bcd60e51b815260206004820152602660248201527f546f6b656e486f6d653a20696e76616c696420726563697069656e7420676173604482015265081b1a5b5a5d60d21b606482015260840161046c565b60e08101516001600160a01b0316611cdc5760405162461bcd60e51b815260206004820152602a60248201527f546f6b656e486f6d653a207a65726f2066616c6c6261636b20726563697069656044820152696e74206164647265737360b01b606482015260840161046c565b610140810151156107625760405162461bcd60e51b815260040161046c9061431f565b5f8381525f80516020614635833981519152602090815260408083206001600160a01b038616845282528083208151608081018352815460ff9081161515825260018301549482019490945260028201549281019290925260030154909116151560608201525f8051602061461583398151915290611d8081878787612c86565b9695505050505050565b6040518181525f80516020614675833981519152906001600160a01b038416907f6352c5382c4a4578e712449ca65e83cdb392d045dfcf1cad9615189db2da244b9060200160405180910390a280546109c3906001600160a01b03168484612d7d565b5f80516020614675833981519152805460608401516001600160a01b0390911690611e1a90829085612bff565b5f845f01518560200151866040015184878960a00151604051602401611e459695949392919061442a565b60408051601f198184030181529190526020810180516001600160e01b03166394395edd60e01b17905260c086015160608701519192505f91611e89919084612ddc565b6060870151604051636eb1769f60e11b81523060048201526001600160a01b0391821660248201529192505f919085169063dd62ed3e90604401602060405180830381865afa158015611ede573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611f029190613b59565b9050611f138488606001515f612de9565b8115611f655786606001516001600160a01b03167f104deb555f67e63782bb817bc26c39050894645f9b9f29c4be8ae68d0e8b7ff487604051611f5891815260200190565b60405180910390a2611fad565b86606001516001600160a01b03167fb9eaeae386d339f8115782f297a9e5f0e13fb587cd6b0d502f113cb8dd4d6cb087604051611fa491815260200190565b60405180910390a25b801561115c5760e087015161115c906001600160a01b0386169083612d7d565b5f8481525f80516020614635833981519152602090815260408083206001600160a01b038716845282528083208151608081018352815460ff90811615158252600183015494820194909452600282015492810192909252600301549091161515606082015281905f805160206146158339815191529082612051828a8a8a612c86565b90505f6120678360400151846060015189612e78565b919a91995090975050505050505050565b5f8051602061465583398151915280546001146120a75760405162461bcd60e51b815260040161046c90613b70565b600281556120b483611791565b5f6120cc845f01518560200151858760800151612e85565b9050805f036120e9576120e38460e0015184611d8a565b506121fb565b604080518082019091525f908060018152602001604051806040016040528088604001516001600160a01b031681526020018581525060405160200161212f9190613c0e565b60405160208183030381529060405281525090505f6121bb6040518060c00160405280885f0151815260200188602001516001600160a01b0316815260200160405180604001604052808a606001516001600160a01b031681526020018a6080015181525081526020018860c0015181526020015f6001600160401b03811115610b7d57610b7d6138d7565b9050807f825080857c76cef4a1629c0705a7f8b4ef0282ddcafde0b6715c4fb34b68aaf087856040516121ef929190613cbd565b60405180910390a25050505b600190555050565b5f8051602061465583398151915280546001146122325760405162461bcd60e51b815260040161046c90613b70565b6002815561223f83611b1a565b5f612258845f0151856020015185876101200151612e85565b9050805f036122755761226f8460c0015184611d8a565b506123d5565b604080518082019091525f9080600281526020016040518061010001604052808b81526020018a6001600160a01b03168152602001896001600160a01b0316815260200188604001516001600160a01b03168152602001858152602001886060015181526020018860a0015181526020018860e001516001600160a01b03168152506040516020016123079190613d3e565b60405160208183030381529060405281525090505f6123956040518060c00160405280885f0151815260200188602001516001600160a01b0316815260200160405180604001604052808a61010001516001600160a01b031681526020018a61012001518152508152602001886080015181526020015f6001600160401b03811115610b7d57610b7d6138d7565b9050807f42eff9005856e3c586b096d67211a566dc926052119fd7cc08023c70937ecb3087856040516123c9929190613ddc565b60405180910390a25050505b600190555050505050565b5f80516020614615833981519152836124475760405162461bcd60e51b8152602060048201526024808201527f546f6b656e486f6d653a207a65726f2072656d6f746520626c6f636b636861696044820152631b88125160e21b606482015260840161046c565b805484036124af5760405162461bcd60e51b815260206004820152602f60248201527f546f6b656e486f6d653a2063616e6e6f742072656769737465722072656d6f7460448201526e329037b71039b0b6b29031b430b4b760891b606482015260840161046c565b6001600160a01b03831661251e5760405162461bcd60e51b815260206004820152603060248201527f546f6b656e486f6d653a207a65726f2072656d6f746520746f6b656e2074726160448201526f6e73666572726572206164647265737360801b606482015260840161046c565b5f84815260028201602090815260408083206001600160a01b038716845290915290205460ff161561259e5760405162461bcd60e51b8152602060048201526024808201527f546f6b656e486f6d653a2072656d6f746520616c726561647920726567697374604482015263195c995960e21b606482015260840161046c565b6012826040015160ff1611156126085760405162461bcd60e51b815260206004820152602960248201527f546f6b656e486f6d653a2072656d6f746520746f6b656e20646563696d616c73604482015268040e8dede40d0d2ced60bb1b606482015260840161046c565b6001810154602083015160ff908116600160a01b909204161461267c5760405162461bcd60e51b815260206004820152602660248201527f546f6b656e486f6d653a20696e76616c696420686f6d6520746f6b656e20646560448201526563696d616c7360d01b606482015260840161046c565b5f8061269d8360010160149054906101000a900460ff168560400151612ff6565b915091505f6126b08383875f0151612e78565b90508180156126ca575084516126c790849061447e565b15155b156126dd576126da600182614360565b90505b6040518060800160405280600115158152602001828152602001848152602001831515815250846002015f8981526020019081526020015f205f886001600160a01b03166001600160a01b031681526020019081526020015f205f820151815f015f6101000a81548160ff02191690831515021790555060208201518160010155604082015181600201556060820151816003015f6101000a81548160ff021916908315150217905550905050856001600160a01b0316877ff229b02a51a4c8d5ef03a096ae0dd727d7b48b710d21b50ebebb560eef739b908388604001516040516127d692919091825260ff16602082015260400190565b60405180910390a350505050505050565b5f8051602061467583398151915280545f91906107ba906001600160a01b031633856129a0565b6128166116ed565b612820838261303e565b6109c382613060565b6128316116ed565b61079f613071565b6128416116ed565b6001600160a01b0382166128975760405162461bcd60e51b815260206004820152601d60248201527f546f6b656e486f6d653a207a65726f20746f6b656e2061646472657373000000604482015260640161046c565b60128160ff1611156128f65760405162461bcd60e51b815260206004820152602260248201527f546f6b656e486f6d653a20746f6b656e20646563696d616c7320746f6f2068696044820152610ced60f31b606482015260840161046c565b5f5f8051602061461583398151915290506005600160991b016001600160a01b0316634213cf786040518163ffffffff1660e01b8152600401602060405180830381865afa15801561294a573d5f803e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061296e9190613b59565b8155600101805460ff909216600160a01b026001600160a81b03199092166001600160a01b0390931692909217179055565b6040516370a0823160e01b81523060048201525f9081906001600160a01b038616906370a0823190602401602060405180830381865afa1580156129e6573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612a0a9190613b59565b9050612a216001600160a01b038616853086613085565b6040516370a0823160e01b81523060048201525f906001600160a01b038716906370a0823190602401602060405180830381865afa158015612a65573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612a899190613b59565b9050818111612aef5760405162461bcd60e51b815260206004820152602c60248201527f5361666545524332305472616e7366657246726f6d3a2062616c616e6365206e60448201526b1bdd081a5b98dc99585cd95960a21b606482015260840161046c565b611d8082826142ca565b5f612b0784848460016130be565b949350505050565b5f8051602061469583398151915280546040805163d820e64f60e01b815290515f939284926001600160a01b039091169163d820e64f916004808201926020929091908290030181865afa158015612b69573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612b8d9190614491565b9050612b9982826109d0565b1561042a5760405162461bcd60e51b815260206004820152603060248201527f54656c65706f7274657252656769737472794170703a2054656c65706f72746560448201526f1c881cd95b991a5b99c81c185d5cd95960821b606482015260840161046c565b604051636eb1769f60e11b81523060048201526001600160a01b0383811660248301525f919085169063dd62ed3e90604401602060405180830381865afa158015612c4c573d5f803e3d5ffd5b505050506040513d601f19601f82011682018060405250810190612c709190613b59565b90506109788484612c818585614360565b612de9565b83515f90612ca65760405162461bcd60e51b815260040161046c90614281565b602085015115612d045760405162461bcd60e51b8152602060048201526024808201527f546f6b656e486f6d653a2072656d6f7465206e6f7420636f6c6c61746572616c6044820152631a5e995960e21b606482015260840161046c565b612d0f8484846130e5565b5f612d238660400151876060015185612e78565b90505f8111612d745760405162461bcd60e51b815260206004820152601c60248201527f546f6b656e486f6d653a207a65726f20746f6b656e20616d6f756e7400000000604482015260640161046c565b95945050505050565b6040516001600160a01b038381166024830152604482018390526109c391859182169063a9059cbb906064015b604051602081830303815290604052915060e01b6020820180516001600160e01b0383818316178352505050506131d2565b5f612b07845f8585613233565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b179052612e3a8482613303565b610978576040516001600160a01b0384811660248301525f6044830152612e6e91869182169063095ea7b390606401612daa565b61097884826131d2565b5f612b078484845f6130be565b5f8481525f80516020614635833981519152602090815260408083206001600160a01b038716845282528083208151608081018352815460ff9081161580158352600184015495830195909552600283015493820193909352600390910154909116151560608201525f805160206146158339815191529180612f0b57505f8160200151115b15612f1a575f92505050612b07565b838511612f7e5760405162461bcd60e51b815260206004820152602c60248201527f546f6b656e486f6d653a20696e73756666696369656e7420616d6f756e74207460448201526b6f20636f766572206665657360a01b606482015260840161046c565b612f8884866142ca565b94505f612f9e8260400151836060015188612af9565b9050805f03612fb2575f9350505050612b07565b5f88815260038401602090815260408083206001600160a01b038b16845290915281208054839290612fe5908490614360565b909155509098975050505050505050565b5f8060ff8085169084161181816130195761301185876144ac565b60ff16613027565b61302386866144ac565b60ff165b61303290600a6145a5565b96919550909350505050565b6130466116ed565b61304e6133a0565b6130566133b0565b61074d82826133b8565b6130686116ed565b6107628161353c565b5f5f805160206146558339815191526114f6565b6040516001600160a01b0384811660248301528381166044830152606482018390526109789186918216906323b872dd90608401612daa565b5f811515841515036130db576130d485846145b0565b9050612b07565b612d7485846145c7565b5f8381527f9316912b5a9db88acbe872c934fdd0a46c436c6dcba332d649c4d57c7bc9e603602090815260408083206001600160a01b03861684529091529020545f80516020614615833981519152908281101561319c5760405162461bcd60e51b815260206004820152602e60248201527f546f6b656e486f6d653a20696e73756666696369656e7420746f6b656e20747260448201526d616e736665722062616c616e636560901b606482015260840161046c565b6131a683826142ca565b5f9586526003909201602090815260408087206001600160a01b03909616875294905250919092205550565b5f6131e66001600160a01b03841683613544565b905080515f1415801561320a57508080602001905181019061320891906145da565b155b156109c357604051635274afe760e01b81526001600160a01b038416600482015260240161046c565b5f845a10156132845760405162461bcd60e51b815260206004820152601b60248201527f43616c6c5574696c733a20696e73756666696369656e74206761730000000000604482015260640161046c565b834710156132d45760405162461bcd60e51b815260206004820152601d60248201527f43616c6c5574696c733a20696e73756666696369656e742076616c7565000000604482015260640161046c565b826001600160a01b03163b5f036132ec57505f612b07565b5f805f84516020860188888bf19695505050505050565b5f805f846001600160a01b03168460405161331e91906145f9565b5f604051808303815f865af19150503d805f8114613357576040519150601f19603f3d011682016040523d82523d5f602084013e61335c565b606091505b509150915081801561338657508051158061338657508080602001905181019061338691906145da565b8015612d745750505050506001600160a01b03163b151590565b6133a86116ed565b61079f613551565b61079f6116ed565b6133c06116ed565b6001600160a01b03821661343c5760405162461bcd60e51b815260206004820152603760248201527f54656c65706f7274657252656769737472794170703a207a65726f2054656c6560448201527f706f727465722072656769737472792061646472657373000000000000000000606482015260840161046c565b5f5f8051602061469583398151915290505f8390505f816001600160a01b031663c07f47d46040518163ffffffff1660e01b8152600401602060405180830381865afa15801561348e573d5f803e3d5ffd5b505050506040513d601f19601f820116820180604052508101906134b29190613b59565b1161351a5760405162461bcd60e51b815260206004820152603260248201527f54656c65706f7274657252656769737472794170703a20696e76616c69642054604482015271656c65706f7274657220726567697374727960701b606482015260840161046c565b81546001600160a01b0319166001600160a01b03821617825561097883610c27565b6109866116ed565b60606107ba83835f613559565b6114d36116ed565b60608147101561357e5760405163cd78605960e01b815230600482015260240161046c565b5f80856001600160a01b0316848660405161359991906145f9565b5f6040518083038185875af1925050503d805f81146135d3576040519150601f19603f3d011682016040523d82523d5f602084013e6135d8565b606091505b5091509150611d808683836060826135f8576135f38261363f565b6107ba565b815115801561360f57506001600160a01b0384163b155b1561363857604051639996b31560e01b81526001600160a01b038516600482015260240161046c565b50806107ba565b80511561364f5780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b6001600160a01b0381168114610762575f80fd5b803561368781613668565b919050565b5f806040838503121561369d575f80fd5b8235915060208301356136af81613668565b809150509250929050565b5f602082840312156136ca575f80fd5b81356107ba81613668565b60ff81168114610762575f80fd5b5f805f805f60a086880312156136f7575f80fd5b853561370281613668565b9450602086013561371281613668565b935060408601359250606086013561372981613668565b91506080860135613739816136d5565b809150509295509295909350565b5f8082840361012081121561375a575f80fd5b61010080821215613769575f80fd5b9395938601359450505050565b5f60208284031215613786575f80fd5b5035919050565b5f806040838503121561379e575f80fd5b82356001600160401b038111156137b3575f80fd5b830161016081860312156137c5575f80fd5b946020939093013593505050565b5f805f80606085870312156137e6575f80fd5b8435935060208501356137f881613668565b925060408501356001600160401b0380821115613813575f80fd5b818701915087601f830112613826575f80fd5b813581811115613834575f80fd5b886020828501011115613845575f80fd5b95989497505060200194505050565b5f805f60608486031215613866575f80fd5b83359250602084013561387881613668565b929592945050506040919091013590565b6020808252602e908201527f54656c65706f7274657252656769737472794170703a207a65726f2054656c6560408201526d706f72746572206164647265737360901b606082015260800190565b634e487b7160e01b5f52604160045260245ffd5b60405161010081016001600160401b038111828210171561390e5761390e6138d7565b60405290565b60405161016081016001600160401b038111828210171561390e5761390e6138d7565b604080519081016001600160401b038111828210171561390e5761390e6138d7565b604051601f8201601f191681016001600160401b0381118282101715613981576139816138d7565b604052919050565b5f610100828403121561399a575f80fd5b6139a26138eb565b8235815260208301356139b481613668565b602082015260408301356139c781613668565b60408201526139d86060840161367c565b60608201526080830135608082015260a083013560a082015260c083013560c0820152613a0760e0840161367c565b60e08201529392505050565b5f6001600160401b03821115613a2b57613a2b6138d7565b50601f01601f191660200190565b5f82601f830112613a48575f80fd5b8135613a5b613a5682613a13565b613959565b818152846020838601011115613a6f575f80fd5b816020850160208301375f918101602001919091529392505050565b5f6101608236031215613a9c575f80fd5b613aa4613914565b82358152613ab46020840161367c565b6020820152613ac56040840161367c565b604082015260608301356001600160401b03811115613ae2575f80fd5b613aee36828601613a39565b6060830152506080830135608082015260a083013560a0820152613b1460c0840161367c565b60c0820152613b2560e0840161367c565b60e0820152610100613b3881850161367c565b90820152610120838101359082015261014092830135928101929092525090565b5f60208284031215613b69575f80fd5b5051919050565b60208082526024908201527f53656e645265656e7472616e637947756172643a2073656e64207265656e7472604082015263616e637960e01b606082015260800190565b60208082526026908201527f546f6b656e486f6d653a206e6f6e2d7a65726f206d756c74692d686f702066616040820152656c6c6261636b60d01b606082015260800190565b634e487b7160e01b5f52602160045260245ffd5b81516001600160a01b03168152602080830151908201526040810161042a565b5f5b83811015613c48578181015183820152602001613c30565b50505f910152565b5f8151808452613c67816020860160208601613c2e565b601f01601f19169290920160200192915050565b602081525f825160058110613c9e57634e487b7160e01b5f52602160045260245ffd5b806020840152506020830151604080840152612b076060840182613c50565b5f6101208201905083518252602084015160018060a01b03808216602085015280604087015116604085015280606087015116606085015250506080840151608083015260a084015160a083015260c084015160c083015260e0840151613d2f60e08401826001600160a01b03169052565b50826101008301529392505050565b60208152815160208201525f602083015160018060a01b03808216604085015280604086015116606085015250506060830151613d8660808401826001600160a01b03169052565b50608083015160a083015260a08301516101008060c0850152613dad610120850183613c50565b915060c085015160e085015260e0850151613dd2828601826001600160a01b03169052565b5090949350505050565b60408152825160408201525f6020840151613e0260608401826001600160a01b03169052565b5060408401516001600160a01b03166080830152606084015161016060a08401819052613e336101a0850183613c50565b9150608086015160c085015260a086015160e085015260c0860151610100613e65818701836001600160a01b03169052565b60e08801519150610120613e83818801846001600160a01b03169052565b90880151915061014090613ea1878301846001600160a01b03169052565b880151928601929092525090940151610180830152506020015290565b5f82601f830112613ecd575f80fd5b8151613edb613a5682613a13565b818152846020838601011115613eef575f80fd5b612b07826020830160208701613c2e565b5f60208284031215613f10575f80fd5b81516001600160401b0380821115613f26575f80fd5b9083019060408286031215613f39575f80fd5b613f41613937565b825160058110613f4f575f80fd5b8152602083015182811115613f62575f80fd5b613f6e87828601613ebe565b60208301525095945050505050565b805161368781613668565b5f60408284031215613f98575f80fd5b613fa0613937565b8251613fab81613668565b81526020928301519281019290925250919050565b5f60208284031215613fd0575f80fd5b81516001600160401b0380821115613fe6575f80fd5b908301906101008286031215613ffa575f80fd5b6140026138eb565b8251815261401260208401613f7d565b602082015261402360408401613f7d565b604082015261403460608401613f7d565b60608201526080830151608082015260a083015182811115614054575f80fd5b61406087828601613ebe565b60a08301525060c083015160c082015261407c60e08401613f7d565b60e082015295945050505050565b5f60e0828403121561409a575f80fd5b60405160e081018181106001600160401b03821117156140bc576140bc6138d7565b6040528251815260208301516140d181613668565b602082015260408301516140e481613668565b80604083015250606083015160608201526080830151608082015260a083015160a082015260c083015161411781613668565b60c08201529392505050565b5f60208284031215614133575f80fd5b81516001600160401b0380821115614149575f80fd5b90830190610160828603121561415d575f80fd5b614165613914565b61416e83613f7d565b81526020830151602082015261418660408401613f7d565b604082015261419760608401613f7d565b60608201526080830151608082015260a0830151828111156141b7575f80fd5b6141c387828601613ebe565b60a08301525060c083015160c08201526141df60e08401613f7d565b60e0820152610100838101519082015261012091506141ff828401613f7d565b9181019190915261014091820151918101919091529392505050565b5f6060828403121561422b575f80fd5b604051606081018181106001600160401b038211171561424d5761424d6138d7565b604052825181526020830151614262816136d5565b60208201526040830151614275816136d5565b60408201529392505050565b6020808252818101527f546f6b656e486f6d653a2072656d6f7465206e6f742072656769737465726564604082015260600190565b634e487b7160e01b5f52601160045260245ffd5b8181038181111561042a5761042a6142b6565b60208082526022908201527f546f6b656e486f6d653a207a65726f20726571756972656420676173206c696d6040820152611a5d60f21b606082015260800190565b60208082526021908201527f546f6b656e486f6d653a206e6f6e2d7a65726f207365636f6e646172792066656040820152606560f81b606082015260800190565b8082018082111561042a5761042a6142b6565b6020808252825182820152828101516001600160a01b039081166040808501919091528401518051821660608501528083015160808501525f929161010085019190606087015160a0870152608087015160e060c08801528051938490528401925f92506101208701905b80841015614400578451831682529385019360019390930192908501906143de565b5060a0880151878203601f190160e0890152945061441e8186613c50565b98975050505050505050565b8681526001600160a01b0386811660208301528581166040830152841660608201526080810183905260c060a082018190525f9061441e90830184613c50565b634e487b7160e01b5f52601260045260245ffd5b5f8261448c5761448c61446a565b500690565b5f602082840312156144a1575f80fd5b81516107ba81613668565b60ff828116828216039081111561042a5761042a6142b6565b600181815b808511156144ff57815f19048211156144e5576144e56142b6565b808516156144f257918102915b93841c93908002906144ca565b509250929050565b5f826145155750600161042a565b8161452157505f61042a565b816001811461453757600281146145415761455d565b600191505061042a565b60ff841115614552576145526142b6565b50506001821b61042a565b5060208310610133831016604e8410600b8410161715614580575081810a61042a565b61458a83836144c5565b805f190482111561459d5761459d6142b6565b029392505050565b5f6107ba8383614507565b808202811582820484141761042a5761042a6142b6565b5f826145d5576145d561446a565b500490565b5f602082840312156145ea575f80fd5b815180151581146107ba575f80fd5b5f825161460a818460208701613c2e565b919091019291505056fe9316912b5a9db88acbe872c934fdd0a46c436c6dcba332d649c4d57c7bc9e6009316912b5a9db88acbe872c934fdd0a46c436c6dcba332d649c4d57c7bc9e602d2f1ed38b7d242bfb8b41862afb813a15193219a4bc717f2056607593e6c7500914a9547f6c3ddce1d5efbd9e687708f0d1d408ce129e8e1a88bce4f40e29500de77a4dc7391f6f8f2d9567915d687d3aee79e7a1fc7300392f2727e9a0f1d00a164736f6c6343000819000a54656c65706f7274657252656769737472794170703a20696e76616c69642054";
