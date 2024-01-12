---
title: XCM Execution Fees
description: Learn about the XCM instructions involved in handling XCM execution fee payments and how to calculate fees on Polkadot, Kusama, and Moonbeam-based networks.
---

# XCM Fees on Moonbeam

## Introduction {: #introduction}

XCM aims to be a language that communicates ideas between consensus systems. Sending an XCM message consists of a series of instructions that are executed in both the origin and the destination chains. The combination of XCM instructions results in actions such as token transfers. In order to process and execute each XCM instruction, there are typically associated fees that must be paid.

However, XCM is designed to be general, extensible, and efficient so that it remains valuable and future-proof throughout a growing ecosystem. As such, the generality applies to concepts including payments of fees for XCM execution. In Ethereum, fees are baked into the transaction protocol, whereas in the Polkadot ecosystem, each chain has the flexibility to define how XCM fees are handled.

This guide will cover aspects of fee payment, such as who is responsible for paying XCM execution fees, how it is paid for, and how the fees are calculated on Moonbeam.

!!! note
    **The following information is provided for general information purposes only.** The weight and extrinsic base cost might have changed since the time of writing. Please ensure you check the actual values, and never use the following information for production apps.

## Payment of Fees {: #payment-of-fees }

Generally speaking, the fee payment process can be described as follows:

1. Some assets need to be provided
2. The exchange of assets for computing time (or weight) must be negotiated
3. The XCM operations will be performed as instructed, with the provided weight limit or funds available for execution

Each chain can configure what happens with the XCM fees and in which tokens they can be paid (either the native reserve token or an external one). For example:

- **Polkadot and Kusama** - the fees are paid in DOT or KSM (respectively) and given to the validator of the block
- **Moonbeam and Moonriver** - the XCM execution fees can be paid in the reserve asset (GLMR or MOVR, respectively), but also in assets originated in other chains if they are registered as an [XCM execution asset](/builders/interoperability/xcm/xc-registration/assets/){target=_blank}. When XCM execution (token transfers or remote execution) is paid in the native chain reserve asset (GLMR or MOVR), {{ networks.moonbeam.treasury.tx_fees_burned }}% is burned, while {{ networks.moonbeam.treasury.tx_fees_allocated }}% is sent to the treasury. When XCM execution is paid in a foreign asset, the fee is sent to the treasury

Consider the following scenario: Alice has some DOT on Polkadot, and she wants to transfer it to Alith on Moonbeam. She sends an XCM message with a set of XCM instructions that will retrieve a given amount of DOT from her account on Polkadot and mint them as xcDOT into Alith's account. Part of the instructions are executed on Polkadot, and the other part is executed on Moonbeam.

How does Alice pay Moonbeam to execute these instructions and fulfill her request? Her request is fulfilled through a series of XCM instructions that are included in the XCM message, which enables her to buy execution time minus any related XCM execution fees. The execution time is used to issue and transfer xcDOT, a representation of DOT on Moonbeam. This means that when Alice sends some DOT to Alith's account on Moonbeam, she'll receive a 1:1 representation of her DOT as xcDOT minus any XCM execution fees. Note that in this scenario, XCM execution fees are paid in xcDOT and sent to the treasury.

The exact process for Alice's transfer is as follows:

1. Assets are sent to an account on Polkadot that is owned by Moonbeam, known as the Sovereign account. After the assets are received, an XCM message is sent to Moonbeam
2. The XCM message in Moonbeam will:
    1. Mint the corresponding asset representation
    2. Buy the corresponding execution time
    3. Use that execution time to deposit the representation (minus fees) to the destination account

### XCM Instructions {: #xcm-instructions }

An XCM message is comprised of a series of XCM instructions. As a result, different combinations of XCM instructions result in different actions. For example, to move DOT to Moonbeam, the following XCM instructions are used:

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

To check how the instructions for an XCM message are built to transfer self-reserve assets to a target chain, such as DOT to Moonbeam, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens){target=_blank} repository (as an example). You'll want to take a look at the [`transfer_self_reserve_asset`](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens/src/lib.rs#L679){target=_blank} function. You'll notice it calls `TransferReserveAsset` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L511){target=_blank}. The XCM message is constructed by combining the `ReserveAssetDeposited` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

To check how the instructions for an XCM message are built to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens){target=_blank} repository. You'll want to take a look at the [`transfer_to_reserve`](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/moonbeam-{{ polkadot_sdk }}/xtokens/src/lib.rs#L696){target=_blank} function. You'll notice that it calls `WithdrawAsset`, then `InitiateReserveWithdraw` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/polkadot/xcm/xcm-executor/src/lib.rs#L639){target=_blank}. The XCM message is constructed by combining the `WithdrawAsset` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

## Relay Chain XCM Fee Calculation  {: #rel-chain-xcm-fee-calc }

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive from a computational cost perspective an extrinsic is. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, in addition to factors such as network congestion.

The following sections will break down how to calculate XCM fees for Polkadot and Kusama. It's important to note that Kusama, in particular, uses benchmarked data to determine the total weight costs for XCM instructions and that some XCM instructions might include database reads and writes, which add weight to the call.

There are two databases available in Polkadot and Kusama: RocksDB (which is the default) and ParityDB, both of which have their own associated weight costs for each network.

### Polkadot {: #polkadot }

The total weight costs on Polkadot take into consideration database reads and writes in addition to the weight required for a given instruction. Polkadot uses benchmarked weights for instructions and database read and write operations. The breakdown of weight costs for the database operations is as follows:

|                                                                                      Database                                                                                      |                         Read                         |                         Write                         |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------:|:-----------------------------------------------------:|
| [RocksDB (default)](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/rocksdb_weights.rs){target=_blank} | {{ networks.polkadot.rocks_db.read_weight.display }} | {{ networks.polkadot.rocks_db.write_weight.display }} |
|     [ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/paritydb_weights.rs){target=_blank}     |    {{ networks.polkadot.parity_db.read_weight }}     |    {{ networks.polkadot.parity_db.write_weight }}     |

Now that you are aware of the weight costs for database reads and writes on Polkadot, you can calculate the weight cost for a given instruction using the base weight for instructions.

For example, the [`WithdrawAsset` instruction](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L55-L63){target=_blank} has a base weight of `{{ networks.polkadot.xcm_instructions.withdraw.base_weight.display }}`, and performs one database read and one database write. Therefore, the total weight cost of the `WithdrawAsset` instruction is calculated as:

```text
{{ networks.polkadot.xcm_instructions.withdraw.base_weight.numbers_only }} + {{ networks.polkadot.rocks_db.read_weight.numbers_only }} + {{ networks.polkadot.rocks_db.write_weight.numbers_only }} = {{ networks.polkadot.xcm_instructions.withdraw.total_weight.numbers_only }}
```

The [`BuyExecution` instruction](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L70-L76){target=_blank} has a base weight of `{{ networks.polkadot.xcm_instructions.buy_exec.base_weight }}` and doesn't include any database reads or writes. Therefore, the total weight cost of the `BuyExecution` instruction is `{{ networks.polkadot.xcm_instructions.buy_exec.total_weight }}`.

On Polkadot, the benchmarked base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L50){target=_blank} and [generic assets](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=_blank} directly in the Polkadot Runtime code.

With the instruction weight cost established, you can calculate the cost of each instruction in DOT.

In Polkadot, the [`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=_blank} is set to `{{ networks.polkadot.extrinsic_base_weight.display }}` which is [mapped to 1/10th](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/lib.rs#L89){target=blank} of a cent. Where 1 cent is `10^10 / 100`.

Therefore, to calculate the cost of executing an XCM instruction, you can use the following formula:

```text
XCM-DOT-Cost = XCMInstrWeight * DOTWeightToFeeCoefficient
```

Where `DOTWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

```text
DOTWeightToFeeCoefficient = 10^10 / ( 10 * 100 * DOTExtrinsicBaseWeight )
```

Using the actual values:

```text
DOTWeightToFeeCoefficient = 10^10 / ( 10 * 100 * {{ networks.polkadot.extrinsic_base_weight.numbers_only }} )
```

As a result, `DOTWeightToFeeCoefficient` is equal to `{{ networks.polkadot.xcm_instructions.planck_dot_weight }} Planck-DOT`. Now, you can begin to calculate the final fee in DOT, using `DOTWeightToFeeCoefficient` as a constant and `TotalWeight` as the variable:

```text
XCM-Planck-DOT-Cost = TotalWeight * DOTWeightToFeeCoefficient
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

Therefore, the actual calculation for the `WithdrawAsset` instruction is:

```text
XCM-Planck-DOT-Cost = {{ networks.polkadot.xcm_instructions.withdraw.total_weight.numbers_only }} * {{ networks.polkadot.xcm_instructions.planck_dot_weight }} 
XCM-DOT-Cost = {{ networks.polkadot.xcm_instructions.withdraw.planck_dot_cost }} / 10^10
```

The total cost for that particular instruction is `{{ networks.polkadot.xcm_instructions.withdraw.dot_cost }} DOT`.

As an example, you can calculate the total cost of DOT for sending an XCM message that transfers xcDOT to DOT on Polkadot using the following weights and instruction costs:

|                                                                                            Instruction                                                                                             |                                 Weight                                 |                                Cost                                 |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------:|:-------------------------------------------------------------------:|
| [`WithdrawAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L55-L63){target=_blank}  | {{ networks.polkadot.xcm_instructions.withdraw.total_weight.display }} |   {{ networks.polkadot.xcm_instructions.withdraw.dot_cost }} DOT    |
|   [`ClearOrigin`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L129-L135){target=_blank}   |   {{ networks.polkadot.xcm_instructions.clear_origin.total_weight }}   | {{ networks.polkadot.xcm_instructions.clear_origin.dot_cost }} DOT  |
|   [`BuyExecution`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L70-L76){target=_blank}    |     {{ networks.polkadot.xcm_instructions.buy_exec.total_weight }}     |   {{ networks.polkadot.xcm_instructions.buy_exec.dot_cost }} DOT    |
| [`DepositAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L147-L155){target=_blank} |  {{ networks.polkadot.xcm_instructions.deposit_asset.total_weight }}   | {{ networks.polkadot.xcm_instructions.deposit_asset.dot_cost }} DOT |
|                                                                                             **TOTAL**                                                                                              |        **{{ networks.polkadot.xcm_message.transfer.weight }}**         |      **{{ networks.polkadot.xcm_message.transfer.cost }} DOT**      |

### Kusama {: #kusama }

The total weight costs on Kusama take into consideration database reads and writes in addition to the weight required for a given instruction. Database read and write operations have not been benchmarked, while instruction weights have been. The breakdown of weight costs for the database operations is as follows:

|                                                                                    Database                                                                                    |                        Read                        |                        Write                        |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------:|:---------------------------------------------------:|
| [RocksDB (default)](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/rocksdb_weights.rs){target=_blank} | {{ networks.kusama.rocks_db.read_weight.display }} | {{ networks.kusama.rocks_db.write_weight.display }} |
|     [ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/paritydb_weights.rs){target=_blank}     |    {{ networks.kusama.parity_db.read_weight }}     |    {{ networks.kusama.parity_db.write_weight }}     |

Now that you are aware of the weight costs for database reads and writes on Kusama, you can calculate the weight cost for a given instruction using the base weight for instructions.

For example, the [`WithdrawAsset` instruction](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L54-L62){target=_blank} has a base weight of `{{ networks.kusama.xcm_instructions.withdraw.base_weight.display }}`, and performs one database read and one database write. Therefore, the total weight cost of the `WithdrawAsset` instruction is calculated as:

```text
{{ networks.kusama.xcm_instructions.withdraw.base_weight.numbers_only }} + {{ networks.kusama.rocks_db.read_weight.numbers_only }} + {{ networks.kusama.rocks_db.write_weight.numbers_only }} = {{ networks.kusama.xcm_instructions.withdraw.total_weight.numbers_only }}
```

The [`BuyExecution` instruction](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L76-L82){target=_blank} has a base weight of `{{ networks.kusama.xcm_instructions.buy_exec.base_weight }}` and doesn't include any database reads or writes. Therefore, the total weight cost of the `BuyExecution` instruction is `{{ networks.kusama.xcm_instructions.buy_exec.total_weight }}`.

On Kusama, the benchmarked base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49){target=_blank} and [generic assets](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L50){target=_blank} directly in the Kusama Runtime code.

With the instruction weight cost established, you can calculate the cost of the instruction in KSM.

In Kusama, the [`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=_blank} is set to `{{ networks.kusama.extrinsic_base_weight.display }}` which is [mapped to 1/10th](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/lib.rs#L87){target=_blank} of a cent. Where 1 cent is `10^12 / 30,000`.

Therefore, to calculate the cost of executing an XCM instruction, you can use the following formula:

```text
XCM-KSM-Cost = XCMInstrWeight * KSMWeightToFeeCoefficient
```

Where `KSMWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

```text
KSMWeightToFeeCoefficient = 10^12 / ( 10 * 3000 * KSMExtrinsicBaseWeight )
```

Using the actual values:

```text
KSMWeightToFeeCoefficient = 10^12 / ( 10 * 3000 * {{ networks.kusama.extrinsic_base_weight.numbers_only }} )
```

As a result, `KSMWeightToFeeCoefficient` is equal to `{{ networks.kusama.xcm_instructions.planck_ksm_weight }} Planck-KSM`. Now, you can begin to calculate the final fee in KSM, using `KSMWeightToFeeCoefficient` as a constant and `TotalWeight` ({{ networks.kusama.xcm_instructions.withdraw.total_weight.display }}) as the variable:

```text
XCM-Planck-KSM-Cost = TotalWeight * KSMWeightToFeeCoefficient
XCM-KSM-Cost = XCM-Planck-KSM-Cost / KSMDecimalConversion
```

Therefore, the actual calculation for the `WithdrawAsset` instruction is:

```text
XCM-Planck-KSM-Cost = {{ networks.kusama.xcm_instructions.withdraw.total_weight.numbers_only }} * {{ networks.kusama.xcm_instructions.planck_ksm_weight }} 
XCM-KSM-Cost = {{ networks.kusama.xcm_instructions.withdraw.planck_ksm_cost }} / 10^12
```

The total cost for that particular instruction is `{{ networks.kusama.xcm_instructions.withdraw.ksm_cost }} KSM`.

As an example, you can calculate the total cost of KSM for sending an XCM message that transfers xcKSM to KSM on Kusama using the following weights and instruction costs:

|                                                                                          Instruction                                                                                           |                                Weight                                |                               Cost                                |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------:|:-----------------------------------------------------------------:|
| [`WithdrawAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L54-L62){target=_blank}  | {{ networks.kusama.xcm_instructions.withdraw.total_weight.display }} |   {{ networks.kusama.xcm_instructions.withdraw.ksm_cost }} KSM    |
|   [`ClearOrigin`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L135-L141){target=_blank}   |   {{ networks.kusama.xcm_instructions.clear_origin.total_weight }}   | {{ networks.kusama.xcm_instructions.clear_origin.ksm_cost }} KSM  |
|   [`BuyExecution`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L76-L82){target=_blank}    |     {{ networks.kusama.xcm_instructions.buy_exec.total_weight }}     |   {{ networks.kusama.xcm_instructions.buy_exec.ksm_cost }} KSM    |
| [`DepositAsset`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L132-L140){target=_blank} |  {{ networks.kusama.xcm_instructions.deposit_asset.total_weight }}   | {{ networks.kusama.xcm_instructions.deposit_asset.ksm_cost }} KSM |
|                                                                                           **TOTAL**                                                                                            |        **{{ networks.kusama.xcm_message.transfer.weight }}**         |      **{{ networks.kusama.xcm_message.transfer.cost }} KSM**      |

## Moonbeam-based Networks XCM Fee Calculation  {: #moonbeam-xcm-fee-calc }

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive an extrinsic is from a computational cost perspective. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, and each parachain can decide how to convert from weight to fee, for example, accounting for additional costs for transaction size and storage costs.

For all Moonbeam-based networks, the generic XCM instructions are benchmarked, while the fungible XCM instructions still use a fixed amount of weight per instruction. Consequently, the total weight cost of the benchmarked XCM instructions considers the number of database reads and writes in addition to the weight required for a given instruction. The breakdown of weight cost for database operations is as follows:

|                                                                              Database                                                                               |                   Read                    |                   Write                    |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------:|:------------------------------------------:|
| [RocksDB (default)](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/substrate/frame/support/src/weights/rocksdb_weights.rs#L27-L28){target=_blank} | {{ xcm.db_weights.rocksdb_read.display }} | {{ xcm.db_weights.rocksdb_write.display }} |

Now that you know the weight costs for database reads and writes for Moonbase Alpha, you can calculate the weight cost for both fungible and generic XCM instructions using the base weight for instruction and the extra database reads and writes if applicable.

For example, the `WithdrawAsset` instruction is part of the fungible XCM instructions. Therefore, it is not benchmarked, and the total weight cost of the [`WithdrawAsset` instruction](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L38){target=_blank} is `{{ xcm.fungible_weights.display }}`, except for when transferring local XC-20s. The total weight cost for the `WithdrawAsset` instruction for local XC-20s is based on a conversion of Ethereum gas to Substrate weight.

The [`BuyExecution` instruction](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L128-L129){target=_blank} has a base weight of `{{ xcm.generic_weights.buy_exec.base_weight.display }}`, and performs four database reads (`assetManager` pallet to get the `unitsPerSecond`). Therefore, the total weight cost of the `BuyExecution` instruction is calculated as follows:

```text
{{ xcm.generic_weights.buy_exec.base_weight.numbers_only }} + 4 * {{ xcm.db_weights.rocksdb_read.numbers_only }} = {{ xcm.generic_weights.buy_exec.total_weight.numbers_only }}
```

You can find all the weight values for all the XCM instructions in the following table, which apply to all Moonbeam-based networks:

|                                                                                    Benchmarked Instructions                                                                                     |                                                                                   Non-Benchmarked Instructions                                                                                    |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [Generic XCM Instructions](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L93){target=_blank} | [Fungible XCM Instructions](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L30){target=_blank} |

The following sections will break down how to calculate XCM fees for Moonbeam-based networks. There are two main scenarios:

 - Fees paid in the reserve token (native tokens like GLMR, MOVR, or DEV)
 - Fees paid in external assets (XC-20s)

### Fee Calculation for Reserve Assets {: #moonbeam-reserve-assets }

For each XCM instruction, the weight units are converted to balance units as part of the fee calculation. The amount of Wei per weight unit for each of the Moonbeam-based networks is as follows:

|                                                                                                  Moonbeam                                                                                                  |                                                                                                   Moonriver                                                                                                   |                                                                                               Moonbase Alpha                                                                                               |
|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbeam.spec_version}}/runtime/moonbeam/src/lib.rs#L138){target=_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonriver.spec_version}}/runtime/moonriver/src/lib.rs#L140){target=_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/runtime/moonbase/src/lib.rs#L147){target=_blank} |

This means that on Moonbeam, for example, the formula to calculate the cost of one XCM instruction in the reserve asset is as follows:

```text
XCM-Wei-Cost = XCMInstrWeight * WeiPerWeight
XCM-GLMR-Cost = XCM-Wei-Cost / 10^18
```

Therefore, the actual calculation for fungible instructions, for example, is:

```text
XCM-Wei-Cost = {{ xcm.fungible_weights.numbers_only }} * {{ networks.moonbeam.xcm.instructions.wei_per_weight.numbers_only }}
XCM-GLMR-Cost = {{ networks.moonbeam.xcm.transfer_glmr.wei_cost }} / 10^18
```

The total cost is `{{ networks.moonbeam.xcm.transfer_glmr.glmr_cost }} GLMR` for an XCM instruction on Moonbeam.

### Fee Calculation for External Assets {: #fee-calc-external-assets }

Considering the scenario of Alice sending DOT to Alith's account on Moonbeam, the fees are taken from the amount of xcDOT Alith receives. To determine how much to charge, Moonbeam uses a concept called `UnitsPerSecond`, which refers to the units of tokens that the network charges per second of XCM execution time (considering decimals). This concept is used by Moonbeam (and maybe other parachains) to determine how much to charge for XCM execution using a different asset than its reserve.

Moreover, XCM execution on Moonbeam can be paid for by multiple assets ([XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank}) that originate in the chain where the asset is coming from. For example, at the time of writing, an XCM message sent from [Kusama Asset Hub](https://polkadot.js.org/apps/?rpc=wss://kusama-asset-hub-rpc.polkadot.io#/explorer){target=_blank} (formerly Statemine) can be paid in xcKSM, xcRMRK, or xcUSDT. As long as that asset has the `UnitsPerSecond` set in Moonbeam/Moonriver, it can be used to pay XCM execution for an XCM message coming from that specific chain.

To find out the `UnitsPerSecond` for a given asset, you can use the following script, which queries the `assetManager.assetTypeUnitsPerSecond`, and make sure to pass in the multilocation of the asset in question. If you're unsure of the multilocation, you can retrieve it using the `assetManager.assetIdType` query.

```js
--8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/units-per-second.js'
```

Once you run the script, you should see `The UnitsPerSecond for xcDOT is 33,068,783,068` printed to your terminal.

Remember that one unit of weight is defined as one picosecond of execution time. Therefore, the formula to determine execution time is as follows:

```text
ExecutionTime = Weight / Picosecond
```

To determine the total weight for Alice's transfer of DOT to Moonbeam, you'll need the weight for each of the four XCM instructions required for the transfer:

|                                                                                           Instruction                                                                                           |                            Weight                             |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------:|
| [`ReserveAssetDeposited`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L71){target=_blank} |              {{ xcm.fungible_weights.display }}               |
|      [`ClearOrigin`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L191){target=_blank}      |        {{ xcm.generic_weights.clear_origin.display }}         |
|   [`BuyExecution`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/generic.rs#L128-L129){target=_blank}   |    {{ xcm.generic_weights.buy_exec.total_weight.display }}    |
|     [`DepositAsset`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-xcm-benchmarks/src/weights/fungible.rs#L60){target=_blank}      |              {{ xcm.fungible_weights.display }}               |
|                                                                                            **TOTAL**                                                                                            | {{ networks.moonbeam.xcm.transfer_dot.total_weight.display }} |

!!! note
    For the `BuyExecution` instruction, the [units of weight for the four database reads](#moonbeam-xcm-fee-calc) are accounted for in the above table.

With the total weight, you can calculate the execution time for Alice's transfer of DOT to Moonbeam using the following calculation:

```text
ExecutionTime = {{ networks.moonbeam.xcm.transfer_dot.total_weight.numbers_only }} / 10^12
```

Which means that the four XCM instructions for the transfer cost `{{ networks.moonbeam.xcm.transfer_dot.exec_time }}` seconds of block execution time.

To calculate the total cost in xcDOT, you'll also need the number of decimals the asset in question uses, which for xcDOT is 10 decimals. You can determine the number of decimals for any asset by [querying the asset metadata](/builders/interoperability/xcm/xc20/overview/#list-xchain-assets){target=_blank}.

The block execution formula can then be used to determine how much Alice's transfer of DOT to Alith's account on Moonbeam costs. The formula for finding the total cost is as follows:

```text
XCM-Cost = ( UnitsPerSecond / DecimalConversion ) * ExecutionTime
```

Then the calculation for the transfer is:

```text
XCM-Cost = ( {{ networks.moonbeam.xcm.units_per_second.xcdot.numbers_only }} / 10^10 ) * {{ networks.moonbeam.xcm.transfer_dot.exec_time }}
```

The total cost to transfer Alice's DOT to Alith's account for xcDOT is `{{ networks.moonbeam.xcm.transfer_dot.xcdot_cost }} xcDOT`.
