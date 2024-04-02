import { ApiPromise, WsProvider } from '@polkadot/api';

const currencyId = {
  ForeignAsset: {
    ForeignAsset: INSERT_ASSET_ID,
  },
};
const amount = INSERT_AMOUNT_TO_TRANFER;
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
  const tx = api.tx.xTokens.transfer(currencyId, amount, dest, destWeightLimit);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();