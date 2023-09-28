import { ethers } from 'ethers'; // Import Ethers library
import ABI from './identityPrecompileABI.js'; // Import Identity Precompile ABI

const privateKey = 'INSERT_PRIVATE_KEY';
const identityPrecompileAddress = '0x0000000000000000000000000000000000000818';

// Create Ethers provider and signer
const provider = new ethers.JsonRpcProvider(
  'https://rpc.api.moonbase.moonbeam.network'
);
const signer = new ethers.Wallet(privateKey, provider);

// Create interface for the Identity Precompile
const identityPrecompile = new ethers.Contract(
  identityPrecompileAddress,
  IDENTITY_ABI,
  signer
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
  const submitIdentity = await identityPrecompile.setIdentity(identityInfo);
  console.log(`Identity set. Transaction hash: ${submitIdentity.hash}`);

  // Retrieve the identity
  const identity = await identityPrecompile.identity(signer.address);
  console.log(`Identity is valid: ${identity[0]}`);
  console.log(`Judgements provided for this identity: ${identity[1]}`);
  console.log(`Deposit paid for this identity: ${identity[2]}`);
  console.log(`Identity information: ${identity[3]}`);
  console.log(`Display name: ${ethers.toUtf8String(identity[3][1][1])}`);
};

setIdentity();
