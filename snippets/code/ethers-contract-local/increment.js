// 1. Import the contract ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';
const _value = 3;

// 4. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create increment function
const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );

  // 7. Sign and send tx and wait for receipt
  const createReceipt = await incrementer.increment([_value]);
  await createReceipt.wait();

  console.log(`Tx successful with hash: ${createReceipt.hash}`);
};

// 8. Call the increment function
increment();
