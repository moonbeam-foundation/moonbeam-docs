import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  // Initialize the keyring with ethereum type
  const keyring = new Keyring({ type: 'ethereum' });

  try {
    // Setup account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const account = keyring.addFromUri(PRIVATE_KEY);

    console.log('Account address:', account.address);

    // Create the cancel transaction
    const tx = api.tx.parachainStaking.cancelCandidateBondLess();

    // Sign and send the transaction
    await tx.signAndSend(account, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(`Transaction included in block hash: ${status.asInBlock}`);
        
        // Process events
        events.forEach(({ event }) => {
          const { section, method, data } = event;
          console.log(`\t${section}.${method}:`, data.toString());
          
          // Handle any failures
          if (section === 'system' && method === 'ExtrinsicFailed') {
            const [dispatchError] = data;
            let errorInfo;
            
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              errorInfo = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
            } else {
              errorInfo = dispatchError.toString();
            }
            console.error('Failure reason:', errorInfo);
          }

          // Log successful cancellation
          if (section === 'parachainStaking' && method === 'CancelledCandidateBondLess') {
            const [candidate, amount, executeRound] = data;
            console.log('\nSuccessfully cancelled bond decrease request!');
            console.log('Candidate:', candidate.toString());
            console.log('Amount that was to be decreased:', amount.toString());
            console.log('Round it was to be executed:', executeRound.toString());
          }
        });
        
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Error in cancelling candidate bond less:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});