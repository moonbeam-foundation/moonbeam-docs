[
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'transactor',
        type: 'uint8',
      },
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'bytes',
        name: 'innerCall',
        type: 'bytes',
      },
    ],
    name: 'encodeUtilityAsDerivative',
    outputs: [
      {
        internalType: 'bytes',
        name: 'result',
        type: 'bytes',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'parents',
            type: 'uint8',
          },
          {
            internalType: 'bytes[]',
            name: 'interior',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct XcmTransactorV3.Multilocation',
        name: 'multilocation',
        type: 'tuple',
      },
    ],
    name: 'feePerSecond',
    outputs: [
      {
        internalType: 'uint256',
        name: 'feePerSecond',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
    ],
    name: 'indexToAccount',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'parents',
            type: 'uint8',
          },
          {
            internalType: 'bytes[]',
            name: 'interior',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct XcmTransactorV3.Multilocation',
        name: 'multilocation',
        type: 'tuple',
      },
    ],
    name: 'transactInfoWithSigned',
    outputs: [
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'transactExtraWeight',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'transactExtraWeightSigned',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'maxWeight',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'transactor',
        type: 'uint8',
      },
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: 'currencyId',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'transactRequiredWeightAtMost',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'innerCall',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'overallWeight',
        type: 'tuple',
      },
      {
        internalType: 'bool',
        name: 'refund',
        type: 'bool',
      },
    ],
    name: 'transactThroughDerivative',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'transactor',
        type: 'uint8',
      },
      {
        internalType: 'uint16',
        name: 'index',
        type: 'uint16',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'parents',
            type: 'uint8',
          },
          {
            internalType: 'bytes[]',
            name: 'interior',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct XcmTransactorV3.Multilocation',
        name: 'feeAsset',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'transactRequiredWeightAtMost',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'innerCall',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'overallWeight',
        type: 'tuple',
      },
      {
        internalType: 'bool',
        name: 'refund',
        type: 'bool',
      },
    ],
    name: 'transactThroughDerivativeMultilocation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'parents',
            type: 'uint8',
          },
          {
            internalType: 'bytes[]',
            name: 'interior',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct XcmTransactorV3.Multilocation',
        name: 'dest',
        type: 'tuple',
      },
      {
        internalType: 'address',
        name: 'feeLocationAddress',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'transactRequiredWeightAtMost',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'call',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'overallWeight',
        type: 'tuple',
      },
      {
        internalType: 'bool',
        name: 'refund',
        type: 'bool',
      },
    ],
    name: 'transactThroughSigned',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint8',
            name: 'parents',
            type: 'uint8',
          },
          {
            internalType: 'bytes[]',
            name: 'interior',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct XcmTransactorV3.Multilocation',
        name: 'dest',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint8',
            name: 'parents',
            type: 'uint8',
          },
          {
            internalType: 'bytes[]',
            name: 'interior',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct XcmTransactorV3.Multilocation',
        name: 'feeLocation',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'transactRequiredWeightAtMost',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'call',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'feeAmount',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint64',
            name: 'refTime',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'proofSize',
            type: 'uint64',
          },
        ],
        internalType: 'struct XcmTransactorV3.Weight',
        name: 'overallWeight',
        type: 'tuple',
      },
      {
        internalType: 'bool',
        name: 'refund',
        type: 'bool',
      },
    ],
    name: 'transactThroughSignedMultilocation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
