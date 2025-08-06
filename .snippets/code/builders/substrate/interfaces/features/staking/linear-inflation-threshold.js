import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API provider
  const wsProvider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Get the linear inflation threshold constant
  const linearInflationThreshold = await api.consts.parachainStaking.linearInflationThreshold;
  
  console.log(`Linear Inflation Threshold: ${linearInflationThreshold.toHuman()}`);
  
  // Disconnect from the API
  await api.disconnect();
};

main().catch(console.error);