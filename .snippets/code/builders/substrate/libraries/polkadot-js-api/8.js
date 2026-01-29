// Define wallet address
const addr = 'INSERT_ADDRESS';

// Retrieve the last timestamp
const now = await api.query.timestamp.now();

// Retrieve the account balance & current nonce via the system module
const { nonce, data: balance } = await api.query.system.account(addr);

console.log(
  `${now}: balance of ${balance.free} and a current nonce of ${nonce}`
);
