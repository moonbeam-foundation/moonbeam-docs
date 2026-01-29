// Define wallet address
const addr = 'INSERT_ADDRESS';

// Subscribe to balance changes for a specified account
await api.query.system.account(addr, ({ nonce, data: balance }) => {
  console.log(
    `Free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`
  );
});

// Remove await api.disconnect()!
