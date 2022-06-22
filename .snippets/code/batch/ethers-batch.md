```javascript
// 1. Import the contract ABI
// const { abi } = require('./YOUR-ABI-PATH');

// 2. Use ABI to create an interface
const yourContractInterface = new ethers.utils.Interface(abi);

// 3. Find call data for the setMessage function.
const callData = yourContractInterface.encodeFunctionData(
  'FUNCTION_NAME',
  [
    INPUT_1,
    INPUT_2,
    ...
  ]
);
```