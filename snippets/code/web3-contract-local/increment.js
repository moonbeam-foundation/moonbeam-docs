// 1. Import the contract abi
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const accountFrom = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';
const _value = 3;

// 4. Create contract instance
const incrementer = new web3.eth.Contract(abi, contractAddress);

// 5. Build increment tx
const incrementTx = incrementer.methods.increment(_value);

// 6. Create increment function
const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );

  // Sign Tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: incrementTx.encodeABI(),
      gas: await incrementTx.estimateGas(),
    },
    accountFrom.privateKey
  );

  // Send Tx and Wait for Receipt
  const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
  console.log(`Tx successful with hash: ${createReceipt.transactionHash}`);
};

// 9. Call increment function
increment();
