export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'SubcallFailed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'SubcallSucceeded',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'to',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'value',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'callData',
        type: 'bytes[]',
      },
      {
        internalType: 'uint64[]',
        name: 'gasLimit',
        type: 'uint64[]',
      },
    ],
    name: 'batchAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'to',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'value',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'callData',
        type: 'bytes[]',
      },
      {
        internalType: 'uint64[]',
        name: 'gasLimit',
        type: 'uint64[]',
      },
    ],
    name: 'batchSome',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'to',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'value',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes[]',
        name: 'callData',
        type: 'bytes[]',
      },
      {
        internalType: 'uint64[]',
        name: 'gasLimit',
        type: 'uint64[]',
      },
    ],
    name: 'batchSomeUntilFailure',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
