```javascript
// Import the contract ABI
const { abi } = require('./YOUR-ABI-PATH');

// Use ABI to create an interface
const yourContractInterface = new ethers.Interface(abi);

// Find call data for the setMessage function
const callData = yourContractInterface.encodeFunctionData(
  'FUNCTION-NAME-HERE',
  [
    "INPUT-1-HERE",
    "INPUT-2-HERE",
    ...
  ]
);
```