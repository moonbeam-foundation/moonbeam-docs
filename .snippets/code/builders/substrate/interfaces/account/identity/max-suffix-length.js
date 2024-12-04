import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const maxSuffixLength = api.consts.identity.maxSuffixLength;
    console.log('Max Suffix Length:', maxSuffixLength.toHuman());
  } catch (error) {
    console.error('Error querying max suffix length:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
