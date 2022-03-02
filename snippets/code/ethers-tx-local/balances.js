const ethers = require('ethers');

const providerRPC = {
  development: {
    name: 'moonbeam-development',
    rpc: 'http://localhost:9933',
    chainId: 1281,
  },
  moonbase: {
    name: 'moonbase-alpha',
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
    chainId: 1287,
  },
};
const provider = new ethers.providers.StaticJsonRpcProvider(providerRPC.development.rpc, {
  chainId: providerRPC.development.chainId,
  name: providerRPC.development.name,
}); //  Change to correct network

const addressFrom = 'ADDRESS-FROM-HERE';
const addressTo = 'ADDRESS-TO-HERE';

const balances = async () => {
  const balanceFrom = ethers.utils.formatEther(await provider.getBalance(addressFrom));

  const balanceTo = ethers.utils.formatEther(await provider.getBalance(addressTo));

  console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH`);
  console.log(`The balance of ${addressTo} is: ${balanceTo} ETH`);
};

balances();