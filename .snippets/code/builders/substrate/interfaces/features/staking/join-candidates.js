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
    // Setup account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const account = keyring.addFromUri(PRIVATE_KEY);

    // Set bond amount to 500 DEV (multiply by 10^18 for proper decimals)
    const bondAmount = '500000000000000000000';

    // Get current candidate count
    const candidates = await api.query.parachainStaking.candidatePool();
    const candidateCount = candidates.length;

    // Check account balance
    const balance = await api.query.system.account(account.address);
    
    console.log('Join Candidates Details:');
    console.log('Account address:', account.address);
    console.log('Current free balance:', balance.data.free.toString());
    console.log('Bond amount:', bondAmount, '(501 DEV)');
    console.log('Current candidate count:', candidateCount);

    // Create the join candidates transaction
    const tx = api.tx.parachainStaking.joinCandidates(
      bondAmount,
      candidateCount
    );

    // Sign and send the transaction
    await tx.signAndSend(account, ({ status, events }) => {
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

          // Log successful joining
          if (section === 'parachainStaking' && method === 'JoinedCollatorCandidates') {
            const [account, amountLocked, newTotalAmountLocked] = data;
            console.log('\nSuccessfully joined collator candidates!');
            console.log('Account:', account.toString());
            console.log('Amount locked:', amountLocked.toString());
            console.log('New total amount locked:', newTotalAmountLocked.toString());
          }
        });

        // Query final candidate state
        api.query.parachainStaking.candidateInfo(account.address).then(finalState => {
          if (finalState.isSome) {
            const info = finalState.unwrap();
            console.log('\nNew Candidate Status:');
            console.log('Bond:', info.bond.toString());
            console.log('Delegation Count:', info.delegationCount.toString());
            console.log('Status:', info.status.toString());
          }
          
          // Get updated candidate count
          api.query.parachainStaking.candidatePool().then(newCandidates => {
            console.log('New candidate count:', newCandidates.length);
            process.exit(0);
          });
        });
      }
    });

  } catch (error) {
    console.error('Error in joining candidates:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});