import { ApiPromise, WsProvider } from '@polkadot/api';

const bytes = INSERT_PREIMAGE_HASH;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.preimage.requestPreimage(bytes);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
  
  api.disconnect();
};

main();