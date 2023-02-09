---
title: Democracy Pallet
description: Learn about the available extrinsics for the democracy pallet on Moonbeam and how to interact with them using Polkadot.js Apps and the Polkadot.js API.
keywords: democracy, substrate, pallet, moonbeam, polkadot
---

# The Democracy Pallet

![Democracy Moonbeam Banner](/images/builders/pallets-precompiles/pallets/democracy-banner.png)

## Introduction {: #introduction }

As a Polkadot parachain, Moonbeam features native on-chain governance thanks to the [Substrate democracy pallet](https://docs.rs/pallet-democracy/latest/pallet_democracy/){target=_blank}. To learn more about governance, such as an overview of related terminology, principles, mechanics, and more, please refer to the [Governance on Moonbeam](/learn/features/governance){target=_blank} page. 

Some of the functionality of the democracy pallet is also available through a democracy precompile. The precompile is a Solidity interface that enables you to perform governance functions using the Ethereum API. Please refer to the [Democracy Precompile](/builders/pallets-precompiles/precompiles/democracy){target=_blank} guide for more information.

This guide will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the democracy pallet on Moonbeam.

## Democracy Pallet Interface {: #democracy-pallet-interface }

### Extrinsics {: #extrinsics }

The democracy pallet provides the following extrinsics (functions):

- **delegate**(to, conviction, balance) - delegates the voting power, with some given conviction, of the sending account to a given account. The balance delegated is locked for as long as it's delegated, and thereafter for the time appropriate for the conviction's lock period. The sending account must be delegating already or have no voting activity. Emits a `Delegated` event
- **enactProposal**(proposalHash, index) - *deprecated as of runtime 2000* - enacts a proposal from a referendum given the proposal hash and the index of the referendum
- **noteImminentPreimage**(encodedProposal) - *deprecated as of runtime 2000* - registers a preimage for an upcoming proposal in the dispatch queue given the encoded preimage of a proposal. Emits a `PreimageNoted` event
- **notePreimage**(encodedProposal) - *deprecated as of runtime 2000* - registers a preimage for an upcoming proposal given the encoded preimage of a proposal. This odesn't require the proposal to be in the dispatch queue but does require a deposit that is returned once enacted. Emits a `PreimageNoted` event. **This extrinsic is now accessible through the [preimage pallet](/builders/pallets-precompiles/pallets/preimage/#extrinsics){target=_blank}**
- **propose**(proposal, value) - submits a proposal given the proposal and the deposit amount, which must be at least the minimum deposit. Emits a `Proposed` event. The proposal can be one of three types: 
    - `Legacy` - requires a Blake2-256 preimage hash with no preimage length. This type can no longer be created and temporarily exists to support transitioning from legacy state
    - `Inline` - requires a bounded `Call`. Its encoding must be at most 128 bytes
    - `Lookup` - requires a Blake2-256 preimage hash along with the length of the preimage

- **reapPreimage**(proposalHash, proposalLenUpperBound) - *deprecated as of runtime 2000* - removes an expired proposal preimage and collects the deposit. This will only work after the number of blocks in the voting period have passed and if it's the same account that created the preimage is making the call. If it's a different account, then the call must be made after the number of blocks in the enactment period. Emits a `PreimageReaped` event
- **removeOtherVote**(target, index) - removes a vote for a referendum given the account of the vote to be removed for and the index of the referendum. If the account passed in is the signer, then the functionality is the same as the `removeVote` function; otherwise the vote must have expired because the voter lost the referendum or the conviction period is over
- **removeVote**(index) - removes a vote for a referendum given the index of the referendum. The vote can only be removed if the referendum was cancelled, is ongoing, it ended and the vote was in opposition to the result, if there was no conviction to the account's vote, or if the account made a split vote
- **second**(proposal, secondsUpperBound) - seconds a proposal signaling agreement with the proposal given the index of the proposal and an upper bound on the current number of seconds on the proposal
- **undelegate**() - undelegates the voting power of the sending account. Tokens may be unlocked once an amount of time consistent with the conviction lock period has been passed. Emits an `Undelegated` event
- **unlock**(target) - unlocks tokens that have an expired lock given the account to remove the lock on
- **vote**(refIndex, vote) - vote in a referendum given the index of the referendum, the vote, conviction, and amount of tokens to lock. If the vote is an `aye`, the vote is to enact the proposal; otherwise the vote is to not approve the proposal

Some of the extrinsics in the democracy pallet are subject to votes of the *Technical Committee* or *Council*:

- **cancelProposal**(propIndex) - removes a proposal given the index of the proposal to cancel. Cancellations are in the hands of the *Root* account or if *3/5th of the Technical Committee* vote to cancel the proposal
- **emergencyCancel**(refIndex) - schedules an emergency cancellation of a referendum given the index of the referendum to cancel. Emergency cancellations are in the hands of the *Root* account or if *3/5th of the Council* vote to cancel the referendum
- **externalPropose**(proposal) - schedules a referendum to be brought to a vote once it is legal to schedule an external referendum given a proposal hash. If at least *1/2 of the Council* vote in approval the referendum will be tabled next. Please refer to the three types of proposals, in the **propose** extrinsic description above
- **externalProposeDefault**(proposal) - schedules a negative-turnout-bias referendum to be brought to a vote next once it is legal to schedule an external referendum given the preimage hash of a proposal. If at least *3/5th of the Council* vote in approval the referendum will be tabled next. Please refer to the three types of proposals, in the **propose** extrinsic description above
- **exernalProposeMajority**(proposal) - schedules a majority-carries referendum to be brought to a vote next once it is legal to schedule an external referendum given the preimage hash of a proposal. If at least *3/5th of the Council* vote in approval the referendum will be tabled next. Please refer to the three types of proposals, in the **propose** extrinsic description above
- **fastTrack**(proposalHash, votingPeriod, delay) - schedules a currently externally-proposed majority-carries referendum to be brought to a vote immediately given the proposal hash, the period allowed for voting on the proposal, and the number of blocks  after an approval and it is enacted. If there is no externally-proposed referendum currently, or if there is one but it is not a majority-carries referendum then it fails. If at least *1/2 of the Technical Committee* vote in approval the referendum will be tabled immediately
- **noteImminentPreimageOperational**(encodedProposal) - registers a preimage for an upcoming proposal in the dispatch queue given the encoded preimage of a proposal. Emits a `PreimageNoted` event. Must be called by a member of the *Council*
- **notePreimageOperational**(encodedProposal) - registers a preimage for an upcoming proposal given the encoded preimage of a proposal. This odesn't require the proposal to be in the dispatch queue but does require a deposit that is returned once enacted. Emits a `PreimageNoted` event. Must be called by a member of the *Council*
- **vetoExternal**(proposalHash) - vetoes and blacklists a proposal given the preimage hash of the proposal. Emits a `Vetoed` event. Must be called by a member of the *Technical Committee* and can only be called one time and it only lasts for the cooloff period

There are also some extrinsics in the democracy pallet that can only be dispatched by the *root* account:

- **blacklist**(proposalHash, maybeRefIndex) - permanently places a proposal given a proposal hash into the blacklist which prevents it from ever being proposed again. If called on a queued public or external proposal, then this will result in it being removed. If the `maybeRefIndex` supplied is an active referendum that corresponds to the proposal hash, the proposal will be cancelled
- **cancelQueued**(which) - *deprecated as of runtime 2000* - cancels a proposal queued for enactment given the index of the referendum to cancel
- **cancelReferendum**(refIndex) - removes a referendum given the index of the referendum to cancel
- **clearPublicProposals**() - clears all public proposals

### Storage Methods {: #storage-methods }

The democracy pallet includes the following read-only storage methods to obtain chain state data:

- **blacklist**(H256) - returns a record of who vetoed what, or if a proposal hash has been provided it returns information about the specific proposal that was blacklisted or `none` if the proposal wasn't blacklisted
- **cancellations**(H256) - returns a record of all proposals that have been subject to emergency cancellation, or if a proposal hash has been provided it returns a boolean indicating whether or not the proposal has been cancelled 
- **depositOf**(u32) - returns a record of those who have locked a deposit behind proposals, or if given a proposal index it provides information for the specific proposal
- **lastTabledWasExternal**() - returns true if the last referendum tabled was submitted externally, and returns false if it was a public proposal
- **lowestUnbaked**() - returns the lowest referendum index that corresponds to an unbaked referendum
- **nextExternal**() - returns the next referendum to be brought to a vote for whenever it would be valid to vote on an external proposal
- **palletVersion**() - returns the current pallet version
- **preimages**(H256) - *deprecated as of runtime 2000* - **this storage item is now accessible through the [preimage pallet](/builders/pallets-precompiles/pallets/preimage/#storage-methods){target=_blank}**
- **publicPropCount**() - returns the number of public proposals that have been made so far
- **publicProps**() - returns a record of the public proposals
- **referendumCount**() - returns the number of referenda started so far
- **referendumInfoOf**() - returns information for a referendum given the referendum's index
- **votingOf**(AccountId20) - returns a record of all of the votes for a particular voter given the address of the voter

### Pallet Constants {: #constants }

The democracy pallet includes the following read-only functions to obtain pallet constants:

- **cooloffPeriod**() - returns the period in blocks where an external proposal may not be re-submitted after being vetoed
- **enactmentPeriod**() - returns the period between a proposal being approved and enacted
- **fastTrackVotingPeriod**() - returns the minimum voting period allowed for a fast-track referendum
- **instantAllowed**() - returns a boolean indicating whether an emergency origin is even allowed to happen
- **launchPeriod**() - returns how often (in blocks) new public referenda are launched
- **maxProposals**() - returns the maximum number of public proposals that can exist at any time
- **maxBlacklisted**() - returns the maximum number of items which can be blacklisted
- **maxDeposits**() - returns the maximum number of deposits a public proposal may have at any time
- **maxVotes**() - returns the maximum number of votes for an account
- **minimumDeposit**() - returns the minimum amount to be used as a deposit for a public referendum proposal
- **preimageByteDeposit**() - *deprecated as of runtime 2000* - returns the amount of balance that must be deposited per byte of preimage stored
- **voteLockingPeriod**() - returns the minimum period of vote locking
- **votingPeriod**() - returns how often (in blocks) to check for new votes