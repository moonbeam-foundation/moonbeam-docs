import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Define wallet address
  const addr = 'INSERT_ADDRESS';

  // Retrieve the last timestamp via the timestamp module
  const now = await api.query.timestamp.now();

  // Retrieve the account balance & current nonce via the system module
  const { nonce, data: balance } = await api.query.system.account(addr);

  console.log(
    `${now}: balance of ${balance.free} and a current nonce of ${nonce}`
  );

  // Disconnect the API
  await api.disconnect();
};

main();
