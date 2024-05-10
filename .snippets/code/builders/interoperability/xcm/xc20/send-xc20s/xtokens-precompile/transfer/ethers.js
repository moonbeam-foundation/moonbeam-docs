import { ethers } from 'ethers'; // Import Ethers library
import abi from './xtokensABI.js'; // Import the X-Tokens ABI

const privateKey = 'INSERT_PRIVATE_KEY';

// Create Ethers provider and signer
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);

// Create X-Tokens contract instance
const xTokens = new ethers.Contract(
  '0x0000000000000000000000000000000000000804',
  abi,
  signer
);

// Arguments for the transfer function
const currencyAddress = '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080'; // xcUNIT address
const amount = 1000000000000;
const destination = [
  // Target the relay chain from Moonbase Alpha
  1,
  // Target Alice's 32-byte relay chain account
  ['0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'],
];
const weight = 305986000;

// Sends 1 xcUNIT to the relay chain using the transfer function
async function transferToAlice() {
  // Creates, signs, and sends the transfer transaction
  const transaction = await xTokens.transfer(
    currencyAddress,
    amount,
    destination,
    weight
  );

  // Waits for the transaction to be included in a block
  await transaction.wait();
  console.log(transaction);
}

transferToAlice();
