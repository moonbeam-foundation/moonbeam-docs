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
    // Setup candidate account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const candidate = keyring.addFromUri(PRIVATE_KEY);

    // Amount to decrease bond by (e.g., 1 DEV = 1_000_000_000_000_000_000)
    const decreaseAmount = '1000000000000000000'; // 1 DEV

    // Get current candidate info
    const candidateInfo = await api.query.parachainStaking.candidateInfo(
      candidate.address
    );

    console.log('Schedule Bond Decrease Details:');
    console.log('Candidate address:', candidate.address);
    console.log('Bond decrease amount:', decreaseAmount, 'Wei (1 DEV)');

    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      console.log('\nCurrent Candidate Status:');
      console.log('Current bond:', info.bond.toString());
      console.log('Delegation Count:', info.delegationCount.toString());
      console.log('Status:', info.status.toString());
    } else {
      console.log('\nWarning: Account is not a candidate');
      process.exit(1);
    }

    // Create the schedule bond decrease transaction
    const tx =
      api.tx.parachainStaking.scheduleCandidateBondLess(decreaseAmount);

    // Get current round
    const round = await api.query.parachainStaking.round();
    const currentRound = round.current.toNumber();

    // Sign and send the transaction
    await tx.signAndSend(candidate, ({ status, events }) => {
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
            method === 'CandidateBondLessRequested'
          ) {
            const [candidate, amountToDecrease, executeRound] = data;
            console.log('\nSuccessfully scheduled bond decrease!');
            console.log('Candidate:', candidate.toString());
            console.log('Amount to decrease:', amountToDecrease.toString());
            console.log('Execute round:', executeRound.toString());
            console.log(
              `\nNote: You must wait until round ${executeRound.toString()} to execute the decrease request`
            );
          }
        });

        // Query final candidate state
        api.query.parachainStaking
          .candidateInfo(candidate.address)
          .then((finalState) => {
            if (finalState.isSome) {
              const info = finalState.unwrap();
              console.log('\nUpdated Candidate Status:');
              console.log('Bond:', info.bond.toString());
              console.log('Delegation Count:', info.delegationCount.toString());
              console.log('Status:', info.status.toString());
            }
            process.exit(0);
          });
      }
    });
  } catch (error) {
    console.error('Error in scheduling bond decrease:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
