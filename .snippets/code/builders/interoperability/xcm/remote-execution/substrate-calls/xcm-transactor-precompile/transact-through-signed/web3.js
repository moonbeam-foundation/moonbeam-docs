import Web3 from 'web3'; // Import Web3 library

const abi = INSERT_ABI;
const privateKey = 'INSERT_PRIVATE_KEY';

// Create Web3 provider
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network'); // Change to network of choice

// Create contract instance
const xcmTransactorV2 = new web3.eth.Contract(
  abi,
  '0x000000000000000000000000000000000000080d',
  { from: web3.eth.accounts.privateKeyToAccount(privateKey).address } // 'from' is necessary for gas estimation
);

// Arguments for the transactThroughSigned function
const dest = [
  1, // parents = 1
  [
    // interior = X1 (the array has a length of 1)
    '0x0000000378', // Parachain selector + Parachain ID 888
  ],
];
const feeLocationAddress = '0xFFFFFFFF1AB2B146C526D4154905FF12E6E57675';
const transactRequiredWeightAtMost = 1000000000n;
const call = '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
const feeAmount = 50000000000000000n;
const overallWeight = 2000000000n;

// Sends 1 token to Alice's account on parachain 888
async function transactThroughSigned() {
  // Create transaction
  const transferTx = xcmTransactorV2.methods.transactThroughSigned(
    dest,
    feeLocationAddress,
    transactRequiredWeightAtMost,
    call,
    feeAmount,
    overallWeight
  );

  // Sign transaction
  const signedTx = await web3.eth.accounts.signTransaction(
    {
      to: '0x000000000000000000000000000000000000080d',
      data: transferTx.encodeABI(),
      gas: await transferTx.estimateGas(),
    },
    privateKey
  );

  // Send signed transaction
  const sendTx = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(sendTx);
}

transactThroughSigned();
