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
    // Setup the real account (the one that will reject the announcement)
    const REAL_PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const realAccount = keyring.addFromUri(REAL_PRIVATE_KEY);

    // The proxy account that made the announcement
    const delegateAccount = 'INSERT_PROXY_ACCOUNT';

    // The call hash of the announcement to reject
    const callHash = 'INSERT_CALL_HASH';

    console.log('Validation checks:');
    console.log('Real account (rejector):', realAccount.address);
    console.log('Delegate account to reject:', delegateAccount);
    console.log('Call hash to reject:', callHash);

    // Create the reject announcement transaction
    const tx = api.tx.proxy.rejectAnnouncement(delegateAccount, callHash);

    // Sign and send the transaction
    await tx.signAndSend(realAccount, ({ status, events }) => {
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
              const decoded = api.registry.findMetaError(
                dispatchError.asModule
              );
              errorInfo = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
            } else {
              errorInfo = dispatchError.toString();
            }
            console.error('Failure reason:', errorInfo);
          }

          // Log successful rejection
          if (section === 'proxy' && method === 'AnnouncementRejected') {
            console.log('\nAnnouncement successfully rejected!');
            const [accountId, hash] = data;
            console.log('Rejected delegate:', accountId.toString());
            console.log('Rejected call hash:', hash.toString());
          }
        });

        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error in rejecting announcement:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
