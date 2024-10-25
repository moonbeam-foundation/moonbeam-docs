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

    // The candidate's address for the delegation
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';
    
    // Auto-compound percentage (0-100)
    const autoCompoundValue = 50; // 50% of rewards will be auto-compounded

    // Get auto-compounding delegations count
    const autoCompoundDelegations = await api.query.parachainStaking.autoCompoundingDelegations(candidateAddress);
    const candidateAutoCompoundingDelegationCount = autoCompoundDelegations.length;

    // Get delegator state for delegation count
    const delegatorState = await api.query.parachainStaking.delegatorState(delegator.address);
    let delegationCount = 0;

    console.log('Set Auto-Compound Details:');
    console.log('Delegator address:', delegator.address);
    console.log('Candidate address:', candidateAddress);
    console.log('Auto-compound percentage:', autoCompoundValue, '%');

    if (delegatorState.isSome) {
      const state = delegatorState.unwrap();
      delegationCount = state.delegations.length;
      const currentDelegation = state.delegations.find(d => 
        d.owner.toString().toLowerCase() === candidateAddress.toLowerCase()
      );
      if (currentDelegation) {
        console.log('\nCurrent Delegation Amount:', currentDelegation.amount.toString());
      } else {
        console.log('\nWarning: No existing delegation found for this candidate');
        process.exit(1);
      }
    } else {
      console.log('\nWarning: Account is not a delegator');
      process.exit(1);
    }

    console.log('\nDelegation Counts:');
    console.log('Auto-compounding delegations:', candidateAutoCompoundingDelegationCount);
    console.log('Total delegations:', delegationCount);

    // Create the set auto-compound transaction
    const tx = api.tx.parachainStaking.setAutoCompound(
      candidateAddress,
      autoCompoundValue,
      candidateAutoCompoundingDelegationCount,
      delegationCount
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

          // Log successful auto-compound setting
          if (section === 'parachainStaking' && method === 'AutoCompoundSet') {
            const [candidate, delegator, value] = data;
            console.log('\nSuccessfully set auto-compound percentage!');
            console.log('Candidate:', candidate.toString());
            console.log('Delegator:', delegator.toString());
            console.log('Auto-compound value:', value.toString(), '%');
          }
        });

        // Query updated auto-compound settings
        api.query.parachainStaking.autoCompoundingDelegations(candidateAddress).then(newAutoCompound => {
          const delegatorSetting = newAutoCompound.find(d => 
            d.delegator.toString().toLowerCase() === delegator.address.toLowerCase()
          );
          if (delegatorSetting) {
            console.log('\nUpdated Auto-Compound Setting:');
            console.log('Value:', delegatorSetting.value.toString(), '%');
          }
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Error in setting auto-compound:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});