import { ApiPromise, WsProvider } from '@polkadot/api';
import { types } from 'moonbeam-types-bundle';

// Define the transaction hash to check finality
const txHash = 'INSERT_TX_HASH';

// Define the provider for Moonbeam
// This can be adapted for Moonriver or Moonbase Alpha
const wsProvider = new WsProvider('INSERT_WSS_API_ENDPOINT');

const main = async () => {
  // Create the provider using Moonbeam types
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider,
    typesBundle: types,
  });
  await polkadotApi.isReady;

  // Get the latest finalized block of the Substrate chain
  const finalizedHeadHash = (
    await polkadotApi.rpc.chain.getFinalizedHead()
  ).toJSON();

  // Get finalized block header to retrieve number
  const finalizedBlockHeader = (
    await polkadotApi.rpc.chain.getHeader(finalizedHeadHash)
  ).toJSON();

  // Get the transaction receipt of the given tx hash
  const txReceipt = (
    await polkadotApi.rpc.eth.getTransactionReceipt(txHash)
  ).toJSON();

  // You can not verify if the tx is in the block because polkadotApi.rpc.eth.getBlockByNumber
  // does not return the list of tx hashes

  // If block number of receipt is not null, compare it against finalized head
  if (txReceipt) {
    console.log(
      `Current finalized block number is ${finalizedBlockHeader.number}`
    );
    console.log(
      `Your transaction in block ${txReceipt.blockNumber} is finalized? ${
        finalizedBlockHeader.number >= txReceipt.blockNumber
      }`
    );
  } else {
    console.log(
      'Your transaction has not been included in the canonical chain'
    );
  }

  polkadotApi.disconnect();
};

main();
