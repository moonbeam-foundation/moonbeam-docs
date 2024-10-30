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
    // Setup candidate account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const candidate = keyring.addFromUri(PRIVATE_KEY);

    // First, get the current candidate count from the chain
    const candidates = await api.query.parachainStaking.candidatePool();
    const candidateCount = candidates.length;

    console.log('Candidate address:', candidate.address);
    console.log('Current candidate count:', candidateCount);

    // Create the cancel leave candidates transaction
    const tx = api.tx.parachainStaking.cancelLeaveCandidates(
      candidateCount
    );

    // Sign and send the transaction
    await tx.signAndSend(candidate, ({ status, events }) => {
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
          if (section === 'parachainStaking' && method === 'CancelledLeaveCandidates') {
            const [candidateAddress, candidateCount] = data;
            console.log('\nSuccessfully cancelled leave candidates request!');
            console.log('Candidate:', candidateAddress.toString());
            console.log('Candidate count at cancellation:', candidateCount.toString());
          }
        });
        
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Error in cancelling leave candidates request:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});