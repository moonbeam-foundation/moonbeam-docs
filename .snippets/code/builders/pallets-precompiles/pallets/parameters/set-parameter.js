// This is an example of crafting the encoded call data via the Polkadot API
// but remember you won't submit the call here as it needs to go thru governance.

import { ApiPromise, WsProvider } from '@polkadot/api';

const main = async () => {
  // Replace with your node's WSS endpoint
  const provider = new WsProvider('INSERT_WSS_ENDPOINT');
  const api = await ApiPromise.create({ provider });

  // Construct the setParameter call for changing the randomness deposit
  // Keep in mind that actual submission must go through governance (proposal, voting, etc.)
  const tx = api.tx.parameters.setParameter({
    PalletRandomness: {
      // The deposit parameter is declared as a tuple: (variant, Option<u128>).
      // Here we're setting the deposit to 5 tokens (5000000000000000000),
      // e.g., 'MoonbaseRuntimeRuntimeParamsDynamicParamsPalletRandomnessDeposit' is the variant,
      // and the second element is the actual deposit value in the Option<u128>.
      Deposit: [
        'MoonbaseRuntimeRuntimeParamsDynamicParamsPalletRandomnessDeposit',
        '5000000000000000000',
      ],
    },
  });

  // Print out the call in hex format (useful for creating a governance proposal)
  console.log('Encoded call data:', tx.toHex());

  await api.disconnect();
};

main();
