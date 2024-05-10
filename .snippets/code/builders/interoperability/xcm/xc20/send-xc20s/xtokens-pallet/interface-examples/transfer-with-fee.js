import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'; // Version 10.13.1

const currencyId = {
  ForeignAsset: {
    ForeignAsset: INSERT_ASSET_ID,
  },
};
const amount = INSERT_AMOUNT_TO_TRANSFER;
const fee = INSERT_AMOUNT_FOR_FEE;
const dest = {
  V4: {
    parents: INSERT_PARENTS,
    interior: INSERT_INTERIOR,
  },
};
const destWeightLimit = { Unlimited: null };

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.xTokens.transferWithFee(
    currencyId,
    amount,
    fee,
    dest,
    destWeightLimit
  );
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();