const Web3 = require('web3');

// 1. Add the Web3 provider logic here:
const providerRPC = {
  development: 'http://localhost:9944',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.development); // Change to correct network

// 2. Create address variables
const addressFrom = 'ADDRESS_FROM_HERE';
const addressTo = 'ADDRESS_TO_HERE';

// 3. Create balances function
const balances = async () => {
  // 4. Fetch balance info
  const balanceFrom = web3.utils.fromWei(await web3.eth.getBalance(addressFrom), 'ether');
  const balanceTo = web3.utils.fromWei(await web3.eth.getBalance(addressTo), 'ether');

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

// 5. Call balances function
balances();