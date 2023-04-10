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

const sendXcm = async () => {
  // Define parameters required for the xcmSend function
  const encodedCalldata =
    '0x020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67';
  const dest = [
    1, // Parents: 1 
    [] // Interior: Here
  ];

  // Send the custom XCM message
  const tx = await xcmUtils.xcmSend(dest, encodedCalldata);
  await tx.wait();
  console.log(`Transaction receipt: ${tx.hash}`);
};

sendXcm();