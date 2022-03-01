// 1. Import the contract ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';

// 4. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create reset function
const reset = async () => {
  console.log(`Calling the reset function in contract at address: ${contractAddress}`);

  // 7. sign and send tx and wait for receipt
  const createReceipt = await incrementer.reset();
  await createReceipt.wait();

  console.log(`Tx successful with hash: ${createReceipt.hash}`);
};

// 8. Call the reset function
reset();
