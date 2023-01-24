---
title: Historical Updates
description: An overview of the historical updates made on Moonbeam and Moonriver, such as migrations and bug fixes applied to the Moonbeam source code.
---

# Historical Updates

![Historical Updates Banner](/images/builders/build/historical-updates/banner.png)

## Introduction {: #introduction }

This page provides an overview of historical updates made on Moonbeam and Moonriver, such as bug fixes to the Moonbeam source code and data migrations applied.

The objective of this page is to provide information around unexpected behaviors or data inconsistencies that are associated with updates which needed forced data migrations.

## Bug Fixes {: #bug-fixes }

#### Invalid Transactions Stored {: #invalid-transactions-stored }

For invalid transactions where the transaction cost couldn't be paid, the EVM pallet was inserting the transaction metadata into storage instead of discarding it because there was no transaction cost validation. As a result, the runtime storage was unnecessarily bloated with invalid transaction data.

This bug only impacted Moonriver and Moonbase Alpha and existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed | Impacted Block Range |
|:--------------:|:----------:|:-----:|:--------------------:|
|   Moonriver    |    RT49    | RT600 |      0 - 455106      |
| Moonbase Alpha |    RT40    | RT600 |      0 - 675175      |

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/465){target=_blank}.

***

#### Missing Refunds {: #missing-refunds }

Moonbeam is configured so that the existential deposit is set to 0, which means that accounts do not need to have a minimum balance to be considered active. For Substrate-based chains that have this configuration, there were some missing refunds to a zeroed account because the account was interpreted to not exist.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1001 |       0 - 5164       |
|   Moonriver    |    RT49    | RT1001 |     0 - 1052241      |
| Moonbase Alpha |    RT40    | RT1001 |     0 - 1285915      |

For more information, you can review the [relative Frontier PR](https://github.com/paritytech/frontier/pull/509){target=_blank} and the associated [Substrate PR on GitHub](https://github.com/paritytech/substrate/issues/10117){target=_blank}.

***

#### Incorrect Collator Selection {: #incorrect-collator-selection }

The total delegations for collator candidates were not correctly updated when a delegation was increased via the `delegatorBondMore` extrinsic. This led to issues where the increased delegation amount wasn't included in the candidates' total amount bonded, which is used to determine which candidates are in the active set of collators. As a result, some candidates may not have been selected to be in the active set when they should have been, impacting their own and their delegators' rewards.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1300 |      0 - 524762      |
|   Moonriver    |    RT49    | RT1300 |     0 - 1541735      |
| Moonbase Alpha |    RT40    | RT1300 |     0 - 1761128      |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1291){target=_blank}.

***

#### Incorrect Timestamp Units {: #incorrect-timestamp-units }

EIP-2612 and Ethereum blocks deal with timestamps in seconds, however the Substrate timestamp pallet that Moonbeam implements used milliseconds. This only affected the EIP-2612 implementation and not the `block.timestamp` value.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1606 |     0 - 1326697      |
|   Moonriver    |    RT49    | RT1605 |     0 - 2077598      |
| Moonbase Alpha |    RT40    | RT1603 |     0 - 2285346      |


For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1451){target=_blank}.

***

#### Incorrect Delegation Reward Calculation {: #incorrect-delegation-reward-calculation }

The reward payouts for all delegations and collators were underestimated whenever there were pending requests. Delegation rewards are calculated based on the amount of tokens bonded by each delegator in respect to the total stake of the given collator. By counting delegation amounts for pending requests, the rewards to collators and their delegations were less than they should have been.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1001   | RT1802 |    5165 - 1919457    |
|   Moonriver    |   RT1001   | RT1801 |  1052242 - 2572555   |
| Moonbase Alpha |   RT1001   | RT1800 |  1285916 - 2748785   |

You can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1719){target=_blank} for more information.

***

#### Block Parent Hash Calculated Incorrectly {: #block-parent-hash-calculated-incorrectly }

After EIP-1559 support was introduced, which included the transition to new Ethereum transaction types, the block header parent hash was calculated wrongly to `H256::default`. 

This bug only impacted Moonbase Alpha and existed during the following runtime and block range:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT1200   | RT1201 |  1648994 - 1679618   |

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/570){target=_blank}

***

#### Transaction Fees Paid to Collators {: #transaction-fees-paid-to-collators }

For blocks that included EIP-1559 transactions where a priority fee is applied, the transaction fees were incorrectly calculated and distributed to the collator of the block. The fee model on Moonbeam for transactions and smart contract execution are handled so that 20% of the fees go to the on-chain treasury and 80% are burned as a deflationary force. Due to this bug, the transaction fees of the impacted transactions were not burned as expected.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1504 |   415946 - 1117309   |
|   Moonriver    |   RT1201   | RT1504 |  1471037 - 1910639   |
| Moonbase Alpha |   RT1200   | RT1504 |  1648994 - 2221772   |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1528){target=_blank}.

***

#### Incorrect State Root Hash {: #incorrect-state-root-hash }

The state root hash was being calculated incorrectly for non-legacy transactions as the transaction-type byte was not taken into account. With the support of [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank} and [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}, the transaction types intoduced are `0x01` (1) and `0x02` (2), respectively. These transaction types were omitted from the state root hash calculation.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1701 |   415946 - 1581456   |
|   Moonriver    |   RT1201   | RT1701 |  1471037 - 2281722   |
| Moonbase Alpha |   RT1200   | RT1700 |  1648994 - 2529735   |

For more information, you can review the [relative Frontier PR](https://github.com/PureStake/frontier/pull/86){target=_blank} and [Moonbeam PR on GitHub](https://github.com/PureStake/moonbeam/pull/1678/files){target=_blank}.

***

#### Gas Limit Too High for Non-Transactional Calls {: #gas-limit-too-high-for-non-transactional-calls }

When a non-transactional call, such as `eth_call` or `eth_estimateGas`, is made without specifying a gas limit for a past block, the client defaults to using the gas limit multiplier (10x), which causes the gas limit validation to fail as it is validating against an upper bound of the block gas limit. So, if the gas limit is greater than the block gas limit for a given call, a gas limit too high error is returned.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1701   | RT1802 |  1581457 - 1919457   |
|   Moonriver    |   RT1701   | RT1802 |  2281723 - 2616189   |
| Moonbase Alpha |   RT1700   | RT1802 |  2529736 - 2879402   |

You can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/935){target=_blank} for more information.

***

## Migrations {: #migrations }

Migrations are necessary when a storage item is changed or added and needs to be populated with data. The migrations listed below have been organized by the impacted pallet(s).

### Author Mapping Pallet {: #author-mapping }

#### Update the Mapping Storage Item {: #update-mapping-storage-item }

This migration updated the now deprecated `Mapping` storage item of the author mapping pallet to use a more secure hasher type. The hasher type was updated to [Blake2_128Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Blake2_128Concat.html){target=_blank} instead of [Twox64Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Twox64Concat.html){target=_blank}.

This migration was only applied to Moonriver and Moonbase Alpha and was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |      RT800       |    684728     |
| Moonbase Alpha |      RT800       |    915684     |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/679){target=_blank}.

***

#### Add Support for VRF Keys {: #add-support-for-vrf-keys }

When VRF key support was introduced, the `MappingWithDeposit` storage item of the author mapping pallet was updated to include a `keys` field to support VRF keys that can be looked up via the Nimbus ID. As such, a migration was applied to update the existing storage items with this new field.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1407){target=_blank}.

***

#### One Nimbus ID per Account ID {: #one-nimbus-id-per-account-id }

A migration was applied to ensure that an account ID can have only one Nimbus ID. The migration accepted the first Nimbus ID owned by a given account and cleared any additional Nimbus IDs associated to the account. For any cleared associations, the bond for the association was returned.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1606      |    1326697    |
|   Moonriver    |      RT1605      |    2077599    |
| Moonbase Alpha |      RT1603      |    2285347    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1525){target=_blank}.

***

### Base Fee Pallet {: #base-fee }

#### Set Elasticity Storage Item Value {: #set-elasticity }

This migration sets the `Elasticity` storage item of the base fee pallet to zero, which results in a constant `BaseFeePerGas`.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1744){target=_blank}.

***

### Democracy Pallet {: #democracy }

#### Preimage Storage Moved to New Preimage Pallet

There was a migration applied which moved preimages stored in the democracy pallet to a new preimage pallet. This migration on Moonbeam was required as a result of an [upstream change to Polkadot](https://github.com/paritytech/substrate/pull/11649){target=_blank}.

There was one preimage that was affected in Moonbeam, which was dropped from the scheduler queue and never executed: `0x14262a42aa6ccb3cae0a169b939ca5b185bc317bb7c449ca1741a0600008d306`. This preimage was [manually removed](https://moonbeam.subscan.io/extrinsic/2693398-8){target=_blank} by the account that initially submitted the preimage.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2000      |    3310369    |
|   Moonriver    |      RT2000      |    3202604    |
| Moonbase Alpha |      RT2000      |    2673234    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1962){target=_blank}.

***

### Parachain Staking Pallet {: #parachain-staking }

#### Update Collator State Storage Item {: #update-collator-state-storage-item }

A migration was applied that updated the `Collator` storage item of the parachain staking pallet to the new `Collator2` storage item. This change updates the collator state to include the following items:

- The `nominators` set is a list of all of the nominator (delegator) account IDs, without their respective balance bonded
- A new `top_nominators` storage item which returns a list of all of the top nominators ordered by greatest bond amount to least
- A new `bottom_nominators` storage item which returns a list of all of the bottom nominators ordered by least bond amount to greatest
- The `total` storage item was replaced with `total_counted` and `total_backing`. The `total_counted` item returns the sum of the top nominations and the collator's self bond, whereas the `total_backing` item returns the sum of all of the nominations and the collator's self bond

This migration was only applied to Moonriver and Moonbase Alpha and was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |       RT53       |     9696      |
| Moonbase Alpha |       RT52       |    238827     |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/505){target=_blank}.

***

#### Patch Total Staked Amount {: #patch-total-staked-amount }

There was a migration appled to the `total` staked amount of the `CollatorState` storage item in the parachain staking pallet due to a potential bug that may have led to an incorrect amount. 

This migration was only applied to Moonriver and Moonbase Alpha and was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |       RT53       |     9696      |
| Moonbase Alpha |       RT52       |    238827     |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/502){target=_blank}.

***

#### Support Delayed Nominator (Delegator) Exits {: #support-delayed-nominator-exits }

The exit queue for handling candidate exits had been updated to include support for delayed nominator (delegator) exits and revocations, which required a migration to update the `ExitQueue` parachain staking pallet storage item to `ExitQueue2`. The `NominatorState` storage item was also migrated to `NominatorState2`  to prevent a nominator from performing more nominations when they already have scheduled an exit.

These migrations were only applied to Moonriver and Moonbase Alpha and were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |      RT200       |    259002     |
| Moonbase Alpha |      RT200       |    457614     |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/610){target=_blank}.

***

#### Purge Staking Storage Bloat {: #purge-staking-storage-bloat }

A migration was applied to purge staking storage bloat for the `Points` and `AtStake` storage items of the parachain staking pallet that are older than two rounds.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1001      |     5165      |
|   Moonriver    |      RT1001      |    1052242    |
| Moonbase Alpha |      RT1001      |    1285916    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/970){target=_blank}.

***

#### Support Manual Exits and DPoS Terminology {: #support-manual-exits-dpos-terminology }

The parachain staking pallet was updated to include manual exits. If a candidate or delegator wanted to decrease or revoke their bond, or leave the candidate or delegator pool, they would need to first schedule a request, wait for a delay period to pass, and then manually execute the request. As such, a migration was applied to replace the automatic exit queue, including the `ExitQueue2` storage item, with a manual exits API.

In addition, a change was made to switch from Nominated Proof of Stake (NPoS) to Delegated Proof of Stake (DPoS) terminology, this marked the sweeping change from "nominate" to "delegate". This required the migration of the following parachain staking pallet storage items:

- `CollatorState2` was migrated to `CandidateState`
- `NominatorState2` was migrated to `DelegatorState`

These migrations were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1001      |     5165      |
|   Moonriver    |      RT1001      |    1052242    |
| Moonbase Alpha |      RT1001      |    1285916    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/810){target=_blank}.

***

#### Increase Max Delegations per Candidate {: #increase-max-delegations-per-candidate }

A migration was applied to increase the maximum number of delegations per candidate in the parachain staking pallet. It increased the delegations from 100 to 500 on Moonbase Alpha and Moonriver and from 100 to 1000 on Moonbeam.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1101      |    171061     |
|   Moonriver    |      RT1101      |    1188000    |
| Moonbase Alpha |      RT1100      |    1426319    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1096){target=_blank}.

***

#### Split Candidate Delegations into Top and Bottom {: #split-candidate-delegations-top-bottom }

This migration splits the deprecated `CandidateState` storage item of the parachain staking pallet into the following three new storage items to avoid unnecessary storage reads:

- `CandidateInfo`
- `TopDelegations`
- `BottomDelegations`

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1117){target=_blank}.

***

#### Patch Incorrect Total Delegations {: #patch-incorrect-total-delegations }

There was a migration applied to fix the [Incorrect Collator Selection](#incorrect-collator-selection) bug and patch the delegations total for all candidates.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1291){target=_blank}.

***

#### Split Delegator State into Delegation Scheduled Requests {: #split-delegator-state }

A migration was applied that moved pending delegator requests from the `DelegatorState` storage item of the parachain staking pallet into a new `DelegationScheduledRequests` storage item. 

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1408){target=_blank}.

***

#### Replace Staking Reserves with Locks {: #replace-staking-reserves }

A migration was applied that changed users' staking reserved balances to locked balances. The locked balance is the same type as democracy-locked funds, making it possible for users to use their staked funds to participate in democracy.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1701      |    1581457    |
|   Moonriver    |      RT1701      |    2281723    |
| Moonbase Alpha |      RT1700      |    2529736    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1604){target=_blank}.

***

#### Auto-Compounding Support {: #auto-compounding-support }

To support auto-compounding, two migrations were applied to the `AtStake` storage item in the parachain staking pallet:

- `RemovePaidRoundsFromAtStake` -  to remove any stale `AtStake` entries relating to already paid-out rounds that had candidates that didn't produce any blocks. This migration is a prerequisite for the `MigrateAtStakeAutoCompound` migration
- `MigrateAtStakeAutoCompound` -  migrates the snapshots for unpaid rounds for `AtStake` entries

These migrations were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1901      |    2317683    |
|   Moonriver    |      RT1901      |    2911863    |
| Moonbase Alpha |      RT1900      |    3069635    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1878){target=_blank}.

***

### XCM-Related Pallets {: #xcm-related-pallets }

#### Update Transact Info Storage Item {: #update-transaction-info }

There was a migration applied to the `TransactInfo` storage item of the XCM-transactor pallet that changed the following items:

- `max_weight` is added to prevent transactors from stalling the queue in the destination chain
- Removes `fee_per_byte`, `metadata_size`, and `base_weight` as these items are not necessary for XCM transactions
- `fee_per_second` replaces `fee_per_weight` to better reflect cases (like Kusama) in which the `fee_per_weight` unit is lower than one

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1114){target=_blank}.

*** 

#### Add Support for Statemine Prefix Breaking Change {: #add-support-statemine-prefix }

The following three migrations were added to the asset manager pallet to avoid issues with [Statemine's breaking change to the way it represents assets](https://github.com/paritytech/cumulus/pull/831){target=_blank} and possible future breaking changes:

- `UnitsWithAssetType` - updates the `AssetTypeUnitsPerSecond` storage item  to a mapping of the `AssetType` to `units_per_second`, instead of the mapping `AssetId` to `units_per_second`. This is done to avoid additional migrations whenever a breaking change arises
- `PopulateAssetTypeIdStorage` - creates a new `AssetTypeId` storage item that holds the `AssetType` to `AssetId` mapping, which allows the decoupling of `assetIds` and `AssetTypes`
- `ChangeStateminePrefixes` - updates already registered Statemine assets to new their new form

These migrations were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1159){target=_blank}.

***

#### Add New Supported Fee Payment Assets Storage Item {: #add-supported-fee-payment-assets }

A migration was applied to the asset manager pallet that creates a new`SupportedFeePaymentAssets` storage item by reading the supported asset data from the `AssetTypeUnitsPerSecond` storage item. This storage item will hold all of the assets that we accept for XCM fee payment. It will be read when an incoming XCM message is received, and if the asset is not in storage, the message will not be processed.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/PureStake/moonbeam/pull/1118){target=_blank}.

***

### Nimbus Author Filter Pallet {: #nimbus }

#### Replace Eligible Ratio with Eligible Count {: #replace-eligible-ratio }

A breaking change was applied to the Nimbus repository that deprecated `EligibleRatio` in favor or the `EligibleCount` config. As a result, a migration was applied to the Moonbeam repository that populated the new `EligibleCount` value as a percentage of the potential authors defined at that block height if the `EligibleRatio` value existed. Otherwise, the value was set to a default value of `50`.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative Nimbus PR](https://github.com/PureStake/nimbus/pull/45/){target=_blank} and [Moonbeam PR on GitHub](https://github.com/PureStake/moonbeam/pull/1400){target=_blank}.
