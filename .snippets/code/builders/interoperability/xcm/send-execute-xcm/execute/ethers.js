import { ethers } from 'ethers'; // Import Ethers library
import abi from './xcmUtilsABI.js'; // Import the XCM Utilities Precompile ABI

const privateKey = 'INSERT_YOUR_PRIVATE_KEY';
const xcmUtilsAddress = '0x000000000000000000000000000000000000080C';

/* Create Ethers provider and signer */
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);

/* Create contract instance of the XCM Utilities Precompile */
const xcmUtils = new ethers.Contract(
  xcmUtilsAddress,
  abi,
  signer
);

const executeXcmMessageLocally = async () => {
  /* Define parameters required for the xcmExecute function */
  const encodedCalldata = 'INSERT_ENCODED_CALLDATA';
  const maxWeight = '400000000';

  /* Execute the custom XCM message */
  const tx = await xcmUtils.xcmExecute(encodedCalldata, maxWeight);
  await tx.wait();
  console.log(`Transaction receipt: ${tx.hash}`);
};

executeXcmMessageLocally();