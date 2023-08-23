import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Transaction to get weight information
  const tx = api.tx.balances.transfer('INSERT_BOBS_ADDRESS', BigInt(12345));

  // Get weight info
  const { partialFee, weight } = await tx.paymentInfo('INSERT_SENDERS_ADDRESS');

  console.log(`Transaction weight: ${weight}`);
  console.log(`Transaction fee: ${partialFee.toHuman()}`);

  // Disconnect the API
  await api.disconnect();
};

main();
