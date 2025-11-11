// Query Balances.Freezes
import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('wss://wss.api.moonbase.moonbeam.network');

const main = async () => {
  const api = await ApiPromise.create({ provider: wsProvider });
  const freezes = await api.query.balances.freezes('INSERT_ADDRESS_HERE');
  console.log(freezes.toHuman());
};

main();

