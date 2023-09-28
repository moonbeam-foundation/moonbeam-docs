import ABI from './xtokensABI.js'; // Import the X-Tokens ABI
import { ethers } from 'ethers'; // Import Ethers library

const privateKey = 'INSERT_PRIVATE_KEY';

// Create Ethers wallet & contract instance
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);
const xTokens = new ethers.Contract(
  '0x0000000000000000000000000000000000000804',
  ABI,
  signer
);

// xcUNIT address in Moonbase Alpha
const xcUnitAddress = '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080';

// Multilocation targeting Alice's account on the relay chain from Moonbase Alpha
const aliceRelayAccount = [
  1,
  ['0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'],
];

// Sends 1 xcUNIT to the relay chain using the transfer function
async function transferToAlice() {
  // Creates, signs, and sends the transfer transaction
  const transaction = await xTokens.transfer(
    xcUnitAddress,       // Asset
    '1000000000000',     // Amount
    aliceRelayAccount,   // Destination
    '1000000000'         // Weight
  );

  // Waits for the transaction to be included in a block
  await transaction.wait();
  console.log(transaction);
}

// Multilocation targeting the relay chain or its asset from a parachain
const relayChainAsset = [1, []];

// Sends 1 xcUNIT to the relay chain using the transferMultiasset function
async function transferMultiassetToAlice() {
  const transaction = await xTokens.transferMultiasset(
    relayChainAsset,     // Asset
    '1000000000000',     // Amount
    aliceRelayAccount,   // Destination
    '1000000000'         // Weight
  );
  await transaction.wait();
  console.log(transaction);
}

transferToAlice();
transferMultiassetToAlice();

// Here are some additional multilocations for the Asset multilocation:
const localAsset = [0, ['0x0424', '0x05FD9D0BF45A2947A519A741C4B9E99EB6']]; // Note that 0x0424 indicates the x-tokens pallet
const devFromOtherParachain = [1, ['0x00000003E8', '0x0403']]; // Use if you were targeting DEV from a non-Moonbeam network

// Here are some additional multilocations for the Destination multilocation:
const address32OfParachain = [
  1,
  [
    '0x00000007EF',
    '0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300',
  ],
];
const address20FromParachainToMoonbase = [
  1,
  ['0x00000003E8', '0x03f24FF3a9CF04c71Dbc94D0b566f7A27B94566cac00'],
];
