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

    // The collator's address to revoke delegation from
    const collatorAddress = 'INSERT_COLLATOR_ADDRESS';

    // Get current delegation info
    const delegatorState = await api.query.parachainStaking.delegatorState(delegator.address);
    
    console.log('Schedule Revoke Delegation Details:');
    console.log('Delegator address:', delegator.address);
    console.log('Collator address:', collatorAddress);

    if (delegatorState.isSome) {
      const state = delegatorState.unwrap();
      const currentDelegation = state.delegations.find(d => 
        d.owner.toString().toLowerCase() === collatorAddress.toLowerCase()
      );
      if (currentDelegation) {
        console.log('\nCurrent Delegation Amount:', currentDelegation.amount.toString());
      } else {
        console.log('\nWarning: No existing delegation found for this collator');
        process.exit(1);
      }
    } else {
      console.log('\nWarning: Account is not a delegator');
      process.exit(1);
    }

    // Get current round
    const round = await api.query.parachainStaking.round();
    console.log('Current round:', round.current.toString());

    // Create the schedule revoke transaction
    const tx = api.tx.parachainStaking.scheduleRevokeDelegation(
      collatorAddress
    );

    // Sign and send the transaction
    await tx.signAndSend(delegator, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(`\nTransaction included in block hash: ${status.asInBlock}`);
        
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

          // Log successful scheduling
          if (section === 'parachainStaking' && method === 'DelegationRevocationScheduled') {
            const [round, delegator, candidate, executeRound] = data;
            console.log('\nSuccessfully scheduled delegation revocation!');
            console.log('Round:', round.toString());
            console.log('Delegator:', delegator.toString());
            console.log('Collator:', candidate.toString());
            console.log('Execute round:', executeRound.toString());
            console.log(`\nNote: You must wait until round ${executeRound.toString()} to execute the revocation request`);
          }
        });

        // Query final delegation state
        api.query.parachainStaking.delegatorState(delegator.address).then(finalState => {
          if (finalState.isSome) {
            const state = finalState.unwrap();
            const updatedDelegation = state.delegations.find(d => 
              d.owner.toString().toLowerCase() === collatorAddress.toLowerCase()
            );
            if (updatedDelegation) {
              console.log('\nCurrent Delegation Status:');
              console.log('Amount:', updatedDelegation.amount.toString());
              console.log('Note: Delegation will be fully revoked after execution in the scheduled round');
            }
          }
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Error in scheduling delegation revocation:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});