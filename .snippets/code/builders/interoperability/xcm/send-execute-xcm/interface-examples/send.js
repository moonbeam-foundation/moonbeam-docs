import { ApiPromise, WsProvider } from '@polkadot/api';

const dest = { V4: { parents: INSERT_PARENTS, interior: INSERT_INTERIOR } };
const message = { V4: [INSERT_XCM_INSTRUCTIONS] };

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });
  const tx = api.tx.polkadotXcm.send(dest, message);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');
};

main();