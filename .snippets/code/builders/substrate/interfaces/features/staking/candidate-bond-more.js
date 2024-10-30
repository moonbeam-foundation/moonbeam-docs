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
    // Setup candidate account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const candidate = keyring.addFromUri(PRIVATE_KEY);

    // Amount to increase bond by (e.g., 1 DEV = 1_000_000_000_000_000_000)
    const moreBond = '1000000000000000000';

    console.log('Candidate address:', candidate.address);
    console.log('Increasing bond by:', moreBond, 'Wei (1 DEV)');

    // Query current bond before increasing
    const candidateInfo = await api.query.parachainStaking.candidateInfo(candidate.address);
    if (candidateInfo.isSome) {
      console.log('Current bond:', candidateInfo.unwrap().bond.toString());
    }

    // Create the increase bond transaction
    const tx = api.tx.parachainStaking.candidateBondMore(
      moreBond
    );

    // Sign and send the transaction
    await tx.signAndSend(candidate, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(`Transaction included in block hash: ${status.asInBlock}`);
        
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

          // Log successful bond increase
          if (section === 'parachainStaking' && method === 'CandidateBondedMore') {
            const [candidateAddress, amount, newTotal] = data;
            console.log('\nSuccessfully increased candidate bond!');
            console.log('Candidate:', candidateAddress.toString());
            console.log('Amount increased:', amount.toString());
            console.log('New total bond:', newTotal.toString());
          }
        });

        // Query updated bond after transaction
        api.query.parachainStaking.candidateInfo(candidate.address).then(newInfo => {
          if (newInfo.isSome) {
            console.log('\nUpdated bond:', newInfo.unwrap().bond.toString());
          }
          process.exit(0);
        });
      }
    });

  } catch (error) {
    console.error('Error in increasing candidate bond:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});