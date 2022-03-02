const Web3 = require('web3');

const providerRPC = {
  development: 'http://localhost:9933',
  moonbase: 'https://rpc.api.moonbase.moonbeam.network',
};
const web3 = new Web3(providerRPC.development); // Change to correct network

const addressFrom = 'ADDRESS-FROM-HERE';
const addressTo = 'ADDRESS-TO-HERE';

const balances = async () => {
  const balanceFrom = web3.utils.fromWei(await web3.eth.getBalance(addressFrom), 'ether');
  const balanceTo = web3.utils.fromWei(await web3.eth.getBalance(addressTo), 'ether');

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

balances();