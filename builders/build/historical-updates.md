---
title: Historical Updates
description: An overview of the historical updates made on Moonbeam and Moonriver, such as migrations and bug fixes applied to the Moonbeam source code.
---

# Historical Updates

![Historical Updates Banner](/images/builders/build/historical-updates/banner.png)

## Introduction {: #introduction }

This page provides an overview of historical updates made on Moonbeam and Moonriver, such as bug fixes to the Moonbeam source code and data migrations applied.

The objective of this page is to provide information around unexpected behaviors or data inconsistencies that are associated with updates which needed forced data migrations.

## Bugs {: #bugs }

#### Invalid Transactions Stored {: #invalid-transactions-stored }

For invalid transactions where the transaction cost couldn't be paid, the EVM pallet was inserting the transaction metadata into storage instead of discarding it because there was no transaction cost validation. As a result, the runtime storage was unnecessarily bloated with invalid transaction data.

This bug only impacted Moonriver and Moonbase Alpha and existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed | Impacted Block Range |
|:--------------:|:----------:|:-----:|:--------------------:|
|   Moonriver    |    RT49    | RT600 |      0 - 455106      |
| Moonbase Alpha |    RT40    | RT600 |      0 - 675175      |

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/465){target=_blank}.

***

#### Ethereum Fees Weren't Sent to Treasury {: #ethereum-fees-to-treasury }

The fee model on Moonbeam for transactions have 20% of the fees go to the on-chain treasury and 80% burned as a deflationary force. Prior to runtime 800, Ethereum transactions did not result in 20% of the transaction fees going to the on-chain Treasury.

This bug only impacted Moonriver and Moonbase Alpha and existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed | Impacted Block Range |
|:--------------:|:----------:|:-----:|:--------------------:|
|   Moonriver    |    RT49    | RT800 |      0 - 684728      |
| Moonbase Alpha |    RT40    | RT800 |      0 - 915684      |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/732){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=_blank}.

***

#### New Account Event Bug {: #new-account-event }

The `System.NewAccount` event is emitted when a new account is created. However, there was a bug where this event was not emitted at the time of creation for some accounts. A hotfix was applied that patched the impacted accounts and emitted the `System.NewAccount` at a later time.

The hotfix was applied in the following block ranges:

|    Network     |                                                             Block Range                                                              |
|:--------------:|:------------------------------------------------------------------------------------------------------------------------------------:|
|    Moonbeam    | [1041355 - 1041358 and 1100752](https://moonbeam.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=_blank} |
|   Moonriver    |      [1835760 - 1835769](https://moonriver.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=_blank}       |
| Moonbase Alpha |  [2097782 - 2097974](https://moonbase.subscan.io/extrinsic?address=&module=evm&call=hotfix_inc_account_sufficients){target=_blank}   |

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1401 |      0 - 915320      |
|   Moonriver    |    RT49    | RT1401 |     0 - 1705939      |
| Moonbase Alpha |    RT40    | RT1400 |     0 - 1962557      |

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/moonbeam-foundation/frontier/pull/46/files){target=_blank}.

***

#### Incorrect Timestamp Units {: #incorrect-timestamp-units }

EIP-2612 and Ethereum blocks deal with timestamps in seconds, however the Substrate timestamp pallet that Moonbeam implements used milliseconds. This only affected the EIP-2612 implementation and not the `block.timestamp` value.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1606 |     0 - 1326697      |
|   Moonriver    |    RT49    | RT1605 |     0 - 2077598      |
| Moonbase Alpha |    RT40    | RT1603 |     0 - 2285346      |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1451){target=_blank}.

***

#### Incorrect Delegation Reward Calculation {: #incorrect-delegation-reward-calculation }

The reward payouts for all delegations and collators were underestimated whenever there were pending requests. Delegation rewards are calculated based on the amount of tokens bonded by each delegator in respect to the total stake of the given collator. By counting delegation amounts for pending requests, the rewards to collators and their delegations were less than they should have been.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1001   | RT1802 |    5165 - 1919457    |
|   Moonriver    |   RT1001   | RT1801 |  1052242 - 2572555   |
| Moonbase Alpha |   RT1001   | RT1800 |  1285916 - 2748785   |

You can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1719){target=_blank} for more information.

***

#### Block Parent Hash Calculated Incorrectly {: #block-parent-hash-calculated-incorrectly }

After EIP-1559 support was introduced, which included the transition to new Ethereum transaction types, the block header parent hash was calculated wrongly to `H256::default`.

This bug only impacted Moonbase Alpha and existed during the following runtime and block range:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT1200   | RT1201 |  1648994 - 1679618   |

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/570){target=_blank}

***

#### Incorrect Handling of EIP-1559 Gas Fees {: #incorrect-gas-fees-eip1559 }

With the introduction of EIP-1559 support, the logic for handling `maxFeePerGas` and `maxPriorityFeePerGas` was implemented incorrectly, and as a result, the `maxPriorityFeePerGas` was added to the `baseFee` even if the total amount was over the `maxFeePerGas`. 

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1401 |   415946 - 915320    |
|   Moonriver    |   RT1201   | RT1401 |  1471037 - 1705939   |
| Moonbase Alpha |   RT1200   | RT1400 |  1648994 - 1962557   |

For more information, you can review the [relative Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/45){target=_blank}.

***

#### Transaction Fees Paid to Collators {: #transaction-fees-paid-to-collators }

For blocks that included EIP-1559 transactions where a priority fee is applied, the transaction fees were incorrectly calculated and distributed to the collator of the block. The fee model on Moonbeam for transactions and smart contract execution are handled so that 20% of the fees go to the on-chain treasury and 80% are burned as a deflationary force. Due to this bug, the transaction fees of the impacted transactions were not burned as expected.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1504 |   415946 - 1117309   |
|   Moonriver    |   RT1201   | RT1504 |  1471037 - 1910639   |
| Moonbase Alpha |   RT1200   | RT1504 |  1648994 - 2221772   |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1528){target=_blank}.

***

#### Incorrect State Root Hash {: #incorrect-state-root-hash }

The state root hash was being calculated incorrectly for non-legacy transactions as the transaction-type byte was not taken into account. With the support of [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930){target=_blank} and [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=_blank}, the transaction types intoduced are `0x01` (1) and `0x02` (2), respectively. These transaction types were omitted from the state root hash calculation.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1701 |   415946 - 1581456   |
|   Moonriver    |   RT1201   | RT1701 |  1471037 - 2281722   |
| Moonbase Alpha |   RT1200   | RT1700 |  1648994 - 2529735   |

For more information, you can review the [relative Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/86){target=_blank} and [Moonbeam PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1678/files){target=_blank}.

***

#### Ethereum Transations Duplicated in Storage {: #ethereum-transactions-duplicated-in-storage }

An upstream bug was introduced to Frontier in the Ethereum Pallet that caused pending transactions that existed as a runtime upgrade was happening to be duplicated in storage across two different blocks. This only impacted the first two blocks after the runtime upgrade in which this bug was introduced.

Only Moonriver and Moonbase Alpha were impacted. The bug was introduced in the following runtimes and affected the following blocks:

|    Network     | Introduced |   Impacted Blocks   |
|:--------------:|:----------:|:-------------------:|
|   Moonriver    |   RT1605   | 2077599 and 2077600 |
| Moonbase Alpha |   RT1603   | 2285347 and 2285348 |

The following transactions were duplicated:

=== "Moonriver"

    ```js
    '0x2cceda1436e32ae3b3a2194a8cb5bc4188259600c714789bae1fedc0bbc5125f',
    '0x3043660e35e89cafd7b0e0dce9636f5fcc218fce2a57d1104cf21aabbff9a1c0',
    '0x514411fb5c08f7c5aa6c61c38f33edfa74ff7e160831f6140e8dd3783648dbca',
    '0xf1647c357d8e1b05c522d11cff1f5090a4df114595d0f4b9e4ac5bb746473eea',
    '0x4be94803fe7839d5ef13ddd2633a293b4a7dddbe526839c15c1646c72e7b0b23',
    '0x15fceb009bd49692b598859f9146303ed4d8204b38e35c147fcdb18956679dbe',
    '0xa7460d23d5c633feec3d8e8f4382240d9b71a0d770f7541c3c32504b5403b70c',
    '0x1c838b4c4e7796a9db5edfd0377aee6e0d89b623bf1d7803f766f4cf71daefb9',
    '0xfb233a893e62d717ed627585f14b1ee8b3e300ac4e2c3016eb63e546a60820f0',
    '0xfaf8908838683ad51894eb3c68196afb99ba2e2bb698a40108960ee55417b56a',
    '0xa53973acbeac9fe948015dcfad6e0cb28d91b93c8115347c178333e73fd332d3',
    '0x9df769c96c5fdd505c67fee27eaff3714bf8f3d45a2afc02dd2984884b3cecac',
    '0x8f912ae91b408f082026992a87060ed245dac6e382a84288bd38fc08dbac30fe',
    '0xb22af459d24cb25bc53785bdd0ae6a573e24f226c94fd8d2e4663b87d3b07a88',
    '0x8ab9cd2bde7d679f798528b0c75325787f5fc7997e00589445b35b3954a815aa',
    '0xd08a1f82f4d3dc553b4b559925f997ef8bb85cb24cb4d0b893f017129fb33b78',
    '0xa1d40bce7cc607c19ca4b37152b6d8d3a408e3de6b9789c5977fcdef7ef14d97',
    '0xe442227634db10f5d0e8c1da09f8721c2a57267edbf97c4325c4f8432fd48ade',
    '0x0b4f5d8338a7c2b1604c1c42e96b12dc2a9d5ab264eb74ff730354e9765de13f',
    '0x0b00fc907701003aad75560d8b1a33cbf4b75f76c81d776b8b92d20e1d2e9d31',
    '0x9c18bd783f28427d873970ff9deaf1549db2f9a76e3edd6bdeae11358e447ef4',
    '0x8b2523f163989969dd0ebcac85d14805756bc0075b89da1274fd2c53ccaa396a',
    '0x47e80a0c533265974a55ea62131814e31b10f42895709f7e531e3e7b69f1387c'
    ```

=== "Moonbase Alpha"

    ```js
    '0x006a6843eb35ad35a9ea9a99affa8d81f1ed500253c98cc9c080d84171a0afb3',
    '0x64c102f664eb435206ad4fcb49b526722176bcf74801c79473c3b5b2c281a243',
    '0xf546335453b6e35ce7e236ee873c96ba3a22602b3acc4f45f5d68b33a76d79ca',
    '0x4ed713ccd474fc33d2022a802f064cc012e3e37cd22891d4a89c7ba3d776f2db',
    '0xa5355f86844bb23fe666b10b509543fa377a9e324513eb221e0a2c926a64cae4',
    '0xc14791a3a392018fc3438f39cac1d572e8baadd4ed350e0355d1ca874a169e6a'
    ```

The duplicated transactions belong to the first block. So, on Moonriver the transactions belong to block 2077599 and on Moonbase Alpha the impacted transactions belong to 2285347.

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/paritytech/frontier/pull/638){target=_blank}.

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

#### Remote EVM Calls Return Identical Transaction Hashes {: #remote-evm-calls-return-identical-tx-hashes }

When multiple remote EVM calls were sent from different accounts with the same transaction payload and nonce, the same transaction hash was returned for each call. This was possible because remote EVM calls are executed from a keyless account, so if the senders all had the same nonce and were sending the same transaction object, there was no differentiation in the calculation of the transaction hash. This was fixed by adding a global nonce to the Ethereum XCM Pallet, which is the pallet that makes remote EVM calls possible.

This bug only existed on Moonbase Alpha during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT1700   | RT1900 |  2529736 - 3069634   |

You can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1790){target=_blank} for more information.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/679){target=_blank}.

***

#### Add Support for VRF Keys {: #add-support-for-vrf-keys }

When VRF key support was introduced, the `MappingWithDeposit` storage item of the author mapping pallet was updated to include a `keys` field to support VRF keys that can be looked up via the Nimbus ID. As such, a migration was applied to update the existing storage items with this new field.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1407){target=_blank}.

***

#### One Nimbus ID per Account ID {: #one-nimbus-id-per-account-id }

A migration was applied to ensure that an account ID can have only one Nimbus ID. The migration accepted the first Nimbus ID owned by a given account and cleared any additional Nimbus IDs associated to the account. For any cleared associations, the bond for the association was returned.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1606      |    1326697    |
|   Moonriver    |      RT1605      |    2077599    |
| Moonbase Alpha |      RT1603      |    2285347    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1525){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1744){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1962){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/505){target=_blank}.

***

#### Patch Total Staked Amount {: #patch-total-staked-amount }

There was a migration applied to the `total` staked amount of the `CollatorState` storage item in the Parachain Staking Pallet due to a potential bug that may have led to an incorrect amount.

This migration was only applied to Moonriver and Moonbase Alpha and was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |       RT53       |     9696      |
| Moonbase Alpha |       RT52       |    238827     |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/502){target=_blank}.

***

#### Support Delayed Nominator (Delegator) Exits {: #support-delayed-nominator-exits }

The exit queue for handling candidate exits had been updated to include support for delayed nominator (delegator) exits and revocations, which required a migration to update the `ExitQueue` parachain staking pallet storage item to `ExitQueue2`. The `NominatorState` storage item was also migrated to `NominatorState2`  to prevent a nominator from performing more nominations when they already have scheduled an exit.

These migrations were only applied to Moonriver and Moonbase Alpha and were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |      RT200       |    259002     |
| Moonbase Alpha |      RT200       |    457614     |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/610){target=_blank}.

***

#### Purge Staking Storage Bloat {: #purge-staking-storage-bloat }

A migration was applied to purge staking storage bloat for the `Points` and `AtStake` storage items of the parachain staking pallet that are older than two rounds.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1001      |     5165      |
|   Moonriver    |      RT1001      |    1052242    |
| Moonbase Alpha |      RT1001      |    1285916    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/970){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/810){target=_blank}.

***

#### Increase Max Delegations per Candidate {: #increase-max-delegations-per-candidate }

A migration was applied to increase the maximum number of delegations per candidate in the parachain staking pallet. It increased the delegations from 100 to 500 on Moonbase Alpha and Moonriver and from 100 to 1000 on Moonbeam.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1101      |    171061     |
|   Moonriver    |      RT1101      |    1188000    |
| Moonbase Alpha |      RT1100      |    1426319    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1096){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1117){target=_blank}.

***

#### Patch Incorrect Total Delegations {: #patch-incorrect-total-delegations }

There was a migration applied to fix the [Incorrect Collator Selection](#incorrect-collator-selection) bug and patch the delegations total for all candidates.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=_blank}.

***

#### Split Delegator State into Delegation Scheduled Requests {: #split-delegator-state }

A migration was applied that moved pending delegator requests from the `DelegatorState` storage item of the parachain staking pallet into a new `DelegationScheduledRequests` storage item. 

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1408){target=_blank}.

***

#### Replace Staking Reserves with Locks {: #replace-staking-reserves }

A migration was applied that changed users' staking reserved balances to locked balances. The locked balance is the same type as democracy-locked funds, making it possible for users to use their staked funds to participate in democracy.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1701      |    1581457    |
|   Moonriver    |      RT1701      |    2281723    |
| Moonbase Alpha |      RT1700      |    2529736    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1604){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1878){target=_blank}.

***

### Referenda Pallet {: #referenda-pallet }

To support refunds for Submission Deposits on closed referendum, a migration was introduced that updated the `ReferendumInfo` type. The following invariants of `ReferendumInfo` were changed so that the second parameter, `Deposit<AccountId, Balance>`, is now optional, `Option<Deposit<AccountId, Balance>>`: `Approved`, `Rejected`, `Cancelled`, and `TimedOut`.

This stemmed from an upstream change to the [Substrate](https://github.com/paritytech/substrate/pull/12788){target=_blank} repository.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2302      |    3456477    |
|   Moonriver    |      RT2302      |    4133065    |
| Moonbase Alpha |      RT2301      |    4172407    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2134){target=_blank}.

***

### XCM-Related Pallets {: #xcm-related-pallets }

#### Update Transact Info Storage Item {: #update-transaction-info }

There was a migration applied to the `TransactInfo` storage item of the XCM Transactor Pallet that changed the following items:

- `max_weight` is added to prevent transactors from stalling the queue in the destination chain
- Removes `fee_per_byte`, `metadata_size`, and `base_weight` as these items are not necessary for XCM transactions
- `fee_per_second` replaces `fee_per_weight` to better reflect cases (like Kusama) in which the `fee_per_weight` unit is lower than one

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1114){target=_blank}.

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1159){target=_blank}.

***

#### Add New Supported Fee Payment Assets Storage Item {: #add-supported-fee-payment-assets }

A migration was applied to the asset manager pallet that creates a new`SupportedFeePaymentAssets` storage item by reading the supported asset data from the `AssetTypeUnitsPerSecond` storage item. This storage item will hold all of the assets that we accept for XCM fee payment. It will be read when an incoming XCM message is received, and if the asset is not in storage, the message will not be processed.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1118){target=_blank}.

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

For more information, you can review the [relative Nimbus PR](https://github.com/moonbeam-foundation/nimbus/pull/45/){target=_blank} and [Moonbeam PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1400){target=_blank}.
