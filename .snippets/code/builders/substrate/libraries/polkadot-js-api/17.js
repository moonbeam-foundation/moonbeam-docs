// Transaction to get weight information
const tx = api.tx.balances.transferAllowDeath('INSERT_BOBS_ADDRESS', BigInt(12345));

// Get weight info
const { partialFee, weight } = await tx.paymentInfo('INSERT_SENDERS_ADDRESS');

console.log(`Transaction weight: ${weight}`);
console.log(`Transaction fee: ${partialFee.toHuman()}`);
