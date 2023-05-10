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

const sendXcm = async () => {
  // Define parameters required for the xcmSend function
  const encodedCalldata =
    '0x020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67';
  const dest = [
    1, // Parents: 1 
    [] // Interior: Here
  ];


  // Create transaction
  const tx = await xcmUtils.methods.xcmSend(dest, encodedCalldata);

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

sendXcm();