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
    // Setup executor account from private key (this can be any account)
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const executor = keyring.addFromUri(PRIVATE_KEY);

    // The candidate's address who is scheduled to leave
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';

    // Get candidate information and delegation count
    const candidateInfo =
      await api.query.parachainStaking.candidateInfo(candidateAddress);
    let candidateDelegationCount = 0;

    console.log('Execution Details:');
    console.log('Executor address:', executor.address);
    console.log('Candidate address:', candidateAddress);

    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      candidateDelegationCount = info.delegationCount;
      console.log('\nCandidate Information:');
      console.log('Current bond:', info.bond.toString());
      console.log('Delegation count:', candidateDelegationCount.toString());
      console.log('Status:', info.status.toString());
    } else {
      console.log('\nWarning: Candidate info not found');
    }

    // Create the execute leave candidates transaction
    const tx = api.tx.parachainStaking.executeLeaveCandidates(
      candidateAddress,
      candidateDelegationCount
    );

    // Sign and send the transaction
    await tx.signAndSend(executor, ({ status, events }) => {
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

          // Log successful execution of leave request
          if (section === 'parachainStaking' && method === 'CandidateLeft') {
            const [candidate, amount, remainingCount] = data;
            console.log('\nSuccessfully executed leave candidates request!');
            console.log('Candidate:', candidate.toString());
            console.log('Amount unlocked:', amount.toString());
            console.log('Remaining candidates:', remainingCount.toString());
          }
        });

        // Query final candidate state
        api.query.parachainStaking
          .candidateInfo(candidateAddress)
          .then((finalState) => {
            if (finalState.isNone) {
              console.log(
                '\nCandidate has been successfully removed from the candidate pool'
              );
            } else {
              console.log('\nWarning: Candidate still exists in the pool');
              console.log('Current state:', finalState.unwrap().toString());
            }
            process.exit(0);
          });
      }
    });
  } catch (error) {
    console.error('Error in executing leave candidates request:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
