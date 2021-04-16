const ethers = require('ethers');

/*
   -- Define Provider & Variables --
*/
// Provider
const providerRPC = {
   development: {
      name: 'moonbeam-development',
      rpc: 'http://localhost:9933',
      chainId: 1281,
   },
   moonbase: {
      name: 'moonbase-alpha',
      rpc: 'https://rpc.testnet.moonbeam.network',
      chainId: 1287,
   },
};
const provider = new ethers.providers.StaticJsonRpcProvider(
   providerRPC.development.rpc,
   {
      chainId: providerRPC.development.chainId,
      name: providerRPC.development.name,
   }
); //Change to correct network

// Variables
const account_from = {
   privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const addressTo = 'ADDRESS-TO-HERE';

// Create Wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

/*
   -- Create and Deploy Transaction --
*/
const send = async () => {
   console.log(
      `Attempting to send transaction from ${wallet.address} to ${addressTo}`
   );

   // Create Tx Object
   const tx = {
      to: addressTo,
      value: ethers.utils.parseEther('1'),
   };

   // Sign and Send Tx - Wait for Receipt
   const createReceipt = await wallet.sendTransaction(tx);
   await createReceipt.wait();
   console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

send();
