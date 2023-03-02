const ethers = require('ethers');
const contractFile = require('./compile');

const providerRPC = {
  development: {
    name: 'moonbeam-development',
    rpc: 'http://localhost:9944',
    chainId: 1281,
  },
  moonbase: {
    name: 'moonbase-alpha',
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
    chainId: 1287,
  },
};
const provider = new ethers.JsonRpcProvider(providerRPC.development.rpc, {
  chainId: providerRPC.development.chainId,
  name: providerRPC.development.name,
}); // Change to correct network

const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

let wallet = new ethers.Wallet(account_from.privateKey, provider);

const incrementer = new ethers.ContractFactory(abi, bytecode, wallet);

const deploy = async () => {
  console.log(`Attempting to deploy from account: ${wallet.address}`);

  const contract = await incrementer.deploy(5);
  const txReceipt = await contract.deploymentTransaction().wait();

  console.log(`Contract deployed at address: ${txReceipt.contractAddress}`);
};

deploy();