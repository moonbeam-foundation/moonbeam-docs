// 1. Import the contract abi
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create address variables
const contractAddress = 'CONTRACT-ADDRESS-HERE';

// 4. Create contract instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // 6. Call contract
  const data = await incrementer.methods.number().call();

  console.log(`The current number stored is: ${data}`);
};

// 7. Call get function
get();
