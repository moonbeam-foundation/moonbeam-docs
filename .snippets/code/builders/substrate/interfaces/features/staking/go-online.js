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
    // Setup collator account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const collator = keyring.addFromUri(PRIVATE_KEY);

    // Query current collator info before going online
    const candidateInfo = await api.query.parachainStaking.candidateInfo(collator.address);
    
    console.log('Collator Details:');
    console.log('Collator address:', collator.address);
    
    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      console.log('\nCurrent Status:');
      console.log('Bond:', info.bond.toString());
      console.log('Delegation Count:', info.delegationCount.toString());
      console.log('Status:', info.status.toString());
    } else {
      console.log('\nWarning: Not found in candidate pool');
      process.exit(1);
    }

    // Create the go online transaction
    const tx = api.tx.parachainStaking.goOnline();

    // Sign and send the transaction
    await tx.signAndSend(collator, ({ status, events }) => {
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

          // Log successful online status change
          if (section === 'parachainStaking' && method === 'CandidateBackOnline') {
            const [collatorAccount] = data;
            console.log('\nSuccessfully went back online!');
            console.log('Collator:', collatorAccount.toString());
          }
        });

        // Query final collator state
        api.query.parachainStaking.candidateInfo(collator.address).then(finalState => {
          if (finalState.isSome) {
            const info = finalState.unwrap();
            console.log('\nUpdated Status:');
            console.log('Bond:', info.bond.toString());
            console.log('Delegation Count:', info.delegationCount.toString());
            console.log('Status:', info.status.toString());
          }
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Error in going online:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});