// 1. Import the contract abi
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const accountFrom = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';

// 4. Create Contract Instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Build reset tx
const resetTx = incrementer.methods.reset();

// 6. Create reset function
const reset = async () => {
  console.log(`Calling the reset function in contract at address: ${contractAddress}`);

  // 7. Sign tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: resetTx.encodeABI(),
      gas: await resetTx.estimateGas(),
    },
    accountFrom.privateKey
  );

  // 8. Send tx and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
  console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};

// 9. Call reset function
reset();
