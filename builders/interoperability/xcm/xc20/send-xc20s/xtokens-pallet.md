---
title: Send XC-20s to Other Chains
description: This guide provides an introduction to the X-Tokens Pallet and explains how to send XC-20s to another chain using some of the pallet's extrinsics.
---

# Using the X-Tokens Pallet To Send XC-20s

## Introduction {: #introduction }

Building an XCM message for fungible asset transfers is not an easy task. Consequently, there are wrapper functions and pallets that developers can leverage to use XCM features on Polkadot and Kusama. One example of such wrappers is the [X-Tokens](https://github.com/moonbeam-foundation/open-runtime-module-library/tree/master/xtokens){target=\_blank} Pallet, which provides different methods to transfer fungible assets via XCM.

This guide will show you how to leverage the X-Tokens Pallet to send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=\_blank} from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains).

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## X-Tokens Pallet Interface {: #x-tokens-pallet-interface }

### Extrinsics {: #extrinsics }

The X-Tokens Pallet provides the following extrinsics (functions):

???+ function "**transfer**(currencyId, amount, dest, destWeightLimit) — transfer a currency, defined as either the native token (self-reserved) or the asset ID"

    === "Parameters"

        - `currencyId` - the ID of the currency being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, a currency can be defined as one of the following:
            - `SelfReserve` - uses the native asset
            - `ForeignAsset` - uses an [external XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}. It requires you to specify the asset ID of the XC-20
             - `LocalAssetReserve` - *deprecated* - use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank} instead via the `Erc20` currency type
            - `Erc20` along with the contract address of the [local XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}
        - `amount` - the number of tokens that are going to be sent via XCM
        - `dest` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
        - `destWeightLimit` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset. The weight limit can be defined as either:
            - `Unlimited` - allows an unlimited amount of weight that can be purchased
            - `Limited` - limits the amount of weight that can be purchased by defining the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer.js'
        ```

??? function "**transferMultiasset**(asset, dest, destWeightLimit) — transfer a fungible asset, defined by its multilocation"

    === "Parameters"

        - `asset` - the multilocation of the asset being sent via XCM. Each parachain has a different way to reference assets. For example, Moonbeam-based networks reference their native tokens with the Balances Pallet index
        - `dest` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
        - `destWeightLimit` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset. The weight limit can be defined as either:
            - `Unlimited` - allows an unlimited amount of weight that can be purchased
            - `Limited` - limits the amount of weight that can be purchased by defining the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multiasset.js'
        ```

??? function "**transferMultiassetWithFee**(asset, fee, dest, destWeightLimit) — transfer a fungible asset, defined by its multilocation, and pay the fee with a different asset, also defined by its multilocation"

    === "Parameters"

        - `asset` - the multilocation of the asset being sent via XCM. Each parachain has a different way to reference assets. For example, Moonbeam-based networks reference their native tokens with the Balances Pallet index
        - `fee` — the multilocation of the asset used to pay for the XCM execution in the target (destination) chain
        - `dest` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
        - `destWeightLimit` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset. The weight limit can be defined as either:
            - `Unlimited` - allows an unlimited amount of weight that can be purchased
            - `Limited` - limits the amount of weight that can be purchased by defining the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multiasset-with-fee.js'
        ```

??? function "**transferMultiassets**(assets, feeItem, dest, destWeightLimit) — transfer several fungible assets, defined by their multilocation, and pay the fee with one of the assets, also defined by its multilocation"

    === "Parameters"

        - `assets` - the multilocation of the assets being sent via XCM. Each parachain has a different way to reference assets. For example, Moonbeam-based networks reference their native tokens with the Balances Pallet index
        - `feeItem` — an index to define the asset position of an array of assets being sent, used to pay for the XCM execution in the target chain. For example, if only one asset is being sent, the `feeItem` would be `0`
        - `dest` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
        - `destWeightLimit` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset. The weight limit can be defined as either:
            - `Unlimited` - allows an unlimited amount of weight that can be purchased
            - `Limited` - limits the amount of weight that can be purchased by defining the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multiassets.js'
        ```

??? function "**transferMulticurrencies**(currencies, feeItem, dest, destWeightLimit) — transfer different currencies, specifying which is used as the fee. Each currency is defined as either the native token (self-reserved) or with the asset ID"

    === "Parameters"

        - `currencies` - the IDs of the currencies being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, a currency can be defined as one of the following:
            - `SelfReserve` - uses the native asset
            - `ForeignAsset` - uses an [external XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}. It requires you to specify the asset ID of the XC-20
             - `LocalAssetReserve` - *deprecated* - use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank} instead via the `Erc20` currency type
            - `Erc20` along with the contract address of the [local XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}
        - `feeItem` — an index to define the asset position of an array of assets being sent, used to pay for the XCM execution in the target chain. For example, if only one asset is being sent, the `feeItem` would be `0`
        - `dest` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
        - `destWeightLimit` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset. The weight limit can be defined as either:
            - `Unlimited` - allows an unlimited amount of weight that can be purchased
            - `Limited` - limits the amount of weight that can be purchased by defining the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-multicurrencies.js'
        ```

??? function "**transferWithFee**(currencyId, amount, fee, dest, destWeightLimit) — transfer a currency, defined as either the native token (self-reserved) or the asset ID, and specify the fee separately from the amount"

    === "Parameters"

        - `currencyId` - the ID of the currency being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, a currency can be defined as one of the following:
            - `SelfReserve` - uses the native asset
            - `ForeignAsset` - uses an [external XC-20](/builders/interoperability/xcm/xc20/overview#external-xc20s){target=\_blank}. It requires you to specify the asset ID of the XC-20
             - `LocalAssetReserve` - *deprecated* - use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank} instead via the `Erc20` currency type
            - `Erc20` along with the contract address of the [local XC-20](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank}
        - `amount` - the number of tokens that are going to be sent via XCM
        - `fee` — the amount to be spent to pay for the XCM execution in the target (destination) chain. If this value is not high enough to cover execution costs, the assets will be trapped in the destination chain
        - `dest` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
        - `destWeightLimit` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset. The weight limit can be defined as either:
            - `Unlimited` - allows an unlimited amount of weight that can be purchased
            - `Limited` - limits the amount of weight that can be purchased by defining the following:
                - `refTime` - the amount of computational time that can be used for execution
                - `proofSize` - the amount of storage in bytes that can be used
    
    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/transfer-with-fee.js'
        ```

### Storage Methods {: #storage-methods }

The X-Tokens Pallet includes the following read-only storage method:

???+ function "**palletVersion**() — returns current pallet version from storage"

    === "Parameters"

        None

    === "Returns"

        A number representing the current version of the pallet.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        0
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/pallet-version.js'
        ```

### Pallet Constants {: #constants }

The X-Tokens Pallet includes the following read-only functions to obtain pallet constants:

???+ function "**baseXcmWeight**() - returns the base XCM weight required for execution, per XCM instruction"

    === "Returns"

        The base XCM weight object.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { refTime: 200000000, proofSize: 0 }
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/base-xcm-weight.js'
        ```

??? function "**selfLocation**() - returns the multilocation of the chain"

    === "Returns"

        The self-location multilocation object.

        ```js
        // If using Polkadot.js API and calling toJSON() on the unwrapped value
        { parents: 0, interior: { here: null } }
        ```

    === "Polkadot.js API Example"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/interface-examples/self-location.js'
        ```

## Building an XCM Message with the X-Tokens Pallet {: #build-xcm-xtokens-pallet}

This guide covers the process of building an XCM message using the X-Tokens Pallet, more specifically, with the `transfer` and `transferMultiasset` functions. Nevertheless, these two cases can be extrapolated to the other functions in the pallet, especially once you become familiar with multilocations.

!!! note
    Each parachain can allow and forbid specific methods from a pallet. Consequently, developers must ensure that they use methods that are allowed, or the transaction will fail with an error similar to `system.CallFiltered`.

You'll be transferring xcUNIT tokens, which are the [XC-20](/builders/interoperability/xcm/xc20/overview){target=\_blank} representation of the Alphanet relay chain token, UNIT. You can adapt this guide for any other XC-20.

### Checking Prerequisites {: #xtokens-check-prerequisites}

To follow along with the examples in this guide, you need to have the following:

- An account with funds.
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- Some xcUNIT tokens. You can swap DEV tokens (Moonbase Alpha's native token) for xcUNITs on [Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}, a demo Uniswap-V2 clone on Moonbase Alpha

    !!! note
        You can adapt this guide to transfer another [external XC-20 or a local XC-20](/builders/interoperability/xcm/xc20/overview){target=\_blank}. For external XC-20s, you'll need the asset ID and the number of decimals the asset has. For local XC-20s, you'll need the contract address.

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/xtokens-1.png)

To check your xcUNIT balance, you can add the XC-20's [precompile address](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=\_blank} to MetaMask with the following address:

```text
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

### Determining Weight Needed for XCM Execution {: #determining-weight }

To determine the weight needed for XCM execution on the destination chain, you'll need to know which XCM instructions are executed on the destination chain. You can find an overview of the XCM instructions used in the [XCM Instructions for Transfers via X-Tokens](/builders/interoperability/xcm/xc20/send-xc20s/overview/#xcm-instructions-for-asset-transfers){target=\_blank} guide.

In this example, where you're transferring xcUNIT from Moonbase Alpha to the Alphanet relay chain, the instructions that are executed on Alphanet are:

|                                                                                                     Instruction                                                                                                     |                               Weight                                |
|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------:|
| [`WithdrawAsset`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L54-L62){target=\_blank}  |   {{ networks.alphanet.xcm_instructions.withdraw.total_weight }}    |
|  [`ClearOrigin`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L134-L140){target=\_blank}  | {{ networks.alphanet.xcm_instructions.clear_origin.total_weight }}  |
|  [`BuyExecution`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs#L75-L81){target=\_blank}   |   {{ networks.alphanet.xcm_instructions.buy_exec.total_weight }}    |
| [`DepositAsset`](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs#L132-L140){target=\_blank} | {{ networks.alphanet.xcm_instructions.deposit_asset.total_weight }} |
|                                                                                                      **TOTAL**                                                                                                      |   **{{ networks.alphanet.xcm_message.transfer.weight.display }}**   |

!!! note
    Some weights include database reads and writes; for example, the `WithdrawAsset` and `DepositAsset` instructions include both one database read and one write. To get the total weight, you'll need to add the weight of any required database reads or writes to the base weight of the given instruction.

    For Westend-based relay chains, like Alphanet, you can get the weight cost for read and write database operations for [Rocks DB](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/constants/src/weights/rocksdb_weights.rs#L27-L31){target=\_blank} (which is the default database) in the [polkadot-sdk](https://github.com/paritytech/polkadot-sdk){target=\_blank} repository on GitHub.

Since Alphanet is a Westend-based relay chain, you can refer to the instruction weights defined in the [Westend runtime code](https://github.com/paritytech/polkadot-sdk/tree/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend){target=\_blank}, which are broken up into two types of instructions: [fungible](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_fungible.rs){target=\_blank} and [generic](https://github.com/paritytech/polkadot-sdk/blob/polkadot-{{ networks.alphanet.spec_version }}/polkadot/runtime/westend/src/weights/xcm/pallet_xcm_benchmarks_generic.rs){target=\_blank}.

It's important to note that each chain defines its own weight requirements. To determine the weight required for each XCM instruction on a given chain, please refer to the chain's documentation or reach out to a member of their team. To learn how to find the weights required by Moonbeam, Polkadot, or Kusama, you can refer to our documentation on [Weights and Fees](/builders/interoperability/xcm/core-concepts/weights-fees){target=\_blank}.

### X-Tokens Transfer Function {: #xtokens-transfer-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to the Alphanet relay chain through the `transfer` function of the X-Tokens Pallet using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=\_blank}.

Since you'll be interacting with the `transfer` function, you can take the following steps to gather the arguments for the `currencyId`, `amount`, `dest`, and `destWeightLimit`:

1. Define the `currencyId`. For external XC-20s, you'll use the `ForeignAsset` currency type and the asset ID of the asset, which in this case is `42259045809535163221576417993425387648`. For a local XC-20, you'll need the address of the token. In JavaScript, this translates to:

    === "External XC-20"

        ```js
        const currencyId = { 
          ForeignAsset: { 
            ForeignAsset: 42259045809535163221576417993425387648n 
          } 
        };
        ```

    === "Local XC-20"

        ```js
        const currencyId = { Erc20: { contractAddress: 'INSERT_ERC_20_ADDRESS' } };
        ```

2. Specify the `amount` to transfer. For this example, you are sending 1 xcUNIT, which has 12 decimals:

    ```js
    const amount = 1000000000000n;
    ```

3. Define the multilocation of the destination, which will target an account on the relay chain from Moonbase Alpha. Note that the only asset that the relay chain can receive is its own

    ```js
    const dest = { 
      V3: { 
        parents: 1, 
        interior: { X1: { AccountId32: { id: relayAccount } } } 
      } 
    };
    ```

    !!! note
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specifying a `network` parameter. If you don't specify one, it will default to `None`.

4. Set the `destWeightLimit`. Since the weight required to execute XCM messages varies for each chain, you can set the weight limit to be `Unlimited`, or if you have an estimate of the weight needed, you can use `Limited`, but please note that if set below the requirements, the execution may fail

    === "Unlimited"

        ```js
        const destWeightLimit = { Unlimited: null };
        ```

    === "Limited"

        ```js
        const destWeightLimit = {
          Limited: {
            refTime: 'INSERT_ALLOWED_AMOUNT',
            proofSize: 'INSERT_ALLOWED_AMOUNT',
          },
        };
        ```
        
        As outlined in the [Determining Weight Needed for XCM Execution](#determining-weight) section, you'll need {{ networks.alphanet.xcm_message.transfer.weight.display }} weight units for the XCM execution on Alphanet. You can set the `refTime` to `{{ networks.alphanet.xcm_instructions.deposit_asset.total_weight.numbers_only }}`. The `proofSize` can be `0`, as the Alphanet relay chain does not currently account for `proofSize`.

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transfer` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank} provider
 4. Craft the `xTokens.transfer` extrinsic with the `currencyId`, `amount`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=\_blank} using the following encoded calldata: `0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`.

Once the transaction is processed, the target account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

### X-Tokens Transfer Multiasset Function {: #xtokens-transfer-multiasset-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to the Alphanet relay chain using the `transferMultiasset` function of the X-Tokens Pallet.

Since you'll be interacting with the `transferMultiasset` function, you can take the following steps to gather the arguments for the `asset`, `dest`, and `destWeightLimit`:

1. Define the XCM asset multilocation of the `asset`, which will target UNIT tokens in the relay chain from Moonbase Alpha as the origin. Each chain sees its own asset differently. Therefore, you will have to set a different asset multilocation for each destination

    === "External XC-20"

        ```js
        // Multilocation for UNIT in the relay chain
        const asset = {
          V3: {
            id: {
              Concrete: {
                parents: 1,
                interior: null,
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000n }, // 1 token
            },
          },
        };
        ```

    === "Local XC-20"

        ```js
        // Multilocation for a local XC-20 on Moonbeam
        const asset = {
          V3: {
            id: {
              Concrete: {
                parents: 0,
                interior: {
                  X2: [
                    { PalletInstance: 48 },
                    { AccountKey20: { key: 'INSERT_ERC_20_ADDRESS' } },
                  ],
                },
              },
            },
            fun: {
              Fungible: { Fungible: 1000000000000000000n }, // 1 token
            },
          },
        };
        ```

        For information on the default gas limit for local XC-20 transfers and how to override the default, please refer to the following section: [Override Local XC-20 Gas Limits](#override-local-xc20-gas-limits).

2. Define the XCM destination multilocation of the `dest`, which will target an account in the relay chain from Moonbase Alpha as the origin:

    ```js
    const dest = {
      V3: {
        parents: 1,
        interior: { X1: { AccountId32: { id: relayAccount } } },
      },
    };
    ```

    !!! note
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specifying a `network` parameter. If you don't specify one, it will default to `None`.

3. Set the `destWeightLimit`. Since the weight required to execute XCM messages varies for each chain, you can set the weight limit to be `Unlimited`, or if you have an estimate of the weight needed, you can use `Limited`, but please note that if set below the requirements, the execution may fail

    === "Unlimited"

        ```js
        const destWeightLimit = { Unlimited: null };
        ```

    === "Limited"

        ```js
        const destWeightLimit = {
          Limited: {
            refTime: 'INSERT_ALLOWED_AMOUNT',
            proofSize: 'INSERT_ALLOWED_AMOUNT',
          },
        };
        ```
        
        As outlined in the [Determining Weight Needed for XCM Execution](#determining-weight) section, you'll need {{ networks.alphanet.xcm_message.transfer.weight.display }} weight units for the XCM execution on Alphanet. You can set the `refTime` to `{{ networks.alphanet.xcm_instructions.deposit_asset.total_weight.numbers_only }}`. The `proofSize` can be `0`, as the Alphanet relay chain does not currently account for `proofSize`.

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transferMultiasset` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank} provider
 4. Craft the `xTokens.transferMultiasset` extrinsic with the `asset`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/transfer-multiasset.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=\_blank} using the following encoded calldata: `0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`

Once the transaction is processed, the account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

#### Override Local XC-20 Gas Limits {: #override-local-xc20-gas-limits }

If you are transferring a local XC-20, the default units of gas are as follows for each network:

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.erc20_xcm.transfer_gas_limit }}
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.erc20_xcm.transfer_gas_limit }}
    ```

You can override the default gas limit using an additional junction when you create the multilocation for the local XC-20. To do so, you'll need to use the `GeneralKey` junction, which accepts two arguments: `data` and `length`.

For example, to set the gas limit to `300000`, you'll need to set the `length` to `32`, and for the `data`, you'll need to pass in `gas_limit: 300000`. However, you can't simply pass in the value for `data` in text; you'll need to properly format it to a 32-byte zero-padded hex string, where the value for the gas limit is in little-endian format. To properly format the `data`, you can take the following steps:

1. Convert `gas_limit:` to its byte representation
2. Convert the value for the gas limit into its little-endian byte representation
3. Concatenate the two byte representations into a single value padded to 32 bytes
4. Convert the bytes to a hex string

Using the `@polkadot/util` library, these steps are as follows:

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/override-gas-limit.js'
```

The following is an example of a multilocation with the gas limit set to `300000`:

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/override-gas-limit-multilocation.js'
```
