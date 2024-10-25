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
    // Setup delegator account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const delegator = keyring.addFromUri(PRIVATE_KEY);

    // The candidate's address to delegate to
    const candidateAddress = 'INSERT_COLLATOR_ADDRESS';
    
    // Amount to delegate (e.g., 1 DEV = 1_000_000_000_000_000_000)
    const amount = '1000000000000000000';

    // Auto-compound percentage (0-100)
    const autoCompound = 50; // 50% of rewards will be auto-compounded

    // Get current delegation counts
    const candidateInfo = await api.query.parachainStaking.candidateInfo(candidateAddress);
    const delegatorState = await api.query.parachainStaking.delegatorState(delegator.address);
    const autoCompoundDelegations = await api.query.parachainStaking.autoCompoundingDelegations(candidateAddress);

    // Get delegation counts
    let candidateDelegationCount = 0;
    let candidateAutoCompoundingDelegationCount = 0;
    let delegationCount = 0;

    if (candidateInfo.isSome) {
      candidateDelegationCount = candidateInfo.unwrap().delegationCount;
    }

    candidateAutoCompoundingDelegationCount = autoCompoundDelegations.length;

    if (delegatorState.isSome) {
      delegationCount = delegatorState.unwrap().delegations.length;
    }

    console.log('Delegation Details:');
    console.log('Delegator address:', delegator.address);
    console.log('Candidate address:', candidateAddress);
    console.log('Delegation amount:', amount, 'Wei (1 DEV)');
    console.log('Auto-compound percentage:', autoCompound, '%');
    console.log('\nCurrent Stats:');
    console.log('Candidate delegation count:', candidateDelegationCount.toString());
    console.log('Candidate auto-compounding delegation count:', candidateAutoCompoundingDelegationCount.toString());
    console.log('Delegator total delegations:', delegationCount.toString());

    // Create the delegate with auto-compound transaction
    const tx = api.tx.parachainStaking.delegateWithAutoCompound(
      candidateAddress,
      amount,
      autoCompound,
      candidateDelegationCount,
      candidateAutoCompoundingDelegationCount,
      delegationCount
    );

    // Sign and send the transaction
    await tx.signAndSend(delegator, ({ status, events }) => {
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

          // Log successful delegation
          if (section === 'parachainStaking' && method === 'Delegation') {
            const [delegator, amount, candidate, autoCompound] = data;
            console.log('\nSuccessfully delegated with auto-compound!');
            console.log('Delegator:', delegator.toString());
            console.log('Candidate:', candidate.toString());
            console.log('Amount:', amount.toString());
            console.log('Auto-compound percentage:', autoCompound.toString(), '%');
          }
        });
        
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Error in delegation with auto-compound:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});