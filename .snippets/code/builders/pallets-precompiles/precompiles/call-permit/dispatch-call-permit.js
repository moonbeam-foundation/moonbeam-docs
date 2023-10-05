import { ethers } from 'ethers';
import abi from './callPermitABI.js';
import cartographerAbi from './cartographerAbi.js';

const providerRPC = {
  moonbeam: {
    name: 'moonbeam',
    rpc: 'RPC-API-ENDPOINT-HERE', // Insert your RPC URL here
    chainId: 1284, // 0x504 in hex,
  },
};
const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
  chainId: providerRPC.moonbeam.chainId,
  name: providerRPC.moonbeam.name,
});

// Insert your own signer logic or use the following for testing purposes.
// For demo purposes only. Never store your private keys in a JavaScript file
const userSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
const thirdPartyGasSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);

const domain = {
  name: 'Call Permit Precompile',
  version: '1',
  chainId: 1284,
  verifyingContract: '0x000000000000000000000000000000000000080a',
};

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
};

const cartographerInterface = new ethers.Interface(cartographerAbi);
const data = cartographerInterface.encodeFunctionData('buyVoyages', [
  0n, // Voyage type: Easy
  1n, // Number of voyages to buy
  '0x72A33394f0652e2Bf15d7901f3Cd46863d968424', // Voyage V2 contract
]);

const gasEstimate = await provider.estimateGas({
  from: userSigner.address,
  to: '0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138', // Cartographer V1 contraact
  data,
})

const callPermit = new ethers.Contract(
  '0x000000000000000000000000000000000000080a', // Call Permit contract
  abi, 
  thirdPartyGasSigner
);

const nonce = await callPermit.nonces(userSigner.address);

const message = {
  from: userSigner.address,
  to: '0xD1A9bA3e61Ac676f58B29EA0a09Cf5D7f4f35138', // Cartographer V1 contract
  value: 0,
  data,
  gaslimit: gasEstimate + 50000n,
  nonce,
  deadline: '1714762357000', // Randomly created deadline in the future
};

const signature = await userSigner.signTypedData(domain, types, message);
console.log(`Signature hash: ${signature}`);

const formattedSignature = ethers.Signature.from(signature);

// This gets dispatched using the dApps signer
const dispatch = await callPermit.dispatch(
  message.from,
  message.to,
  message.value,
  message.data,
  message.gaslimit,
  message.deadline,
  formattedSignature.v,
  formattedSignature.r,
  formattedSignature.s
);

await dispatch.wait();
console.log(`Transaction hash: ${dispatch.hash}`);
