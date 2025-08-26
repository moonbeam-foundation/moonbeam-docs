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
- **Moonbeam and Moonriver** - the XCM execution fees can be paid in the reserve asset (GLMR or MOVR, respectively), but also in assets originated in other chains if they are registered as an [XCM execution asset](/builders/interoperability/xcm/xc-registration/assets/){target=\_blank}. When XCM execution (token transfers or remote execution) is paid in the native chain reserve asset (GLMR or MOVR), {{ networks.moonbeam.treasury.tx_fees_burned }}% is burned. When XCM execution is paid in a foreign asset, the fee is sent to the Treasury

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

To check how the instructions for an XCM message are built to transfer self-reserve assets to a target chain, such as DOT to Moonbeam, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/blob/master/xtokens/src/lib.rs){target=\_blank} repository (as an example). You'll want to take a look at the [`transfer_self_reserve_asset`](https://github.com/moonbeam-foundation/open-runtime-module-library/blob/master/xtokens/src/lib.rs#L699){target=\_blank} function. You'll notice it calls `TransferReserveAsset` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L671){target=\_blank}. The XCM message is constructed by combining the `ReserveAssetDeposited` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

To check how the instructions for an XCM message are built to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you can refer to the [X-Tokens Open Runtime Module Library](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/master/xtokens){target=\_blank} repository. You'll want to take a look at the [`transfer_to_reserve`](https://github.com/moonbeam-foundation/open-runtime-module-library/blob/master/xtokens/src/lib.rs#L719){target=\_blank} function. You'll notice that it calls `WithdrawAsset`, then `InitiateReserveWithdraw` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/polkadot/xcm/xcm-executor/src/lib.rs#L903){target=\_blank}. The XCM message is constructed by combining the `WithdrawAsset` and `ClearOrigin` instructions with the `xcm` parameter, which as mentioned includes the `BuyExecution` and `DepositAsset` instructions.

## Relay Chain XCM Fee Calculation  {: #rel-chain-xcm-fee-calc }

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive from a computational cost perspective an extrinsic is. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call that is being made, in addition to factors such as network congestion.

The following sections will break down how to calculate XCM fees for Polkadot and Kusama. It's important to note that Kusama, in particular, uses benchmarked data to determine the total weight costs for XCM instructions and that some XCM instructions might include database reads and writes, which add weight to the call.

There are two databases available in Polkadot and Kusama: RocksDB (which is the default) and ParityDB, both of which have their own associated weight costs for each network.

### Polkadot {: #polkadot }

The total weight costs on Polkadot take into consideration database reads and writes in addition to the weight required for a given instruction. Polkadot uses benchmarked weights for instructions, and database read-and-write operations. The breakdown of weight costs for the database operations can be found on the respective repository files for [RocksDB (default)](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/rocksdb_weights.rs){target=\_blank} and [ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/paritydb_weights.rs){target=\_blank}.  

Now that you are aware of the weight costs for database reads and writes on Polkadot, you can calculate the weight cost for a given instruction using the base weight for instructions.

On Polkadot, the benchmarked base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L46){target=\_blank} and [generic assets](https://github.com/polkadot-fellows/runtimes/blob/{{networks.polkadot.spec_version}}/relay/polkadot/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=\_blank} directly in the Polkadot Runtime code.

With the instruction weight cost established, you can calculate the cost of each instruction in DOT.

In Polkadot, the [`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/weights/extrinsic_weights.rs#L56){target=\_blank} is set to `{{ networks.polkadot.extrinsic_base_weight.display }}` which is [mapped to 1/10th](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.polkadot.spec_version }}/relay/polkadot/constants/src/lib.rs#L92){target=\_blank} of a cent. Where 1 cent is `10^10 / 100`.

Therefore, to calculate the cost of executing an XCM instruction, you can use the following formula:

```text
XCM-DOT-Cost = XCMInstrWeight * DOTWeightToFeeCoefficient
```

Where `DOTWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

```text
DOTWeightToFeeCoefficient = 10^10 / ( 10 * 100 * DOTExtrinsicBaseWeight )
```

Now, you can begin to calculate the final fee in DOT, using `DOTWeightToFeeCoefficient` as a constant and `TotalWeight` as the variable:

```text
XCM-Planck-DOT-Cost = TotalWeight * DOTWeightToFeeCoefficient
XCM-DOT-Cost = XCM-Planck-DOT-Cost / DOTDecimalConversion
```

### Kusama {: #kusama }

The total weight costs on Kusama take into consideration database reads and writes in addition to the weight required for a given instruction. The breakdown of weight costs for the database operations can be found on the respective repository files for [RocksDB (default)](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/rocksdb_weights.rs){target=\_blank} and [ParityDB](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/constants/src/weights/paritydb_weights.rs){target=\_blank}. 

On Kusama, the benchmarked base weights are broken up into two categories: fungible and generic. Fungible weights are for XCM instructions that involve moving assets, and generic weights are for everything else. You can view the current weights for [fungible assets](https://github.com/polkadot-fellows/runtimes/blob/{{ networks.kusama.spec_version }}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L46){target=\_blank} and [generic assets](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L46){target=\_blank} directly in the Kusama Runtime code.

With the instruction weight cost established, you can calculate the cost of the instruction in KSM with the [`ExtrinsicBaseWeight`](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/weights/extrinsic_weights.rs#L56){target=\_blank} and the [weight fee mapping](https://github.com/polkadot-fellows/runtimes/blob/{{networks.kusama.spec_version}}/relay/kusama/constants/src/lib.rs#L90){target=\_blank}.

To calculate the cost of executing an XCM instruction, you can use the following formula:

```text
XCM-KSM-Cost = XCMInstrWeight * KSMWeightToFeeCoefficient
```

Where `KSMWeightToFeeCoefficient` is a constant (map to 1 cent), and can be calculated as:

```text
KSMWeightToFeeCoefficient = 10^12 / ( 10 * 3000 * KSMExtrinsicBaseWeight )
```

Now, you can begin to calculate the final fee in KSM, using `KSMWeightToFeeCoefficient` as a constant and `TotalWeight` as the variable:

```text
XCM-Planck-KSM-Cost = TotalWeight * KSMWeightToFeeCoefficient
XCM-KSM-Cost = XCM-Planck-KSM-Cost / KSMDecimalConversion
```

## Moonbeam-based Networks XCM Fee Calculation  {: #moonbeam-xcm-fee-calc }

Substrate has introduced a weight system that determines how heavy or, in other words, how expensive an extrinsic is from a computational cost perspective. One unit of weight is defined as one picosecond of execution time. When it comes to paying fees, users will pay a transaction fee based on the weight of the call being made, and each parachain can decide how to convert weight to fee. For example, this may account for additional costs related to transaction size and storage.

For all Moonbeam-based networks, the generic XCM instructions are benchmarked, while the fungible XCM instructions still use a fixed amount of weight per instruction. Consequently, the total weight cost of the benchmarked XCM instructions considers the number of database reads and writes in addition to the weight required for a given instruction. The Polkadot SDK has a breakdown of the relevant [RocksDB database weights](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/substrate/frame/support/src/weights/rocksdb_weights.rs#L27-L28){target=\_blank}.

Now you can calculate the weight cost for both fungible and generic XCM instructions using the base weight for instruction and the extra database reads and writes if applicable.

For example, the `WithdrawAsset` instruction is part of the fungible XCM instructions. Therefore, it is not benchmarked, and the total weight cost of the [`WithdrawAsset` instruction](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/fungible.rs#L36){target=\_blank} is `{{ xcm.fungible_weights.display }}`, except for when transferring local XC-20s. The total weight cost for the `WithdrawAsset` instruction for local XC-20s is based on converting Ethereum gas to Substrate weight.

The `BuyExecution` instruction is generic and therefore has a predefined benchmarked weight. You can view its current base weight in the [Moonbeam runtime source code](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/generic.rs#L132-L133){target=\_blank}. In addition to the base weight, the instruction performs four database reads, which are added to calculate the total weight.


You can find all the weight values for all the XCM instructions in the following table, which apply to all Moonbeam-based networks:

|                                                                                     Benchmarked Instructions                                                                                     |                                                                                    Non-Benchmarked Instructions                                                                                    |
|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [Generic XCM Instructions](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/generic.rs){target=\_blank} | [Fungible XCM Instructions](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/runtime/moonbeam/src/weights/xcm/fungible.rs){target=\_blank} |

The following sections will break down how to calculate XCM fees for Moonbeam-based networks. There are two main scenarios:

 - Fees paid in the reserve token (native tokens like GLMR, MOVR, or DEV)
 - Fees paid in external assets (XC-20s)

### Fee Calculation for Reserve Assets {: #moonbeam-reserve-assets }

For each XCM instruction, the weight units are converted to balance units as part of the fee calculation. The amount of Wei per weight unit for each of the Moonbeam-based networks is as follows:

|                                                                                                  Moonbeam                                                                                                   |                                                                                                   Moonriver                                                                                                    |                                                                                               Moonbase Alpha                                                                                                |
|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| [{{ networks.moonbeam.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbeam.spec_version}}/runtime/moonbeam/src/lib.rs#L163){target=\_blank} | [{{ networks.moonriver.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonriver.spec_version}}/runtime/moonriver/src/lib.rs#L171){target=\_blank} | [{{ networks.moonbase.xcm.instructions.wei_per_weight.display }}](https://github.com/moonbeam-foundation/moonbeam/blob/{{networks.moonbase.spec_version}}/runtime/moonbase/src/lib.rs#L169){target=\_blank} |

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

Moonbeam charges fees for external assets based on the weight of the call. Weight is a struct that contains two fields, `refTime` and `proofSize`. `refTime` refers to the amount of computational time that can be used for execution. `proofSize` refers to the size of the PoV (Proof of Validity) of the Moonbeam block that gets submitted to the Polkadot Relay Chain for validation. Since both `refTime` and `proofSize` are integral components of determining a weight, it is impossible to obtain an accurate weight value with just one of these values.

You can query the `refTime` and `proofSize` of an XCM instruction with the [`queryXcmWeight` method of the `xcmPaymentApi`](#query-xcm-weight). You can do this [programmatically](#query-xcm-weight) or by visiting the [Runtime Calls tab of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam.api.onfinality.io%2Fpublic-ws#/runtime){target=\_blank}. The `queryXcmWeight` method takes an XCM version and instruction has a parameter and returns the corresponding `refTime` and `proofSize` values.

#### Weight to Gas Mapping {: #weight-to-gas-mapping }

For calls that are derived from EVM operations, such as the `DepositAsset` instruction which relies on the EVM operation `MintInto`, you can calculate their respective weight values by multiplying the gas limit by weight multipliers. For `refTime`, you'll need to multiply the gas limit by `{{ xcm.generic_weights.weight_per_gas.numbers_only }}` and for `proofSize` you'll need to multiply the gas limit by `{{ xcm.generic_weights.proof_size.weight_per_gas }}`.  A chart is included below for convenience. 

| Weight Type |                  Multiplier Value                   |
|:-----------:|:---------------------------------------------------:|
|  Ref Time   |  {{ xcm.generic_weights.weight_per_gas.display }}   |
| Proof Size  | {{ xcm.generic_weights.proof_size.weight_per_gas }} |

To determine the total weight for Alice's transfer of DOT to Moonbeam, you'll need the weight for each of the four XCM instructions required for the transfer. Note that while the first three instructions have specific `refTime` and `proofSize` values corresponding to these instructions that can be retrieved via [`queryXcmWeight` method of the `xcmPaymentApi`](#query-xcm-weight), `DepositAsset` relies on the EVM operation [`MintInto`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbeam.spec_version }}/pallets/moonbeam-foreign-assets/src/evm.rs#L40){target=\_blank} and a `WeightPerGas` conversion of `{{ xcm.generic_weights.weight_per_gas.display }}` per gas. The `refTime` of `DepositAsset` can thus be calculated as: 

```text
{{ xcm.generic_weights.ref_time.mint_into_gas.numbers_only }} gas * {{ xcm.generic_weights.weight_per_gas.numbers_only }} weight per gas = {{ xcm.generic_weights.ref_time.deposit_asset.numbers_only }}
```

And the `proofSize` of `DepositAsset` can be calculated as:

```text
{{ xcm.generic_weights.ref_time.mint_into_gas.numbers_only }} gas * {{ xcm.generic_weights.proof_size.weight_per_gas }} weight per gas = {{ xcm.generic_weights.proof_size.deposit_asset.numbers_only }}
```

### Weight to Asset Fee Conversion {: #weight-to-asset-fee-conversion} 

Once you have the sum of the `refTime` and `proofSize` values, you can easily retrieve the required commensurate fee amount. The [`queryWeightToAssetFee` method of the `xcmPaymentApi`](#weight-to-asset-fee-conversion) takes a `refTime`, `proofSize`, and asset multilocation as parameters and returns the commensurate fee. By providing the amounts obtained above of `{{ networks.moonbeam.xcm.transfer_dot.total_weight.display }}` `refTime` and `{{ xcm.generic_weights.proof_size.transfer_dot_total.display }}` `proofSize`, and the asset multilocation for DOT, we get a fee amount of `88,920,522` Plank, which is the smallest unit in Polkadot. We can convert this to DOT by dividing by `10^10` which gets us a DOT fee amount of `{{ networks.moonbeam.xcm.transfer_dot.xcdot_cost }}` DOT. 

## XCM Payment API Expanded Examples {: #xcm-payment-api-exanded-examples }

The XCM Payment API methods provide various helpful ways to calculate fees, evaluate acceptable fee payment currencies, and more. Remember that in addition to accessing this via API, you can also interact with the XCM Payment API via the [Runtime Calls tab of Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fmoonbeam.api.onfinality.io%2Fpublic-ws#/runtime){target=\_blank}.

### Query Acceptable Fee Payment Assets {: #query-acceptable-fee-payment-assets }

This function takes the XCM Version as a parameter and returns a list of acceptable fee assets in multilocation form. 

```javascript
const allowedAssets =
  await api.call.xcmPaymentApi.queryAcceptablePaymentAssets(3);
console.log(allowedAssets);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/query-acceptable-payment-assets.js'
    ```

### Weight to Asset Fee Conversion {: #weight-to-asset-fee-conversion }

This method converts a weight into a fee for the specified asset. It takes as parameters a weight and an asset multilocation and returns the respective fee amount.

```javascript
const fee = await api.call.xcmPaymentApi.queryWeightToAssetFee(
  {
    refTime: 10_000_000_000n,
    proofSize: 0n,
  },
  {
    V3: {
      Concrete: { parents: 1, interior: 'Here' },
    },
  }
);

console.log(fee);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/weight-to-asset-fee-conversion.js'
    ```

### Query XCM Weight {: #query-xcm-weight}

This method takes an XCM message as a parameter and returns the weight of the message. 

```javascript
const message = { V3: [instr1, instr2] };

const theWeight = await api.call.xcmPaymentApi.queryXcmWeight(message);
console.log(theWeight);
```

??? code "View the complete script"

    ```js
    --8<-- 'code/builders/interoperability/xcm/core-concepts/weights-fees/query-xcm-weight.js'
    ```
