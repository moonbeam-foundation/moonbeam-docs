// 1. Add the Web3 provider logic here:
// {...}

// 2. Create account variables
const accountFrom = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
  address: 'PUBLIC-ADDRESS-OF-PK-HERE',
};
const addressTo = 'ADDRESS-TO-HERE'; // Change addressTo

// 3. Create send function
const send = async () => {
  console.log(`Attempting to send transaction from ${accountFrom.address} to ${addressTo}`);

  // 4. Sign tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      gas: 21000,
      to: addressTo,
      value: web3.utils.toWei('1', 'ether'),
    },
    accountFrom.privateKey
  );

  // 5. Send tx and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
  console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);
};

// 6. Call send function
send();
