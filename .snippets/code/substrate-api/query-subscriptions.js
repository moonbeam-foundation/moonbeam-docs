import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('WSS-API-ENDPOINT-HERE');
const api = await ApiPromise.create({ provider: wsProvider });

const addr = 'MOONBEAM-WALLET-ADDRESS-HERE';

const chain = await api.rpc.system.chain();

await api.rpc.chain.subscribeNewHeads((lastHeader) => {
  console.log(`${chain}: last block #${lastHeader.number} has hash ${lastHeader.hash}`);
});

await api.query.system.account(addr, ({ nonce, data: balance }) => {
  console.log(`free balance is ${balance.free} with ${balance.reserved} reserved and a nonce of ${nonce}`);
});

// Disconnect the API
api.disconnect();