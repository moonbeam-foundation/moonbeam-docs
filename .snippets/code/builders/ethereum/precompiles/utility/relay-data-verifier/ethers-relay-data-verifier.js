// For reading local ABI file
import * as fs from 'fs';
// Import Ethers library, to interact with Moonbeam networks
import { ethers } from 'ethers';
// Import Polkadot library, to interact with relay chain
import { ApiPromise, WsProvider } from '@polkadot/api';

const abi = JSON.parse(fs.readFileSync('./RelayChainDataVerifierABI.json'));
const privateKey = 'INSERT_PRIVATE_KEY';
const precompileAddress = '0x0000000000000000000000000000000000000819';
const moonbeamURL = 'https://rpc.api.moonbase.moonbeam.network';
const relayURL = 'wss://relay.api.moonbase.moonbeam.network';

// Create Ethers provider and signer
const provider = new ethers.JsonRpcProvider(moonbeamURL);
const signer = new ethers.Wallet(privateKey, provider);
const precompileContract = new ethers.Contract(precompileAddress, abi, signer);

async function run() {
  // Create provider for relay chain
  const wsProvider = new WsProvider(relayURL);
  const api = await ApiPromise.create({ provider: wsProvider });

  // Get the storage key for a random account on relay chain
  const key = api.query.system.account.key(
    '5CBATpb3yvEM4mhX9Dw3tyuqiWKhq9YBG6ugSbodRUSbodoU'
  );
  // Find the latest available relay chain block number from Moonbeam
  const blockNum = await precompileContract.latestRelayBlockNumber();

  // Get the block hash and storage proof from relay chain
  const blockHash = await api.rpc.chain.getBlockHash(blockNum);
  const proof = await api.rpc.state.getReadProof([key], blockHash);

  // This tx will be rejected if the verification failed
  const receipt = await precompileContract.verifyEntry(blockNum, proof, key);
  await receipt.wait();
  console.log(receipt.hash);
}

await run();
