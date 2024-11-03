import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Query Babe Epoch randomness results
    const babeResults = await api.query.randomness.randomnessResults({
      BabeEpoch: 0,
    });
    console.log('\nBabe Epoch Randomness Results:');
    console.log(babeResults.toHuman());

    // Query Local randomness results
    const localResults = await api.query.randomness.randomnessResults({
      Local: 0,
    });
    console.log('\nLocal Randomness Results:');
    console.log(localResults.toHuman());

    // Get the available keys/entries
    console.log('\nAll Available Randomness Results:');
    const entries = await api.query.randomness.randomnessResults.entries();
    entries.forEach(([key, value]) => {
      console.log(
        'Key:',
        key.args.map((k) => k.toHuman())
      );
      console.log('Value:', value.toHuman());
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error querying randomness results:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
