import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  // Initialize the keyring with ethereum type
  const keyring = new Keyring({ type: 'ethereum' });

  try {
    // Setup collator account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const collator = keyring.addFromUri(PRIVATE_KEY);

    // Get current candidate pool information
    const candidates = await api.query.parachainStaking.candidatePool();
    const candidateCount = candidates.length;

    // Get current candidate info
    const candidateInfo = await api.query.parachainStaking.candidateInfo(
      collator.address
    );

    console.log('Schedule Leave Details:');
    console.log('Collator address:', collator.address);
    console.log('Current candidate count:', candidateCount);

    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      console.log('\nCurrent Candidate Status:');
      console.log('Bond:', info.bond.toString());
      console.log('Delegation Count:', info.delegationCount.toString());
      console.log('Status:', info.status.toString());
    } else {
      console.log('\nWarning: Account is not a candidate');
      process.exit(1);
    }

    // Create the schedule leave transaction
    const tx = api.tx.parachainStaking.scheduleLeaveCandidates(candidateCount);

    // Get the current round
    const round = await api.query.parachainStaking.round();
    const currentRound = round.current.toNumber();

    // Sign and send the transaction
    await tx.signAndSend(collator, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(
          `\nTransaction included in block hash: ${status.asInBlock}`
        );

        // Process events
        events.forEach(({ event }) => {
          const { section, method, data } = event;
          console.log(`\t${section}.${method}:`, data.toString());

          // Handle any failures
          if (section === 'system' && method === 'ExtrinsicFailed') {
            const [dispatchError] = data;
            let errorInfo;

            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(
                dispatchError.asModule
              );
              errorInfo = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
            } else {
              errorInfo = dispatchError.toString();
            }
            console.error('Failure reason:', errorInfo);
          }

          // Log successful scheduling
          if (
            section === 'parachainStaking' &&
            method === 'CandidateScheduledExit'
          ) {
            const [round, candidate, scheduledExit] = data;
            console.log('\nSuccessfully scheduled leave candidates!');
            console.log('Candidate:', candidate.toString());
            console.log('Current round:', round.toString());
            console.log('Scheduled exit round:', scheduledExit.toString());
            console.log(
              `\nNote: You must wait until round ${scheduledExit.toString()} to execute the leave request`
            );
          }
        });

        // Query final candidate state
        api.query.parachainStaking
          .candidateInfo(collator.address)
          .then((finalState) => {
            if (finalState.isSome) {
              const info = finalState.unwrap();
              console.log('\nUpdated Candidate Status:');
              console.log('Bond:', info.bond.toString());
              console.log('Delegation Count:', info.delegationCount.toString());
              console.log(
                'Status:',
                info.status.toString(),
                '(Leaving status shows the exit round)'
              );
            }
            process.exit(0);
          });
      }
    });
  } catch (error) {
    console.error('Error in scheduling leave candidates:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
