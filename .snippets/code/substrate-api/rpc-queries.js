import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Construct API provider
  const wsProvider = new WsProvider('WSS_API_ENDPOINT_HERE');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Retrieve the chain name
  const chain = await api.rpc.system.chain();

  // Retrieve the latest header
  const lastHeader = await api.rpc.chain.getHeader();

  // Log the information
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

  // Disconnect the API
  await api.disconnect();
};

main();
