// Import the contract ABI
const { abi } = require('./INSERT_ABI_PATH');

// Find call data for the setMessage function
const callData = web3.eth.abi.encodeFunctionCall(abi, [
  'INSERT_INPUT_1',
  'INSERT_INPUT_2',
  // ...
]);
