import { typesBundlePre900 } from 'moonbeam-types-bundle';
import { ApiPromise, WsProvider } from '@polkadot/api';

// This script will listen to all GLMR transfers (Substrate & Ethereum) and extract the tx hash
// It can be adapted for Moonriver or Moonbase Alpha

const main = async () => {
  // Define the provider for Moonbeam
  const wsProvider = new WsProvider('wss://wss.api.moonbeam.network');
  // Create the provider using Moonbeam types
  const polkadotApi = await ApiPromise.create({
    provider: wsProvider,
    typesBundle: typesBundlePre900 as any,
  });

  // Subscribe to finalized blocks
  await polkadotApi.rpc.chain.subscribeFinalizedHeads(
    async (lastFinalizedHeader) => {
      const [{ block }, records] = await Promise.all([
        polkadotApi.rpc.chain.getBlock(lastFinalizedHeader.hash),
        polkadotApi.query.system.events.at(lastFinalizedHeader.hash),
      ]);

      block.extrinsics.forEach((extrinsic, index) => {
        const {
          method: { args, method, section },
        } = extrinsic;

        const isEthereum = section == 'ethereum' && method == 'transact';

        // Gets the transaction object
        const tx = args[0] as any;

        // Convert to the correct Ethereum Transaction format
        const ethereumTx =
          isEthereum &&
          ((tx.isLegacy && tx.asLegacy) ||
            (tx.isEip1559 && tx.asEip1559) ||
            (tx.isEip2930 && tx.asEip2930));

        // Check if the transaction is a transfer
        const isEthereumTransfer =
          ethereumTx &&
          ethereumTx.input.length === 0 &&
          ethereumTx.action.isCall;

        // Retrieve all events for this extrinsic
        const events = records.filter(
          ({ phase }) =>
            phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)
        );

        // This hash will only exist if the transaction was executed through Ethereum.
        let ethereumHash = '';

        if (isEthereum) {
          // Search for Ethereum execution
          events.forEach(({ event }) => {
            if (event.section == 'ethereum' && event.method == 'Executed') {
              ethereumHash = event.data[2].toString();
            }
          });
        }

        // Search if it is a transfer
        events.forEach(({ event }) => {
          if (event.section == 'balances' && event.method == 'Transfer') {
            const from = event.data[0].toString();
            const to = event.data[1].toString();
            const balance = (event.data[2] as any).toBigInt();

            const substrateHash = extrinsic.hash.toString();

            console.log(
              `Transfer from ${from} to ${to} of ${balance} (block #${lastFinalizedHeader.number})`
            );
            console.log(`  - Triggered by extrinsic: ${substrateHash}`);
            if (isEthereum) {
              console.log(
                `  - Ethereum (isTransfer: ${isEthereumTransfer}) hash: ${ethereumHash}`
              );
            }
          }
        });
      });
    }
  );
};

main();
