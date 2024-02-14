import { ApiPromise, WsProvider } from '@polkadot/api';

const action = 'InitOpen'; // Or 'Accept', 'Close', or 'Cancel'
const fee = {
  currency: {
    AsCurrencyId: { ForeignAsset: INSERT_ASSET_ID },
  },
  feeAmount: INSERT_FEE_AMOUNT,
};
const weightInfo = {
  transactRequiredWeightAtMost: {
    refTime: INSERT_REF_TIME,
    proofSize: INSERT_PROOF_SIZE,
  },
  overallWeight: { Unlimited: null },
};

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.xcmTransactor.hrmpManage(action, fee, weightInfo);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};
main();
