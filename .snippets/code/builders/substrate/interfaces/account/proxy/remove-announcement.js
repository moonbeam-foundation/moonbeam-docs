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
    // Setup the proxy account (the one that will remove its own announcement)
    const PROXY_PRIVATE_KEY = 'INSERT_PROXY_PRIVATE_KEY';
    const proxyAccount = keyring.addFromUri(PROXY_PRIVATE_KEY);
    
    // The real account that the announcement was made for
    const realAccount = 'INSERT_REAL_ACCOUNT';
    
    // The call hash of the announcement to remove
    const callHash = 'INSERT_CALL_HASH';

    console.log('Validation checks:');
    console.log('Proxy account (remover):', proxyAccount.address);
    console.log('Real account:', realAccount);
    console.log('Call hash to remove:', callHash);

    // Create the remove announcement transaction
    const tx = api.tx.proxy.removeAnnouncement(
      realAccount,
      callHash
    );

    // Sign and send the transaction
    await tx.signAndSend(proxyAccount, ({ status, events }) => {
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

          // Log successful announcement removal
          if (section === 'proxy' && method === 'AnnouncementRejected') {
            console.log('\nAnnouncement successfully removed!');
            const [accountId, hash] = data;
            console.log('Removed for real account:', accountId.toString());
            console.log('Removed call hash:', hash.toString());
          }
        });
        
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Error in removing announcement:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});