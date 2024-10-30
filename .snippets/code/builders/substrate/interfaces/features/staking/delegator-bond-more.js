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

    // The candidate's address for which to increase delegation
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';
    
    // Amount to increase delegation by (e.g., 1 DEV = 1_000_000_000_000_000_000)
    const moreBond = '1000000000000000000';

    // Query current delegation before increasing
    const delegatorState = await api.query.parachainStaking.delegatorState(delegator.address);
    
    console.log('Current Delegation Info:');
    console.log('Delegator address:', delegator.address);
    console.log('Candidate address:', candidateAddress);
    
    if (delegatorState.isSome) {
      const state = delegatorState.unwrap();
      const currentDelegation = state.delegations.find(d => 
        d.owner.toString().toLowerCase() === candidateAddress.toLowerCase()
      );
      if (currentDelegation) {
        console.log('Current delegation amount:', currentDelegation.amount.toString());
      }
    }
    
    console.log('Amount to increase by:', moreBond, 'Wei (1 DEV)');

    // Create the increase delegation transaction
    const tx = api.tx.parachainStaking.delegatorBondMore(
      candidateAddress,
      moreBond
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

          // Log successful bond increase
          if (section === 'parachainStaking' && method === 'DelegationIncreased') {
            const [delegator, candidate, amount, inTopDelegations] = data;
            console.log('\nSuccessfully increased delegation!');
            console.log('Delegator:', delegator.toString());
            console.log('Candidate:', candidate.toString());
            console.log('Amount increased by:', amount.toString());
            console.log('In top delegations:', inTopDelegations.toString());
          }
        });

        // Query updated delegation after transaction
        api.query.parachainStaking.delegatorState(delegator.address).then(newState => {
          if (newState.isSome) {
            const state = newState.unwrap();
            const updatedDelegation = state.delegations.find(d => 
              d.owner.toString().toLowerCase() === candidateAddress.toLowerCase()
            );
            if (updatedDelegation) {
              console.log('\nNew delegation amount:', updatedDelegation.amount.toString());
            }
          }
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Error in increasing delegation:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});