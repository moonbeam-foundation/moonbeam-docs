import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const maxSubAccounts = api.consts.identity.maxSubAccounts;
    console.log('Max SubAccounts (number):', maxSubAccounts.toNumber());
  } catch (error) {
    console.error('Error querying max subaccounts:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
