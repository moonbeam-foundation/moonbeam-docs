import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

const main = async () => {
  // Initialize the API
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io')
  });

  // Initialize the keyring with ethereum type
  const keyring = new Keyring({ type: 'ethereum' });

  try {
    // Setup notifier account from private key (this can be any account)
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const notifier = keyring.addFromUri(PRIVATE_KEY);

    // The potentially inactive collator's address
    const inactiveCollator = 'INSERT_COLLATOR_ADDRESS';

    // Get max offline rounds from constants
    const maxOfflineRounds = await api.consts.parachainStaking.maxOfflineRounds;

    // Get current round info
    const round = await api.query.parachainStaking.round();
    
    // Get collator info
    const collatorInfo = await api.query.parachainStaking.candidateInfo(inactiveCollator);

    console.log('Notify Inactive Collator Details:');
    console.log('Notifier address:', notifier.address);
    console.log('Inactive collator address:', inactiveCollator);
    console.log('Maximum allowed offline rounds:', maxOfflineRounds.toString());
    console.log('Current round:', round.current.toString());

    if (collatorInfo.isSome) {
      const info = collatorInfo.unwrap();
      console.log('\nCollator Current Status:');
      console.log('Bond:', info.bond.toString());
      console.log('Delegation Count:', info.delegationCount.toString());
      console.log('Status:', info.status.toString());
    }

    // Create the notify inactive collator transaction
    const tx = api.tx.parachainStaking.notifyInactiveCollator(
      inactiveCollator
    );

    // Sign and send the transaction
    await tx.signAndSend(notifier, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(`\nTransaction included in block hash: ${status.asInBlock}`);
        
        // Process events
        events.forEach(({ event }) => {
          const { section, method, data } = event;
          console.log(`\t${section}.${method}:`, data.toString());
          
          // Handle any failures
          if (section === 'system' && method === 'ExtrinsicFailed') {
            const [dispatchError] = data;
            let errorInfo;
            
            if (dispatchError.isModule) {
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              errorInfo = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
            } else {
              errorInfo = dispatchError.toString();
            }
            console.error('Failure reason:', errorInfo);
          }

          // Log successful notification
          if (section === 'parachainStaking' && method === 'CollatorWentOffline') {
            const [collatorAccount] = data;
            console.log('\nSuccessfully notified inactive collator!');
            console.log('Collator:', collatorAccount.toString());
          }
        });

        // Query final collator state
        api.query.parachainStaking.candidateInfo(inactiveCollator).then(finalState => {
          if (finalState.isSome) {
            const info = finalState.unwrap();
            console.log('\nUpdated Collator Status:');
            console.log('Bond:', info.bond.toString());
            console.log('Delegation Count:', info.delegationCount.toString());
            console.log('Status:', info.status.toString());
          }
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Error in notifying inactive collator:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});