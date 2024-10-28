import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Example delegator address
    const delegatorAddress = 'INSERT_DELEGATOR_ADDRESS';

    // Get current round information for context
    const round = await api.query.parachainStaking.round();
    const currentRound = round.current.toNumber();

    console.log('Query Parameters:');
    console.log('Delegator address:', delegatorAddress);
    console.log('Current round:', currentRound);

    // Query delegator state
    const delegatorState = await api.query.parachainStaking.delegatorState(delegatorAddress);

    if (delegatorState.isSome) {
      const state = delegatorState.unwrap();
      const delegations = state.delegations;

      console.log('\nDelegator Information:');
      console.log('Total Delegations:', delegations.length);

      // Calculate total delegated amount
      let totalDelegated = BigInt(0);
      delegations.forEach(d => {
        totalDelegated += BigInt(d.amount);
      });
      
      console.log('Total Amount Delegated:', totalDelegated.toString(), 'Wei');
      console.log('Total Amount Delegated in DEV:', (totalDelegated / BigInt(10 ** 18)).toString(), 'DEV');

      // Show detailed delegation information
      console.log('\nDetailed Delegations:');
      for (const [index, delegation] of delegations.entries()) {
        console.log(`\nDelegation #${index + 1}:`);
        console.log('Collator:', delegation.owner.toString());
        console.log('Amount:', delegation.amount.toString(), 'Wei');
        console.log('Amount in DEV:', (BigInt(delegation.amount) / BigInt(10 ** 18)).toString(), 'DEV');

        // Get collator information
        const collatorInfo = await api.query.parachainStaking.candidateInfo(delegation.owner);
        if (collatorInfo.isSome) {
          const info = collatorInfo.unwrap();
          console.log('Collator Status:', info.status.toString());
          console.log('Collator Total Bond:', info.bond.toString(), 'Wei');
          console.log('Collator Delegation Count:', info.delegationCount.toString());
        }

        // Check auto-compound setting
        const autoCompoundDelegations = await api.query.parachainStaking.autoCompoundingDelegations(delegation.owner);
        const autoCompound = autoCompoundDelegations.find(d => 
          d.delegator.toString().toLowerCase() === delegatorAddress.toLowerCase()
        );
        if (autoCompound) {
          console.log('Auto-compound Percentage:', autoCompound.value.toString(), '%');
        } else {
          console.log('Auto-compound: Not set');
        }

        // Check for scheduled requests
        const requests = await api.query.parachainStaking.delegationScheduledRequests(delegation.owner);
        const delegatorRequests = requests.filter(r => 
          r.delegator.toString().toLowerCase() === delegatorAddress.toLowerCase()
        );
        
        if (delegatorRequests.length > 0) {
          console.log('\nPending Requests:');
          delegatorRequests.forEach(request => {
            console.log('Executable at round:', request.whenExecutable.toString());
            if (request.action.isDecrease) {
              console.log('Action: Decrease');
              console.log('Amount:', request.action.asDecrease.toString(), 'Wei');
              console.log('Amount in DEV:', (BigInt(request.action.asDecrease) / BigInt(10 ** 18)).toString(), 'DEV');
            } else if (request.action.isRevoke) {
              console.log('Action: Revoke');
              console.log('Amount:', request.action.asRevoke.toString(), 'Wei');
              console.log('Amount in DEV:', (BigInt(request.action.asRevoke) / BigInt(10 ** 18)).toString(), 'DEV');
            }
          });
        }
      }

      // Calculate statistics
      const amounts = delegations.map(d => BigInt(d.amount));
      const averageDelegation = totalDelegated / BigInt(delegations.length);
      const maxDelegation = amounts.reduce((a, b) => a > b ? a : b, BigInt(0));
      const minDelegation = amounts.reduce((a, b) => a < b ? a : b, amounts[0] || BigInt(0));

      console.log('\nDelegation Statistics:');
      console.log('Average Delegation:', (averageDelegation / BigInt(10 ** 18)).toString(), 'DEV');
      console.log('Largest Delegation:', (maxDelegation / BigInt(10 ** 18)).toString(), 'DEV');
      console.log('Smallest Delegation:', (minDelegation / BigInt(10 ** 18)).toString(), 'DEV');

      // Get network context
      const selectedCandidates = await api.query.parachainStaking.selectedCandidates();
      console.log('\nNetwork Context:');
      console.log('Total Selected Collators:', selectedCandidates.length);
      console.log('Delegating to Selected Collators:', 
        delegations.filter(d => 
          selectedCandidates.some(c => c.toString() === d.owner.toString())
        ).length
      );

    } else {
      console.log('\nNo delegator state found for this address');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying delegator state:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});