---
title: XCM Execution Fees
description: Learn about the XCM instructions involved in handling XCM execution fee payments and how to calculate fees on Polkadot, Kusama, and Moonbeam-based networks.
---

# XCM Fees on Moonbeam

![XCM Fees Banner](/images/builders/xcm/fees/fees-banner.png)

## Introduction {: #introduction}

XCM aims to be a language that communicates ideas between consensus systems. Sending an XCM message consists of a series of instructions that are executed in both the origin and the destination chain. The combination of XCM instructions result in actions such as token transfers. In order to process and execute each XCM instruction, there are typically associated fees that must be paid.

However, XCM is designed to be general, extensible, and efficient so that it remains useful and future-proof throughout a growing ecosystem. As such, the generality applies to concepts including payments of fees for XCM execution. In Ethereum, fees are baked into the transaction protocol, whereas in the Polkadot ecosystem, each chain has the flexibility to define how XCM fees are handled.

This guide will cover aspects of fee payment such as who is responsible to pay XCM execution fees, how it is paid for, and how the fees are calculated on Moonbeam.

## Payment of Fees {: #payment-of-fees }

Generally speaking, the fee payment process can be described as follows:

1. Some assets need to be provided
2. The exchange of assets for compute time (or weight) must be negotiated
3. The XCM operations will be performed as instructed, with the provided weight limit or funds available for execution

Each chain can configure what happens with the XCM fees. For example, on Polkadot and Kusama the fees are given to the validator of the block. On Moonbeam and Moonriver, the fees are sent to the treasury.

Consider the following scenario: Alice has some DOT on Polkadot and she wants to transfer it to Alith on Moonbeam. She sends an XCM message with a set of XCM instructions that will retrieve a given amount of DOT from her account on Polkadot and mint them as xcDOT into Alith's account. Part of the instructions are executed on Polkadot and the other part are executed on Moonbeam. 

How does Alice pay Moonbeam to execute these instructions and fulfill her request? Her request is fulfilled through a series of XCM instructions that are included in the XCM message, which enables her to buy execution time minus any related XCM execution fees. The execution time is used to issue and transfer xcDOT, a representation of DOT on Moonbeam. This means that when Alice sends some DOT to Alith's account on Moonbeam, she'll receive a 1:1 representation of her DOT as xcDOT minus any XCM execution fees.

The exact process for Alice's transfer is as follows:

1. Assets are sent to an account on Polkadot that is owned by Moonbeam, known as the sovereign account. After the assets are received, an XCM message is sent to Moonbeam
2. The XCM message in Moonbeam will:
    1. Mint the corresponding asset representation
    2. Buy the corresponding execution time
    3. Use that execution time to deposit the representation (minus fees) to the destination account

### XCM Instructions {: #xcm-instructions }

An XCM message is comprised of a series of XCM instructions. As a result, different combinations of XCM instructions result in different actions. For example, to move DOT to Moonbeam, the following XCM instructions are used:

1. [TransferReserveAsset](https://github.com/paritytech/xcm-format#transferreserveasset){target=_blank} - gets executed in Polkadot. Moves assets from the origin account and deposits them into a destination account. In this case, the destination account is Moonbeam's sovereign account on Polkadot. It then sends an XCM message to the destination, which is Moonbeam, with the XCM instructions that are to be executed
2. [`ReserveAssetDeposited`](https://github.com/paritytech/xcm-format#reserveassetdeposited){target=_blank} - gets executed in Moonbeam. Takes a representation of the assets received in the sovereign account and places them into the holding register, a temporary position in the Cross-Consensus Virtual Machine (XCVM)
3. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - gets executed in Moonbeam. Ensures that later XCM instructions cannot command the authority of the XCM author
4. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - gets executed in Moonbeam. Takes the assets from holding to pay for execution fees. The amount of fees to pay are determined by the target chain, which in this case is Moonbeam
5. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - gets executed in Moonbeam. Removes the assets from holding and sends them to a destination account on Moonbeam

To check how the instructions for an XCM message are built to transfer self reserve assets to a target chain, such as DOT to Moonbeam, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} repository (as an example). You'll want to take a look at the [`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/8c625a5ab43c1c56cdeed5f8d814a891566d4cf8/xtokens/src/lib.rs#L660){target=_blank} function. You'll notice that it calls `TransferReserveAsset` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L304){target=_blank}. The XCM message is constructed by combining the `ReserveAssetDeposited` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

To move xcDOT from Moonbeam back to Polkadot, the instructions that are used are:

1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - gets executed in Moonbeam. Removes assets and places them into the holding register
2. [InitiateReserveWithdraw](https://github.com/paritytech/xcm-format#initiatereservewithdraw){target=_blank} - gets executed in Moonbeam. Removes the assets from holding and sends an XCM message to the destination chain starting with the `WithdrawAsset` instruction
3. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} - gets executed in Polkadot. Removes assets and places them into the holding register
4. [`ClearOrigin`](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} - gets executed in Polkadot. Ensures that later XCM instructions cannot command the authority of the XCM author
5. [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} - gets executed in Polkadot. Takes the assets from holding to pay for execution fees. The amount of fees to pay are determined by the target chain, which in this case is Polkadot
6. [`DepositAsset`](https://github.com/paritytech/xcm-format#depositasset){target=_blank} - gets executed in Polkadot. Removes the assets from holding and sends them to a destination account on Polkadot

To check how the instructions for an XCM message are built to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} repository. You'll want to take a look at the [`transfer_to_reserve`](https://github.com/open-web3-stack/open-runtime-module-library/blob/8c625a5ab43c1c56cdeed5f8d814a891566d4cf8/xtokens/src/lib.rs#L677){target=_blank} function. You'll notice that it calls `WithdrawAsset`, then `InitiateReserveWithdraw` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L410){target=_blank}. The XCM message is constructed by combining the `WithdrawAsset` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

## Fee Calculation for Reserve Assets {: #fee-calc-reserve-assets }

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive from a computational cost perspective an extrinsic is. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, in addition to factors such as network congestion. One unit of weight is defined as one picosecond of execution time.

The following sections will break down how to calculate XCM fees for Polkadot, Kusama, and Moonbeam-based networks. It's important to note that Kusama in particular uses benchmarked data to determine the total weight costs for XCM instructions, and that some XCM instructions might include database reads/writes, which add weight to the call.

There are two databases available in Polkadot and Kusama, RocksDB (which is the default) and ParityDB, both of which have their own associated weight costs for each network. 

### Polkadot {: #polkadot }

As previously mentioned, Polkadot currently uses a [fixed amount of weight](https://github.com/paritytech/polkadot/blob/e76cd144f9dad8c1304fd1476f92495bbb9ad22e/runtime/polkadot/src/xcm_config.rs#L95){target=_blank} for all XCM instructions, which is `{{ networks.polkadot.xcm_instruction.weight.display }}` weight units.

Although Polkadot doesn't currently use database weight units to calculate costs, the weight units for database operations, which have been benchmarked, are shared here for reference.

|     Database      |                     Read                      |                     Write                      |
|:-----------------:|:---------------------------------------------:|:----------------------------------------------:|
| RocksDB (default) | {{ networks.polkadot.rocks_db.read_weight }}  | {{ networks.polkadot.rocks_db.write_weight }}  |
|     ParityDB      | {{ networks.polkadot.parity_db.read_weight }} | {{ networks.polkadot.parity_db.write_weight }} |

With the instruction weight cost established, you can calculate the cost of the instruction in DOT. 

In Polkadot, the [`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=_blank} is set to `{{ networks.polkadot.extrinsic_base_weight.display }}` which is mapped to 1/10th of a cent. Where 1 cent is `10^10 / 10,000`. Therefore, a constant exists in the formula for calculating the final fee in DOT:

```
Planck-DOT-Weight =  PlanckDOT-Mapped * (1 / ExtrinsicBaseWeight)
```

Where the constant is calculated as follows:

```
Planck-DOT-Weight = (10^10 / 10000) * (1 / {{ networks.polkadot.extrinsic_base_weight.numbers_only }})
```

As a result, `Planck-DOT-Weight` is equal to `{{ networks.polkadot.xcm_instruction.planck_dot_weight }} Planck-DOT`. Now, you can begin to calculate the final fee in DOT, using `Planck-DOT-Weight` as a constant, and `TotalWeight` as the variable:

```
Total-Planck-DOT = TotalWeight * Planck-DOT-Weight
DOT = Total-Planck-DOT / DOTDecimalConversion
```

Therefore, the actual calculation for one XCM instruction is:

```
Total-Planck-DOT = {{ networks.polkadot.xcm_instruction.weight.numbers_only }} * {{ networks.polkadot.xcm_instruction.planck_dot_weight }} 
DOT = {{ networks.polkadot.xcm_instruction.planck_dot_cost }} / 10^10
```

The total cost is `{{ networks.polkadot.xcm_instruction.dot_cost }} DOT`.

As an example, you can calculate the total cost of DOT for sending an XCM message that transfers xcDOT to DOT on Polkadot using the following weights and instruction costs:

|  Instruction  |                         Weight                          |                           Cost                            |
|:-------------:|:-------------------------------------------------------:|:---------------------------------------------------------:|
| WithdrawAsset | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
|  ClearOrigin  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
| BuyExecution  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
| DepositAsset  | {{ networks.polkadot.xcm_instruction.weight.display }}  |   {{ networks.polkadot.xcm_instruction.dot_cost }} DOT    |
|   **TOTAL**   | **{{ networks.polkadot.xcm_message.transfer.weight }}** | **{{ networks.polkadot.xcm_message.transfer.cost }} DOT** |

### Kusama {: #kusama }

The total weight costs on Kusama take into consideration database reads and writes in addition to the weight required for a given instruction. Database read and write operations have not been benchmarked, while instruction weights have been. The breakdown of weight costs for the database operations are as follows:

|     Database      |                    Read                     |                    Write                     |
|:-----------------:|:-------------------------------------------:|:--------------------------------------------:|
| RocksDB (default) | {{ networks.kusama.rocks_db.read_weight }}  | {{ networks.kusama.rocks_db.write_weight }}  |
|     ParityDB      | {{ networks.kusama.parity_db.read_weight }} | {{ networks.kusama.parity_db.write_weight }} |

Now that you are aware of the weight costs for database reads and writes on Kusama, you can calculate the weight cost for a given instruction using the base weight for an instruction. 

The [`WithdrawAsset` instruction](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49-L53){target=_blank} has a base weight of `{{ networks.kusama.xcm_instruction.withdraw.base_weight }}`, and includes one database read, and one database write. Therefore, the total weight cost of the `WithdrawAsset` instruction is calculated like so:

```
{{ networks.kusama.xcm_instruction.withdraw.base_weight }} + {{ networks.kusama.rocks_db.read_weight}} + {{ networks.kusama.rocks_db.write_weight}} = {{ networks.kusama.xcm_instruction.withdraw.total_weight }}
```

The `BuyExecution` instruction has a base weight of `{{ networks.kusama.xcm_instruction.buy_exec.base_weight }}` and doesn't include any database reads or writes. Therefore, the total weight cost of the [`BuyExecution` instruction](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L59-L61){target=_blank} is `{{ networks.kusama.xcm_instruction.buy_exec.total_weight }}`.

On Kusama, the benchmarked base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L45){target=_blank} and [generic assets](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=_blank} directly in the Kusama Runtime code.

With the instruction weight cost established, you can calculate the cost of the instruction in KSM. 

In Kusama, the [`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=_blank} is set to `{{ networks.kusama.extrinsic_base_weight.display }}` which is mapped to 1/10th of a cent. Where 1 cent is `10^12 / 30,000`. Therefore, a constant exists in the formula for calculating the final fee in DOT:

```
Planck-KSM-Weight =  PlanckKSM-Mapped * (1 / ExtrinsicBaseWeight)
```

Where `Planck-KSM-Weight` is calculated as follows:

```
Planck-KSM-Weight = (10^12 / 30000 * 10) * (1 / {{ networks.kusama.extrinsic_base_weight.numbers_only }})
```

As a result, `Planck-KSM-Weight` is equal to `{{ networks.kusama.xcm_instruction.planck_ksm_weight }} Planck-KSM`. Now, you can begin to calculate the final fee in KSM, using `Planck-KSM-Weight` as a constant, and `TotalWeight` as the variable:

```
Total-Planck-KSM = TotalWeight * Planck-KSM-Weight
KSM = Total-Planck-KSM / KSMDecimalConversion
```

Therefore, the actual calculation for the `WithdrawAsset` instruction is:

```
Total-Planck-KSM = {{ networks.kusama.xcm_instruction.withdraw.total_weight }} * {{ networks.kusama.xcm_instruction.planck_ksm_weight }}
KSM = {{ networks.kusama.xcm_instruction.withdraw.planck_ksm_cost }} / 10^12
```

The total cost is `{{ networks.kusama.xcm_instruction.withdraw.ksm_cost }} KSM`.

As an example, you can calculate the total cost of KSMs for sending an XCM message that transfers xcKSM to KSM on Kusama using the following weights and instruction costs:

|  Instruction  |                              Weight                              |                               Cost                               |
|:-------------:|:----------------------------------------------------------------:|:----------------------------------------------------------------:|
| WithdrawAsset |   {{ networks.kusama.xcm_instruction.withdraw.total_weight }}    |   {{ networks.kusama.xcm_instruction.withdraw.ksm_cost }} KSM    |
|  ClearOrigin  | {{ networks.kusama.xcm_instruction.clear_origin.total_weight }}  | {{ networks.kusama.xcm_instruction.clear_origin.ksm_cost }} KSM  |
| BuyExecution  |   {{ networks.kusama.xcm_instruction.buy_exec.total_weight }}    |   {{ networks.kusama.xcm_instruction.buy_exec.ksm_cost }} KSM    |
| DepositAsset  | {{ networks.kusama.xcm_instruction.deposit_asset.total_weight }} | {{ networks.kusama.xcm_instruction.deposit_asset.ksm_cost }} KSM |
|   **TOTAL**   |      **{{ networks.kusama.xcm_message.transfer.weight }}**       |     **{{ networks.kusama.xcm_message.transfer.cost }} KSM**      |

### Moonbeam-based Networks {: #moonbeam-based-networks }

Moonbeam uses a fixed amount of weight for each XCM instruction. Then the weight units are converted to balance units as part of the fee calculation. The amount of weight and Wei per weight for each of the Moonbeam-based networks is as follows:

=== "Moonbeam"
    |                                                                                                   Weight                                                                                                    |                                                                            Wei per weight                                                                            |
    |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonbeam.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbeam/src/xcm_config.rs#L201){target=_blank} | [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbeam/src/lib.rs#L128){target=_blank} |

=== "Moonriver"
    |                                                                                                    Weight                                                                                                     |                                                                            Wei per weight                                                                             |
    |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonriver.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonriver/src/xcm_config.rs#L208){target=_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbeam/src/lib.rs#L128){target=_blank} |

=== "Moonbase Alpha"
    |                                                                                                   Weight                                                                                                    |                                                                                             Wei per weight                                                                                             |
    |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
    | [{{ networks.moonbase.xcm.instructions.weight_units.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbase/src/xcm_config.rs#L219){target=_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/PureStake/moonbeam/blob/f19ba9de013a1c789425d3b71e8a92d54f2191af/runtime/moonbase/src/lib.rs#L135){target=_blank} |

This means that on Moonbeam, for example, the formula to calculate the cost of one XCM instruction is as follows:

```
Wei = Weight * Wei_Per_Weight
GLMR = Wei / (10^18)
```

Therefore, the actual calculation is:

```
Wei = {{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} * {{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}
GLMR = {{ networks.moonbeam.xcm.instructions.wei_cost }} / (10^18)
```

The total cost is `{{ networks.moonbeam.xcm.instructions.glmr_cost }} GLMR` for an XCM instruction on Moonbeam.

## Fee Calculation for External Assets {: #fee-calc-external-assets }

Considering the scenario with Alice sending DOT to Alith's account on Moonbeam, the fees are taken from the amount of xcDOT Alith receives. To determine how much to charge, Moonbeam uses a concept called `UnitsPerSecond`, which refers to the units of tokens that the network charges per second of XCM execution time (considering decimals). This concept is used by parachains to determine how much to charge for XCM execution using a different asset than its reserve. Nevertheless, fees can be charged in another token, for example, DOT.

To find out the `UnitsPerSecond` for a given asset, you can query `assetManager.assetTypeUnitsPerSecond` and pass in the multilocation of the asset in question.

If you're unsure of the multilocation, you can retrieve it using the `assetManager.assetIdType` query.

For example, you can navigate to the [Polkadot.js Apps page for Moonbeam](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank} and under the **Developer** dropdown, choose **Chain State**. From there you can take the following steps:

1. For the **selected state query** dropdown, choose **assetManager**
2. Select the **assetIdType** extrinsic
3. Under **Option** enter in the asset ID or toggle the **include option** off to return information for all of the assets. This example will get information for xcUNITs which has an asset ID of `42259045809535163221576417993425387648`
4. Click the **+** button to submit the query

![Get the xcUNIT asset multilocation](/images/builders/xcm/fees/fees-1.png)

You can take the result of the query and then use it to query the **assetTypeUnitsPerSecond** extrinsic:

1. Make sure **assetManager** is selected
2. Select the **assetTypeUnitsPerSecond** extrinsic
3. For **MoonbeamRuntimeXcmConfigAssetType**, choose **Xcm**
4. Enter `1` for **parents**
5. Select `Here` for **interior**
6. Click the **+** button to submit the query

The `UnitsPerSecond` for xcDOT is `{{ networks.moonbeam.xcm.units_per_second.xcdot.display }}`.

![Get the xcUNIT units per second value](/images/builders/xcm/fees/fees-2.png)

Remember that one unit of weight is defined as one picosecond of execution time. Therefore, the formula to determine execution time is as follows:

```
ExecutionTime = (Weight / Picosecond) * NumberOfInstructions
```

To determine the execution time for Alice's transfer of DOT to Moonbeam, which contains four XCM instructions, you can use the following calculation:

```
ExecutionTime = ({{ networks.moonbeam.xcm.instructions.weight_units.numbers_only }} / 10^12) * 4
```

Which means that four XCM instructions cost `{{ networks.moonbeam.xcm.message.transfer.exec_time }}` seconds of block execution time.

To calculate the total cost in xcDOT, you'll also need the number of decimals the asset in question uses, which for xcDOT is 10 decimals. You can determine the number of decimals for any asset by [querying the asset metadata](/builders/xcm/xc20/xc20/#x-chain-assets-metadata){target=_blank}.

The block execution formula can then be used to determine how much Alice's transfer of DOT to Alith's account on Moonbeam costs. The formula for finding the total cost is as follows:

```
Cost = (UnitsPerSecond / DecimalConversion) * ExecutionTime
```

Then the calculation for the transfer is:

```
Cost = ({{ networks.moonbeam.xcm.units_per_second.xcdot.numbers_only }} / 10^10) * {{ networks.moonbeam.xcm.message.transfer.exec_time }}
```

The total cost to transfer Alice's DOT to Alith's account for xcDOT is `{{ networks.moonbeam.xcm.message.transfer.xcdot_cost }} xcDOT`.