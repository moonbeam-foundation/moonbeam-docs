import { ethers } from 'ethers'; // Import Ethers library

const abi = INSERT_ABI;
const privateKey = 'INSERT_PRIVATE_KEY';

// Create Ethers provider and signer
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);
// Create contract instance
const xcmTransactorV2 = new ethers.Contract(
  '0x000000000000000000000000000000000000080d',
  abi,
  signer
);

// Arguments for the transactThroughSigned function
const dest = [
  1, // parents = 1
  [
    // interior = X1 (the array has a length of 1)
    '0x0000000378', // Parachain selector + Parachain ID 888
  ],
];
const feeLocationAddress = '0xFFFFFFFF1AB2B146C526D4154905FF12E6E57675';
const transactRequiredWeightAtMost = 1000000000n;
const call = '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
const feeAmount = 50000000000000000n;
const overallWeight = 2000000000n;

// Sends 1 token to Alice's account on parachain 888
async function transactThroughSigned() {
  // Creates, signs, and sends the transfer transaction
  const transaction = await xcmTransactorV2.transactThroughSigned(
    dest,
    feeLocationAddress,
    transactRequiredWeightAtMost,
    call,
    feeAmount,
    overallWeight
  );

  // Waits for the transaction to be included in a block
  await transaction.wait();
  console.log(transaction);
}

transactThroughSigned();
