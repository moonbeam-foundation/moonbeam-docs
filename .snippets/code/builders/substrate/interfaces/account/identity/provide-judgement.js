import { ApiPromise, WsProvider } from '@polkadot/api';

const regIndex = 'INSERT_REGISTRAR_INDEX';
const target = 'INSERT_TARGET_ACCOUNT';
const judgement = 'INSERT_JUDGEMENT';
const identity = 'INSERT_IDENTITY';

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.identity.provideJudgement(
    regIndex,
    target,
    judgement,
    identity
  );
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
