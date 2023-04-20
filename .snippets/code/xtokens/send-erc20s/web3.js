import abi from './xtokensABI.js'; // Import the x-tokens ABI
import Web3 from 'web3'; // Import Web3 library

const PRIVATE_KEY = 'YOUR_PRIVATE_KEY_HERE';

// Create Web3 wallet & contract instance
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network'); // Change to network of choice
const xTokens = new web3.eth.Contract(
  abi,
  '0x0000000000000000000000000000000000000804',
  { from: web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address } // 'from' is necessary for gas estimation
);

// ERC-20 contract address in Moonbase Alpha
const ERC20_ADDRESS = 'INSERT-ERC20-ADDRESS';

// Multilocation targeting an account on the relay chain from Moonbase Alpha
// Example interior: 0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300
const RELAY_ACC = [1, ['0x01' + 'INSERT-ADDRESS-32-BYTES' + '00']];

// Sends 1 ERC-20 token to the relay chain using the transfer function
async function transferToRelayChainAccount() {
  // Create transaction
  const transferTx = xTokens.methods.transfer(
    ERC20_ADDRESS, // Asset
    '1000000000000000000', // Amount
    RELAY_ACC, // Destination
    '4000000000' // Weight
  );

  // Sign transaction
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: '0x0000000000000000000000000000000000000804',
      data: transferTx.encodeABI(),
      gas: await transferTx.estimateGas(),
    },
    PRIVATE_KEY
  );

  // Send signed transaction
  const sendTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(sendTx);
}

transferToRelayChainAccount();
