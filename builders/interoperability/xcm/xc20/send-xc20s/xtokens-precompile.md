---
title: Send XC-20s to Other Chains
description: Learn how to send assets cross-chain via Cross-Consensus Messaging (XCM) using the X-Tokens Precompile with familiar Ethereum libraries like Ethers and Web3.
---

# Using the X-Tokens Precompile To Send XC-20s

## Introduction {: #introduction }

Building an XCM message for fungible asset transfers is not an easy task. Consequently, there are wrapper functions and pallets that developers can leverage to use XCM features on Polkadot and Kusama. One example of such wrappers is the [X-Tokens](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet){target=\_blank} Pallet, which provides different methods to transfer fungible assets via XCM.

The X-Tokens Pallet is coded in Rust and is normally not accessible from the Ethereum API side of Moonbeam. However, the X-Tokens Precompile allows you to interact directly with the Substrate pallet to send XC-20s from a Solidity interface.

This guide will show you how to leverage the X-Tokens Precompile to send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=\_blank} from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains) using Ethereum libraries like Ethers and Web3.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## X-Tokens Precompile Contract Address {: #contract-address }

The X-Tokens Precompile is located at the following addresses:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.xtokens}}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.xtokens}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.xtokens}}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## The X-Tokens Solidity Interface {: #xtokens-solidity-interface }

[Xtokens.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=\_blank} is an interface through which developers can interact with the X-Tokens Pallet using the Ethereum API.

??? code "Xtokens.sol"

    ```solidity
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/Xtokens.sol'
    ```

The interface includes the following functions:

???+ function "**transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — transfer a currency, given the contract address of the currency"

    === "Parameters"

        - `currencyAddress` - the address of the asset to transfer
            - For [External XC-20s](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank}, provide the [XC-20 precompile address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=\_blank}
            - For native tokens (i.e., GLMR, MOVR, and DEV), provide the [ERC-20 precompile](/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface){target=\_blank} address, which is `{{networks.moonbeam.precompiles.erc20 }}`
            - For [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}, provide the token's address
        - `amount` - the number of tokens that are going to be sent via XCM
        - `destination` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20- or 32-byte addresses (Ethereum or Substrate). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `weight` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset

??? function "**transferWithFee**(currencyAddress, amount, fee, destination, weight) — transfer a currency, defined as either the native token (self-reserved) or the asset ID, and specify the fee separately from the amount"

    === "Parameters"

        - `currencyAddress` - the address of the asset to transfer
            - For [External XC-20s](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=\_blank}, provide the [XC-20 precompile address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=\_blank}
            - For native tokens (i.e., GLMR, MOVR, and DEV), provide the [ERC-20 precompile](/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface){target=\_blank} address, which is `{{networks.moonbeam.precompiles.erc20 }}`
            - For [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=\_blank}, provide the token's address
        - `amount` - the number of tokens that are going to be sent via XCM
        - `fee` — the amount to be spent to pay for the XCM execution in the target (destination) chain. If this value is not high enough to cover execution costs, the assets will be trapped in the destination chain
        - `destination` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20- or 32-byte addresses (Ethereum or Substrate). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `weight` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset

??? function "**transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — transfer a fungible asset, defined by its multilocation"

    === "Parameters"

        - `asset` - the multilocation of the asset to transfer. The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `amount` - the number of tokens that are going to be sent via XCM
        - `fee` — the amount to be spent to pay for the XCM execution in the target (destination) chain. If this value is not high enough to cover execution costs, the assets will be trapped in the destination chain
        - `destination` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20- or 32-byte addresses (Ethereum or Substrate). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `weight` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset

??? function "**transferMultiassetWithFee**(asset, fee, destination, weight) — transfer a fungible asset, defined by its multilocation, and pay the fee with a different asset, also defined by its multilocation"

    === "Parameters"

        - `asset` - the multilocation of the asset to transfer. The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `amount` - the number of tokens that are going to be sent via XCM
        - `fee` — the amount to be spent to pay for the XCM execution in the target (destination) chain. If this value is not high enough to cover execution costs, the assets will be trapped in the destination chain
        - `destination` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20- or 32-byte addresses (Ethereum or Substrate). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `weight` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset

??? function "**transferMulticurrencies**(currencies, feeItem, destination, weight) — transfer different currencies, specifying which is used as the fee. Each currency is defined as either the native token (self-reserved) or the asset ID"

    === "Parameters"

        - `currencies` - an array of the currencies to send, which are identified by their currency address, and the amount to send
        - `feeItem` — an index to define the asset position of an array of assets being sent, used to pay for the XCM execution in the target chain. For example, if only one asset is being sent, the `feeItem` would be `0`
        - `destination` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20- or 32-byte addresses (Ethereum or Substrate). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `weight` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset

??? function "**transferMultiassets**(assets, feeItem, destination, weight) — transfer several fungible assets, defined by their multilocation, and pay the fee with one of the assets, also defined by its multilocation"

    === "Parameters"

        - `assets` - an array of the multilocations of each asset to transfer. The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `feeItem` — an index to define the asset position of an array of assets being sent, used to pay for the XCM execution in the target chain. For example, if only one asset is being sent, the `feeItem` would be `0`
        - `destination` - the multilocation of the destination address for the tokens being sent via XCM. It supports different address formats, such as 20- or 32-byte addresses (Ethereum or Substrate). The multilocation must be formatted in a particular way, which is described in the [Building the Precompile Multilocation](#building-the-precompile-multilocation) section
        - `weight` - the weight to be purchased to pay for XCM execution on the destination chain, which is charged from the transferred asset

## Building the Precompile Multilocation {: #building-the-precompile-multilocation }

[Multilocations](/builders/interoperability/xcm/core-concepts/multilocations){target=\_blank} define a specific point in the entire relay chain/parachain ecosystem relative to a given origin. They are frequently used by the X-Tokens Precompile to define the location of assets and destination chains and accounts.

Multilocations need to be formatted in a specific way that precompiles can understand, which is different than the format seen when interacting with pallets. In the X-Tokens Precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/builders/interoperability/xcm/xcm-precompile-multilocation.md'

The following code snippet goes through some examples of multilocation structures, as they would need to be fed into the X-Tokens Precompile functions:

```js
--8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/multilocations.js'
```

## Building an XCM Message {: #build-xcm-xtokens-precompile }

This guide covers the process of building an XCM message using the X-Tokens Precompile, more specifically, with the `transfer` and `transferMultiasset` functions. Nevertheless, these two cases can be extrapolated to the other functions of the precompile, especially once you become familiar with multilocations.

You'll be transferring xcUNIT tokens, which are the [XC-20](/builders/interoperability/xcm/xc20/overview){target=\_blank} representation of the Alphanet relay chain token, UNIT. You can adapt this guide for any other XC-20.

### Checking Prerequisites {: #xtokens-check-prerequisites}

To follow along with the examples in this guide, you need to have the following:

- The ABI of the X-Tokens Precompile

    ??? code "X-Tokens Precompile ABI"

        ```js
        --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/abi.js'
        ```

- An account with funds.
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- Some xcUNIT tokens. You can swap DEV tokens (Moonbase Alpha's native token) for xcUNITs on [Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}, a demo Uniswap-V2 clone on Moonbase Alpha

    !!! note
        You can adapt this guide to transfer another [external XC-20 or a local XC-20](/builders/interoperability/xcm/xc20/overview){target=\_blank}. For external XC-20s, you'll need the asset ID and the number of decimals the asset has. For local XC-20s, you'll need the contract address.

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/xtokens-1.webp)

    To check your xcUNIT balance, you can add the XC-20's [precompile address](/builders/interoperability/xcm/xc20/interact/#calculate-xc20-address){target=\_blank} to MetaMask with the following address:

    ```text
    0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
    ```

!!! note
    To test out the examples on Moonbeam or Moonriver, you can replace the RPC URL with your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}.

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

### X-Tokens Precompile Transfer Function {: #precompile-transfer }

To use the `transfer` function of the X-Tokens Precompile, you'll take these general steps:

1. Create a provider using a Moonbase Alpha RPC endpoint
2. Create a signer to send the transaction. This example uses a private key to create the signer and is for demo purposes only. **Never store your private key in a JavaScript file**
3. Create a contract instance of the X-Tokens Precompile using the address and ABI of the precompile
4. Assemble the arguments for the `transfer` function:

    - `currencyAddress` - the address for xcUNIT: `0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080`
    - `amount` - 1 xcUNIT. Since xcUNIT has 12 decimals, you can use: `1000000000000`
    - `destination` - the multilocation of the destination, which targets Alice's account on the relay chain: `'0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'`
    - `weight` - the [weight](#determining-weight) to purchase for the XCM execution on the destination chain: `{{ networks.alphanet.xcm_message.transfer.weight.display }}`

5. Create the `transfer` function, passing in the arguments
6. Sign and send the transaction

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer/web3.py'
    ```

### X-Tokens Precompile Transfer Multiasset Function {: #precompile-transfer-multiasset}

To use the `transfer` function of the X-Tokens Precompile, you'll take these general steps:

1. Create a provider using a Moonbase Alpha RPC endpoint
2. Create a signer to send the transaction. This example uses a private key to create the signer and is for demo purposes only. **Never store your private key in a JavaScript file**
3. Create a contract instance of the X-Tokens Precompile using the address and ABI of the precompile
4. Assemble the arguments for the `transferMultiasset` function:

    - `asset` - the multilocation for xcUNIT: `[1, []]`
    - `amount` - 1 xcUNIT. Since xcUNIT has 12 decimals, you can use: `1000000000000`
    - `destination` - the multilocation of the destination, which targets Alice's account on the relay chain: `'0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300'`
    - `weight` - the [weight](#determining-weight) to purchase for the XCM execution on the destination chain: `{{ networks.alphanet.xcm_message.transfer.weight.numbers_only }}`

5. Create the `transferMultiasset` function, passing in the arguments
6. Sign and send the transaction

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/transfer-multiasset/web3.py'
    ```
