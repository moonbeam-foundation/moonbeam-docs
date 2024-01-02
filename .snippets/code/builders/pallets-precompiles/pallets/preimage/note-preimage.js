import { ApiPromise, WsProvider } from '@polkadot/api';

const encodedProposal = INSERT_ENCODED_PROPOSAL;

const main = async () => {
const api = await ApiPromise.create({
  provider: new WsProvider('INSERT_WSS_ENDPOINT'),
});

const tx = api.tx.preimage.notePreimage(encodedProposal);
const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

api.disconnect();
};

main();