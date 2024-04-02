import { Web3 } from 'web3';

// Insert your RPC URL here
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');

// Replace with the address of the ERC-20 token
const tokenAddress = '0x9Aac6FB41773af877a2Be73c99897F3DdFACf576';
const tokenABI = [
  // ERC-20 ABI
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
async function getTokenMetadata() {
  try {
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.methods.name().call(),
      tokenContract.methods.symbol().call(),
      tokenContract.methods.decimals().call(),
    ]);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
  } catch (error) {
    console.error('Error fetching token metadata:', error);
  }
}
getTokenMetadata();
