import { Web3 } from 'web3';

const privateKey = 'INSERT_PRIVATE_KEY';
const abi = 'INSERT_PRECOMPILE_REGISTRY_ABI';
const xc20Address = 'INSERT_XC_20_PRECOMPILE_ADDRESS';
const registryAddress = '0x0000000000000000000000000000000000000815';

// Create provider
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');

// Create interface for the Precompile Registry
const precompileRegistry = new web3.eth.Contract(abi, registryAddress, {
  from: web3.eth.accounts.privateKeyToAccount(privateKey).address,
});

const updateAccountCode = async () => {
  // Update the precompile bytecode
  await precompileRegistry.methods.updateAccountCode(xc20Address).call();

  // Check the precompile bytecode
  const bytecode = await web3.eth.getCode(xc20Address);
  console.log(`The XC-20 precompile's bytecode is: ${bytecode}`);
};

updateAccountCode();
