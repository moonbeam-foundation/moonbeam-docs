---
title: XCM Execution Fees
description: Learn about the XCM instructions involved in handling XCM execution fee payments and how to calculate fees on Polkadot, Kusama, and Moonbeam-based networks.
---

# XCM Fees on Moonbeam

![XCM Fees Banner](/images/builders/xcm/fees/fees-banner.png)

## Introduction {: #introduction}

XCM aims to be a language that communicates ideas between consensus systems. It is designed to be general, extensible, and efficient so that it remains useful and future-proof throughout a growing ecosystem. As such, the generality applies to concepts including payments of fees for XCM execution. 

In Ethereum, fees are baked into the transaction protocol, whereas in the Polkadot ecosystem each parachain has the flexibility to define how XCM fees are handled. If fees are required, XCM provides the ability to buy execution resources with assets.

This guide will cover aspects of fee payment such as who is responsible to pay XCM execution fees, how it is paid for, and how the fees are calculated on Moonbeam.

## Payment of Fees {: #payment-of-fees }

Consider the following scenario: Alice has some DOT on Polkadot and she wants to transfer it to xcDOT on Moonbeam, to her account name Alith. She sends an XCM message along with a given amount of DOT on Polkadot with instructions to deposit the xcDOT into her Alith account. Part of the instructions are executed on Polkdot and the other part are executed on Moonbeam. 

How does Alice pay Moonbeam to execute these instructions and fulfill her request? It is done through a series of XCM instructions which essentially enable her to buy execution time using the balance of the transferred assets. This means that when Alice sends a set amount of DOT and then when she receives the xcDOT in her Alith account, she receives the transferred amount minus any XCM execution fees.

In general, the process can be described as follows:

1. Some assets need to be provided
2. The exchange of assets for compute time (or weight) must be negotiated
3. The XCM operations will be performed as instructed and any leftover assets will be sent to a destination account

### XCM Instructions {: #xcm-instructions }

There are a number of XCM instructions that can be used to provide assets, including the `WithdrawAsset` and `ReserveAssetDeposited` instructions. If the assets are provided via the `ReserveAssetDeposited` instruction, the assets are not always relayed from a trusted source. As such, the `ClearOrigin` instruction can be used to ensure that later instructions cannot act with the authority of the original origin.

To exchange the assets for compute time, the `BuyExecution` instruction is used. Then with any remaining assets the `DepositAsset` instruction can be used to send the assets to a beneficiary.

The following is an overview of each of these instructions:

- **`WithdrawAsset(assets: MultiAssets)`** - removes the on-chain asset(s) and holds them in the Holding Register, a temporary position in the Cross-Consensus Virtual Machine (XCVM), which can then be used to pay for XCM execution fees
- **`ReserveAssetDeposited(assets: MultiAssets)`** - accrues the asset(s) which have been received into the sovereign account of the local consensus system into holding
- **`ClearOrigin`** - clears the origin to ensure that later instructions cannot command the authority of the original origin. Useful in cases where the instructions are being relayed from an untrusted source, as often is the case with `ReserveAssetDeposited`
- **`BuyExecution(fees: MultiAsset, weight_limit: Option<Weight>)`** - takes asset(s) from holding to pay for execution fees. The amount that is actually used is determined by the interpreting system. If the fees are more than the specified amount then the instruction will result in error. You can optionally provide the amount of weight to be purchased. If the given amount of weight is lower than the estimated weight, an error will be thrown
- **`DepositAsset(assets: MultiAssetFilter, max_assets: Compact, beneficiary: MultiLocation`** - removes asset(s) from holding to be sent to a destination account. The maximum assets defines the maximum number of unique assets to remove from holding, any remaining assets stay in holding

## Calculation of Fees {: #calculation-of-fees-native }

Substrate has introduced a weight system that determines how heavy an extrinsic is. When it comes to paying fees, users will pay a transaction fee that is proportionate to the weight of the call that is being made. One unit of weight is defined as one picosecond of execution time.

The following sections will break down how to calculate XCM fees for Polkadot, Kusama, and Moonbeam-based networks. It's important to note that Kusama uses benchmarking and database read and write weight costs to determine the total weight costs for XCM instructions. Whereas Polkadot and Moonbeam-based networks use a fixed weight cost in their calculations. 

There are two databases available in Polkadot and Kusama, RocksDB (which is the default) and ParityDB, both of which have their own associated weight costs for each network. 

### Polkadot {: #polkadot }

As previously mentioned, Polkadot currently uses a [fixed amount of weight](https://github.com/paritytech/polkadot/blob/e76cd144f9dad8c1304fd1476f92495bbb9ad22e/runtime/polkadot/src/xcm_config.rs#L95){target=_blank} for all XCM instructions, which is `1,000,000,000` weight units.

Although Polkadot doesn't currently use database weight units to calculate costs, the weight units for database operations are shared here for reference.

|     Database      |    Read    |   Write    |
|:-----------------:|:----------:|:----------:|
| RocksDB (default) | 20,499,000 | 83,471,000 |
|     ParityDB      | 11,826,000 | 30,052,000 |

With the instruction weight cost established, you can calculate the cost of the instruction in DOT. 

In Polkadot, the [`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=_blank} is set to `85,212,000` which is mapped to 1/10th of a cent. Where 1 cent is `10^10 / 10,000`. Therefore, the formula for calculating the final fee in DOT looks like this:

```
Total-Planck-DOT = TotalWeight * PlanckDOT * (1 / ExtrinsicBaseWeight)
DOT = Total-Planck-DOT / 10^10
```

Therefore, the actual calculation for the `WithdrawAsset` instruction is:

```
Total-Planck-DOT = 1000000000 * (10^10 / 1000) * (1 / 85212000)
DOT = 117354360 / 10^10
```

The total cost is `0.0117354363 DOT`.

### Kusama {: #kusama }

Kusama doesn't used fixed weights, but bases the weights off of measured results from benchmarking data. The weights on Kusama take into consideration database reads and writes in addition to the weight required for a given instruction. 

The breakdown of weight costs for database read and write operations are as follows:

|     Database      |    Read    |    Write    |
|:-----------------:|:----------:|:-----------:|
| RocksDB (default) | 25,000,000 | 100,000,000 |
|     ParityDB      | 8,000,000  | 50,000,000  |

Now that you are aware of the weight costs for database reads and writes on Kusama, you can calculate the weight cost for a given instruction using the base weight for an instruction. 

The [`WithdrawAsset` instruction](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L49-L53){target=_blank} has a base weight of `20,385,000`, and includes one database read, and one database write. Therefore, the total weight cost of the `WithdrawAsset` instruction is calculated like so:

```
20,385,000 + 25,000,000 + 100,000,000 = 145,385,000
```

The `BuyExecution` instruction has a base weight of `3,109,000` and doesn't include any database reads or writes. Therefore, the total weight cost of the `BuyExecution` instruction is `3,109,000`.

On Kusama, the base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L45){target=_blank} and [generic assets](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=_blank} directly in the Kusama Runtime code.

With the instruction weight cost established, you can calculate the cost of the instruction in KSM. 

In Kusama, the [`ExtrinsicBaseWeight`](https://github.com/paritytech/polkadot/blob/master/runtime/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=_blank} is set to `86,309,000` which is mapped to 1/10th of a cent. Where 1 cent is `10^12 / 30,000`. Therefore, the formula for calculating the final fee in KSM looks like this:

```
Total-Planck-KSM = TotalWeight * PlanckKSM * (1 / ExtrinsicBaseWeight)
KSM = Total-Planck-KSM / 10^12
```

Therefore, the actual calculation for the `WithdrawAsset` instruction is:

```
Total-Planck-KSM = 145,385,000 * (10^12 / 30000 * 10) * (1 / 86309000)
KSM = 5614903.04216 / 10^12
```

The total cost is `0.00000561490304213694 KSM`.

### Moonbeam-based Networks {: #moonbeam-based-networks }

Moonbeam uses a fixed amount of weight for each XCM instruction. The amount for each of the Moonbeam-based networks is as follows:

=== "Moonbeam"
    ```
    200,000,000 weight units
    ```

=== "Moonriver"
    ```
    200,000,000 weight units
    ```

=== "Moonbase Alpha"
    ```
    100,000,000 weight units
    ```

Weight units are converted to balance units as part of the fee calculation. For XCM related weight, the cost is fixed for each Moonbeam-based network as follows:

=== "Moonbeam"
    ```
    5,000,000 Wei per weight
    ```

=== "Moonriver"
    ```
    50,000 Wei per weight
    ```

=== "Moonbase Alpha"
    ```
    50,000 Wei per weight
    ```

This means that on Moonbase Alpha, for example, the formula to calculate the cost of one XCM instruction is as follows:

```
Wei = Weight * Wei_Per_Weight
DEV = Wei / (10^18)
```

Therefore, the actual calculation is:

```
Wei = 5000000 * 200000000
DEV = 5000000000000 / (10^18)
```

The total cost is `0.000005 DEV` for an XCM instruction on Moonbase Alpha.

In the previous example with Alice, her fees were taken out of Alith's xcDOT balance. To determine the amount of a particular asset, such as xcDOT, to charge per second of local XCM execution, Moonbeam uses a concept called `UnitsPerSecond`. This concept is used by parachains to determine how much to charge in the target parachain. Nevertheless, fees can be charged in another token, for example, DOT.

To find out the `UnitsPerSecond` for a given asset, you can query `assetManager.assetTypeUnitsPerSecond` and pass in the multilocation of the asset in question.

If you're unsure of the multilocation, you can retrieve it using the `assetManager.assetIdType` query.

For example, you can navigate to Polkadot.js Apps and under the **Developer** dropdown, choose **Chain State**. From there you can take the following steps:

1. For the **selected state query** dropdown, choose **assetManager**
2. Select the **assetIdType** extrinsic
3. Under **Option** enter in the asset ID or toggle the **include option** off to return information for all of the assets. This example will get information for xcUNITs which has an asset ID of `42259045809535163221576417993425387648`
4. Click the **+** button to submit the query

![Get the xcUNIT asset multilocation](/images/builders/xcm/fees/fees-1.png)

You can take the result of the query and then use it to query the **assetTypeUnitsPerSecond** extrinsic:

1. Make sure **assetManager** is selected
2. Select the **assetTypeUnitsPerSecond** extrinsic
3. For **MoonbaseRuntimeXcmConfigAssetType**, choose **Xcm**
4. Enter `1` for **parents**
5. Select `Here` for **interior**
6. Click the **+** button to submit the query

The `UnitsPerSecond` for xcDOT is `11,285,231,116`.

![Get the xcUNIT units per second value](/images/builders/xcm/fees/fees-2.png)

To calculate the total cost, you'll also need the number of decimals the asset in question uses, which for xcDOT is 12 decimals. You can determine the number of decimals for any asset by [querying the asset metadata](/builders/xcm/xc20/xc20/#x-chain-assets-metadata){target=_blank}.

Remember that one unit of weight is defined as one picosecond of execution time. Therefore, to get the cost of execution time for a single instruction, you can use the following formula:

```
ExecutionTime = Weight / Picosecond
```

The calculation for Moonbeam, for example, is as follows:

```
ExecutionTime = 200000000 / 10^12
```

Which means that one XCM instruction costs `0.0002` seconds of block execution time.

The block exuection formula can then be used to determine how much the Alice's transfer of xcDOT to Alith costs. The formula for finding the total cost is as follows:

```
Cost = (UnitsPerSecond / Picosecond) * ExecutionTime * NumberOfInstructions
```

Then the calculation for the transfer is:

```
Cost = (11285231116 / 10^12) * 0.0002 * 4
```

The total cost to transfer Alice's DOT to her Alith account for xcDOT is `0.00000902818 xcDOT`.