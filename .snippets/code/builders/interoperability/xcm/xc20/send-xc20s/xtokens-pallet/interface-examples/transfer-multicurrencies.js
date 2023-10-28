import { ApiPromise, WsProvider } from '@polkadot/api';

const currencies = [
  [
    {
      ForeignAsset: {
        ForeignAsset: INSERT_ASSET_ID,
      },
    },
    INSERT_AMOUNT_TO_TRANSFER,
  ],
  // Insert additional currencies
];
const feeItem = INSERT_ASSET_INDEX_FOR_FEE;
const dest = {
  V3: {
    parents: INSERT_PARENTS,
    interior: INSERT_INTERIOR,
  },
};
const destWeightLimit = { Unlimited: null };

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.xTokens.transferMulticurrencies(
    currencies,
    feeItem,
    dest,
    destWeightLimit
  );

  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();