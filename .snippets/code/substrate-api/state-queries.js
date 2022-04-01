import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('WSS-API-ENDPOINT-HERE');
const api = await ApiPromise.create({ provider: wsProvider });

const addr = 'MOONBEAM-WALLET-ADDRESS-HERE';

const now = await api.query.timestamp.now();
const { nonce, data: balance } = await api.query.system.account(addr);
const nextNonce = await api.rpc.system.accountNextIndex(addr);

console.log(`${now}: balance of ${balance.free} and a current nonce of ${nonce} and next nonce of ${nextNonce}`);