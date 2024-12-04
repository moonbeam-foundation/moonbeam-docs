import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const depositFactor = api.consts.multisig.depositFactor;
    console.log('Multisig Deposit Factor:', depositFactor.toHuman());
  } catch (error) {
    console.error('Error querying deposit factor:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
