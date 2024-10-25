import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { bnToHex, stringToHex } from '@polkadot/util';

const main = async () => {
  // Initialize API connection
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });
  const keyring = new Keyring({ type: 'ethereum' });

  try {
    // Configuration
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';
    const MULTISIG_ADDRESS = 'INSERT_ADDRESS_MULTISIG';

    // Multisig parameters
    const threshold = 2;
    const otherSignatories = ['INSERT_SIGNER_1', 'INSERT_SIGNER_2'].sort(); // Addresses must be sorted

    // Create an EVM transaction
    const TARGET_ADDRESS = 'INSERT_DESTINATION_ADDRESS';
    const VALUE = '1000000000000000000'; // 1 TOKEN in Wei

    // Construct the EVM call data
    const call = api.tx.evm.call(
      MULTISIG_ADDRESS, // source address
      TARGET_ADDRESS, // target address
      VALUE, // value in Wei
      '0x', // input data (empty for simple transfer)
      '2100000', // gas limit
      '1000000000', // max fee per gas (1 GWei)
      '1000000000', // max priority fee per gas (1 GWei)
      null, // nonce (optional)
      [] // access list (optional)
    );

    // Weight limits for the dispatch
    const maxWeight = {
      refTime: '806342022',
      proofSize: '211174',
    };

    const account = keyring.addFromUri(PRIVATE_KEY);

    // Check for existing timepoint
    const callHash = call.method.hash.toHex();
    const multisigs = await api.query.multisig.multisigs(
      MULTISIG_ADDRESS,
      callHash
    );

    let maybeTimepoint = null;
    if (multisigs.isSome) {
      const multisigInfo = multisigs.unwrap();
      maybeTimepoint = {
        height: multisigInfo.when.height.toNumber(),
        index: multisigInfo.when.index.toNumber(),
      };
    }

    console.log('Validation checks:');
    console.log('Account address:', account.address);
    console.log('Multisig address:', MULTISIG_ADDRESS);
    console.log('Other signatories:', otherSignatories);
    console.log('Threshold:', threshold);
    console.log('Call hash:', callHash);
    console.log('Max weight:', maxWeight);
    console.log('Timepoint:', maybeTimepoint);

    // Create and send the asMulti transaction
    const tx = api.tx.multisig.asMulti(
      threshold,
      otherSignatories,
      maybeTimepoint,
      call,
      maxWeight
    );

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
        });

        // Check for specific multisig events
        const multisigEvent = events.find(
          ({ event }) =>
            event.section === 'multisig' &&
            (event.method === 'MultisigExecuted' ||
              event.method === 'NewMultisig')
        );

        if (multisigEvent) {
          console.log('Multisig event:', multisigEvent.event.method);
        }

        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error in multisig execution:', error);
    process.exit(1);
  }
};

// Execute the script
main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});