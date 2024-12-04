import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  try {
    // Example candidate address
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';

    console.log('Query Parameters:');
    console.log('Candidate address:', candidateAddress);

    // Query candidate info
    const candidateInfo =
      await api.query.parachainStaking.candidateInfo(candidateAddress);

    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();

      console.log('\nCandidate Information:');
      console.log('Bond:', info.bond.toString(), 'Wei');
      console.log(
        'Bond in DEV:',
        (BigInt(info.bond) / BigInt(10 ** 18)).toString(),
        'DEV'
      );
      console.log('Delegation Count:', info.delegationCount.toString());
      console.log('Status:', info.status.toString());
      console.log(
        'Lowest Top Delegation Amount:',
        info.lowestTopDelegationAmount.toString(),
        'Wei'
      );
      console.log(
        'Lowest Top Delegation in DEV:',
        (BigInt(info.lowestTopDelegationAmount) / BigInt(10 ** 18)).toString(),
        'DEV'
      );
      console.log(
        'Highest Bottom Delegation Amount:',
        info.highestBottomDelegationAmount.toString(),
        'Wei'
      );
      console.log(
        'Highest Bottom Delegation in DEV:',
        (
          BigInt(info.highestBottomDelegationAmount) / BigInt(10 ** 18)
        ).toString(),
        'DEV'
      );
      console.log(
        'Lowest Bottom Delegation Amount:',
        info.lowestBottomDelegationAmount.toString(),
        'Wei'
      );
      console.log(
        'Lowest Bottom Delegation in DEV:',
        (
          BigInt(info.lowestBottomDelegationAmount) / BigInt(10 ** 18)
        ).toString(),
        'DEV'
      );
      console.log('Top Capacity:', info.topCapacity.toString());
      console.log('Bottom Capacity:', info.bottomCapacity.toString());

      // Get additional context
      const round = await api.query.parachainStaking.round();
      console.log('\nCurrent Round:', round.current.toString());

      // Check if in selected candidates
      const selectedCandidates =
        await api.query.parachainStaking.selectedCandidates();
      const isSelected = selectedCandidates.some(
        (c) => c.toString() === candidateAddress
      );
      console.log('Is Selected Candidate:', isSelected);

      // Get top delegations
      const topDelegations =
        await api.query.parachainStaking.topDelegations(candidateAddress);
      if (topDelegations.isSome) {
        const top = topDelegations.unwrap();
        console.log('\nTop Delegations Count:', top.delegations.length);
        console.log('Total Top Delegated:', top.total.toString(), 'Wei');
        console.log(
          'Total Top Delegated in DEV:',
          (BigInt(top.total) / BigInt(10 ** 18)).toString(),
          'DEV'
        );
      }

      // Get bottom delegations
      const bottomDelegations =
        await api.query.parachainStaking.bottomDelegations(candidateAddress);
      if (bottomDelegations.isSome) {
        const bottom = bottomDelegations.unwrap();
        console.log('\nBottom Delegations Count:', bottom.delegations.length);
        console.log('Total Bottom Delegated:', bottom.total.toString(), 'Wei');
        console.log(
          'Total Bottom Delegated in DEV:',
          (BigInt(bottom.total) / BigInt(10 ** 18)).toString(),
          'DEV'
        );
      }

      // Get auto-compounding delegations
      const autoCompounding =
        await api.query.parachainStaking.autoCompoundingDelegations(
          candidateAddress
        );
      console.log(
        '\nAuto-compounding Delegations Count:',
        autoCompounding.length
      );

      // Calculate some total statistics
      const totalStake =
        BigInt(info.bond) +
        (topDelegations.isSome
          ? BigInt(topDelegations.unwrap().total)
          : BigInt(0)) +
        (bottomDelegations.isSome
          ? BigInt(bottomDelegations.unwrap().total)
          : BigInt(0));

      console.log('\nTotal Statistics:');
      console.log('Total Stake:', totalStake.toString(), 'Wei');
      console.log(
        'Total Stake in DEV:',
        (totalStake / BigInt(10 ** 18)).toString(),
        'DEV'
      );

      // Check recent points (last 3 rounds)
      console.log('\nRecent Points:');
      const currentRound = round.current.toNumber();
      for (let i = 0; i < 3; i++) {
        const roundNumber = currentRound - i;
        const points = await api.query.parachainStaking.awardedPts(
          roundNumber,
          candidateAddress
        );
        console.log(`Round ${roundNumber}: ${points.toString()} points`);
      }
    } else {
      console.log('\nNo candidate information found for this address');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error querying candidate info:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
