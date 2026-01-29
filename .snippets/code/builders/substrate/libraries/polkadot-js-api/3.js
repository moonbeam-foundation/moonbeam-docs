// Import
import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('{{ networks.moonbeam.wss_url }}');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Code goes here

  await api.disconnect();
}

main();
