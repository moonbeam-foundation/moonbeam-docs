// Imports
// ...

// Input data
// ...
const privateKey = 'INSERT_YOUR_PRIVATE_KEY';

// Rest of script
// ...

// Create a keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const account = keyring.addFromUri(privateKey);

const sendBatchTx = async () => {
  // Rest of sendBatchTx
  // ...

  // Create batch transaction
  const batchExtrinsic = originChainAPI.tx.utility.batchAll([
    transferMultiassets,
    sendXCM,
  ]);

  // Send batch transaction
  return await batchExtrinsic.signAndSend(account, ({ status }) => {
    if (status.isInBlock) console.log(`Transaction sent!`);
  });
};

sendBatchTx();
