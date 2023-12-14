import { ApiPromise, WsProvider } from '@polkadot/api';

const location = INSERT_MULTILOCATION;
const transactExtraWeight = {
  refTime: INSERT_REF_TIME,
  proofSize: INSERT_PROOF_SIZE,
};
const maxWeight = {
  refTime: INSERT_REF_TIME,
  proofSize: INSERT_PROOF_SIZE,
};

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.xcmTransactor.setTransactInfo(
    location,
    transactExtraWeight,
    maxWeight
  );
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();