// 1. Import the contract file
const contractFile = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create account variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};

// 4. Save the bytecode and ABI
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// 5. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 6. Create contract instance with signer
const incrementer = new ethers.ContractFactory(abi, bytecode, wallet);

// 7. Create deploy function
const deploy = async () => {
  console.log(`Attempting to deploy from account: ${wallet.address}`);

  // 8. Send tx (initial value set to 5) and wait for receipt
  const contract = await incrementer.deploy([5]);
  await contract.deployed();

  console.log(`Contract deployed at address: ${contract.address}`);
};

// 9. Call the deploy function
deploy();
