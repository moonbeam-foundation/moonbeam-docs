import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { getTransferMultiassetsCall } from './build-transfer-multiassets-call.js';
import { getPolkadotXcmCall } from './build-remote-evm-call.js';

const originChainProviderWsURL = 'INSERT_ORIGIN_CHAIN_WSS_URL';

const sendBatchTransaction = async () => {
  // Create origin chain API provider
  const originChainProvider = new WsProvider(originChainProviderWsURL);
  const originChainAPI = await ApiPromise.create({
    provider: originChainProvider,
  });

  // Create the batch transaction
  const batchTransaction = originChainAPI.tx.utility.batchAll([
    await getTransferMultiassetsCall(),
    await getPolkadotXcmCall(),
  ]);

  // Create a keyring instance to sign the transaction
  await cryptoWaitReady();
  const keyring = new Keyring({ type: 'ethereum' });
  const account = keyring.addFromUri(privateKey);

  // Send the batch transaction
  const transaction = await batchTransaction.signAndSend(account, ({ status }) => {
    if (status.isInBlock) console.log(`Transaction sent!`);
  });

  originChainAPI.disconnect();

  return transaction;
};

sendBatchTransaction();
