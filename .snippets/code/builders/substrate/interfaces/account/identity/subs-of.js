import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    const account = 'INSERT_ACCOUNT';
    const subs = await api.query.identity.subsOf(account);

    // Log raw response for debugging
    console.log('Raw subs response:', subs.toString());

    if (subs) {
      // The response includes a tuple of [deposit, accounts]
      const [deposit, subAccounts] = subs;

      const formattedSubs = {
        deposit: deposit.toHuman(),
        subAccounts: subAccounts.toHuman(),
      };

      console.log('Formatted Subs:', JSON.stringify(formattedSubs, null, 2));
      console.log('Number of sub accounts:', subAccounts.length);
    } else {
      console.log('No sub identities found for this account');
    }
  } catch (error) {
    console.error('Error querying sub identities:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
