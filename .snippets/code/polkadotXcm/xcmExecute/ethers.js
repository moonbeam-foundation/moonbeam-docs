import abi from './xcmUtilsABI.js'; // Import the XCM Utiliies Precompile ABI
import { ethers } from 'ethers'; // Import Ethers library
const PRIVATE_KEY = 'INSERT-YOUR-PRIVATE-KEY';

/* Create Ethers provider and signer */
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

/* Create contract instance of the XCM Utilities Precompile */
const xcmUtils = new ethers.Contract(
  '0x000000000000000000000000000000000000080C', // XCM Utilities Precompile address
  abi,
  signer
);

const executeXcmMessageLocally = async () => {
  /* Define parameters required for the xcmExecute function */
  const encodedCalldata = 'INSERT-ENCODED-CALLDATA';
  const maxWeight = '100000000000';

  /* Execute the custom XCM message */
  const tx = await xcmUtils.xcmExecute(encodedCalldata, maxWeight);
  await tx.wait();
  console.log(`Transaction receipt: ${tx.hash}`);
};

executeXcmMessageLocally();