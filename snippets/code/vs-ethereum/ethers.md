```js
import ethers from 'ethers';

// Define the TxHash to Check Finality
const txHash = 'tx_hash';

// Define the RPC of the Provider for Moonbeam
// This can be adapted for Moonriver or Moonbase Alpha
const providerRPC = {
  moonbeam: {
    name: 'moonbeam',
    rpc: 'RPC-API-ENDPOINT-HERE',
    chainId: 1284,
  }
};

// Define the Web3 provider
const web3Provider = new ethers.providers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
  chainId: providerRPC.moonbeam.chainId,
  name: providerRPC.moonbeam.name,
});

// Define the function for the Custom Web3 Request
const customWeb3Request = async (web3Provider, method, params) => {
  try {
    return await web3Provider.send(method, params);
  } catch (error) {
    throw new Error(error.body);
  }
};

const main = async () => {
  // Get the latest finalized block of the Substrate chain
  // Uses Polkadot JSON-RPC
  const finalizedHeadHash = await customWeb3Request(web3Provider, 'chain_getFinalizedHead', []);

  // Get finalized block header to retrieve number
  // Uses Polkadot JSON-RPC
  const finalizedBlockHeader = await customWeb3Request(web3Provider, 'chain_getHeader', [
    finalizedHeadHash,
  ]);
  const finalizedBlockNumber = parseInt(finalizedBlockHeader.number, 16);

  // Get the transaction receipt of the given tx hash
  // Uses Ethereum JSON-RPC
  const txReceipt = await customWeb3Request(web3Provider, 'eth_getTransactionReceipt', [txHash]);

  // If block number of receipt is not null, compare it against finalized head
  if (txReceipt) {
    // Convert to Number
    const txBlockNumber = parseInt(txReceipt.blockNumber, 16);

    // As a safety check, get given block to check if transaction is included
    // Uses Ethereum JSON-RPC
    const txBlock = await customWeb3Request(web3Provider, 'eth_getBlockByNumber', [
      txBlockNumber,
      false,
    ]);

    console.log(`Current finalized block number is ${finalizedBlockNumber}`);
    console.log(
      `Your transaction in block ${txBlockNumber} is finalized? ${
        finalizedBlockNumber >= txBlockNumber
      }`
    );
    console.log(
      `Your transaction is indeed in block ${txBlockNumber}? ${txBlock.transactions.includes(
        txHash
      )}`
    );
  } else {
    console.log('Your transaction has not been included in the canonical chain');
  }
};

main();

```