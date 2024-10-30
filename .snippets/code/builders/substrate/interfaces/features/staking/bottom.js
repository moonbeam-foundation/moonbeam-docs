import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Example candidate address
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';

    // Get candidate info first
    const candidateInfo = await api.query.parachainStaking.candidateInfo(candidateAddress);
    
    console.log('Query Parameters:');
    console.log('Candidate address:', candidateAddress);

    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      console.log('\nCandidate Information:');
      console.log('Total delegations:', info.delegationCount.toString());
      console.log('Bond amount:', info.bond.toString(), 'Wei');
    }

    // Query bottom delegations
    const bottomDelegations = await api.query.parachainStaking.bottomDelegations(candidateAddress);
    
    if (bottomDelegations.isSome) {
      const delegations = bottomDelegations.unwrap();
      console.log('\nBottom Delegations:');
      console.log('Total bottom delegations found:', delegations.delegations.length);

      // Sort delegations by amount in descending order
      const sortedDelegations = [...delegations.delegations].sort((a, b) => 
        BigInt(b.amount) - BigInt(a.amount)
      );

      // Display each delegation
      sortedDelegations.forEach((delegation, index) => {
        console.log(`\nDelegation #${index + 1}:`);
        console.log('Delegator:', delegation.owner.toString());
        console.log('Amount:', delegation.amount.toString(), 'Wei');
        // Convert Wei to DEV (1 DEV = 10^18 Wei)
        const devAmount = BigInt(delegation.amount) / BigInt(10 ** 18);
        console.log('Amount in DEV:', devAmount.toString(), 'DEV');
      });

      // Calculate some statistics
      if (sortedDelegations.length > 0) {
        const total = sortedDelegations.reduce((acc, curr) => acc + BigInt(curr.amount), BigInt(0));
        const average = total / BigInt(sortedDelegations.length);
        const highest = sortedDelegations[0].amount;
        const lowest = sortedDelegations[sortedDelegations.length - 1].amount;

        console.log('\nStatistics:');
        console.log('Total delegated in bottom:', total.toString(), 'Wei');
        console.log('Average delegation:', average.toString(), 'Wei');
        console.log('Highest bottom delegation:', highest.toString(), 'Wei');
        console.log('Lowest bottom delegation:', lowest.toString(), 'Wei');

        // Show in DEV for readability
        console.log('\nStatistics (in DEV):');
        console.log('Total delegated:', (BigInt(total) / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Average delegation:', (BigInt(average) / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Highest bottom delegation:', (BigInt(highest) / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Lowest bottom delegation:', (BigInt(lowest) / BigInt(10 ** 18)).toString(), 'DEV');
      }

      // Get top delegations for comparison
      const topDelegations = await api.query.parachainStaking.topDelegations(candidateAddress);
      if (topDelegations.isSome) {
        const top = topDelegations.unwrap();
        console.log('\nComparison with Top Delegations:');
        console.log('Number of top delegations:', top.delegations.length);
        console.log('Number of bottom delegations:', sortedDelegations.length);
        
        if (top.delegations.length > 0) {
          const lowestTop = top.delegations[top.delegations.length - 1].amount;
          console.log('Lowest top delegation:', lowestTop.toString(), 'Wei');
          console.log('Lowest top delegation in DEV:', (BigInt(lowestTop) / BigInt(10 ** 18)).toString(), 'DEV');
        }
      }
    } else {
      console.log('\nNo bottom delegations found for this candidate');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying bottom delegations:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 