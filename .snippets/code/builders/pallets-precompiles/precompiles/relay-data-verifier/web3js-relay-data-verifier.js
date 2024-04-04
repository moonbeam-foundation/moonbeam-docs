// For reading local ABI file
import * as fs from 'fs';
// Import web3js library, to interact with Moonbeam networks
import { Web3 } from 'web3';
// Import Polkadot library, to interact with relay chain
import { ApiPromise, WsProvider } from '@polkadot/api';
import { constants } from 'os';

const abi = JSON.parse(fs.readFileSync('./RelayChainDataVerifierABI.json'));
const privateKey = 'INSERT_PRIVATE_KEY';
const precompileAddress = '0x0000000000000000000000000000000000000819';
const moonbeamURL = 'https://rpc.api.moonbase.moonbeam.network';
const relayURL = 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network';

// Create Web3js provider and signer
const web3 = new Web3(moonbeamURL);
const precompileContract = new web3.eth.Contract(abi, precompileAddress)

const account = web3.eth.accounts.privateKeyToAccount(privateKey);

async function run() {
    // Create provider for relay chain
    const wsProvider = new WsProvider(relayURL);
    const api = await ApiPromise.create({ provider: wsProvider });

    // Get the storage key for a random account on relay chain
    const key = api.query.system.account.key(
        '5CBATpb3yvEM4mhX9Dw3tyuqiWKhq9YBG6ugSbodRUSbodoU'
    )
    // Find the latest available block number(relay chain) from moonbeam
    const blockNum = await precompileContract.methods.latestRelayBlockNumber().call()

    // Get the blockHash and storage proof from relay chain
    const blockHash = await api.rpc.chain.getBlockHash(blockNum);
    const proof = await api.rpc.state.getReadProof([key], blockHash);

    const callObject = {
        to: precompileAddress,
        data: precompileContract.methods.verifyEntry(blockNum, proof, key).encodeABI(),
        gas: await precompileContract.methods.verifyEntry(blockNum, proof, key).estimateGas(),
        gasPrice: await web3.eth.getGasPrice(),
        nonce: await web3.eth.getTransactionCount(account.address),
    }

    // This tx will be rejected if the verification failed
    const tx = await web3.eth.accounts.signTransaction(callObject, account.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction)
    console.log(receipt.transactionHash)

}

await run();