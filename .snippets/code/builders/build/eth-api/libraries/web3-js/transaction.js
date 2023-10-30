const Web3 = require('web3');

// 1. Add the Web3 provider logic here:
const providerRPC = {
  development: 'http://localhost:9944',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.moonbase); // Change to correct network

// 2. Create account variables
const accountFrom = {
  privateKey: 'INSERT_YOUR_PRIVATE_KEY',
  address: 'INSERT_PUBLIC_ADDRESS_OF_PK',
};
const addressTo = 'INSERT_TO_ADDRESS';

// 3. Create send function
const send = async () => {
  console.log(
    `Attempting to send transaction from ${accountFrom.address} to ${addressTo}`
  );

  // 4. Prepare and sign tx with PK
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      gas: 21000,
      to: addressTo,
      value: web3.utils.toWei('1', 'ether'),
      gasPrice: await web3.eth.getGasPrice(),
      nonce: await web3.eth.getTransactionCount(accountFrom.address),
    },
    accountFrom.privateKey
  );

  // 5. Send tx and wait for receipt
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(
    `Transaction successful with hash: ${createReceipt.transactionHash}`
  );
};

// 6. Call send function
send();
