const ethers = require('ethers');
const { abi } = require('./compile');

/*
   -- Define Provider & Variables --
*/
// Provider
const providerRPC = {
   standalone: {
      name: 'moonbeam-standalone',
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
   providerRPC.standalone.rpc,
   {
      chainId: providerRPC.standalone.chainId,
      name: providerRPC.standalone.name,
   }
); //Change to correct network

// Variables
const contractAddress = 'CONTRACT-ADDRESS-HERE';

/*
   -- Call Function --
*/
// Create Contract Instance
const incrementer = new ethers.Contract(contractAddress, abi, provider);

const get = async () => {
   console.log(`Making a call to contract at address: ${contractAddress}`);

   // Call Contract
   const data = await incrementer.number();

   console.log(`The current number stored is: ${data}`);
};

get();
