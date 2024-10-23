import { ethers } from 'ethers'; // Import Ethers library

const abi = INSERT_ABI;
const privateKey = 'INSERT_PRIVATE_KEY';

// Create Ethers wallet & contract instance
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);
const xcmTransactorV3 = new ethers.Contract(
  '0x0000000000000000000000000000000000000817',
  abi,
  signer
);

// Multilocation for parachain 888
const multilocation = [
  1, // parents = 1
  [  // interior = X1 (the array has a length of 1)
    '0x0000000378', // Parachain selector + Parachain ID 888
  ],
];

const main = async () => {
  const transactInfoWithSigned = await xcmTransactorV3.transactInfoWithSigned(
    multilocation
  );
  console.log(transactInfoWithSigned);
};

main();