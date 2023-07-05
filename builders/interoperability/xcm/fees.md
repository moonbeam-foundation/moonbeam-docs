---
title: XCM Execution Fees
description: Learn about the XCM instructions involved in handling XCM execution fee payments and how to calculate fees on Polkadot, Kusama, and Moonbeam-based networks.
---

# XCM Fees on Moonbeam

## Introduction {: #introduction}

XCM aims to be a language that communicates ideas between consensus systems. Sending an XCM message consists of a series of instructions that are executed in both the origin and the destination chain. The combination of XCM instructions results in actions such as token transfers. In order to process and execute each XCM instruction, there are typically associated fees that must be paid.

However, XCM is designed to be general, extensible, and efficient so that it remains valuable and future-proof throughout a growing ecosystem. As such, the generality applies to concepts including payments of fees for XCM execution. In Ethereum, fees are baked into the transaction protocol, whereas in the Polkadot ecosystem, each chain has the flexibility to define how XCM fees are handled.

This guide will cover aspects of fee payment, such as who is responsible for paying XCM execution fees, how it is paid for, and how the fees are calculated on Moonbeam.

!!! note
    **The following information is provided for general information purposes only.** The weight and extrinsic base cost might have changed since the time of writing. Please ensure you check the actual values, and never use the following information for production apps.

## Payment of Fees {: #payment-of-fees }

Generally speaking, the fee payment process can be described as follows:

1. Some assets need to be provided
2. The exchange of assets for computing time (or weight) must be negotiated
3. The XCM operations will be performed as instructed, with the provided weight limit or funds available for execution

Each chain can configure what happens with the XCM fees and in which tokens they can be paid (either the native reserve token or an external one). For example, on Polkadot and Kusama, the fees are paid in DOT or KSM (respectively) and given to the validator of the block. On Moonbeam and Moonriver, the XCM execution fees can be paid in the reserve asset (GLMR or MOVR, respectively), but also in assets originated in other chains, and fees are sent to the treasury.

Consider the following scenario: Alice has some DOT on Polkadot, and she wants to transfer it to Alith on Moonbeam. She sends an XCM message with a set of XCM instructions that will retrieve a given amount of DOT from her account on Polkadot and mint them as xcDOT into Alith's account. Part of the instructions are executed on Polkadot, and the other part are executed on Moonbeam. 

How does Alice pay Moonbeam to execute these instructions and fulfill her request? Her request is fulfilled through a series of XCM instructions that are included in the XCM message, which enables her to buy execution time minus any related XCM execution fees. The execution time is used to issue and transfer xcDOT, a representation of DOT on Moonbeam. This means that when Alice sends some DOT to Alith's account on Moonbeam, she'll receive a 1:1 representation of her DOT as xcDOT minus any XCM execution fees. Note that in this scenario, XCM execution fees are paid in xcDOT.

The exact process for Alice's transfer is as follows:

1. Assets are sent to an account on Polkadot that is owned by Moonbeam, known as the sovereign account. After the assets are received, an XCM message is sent to Moonbeam
2. The XCM message in Moonbeam will:
    1. Mint the corresponding asset representation
    2. Buy the corresponding execution time
    3. Use that execution time to deposit the representation (minus fees) to the destination account

### XCM Instructions {: #xcm-instructions }

An XCM message is comprised of a series of XCM instructions. As a result, different combinations of XCM instructions result in different actions. For example, to move DOT to Moonbeam, the following XCM instructions are used:

1. [`TransferReserveAsset`](https://github.com/paritytech/xcm-format#transferreserveasset){target=_blank} - gets executed in Polkadot. Moves assets from the origin account and deposits them into a destination account. In this case, the destination account is Moonbeam's sovereign account on Polkadot. It then sends an XCM message to the destination, which is Moonbeam, with the XCM instructions that are to be executed
2. [`ReserveAssetDeposited`](https://github.com/paritytech/xcm-format#reserveassetdeposited){target=_blank} - gets executed in Moonbeam. Takes a representation of the assets received in the sovereign account and places them into the holding register, a temporary position in the Cross-Consensus Virtual Machine (XCVM)
3. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - gets executed in Moonbeam. Ensures that later XCM instructions cannot command the authority of the XCM author
4. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - gets executed in Moonbeam. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain, which in this case is Moonbeam
5. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - gets executed in Moonbeam. Removes the assets from holding and sends them to a destination account on Moonbeam

To check how the instructions for an XCM message are built to transfer self-reserve assets to a target chain, such as DOT to Moonbeam, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.client_version}}/xtokens){target=_blank} repository (as an example). You'll want to take a look at the [`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.client_version}}/xtokens/src/lib.rs#L666){target=_blank} function. You'll notice it calls `TransferReserveAsset` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot/blob/{{networks.polkadot.client_version}}/xcm/xcm-executor/src/lib.rs#L306){target=_blank}. The XCM message is constructed by combining the `ReserveAssetDeposited` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

To move xcDOT from Moonbeam back to Polkadot, the instructions that are used are:

1. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - gets executed in Moonbeam. Removes assets and places them into the holding register
2. [`InitiateReserveWithdraw`](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=_blank} - gets executed in Moonbeam. Removes the assets from holding (essentially burning them) and sends an XCM message to the destination chain starting with the `WithdrawAsset` instruction
3. [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - gets executed in Polkadot. Removes assets and places them into the holding register
4. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - gets executed in Polkadot. Ensures that later XCM instructions cannot command the authority of the XCM author
5. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - gets executed in Polkadot. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain, which in this case is Polkadot
6. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - gets executed in Polkadot. Removes the assets from holding and sends them to a destination account on Polkadot

To check how the instructions for an XCM message are built to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.client_version}}/xtokens){target=_blank} repository. You'll want to take a look at the [`transfer_to_reserve`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.client_version}}/xtokens/src/lib.rs#L683){target=_blank} function. You'll notice that it calls `WithdrawAsset`, then `InitiateReserveWithdraw` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot/blob/{{networks.polkadot.client_version}}/xcm/xcm-executor/src/lib.rs#L412){target=_blank}. The XCM message is constructed by combining the `WithdrawAsset` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

## Relay Chain XCM Fee Calculation  {: #rel-chain-xcm-fee-calc }

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive from a computational cost perspective an extrinsic is. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, in addition to factors such as network congestion. 

The following sections will break down how to calculate XCM fees for Polkadot and Kusama. It's important to note that Kusama, in particular, uses benchmarked data to determine the total weight costs for XCM instructions and that some XCM instructions might include database reads/writes, which add weight to the call.

There are two databases available in Polkadot and Kusama, RocksDB (which is the default) and ParityDB, both of which have their own associated weight costs for each network. 

### Polkadot {: #polkadot }

As previously mentioned, Polkadot currently uses a [fixed amount of weight](https://github.com/paritytech/polkadot/blob/{{networks.polkadot.client_version}}/runtime/polkadot/src/xcm_config.rs#L94){target=_blank} for all XCM instructions, which is `{{ networks.polkadot.xcm_instructions.weight.display }}` weight units per instruction.

Although Polkadot doesn't currently use database weight units to calculate costs, the weight units for database operations, which have been benchmarked, are shared here for reference.

|                                                                                    Database                                                                                    |                     Read                      |                     Write                      |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------:|:----------------------------------------------:|
| [RocksDB (default)](https://github.com/paritytech/polkadot/blob/{{networks.polkadot.client_version}}/runtime/polkadot/constants/src/weights/rocksdb_weights.rs){target=_blank} | {{ networks.polkadot.rocks_db.read_weight }}  | {{ networks.polkadot.rocks_db.write_weight }}  |
|     [ParityDB](https://github.com/paritytech/polkadot/blob/{{networks.polkadot.client_version}}/runtime/polkadot/constants/src/weights/paritydb_weights.rs){target=_blank}     | {{ networks.polkadot.parity_db.read_weight }} | {{ networks.polkadot.parity_db.write_weight }} |

With the instruction weight cost established, you can calculate the cost of each instruction in DOT. 

In Polkadot, the [`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/{{networks.polkadot.client_version}}/runtime/polkadot/constants/src/weights/extrinsic_weights.rs#L55){target=_blank} is set to `{{ networks.polkadot.extrinsic_base_weight.display }}` which is [mapped to 1/10th](https://github.com/paritytech/polkadot/blob/{{networks.polkadot.client_version}}/runtime/polkadot/constants/src/lib.rs#L88){targer=blank} of a cent. Where 1 cent is `10^10 / 100`. 

Therefore, to calculate the cost of executing an XCM instruction, you can use the following formula:

```
XCM-DOT-Cost = XCMInstrWeight * DOTWeightToFeeCoefficient
```

Where `DOTWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

```
DOTWeightToFeeCoefficient = ( 10^10 / ( 10 * 100 )) * ( 1 / DOTExtrinsicBaseWeight )
```

Using the actual values:

```
DOTWeightToFeeCoefficient = ( 10^10 / ( 10 * 100 * {{ networks.polkadot.extrinsic_base_weight.numbers_only }} )
```

As a result, `DOTWeightToFeeCoefficient` is equal to `{{ networks.polkadot.xcm_instructions.planck_dot_weight }} Planck-DOT`. Now, you can begin to calculate the final fee in DOT, using `DOTWeightToFeeCoefficient` as a constant and `TotalWeight` as the variable:

```
XCM-Planck-DOT-Cost = TotalWeight * DOTWeightToFeeCoefficient
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

Therefore, the actual calculation for one XCM instruction is:

```
XCM-Planck-DOT-Cost = {{ networks.polkadot.xcm_instructions.weight.numbers_only }} * {{ networks.polkadot.xcm_instructions.planck_dot_weight }} 
XCM-DOT-Cost = {{ networks.polkadot.xcm_instructions.planck_dot_cost }} / 10^10
```

The total cost is `{{ networks.polkadot.xcm_instructions.dot_cost }} DOT` per instruction.

As an example, you can calculate the total cost of DOT for sending an XCM message that transfers xcDOT to DOT on Polkadot using the following weights and instruction costs:

|  Instruction  |                         Weight                          |                           Cost                            |
|:-------------:|:-------------------------------------------------------:|:---------------------------------------------------------:|
| WithdrawAsset | {{ networks.polkadot.xcm_instructions.weight.display }} |   {{ networks.polkadot.xcm_instructions.dot_cost }} DOT   |
|  ClearOrigin  | {{ networks.polkadot.xcm_instructions.weight.display }} |   {{ networks.polkadot.xcm_instructions.dot_cost }} DOT   |
| BuyExecution  | {{ networks.polkadot.xcm_instructions.weight.display }} |   {{ networks.polkadot.xcm_instructions.dot_cost }} DOT   |
| DepositAsset  | {{ networks.polkadot.xcm_instructions.weight.display }} |   {{ networks.polkadot.xcm_instructions.dot_cost }} DOT   |
|   **TOTAL**   | **{{ networks.polkadot.xcm_message.transfer.weight }}** | **{{ networks.polkadot.xcm_message.transfer.cost }} DOT** |

### Kusama {: #kusama }

The total weight costs on Kusama take into consideration database reads and writes in addition to the weight required for a given instruction. Database read and write operations have not been benchmarked, while instruction weights have been. The breakdown of weight costs for the database operations is as follows:

|                                                                                  Database                                                                                  |                    Read                     |                    Write                     |
|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------:|:--------------------------------------------:|
| [RocksDB (default)](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/constants/src/weights/rocksdb_weights.rs){target=_blank} | {{ networks.kusama.rocks_db.read_weight }}  | {{ networks.kusama.rocks_db.write_weight }}  |
|     [ParityDB](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/constants/src/weights/paritydb_weights.rs){target=_blank}     | {{ networks.kusama.parity_db.read_weight }} | {{ networks.kusama.parity_db.write_weight }} |

Now that you are aware of the weight costs for database reads and writes on Kusama, you can calculate the weight cost for a given instruction using the base weight for an instruction. 

For example, the [`WithdrawAsset` instruction](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49-L53){target=_blank} has a base weight of `{{ networks.kusama.xcm_instructions.withdraw.base_weight }}`, and performs one database read, and one database write. Therefore, the total weight cost of the `WithdrawAsset` instruction is calculated as:

```
{{ networks.kusama.xcm_instructions.withdraw.base_weight }} + {{ networks.kusama.rocks_db.read_weight}} + {{ networks.kusama.rocks_db.write_weight}} = {{ networks.kusama.xcm_instructions.withdraw.total_weight.display }}
```

The [`BuyExecution` instruction](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L59-L61){target=_blank} has a base weight of `{{ networks.kusama.xcm_instructions.buy_exec.base_weight }}` and doesn't include any database reads or writes. Therefore, the total weight cost of the `BuyExecution` instruction is `{{ networks.kusama.xcm_instructions.buy_exec.total_weight }}`.

On Kusama, the benchmarked base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L45){target=_blank} and [generic assets](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=_blank} directly in the Kusama Runtime code.

With the instruction weight cost established, you can calculate the cost of the instruction in KSM. 

In Kusama, the [`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/constants/src/weights/extrinsic_weights.rs#L55){target=_blank} is set to `{{ networks.kusama.extrinsic_base_weight.display }}` which is [mapped to 1/10th](https://github.com/paritytech/polkadot/blob/{{networks.kusama.client_version}}/runtime/kusama/constants/src/lib.rs#L87){target=_blank} of a cent. Where 1 cent is `10^12 / 30,000`.

Therefore, to calculate the cost of executing an XCM instruction, you can use the following formula:

```
XCM-KSM-Cost = XCMInstrWeight * KSMWeightToFeeCoefficient
```

Where `KSMWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

```
KSMWeightToFeeCoefficient = ( 10^12 / ( 10 * 3000 )) * ( 1 / KSMExtrinsicBaseWeight )
```

Using the actual values:

```
KSMWeightToFeeCoefficient = ( 10^12 / ( 10 * 3000 * {{ networks.kusama.extrinsic_base_weight.numbers_only }} )
```

As a result, `KSMWeightToFeeCoefficient` is equal to `{{ networks.kusama.xcm_instructions.planck_ksm_weight }} Planck-KSM`. Now, you can begin to calculate the final fee in KSM, using `KSMWeightToFeeCoefficient` as a constant and `TotalWeight` ({{ networks.kusama.xcm_instructions.withdraw.total_weight.display }}) as the variable:

```
XCM-Planck-KSM-Cost = TotalWeight * KSMWeightToFeeCoefficient
XCM-KSM-Cost = XCM-Planck-KSM-Cost / KSMDecimalConversion
```

Therefore, the actual calculation for the `WithdrawAsset` instruction is:

```
XCM-Planck-KSM-Cost = {{ networks.kusama.xcm_instructions.withdraw.total_weight.numbers_only }} * {{ networks.kusama.xcm_instructions.planck_ksm_weight }} 
XCM-KSM-Cost = {{ networks.kusama.xcm_instructions.withdraw.planck_ksm_cost }} / 10^12
```

The total cost for that particular instruction is `{{ networks.kusama.xcm_instructions.withdraw.ksm_cost }} KSM`.

As an example, you can calculate the total cost of KSM for sending an XCM message that transfers xcKSM to KSM on Kusama using the following weights and instruction costs:

|  Instruction  |                                Weight                                |                               Cost                                |
|:-------------:|:--------------------------------------------------------------------:|:-----------------------------------------------------------------:|
| WithdrawAsset | {{ networks.kusama.xcm_instructions.withdraw.total_weight.display }} |   {{ networks.kusama.xcm_instructions.withdraw.ksm_cost }} KSM    |
|  ClearOrigin  |   {{ networks.kusama.xcm_instructions.clear_origin.total_weight }}   | {{ networks.kusama.xcm_instructions.clear_origin.ksm_cost }} KSM  |
| BuyExecution  |     {{ networks.kusama.xcm_instructions.buy_exec.total_weight }}     |   {{ networks.kusama.xcm_instructions.buy_exec.ksm_cost }} KSM    |
| DepositAsset  |  {{ networks.kusama.xcm_instructions.deposit_asset.total_weight }}   | {{ networks.kusama.xcm_instructions.deposit_asset.ksm_cost }} KSM |
|   **TOTAL**   |        **{{ networks.kusama.xcm_message.transfer.weight }}**         |      **{{ networks.kusama.xcm_message.transfer.cost }} KSM**      |


## Moonbeam-based Networks XCM Fee Calculation  {: #moonbeam-xcm-fee-calc }

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive an extrinsic is from a computational cost perspective. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, and each parachain can decide how to convert from weight to fee, for example, accounting for additional costs for transaction size, and storage costs.

Both Moonbeam and Moonriver use a fixed amount of weight for each XCM instruction. However, Moonbase Alpha (TestNet) has the generic XCM instructions benchmarked, while the fungible XCM instructions still use a fixed amount of weight per instruction. Consequently, the total weight cost of the benchmarked XCM instructions considers the number of database reads/writes in addition to the weight required for a given instruction. The breakdown of weight cost for the database operations is as follows:

|                                                                   Database                                                                   |                      Read                       |                      Write                       |
|:--------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------:|:------------------------------------------------:|
| [RocksDB (default)](https://github.com/paritytech/substrate/blob/master/frame/support/src/weights/rocksdb_weights.rs#L27-L28){target=_blank} | {{ networks.moonbase.db_weights.rocksdb_read }} | {{ networks.moonbase.db_weights.rocksdb_write }} |

Now that you know the weight costs for database reads and writes for Moonbase Alpha, you can calculate the weight cost for both fungible and generic XCM instruction using the base weight for instruction and the extra database read/writes if applicable.

For example, the `WithdrawAsset` instruction is part of the fungible XCM instructions set. Therefore, it is not benchmarked, and the total weight cost of the `WithdrawAsset` instruction is `{{ networks.moonbase.xcm.instructions.weight_units.display }}`.

The [`BuyExecution` instruction](https://github.com/PureStake/moonbeam/blob/{{networks.moonbase.parachain_release_tag}}/pallets/moonbeam-xcm-benchmarks/src/weights/moonbeam_xcm_benchmarks_generic.rs#L136){target=_blank} has a base weight of `{{ networks.moonbase.xcm.instructions.buy_exec.base_weight }}`, and performs four database reads (`assetManager` pallet to get the `unitsPerSecond`). Therefore, the total weight cost of the `BuyExecution` instruction is calculated as follows:

```
{{ networks.moonbase.xcm.instructions.buy_exec.base_weight }} + 4 * {{ networks.moonbase.db_weights.rocksdb_read }} = {{ networks.moonbase.xcm.instructions.buy_exec.total_weight }}
```

You can find all the weight values for all the XCM instructions in the following table:

=== "Moonbeam"
    |                                                                                              XCM Instruction Cost                                                                                              |
    |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonbeam.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/{{networks.moonbeam.parachain_release_tag}}/runtime/moonbeam/src/xcm_config.rs#L201){target=_blank} |
    
=== "Moonriver"
    |                                                                                               XCM Instruction Cost                                                                                               |
    |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonriver.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/{{networks.moonriver.parachain_release_tag}}/runtime/moonriver/src/xcm_config.rs#L211){target=_blank} |
    
=== "Moonbase Alpha"
    |                                                                                               Benchmarked Instructions                                                                                                |                                                                                              Non-Benchmarked Instructions                                                                                              |
    |:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [Generic XCM Instructions](https://github.com/PureStake/moonbeam/blob/{{networks.moonbase.parachain_release_tag}}/pallets/moonbeam-xcm-benchmarks/src/weights/moonbeam_xcm_benchmarks_generic.rs#L128){target=_blank} | [Fungible XCM Instructions](https://github.com/PureStake/moonbeam/blob/{{networks.moonbase.parachain_release_tag}}/pallets/moonbeam-xcm-benchmarks/src/weights/moonbeam_xcm_benchmarks_fungible.rs#L25){target=_blank} |

The following sections will break down how to calculate XCM fees for Moonbeam-based networks. There are two main scenarios:

 - Fees paid in the reserve token (native tokens like GLMR, MOVR, or DEV)
 - Fees paid in external assets (XC-20s)

### Fee Calculation for Reserve Assets {: #moonbeam-reserve-assets }

For each XCM instruction, the weight units are converted to balance units as part of the fee calculation. The amount of Wei per weight unit for each of the Moonbeam-based networks is as follows:

|                                                                                                 Moonbeam                                                                                                  |                                                                                                 Moonriver                                                                                                  |                                                                                              Moonbase Alpha                                                                                               |
|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/{{networks.moonbeam.parachain_release_tag}}/runtime/moonbeam/src/lib.rs#L129){target=_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/{{networks.moonriver.parachain_release_tag}}/runtime/moonbeam/src/lib.rs#L129){target=_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/{{networks.moonbase.parachain_release_tag}}/runtime/moonbase/src/lib.rs#L138){target=_blank} |

This means that on Moonbeam, for example, the formula to calculate the cost of one XCM instruction in the reserve asset is as follows:

```
XCM-Wei-Cost = XCMInstrWeight * Wei_Per_Weight
XCM-GLMR-Cost = Wei / (10^18)
```

Therefore, the actual calculation is:

```
XCM-Wei-Cost = {{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} * {{ networks.moonbeam.xcm.instructions.wei_per_weight.numbers_only }}
XCM-GLMR-Cost = {{ networks.moonbeam.xcm.instructions.wei_cost }} / (10^18)
```

The total cost is `{{ networks.moonbeam.xcm.instructions.glmr_cost }} GLMR` for an XCM instruction on Moonbeam.

### Fee Calculation for External Assets {: #fee-calc-external-assets }

Considering the scenario with Alice sending DOT to Alith's account on Moonbeam, the fees are taken from the amount of xcDOT Alith receives. To determine how much to charge, Moonbeam uses a concept called `UnitsPerSecond`, which refers to the units of tokens that the network charges per second of XCM execution time (considering decimals). This concept is used by Moonbeam (and maybe other parachains) to determine how much to charge for XCM execution using a different asset than its reserve.

Moreover, XCM execution on Moonbeam can be paid by multiple assets ([XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank}) that originate in the chain where the asset is coming from. For example, at the time of writing, an XCM message sent from [Statemine](https://polkadot.js.org/apps/?rpc=wss://statemine-rpc.polkadot.io#/explorer){target=_blank} can be paid in xcKSM, xcRMRK or xcUSDT. As long as that asset has an `UnitsPerSecond` set in Moonbeam/Moonriver, it can be used to pay XCM execution for an XCM message coming from that specific chain.

To find out the `UnitsPerSecond` for a given asset, you can query `assetManager.assetTypeUnitsPerSecond` and pass in the multilocation of the asset in question.

If you're unsure of the multilocation, you can retrieve it using the `assetManager.assetIdType` query.

For example, you can navigate to the [Polkadot.js Apps page for Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank} and under the **Developer** dropdown, choose **Chain State**. From there, you can take the following steps:

1. For the **selected state query** dropdown, choose **assetManager**
2. Select the **assetIdType** extrinsic
3. Under **Option** enter in the asset ID or toggle the **include option** off to return information for all of the assets. This example will get information for xcUNIT which has an asset ID of `42259045809535163221576417993425387648`
4. Click the **+** button to submit the query

![Get the xcUNIT asset multilocation](/images/builders/interoperability/xcm/fees/fees-1.png)

You can take the result of the query and then use it to query the **assetTypeUnitsPerSecond** extrinsic:

1. Make sure **assetManager** is selected
2. Select the **assetTypeUnitsPerSecond** extrinsic
3. For **MoonbeamRuntimeXcmConfigAssetType**, choose **Xcm**
4. Enter `1` for **parents**
5. Select `Here` for **interior**
6. Click the **+** button to submit the query

The `UnitsPerSecond` for xcDOT is `{{ networks.moonbeam.xcm.units_per_second.xcdot.transfer }}`.

![Get the xcUNIT units per second value](/images/builders/interoperability/xcm/fees/fees-2.png)

Remember that one unit of weight is defined as one picosecond of execution time. Therefore, the formula to determine execution time is as follows:

```
ExecutionTime = (Weight / Picosecond) * NumberOfInstructions
```

To determine the execution time for Alice's transfer of DOT to Moonbeam, which contains four XCM instructions, you can use the following calculation:

```
ExecutionTime = ({{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} / 10^12) * 4
```

Which means that four XCM instructions cost `{{ networks.moonbeam.xcm.message.transfer.exec_time }}` seconds of block execution time.

To calculate the total cost in xcDOT, you'll also need the number of decimals the asset in question uses, which for xcDOT is 10 decimals. You can determine the number of decimals for any asset by [querying the asset metadata](/builders/interoperability/xcm/xc20/overview/#list-xchain-assets){target=_blank}.

The block execution formula can then be used to determine how much Alice's transfer of DOT to Alith's account on Moonbeam costs. The formula for finding the total cost is as follows:

```
XCM-Cost = (UnitsPerSecond / DecimalConversion) * ExecutionTime
```

Then the calculation for the transfer is:

```
XCM-Cost = ({{ networks.moonbeam.xcm.units_per_second.xcdot.transfer_numbers_only }} / 10^10) * {{ networks.moonbeam.xcm.message.transfer.exec_time }}
```

The total cost to transfer Alice's DOT to Alith's account for xcDOT is `{{ networks.moonbeam.xcm.message.transfer.xcdot_cost }} xcDOT`.

## XCM Transactor Fees {: #xcm-transactor-fees }

The [XCM Transactor Pallet](/builders/interoperability/xcm/xcm-transactor/){target=_blank} builds an XCM message to remotely transact in other chains of the ecosystem. 

There are two different ways developers can remotely transact through the pallet:

1. [`transactThroughDerivative`](/builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative){target=_blank}
2. [`transactThroughSigned`](/builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-signed){target=_blank}, in which the dispatcher account in the destination chain is a multilocation-derived account and must have enough funds to cover XCM execution fees plus whatever call is being remotely executed

Generally speaking, the XCM instructions normally involved for remote execution are:

 - The first instruction handles tokens in the origin chain. This can be either moving tokens to a sovereign account or burning the corresponding [XC-20](/builders/interoperability/xcm/xc20/overview/){target=_blank} so that it can be used in the target chain. These instructions get executed in the origin chain
 - [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} (optional) - mutates the origin with the multilocation provided in the instruction. This is only used for the `transactThroughSigned` and `transactThroughSignedMultilocation` extrinsics, as the origin is no longer the sovereign account, but the [multilocation-derivative account](/builders/interoperability/xcm/xcm-transactor/#general-xcm-definitions){target=_blank}
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - gets executed in the target chain. Removes assets and places them into the holding register
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - gets executed in the target chain. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} - gets executed in the target chain. Dispatches the encoded call data from a given origin

Therefore, XCM execution in the target chain consists of three to four XCM instructions, depending on the extrinsic being used. This section covers how XCM fees are estimated for each of the scenarios described above, as it is handled very differently.

### Transact Through Derivative Fees {: #transact-through-derivative-fees }

The transacting through derivative method consists of three XCM instructions: [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}, [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} and [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}.

When [transacting through the sovereign-derivative account](/builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative){target=_blank}, the transaction fees are paid by the sovereign account of the origin chain in the destination chain, but the derivative account dispatches the transaction. Consequently, the XCM Transactor Pallet will burn a certain amount of the corresponding XC-20 token to free up some balance in the sovereign account for XCM execution fee payment.

Consider the following scenario: Alice wants to remotely transact in Polkadot from Moonbeam using the transact through sovereign extrinsic (she already has an index registered to her account). To estimate how many XC-20 tokens will be burned from Alice's account, you need to check the transact information specific to the relay chain. To do so, head to the chain state page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank} and set the following options:

1. Choose the **xcmTransactor** pallet
2. Choose the **transactInfoWithWeightLimit** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `Here` for **interior**
5. Click on **+**

![Get the Transact Through Derivative Weight Info for Polkadot](/images/builders/interoperability/xcm/fees/fees-3.png)

From the response, you can see that the `transactExtraWeight` is `{{ networks.polkadot.xcm_message.transact.weight }}`. This is the weight needed to execute the three XCM instructions for this remote call in that specific destination chain. Next, you need to find the `UnitsPerSecond` for that particular chain. In the same [Polkadot.js Apps page](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank}, set the following options:

1. Choose the **xcmTransactor** pallet
2. Choose the **destinationAssetFeePerSecond** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `Here` for **interior**
5. Click on **+**

![Get the Units Per Second for Transact Through Derivative for Polkadot](/images/builders/interoperability/xcm/fees/fees-4.png)

Note that this `UnitsPerSecond` is related to the cost estimated in the [Relay Chain XCM Fee Calculation](#polkadot) section, or to the [Wei per weight](#moonbeam-reserve-assets) if the target is another parachain. As before, calculating the associated XCM execution fee is as simple as multiplying the `transactExtraWeight` times the `UnitsPerSecond`:

```
XCM-Planck-DOT-Cost = transactExtraWeight * UnitsPerSecond / WeightToSeconds
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

Therefore, the actual calculation for one XCM Transactor transact through derivative call is:

```
XCM-Planck-DOT-Cost = {{ networks.polkadot.xcm_message.transact.numbers_only }} * {{ networks.moonbeam.xcm.units_per_second.xcdot.transact_numbers_only }} / 10^12
XCM-DOT-Cost = {{ networks.polkadot.xcm_message.transact.planck_dot_cost }} / 10^10
```

The cost for transacting through derivative is `{{ networks.polkadot.xcm_message.transact.dot_cost }} DOT`. **Note that this does not include the cost of the call being remotely executed, only XCM execution fees.** Consequently, the amount of XC-20 tokens that are burned, consider also the destination weight provided as input in the function call, which can be added to the `transactExtraWeight` in the calculations.

### Transact Through Signed Fees {: #transact-through-signed-fees }

The transacting through signed method (multilocation derivative account) consists of four XCM instructions: [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}, [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}, [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} and [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}.

When [transacting through the multilocation-derivative account](/builders/interoperability/xcm/xcm-transactor/#xcmtransactor-transact-through-derivative){target=_blank}, the transaction fees are paid by the same account from which the call is dispatched, which is a multilocation-derived account in the destination chain. Consequently, multilocation-derived account must hold the necessary funds to pay for the entire execution. Note that the destination token, in which fees are paid, does not need to be register as an XC-20 in the origin chain.

Consider the following scenario: Alice wants to remotely transact in another chain (Parachain ID 888, in the Moonbase Alpha relay chain ecosystem) from Moonbase Alpha using the transact through signed extrinsic. To estimate the amount of tokens Alice's multilocation-derivative account will need to have to execute the remote call, you need to check the transact information specific to the destination chain. To do so, head to the chain state page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank} and set the following options:


1. Choose the **xcmTransactor** pallet
2. Choose the **transactInfoWithWeightLimit** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `X1` for **interior**
5. Select `Parachain` in the  **X1** field
6. Set **Parachain** to `888`
7. Click on **+**

![Get the Transact Through Derivative Weight Info for another Parachain](/images/builders/interoperability/xcm/fees/fees-5.png)

From the response, you can see that the `transactExtraWeightSigned` is `{{ networks.moonbase_beta.xcm_message.transact.weight }}`. This is the weight needed to execute the four XCM instructions for this remote call in that specific destination chain. Next, you need to find how much the destination chain charges per weight of XCM execution. Normally, you would look into the `UnitsPerSecond` for that particular chain. But in this scenario, no XC-20 tokens are burned. Therefore, `UnitsPerSecond` can be use for reference, but do not ensure that the amount of tokens estimated are correct. To get the `UnitsPerSecond` as a reference value, in the same [Polkadot.js Apps page](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank}, set the following options:

1. Choose the **xcmTransactor** pallet
2. Choose the **destinationAssetFeePerSecond** method
3. Set the multilocation for the destination chain from which you want to query the transact information. For this example, you can set **parents** to `1`
4. Select `X2` for **interior**
5. Select `Parachain` in the  **X1** field
6. Set **Parachain** to `888`
7. Select `PalletInstance` in the  **X2** field
8. Set **PalletInstance** to `3`
9. Click on **+**

![Get the Units Per Second for Transact Through Derivative for another Parachain](/images/builders/interoperability/xcm/fees/fees-6.png)

Note that this `UnitsPerSecond` is related to the cost estimated in the [Relay Chain XCM Fee Calculation](/builders/interoperability/xcm/fees/#polkadot){target=_blank} section, or to the one shown in the [Units per weight](/builders/interoperability/xcm/fees/#moonbeam-reserve-assets){target=_blank} section if the target is another parachain. You'll need to find the correct value to ensure that the amount of tokens the multilocation-derivative account holds is correct. As before, calculating the associated XCM execution fee is as simple as multiplying the `transactExtraWeight` times the `UnitsPerSecond` (for an estimation):

```
XCM-Wei-Token-Cost = transactExtraWeight * UnitsPerSecond / WeightToSeconds
XCM-Token-Cost = XCM-Wei-Token-Cost / TokensDecimalConversion
```

Therefore, the actual calculation for one XCM Transactor transact through derivative call is:

```
XCM-Wei-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.numbers_only }} * {{ networks.moonbase.xcm.units_per_second.xcbetadev.transact_numbers_only }}
XCM-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.wei_betadev_cost }} / 10^18
```

The cost for transacting through signed is `{{ networks.moonbase_beta.xcm_message.transact.betadev_cost }} TOKEN`. **Note that this does not include the cost of the call being remotely executed, only XCM execution fees.**