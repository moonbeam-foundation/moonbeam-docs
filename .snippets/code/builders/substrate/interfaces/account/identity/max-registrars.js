import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Query the maxRegistrars constant
    const maxRegistrars = api.consts.identity.maxRegistrars;

    // Get the number as a plain integer
    console.log('Max Registrars (number):', maxRegistrars.toNumber());
  } catch (error) {
    console.error('Error querying max registrars:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
