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
    // Setup delegator account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const delegator = keyring.addFromUri(PRIVATE_KEY);

    // The candidate's address for which to cancel the delegation request
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';

    console.log('Delegator address:', delegator.address);
    console.log('Candidate address:', candidateAddress);

    // Create the cancel delegation request transaction
    const tx = api.tx.parachainStaking.cancelDelegationRequest(
      candidateAddress
    );

    // Sign and send the transaction
    await tx.signAndSend(delegator, ({ status, events }) => {
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
          if (section === 'parachainStaking' && method === 'CancelledDelegationRequest') {
            const [delegatorAddress, scheduledRequest, candidateAddress] = data;
            console.log('\nSuccessfully cancelled delegation request!');
            console.log('Delegator:', delegatorAddress.toString());
            console.log('Candidate:', candidateAddress.toString());
            
            const request = scheduledRequest.toJSON();
            console.log('Request details:');
            console.log('- Execution round:', request.whenExecutable);
            if (request.action.decrease) {
              console.log('- Action: Decrease by', request.action.decrease);
            } else if (request.action.revoke) {
              console.log('- Action: Revoke amount', request.action.revoke);
            }
          }
        });
        
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Error in cancelling delegation request:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});