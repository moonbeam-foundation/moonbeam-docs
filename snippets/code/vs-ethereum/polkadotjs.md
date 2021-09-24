```js
import { ApiPromise, WsProvider } from '@polkadot/api';
import { typesBundle } from 'moonbeam-types-bundle';

// Define the TxHash to Check Finality
const txHash = 'tx_hash';

// Define the provider
const wsProvider = new WsProvider('wss://wss.moonriver.moonbeam.network');

const main = async () => {
  // Create the provider using Moonbeam types
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider,
    typesBundle: typesBundle,
  });
  await polkadotApi.isReady;

  // Get the latest finalized block of the Substrate chain
  const finalizedHeadHash = (await polkadotApi.rpc.chain.getFinalizedHead()).toJSON();

  // Get finalized block header to retrieve number
  const finalizedBlockHeader = (await polkadotApi.rpc.chain.getHeader(finalizedHeadHash)).toJSON();

  // Get the transaction receipt of the given tx hash
  const txReceipt = (await polkadotApi.rpc.eth.getTransactionReceipt(txHash)).toJSON();

  // We can not verify if the tx is in block because polkadotApi.rpc.eth.getBlockByNumber
  // does not return the list of tx hash

  // If block number of receipt is not null, compare it against finalized head
  if (txReceipt) {
    console.log(`Current finalized block number is ${finalizedBlockHeader.number}`);
    console.log(
      `Your transaction in block ${txReceipt.blockNumber} is finalized? ${
        finalizedBlockHeader.number >= txReceipt.blockNumber
      }`
    );
  } else {
    console.log('Your transaction has not been included in the canonical chain');
  }
};

main();
```