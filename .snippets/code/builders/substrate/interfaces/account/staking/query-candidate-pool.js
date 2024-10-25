import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get current round information
    const round = await api.query.parachainStaking.round();
    console.log('Current Round:', round.current.toString());

    // Query candidate pool
    const candidatePool = await api.query.parachainStaking.candidatePool();
    
    console.log('\nCandidate Pool Information:');
    console.log('Total Candidates:', candidatePool.length);

    // Sort candidates by amount, handling BigInt comparison correctly
    const sortedCandidates = [...candidatePool].sort((a, b) => {
      const amountA = BigInt(a.amount);
      const amountB = BigInt(b.amount);
      if (amountA < amountB) return 1;
      if (amountA > amountB) return -1;
      return 0;
    });

    // Get selected candidates for comparison
    const selectedCandidates = await api.query.parachainStaking.selectedCandidates();
    const selectedSet = new Set(selectedCandidates.map(c => c.toString()));

    // Track total stake in pool
    let totalStake = BigInt(0);

    // Display each candidate's information
    console.log('\nDetailed Candidate Information:');
    for (const [index, candidate] of sortedCandidates.entries()) {
      const { owner, amount } = candidate;
      totalStake += BigInt(amount);

      // Get candidate info
      const candidateInfo = await api.query.parachainStaking.candidateInfo(owner);
      
      console.log(`\nCandidate #${index + 1}:`);
      console.log('Address:', owner.toString());
      console.log('Total Stake:', amount.toString(), 'Wei');
      console.log('Total Stake in DEV:', (BigInt(amount) / BigInt(10 ** 18)).toString(), 'DEV');
      console.log('Is Selected Collator:', selectedSet.has(owner.toString()));

      if (candidateInfo.isSome) {
        const info = candidateInfo.unwrap();
        console.log('Self Bond:', info.bond.toString(), 'Wei');
        console.log('Self Bond in DEV:', (BigInt(info.bond) / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Delegation Count:', info.delegationCount.toString());
        console.log('Status:', info.status.toString());
      }

      // Get auto-compounding delegations count
      const autoCompounding = await api.query.parachainStaking.autoCompoundingDelegations(owner);
      console.log('Auto-compounding Delegations:', autoCompounding.length);

      // Get recent points (last 3 rounds)
      const currentRound = round.current.toNumber();
      let totalPoints = 0;
      console.log('Recent Points:');
      for (let i = 0; i < 3; i++) {
        const roundNumber = currentRound - i;
        const points = await api.query.parachainStaking.awardedPts(roundNumber, owner);
        console.log(`  Round ${roundNumber}: ${points.toString()} points`);
        totalPoints += points.toNumber();
      }
      console.log('Average Points (last 3 rounds):', (totalPoints / 3).toFixed(2));
    }

    // Display pool statistics
    console.log('\nPool Statistics:');
    console.log('Total Candidates:', candidatePool.length);
    console.log('Selected Collators:', selectedCandidates.length);
    console.log('Total Stake in Pool:', totalStake.toString(), 'Wei');
    console.log('Total Stake in Pool (DEV):', (totalStake / BigInt(10 ** 18)).toString(), 'DEV');
    console.log('Average Stake per Candidate (DEV):', 
      (totalStake / BigInt(candidatePool.length) / BigInt(10 ** 18)).toString(), 'DEV'
    );

    // Calculate stake distribution
    const stakes = sortedCandidates.map(c => BigInt(c.amount));
    const median = stakes[Math.floor(stakes.length / 2)];
    const highest = stakes[0];
    const lowest = stakes[stakes.length - 1];

    console.log('\nStake Distribution:');
    console.log('Highest Stake (DEV):', (highest / BigInt(10 ** 18)).toString());
    console.log('Median Stake (DEV):', (median / BigInt(10 ** 18)).toString());
    console.log('Lowest Stake (DEV):', (lowest / BigInt(10 ** 18)).toString());

    process.exit(0);
  } catch (error) {
    console.error('Error querying candidate pool:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});