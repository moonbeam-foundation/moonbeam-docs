import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Example candidate address
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';

    console.log('Query Parameters:');
    console.log('Candidate address:', candidateAddress);

    // Query auto-compounding delegations
    const autoCompoundDelegations = await api.query.parachainStaking.autoCompoundingDelegations(candidateAddress);
    
    // Get candidate info
    const candidateInfo = await api.query.parachainStaking.candidateInfo(candidateAddress);
    
    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      console.log('\nCandidate Information:');
      console.log('Total delegations:', info.delegationCount.toString());
      console.log('Bond amount:', info.bond.toString());
    }

    console.log('\nAuto-Compounding Delegations:');
    if (autoCompoundDelegations.length > 0) {
      console.log('Total auto-compounding delegators:', autoCompoundDelegations.length);
      
      // Display each auto-compounding delegation
      autoCompoundDelegations.forEach((delegation, index) => {
        const { delegator, value } = delegation;
        console.log(`\nDelegator #${index + 1}:`);
        console.log('Address:', delegator.toString());
        console.log('Auto-compound percentage:', value.toString(), '%');
      });

      // Get more detailed information for each delegator
      console.log('\nDetailed Delegation Information:');
      for (const delegation of autoCompoundDelegations) {
        const delegatorState = await api.query.parachainStaking.delegatorState(delegation.delegator);
        if (delegatorState.isSome) {
          const state = delegatorState.unwrap();
          const specificDelegation = state.delegations.find(d => 
            d.owner.toString().toLowerCase() === candidateAddress.toLowerCase()
          );
          
          if (specificDelegation) {
            console.log(`\nDelegator ${delegation.delegator.toString()}:`);
            console.log('Delegation amount:', specificDelegation.amount.toString());
            console.log('Auto-compound value:', delegation.value.toString(), '%');
          }
        }
      }

      // Calculate some statistics
      const averageCompounding = autoCompoundDelegations.reduce((acc, curr) => acc + curr.value.toNumber(), 0) / autoCompoundDelegations.length;
      console.log('\nStatistics:');
      console.log('Average auto-compound percentage:', averageCompounding.toFixed(2), '%');
      
      const maxCompounding = Math.max(...autoCompoundDelegations.map(d => d.value.toNumber()));
      const minCompounding = Math.min(...autoCompoundDelegations.map(d => d.value.toNumber()));
      console.log('Highest auto-compound setting:', maxCompounding, '%');
      console.log('Lowest auto-compound setting:', minCompounding, '%');
    } else {
      console.log('No auto-compounding delegations found for this candidate');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying auto-compounding delegations:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});