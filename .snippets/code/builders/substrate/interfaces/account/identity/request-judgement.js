import { ApiPromise, WsProvider } from '@polkadot/api';

const regIndex = INSERT_REGISTRAR_INDEX;
const maxFee = INSERT_MAX_FEE;

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.requestJudgement(regIndex, maxFee);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
