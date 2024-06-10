[
  {
    inputs: [],
    name: 'latestRelayBlockNumber',
    outputs: [
      {
        internalType: 'uint32',
        name: 'relayBlockNumber',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'relayBlockNumber',
        type: 'uint32',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'at',
            type: 'bytes32',
          },
          {
            internalType: 'bytes[]',
            name: 'proof',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct RelayDataVerifier.ReadProof',
        name: 'readProof',
        type: 'tuple',
      },
      {
        internalType: 'bytes[]',
        name: 'keys',
        type: 'bytes[]',
      },
    ],
    name: 'verifyEntries',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'values',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'relayBlockNumber',
        type: 'uint32',
      },
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'at',
            type: 'bytes32',
          },
          {
            internalType: 'bytes[]',
            name: 'proof',
            type: 'bytes[]',
          },
        ],
        internalType: 'struct RelayDataVerifier.ReadProof',
        name: 'readProof',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'key',
        type: 'bytes',
      },
    ],
    name: 'verifyEntry',
    outputs: [
      {
        internalType: 'bytes',
        name: 'value',
        type: 'bytes',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
