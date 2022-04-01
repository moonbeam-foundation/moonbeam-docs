import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

const wsProvider = new WsProvider('WSS-API-ENDPOINT-HERE');
const api = await ApiPromise.create({ provider: wsProvider });

const keyring = new Keyring({ type: 'ethereum' });

const alice = keyring.addFromUri('ALICE-ACCOUNT-PRIVATE-KEY-HERE');
const bob = 'BOB-ACCOUNT-PUBLIC-KEY-HERE';

const txHash = await api.tx.balances
  .transfer(bob, 12345)
  .signAndSend(alice);

console.log(`Submitted with hash ${txHash}`);