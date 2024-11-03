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

    console.log('Current Round:', currentRound);

    // Query several recent rounds for delayed payouts
    const roundsToCheck = 5;
    const rounds = Array.from(
      { length: roundsToCheck },
      (_, i) => currentRound - i
    );

    console.log(
      '\nChecking Delayed Payouts for the Last',
      roundsToCheck,
      'Rounds:'
    );

    // Track statistics
    let totalPayouts = 0;
    let totalRewards = BigInt(0);

    for (const roundNumber of rounds) {
      console.log(`\nRound ${roundNumber}:`);

      const delayedPayout =
        await api.query.parachainStaking.delayedPayouts(roundNumber);

      if (delayedPayout.isSome) {
        const payout = delayedPayout.unwrap();

        // Debug log to see the structure
        console.log(
          'Raw payout data:',
          JSON.stringify(payout.toJSON(), null, 2)
        );

        // Safely access the data
        const payoutData = payout.toJSON();

        console.log('Found Delayed Payout:');
        if (payoutData) {
          totalPayouts++;

          // Calculate total rewards if data is available
          if (payoutData.colReward && payoutData.delReward) {
            const roundReward =
              BigInt(payoutData.colReward) + BigInt(payoutData.delReward);
            totalRewards += roundReward;

            console.log('Collator:', payoutData.toCollator);
            console.log('Collator Reward:', payoutData.colReward, 'Wei');
            console.log(
              'Collator Reward in DEV:',
              (BigInt(payoutData.colReward) / BigInt(10 ** 18)).toString(),
              'DEV'
            );
            console.log('Total Delegator Reward:', payoutData.delReward, 'Wei');
            console.log(
              'Total Delegator Reward in DEV:',
              (BigInt(payoutData.delReward) / BigInt(10 ** 18)).toString(),
              'DEV'
            );
            console.log('Total Round Reward:', roundReward.toString(), 'Wei');
            console.log(
              'Total Round Reward in DEV:',
              (roundReward / BigInt(10 ** 18)).toString(),
              'DEV'
            );

            // Get collator information if available
            if (payoutData.toCollator) {
              const collatorInfo =
                await api.query.parachainStaking.candidateInfo(
                  payoutData.toCollator
                );
              if (collatorInfo.isSome) {
                const info = collatorInfo.unwrap();
                console.log('\nCollator Information:');
                console.log(
                  'Delegation Count:',
                  info.delegationCount.toString()
                );
                console.log('Self Bond:', info.bond.toString(), 'Wei');
                console.log(
                  'Self Bond in DEV:',
                  (BigInt(info.bond) / BigInt(10 ** 18)).toString(),
                  'DEV'
                );
              }

              // Get awarded points for context
              const points = await api.query.parachainStaking.awardedPts(
                roundNumber,
                payoutData.toCollator
              );
              console.log('Points earned in round:', points.toString());
            }
          }
        }
      } else {
        console.log('No delayed payout found');
      }
    }

    // Display statistics
    console.log('\nPayout Statistics:');
    console.log('Total Rounds with Payouts:', totalPayouts);
    console.log(
      'Average Payouts per Round:',
      (totalPayouts / roundsToCheck).toFixed(2)
    );
    if (totalPayouts > 0) {
      console.log(
        'Average Reward per Payout:',
        (totalRewards / BigInt(totalPayouts) / BigInt(10 ** 18)).toString(),
        'DEV'
      );
      console.log(
        'Total Rewards:',
        (totalRewards / BigInt(10 ** 18)).toString(),
        'DEV'
      );
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying delayed payouts:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
