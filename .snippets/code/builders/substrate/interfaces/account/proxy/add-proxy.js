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
    // Setup account from private key
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const account = keyring.addFromUri(PRIVATE_KEY);

    // Use an existing account as proxy
    const proxyAccount = 'INSERT_PROXY_ACCOUNT';

    // Define proxy parameters
    // Use the Staking variant from the ProxyType enum
    const proxyType = { Staking: null };
    const delay = 0; // No delay

    console.log('Validation checks:');
    console.log('Account address:', account.address);
    console.log('Proxy account address:', proxyAccount);
    console.log('Proxy type:', JSON.stringify(proxyType));
    console.log('Delay:', delay);

    // Create the addProxy transaction
    const tx = api.tx.proxy.addProxy(proxyAccount, proxyType, delay);

    // Sign and send the transaction
    await tx.signAndSend(account, ({ status, events }) => {
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

          // Log successful proxy addition
          if (section === 'proxy' && method === 'ProxyAdded') {
            console.log('Proxy successfully added!');
          }
        });

        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error in adding proxy:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
