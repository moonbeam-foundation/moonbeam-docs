import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Example collator address
    const collatorAddress = 'INSERT_COLLATOR_ADDRESS';

    // Get collator info first
    const candidateInfo = await api.query.parachainStaking.candidateInfo(collatorAddress);
    
    console.log('Query Parameters:');
    console.log('Collator address:', collatorAddress);

    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      console.log('\nCollator Information:');
      console.log('Total delegations:', info.delegationCount.toString());
      console.log('Self bond:', info.bond.toString(), 'Wei');
      console.log('Self bond in DEV:', (BigInt(info.bond) / BigInt(10 ** 18)).toString(), 'DEV');
    }

    // Query top delegations
    const topDelegations = await api.query.parachainStaking.topDelegations(collatorAddress);
    
    if (topDelegations.isSome) {
      const delegations = topDelegations.unwrap();
      console.log('\nTop Delegations:');
      console.log('Total delegations found:', delegations.delegations.length);
      console.log('Total amount delegated:', delegations.total.toString(), 'Wei');
      console.log('Total amount delegated in DEV:', (BigInt(delegations.total) / BigInt(10 ** 18)).toString(), 'DEV');

      // Sort delegations by amount in descending order
      const sortedDelegations = [...delegations.delegations].sort((a, b) => 
        BigInt(b.amount) - BigInt(a.amount)
      );

      // Display each delegation
      console.log('\nDelegation Details:');
      sortedDelegations.forEach((delegation, index) => {
        console.log(`\nDelegation #${index + 1}:`);
        console.log('Delegator:', delegation.owner.toString());
        console.log('Amount:', delegation.amount.toString(), 'Wei');
        console.log('Amount in DEV:', (BigInt(delegation.amount) / BigInt(10 ** 18)).toString(), 'DEV');
      });

      // Calculate statistics
      if (sortedDelegations.length > 0) {
        const amounts = sortedDelegations.map(d => BigInt(d.amount));
        const total = amounts.reduce((a, b) => a + b, BigInt(0));
        const average = total / BigInt(sortedDelegations.length);
        const highest = amounts[0];
        const lowest = amounts[amounts.length - 1];
        const median = amounts[Math.floor(amounts.length / 2)];

        console.log('\nDelegation Statistics:');
        console.log('Average delegation:', (average / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Highest delegation:', (highest / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Median delegation:', (median / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Lowest delegation:', (lowest / BigInt(10 ** 18)).toString(), 'DEV');

        // Distribution analysis
        const totalDelegated = BigInt(delegations.total);
        console.log('\nStake Distribution:');
        console.log('Top 5 delegators control:', 
          ((amounts.slice(0, 5).reduce((a, b) => a + b, BigInt(0)) * BigInt(100)) / totalDelegated).toString() + '%'
        );
        if (sortedDelegations.length >= 10) {
          console.log('Top 10 delegators control:', 
            ((amounts.slice(0, 10).reduce((a, b) => a + b, BigInt(0)) * BigInt(100)) / totalDelegated).toString() + '%'
          );
        }
      }

      // Check auto-compound settings
      const autoCompoundDelegations = await api.query.parachainStaking.autoCompoundingDelegations(collatorAddress);
      console.log('\nAuto-compound Settings:');
      console.log('Delegators with auto-compound:', autoCompoundDelegations.length);

    } else {
      console.log('\nNo top delegations found for this collator');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying top delegations:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});