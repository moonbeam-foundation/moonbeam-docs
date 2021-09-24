```js
import Web3 from 'web3';

// Define the TxHash to Check Finality
const txHash = 'tx_hash';

// Define the Web3 provider
const web3 = new Web3('https://rpc.moonriver.moonbeam.network');

// Define the function for the Custom Web3 Request
const customWeb3Request = async (web3Provider, method, params) => {
  try {
    return await requestPromise(web3Provider, method, params);
  } catch (error) {
    throw new Error(error);
  }
};

// In Web3.js we need to return a promise
const requestPromise = async (web3Provider, method, params) => {
  return new Promise((resolve, reject) => {
    web3Provider.send(
      {
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      },
      (error, result) => {
        if (error) {
          reject(error.message);
        } else {
          if (result.error) {
            reject(result.error.message);
          }
          resolve(result);
        }
      }
    );
  });
};

const main = async () => {
  // Get the latest finalized block of the Substrate chain
  // Uses Polkadot JSON-RPC
  const finalizedHeadHash = await customWeb3Request(
    web3.currentProvider,
    'chain_getFinalizedHead',
    []
  );

  // Get finalized block header to retrieve number
  // Uses Polkadot JSON-RPC
  const finalizedBlockHeader = await customWeb3Request(web3.currentProvider, 'chain_getHeader', [
    finalizedHeadHash.result,
  ]);
  const finalizedBlockNumber = parseInt(finalizedBlockHeader.result.number, 16);

  // Get the transaction receipt of the given tx hash
  // Uses Ethereum JSON-RPC
  const txReceipt = await customWeb3Request(web3.currentProvider, 'eth_getTransactionReceipt', [
    txHash,
  ]);

  // As a safety check, get given block to check if transaction is included
  // Uses Ethereum JSON-RPC
  const txBlock = await customWeb3Request(web3.currentProvider, 'eth_getBlockByNumber', [
    txReceipt.result.blockNumber,
    false,
  ]);

  // If block number of receipt is not null, compare it against finalized head
  if (txReceipt) {
    // Convert to Number
    const txBlockNumber = parseInt(txReceipt.result.blockNumber, 16);

    console.log(`Current finalized block number is ${finalizedBlockNumber}`);
    console.log(
      `Your transaction in block ${txBlockNumber} is finalized? ${
        finalizedBlockNumber >= txBlockNumber
      }`
    );
    console.log(
      `Your transaction in indeed in block ${txBlockNumber}? ${txBlock.result.transactions.includes(
        txHash
      )}`
    );
  } else {
    console.log('Your transaction has not been included in the canonical chain');
  }
};

main();
```