import abi from './xTokensABI.js'; // Import the x-tokens ABI
import { ethers } from 'ethers'; // Import Ethers library

const PRIVATE_KEY = 'INSERT-PRIVATE-KEY';

// Create Ethers wallet & contract instance
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const xTokens = new ethers.Contract(
  '0x0000000000000000000000000000000000000804',
  abi,
  signer
);

// ERC-20 contract address in Moonbase Alpha
const ERC20_ADDRESS = 'INSERT-ERC20-ADDRESS';

// Multilocation targeting an account on the relay chain from Moonbase Alpha
// Example interior: 0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300
const RELAY_ACC = [
  1,
  ['0x01' + 'INSERT-ADDRESS-32-BYTES' + '00'],
];

// Sends 1 ERC-20 token to the relay chain using the transfer function
async function transferToRelayChainAccount() {
  // Creates, signs, and sends the transfer transaction
  const transaction = await xTokens.transfer(
    ERC20_ADDRESS, // Asset
    '1000000000000000000', // Amount
    RELAY_ACC, // Destination
    '4000000000' // Weight
  );

  // Waits for the transaction to be included in a block
  await transaction.wait();
  console.log(transaction);
}

transferToRelayChainAccount();
