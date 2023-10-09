export default [
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'targetChainId',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: 'decimals',
        type: 'uint8',
      },
    ],
    name: 'calculateRelayerFee',
    outputs: [
      {
        internalType: 'uint256',
        name: 'feeInTokenDenomination',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'toNativeTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'targetChain',
        type: 'uint16',
      },
      {
        internalType: 'bytes32',
        name: 'targetRecipient',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'batchId',
        type: 'uint32',
      },
    ],
    name: 'transferTokensWithRelay',
    outputs: [
      {
        internalType: 'uint64',
        name: 'messageSequence',
        type: 'uint64',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'toNativeTokenAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'targetChain',
        type: 'uint16',
      },
      {
        internalType: 'bytes32',
        name: 'targetRecipient',
        type: 'bytes32',
      },
      {
        internalType: 'uint32',
        name: 'batchId',
        type: 'uint32',
      },
    ],
    name: 'wrapAndTransferEthWithRelay',
    outputs: [
      {
        internalType: 'uint64',
        name: 'messageSequence',
        type: 'uint64',
      },
    ],
    stateMutability: 'payable',
    type: 'function',
  },
];
