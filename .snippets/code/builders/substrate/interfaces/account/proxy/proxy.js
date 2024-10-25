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
    // Setup proxy account from private key
    const PROXY_PRIVATE_KEY = 'INSERT_PROXY_PRIVATE_KEY';
    const proxyAccount = keyring.addFromUri(PROXY_PRIVATE_KEY);

    // The real account that we're making the transaction for
    const realAccount = 'INSERT_REAL_ACCOUNT';

    // Destination account for the simple demo transfer
    const destinationAccount = 'INSERT_DESTINATION_ADDRESS';

    // Amount to transfer (1 DEV = 1e18 Wei)
    const transferAmount = '1000000000000000000'; // 1 DEV

    // Create the transfer call that we want to make via proxy
    const transferCall = api.tx.balances.transferAllowDeath(
      destinationAccount,
      transferAmount
    );

    // Create the proxy transaction
    // We'll specify Balances as the force proxy type since we're doing a transfer
    const tx = api.tx.proxy.proxy(
      realAccount,
      { Any: null }, // forceProxyType
      transferCall
    );

    console.log('Validation checks:');
    console.log('Proxy account:', proxyAccount.address);
    console.log('Real account:', realAccount);
    console.log('Destination account:', destinationAccount);
    console.log('Transfer amount:', transferAmount, 'Wei (1 DEV)');

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

          // Log successful transfer
          if (section === 'balances' && method === 'Transfer') {
            console.log('\nTransfer successfully executed via proxy!');
            const [from, to, amount] = data;
            console.log('From:', from.toString());
            console.log('To:', to.toString());
            console.log('Amount:', amount.toString());
          }
        });

        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error in proxy transaction:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});
