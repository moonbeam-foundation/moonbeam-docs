import { ApiPromise, WsProvider } from '@polkadot/api';

const asset = {
  V4: {
    id: {
      parents: INSERT_PARENTS,
      interior: INSERT_INTERIOR,
    },
    fun: {
      Fungible: { Fungible: INSERT_AMOUNT_TO_TRANFER },
    },
  },
};
const fee = {
  V4: {
    id: {
      parents: INSERT_PARENTS,
      interior: INSERT_INTERIOR,
    },
    fun: {
      Fungible: { Fungible: INSERT_AMOUNT_FOR_FEE },
    },
  },
};
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
  const tx = api.tx.xTokens.transferMultiassetWithFee(
    asset,
    fee,
    dest,
    destWeightLimit
  );
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();
