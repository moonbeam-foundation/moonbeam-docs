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
    // Setup account from private key (this can be any account, doesn't need to be the candidate)
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const executor = keyring.addFromUri(PRIVATE_KEY);

    // The candidate's address whose bond decrease should be executed
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';

    // Query current candidate info before execution
    const candidateInfo = await api.query.parachainStaking.candidateInfo(candidateAddress);
    
    console.log('Execution Details:');
    console.log('Executor address:', executor.address);
    console.log('Candidate address:', candidateAddress);
    
    if (candidateInfo.isSome) {
      const info = candidateInfo.unwrap();
      console.log('\nCandidate current bond:', info.bond.toString());
      console.log('Candidate status:', info.status.toString());
    }

    // Create the execute bond decrease transaction
    const tx = api.tx.parachainStaking.executeCandidateBondLess(
      candidateAddress
    );

    // Sign and send the transaction
    await tx.signAndSend(executor, ({ status, events }) => {
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

          // Log successful execution
          if (section === 'parachainStaking' && method === 'CandidateBondedLess') {
            const [candidate, amount, newBond] = data;
            console.log('\nSuccessfully executed candidate bond decrease!');
            console.log('Candidate:', candidate.toString());
            console.log('Amount decreased:', amount.toString());
            console.log('New bond amount:', newBond.toString());
          }
        });

        // Query updated candidate info after execution
        api.query.parachainStaking.candidateInfo(candidateAddress).then(newInfo => {
          if (newInfo.isSome) {
            const info = newInfo.unwrap();
            console.log('\nUpdated candidate bond:', info.bond.toString());
          }
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Error in executing candidate bond decrease:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});