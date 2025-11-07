---
title: Historical Updates
description: An overview of the historical updates made on Moonbeam and Moonriver, such as migrations and bug fixes applied to the Moonbeam source code.
categories: Reference
---

# Historical Updates

## Introduction {: #introduction }

This page overviews historical updates on Moonbeam and Moonriver, such as bug fixes to the Moonbeam source code and data migrations applied.

This page aims to provide information about unexpected behaviors or data inconsistencies associated with updates that require forced data migrations.

## Bugs {: #bugs }

#### Invalid Transactions Stored {: #invalid-transactions-stored }

For invalid transactions where the transaction cost couldn't be paid, the EVM pallet inserted the transaction metadata into storage instead of discarding it because there was no transaction cost validation. As a result, the runtime storage was unnecessarily bloated with invalid transaction data.

This bug only impacted Moonriver and Moonbase Alpha and existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed | Impacted Block Range |
|:--------------:|:----------:|:-----:|:--------------------:|
|   Moonriver    |    RT49    | RT600 |      0 - 455106      |
| Moonbase Alpha |    RT40    | RT600 |      0 - 675175      |

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/polkadot-evm/frontier/pull/465){target=\_blank}.

---

#### Ethereum Fees Weren't Sent to Treasury {: #ethereum-fees-to-treasury }

The Moonbeam transaction fee model before Runtime 3401 and the passage of [MB101](https://forum.moonbeam.network/t/proposal-mb101-burn-100-of-transaction-fees-on-moonbeam/2022){target=\_blank} mandated a 20% allocation of fees sent to the on-chain Treasury and 80% burned as a deflationary force. However, before runtime 800, Ethereum transactions did not correctly allocate 20% of the transaction fees to the on-chain Treasury.

This bug only impacted Moonriver and Moonbase Alpha and existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed | Impacted Block Range |
|:--------------:|:----------:|:-----:|:--------------------:|
|   Moonriver    |    RT49    | RT800 |      0 - 684728      |
| Moonbase Alpha |    RT40    | RT800 |      0 - 915684      |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/732){target=\_blank}.

---

#### Missing Refunds {: #missing-refunds }

Moonbeam is configured to set the existential deposit to 0, meaning that accounts do not need a minimum balance to be considered active. For Substrate-based chains with this configuration, some refunds were missing from zeroed accounts because the account was interpreted as not existing.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1001 |       0 - 5164       |
|   Moonriver    |    RT49    | RT1001 |     0 - 1052241      |
| Moonbase Alpha |    RT40    | RT1001 |     0 - 1285915      |

For more information, you can review the [relative Frontier PR](https://github.com/polkadot-evm/frontier/pull/509){target=\_blank} and the associated [Substrate PR on GitHub](https://github.com/paritytech/substrate/issues/10117){target=\_blank}.

---

#### Incorrect Collator Selection {: #incorrect-collator-selection }

The total delegations for collator candidates were not correctly updated when a delegation was increased via the `delegatorBondMore` extrinsic. This led to issues where the increased delegation amount wasn't included in the candidates' total amount bonded, which is used to determine which candidates are in the active set of collators. As a result, some candidates may not have been selected to be in the active set when they should have been, impacting their own and their delegators' rewards.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1300 |      0 - 524762      |
|   Moonriver    |    RT49    | RT1300 |     0 - 1541735      |
| Moonbase Alpha |    RT40    | RT1300 |     0 - 1761128      |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=\_blank}.

---

#### New Account Event Bug {: #new-account-event }

The `System.NewAccount` event is emitted when a new account is created. However, a bug prevented this event from being emitted for some accounts at creation time. A hotfix was applied that patched the impacted accounts and emitted the `System.NewAccount` at a later time.

The hotfix was applied in the following block ranges:

|    Network     |                                                              Block Range                                                              |
|:--------------:|:-------------------------------------------------------------------------------------------------------------------------------------:|
|    Moonbeam    | [1041355 - 1041358 and 1100752](https://moonbeam.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=\_blank} |
|   Moonriver    |      [1835760 - 1835769](https://moonriver.subscan.io/extrinsic?module=evm&call=hotfix_inc_account_sufficients){target=\_blank}       |
| Moonbase Alpha |  [2097782 - 2097974](https://moonbase.subscan.io/extrinsic?address=&module=evm&call=hotfix_inc_account_sufficients){target=\_blank}   |

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1401 |      0 - 915320      |
|   Moonriver    |    RT49    | RT1401 |     0 - 1705939      |
| Moonbase Alpha |    RT40    | RT1400 |     0 - 1962557      |

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/moonbeam-foundation/frontier/pull/46/files){target=\_blank}.

---

#### Incorrect Timestamp Units {: #incorrect-timestamp-units }

EIP-2612 and Ethereum blocks deal with timestamps in seconds; however, the Substrate timestamp pallet that Moonbeam implements uses milliseconds. This only affected the EIP-2612 implementation, not the `block.timestamp` value.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT1606 |     0 - 1326697      |
|   Moonriver    |    RT49    | RT1605 |     0 - 2077598      |
| Moonbase Alpha |    RT40    | RT1603 |     0 - 2285346      |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1451){target=\_blank}.

---

#### Substrate Tips Missing Treasury Distribution {: #substrate-tips }

Tips for Substrate-based transactions weren't handled properly. The entire portion of the tip was burned because it was not handled in the runtime code. A fix was applied so that 20% was paid to the Treasury and 80% was burned, consistent with all other fee behavior at that time.

Note that RT3401 introduced a parameters pallet fee configuration allowing governance to adjust how fees are split between the Treasury and burning. After this runtime upgrade combined with the passage of [MB101](https://forum.moonbeam.network/t/proposal-mb101-burn-100-of-transaction-fees-on-moonbeam/2022){target=\_blank}, 100% of all transaction fees on both Moonbeam and Moonriver are now burned.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT900    | RT2403 |     0 - 4163078      |
|   Moonriver    |    RT49    | RT2401 |     0 - 4668844      |
| Moonbase Alpha |    RT40    | RT2401 |     0 - 4591616      |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2291){target=\_blank}.

---

#### Incorrect Delegation Reward Calculation {: #incorrect-delegation-reward-calculation }

The reward payouts for all delegations and collators were underestimated whenever there were pending requests. Delegation rewards are calculated based on the amount of tokens bonded by each delegator with respect to the total stake of the given collator. By counting delegation amounts for pending requests, the rewards to collators and their delegations were less than they should have been.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1001   | RT1802 |    5165 - 1919457    |
|   Moonriver    |   RT1001   | RT1801 |  1052242 - 2572555   |
| Moonbase Alpha |   RT1001   | RT1800 |  1285916 - 2748785   |

You can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1719){target=\_blank} for more information.

---

#### Block Parent Hash Calculated Incorrectly {: #block-parent-hash-calculated-incorrectly }

After EIP-1559 support was introduced, which included the transition to new Ethereum transaction types, the block header parent hash was miscalculated to `H256::default`.

This bug only impacted Moonbase Alpha and only impacted the following block:

|    Network     | Introduced | Fixed  | Impacted Block |
|:--------------:|:----------:|:------:|:--------------:|
| Moonbase Alpha |   RT1200   | RT1201 |    1648995     |

While the root issue was fixed in RT1201, the incorrect hash was corrected in RT2601.

For more information on the root fix, you can review the [relative Frontier PR on GitHub](https://github.com/polkadot-evm/frontier/pull/570/){target=\_blank}. To take a look at the correction of the parent hash, check out the corresponding [Moonbeam PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2524){target=\_blank}.

---

#### Incorrect Handling of EIP-1559 Gas Fees {: #incorrect-gas-fees-eip1559 }

With the introduction of EIP-1559 support, the logic for handling `maxFeePerGas` and `maxPriorityFeePerGas` was implemented incorrectly. As a result, the `maxPriorityFeePerGas` was added to the `baseFee` even if the total amount was over the `maxFeePerGas`.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1401 |   415946 - 915320    |
|   Moonriver    |   RT1201   | RT1401 |  1471037 - 1705939   |
| Moonbase Alpha |   RT1200   | RT1400 |  1648994 - 1962557   |

For more information, you can review the [relative Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/45){target=\_blank}.

---

#### Transaction Fees Paid to Collators {: #transaction-fees-paid-to-collators }

For blocks that included EIP-1559 transactions where a priority fee was applied, the transaction fees were incorrectly calculated and distributed to the block's collator. The fee model on Moonbeam for transactions and smart contract execution was previously handled so that 20% of the fees went to the on-chain Treasury and 80% were burned as a deflationary force. Due to this bug, the transaction fees of the impacted transactions were not burned as expected.

Note that RT3401 introduced a parameters pallet fee configuration allowing governance to adjust how fees are split between the Treasury and burning. After this runtime upgrade combined with the passage of [MB101](https://forum.moonbeam.network/t/proposal-mb101-burn-100-of-transaction-fees-on-moonbeam/2022){target=\_blank}, 100% of all transaction fees on both Moonbeam and Moonriver are now burned.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1504 |   415946 - 1117309   |
|   Moonriver    |   RT1201   | RT1504 |  1471037 - 1910639   |
| Moonbase Alpha |   RT1200   | RT1504 |  1648994 - 2221772   |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1528){target=\_blank}.

---

#### Incorrect State Root Hash {: #incorrect-state-root-hash }

The state root hash was miscalculated for non-legacy transactions as the transaction-type byte was not considered. With the support of [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930){target=\_blank} and [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559){target=\_blank}, the transaction types introduced are `0x01` (1) and `0x02` (2), respectively. These transaction types were omitted from the state root hash calculation.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT1701 |   415946 - 1581456   |
|   Moonriver    |   RT1201   | RT1701 |  1471037 - 2281722   |
| Moonbase Alpha |   RT1200   | RT1700 |  1648994 - 2529735   |

For more information, you can review the [relative Frontier PR](https://github.com/moonbeam-foundation/frontier/pull/86){target=\_blank} and [Moonbeam PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1678/files){target=\_blank}.

---

#### Ethereum Transactions Duplicated in Storage {: #ethereum-transactions-duplicated-in-storage }

An upstream bug was introduced to Frontier in the Ethereum Pallet, causing pending transactions that existed during a runtime upgrade to be duplicated in storage across two different blocks. This only impacted the first two blocks after the runtime upgrade in which this bug was introduced.

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

The duplicated transactions belong to the first block. So, on Moonriver, the transactions belong to block 2077599, and on Moonbase Alpha, the impacted transactions belong to block 2285347.

For more information, you can review the [relative Frontier PR on GitHub](https://github.com/polkadot-evm/frontier/pull/638){target=\_blank}.

---

#### Gas Limit Too High for Non-Transactional Calls {: #gas-limit-too-high-for-non-transactional-calls }

When a non-transactional call, such as `eth_call` or `eth_estimateGas`, is made without specifying a gas limit for a past block, the client defaults to using the gas limit multiplier (10x), which causes the gas limit validation to fail as it is validating against an upper bound of the block gas limit. So, if the gas limit is greater than the block gas limit for a given call, a gas limit too high error is returned.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1701   | RT1802 |  1581457 - 1919457   |
|   Moonriver    |   RT1701   | RT1802 |  2281723 - 2616189   |
| Moonbase Alpha |   RT1700   | RT1802 |  2529736 - 2879402   |

You can review the [relative Frontier PR on GitHub](https://github.com/polkadot-evm/frontier/pull/935){target=\_blank} for more information.

---

#### Remote EVM Calls Return Identical Transaction Hashes {: #remote-evm-calls-return-identical-tx-hashes }

When multiple remote EVM calls were sent from different accounts with the same transaction payload and nonce, the same transaction hash was returned for each call. This was possible because remote EVM calls are executed from a keyless account, so if the senders all had the same nonce and were sending the same transaction object, there was no differentiation in the calculation of the transaction hash. This was fixed by adding a global nonce to the Ethereum XCM Pallet, which is the pallet that makes remote EVM calls possible.

This bug only existed on Moonbase Alpha during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT1700   | RT1900 |  2529736 - 3069634   |

You can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1790){target=\_blank} for more information.

---

#### Gas Estimation Discrepancy {: #gas-estimation-discrepancy }

There was a difference between estimating the gas for a transaction using a non-transaction call, such as `eth_call`, and the execution of it on-chain. The discrepancy occurred because the non-transactional calls were not properly accounting for `maxFeePerGas` and `maxPriorityFeePerGas`, as such, the ([Proof of Validity](https://wiki.polkadot.com/general/glossary/#proof-of-validity){target=\_blank}) consumed by the Ethereum transaction was counted differently. This was fixed by properly accounting for these fields when estimating the size of the on-chain transaction.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT2501 |   415946 - 4543267   |
|   Moonriver    |   RT1201   | RT2500 |  1471037 - 5175574   |
| Moonbase Alpha |   RT1200   | RT2500 |  1648994 - 5053547   |

You can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1790/){target=\_blank} for more information.

---

#### Incorrect Effective Gas Price In Transaction Receipts {: #incorrect-effective-gas-price }

The `effectiveGasPrice` value returned by `eth_getTransactionReceipt` was different from the on-chain value due to an incorrect calculation of the base fee. Specifically, the transaction receipt's value was computed using the `NextFeeMultiplier` from the block in which the transaction was included rather than the previous block, which is the correct source for computing the base fee.

This bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
|    Moonbeam    |   RT1201   | RT2801 |   415946 - 5899847   |
|   Moonriver    |   RT1201   | RT2801 |  1471037 - 6411588   |
| Moonbase Alpha |   RT1200   | RT2801 |  1648994 - 6209638   |

You can review the [relative Frontier PR](https://github.com/polkadot-evm/frontier/pull/1280){target=\_blank} and [Moonbeam PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2610){target=\_blank} for more information.

---

#### Skipped Ethereum Transaction Traces {: #skipped-ethereum-transaction-traces }

Runtimes with the `evm-tracing` feature enabled introduced additional `ref_time` overhead due to special logic that traces Ethereum transactions (emitting events for each component: gasometer, runtime, EVM) used to fill information for RPC calls like `debug_traceTransaction` and `trace_filter`. 

Since the real `ref_time` in production runtimes is smaller, this could cause the block weight limits to be reached when replaying a block in an EVM-tracing runtime, resulting in skipped transaction traces. This was observed in Moonbeam block [9770044](https://moonbeam.subscan.io/block/9770044){target=\_blank}.

The fix consisted of resetting the previously consumed weight before tracing each Ethereum transaction. It's important to note that this issue only affected code under `evm-tracing`, which is not included in any production runtime.

This bug was fixed in the following runtime:

|    Network     | Fixed  | Impacted Block |
|:--------------:|:------:|:--------------:|
|    Moonbeam    | RT3501 |    9770044     |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/3210){target=\_blank}.

---

#### Notify Inactive Collator Fails for Long-Inactive Collators {: #notify-inactive-collator-fails }

The `notifyInactiveCollator` extrinsic, designed to remove collators from the pool if they haven't produced any blocks in the last two rounds, failed for collators who had been inactive for significantly longer than two rounds. The transaction would only succeed within the first few blocks of a new round.

The bug existed during the following runtimes and block ranges:

|    Network     | Introduced | Fixed  | Impacted Block Range |
|:--------------:|:----------:|:------:|:--------------------:|
| Moonbase Alpha |   RT2601   | RT3500 |  5474345 – 10750816  |
|   Moonriver    |   RT2602   | RT3501 |  5638536 – 10665393  |
|    Moonbeam    |   RT2602   | RT3501 |  4977160 – 10056989  |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/3128){target=\_blank}.
---

## Migrations {: #migrations }

Migrations are necessary when a storage item is changed or added and needs to be populated with data. The migrations listed below have been organized by the impacted pallet(s).

### Author Mapping Pallet {: #author-mapping }

#### Update the Mapping Storage Item {: #update-mapping-storage-item }

This migration updated the now deprecated `Mapping` storage item of the author mapping pallet to use a more secure hasher type. The hasher type was updated to [Blake2_128Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Blake2_128Concat.html){target=\_blank} instead of [Twox64Concat](https://paritytech.github.io/substrate/master/frame_support/struct.Twox64Concat.html){target=\_blank}.

This migration was only applied to Moonriver and Moonbase Alpha and was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |      RT800       |    684728     |
| Moonbase Alpha |      RT800       |    915684     |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/679){target=\_blank}.

---

#### Add Support for VRF Keys {: #add-support-for-vrf-keys }

When VRF key support was introduced, the `MappingWithDeposit` storage item of the author mapping pallet was updated to include a `keys` field to support VRF keys that can be looked up via the Nimbus ID. A migration was applied to update the existing storage items with this new field.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1407){target=\_blank}.

---

#### One Nimbus ID per Account ID {: #one-nimbus-id-per-account-id }

A migration was applied to ensure that an account ID can have only one Nimbus ID. The migration accepted the first Nimbus ID owned by a given account and cleared any additional Nimbus IDs associated with the account. For any cleared associations, the bond for the association was returned.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1606      |    1326697    |
|   Moonriver    |      RT1605      |    2077599    |
| Moonbase Alpha |      RT1603      |    2285347    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1525){target=\_blank}.

---

### Base Fee Pallet {: #base-fee }

#### Set Elasticity Storage Item Value {: #set-elasticity }

This migration sets the `Elasticity` storage item of the base fee pallet to zero, which results in a constant `BaseFeePerGas`.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1744){target=\_blank}.

---

### Democracy Pallet {: #democracy }

#### Preimage Storage Moved to New Preimage Pallet

A migration was applied, which moved preimages stored in the democracy pallet to a new preimage pallet. This migration on Moonbeam was required as a result of an [upstream change to Polkadot](https://github.com/paritytech/substrate/pull/11649/){target=\_blank}.

There was one preimage that was affected in Moonbeam, which was dropped from the scheduler queue and never executed: `0x14262a42aa6ccb3cae0a169b939ca5b185bc317bb7c449ca1741a0600008d306`. This preimage was [manually removed](https://moonbeam.subscan.io/extrinsic/2693398-8){target=\_blank} by the account that initially submitted the preimage.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2000      |    3310369    |
|   Moonriver    |      RT2000      |    3202604    |
| Moonbase Alpha |      RT2000      |    2673234    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1962){target=\_blank}.

---

#### Remove Governance V1 Collectives {: #remove-gov-v1-collectives }

A migration was applied to remove the governance V1 collectives, which included the Council and Technical Committee. The governance V1 collectives were replaced with the OpenGov (governance V2) Technical Committee.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2801      |    5899847    |
|   Moonriver    |      RT2801      |    6411588    |
| Moonbase Alpha |      RT2801      |    6209638    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2643){target=\_blank}.

A follow-up migration was required to properly clear the storage entries associated with the governance V1 collectives, which was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2901      |    6197065    |
|   Moonriver    |      RT2901      |    6699589    |
| Moonbase Alpha |      RT2901      |    6710531    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2711){target=\_blank}.

---

#### Remove Governance V1 Democracy Pallet {: #remove-gov-v1-collectives }

A migration was applied to remove the storage associated with the Democracy Pallet used in governance V1. The Democracy Pallet was replaced with the Preimage, Referenda, and Collective Voting OpenGov (governance V2) pallets.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2901      |    6197065    |
|   Moonriver    |      RT2901      |    6699589    |
| Moonbase Alpha |      RT2901      |    6710531    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2685){target=\_blank}.

---

### EVM Pallet {: evm-pallet }
#### EVM Contract Metadata
A migration was introduced to automate the manual process of setting EVM contract metadata for contracts deployed more than two years ago that hadn't been interacted with after the introduction of metadata storage item. This migration replaces the need to manually call `createContractMetadata(address)` on these contracts to make them compatible with the current runtime. 

This migration was executed at the following runtimes and blocks:

|  Network  | Executed Runtime | Block Applied |
|:---------:|:----------------:|:-------------:|
| Moonbeam  |      RT3200      |    7985204    |
| Moonriver |      RT3200      |    8519187    |

---

### Moonbeam Orbiter Pallet {: #moonbeam-orbiter }

#### Remove the Minimum Bond Requirement for Orbiter Collators {: #remove-orbiter-minimum-bond }

A migration was applied to the Moonbeam Orbiter Pallet that sets the bonds of the existing orbiter collators to zero. This change enabled payouts to be even for future orbiter program expansions.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2602      |    4977160    |
|   Moonriver    |      RT2602      |    5638536    |
| Moonbase Alpha |      RT2601      |    5474345    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2526){target=\_blank}.

---

### Parachain Staking Pallet {: #parachain-staking }

#### Update Collator State Storage Item {: #update-collator-state-storage-item }

A migration was applied that updated the `Collator` storage item of the parachain staking pallet to the new `Collator2` storage item. This change updated the collator state to include the following items:

- The `nominators` set is a list of all of the nominator (delegator) account IDs without their respective balance bonded
- A new `top_nominators` storage item that returns a list of all of the top nominators ordered by greatest bond amount to least
- A new `bottom_nominators` storage item that returns a list of all of the bottom nominators ordered by least bond amount to greatest
- The `total` storage item was replaced with `total_counted` and `total_backing`. The `total_counted` item returns the sum of the top nominations and the collator's self-bond, whereas the `total_backing` item returns the sum of all of the nominations and the collator's self-bond

This migration was only applied to Moonriver and Moonbase Alpha and was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |       RT53       |     9696      |
| Moonbase Alpha |       RT52       |    238827     |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/505){target=\_blank}.

---

#### Patch Total Staked Amount {: #patch-total-staked-amount }

A migration was applied to the `total` staked amount of the `CollatorState` storage item in the Parachain Staking Pallet due to a potential bug that may have led to an incorrect amount.

This migration was only applied to Moonriver and Moonbase Alpha and was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |       RT53       |     9696      |
| Moonbase Alpha |       RT52       |    238827     |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/502){target=\_blank}.

---

#### Support Delayed Nominator (Delegator) Exits {: #support-delayed-nominator-exits }

The exit queue for handling candidate exits had been updated to include support for delayed nominator (delegator) exits and revocations, which required a migration to update the `ExitQueue` parachain staking pallet storage item to `ExitQueue2`. The `NominatorState` storage item was also migrated to `NominatorState2` to prevent a nominator from performing more nominations when they already have scheduled an exit.

These migrations were only applied to Moonriver and Moonbase Alpha and were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|   Moonriver    |      RT200       |    259002     |
| Moonbase Alpha |      RT200       |    457614     |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/610){target=\_blank}.

---

#### Purge Staking Storage Bloat {: #purge-staking-storage-bloat }

A migration was applied to purge staking storage bloat for the `Points` and `AtStake` storage items of the parachain staking pallet that are older than two rounds.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1001      |     5165      |
|   Moonriver    |      RT1001      |    1052242    |
| Moonbase Alpha |      RT1001      |    1285916    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/970){target=\_blank}.

---

#### Support Manual Exits and DPoS Terminology {: #support-manual-exits-dpos-terminology }

The parachain staking pallet was updated to include manual exits. If a candidate or delegator wanted to decrease or revoke their bond or leave the candidate or delegator pool, they would need to schedule a request first, wait for a delay period to pass, and then manually execute the request. As such, a migration was applied to replace the automatic exit queue, including the `ExitQueue2` storage item, with a manual exits API.

In addition, a change was made to switch from Nominated Proof of Stake (NPoS) to Delegated Proof of Stake (DPoS) terminology; this marked the sweeping change from "nominate" to "delegate". This required the migration of the following parachain staking pallet storage items:

- `CollatorState2` was migrated to `CandidateState`
- `NominatorState2` was migrated to `DelegatorState`

These migrations were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1001      |     5165      |
|   Moonriver    |      RT1001      |    1052242    |
| Moonbase Alpha |      RT1001      |    1285916    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/810){target=\_blank}.

---

#### Increase Max Delegations per Candidate {: #increase-max-delegations-per-candidate }

A migration was applied to increase the maximum number of delegations per candidate in the parachain staking pallet. It increased the delegations from 100 to 500 on Moonbase Alpha and Moonriver and from 100 to 1000 on Moonbeam.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1101      |    171061     |
|   Moonriver    |      RT1101      |    1188000    |
| Moonbase Alpha |      RT1100      |    1426319    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1096){target=\_blank}.

---

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1117){target=\_blank}.

---

#### Patch Incorrect Total Delegations {: #patch-incorrect-total-delegations }

There was a migration applied to fix the [Incorrect Collator Selection](#incorrect-collator-selection) bug and patch the delegations total for all candidates.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1291){target=\_blank}.

---

#### Split Delegator State into Delegation Scheduled Requests {: #split-delegator-state }

A migration was applied that moved pending delegator requests from the `DelegatorState` storage item of the parachain staking pallet into a new `DelegationScheduledRequests` storage item.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1408){target=\_blank}.

---

#### Replace Staking Reserves with Locks {: #replace-staking-reserves }

A migration was applied that changed users' staking reserved balances to locked balances. The locked balance is the same type as democracy-locked funds, allowing users to use their staked funds to participate in democracy.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1701      |    1581457    |
|   Moonriver    |      RT1701      |    2281723    |
| Moonbase Alpha |      RT1700      |    2529736    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1604){target=\_blank}.

---

#### Auto-Compounding Support {: #auto-compounding-support }

To support auto-compounding, two migrations were applied to the `AtStake` storage item in the parachain staking pallet:

- `RemovePaidRoundsFromAtStake` - to remove any stale `AtStake` entries relating to already paid-out rounds with candidates that didn't produce any blocks. This migration is a prerequisite for the `MigrateAtStakeAutoCompound` migration
- `MigrateAtStakeAutoCompound` - migrates the snapshots for unpaid rounds for `AtStake` entries

These migrations were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1901      |    2317683    |
|   Moonriver    |      RT1901      |    2911863    |
| Moonbase Alpha |      RT1900      |    3069635    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1878){target=\_blank}.

---

#### Switch to Block-Based Staking Rounds {: #block-based-staking-rounds }

A migration was applied to switch from time-based staking rounds to fixed block-based rounds.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2801      |    5899847    |
|   Moonriver    |      RT2801      |    6411588    |
| Moonbase Alpha |      RT2801      |    6209638    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2690){target=\_blank}.

---

#### Renaming of Parachain Bond Reserve Events {: #renaming-of-parachain-bond-reserve-events }

Prior to Runtime 3300, the `ReservedForParachainBond` event was emitted once per round to indicate parachain bond reserve funding through inflation. In Runtime 3300, this same event was renamed to `InflationDistributed`.

This change took effect at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT3300      |    8381443    |
|   Moonriver    |      RT3300      |    8894417    |
| Moonbase Alpha |      RT3300      |    9062316    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2976){target=\_blank}.


#### ParachainStaking: Currency → Fungible Migration {: #parachainstaking-currency-to-fungible }

A migration was applied to move the `ParachainStaking` pallet from the deprecated Currency trait to the modern Fungible trait. Operationally, staking “locks” were replaced by balance “freezes”: queries that previously read `Balances.Locks` with identifiers [`stkngcol`, `stkngdel`] must now read `Balances.Freezes` with freeze reasons [`StakingCollator``, StakingDelegator`]. The frozen balance shown in `System.Account` is unchanged by this migration. 

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT4000      |       -       |
|   Moonriver    |      RT4000      |       -       |
| Moonbase Alpha |      RT4000      |    14191989    |

---

### Referenda Pallet {: #referenda-pallet }

#### Refunds for Submission Deposits {: #refunds-for-submission-deposits }

A migration was introduced to support refunds for submission deposits on closed referenda that updated the `ReferendumInfo` type. The following invariants of `ReferendumInfo` were changed so that the second parameter, `Deposit<AccountId, Balance>`, is now optional, `Option<Deposit<AccountId, Balance>>`: `Approved`, `Rejected`, `Cancelled`, and `TimedOut`.

This stemmed from an upstream change to the [Substrate](https://github.com/paritytech/substrate/pull/12788){target=\_blank} repository.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2302      |    3456477    |
|   Moonriver    |      RT2302      |    4133065    |
| Moonbase Alpha |      RT2301      |    4172407    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2134){target=\_blank}.

---

#### Restore Corrupted Referenda Deposits {: restore-corrupted-referenda-deposits }

A migration was introduced to support restoring referenda deposits affected by corrupted storage values. The issue arose when a migration was applied twice due to a pallet version error, resulting in invalid values and non-refundable submission deposits. As the number of values to correct was finite and small, this migration created a list to update them by hand.

This migration was only applied to Moonbeam and was executed at the following runtimes and blocks:

| Network  | Executed Runtime | Block Applied |
|:--------:|:----------------:|:-------------:|
| Moonbeam |      RT3100      |    7303601    |

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

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1114){target=\_blank}.

---

#### Add Support for Kusama Asset Hub (Statemine) Prefix Breaking Change {: #add-support-statemine-prefix }

The following three migrations were added to the asset manager pallet to avoid issues with Kusama Asset Hub's (previously referred to as Statemine) [breaking change to the way it represents assets](https://github.com/paritytech/cumulus/pull/831){target=\_blank} and possible future breaking changes:

- `UnitsWithAssetType` - updates the `AssetTypeUnitsPerSecond` storage item to a mapping of the `AssetType` to `units_per_second`, instead of the mapping `AssetId` to `units_per_second`. This is done to avoid additional migrations whenever a breaking change arises
- `PopulateAssetTypeIdStorage` - creates a new `AssetTypeId` storage item that holds the `AssetType` to `AssetId` mapping, which allows the decoupling of `assetIds` and `AssetTypes`
- `ChangeStateminePrefixes` - updates already registered Kusama Asset Hub (Statemine) assets to their new form

These migrations were executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1201      |    415946     |
|   Moonriver    |      RT1201      |    1471037    |
| Moonbase Alpha |      RT1200      |    1648994    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1159){target=\_blank}.

---

#### Add New Supported Fee Payment Assets Storage Item {: #add-supported-fee-payment-assets }

A migration was applied to the asset manager pallet, creating a new `SupportedFeePaymentAssets` storage item by reading the supported asset data from the `AssetTypeUnitsPerSecond` storage item. This storage item will hold all the assets we accept for XCM fee payment. It will be read when an incoming XCM message is received, and if the asset is not in storage, the message will not be processed.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1300      |    524762     |
|   Moonriver    |      RT1300      |    1541735    |
| Moonbase Alpha |      RT1300      |    1761128    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1118){target=\_blank}.

---

#### Update the XCM Transactor Storage from V2 to V3 {: #update-xcm-transactor }

With the support of XCM V3, a migration was applied to update the XCM Transactor pallet's storage from XCM V2 to V3. The `transactInfoWithWeightLimit` and `destinationAssetFeePerSecond` storage items were updated to support XCM V3 multilocations.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2302      |    3456477    |
|   Moonriver    |      RT2302      |    4133065    |
| Moonbase Alpha |      RT2301      |    4172407    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2145){target=\_blank}.

---

#### Remove Mintable XC-20s {: #remove-local-assets }

Mintable XC-20s were deprecated in favor of XCM-enabled ERC-20s; as such, a migration was applied to remove the local assets pallet and clear the assets in storage.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT2801      |    5899847    |
|   Moonriver    |      RT2801      |    6411588    |
| Moonbase Alpha |      RT2801      |    6209638    |

For more information, you can review the [relative PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/2634){target=\_blank}.

---

#### Manage Foreign Assets via Smart Contracts  {: #foreign-assets-migration }

A migration was applied to transition existing foreign assets to a new design that manages XCM derivative assets on Moonbeam through EVM smart contracts instead of the previous implementation using the Asset and Asset Manager pallets. The migration process involved several extrinsics in the Moonbeam Lazy Migration pallet:

- **`approve_assets_to_migrate`** - sets the list of asset IDs approved for migration
- **`start_foreign_asset_migration`** - initiates migration for a specific foreign asset by freezing the original asset and creating a new EVM smart contract
- **`migrate_foreign_asset_balances`** - migrates asset balances in batches from old assets pallet to the new system
- **`migrate_foreign_asset_approvals`** - migrates asset approvals in batches while unreserving deposits from the old approval system
- **`finish_foreign_asset_migration`** - completes migration after all balances and approvals are migrated and performs final cleanup

This migration preserves compatibility with existing foreign assets by identifying each foreign asset with the same AssetID integer as before. This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT3501      |    10056989   |
|   Moonriver    |      RT3501      |    10665393   |
| Moonbase Alpha |      RT3500      |    10750816   |

For more information, you can review the relative PRs on GitHub: [2869](https://github.com/moonbeam-foundation/moonbeam/pull/2869){target=\_blank} and [3020](https://github.com/moonbeam-foundation/moonbeam/pull/3020){target=\_blank}.

---

### Nimbus Author Filter Pallet {: #nimbus }

#### Replace Eligible Ratio with Eligible Count {: #replace-eligible-ratio }

A breaking change was applied to the Nimbus repository, deprecating `EligibleRatio` in favor of the `EligibleCount` config. As a result, a migration was applied to the Moonbeam repository, populating the new `EligibleCount` value as a percentage of the potential authors defined at that block height if the `EligibleRatio` value existed. Otherwise, the value was set to a default value of `50`.

This migration was executed at the following runtimes and blocks:

|    Network     | Executed Runtime | Block Applied |
|:--------------:|:----------------:|:-------------:|
|    Moonbeam    |      RT1502      |    1107285    |
|   Moonriver    |      RT1502      |    1814458    |
| Moonbase Alpha |      RT1502      |    2112058    |

For more information, you can review the [relative Nimbus PR](https://github.com/moonbeam-foundation/nimbus/pull/45){target=\_blank} and [Moonbeam PR on GitHub](https://github.com/moonbeam-foundation/moonbeam/pull/1400){target=\_blank}.
