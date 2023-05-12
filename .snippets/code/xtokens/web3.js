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

// xcUNIT address in Moonbase Alpha
const xcUNIT_ADDRESS = '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080';

// Multilocation targeting Alice's account on the relay chain from Moonbase Alpha
const ALICE_RELAY_ACC = [
  1,
  ['0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'],
];

// Sends 1 xcUNIT to the relay chain using the transfer function
async function transferToAlice() {
  // Create transaction
  const transferTx = xTokens.methods.transfer(
    xcUNIT_ADDRESS, // Asset
    '1000000000000', // Amount
    ALICE_RELAY_ACC, // Destination
    '1000000000' // Weight
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

// Multilocation targeting the relay chain or its asset from a parachain
const RELAY_CHAIN_ASSET = [1, []];

// Sends 1 xcUNIT to the relay chain using the transferMultiasset function
async function transferMultiassetToAlice() {
  const transferTx = xTokens.methods.transferMultiasset(
    RELAY_CHAIN_ASSET, // Asset
    '1000000000000', // Amount
    ALICE_RELAY_ACC, // Destination
    '1000000000' // Weight
  );
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: '0x0000000000000000000000000000000000000804',
      data: transferTx.encodeABI(),
      gas: await transferTx.estimateGas(),
    },
    PRIVATE_KEY
  );
  const sendTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(sendTx);
}

transferToAlice();
transferMultiassetToAlice();

// Here are some additional multilocations for the Asset multilocation:
const LOCAL_ASSET = [0, ['0x0424', '0x05FD9D0BF45A2947A519A741C4B9E99EB6']]; // Note that 0x0424 indicates the x-tokens pallet
const DEV_FROM_OTHER_PARACHAIN = [1, ['0x00000003E8', '0x0403']]; // Use if you were targeting DEV from a non-Moonbeam network

// Here are some additional multilocations for the Destination multilocation:
const ADDRESS32_OF_PARACHAIN = [
  1,
  [
    '0x00000007EF',
    '0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300',
  ],
];
const ADDRESS20_FROM_PARACHAIN_TO_MOONBASE = [
  1,
  ['0x00000003E8', '0x03f24FF3a9CF04c71Dbc94D0b566f7A27B94566cac00'],
];
