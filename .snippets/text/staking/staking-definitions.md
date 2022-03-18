Some important parameters to understand in relation to the staking system in Moonbeam include:

 - **Round** — a specific number of blocks around which staking actions are enforced. For example, new delegations are enacted when the next round starts. When bonding less or revoking delegations, funds are returned after a certain amount of rounds
 - **Candidates** - node operators that are eligible to become block producers if they can acquire enough stake to be in the active set
 - **Collators** — active set of candidates that are selected to be block producers. They collect transactions from users and produce state transition proofs for the relay chain to validate
 - **Delegators** — token holders who stake tokens, vouching for specific collator candidates. Any user that holds a minimum amount of tokens as [free balance](https://wiki.polkadot.network/docs/learn-accounts#balance-types) can become a delegator
 - **Minimum delegation per candidate** — minimum amount of tokens to delegate candidates once a user is in the set of delegators
 - **Maximum delegators per candidate** — maximum number of delegators, by staked amount, that a candidate can have which are eligible to receive staking rewards
 - **Maximum delegations** — maximum number of candidates a delegator can delegate
 - **Exit delay** - an exit delay is the amount of rounds before a candidate or delegator can execute a scheduled request to decrease or revoke a bond, or leave the set of candidates or delegators
 - **Reward payout delay** - a certain amount of rounds must pass before staking rewards are distributed automatically to the free balance
 - **Reward pool** - a portion of the annual inflation that is set aside for collators and delegators
 - **Collator commission** - default fixed percent a collator takes off the top of the due staking rewards. Not related to the reward pool
 - **Delegator rewards** — the aggregate delegator rewards distributed over all eligible delegators, taking into account the relative size of stakes ([read more](/staking/overview/#reward-distribution))
 - **Slashing** — a mechanism to discourage collator misbehavior, where typically the collator and their delegators get slashed by losing a percentage of their stake. Currently, there is no slashing but this can be changed through governance. Collators who produce blocks that are not finalized by the relay chain won't receive rewards