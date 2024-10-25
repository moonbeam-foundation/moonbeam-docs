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
    // Setup proxy account from private key (this is the account executing the call)
    const PROXY_PRIVATE_KEY = 'INSERT_PROXY_PRIVATE_KEY';
    const proxyAccount = keyring.addFromUri(PROXY_PRIVATE_KEY);
    
    // The account that delegated proxy rights
    const realAccount = 'INSERT_REAL_ACCOUNT';
    
    // The delegate account (the proxy account that made the announcement)
    const delegateAccount = proxyAccount.address;
    
    // Destination account for the transfer
    const destinationAccount = 'INSERT_DESTINATION_ADDRESS';

    // Amount to transfer (1 DEV = 1e18 Wei)
    const transferAmount = '1000000000000000000'; // 1 DEV

    // Create the transfer call that was previously announced
    const transferCall = api.tx.balances.transferAllowDeath(
      destinationAccount,
      transferAmount
    );

    // Create the proxyAnnounced transaction
    const tx = api.tx.proxy.proxyAnnounced(
      delegateAccount,
      realAccount,
      { Balances: null }, // forceProxyType
      transferCall
    );

    console.log('Validation checks:');
    console.log('Delegate (Proxy) account:', delegateAccount);
    console.log('Real account:', realAccount);
    console.log('Force proxy type: Balances');
    console.log('Call details:');
    console.log('- Destination:', destinationAccount);
    console.log('- Amount:', transferAmount, 'Wei (1 DEV)');

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

          // Log successful proxy execution
          if (section === 'proxy' && method === 'ProxyExecuted') {
            console.log('\nProxy call successfully executed!');
          }

          // Log successful transfer
          if (section === 'balances' && method === 'Transfer') {
            const [from, to, amount] = data;
            console.log('Transfer details:');
            console.log('From:', from.toString());
            console.log('To:', to.toString());
            console.log('Amount:', amount.toString());
          }
        });
        
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('Error in proxy announced transaction:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});