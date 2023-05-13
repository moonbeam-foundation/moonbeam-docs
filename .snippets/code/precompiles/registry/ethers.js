import { ethers } from 'ethers'; // Import Ethers library
import ABI from './precompileRegistryABI.js'; // Import Precompile Registry ABI

const privateKey = 'INSERT_PRIVATE_KEY';

// Create Ethers provider and signer
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);

// Create interface for the Precompile Registry
const precompileRegistry = new ethers.Contract(
  '0x0000000000000000000000000000000000000815',
  ABI,
  signer
);

// Interact with the Precompile Registry
const isActivePrecompile = async () => {
  const proxyPrecompile = '0x000000000000000000000000000000000000080b';

  // Check if the Proxy Precompile is a precompile
  const isPrecompile = await precompileRegistry.isPrecompile(proxyPrecompile);
  // Should return 'Address is a precompile: true'
  console.log(`Address is a precompile: ${isPrecompile}`);

  // Check if the Proxy Precompile is an active precompile
  const isActivePrecompile = await precompileRegistry.isActivePrecompile(
    proxyPrecompile
  );
  // Should return 'Address is an active precompile: true'
  console.log(`Address is an active precompile: ${isActivePrecompile}`);
};

isActivePrecompile();