import { ethers } from 'ethers';
import abi from './callPermitABI.js'

const providerRPC = {
  moonbeam: {
    name: 'moonbeam',
    rpc: 'RPC-API-ENDPOINT-HERE', // Insert your RPC URL here
    chainId: 1284, // 0x504 in hex,
  },
};
const provider = new ethers.JsonRpcProvider(
  providerRPC.moonbeam.rpc, 
  {
    chainId: providerRPC.moonbeam.chainId,
    name: providerRPC.moonbeam.name,
  }
);

// Insert your own signer logic or use the following for testing purposes.
// For demo purposes only. Never store your private keys in a JavaScript file
const userSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
const thirdPartyGasSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);

const domain = {
  name: 'Call Permit Precompile',
  version: '1',
  chainId: 1284,
  verifyingContract: '0x000000000000000000000000000000000000080a',
}

const types = {
  CallPermit: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    { name: 'gaslimit', type: 'uint64' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
}

const callPermit = new ethers.Contract(
  '0x000000000000000000000000000000000000080a', 
  abi, 
  thirdPartyGasSigner
);

const nonce = await callPermit.nonces(userSigner.address);

const message = {
  from: userSigner.address,
  to: '0xccB3707967dDcFA47b19f5AEEfe7764a5e0E43cC', // Crew for Coin V1 contract address
  value: 0,
  data: '0x1ad124830000000000000000000000004634ba8bb97a82a809161ea595f95a1fa1255bff0000000000000000000000000000000000000000000000000000000000000436',
  gaslimit: 100000,
  nonce,
  deadline: '1680587122996', // Randomly created deadline in the future
};

const signature = await userSigner.signTypedData(
    domain,
    types,
    message
)
console.log(`Signature hash: ${signature}`);

const ethersSignature = ethers.Signature.from(signature);

// This gets dispatched using the dApps signer
const dispatch = await callPermit.dispatch(
    message.from,
    message.to,
    message.value,
    message.data,
    message.gaslimit,
    message.deadline,
    ethersSignature.v,
    ethersSignature.r,
    ethersSignature.s,
  )
  
  await dispatch.wait();
  console.log(`Transaction hash: ${dispatch.hash}`);