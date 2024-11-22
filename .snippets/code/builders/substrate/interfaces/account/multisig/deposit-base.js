import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const depositBase = api.consts.multisig.depositBase;
    console.log('Multisig Deposit Base:', depositBase.toHuman());
  } catch (error) {
    console.error('Error querying deposit base:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
