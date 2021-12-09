Some important parameters to understand in relation to the staking system in Moonbeam include:

 - **Candidates** - node operators that are eligible to become block producers if they can acquire enough stake to be in the active set
 - **Collators** — active set of candidates that are selected to be block producers. They collect transactions from users and produce state transition proofs for the relay chain to validate
 - **Delegators** — token holders who stake tokens, vouching for specific collator candidates. Any user that holds a minimum amount of tokens as [free balance](https://wiki.polkadot.network/docs/learn-accounts#balance-types) can become a delegator
 - **Minimum delegation stake** — minimum amount of total tokens staked a user must have to be in the set of delegators
 - **Minimum delegation** — minimum amount of tokens to delegate candidates once a user is in the set of delegators
 - **Maximum delegators per candidate** — maximum number of delegators a candidate can have
 - **Maximum candidates per delegator** — maximum number of candidates a delegator can delegate
 - **Round** — a specific number of blocks around which staking actions are enforced. For example, new delegations are enacted when the next round starts. When bonding less or revoking delegations, funds are returned after a certain amount of rounds
