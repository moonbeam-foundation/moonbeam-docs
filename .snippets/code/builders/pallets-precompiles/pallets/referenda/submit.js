import { ApiPromise, WsProvider } from '@polkadot/api';

const proposalOrigin = INSERT_PROPOSAL_ORIGIN;
/*
For Root Origin, use the following format:
const proposalOrigin = { system: 'Root' };

For all other OpenGov Origins, use the following format:
const proposalOrigin = { Origins: 'INSERT_ORIGIN_NAME_OR_INDEX' };
*/

const proposal = {
  Lookup: {
    hash_: 'INSERT_PREIMAGE_HASH',
    len: 'INSERT_PREIMAGE_LENGTH'
  }
};

const enactmentMoment = { At: INSERT_BLOCK };
/*
Or for After, use the following:
const enactmentMoment = { After: INSERT_BLOCK }
*/

const main = async () => {
const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
});

const tx = api.tx.referenda.submit(
    proposalOrigin,
    proposal,
    enactmentMoment
);
const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

api.disconnect();
};

main();