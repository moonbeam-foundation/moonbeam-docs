import { ethers } from 'ethers';

const providerRPC = {
  moonbase: {
    name: 'moonbase',
    rpc: 'https://rpc.api.moonbase.moonbeam.network', // Insert your RPC URL here
    chainId: 1287, // 0x507 in hex,
  },
};

const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
  chainId: providerRPC.moonbase.chainId,
  name: providerRPC.moonbase.name,
});

// Replace with the address of the ERC-20 token
const tokenAddress = '0x9Aac6FB41773af877a2Be73c99897F3DdFACf576';
const tokenABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
];

const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
async function getTokenMetadata() {
  try {
    const [name, symbol, decimals] = await Promise.all([
      tokenContract.name(),
      tokenContract.symbol(),
      tokenContract.decimals(),
    ]);
    console.log(`Name: ${name}`);
    console.log(`Symbol: ${symbol}`);
    console.log(`Decimals: ${decimals}`);
  } catch (error) {
    console.error('Error fetching token metadata:', error);
  }
}
getTokenMetadata();
