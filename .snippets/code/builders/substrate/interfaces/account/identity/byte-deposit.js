import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Query the byteDeposit constant
    const byteDeposit = api.consts.identity.byteDeposit;

    // Log raw response for debugging
    console.log('Raw byteDeposit response:', byteDeposit.toString());

    // Format the deposit amount
    console.log('Byte Deposit (formatted):', byteDeposit.toHuman());
  } catch (error) {
    console.error('Error querying byte deposit:', error);
  } finally {
    await api.disconnect();
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
