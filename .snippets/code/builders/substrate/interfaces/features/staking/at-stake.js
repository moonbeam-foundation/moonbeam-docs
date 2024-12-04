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

    // Example collator address
    const collatorAddress = 'INSERT_COLLATOR_ADDRESS';

    console.log('Query Parameters:');
    console.log('Current round:', currentRound);
    console.log('Collator address:', collatorAddress);

    // Query current round
    console.log('\nQuerying current round stake...');
    const currentStake = await api.query.parachainStaking.atStake(
      currentRound,
      collatorAddress
    );

    if (currentStake) {
      console.log('\nCurrent Round Stake Details:');
      const stakeInfo = currentStake.toHuman();
      console.log(JSON.stringify(stakeInfo, null, 2));

      // Get raw values for calculations if needed
      const rawStake = currentStake.toJSON();
      console.log('\nRaw Stake Values:');
      console.log('Total stake:', rawStake.total);
      console.log('Own stake:', rawStake.bond);
    }

    // Query previous round
    const previousRound = currentRound - 1;
    console.log('\nQuerying previous round stake...');
    const previousStake = await api.query.parachainStaking.atStake(
      previousRound,
      collatorAddress
    );

    if (previousStake) {
      console.log('\nPrevious Round Stake Details:');
      const previousStakeInfo = previousStake.toHuman();
      console.log(JSON.stringify(previousStakeInfo, null, 2));
    }

    // Get scheduled delegation requests
    const delegationRequests =
      await api.query.parachainStaking.delegationScheduledRequests(
        collatorAddress
      );

    console.log('\nScheduled Delegation Changes:');
    if (delegationRequests.length > 0) {
      console.log(JSON.stringify(delegationRequests.toHuman(), null, 2));
    } else {
      console.log('No scheduled delegation changes');
    }

    // Get auto-compound settings
    const autoCompound =
      await api.query.parachainStaking.autoCompoundingDelegations(
        collatorAddress
      );

    console.log('\nAuto-Compound Settings:');
    if (autoCompound.length > 0) {
      console.log(JSON.stringify(autoCompound.toHuman(), null, 2));
    } else {
      console.log('No auto-compound settings found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying at stake:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
