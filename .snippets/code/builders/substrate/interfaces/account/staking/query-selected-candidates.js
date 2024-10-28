import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get current round for context
    const round = await api.query.parachainStaking.round();
    console.log('Current Round:', round.current.toString());

    // Query selected candidates
    const selectedCandidates = await api.query.parachainStaking.selectedCandidates();
    
    console.log('\nSelected Candidates:');
    console.log('Total Selected:', selectedCandidates.length);

    // Get detailed information for each candidate
    console.log('\nDetailed Candidate Information:');
    for (const [index, candidate] of selectedCandidates.entries()) {
      const candidateInfo = await api.query.parachainStaking.candidateInfo(candidate);
      
      if (candidateInfo.isSome) {
        const info = candidateInfo.unwrap();
        console.log(`\nCandidate #${index + 1}:`);
        console.log('Address:', candidate.toString());
        console.log('Bond:', info.bond.toString(), 'Wei');
        console.log('Bond in DEV:', (BigInt(info.bond) / BigInt(10 ** 18)).toString(), 'DEV');
        console.log('Delegation Count:', info.delegationCount.toString());
        console.log('Status:', info.status.toString());

        // Get recent points for context (last 3 rounds)
        const currentRound = round.current.toNumber();
        let recentPoints = 0;
        console.log('Recent Points:');
        for (let i = 0; i < 3; i++) {
          const roundPoints = await api.query.parachainStaking.awardedPts(
            currentRound - i,
            candidate
          );
          console.log(`  Round ${currentRound - i}: ${roundPoints.toString()}`);
          recentPoints += roundPoints.toNumber();
        }
        console.log('Total Points (last 3 rounds):', recentPoints);
      }
    }

    // Calculate some statistics
    let totalBond = BigInt(0);
    let totalDelegations = 0;

    for (const candidate of selectedCandidates) {
      const candidateInfo = await api.query.parachainStaking.candidateInfo(candidate);
      if (candidateInfo.isSome) {
        const info = candidateInfo.unwrap();
        totalBond += BigInt(info.bond);
        totalDelegations += info.delegationCount.toNumber();
      }
    }

    console.log('\nCollective Statistics:');
    console.log('Total Bonded:', totalBond.toString(), 'Wei');
    console.log('Total Bonded in DEV:', (totalBond / BigInt(10 ** 18)).toString(), 'DEV');
    console.log('Average Bond in DEV:', (totalBond / BigInt(selectedCandidates.length) / BigInt(10 ** 18)).toString(), 'DEV');
    console.log('Average Delegations per Candidate:', (totalDelegations / selectedCandidates.length).toFixed(2));

    process.exit(0);
  } catch (error) {
    console.error('Error querying selected candidates:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});