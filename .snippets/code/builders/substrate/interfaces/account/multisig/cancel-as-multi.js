import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('wss://moonbase-alpha.public.blastapi.io'),
  });

  const keyring = new Keyring({ type: 'ethereum' });

  try {
    const PRIVATE_KEY = 'INSERT_PRIVATE_KEY';

    const threshold = 2;
    const otherSignatories = ['INSERT_SIGNER_1', 'INSERT_SIGNER_2'].sort();

    const callHash = 'INSERT_CALL_HASH';

    // Query the multisig address for the timepoint
    const MULTISIG_ADDRESS = 'INSERT_ADDRESS_MULTISIG';
    const multisigs = await api.query.multisig.multisigs(
      MULTISIG_ADDRESS,
      callHash
    );

    if (!multisigs.isSome) {
      console.error('No existing multisig found for this call hash');
      process.exit(1);
    }

    const multisigInfo = multisigs.unwrap();
    const timepoint = {
      height: multisigInfo.when.height.toNumber(),
      index: multisigInfo.when.index.toNumber(),
    };

    const account = keyring.addFromUri(PRIVATE_KEY);

    console.log('Found timepoint:', timepoint);
    console.log('Validation checks:');
    console.log('Account address:', account.address);
    console.log('Multisig address:', MULTISIG_ADDRESS);
    console.log('Other signatories:', otherSignatories);
    console.log('Threshold:', threshold);
    console.log('Call hash:', callHash);
    console.log('Timepoint:', timepoint);

    const tx = api.tx.multisig.cancelAsMulti(
      threshold,
      otherSignatories,
      timepoint,
      callHash
    );

    await tx.signAndSend(account, ({ status, events }) => {
      if (status.isInBlock) {
        console.log(`Transaction included in block hash: ${status.asInBlock}`);

        events.forEach(({ event }) => {
          const { section, method, data } = event;
          console.log(`\t${section}.${method}:`, data.toString());

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
        process.exit(0);
      }
    });
  } catch (error) {
    console.error('Error in multisig cancellation:', error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('Script error:', error);
  process.exit(1);
});