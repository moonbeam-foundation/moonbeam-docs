---
title: The XCM Transactor Precompile
description: This guide describes the XCM Transactor Precompile and shows how to use some of its functions to send remote calls to other chains using Ethereum libraries.
---

# Using the XCM Transactor Precompile for Remote Execution

XCM messages are comprised of a [series of instructions](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers and, more interestingly, remote cross-chain execution. Remote execution involves executing operations or actions on one blockchain from another blockchain while maintaining the integrity of the sender's identity and permissions.

Typically, XCM messages are sent from the root origin (that is, SUDO or through governance), which is not ideal for projects that want to leverage remote cross-chain calls via a simple transaction. The [XCM Transactor Pallet](https://github.com/moonbeam-foundation/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank} makes it easy to transact on a remote chain through either the [Sovereign account](/builders/interoperability/xcm/overview#general-xcm-definitions){target=_blank}, which should only be allowed through governance, or a [Computed Origin account](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank} via a simple transaction from the source chain.

However, the XCM Transactor Pallet is coded in Rust and is normally not accessible from the Ethereum API side of Moonbeam. As such, Moonbeam introduced the XCM Transactor Precompile, which is a Solidity interface that allows you to interact directly with the Substrate pallet using the Ethereum API.

This guide will show you how to use the XCM Transactor Precompile to send XCM messages from a Moonbeam-based network to other chains in the ecosystem.

**Note that there are still limitations to what you can remotely execute through XCM messages**.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## XCM Transactor Precompile Contract Address {: #precompile-address }

There are several versions of the XCM Transactor Precompile. **V1 will be deprecated in the near future**, so all implementations must migrate to the newer interfaces. V3 is currently only available on Moonbase Alpha.

The XCM Transactor Precompiles are located at the following addresses:

=== "Moonbeam"

    | Version |                                Address                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbeam.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    |                             Not available                              |

=== "Moonriver"
    | Version |                                 Address                                 |
    |:-------:|:-----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonriver.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    |                              Not available                              |

=== "Moonbase Alpha"

    | Version |                                Address                                 |
    |:-------:|:----------------------------------------------------------------------:|
    |   V1    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v1 }}```</pre> |
    |   V2    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v2 }}```</pre> |
    |   V3    | <pre>```{{ networks.moonbase.precompiles.xcm_transactor_v3 }}```</pre> |

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## The XCM Transactor Solidity Interface {: #xcmtrasactor-solidity-interface }

The XCM Transactor Precompile is a Solidity interface through which developers can interact with the XCM Transactor Pallet using the Ethereum API.

??? code "XcmTransactorV1.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV1.sol'
    ```

??? code "XcmTransactorV2.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV2.sol'
    ```

??? code "XcmTransactorV3.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/XcmTransactorV3.sol'
    ```

!!! note
    The [XCM Transactor Precompile V1](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xcm-transactor/src/v1/XcmTransactorV1.sol){target=_blank} will be deprecated in the near future, so all implementations must migrate to the newer interfaces.

The interface varies slightly from version to version. You can find an overview of each version's interface below.

=== "V2"

    The V2 interface includes the following functions:

    ??? function "**transactInfoWithSigned**(*Multilocation* *memory* multilocation) — read-only function that returns the transact information for a given chain"

        === "Parameters"

            - `multilocation` - the multilocation of the chain to get the transact information for
        
        === "Returns"

            The transact information for: 
                - The three XCM instructions associated with the external call execution (`transactExtraWeight`)
                - The extra weight information associated with the `DescendOrigin` XCM instruction for the transact through signed extrinsic (`transactExtraWeightSigned`)
                - The maximum allowed weight for the message in the given chain

            ```js
            [ 173428000n, 0n, 20000000000n ]
            ```

    ??? function "**feePerSecond**(*Multilocation* *memory* multilocation) — read-only function that returns units of tokens per second of the XCM execution that is charged as the XCM execution fee for a given asset. This is useful when, for a given chain, there are multiple assets that can be used for fee payment"

        === "Parameters"

            - `multilocation` - the multilocation of the asset to get the units per second value for
        
        === "Returns"
            
            The fee per second that the reserve chain charges for the given asset.

            ```js
            13764626000000n
            ```

    ??? function "**transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — sends an XCM message with instructions to remotely execute a call in the destination chain. The remote call will be signed and executed by a new account, called the [Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank} account, that the destination parachain must compute. Moonbeam-based networks follow [the Computed Origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}. You need to provide the asset multilocation of the token that is used for fee payment instead of the address of the XC-20 token"

        === "Parameters"

            - `dest` - the multilocation of a chain in the ecosystem where the XCM message is being sent to (the target chain). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
            - `feeLocation` - the multilocation of the asset to use for fee payment. The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
            - `transactRequiredWeightAtMost` - the weight to buy in the destination chain for the execution of the call defined in the `Transact` instruction
            - `call` - the call to be executed in the destination chain, as defined in the `Transact` instruction 
            - `feeAmount` - the amount to be used as a fee
            - `overallWeight` - the total weight the extrinsic can use to execute all the XCM instructions, plus the weight of the `Transact` call (`transactRequiredWeightAtMost`)

    ??? function "**transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *uint64* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *uint64* overallWeight) — sends an XCM message with instructions to remotely execute a call in the destination chain. The remote call will be signed and executed by a new account, called the [Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank} account, that the destination parachain must compute. Moonbeam-based networks follow [the Computed Origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}. You need to provide the address of the XC-20 asset to be used for fee payment"

        === "Parameters"

            - `dest` - the multilocation of a chain in the ecosystem where the XCM message is being sent to (the target chain). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
            - `feeLocationAddress` - the [XC-20 address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank} of the asset to use for fee payment
            - `transactRequiredWeightAtMost` - the weight to buy in the destination chain for the execution of the call defined in the `Transact` instruction
            - `call` - the call to be executed in the destination chain, as defined in the `Transact` instruction 
            - `feeAmount` - the amount to be used as a fee
            - `overallWeight` - the total weight the extrinsic can use to execute all the XCM instructions, plus the weight of the `Transact` call (`transactRequiredWeightAtMost`)

=== "V3 (Moonbase Alpha only)"

    The V3 interface adds support for Weights V2, which updates the `Weight` type to represent proof size in addition to computational time. As such, this requires that `refTime` and `proofSize` be defined, where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used. 
    
    The following struct was added to the XCM Transactor Precompile to support Weights V2:

    ```solidity
    struct Weight {
        uint64 refTime;
        uint65 proofSize;
    }
    ```

    Additionally, support for the [`RefundSurplus`](/builders/interoperability/xcm/core-concepts/instructions#refund-surplus){target=_blank} and [`DepositAsset`](/builders/interoperability/xcm/core-concepts/instructions#deposit-asset){target=_blank} instructions was added. To append the `RefundSurplus` instruction to the XCM message, you can use the `refund` parameter, which will refund any leftover funds not used for the `Transact` if set to `true`.

    The V3 interface includes the following functions:


    ??? function "**transactInfoWithSigned**(*Multilocation* *memory* multilocation) — read-only function that returns the transact information for a given chain"

        === "Parameters"

            - `multilocation` - the multilocation of the chain to get the transact information for
        
        === "Returns"

            The transact information for: 
                - The three XCM instructions associated with the external call execution (`transactExtraWeight`)
                - The extra weight information associated with the `DescendOrigin` XCM instruction for the transact through signed extrinsic (`transactExtraWeightSigned`)
                - The maximum allowed weight for the message in the given chain

            ```js
            [ 173428000n, 0n, 20000000000n ]
            ```

    ??? function "**feePerSecond**(*Multilocation* *memory* multilocation) — read-only function that returns units of token per second of the XCM execution that is charged as the XCM execution fee for a given asset. This is useful when, for a given chain, there are multiple assets that can be used for fee payment"

        === "Parameters"

            - `multilocation` - the multilocation of the asset to get the units per second value for
        
        === "Returns"
            
            The fee per second that the reserve chain charges for the given asset.

            ```js
            13764626000000n
            ```

    ??? function "**transactThroughSignedMultilocation**(*Multilocation* *memory* dest, *Multilocation* *memory* feeLocation, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — sends an XCM message with instructions to remotely execute a call in the destination chain. The remote call will be signed and executed by a new account, called the [Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank} account, that the destination parachain must compute. Moonbeam-based networks follow [the Computed Origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}. You need to provide the asset multilocation of the token that is used for fee payment instead of the address of the XC-20 token"

        === "Parameters"

            - `dest` - the multilocation of a chain in the ecosystem where the XCM message is being sent to (the target chain). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
            - `feeLocation` - the multilocation of the asset to use for fee payment. The multilocation must be formatted in a particular way, which is described in the [following section](#building-the-precompile-multilocation)
            - `transactRequiredWeightAtMost` - the weight to buy in the destination chain for the execution of the call defined in the `Transact` instruction
            - `call` - the call to be executed in the destination chain, as defined in the `Transact` instruction 
            - `feeAmount` - the amount to be used as a fee
            - `overallWeight` - the total weight the extrinsic can use to execute all the XCM instructions, plus the weight of the `Transact` call (`transactRequiredWeightAtMost`)
            - `refund` -  a boolean indicating whether or not to add the `RefundSurplus` and `DepositAsset` instructions to the XCM message to refund any leftover fees 

    ??? function "**transactThroughSigned**(*Multilocation* *memory* dest, *address* feeLocationAddress, *Weight* transactRequiredWeightAtMost, *bytes* *memory* call, *uint256* feeAmount, *Weight* overallWeight, *bool* refund) — sends an XCM message with instructions to remotely execute a call in the destination chain. The remote call will be signed and executed by a new account, called the [Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank} account, that the destination parachain must compute. Moonbeam-based networks follow [the Computed Origins standard set by Polkadot](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-builder/src/location_conversion.rs){target=_blank}. You need to provide the address of the XC-20 asset to be used for fee payment"

        === "Parameters"

            - `dest` - the multilocation of a chain in the ecosystem where the XCM message is being sent to (the target chain). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
            - `feeLocationAddress` - the [XC-20 address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank} of the asset to use for fee payment
            - `transactRequiredWeightAtMost` - the weight to buy in the destination chain for the execution of the call defined in the `Transact` instruction
            - `call` - the call to be executed in the destination chain, as defined in the `Transact` instruction 
            - `feeAmount` - the amount to be used as a fee
            - `overallWeight` - the total weight the extrinsic can use to execute all the XCM instructions, plus the weight of the `Transact` call (`transactRequiredWeightAtMost`). The weight must be formatted in a particular way, which is described in the [Building the Precompile Weight](#determining-weight) section
            - `refund` -  a boolean indicating whether or not to add the `RefundSurplus` and `DepositAsset` instructions to the XCM message to refund any leftover fees 

## XCM Instructions for Remote Execution {: #xcm-instructions-for-remote-execution }

The relevant [XCM instructions](/builders/interoperability/xcm/core-concepts/instructions/){target=_blank} to perform remote execution through XCM are, but are not limited to:

 - [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions#descend-origin){target=_blank} - gets executed in the target chain. It mutates the origin on the target chain to match the origin on the source chain, ensuring execution on the target chain occurs on behalf of the same entity initiating the XCM message on the source chain
 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions#withdraw-asset){target=_blank} - gets executed in the target chain. Removes assets and places them into a holding register
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions#buy-execution){target=_blank} - gets executed in the target chain. Takes the assets from holding to pay for execution fees. The fees to pay are determined by the target chain
 - [`Transact`](/builders/interoperability/xcm/core-concepts/instructions#transact){target=_blank} - gets executed in the target chain. Dispatches encoded call data from a given origin, allowing for the execution of specific operations or functions

## Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the XCM Transactor Precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into the XCM Transactor Precompile functions:

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/multilocations.js'
```

## Transact through a Computed Origin Account {: #xcmtransactor-transact-through-signed }

This section covers building an XCM message for remote execution using the XCM Transactor Pallet, specifically with the `transactThroughSigned` function. This function uses a [Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank} account on the destination chain to dispatch the remote call.

The example in this section uses a destination parachain that is not publicly available, so you won't be able to follow along exactly. You can modify the example as needed for your own use case.

!!! note
    You need to ensure that the call you are going to execute remotely is allowed in the destination chain!

### Checking Prerequisites {: #xcmtransactor-signed-check-prerequisites }

To be able to send the extrinsics in this section, you need to have:

- An account in the origin chain with [funds](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
- Funds in the Computed Origin account on the target chain. To learn how to calculate the address of the Computed Origin account, please refer to the [How to Calculate the Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins){target=_blank} documentation

For this example, the following accounts will be used:

- Alice's account in the origin parachain (Moonbase Alpha): `0x44236223aB4291b93EEd10E4B511B37a398DEE55`
- Her Computed Origin address in the target parachain (Parachain 888): `0x5c27c4bb7047083420eddff9cddac4a0a120b45c`

### Building the XCM {: #xcm-transact-through-signed }

For this example, you'll interact with the `transactThroughSigned` function of the XCM Transactor Precompile V2. To use this function, you'll take these general steps:

1. Create a provider using a Moonbase Alpha RPC endpoint
2. Create a signer to send the transaction. This example uses a private key to create the signer and is for demo purposes only. **Never store your private key in a JavaScript file**
3. Create a contract instance of the XCM Transactor V2 Precompile using the address and ABI of the precompile
4. Assemble the arguments for the `transactThroughSigned` function:

    - `dest` - the multilocation of the destination, which is parachain 888:

        ```js
        const dest = [
          1, // parents = 1
          [  // interior = X1 (the array has a length of 1)
            '0x0000000378', // Parachain selector + Parachain ID 888
          ],
        ];
        ```

    - `feeLocationAddress` - the address of the XC-20 to use for fees, which is parachain 888's native asset:

        ```js
         const feeLocationAddress = '0xFFFFFFFF1AB2B146C526D4154905FF12E6E57675';
        ```

    - `transactRequiredWeightAtMost` - the weight required to execute the call in the `Transact` instruction. You can get this information by using the [`paymentInfo` method of the Polkadot.js API](/builders/build/substrate-api/polkadot-js-api#fees){target=_blank} on the call

        ```js
        const transactRequiredWeightAtMost = 1000000000n;
        ```

    - `call` - the encoded call data of the pallet, method, and input to be called. It can be constructed in [Polkadot.js Apps](https://polkadot.js.org/apps/){target=_blank} (which must be connected to the destination chain) or using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}. For this example, the inner call is a simple balance transfer of 1 token of the destination chain to Alice's account there:

        ```js
        const call =
          '0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d';
        ```

    - `feeAmount` - the amount to use for fees

        ```js
        const feeAmount = 50000000000000000n;
        ```

    - `overallWeight` - the weight specific to the inner call (`transactRequiredWeightAtMost`) plus the weight needed to cover the execution costs for the XCM instructions in the destination chain: `DescendOrigin`, `WithdrawAsset`, `BuyExecution`, and `Transact`. It's important to note that each chain defines its own weight requirements. To determine the weight required for each XCM instruction on a given chain, please refer to the chain's documentation or reach out to a member of their team

        ```js
        const overallWeight = 2000000000n;
        ```

5. Create the `transactThroughSigned` function, passing in the arguments
6. Sign and send the transaction

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-through-signed/web3.py'
    ```

### XCM Transact through Computed Origin Fees {: #transact-through-computed-origin-fees }

When [transacting through the Computed Origin account](#xcmtransactor-transact-through-signed){target=_blank}, the transaction fees are paid by the same account from which the call is dispatched, which is a Computed Origin account in the destination chain. Consequently, the Computed Origin account must hold the necessary funds to pay for the entire execution. Note that the destination token, for which fees are paid, does not need to be register as an XC-20 in the origin chain.

To estimate the amount of token Alice's Computed Origin account will need to have to execute the remote call, you need to check the transact information specific to the destination chain. You can use the following script to get the transact information for parachain 888:

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/transact-info-with-signed.js'
```

From the response, you can see that the `transactExtraWeightSigned` is `{{ networks.moonbase_beta.xcm_message.transact.weight.display }}`. This is the weight needed to execute the four XCM instructions for this remote call in that specific destination chain. Next, you need to find out how much the destination chain charges per weight of XCM execution. Normally, you would look into the units per second for that particular chain. But in this scenario, no XC-20 tokens are burned. Therefore, units per second can be used for reference, but it does not ensure that the estimated number of tokens is correct. To get the units per second as a reference value, you can use the following script:

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-precompile/fee-per-second.js'
```

Note that the units per second is related to the cost estimated in the [Relay Chain XCM Fee Calculation](/builders/interoperability/xcm/core-concepts/weights-fees/#polkadot){target=_blank} section or to the one shown in the [Units per weight](/builders/interoperability/xcm/core-concepts/weights-fees/#moonbeam-reserve-assets){target=_blank} section if the target is another parachain. You'll need to find the correct value to ensure that the amount of tokens the Computed Origin account holds is correct. Calculating the associated XCM execution fee is as simple as multiplying the `transactExtraWeightSigned` times the `unitsPerSecond` (for an estimation):

```text
XCM-Wei-Token-Cost = transactExtraWeightSigned * unitsPerSecond
XCM-Token-Cost = XCM-Wei-Token-Cost / DecimalConversion
```

Therefore, the actual calculation for one XCM Transactor transact through derivative call is:

```text
XCM-Wei-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.weight.numbers_only }} * {{ networks.moonbase.xcm.units_per_second.xcbetadev.transact_numbers_only }}
XCM-Token-Cost = {{ networks.moonbase_beta.xcm_message.transact.wei_betadev_cost }} / 10^18
```

The cost of transacting through a Computed Origin is `{{ networks.moonbase_beta.xcm_message.transact.betadev_cost }} TOKEN`. **Note that this does not include the cost of the call being remotely executed, only XCM execution fees.**
