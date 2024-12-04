import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const maxUsernameLength = api.consts.identity.maxUsernameLength;
    console.log('Max Username Length:', maxUsernameLength.toHuman());
  } catch (error) {
    console.error('Error querying max username length:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
