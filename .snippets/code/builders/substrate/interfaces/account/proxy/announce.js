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
    // Setup accounts
    const PROXY_PRIVATE_KEY = 'INSERT_PROXY_PRIVATE_KEY';
    const proxyAccount = keyring.addFromUri(PROXY_PRIVATE_KEY);

    // The real account that the proxy will act on behalf of
    const realAccount = 'INSERT_REAL_ACCOUNT';

    // Use the provided call hash
    const callHash = 'INSERT_CALL_HASH';

    console.log('Validation checks:');
    console.log('Proxy account address:', proxyAccount.address);
    console.log('Real account address:', realAccount);
    console.log('Call hash:', callHash);

    // Create the announce transaction
    const tx = api.tx.proxy.announce(realAccount, callHash);

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
              const decoded = api.registry.findMetaError(
                dispatchError.asModule
              );
              errorInfo = `${decoded.section}.${decoded.name}: ${decoded.docs}`;
            } else {
              errorInfo = dispatchError.toString();
            }
            console.error('Failure reason:', errorInfo);
          }

          // Log successful announcement
          if (section === 'proxy' && method === 'Announced') {
            console.log('Proxy call successfully announced!');
            console.log(
              'You can execute the actual call after the delay period'
            );
          }
        });

        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error in announcing proxy call:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
