// Construct a list of transactions to batch
const collator = 'INSERT_COLLATORS_ADDRESS';
const txs = [
  api.tx.balances.transferAllowDeath('INSERT_BOBS_ADDRESS', BigInt(12345)),
  api.tx.balances.transferAllowDeath('INSERT_CHARLEYS_ADDRESS', BigInt(12345)),
  api.tx.parachainStaking.scheduleDelegatorBondLess(collator, BigInt(12345)),
];

// Estimate the fees as RuntimeDispatchInfo, using the signer (either
// address or locked/unlocked keypair)
const info = await api.tx.utility.batch(txs).paymentInfo(alice);

console.log(`Estimated fees: ${info}`);

// Construct the batch and send the transactions
api.tx.utility.batch(txs).signAndSend(alice, ({ status }) => {
  if (status.isInBlock) {
    console.log(`included in ${status.asInBlock}`);

    // Disconnect API here!
  }
});
