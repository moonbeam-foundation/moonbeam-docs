import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const palletVersion = await api.query.parameters.palletVersion();
  console.log('The palletVersion is ' + palletVersion);
};

main();
