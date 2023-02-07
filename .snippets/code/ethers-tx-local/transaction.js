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
const provider = new ethers.JsonRpcProvider(providerRPC.development.rpc, {
  chainId: providerRPC.development.chainId,
  name: providerRPC.development.name,
}); // Change to correct network

const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const addressTo = 'ADDRESS-TO-HERE';

let wallet = new ethers.Wallet(account_from.privateKey, provider);

const send = async () => {
  console.log(`Attempting to send transaction from ${wallet.address} to ${addressTo}`);

  const tx = {
    to: addressTo,
    value: ethers.parseEther('1'),
  };

  const createReceipt = await wallet.sendTransaction(tx);
  await createReceipt.wait();
  console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

send();