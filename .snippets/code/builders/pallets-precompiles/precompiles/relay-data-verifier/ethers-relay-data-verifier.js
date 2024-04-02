import * as fs from 'fs'; // For reading local ABI file
import { ethers } from 'ethers'; // Import Ethers library, to interact with Moonbeam networks
import { ApiPromise, WsProvider } from '@polkadot/api';; // Import Polkadot library, to interact with relay chain

var ABI= JSON.parse(fs.readFileSync('./RelayChainDataVerifierABI.json'));
const privateKey = 'INSERT_PRIVATE_KEY';
const precompileAddress = '0x0000000000000000000000000000000000000819';
const moonbeamURL = 'https://rpc.api.moonbase.moonbeam.network';
const relayURL = 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network';

// Create Ethers provider and signer
const provider = new ethers.JsonRpcProvider(moonbeamURL);
const signer = new ethers.Wallet(privateKey, provider);
const precompileContract = new ethers.Contract(
    precompileAddress,
    ABI,
    signer
);

// Create provider for relay chain
const wsProvider = new WsProvider(relayURL);
const api = await ApiPromise.create({ provider: wsProvider });

async function run(){
  // Get the storage key for a random account on relay chain
  let key = await api.query.system.account.key(
    '5CBATpb3yvEM4mhX9Dw3tyuqiWKhq9YBG6ugSbodRUSbodoU'
  )
  // Find the latest available block number(relay chain) from moonbeam
  let blockNum = await precompileContract.latestRelayBlockNumber()

  // Get the blockHash and storage proof from relay chain
  let blockHash = await api.rpc.chain.getBlockHash(blockNum);
  let proof = await api.rpc.state.getReadProof([key],blockHash);
  
  // This tx will be rejected if the verification failed
  await precompileContract.verifyEntry(blockNum, proof, key)
}

await run();