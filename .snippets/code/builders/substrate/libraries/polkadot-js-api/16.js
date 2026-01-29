// Initialize wallet key pairs
const alice = keyring.addFromUri('INSERT_ALICES_PRIVATE_KEY');
const bob = 'INSERT_BOBS_ADDRESS';

// Form the transaction
const tx = await api.tx.balances.transferAllowDeath(bob, 12345n);

// Retrieve the encoded calldata of the transaction
const encodedCalldata = tx.method.toHex();
console.log(`Encoded calldata: ${encodedCallData}`);

// Sign and send the transaction
const txHash = await tx
  .signAndSend(alice);

// Show the transaction hash
console.log(`Submitted with hash ${txHash}`);
