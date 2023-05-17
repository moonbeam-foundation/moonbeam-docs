import Web3 from 'web3';

// Define the transaction hash to check finality
const txHash = 'INSERT_TX_HASH';

// Define the Web3 provider for Moonbeam
// This can be adapted for Moonriver or Moonbase Alpha
const web3Provider = new Web3('INSERT_RPC_API_ENDPOINT');

const main = async () => {
  // Get the last finalized block
  const finalizedBlockHeader = await web3Provider.eth.getBlock('finalized');
  const finalizedBlockNumber = finalizedBlockHeader.number;

  // Get the transaction receipt of the given transaction hash
  const txReceipt = await web3Provider.eth.getTransactionReceipt(txHash);

  // If block number of receipt is not null, compare it against finalized head
  if (txReceipt) {
    const txBlockNumber = txReceipt.blockNumber;

    // As a safety check, get given block to check if transaction is included
    const txBlock = await web3Provider.eth.getBlock(txBlockNumber);

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
    console.log(
      'Your transaction has not been included in the canonical chain'
    );
  }
};

main();
