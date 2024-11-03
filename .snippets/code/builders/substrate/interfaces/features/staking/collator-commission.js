import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Query collator commission
    const commission = await api.query.parachainStaking.collatorCommission();

    // Get the current round for context
    const round = await api.query.parachainStaking.round();

    // Get selected candidates count for context
    const selectedCandidates =
      await api.query.parachainStaking.selectedCandidates();

    console.log('\nCollator Commission Information:');
    console.log('Current Round:', round.current.toString());
    console.log('Commission Rate:', commission.toString(), 'Per Billion');
    // Convert to percentage (commission is stored as parts per billion)
    const commissionPercent = (Number(commission) / 10_000_000).toFixed(2);
    console.log('Commission Percentage:', commissionPercent + '%');

    console.log('\nNetwork Context:');
    console.log('Active Collators:', selectedCandidates.length);

    // Example calculation for a reward
    const exampleReward = BigInt(1000000000000000000); // 1 DEV
    const commissionAmount =
      (exampleReward * BigInt(commission)) / BigInt(1000000000);

    console.log('\nExample Reward Calculation:');
    console.log('For a reward of 1 DEV:');
    console.log(
      'Commission Amount:',
      (commissionAmount / BigInt(10 ** 18)).toString(),
      'DEV'
    );
    console.log(
      'Remaining Reward:',
      ((exampleReward - commissionAmount) / BigInt(10 ** 18)).toString(),
      'DEV'
    );

    process.exit(0);
  } catch (error) {
    console.error('Error querying collator commission:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
