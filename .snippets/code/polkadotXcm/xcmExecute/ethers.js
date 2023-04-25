import abi from './xcmUtilsABI.js'; // Import the XCM Utiliies Precompile ABI
import { ethers } from 'ethers'; // Import Ethers library
const PRIVATE_KEY = 'INSERT-YOUR-PRIVATE-KEY';

// Create Ethers wallet & contract instance
const provider = new ethers.providers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const xcmUtils = new ethers.Contract(
  '0x000000000000000000000000000000000000080C', // XCM Utilities Precompile address
  abi,
  signer
);

const executeXcmMessageLocally = async () => {
  // Define parameters required for the xcmExecute function
  const encodedCalldata =
    '0x020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0';
  const maxWeight = '1000000000';

  // Execute the custom XCM message
  const tx = await xcmUtils.xcmExecute(encodedCalldata, maxWeight);
  await tx.wait();
  console.log(`Transaction receipt: ${tx.hash}`);
};

executeXcmMessageLocally();