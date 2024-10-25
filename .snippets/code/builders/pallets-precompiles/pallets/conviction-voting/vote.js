import { ApiPromise, WsProvider } from '@polkadot/api';

const pollIndex = INSERT_REFERENDUM_INDEX;
const vote = INSERT_VOTE;
/*
For Standard, use the following format:
const vote = {
  Standard: {
    Vote: { aye: INSERT_BOOLEAN, conviction: INSERT_CONVICTION },
    balance: INSERT_BALANCE,
  },
};

For Split, use the following format:
const vote = {
  Split: {
    aye: INSERT_BALANCE,
    nay: INSERT_BALANCE,
  },
};

For SplitAbstrain, use the following format:
const vote = {
   SplitAbstain: {
     aye: INSERT_BALANCE,
     nay: INSERT_BALANCE,
     abstain: INSERT_BALANCE,
   },
 };        
*/

const main = async () => {
  const api = await ApiPromise.create({
    provider: new WsProvider('INSERT_WSS_ENDPOINT'),
  });

  const tx = api.tx.convictionVoting.vote(pollIndex, vote);
  const txHash = await tx.signAndSend('INSERT_ACCOUNT_OR_KEYRING');

  api.disconnect();
};

main();
