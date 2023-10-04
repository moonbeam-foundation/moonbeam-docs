// Import the contract ABI
const { abi } = require('./INSERT_ABI_PATH');

// Use ABI to create an interface
const yourContractInterface = new ethers.Interface(abi);

// Find call data for the setMessage function
const callData = yourContractInterface.encodeFunctionData(
  'INSERT_FUNCTION_NAME',
  [
    'INSERT_INPUT_1',
    'INSERT_INPUT_2',
    // ...
  ]
);
