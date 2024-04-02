import { ethers } from 'ethers'; // Import Ethers library

const privateKey = 'INSERT_PRIVATE_KEY';
const abi = 'INSERT_PRECOMPILE_REGISTRY_ABI';
const xc20Address = 'INSERT_XC_20_PRECOMPILE_ADDRESS';
const registryAddress = '0x0000000000000000000000000000000000000815';

// Create Ethers provider and signer
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);

// Create interface for the Precompile Registry
const precompileRegistry = new ethers.Contract(registryAddress, abi, signer);

const updateAccountCode = async () => {
  // Update the precompile bytecode
  await precompileRegistry.updateAccountCode(xc20Address);

  // Check the precompile bytecode
  const bytecode = await provider.getCode(xc20Address);
  console.log(`The XC-20 precompile's bytecode is: ${bytecode}`);
};

updateAccountCode();
