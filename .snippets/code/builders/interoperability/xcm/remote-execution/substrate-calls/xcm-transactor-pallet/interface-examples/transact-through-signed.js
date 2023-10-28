import { ApiPromise, WsProvider } from '@polkadot/api';

const dest = {
  V3: {
    parents: INSERT_PARENTS,
    interior: INSERT_INTERIOR,
  },
};
const fee = {
  currency: {
    AsCurrencyId: { ForeignAsset: INSERT_ASSET_ID },
  },
  feeAmount: INSERT_FEE_AMOUNT,
};
const call = 'INSERT_ENCODED_CALL_DATA';
const weightInfo = {
  transactRequiredWeightAtMost: {
    refTime: INSERT_REF_TIME,
    proofSize: INSERT_PROOF_SIZE,
  },
  overallWeight: { refTime: INSERT_REF_TIME, proofSize: INSERT_PROOF_SIZE },
};
const refund = INSERT_BOOLEAN_FOR_REFUND;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.xcmTransactor.transactThroughSigned(
    dest,
    fee,
    call,
    weightInfo,
    refund
  );
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();      