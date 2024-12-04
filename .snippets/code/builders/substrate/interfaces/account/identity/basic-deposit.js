import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Query the basicDeposit constant
    const basicDeposit = api.consts.identity.basicDeposit;

    // Log raw response for debugging
    console.log('Raw basicDeposit response:', basicDeposit.toString());

    // Format the deposit amount
    console.log('Basic Deposit (formatted):', basicDeposit.toHuman());
  } catch (error) {
    console.error('Error querying basic deposit:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
