import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get the maximum random words constant
    const maxRandomWords = await api.consts.randomness.maxRandomWords;

    console.log('Maximum Random Words:', maxRandomWords.toString(), 'words');

    process.exit(0);
  } catch (error) {
    console.error('Error querying max random words:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
