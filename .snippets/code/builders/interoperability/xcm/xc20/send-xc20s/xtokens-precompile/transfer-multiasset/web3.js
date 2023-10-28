import ABI from './xtokensABI.js'; // Import the X-Tokens ABI
import Web3 from 'web3'; // Import Web3 library

const privateKey = 'INSERT_PRIVATE_KEY';

// Create Web3 provider
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network'); // Change to network of choice

// Create contract instance
const xTokens = new web3.eth.Contract(
  ABI,
  '0x0000000000000000000000000000000000000804',
  { from: web3.eth.accounts.privateKeyToAccount(privateKey).address } // 'from' is necessary for gas estimation
);

// Arguments for the transfer multiasset function
const asset = [1, []]; // Multilocation targeting the relay chain
const amount = 1000000000000;
const dest = [
  // Target the relay chain from Moonbase Alpha
  1,
  // Target Alice's 32-byte relay chain account
  ['0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'],
];
const weight = 304217000;

// Sends 1 xcUNIT to the relay chain using the transferMultiasset function
async function transferMultiassetToAlice() {
  // Create transaction
  const transferTx = xTokens.methods.transferMultiasset(
    asset,
    amount,
    dest,
    weight
  );

  // Sign transaction
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: '0x0000000000000000000000000000000000000804',
      data: transferTx.encodeABI(),
      gas: await transferTx.estimateGas(),
    },
    privateKey
  );

  // Send signed transaction
  const sendTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(sendTx);
}

transferMultiassetToAlice();