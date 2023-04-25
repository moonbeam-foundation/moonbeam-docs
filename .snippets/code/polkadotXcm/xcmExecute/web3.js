import abi from './xcmUtilsABI.js'; // Import the XCM Utiliies Precompile ABI
import Web3 from 'web3'; // Import Web3 library
const PRIVATE_KEY = 'INSERT-YOUR-PRIVATE-KEY';
const xcmUtilsAddress = '0x000000000000000000000000000000000000080C';

// Create Web3 wallet & contract instance
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network'); // Change to network of choice
const xcmUtils = new web3.eth.Contract(
  abi,
  xcmUtilsAddress,
  { from: web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address } // 'from' is necessary for gas estimation
);

const executeXcmMessageLocally = async () => {
  // Define parameters required for the xcmExecute function
  const encodedCalldata =
    '0x020800040000010403001300008a5d784563010d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0';
  const maxWeight = '1000000000';

  // Create transaction
  const tx = await xcmUtils.methods.xcmExecute(encodedCalldata, maxWeight);

  // Sign transaction
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: xcmUtilsAddress,
      data: tx.encodeABI(),
      gas: await tx.estimateGas(),
    },
    PRIVATE_KEY
  );

  // Send the signed transaction
  const sendTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction receipt: ${sendTx.transactionHash}`);
};

executeXcmMessageLocally();