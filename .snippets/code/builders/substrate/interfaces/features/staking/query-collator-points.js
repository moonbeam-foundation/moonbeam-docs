import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Get current round information
    const round = await api.query.parachainStaking.round();
    const currentRound = round.current.toNumber();

    // Query points for several recent rounds
    const roundsToCheck = 5;
    const rounds = Array.from(
      { length: roundsToCheck },
      (_, i) => currentRound - i
    );

    console.log('Current Round:', currentRound);

    // Get selected candidates for context
    const selectedCandidates =
      await api.query.parachainStaking.selectedCandidates();
    console.log('Number of Selected Collators:', selectedCandidates.length);

    // Check each round
    for (const roundNumber of rounds) {
      console.log(`\nPoints for Round ${roundNumber}:`);
      const roundPoints = await api.query.parachainStaking.points(roundNumber);

      if (roundPoints.toNumber() === 0) {
        console.log('No points recorded for this round');
      } else {
        console.log('Total Points:', roundPoints.toString());

        // Get individual collator points for this round
        let collatorPoints = [];
        for (const collator of selectedCandidates) {
          const points = await api.query.parachainStaking.awardedPts(
            roundNumber,
            collator
          );
          if (points.toNumber() > 0) {
            collatorPoints.push({
              collator: collator.toString(),
              points: points.toNumber(),
            });
          }
        }

        // Sort collators by points
        collatorPoints.sort((a, b) => b.points - a.points);

        // Display collator points
        if (collatorPoints.length > 0) {
          console.log('\nCollator Performance:');
          collatorPoints.forEach(({ collator, points }) => {
            console.log(`Collator ${collator}: ${points} points`);
          });

          // Calculate statistics
          const totalPoints = collatorPoints.reduce(
            (sum, { points }) => sum + points,
            0
          );
          const averagePoints = totalPoints / collatorPoints.length;
          const maxPoints = collatorPoints[0].points;
          const minPoints = collatorPoints[collatorPoints.length - 1].points;

          console.log('\nRound Statistics:');
          console.log('Active Collators:', collatorPoints.length);
          console.log('Average Points:', averagePoints.toFixed(2));
          console.log('Highest Points:', maxPoints);
          console.log('Lowest Points:', minPoints);
        }
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying points:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
