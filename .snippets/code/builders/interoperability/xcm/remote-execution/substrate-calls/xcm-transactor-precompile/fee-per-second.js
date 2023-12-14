import { ethers } from 'ethers'; // Import Ethers library

const abi = INSERT_ABI;
const privateKey = 'INSERT_PRIVATE_KEY';

// Create Ethers wallet & contract instance
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);
const xcmTransactorV2 = new ethers.Contract(
  '0x000000000000000000000000000000000000080d',
  abi,
  signer
);

// Multilocation for parachain 888's native token
const multilocation = [
  1, // parents = 1
  [  // interior = X2 (the array has a length of 2)
    '0x0000000378', // Parachain selector + Parachain ID 888
    '0x0403' // Pallet Instance selector + Pallet Instance 3
  ],
];

const main = async () => {
  const feePerSecond = await xcmTransactorV2.feePerSecond(
    multilocation
  );

  console.log(feePerSecond);
};

main();