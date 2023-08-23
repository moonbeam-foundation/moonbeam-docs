import ABI from './xcmUtilsABI.js'; // Import the XCM Utilities Precompile ABI
import Web3 from 'web3'; // Import Web3 library

const privateKey = 'INSERT_PRIVATE_KEY';
const xcmUtilsAddress = '0x000000000000000000000000000000000000080C';

/* Create Web3 provider */
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network'); // Change to network of choice

/* Create contract instance of the XCM Utilities Precompile */
const xcmUtils = new web3.eth.Contract(
  ABI,
  xcmUtilsAddress,
  { from: web3.eth.accounts.privateKeyToAccount(privateKey).address } // 'from' is necessary for gas estimation
);

const executeXcmMessageLocally = async () => {
  /* Define parameters required for the xcmExecute function */
  const encodedCalldata = 'INSERT_ENCODED_CALLDATA';
  const maxWeight = '400000000';

  /* Send the custom XCM message */
  // Craft the extrinsic
  const tx = await xcmUtils.methods.xcmExecute(encodedCalldata, maxWeight);
  // Sign transaction
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: xcmUtilsAddress,
      data: tx.encodeABI(),
      gas: await tx.estimateGas(),
    },
    privateKey
  );
  // Send the signed transaction
  const sendTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(`Transaction receipt: ${sendTx.transactionHash}`);
};

executeXcmMessageLocally();
