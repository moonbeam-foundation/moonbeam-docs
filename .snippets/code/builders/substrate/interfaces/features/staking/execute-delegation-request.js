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

    // The delegator's address whose request will be executed
    const delegatorAddress = 'INSERT_DELEGATOR_ADDRESS';

    // The candidate's address for the delegation request
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';

    // Query current delegation info before execution
    const delegatorState =
      await api.query.parachainStaking.delegatorState(delegatorAddress);

    console.log('Execution Details:');
    console.log('Executor address:', executor.address);
    console.log('Delegator address:', delegatorAddress);
    console.log('Candidate address:', candidateAddress);

    if (delegatorState.isSome) {
      const state = delegatorState.unwrap();
      const currentDelegation = state.delegations.find(
        (d) =>
          d.owner.toString().toLowerCase() === candidateAddress.toLowerCase()
      );
      if (currentDelegation) {
        console.log(
          '\nCurrent delegation amount:',
          currentDelegation.amount.toString()
        );
      }
    }

    // Create the execute delegation request transaction
    const tx = api.tx.parachainStaking.executeDelegationRequest(
      delegatorAddress,
      candidateAddress
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

          // Log successful delegation decrease/revoke
          if (
            section === 'parachainStaking' &&
            method === 'DelegationDecreased'
          ) {
            const [delegator, candidate, amount, inTopDelegations] = data;
            console.log('\nSuccessfully executed delegation decrease!');
            console.log('Delegator:', delegator.toString());
            console.log('Candidate:', candidate.toString());
            console.log('Amount decreased:', amount.toString());
            console.log('In top delegations:', inTopDelegations.toString());
          }

          if (
            section === 'parachainStaking' &&
            method === 'DelegationRevoked'
          ) {
            const [delegator, candidate, amount] = data;
            console.log('\nSuccessfully executed delegation revocation!');
            console.log('Delegator:', delegator.toString());
            console.log('Candidate:', candidate.toString());
            console.log('Amount revoked:', amount.toString());
          }
        });

        // Query updated delegation info after execution
        api.query.parachainStaking
          .delegatorState(delegatorAddress)
          .then((newState) => {
            if (newState.isSome) {
              const state = newState.unwrap();
              const updatedDelegation = state.delegations.find(
                (d) =>
                  d.owner.toString().toLowerCase() ===
                  candidateAddress.toLowerCase()
              );
              if (updatedDelegation) {
                console.log(
                  '\nNew delegation amount:',
                  updatedDelegation.amount.toString()
                );
              } else {
                console.log('\nDelegation has been fully revoked');
              }
            }
            process.exit(0);
          });
      }
    });
  } catch (error) {
    console.error('Error in executing delegation request:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
