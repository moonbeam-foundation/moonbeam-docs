import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('ws://127.0.0.1:9944'),
  });

  const encodedProposal = api.tx.system.remark('Hello World').method.toHex();

  api.disconnect();
};

main();
