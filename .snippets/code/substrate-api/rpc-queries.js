import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('WSS-API-ENDPOINT-HERE');
const api = await ApiPromise.create({ provider: wsProvider });

const chain = await api.rpc.system.chain();
const lastHeader = await api.rpc.chain.getHeader();

console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);

// Disconnect the API
api.disconnect();