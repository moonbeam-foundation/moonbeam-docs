import Web3 from 'web3';
import ABI from './identityPrecompileABI.js'; // Import Identity Precompile ABI

const from = {
  privateKey: 'INSERT_PRIVATE_KEY',
  address: 'INSERT_ADDRESS',
};
const identityPrecompileAddress = '0x0000000000000000000000000000000000000818';

// Create provider
const web3 = new Web3('https://rpc.api.moonbase.moonbeam.network');

// Create interface for the Identity Precompile
const identityPrecompile = new web3.eth.Contract(
  ABI,
  identityPrecompileAddress,
  { from: from.address }
);

// Interact with the Precompile Registry
const setIdentity = async () => {
  // Assemble identity info
  const identityInfo = {
    additional: [],
    display: {
      hasData: true,
      value: '0x416c696365', // Alice in hex
    },
    legal: {
      hasData: false,
      value: '0x',
    },
    web: {
      hasData: false,
      value: '0x',
    },
    riot: {
      hasData: false,
      value: '0x',
    },
    email: {
      hasData: false,
      value: '0x',
    },
    hasPgpFingerprint: false,
    pgpFingerprint: '0x',
    image: {
      hasData: false,
      value: '0x',
    },
    twitter: {
      hasData: false,
      value: '0x',
    },
  };

  // Set the identity
  const submitIdentity = await identityPrecompile.methods.setIdentity(
    identityInfo
  );
  const sendTransaction = await web3.eth.accounts.signTransaction(
    {
      to: identityPrecompileAddress,
      data: submitIdentity.encodeABI(),
      gas: await submitIdentity.estimateGas(),
    },
    from.privateKey
  );
  // Sign and send the transaction to set the identity
  const createReceipt = await web3.eth.sendSignedTransaction(
    sendTransaction.rawTransaction
  );
  console.log(
    `Identity set. Transaction hash: ${createReceipt.transactionHash}`
  );

  // Retrieve the identity
  const identity = await identityPrecompile.methods.identity(address).call();
  console.log(`Identity is valid: ${identity[0]}`);
  console.log(`Judgements provided for this identity: ${identity[1]}`);
  console.log(`Deposit paid for this identity: ${identity[2]}`);
  console.log(`Identity information: ${identity[3]}`);
  console.log(`Display name: ${web3.utils.hexToUtf8(identity[3][1][1])}`);
};

setIdentity();
