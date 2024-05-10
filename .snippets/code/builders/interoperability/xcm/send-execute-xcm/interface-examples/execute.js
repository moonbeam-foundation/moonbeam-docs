import { ApiPromise, WsProvider } from '@polkadot/api';

const message = { V4: [INSERT_XCM_INSTRUCTIONS] };
const maxWeight = { refTime: INSERT_REF_TIME, proofSize: INSERT_PROOF_SIZE };

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.polkadotXcm.execute(message, maxWeight);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();