import { Web3 } from 'web3';
import ABI from './precompileRegistryABI.js'; // Import Precompile Registry ABI

const privateKey = 'INSERT_PRIVATE_KEY';

// Create provider
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');

// Create interface for the Precompile Registry
const precompileRegistry = new web3.eth.Contract(
  ABI,
  '0x0000000000000000000000000000000000000815',
  { from: web3.eth.accounts.privateKeyToAccount(privateKey).address }
);

// Interact with the Precompile Registry
const isActivePrecompile = async () => {
  const proxyPrecompile = '0x000000000000000000000000000000000000080b';

  // Check if the Proxy Precompile is a precompile
  const isPrecompile = await precompileRegistry.methods.isPrecompile(
    proxyPrecompile
  ).call();
  // Should return 'Address is a precompile: true'
  console.log(`Address is a precompile: ${isPrecompile}`);

  // Check if the Proxy Precompile is an active precompile
  const isActivePrecompile =
    await precompileRegistry.methods.isActivePrecompile(proxyPrecompile).call();
  // Should return 'Address is an active precompile: true'
  console.log(`Address is a precompile: ${isActivePrecompile}`);
};

isActivePrecompile();