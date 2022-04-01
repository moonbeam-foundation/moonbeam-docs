import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/api';

const wsProvider = new WsProvider('WSS-API-ENDPOINT-HERE');
const api = await ApiPromise.create({ provider: wsProvider });

const keyring = new Keyring({ type: 'ethereum' });

const alice = keyring.addFromUri('ALICE-ACCOUNT-PRIVATE-KEY-HERE');
const bob = 'BOB-ACCOUNT-PUBLIC-KEY-HERE';
const charlie = 'CHARLIE-ACCOUNT-PUBLIC-KEY-HERE';
const collator = 'COLLATOR-ACCOUNT-PUBLIC-KEY-HERE';

const txs = [
  api.tx.balances.transfer(bob, 12345),
  api.tx.balances.transfer(charlie, 12345),
  api.tx.parachainStaking.scheduleDelegatorBondLess(collator, 12345)
];

const info = await api.tx.utility
  .batch(txs)
  .paymentInfo(alice);

console.log(`estimated fees: ${info}`);

api.tx.utility
  .batch(txs)
  .signAndSend(alice, ({ status }) => {
    if (status.isInBlock) {
      console.log(`included in ${status.asInBlock}`);
    }
  });