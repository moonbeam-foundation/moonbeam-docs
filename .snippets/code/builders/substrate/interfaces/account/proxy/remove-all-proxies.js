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
    // Setup the account that wants to remove all its proxies
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const account = keyring.addFromUri(PRIVATE_KEY);

    console.log('Validation checks:');
    console.log('Account removing all proxies:', account.address);

    // Optional: Query existing proxies before removal
    const proxies = await api.query.proxy.proxies(account.address);
    console.log('\nCurrent proxies before removal:', proxies.toHuman());

    // Create the removeProxies transaction
    const tx = api.tx.proxy.removeProxies();

    // Sign and send the transaction
    await tx.signAndSend(account, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(
          `\nTransaction included in block hash: ${status.asInBlock}`
        );

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

          // Log successful proxy removals
          if (section === 'proxy' && method === 'ProxyRemoved') {
            console.log('\nProxy successfully removed!');
            const [delegator, delegate, proxyType, delay] = data;
            console.log('Delegator:', delegator.toString());
            console.log('Removed delegate:', delegate.toString());
            console.log('Proxy type:', proxyType.toString());
            console.log('Delay:', delay.toString());
          }
        });

        // Optional: Query proxies after removal to confirm
        api.query.proxy.proxies(account.address).then((afterProxies) => {
          console.log('\nProxies after removal:', afterProxies.toHuman());
          process.exit(0);
        });
      }
    });
  } catch (error) {
    console.error('Error in removing all proxies:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
