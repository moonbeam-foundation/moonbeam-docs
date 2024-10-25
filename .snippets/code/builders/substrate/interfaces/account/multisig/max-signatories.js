import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const maxSignatories = api.consts.multisig.maxSignatories;
    console.log('Multisig Max Signatories:', maxSignatories.toHuman());
  } catch (error) {
    console.error('Error querying max signatories:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
