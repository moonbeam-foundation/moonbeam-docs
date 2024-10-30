import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  try {
    // Get current round information
    const round = await api.query.parachainStaking.round();
    const currentRound = round.current.toNumber();
    
    // Example collator address - you can set this to null to query all collators
    const collatorAddress = 'INSERT_COLLATOR_ADDRESS';

    // Query several recent rounds
    const roundsToQuery = 5;
    const rounds = Array.from({ length: roundsToQuery }, (_, i) => currentRound - i);

    console.log('Query Parameters:');
    console.log('Current round:', currentRound);
    console.log('Collator address:', collatorAddress || 'All collators');
    console.log(`Querying last ${roundsToQuery} rounds:`, rounds);

    // Store points data for analysis
    const pointsData = {};

    // Query points for each round
    for (const roundNumber of rounds) {
      let roundPoints;
      
      if (collatorAddress) {
        // Query specific collator
        roundPoints = await api.query.parachainStaking.awardedPts(roundNumber, collatorAddress);
        console.log(`\nRound ${roundNumber} Points for ${collatorAddress}:`, roundPoints.toString());
        
        pointsData[roundNumber] = {
          [collatorAddress]: roundPoints.toNumber()
        };
      } else {
        // Query all collators for this round
        roundPoints = await api.query.parachainStaking.awardedPts.entries(roundNumber);
        console.log(`\nRound ${roundNumber} Points:`);
        
        pointsData[roundNumber] = {};
        
        for (const [key, points] of roundPoints) {
          const collator = key.args[1].toString();
          const pointsValue = points.toNumber();
          console.log(`Collator ${collator}: ${pointsValue} points`);
          
          pointsData[roundNumber][collator] = pointsValue;
        }
      }
    }

    // Calculate statistics
    console.log('\nStatistics:');
    
    if (collatorAddress) {
      // Statistics for specific collator
      const collatorPoints = rounds.map(r => pointsData[r][collatorAddress] || 0);
      const totalPoints = collatorPoints.reduce((a, b) => a + b, 0);
      const averagePoints = totalPoints / rounds.length;
      const maxPoints = Math.max(...collatorPoints);
      const minPoints = Math.min(...collatorPoints);

      console.log(`\nCollator ${collatorAddress}:`);
      console.log('Total points:', totalPoints);
      console.log('Average points per round:', averagePoints.toFixed(2));
      console.log('Highest points:', maxPoints);
      console.log('Lowest points:', minPoints);
    } else {
      // Statistics for all collators
      const collators = new Set(
        rounds.flatMap(r => Object.keys(pointsData[r]))
      );

      for (const collator of collators) {
        const collatorPoints = rounds.map(r => pointsData[r][collator] || 0);
        const totalPoints = collatorPoints.reduce((a, b) => a + b, 0);
        const averagePoints = totalPoints / rounds.length;
        const maxPoints = Math.max(...collatorPoints);
        const minPoints = Math.min(...collatorPoints);

        console.log(`\nCollator ${collator}:`);
        console.log('Total points:', totalPoints);
        console.log('Average points per round:', averagePoints.toFixed(2));
        console.log('Highest points:', maxPoints);
        console.log('Lowest points:', minPoints);
        console.log('Points history:', collatorPoints.join(', '));
      }
    }

    // Get current selected candidates for context
    const selectedCandidates = await api.query.parachainStaking.selectedCandidates();
    console.log('\nCurrently Selected Candidates:', selectedCandidates.length);
    console.log(selectedCandidates.map(c => c.toString()).join('\n'));

    process.exit(0);
  } catch (error) {
    console.error('Error querying awarded points:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});