import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the deposit constant
    const deposit = await api.consts.randomness.deposit;

    console.log('Randomness Request Deposit:', deposit.toString(), 'Wei');
    console.log(
      'Deposit in DEV:',
      (BigInt(deposit) / BigInt(10 ** 18)).toString()
    );

    process.exit(0);
  } catch (error) {
    console.error('Error querying randomness deposit:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
