import { ApiPromise, WsProvider } from '@polkadot/api';

const assets = {
  V4: [
    {
      id: {
        parents: INSERT_PARENTS,
        interior: INSERT_INTERIOR,
      },
      fun: {
        Fungible: { Fungible: INSERT_AMOUNT_TO_TRANFER },
      },
    },
    // Insert additional assets here
  ],
};
const feeItem = INSERT_ASSET_INDEX_FOR_FEE;
const dest = {
  V4: {
    parents: INSERT_PARENTS,
    interior: INSERT_INTERIOR,
  },
};
const destWeightLimit = { Unlimited: null };

const main = async () => {
  // 3. Create Substrate API provider
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.xTokens.transferMultiassets(
    assets,
    feeItem,
    dest,
    destWeightLimit
  );

  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();
