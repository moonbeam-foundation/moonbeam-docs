import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://wss.api.moonbeam.network'),
  });

  const hash = '0x166f82439fd2b25b28b82224e82ad9f26f2da26b8257e047182a6a7031accc9a';
  const trapCount = await api.query.polkadotXcm.assetTraps(hash);
  
  console.log('Trap count:', trapCount.toNumber());
};

main();