---
title: Historical Updates
description: An overview of the historical updates made on Moonbeam and Moonriver, such as migrations and bug fixes applied to the Moonbeam source code.
---

# Historical Updates

![Historical Updates Banner](/images/builders/build/historical-updates/banner.png)

## Introduction {: #introduction }

This page provides an overview of historical updates made on Moonbeam and Moonriver, such as bug fixes and migrations applied to the Moonbeam source code.

## Bug Fixes {: #bug-fixes }

#### Gas Limit Too High for Non-Transactional Calls

When a non-transactional call, such as `eth_call` or `eth_estimateGas`, is made without specifying a gas limit for a past block, the client defaults to using the gas limit multiplier (10x), which causes the gas limit validation to fail as it is validating against an upper bound of the block gas limit. So, if the gas limit is greater than the block gas limit for a given call, a gas limit too high error is returned.

Introduced in RT1701 and fixed as of RT1802.

You can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/935){target=_blank} for more information.

***

#### Incorrect Delegation Reward Calculation

The reward payouts for all delegations and collators were underestimated whenever there were pending requests. Delegation rewards are calculated based on the amount of tokens bonded by each delegator in respect to the total stake of the given collator. By counting delegation amounts for pending requests, the rewards to collators and their delegations were less than they should have been.

Introduced in RT1001 and fixed as of RT1800.

You can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1719){target=_blank} for more information.

***

#### Incorrect State Root Hash

The state root hash was being calculated incorrectly for non-legacy transactions as the transaction-type byte was not taken into account. With the support of [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank} and [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}, the transaction types intoduced are `0x01` (1) and `0x02` (2), respectively. These transaction types were omitted from the state root hash calculation.

Introduced in RT1200 and fixed as of RT1700.

For more information, you can review the [relative Frontier PR](https://github.com/PureStake/frontier/pull/86){target=_blank} and [Moonbeam PR on GitHub](https://github.com/PureStake/moonbeam/pull/1678/files){target=_blank}.

***

#### Transaction Fees Paid to Collators

For blocks that included EIP-1559 transactions where a priority fee is applied, the transaction fees were incorrectly calculated and distributed to the collator of the block. The fee model on Moonbeam for transactions and smart contract execution are handled so that 20% of the fees go to the on-chain treasury and 80% are burned as a deflationary force. Due to this bug, the transaction fees of the impacted transactions were not burned as expected.

Introduced in RT1201 and fixed as of RT1504.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1528){target=_blank}.

***

#### Incorrect Timestamp Units

EIP-2612 and Ethereum blocks deal with timestamps in seconds, however the Substrate timestamp pallet that Moonbeam implements used milliseconds.

Introduced at network launch and fixed as of RT1501.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1451){target=_blank}.

***

#### Incorrect Collator Selection

The total delegations for collator candidates were not correctly updated when a delegation was increased via the `delegatorBondMore` extrinsic. This led to issues where the increased delegation amount wasn't included in the candidates' total amount bonded, which is used to determine which candidates are in the active set of collators. As a result, some candidates may not have been selected to be in the active set when they should have been, impacting their own and their delegators' rewards.

Introduced at network launch and fixed as of RT1300.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1291){target=_blank}.

***

#### Block Parent Hash Calculated Incorrectly

After EIP-1559 support was introduced, which included the transition to new Ethereum transaction types, the block header parent hash was calculated wrongly to `H256::default`. 

Introduced in RT1200 and fixed as of RT1201.

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/570){target=_blank}

***

#### Missing Refunds

Moonbeam is configured so that the existential deposit is set to 0, which means that accounts do not need to have a minimum balance to be considered active. For Substrate-based chains that have this configuration, there were some missing refunds to a zeroed account because the account was interpreted to not exist.

Introduced at network launch and fixed as of RT1001.

For more information, you can review the [relative Frontier PR](https://github.com/paritytech/frontier/pull/509){target=_blank} and the associated [Substrate PR on GitHub](https://github.com/paritytech/substrate/issues/10117){target=_blank}.

***

#### Invalid Transactions Stored

For invalid transactions where the transaction cost couldn't be paid, the EVM pallet was inserting the transaction metadata into storage instead of discarding it because there was no transaction cost validation. As a result, the runtime storage was unnecessarily bloated with invalid transaction data.

Introduced at network launch and fixed as of RT600.

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/465){target=_blank}.

***

## Migrations {: #migrations }

Migrations are necessary when a storage item is changed or added and needs to be populated with data. The migrations listed below have been organized by the impacted pallet(s).

### Author Mapping Pallet {: #author-mapping }

#### One Nimbus ID per Account ID

A migration was applied to ensure that an account ID can have only one Nimbus ID. The migration accepted the first Nimbus ID owned by a given account and cleared any additional Nimbus IDs associated to the account. For any cleared associations, the bond for the association was returned.

Executed in RT1600.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1525){target=_blank}.

***

#### Add Support for VRF Keys

When VRF key support was introduced, the `MappingWithDeposit` storage item of the author mapping pallet was updated to include a `keys` field to support VRF keys that can be looked up via the Nimbus ID. As such, a migration was applied to update the existing storage items with this new field.

Executed in RT1500.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1407){target=_blank}.

***

#### Update the Mapping Storage Item

This migration updated the now deprecated `Mapping` storage item of the author mapping pallet to use a more secure hasher type. The hasher type was updated to [Blake2_128Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Blake2_128Concat.html){target=_blank} instead of [Twox64Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Twox64Concat.html){target=_blank}.

Executed in RT800 (only applicable to Moonriver and Moonbase Alpha).

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/679){target=_blank}.

***

### Parachain Staking Pallet {: #parachain-staking }
#### Auto-Compounding Support 

To support auto-compounding, two migrations were applied to the `AtStake` storage item in the parachain staking pallet:

- `RemovePaidRoundsFromAtStake` -  to remove any stale `AtStake` entries relating to already paid-out rounds that had candidates that didn't produce any blocks. This migration is a prerequisite for the `MigrateAtStakeAutoCompound` migration
- `MigrateAtStakeAutoCompound` -  migrates the snapshots for unpaid rounds for `AtStake` entries

Executed in RT1900.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1878){target=_blank}.

***

#### Replace Staking Reserves with Locks

A migration was applied that changed users' staking reserved balances to locked balances. The locked balance is the same type as democracy-locked funds, making it possible for users to use their staked funds to participate in democracy.

Executed in RT1700.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1604){target=_blank}.

***

#### Split Delegator State into Delegation Scheduled Requests

A migration was applied that moved pending delegator requests from the `DelegatorState` storage item of the parachain staking pallet into a new `DelegationScheduledRequests` storage item. 

Executed in RT1500.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1408){target=_blank}.

***

#### Patch Incorrect Total Delegations

There was a migration applied to fix the [Incorrect Collator Selection](#incorrect-collator-selection) bug and patch the delegations total for all candidates.

Executed in RT1300.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1291){target=_blank}.

***

#### Split Candidate Delegations into Top and Bottom

This migration splits the deprecated `CandidateState` storage item of the parachain staking pallet into the following three new storage items to avoid unnecessary storage reads:

- `CandidateInfo`
- `TopDelegations`
- `BottomDelegations`

Executed in RT1200.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1117){target=_blank}.

***

#### Increase Max Delegations per Candidate

A migration was applied to increase the maximum number of delegations per candidate in the parachain staking pallet. It increased the delegations from 100 to 500 on Moonbase Alpha and Moonriver and from 100 to 1000 on Moonbeam.

Executed in RT 1100.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1096){target=_blank}.

***

#### Purge Staking Storage Bloat

A migration was applied to purge staking storage bloat for the `Points` and `AtStake` storage items of the parachain staking pallet that are older than two rounds.

Executed in RT1000.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/970){target=_blank}.

***

#### Support Manual Exits and DPoS Terminology

The parachain staking pallet was updated to include manual exits. If a candidate or delegator wanted to decrease or revoke their bond, or leave the candidate or delegator pool, they would need to first schedule a request, wait for a delay period to pass, and then manually execute the request. As such, a migration was applied to replace the automatic exit queue, including the `ExitQueue2` storage item, with a manual exits API.

In addition, a change was made to switch from Nominated Proof of Stake (NPoS) to Delegated Proof of Stake (DPoS) terminology, this marked the sweeping change from "nominate" to "delegate". This required the migration of the following parachain staking pallet storage items:

- `CollatorState2` was migrated to `CandidateState`
- `NominatorState2` was migrated to `DelegatorState`

Executed in RT1000.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/810){target=_blank}.

***

#### Support Delayed Nominator (Delegator) Exits

The exit queue for handling candidate exits had been updated to include support for delayed nominator (delegator) exits and revocations, which required a migration to update the `ExitQueue` parachain staking pallet storage item to `ExitQueue2`. The `NominatorState` storage item was also migrated to `NominatorState2`  to prevent a nominator from performing more nominations when they already have scheduled an exit.

Executed in RT200 (only applicable to Moonriver and Moonbase Alpha).

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/610){target=_blank}.

***

#### Update Collator State Storage Item

A migration was applied that updated the `Collator` storage item of the parachain staking pallet to the new `Collator2` storage item. This change updates the collator state to include the following items:

- The `nominators` set is a list of all of the nominator (delegator) account IDs, without their respective balance bonded
- A new `top_nominators` storage item which returns a list of all of the top nominators ordered by greatest bond amount to least
- A new `bottom_nominators` storage item which returns a list of all of the bottom nominators ordered by least bond amount to greatest
- The `total` storage item was replaced with `total_counted` and `total_backing`. The `total_counted` item returns the sum of the top nominations and the collator's self bond, whereas the `total_backing` item returns the sum of all of the nominations and the collator's self bond

Executed in RT53 (only applicable to Moonriver and Moonbase Alpha).

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/505){target=_blank}.

***

#### Patch Total Staked Amount 

There was a migration appled to the `total` staked amount of the `CollatorState` storage item in the parachain staking pallet due to a potential bug that may have led to an incorrect amount. 

Executed in RT53 (only applicable to Moonriver and Moonbase Alpha).

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/502){target=_blank}.

***

### XCM-Related Pallets {: #xcm-related-pallets }

#### Update Transact Info Storage Item

There was a migration applied to the `TransactInfo` storage item of the XCM-transactor pallet that changed the following items:

- `max_weight` is added to prevent transactors from stalling the queue in the destination chain
- Removes `fee_per_byte`, `metadata_size`, and `base_weight` as these items are not necessary for XCM transactions
- `fee_per_second` replaces `fee_per_weight` to better reflect cases (like Kusama) in which the `fee_per_eight` unit is lower than one

Executed in RT1200. 

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1114){target=_blank}.

*** 

#### Add Support for Statemine Prefix Breaking Change 

The following three migrations were added to the asset manager pallet to avoid issues with [Statemine's breaking change to the way it represents assets](https://github.com/paritytech/cumulus/pull/831){target=_blank} and possible future breaking changes:

- `UnitsWithAssetType` - updates the `AssetTypeUnitsPerSecond` storage item  to a mapping of the `AssetType` to `units_per_second`, instead of the mapping `AssetId` to `units_per_second`. This is done to avoid additional migrations whenever a breaking change arises
- `PopulateAssetTypeIdStorage` - creates a new `AssetTypeId` storage item that holds the `AssetType` to `AssetId` mapping, which allows the decoupling of `assetIds` and `AssetTypes`
- `ChangeStateminePrefixes` - updates already registered Statemine assets to new their new form

Executed in RT1200. 

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1159){target=_blank}.

***

#### Add New Supported Fee Payment Assets Storage Item

A migration was applied to the asset manager pallet that creates a new`SupportedFeePaymentAssets` storage item by reading the supported asset data from the `AssetTypeUnitsPerSecond` storage item. This storage item will hold all of the assets that we accept for XCM fee payment. It will be read when an incoming XCM message is received, and if the asset is not in storage, the message will not be processed.

Executed in RT1300.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1118){target=_blank}.

***

### Base Fee Pallet {: #base-fee }

#### Add Elasticity Storage Item

This migration sets the `Elasticity` storage item of the base fee pallet to zero, which results in a constant `BaseFeePerGas`.

Executed in RT1300.

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1744){target=_blank}.

***

### Nimbus Author Filter Pallet {: #nimbus }

A breaking change was applied to the Nimbus repository that deprecated `EligibleRatio` in favor or the `EligibleCount` config. As a result, a migration was applied to the Moonbeam repository that populated the new `EligibleCount` value as a percentage of the potential authors defined at that block height if the `EligibleRatio` value existed. Otherwise, the value was set to a default value of `50`.

Executed in RT1500.

For more information, you can review the [relative Nimbus PR](https://github.com/PureStake/nimbus/pull/45/){target=_blank} and [Moonbeam PR on GitHub](https://github.com/PureStake/moonbeam/pull/1400){target=_blank}.
