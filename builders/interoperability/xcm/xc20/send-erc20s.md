---
title: Send ERC-20s Cross-Chain via XCM
description: Learn how to send any ERC-20 to another chain via XCM.
---

# Send ERC-20s Cross Chain via XCM

![X-Tokens Precompile Contracts Banner](/images/builders/interoperability/xcm/xc20/send-erc20s/send-erc20s-banner.png)

## Introduction {: #introduction } 

You can send any ERC-20 directly through XCM from Moonbeam to any other chains in the ecosystem (relay chain or parachains) as long as the ERC-20 is registered as an XCM asset on that chain.

This is made possible via the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/#X-Tokens-pallet-interface){target=_blank} on Moonbeam, which provides different methods to transfer fungible assets and is the same pallet used to [send external XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} and native assets cross-chain.

This guide will show you how to leverage the X-Tokens Pallet to build an XCM message to transfer an ERC-20 to another chain. Moreover, you'll also learn how to use the X-Tokens Precompile to perform the same actions via the Ethereum API. For more information, you can refer to the documentation on the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/#x-tokens-pallet-interface){target=_blank} and [X-Tokens Precompile](/builders/interoperability/xcm/xc20/xtokens/#xtokens-precompile){target=_blank}.

**Please note that this feature is currently only available for testing purposes on Moonbase Alpha**, it is not yet available on Moonbeam or Moonriver.

## Relevant XCM Definitions {: #relevant-definitions }

This guide assumes you have a basic understanding of XCM. If not, please take time to review the [XCM Overview](/builders/interoperability/xcm/overview){target=_blank} page.

For this guide specifically, you'll need to have an understanding of the following definitions:

--8<-- 'text/xcm/general-xcm-definitions2.md'

## Use the X-Tokens Pallet to Send an ERC-20 {: #x-tokens-pallet }

To build an XCM message, you'll use the [`transfer` function of the X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/#extrinsics){target=_blank}, which enables you to transfer fungible assets from Moonbeam to another chain. This example can be extrapolated to the other functions in the pallet, especially once familiar with multilocations.

The `transfer` function accepts the following parameters:

- `currencyId` - the ID of the currency being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, the following currency options exist:

    - `SelfReserve` - refers to the native token
    - `ForeignAsset` - refers to the asset ID of an [External XC-20](/builders/interoperability/xcm/xc20/xc20){target=_blank} (not to be confused with the XC-20 address)
    - `LocalAssetReserve` - refers to the asset ID of a [Mintable XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank} (not to be confused with the XC-20 address)
    - `Erc20` - refers to the contract address of an [ERC-20](/builders/interoperability/xcm/xc20/send-erc20s-xcm){target=_blank}

    You'll be using `Erc20` as the `currencyId` for this guide and supplying the H160 Ethereum-style address of the ERC-20 contract

- `amount` - the number of tokens that are going to be sent via XCM. Accepts a *uint128*
- `dest` -  a multilocation to define the destination address for the tokens being sent via XCM. It supports different address formats such as 20 or 32 bytes addresses (Ethereum or Substrate)
- `destWeight` - an enum that represents the maximum amount of execution time you want to provide in the destination chain to execute the XCM message being sent. The enum contains the following options:

    - `Unlimited` - allows for all of the asset used for gas included to be used to pay for weight
    - `Limited` - limits the amount used for gas to a particular value
    
    If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the Sovereign account or a special pallet. **It is important to correctly set the destination weight to avoid failed XCM executions**

Now that you have a basic understanding of the transfer function and the parameters it accepts, you can build and send the XCM message.

### Checking Prerequisites {: #checking-prerequisites }

To be able to send the extrinsics in Polkadot.js Apps, you need to have the following:

- An [account loaded in Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} funded with [DEV tokens](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}. Your account should also hold the ERC-20 tokens you want to send
- The contract address of the ERC-20 token
- A recipient address on the target chain where you'll be sending the ERC-20 to

### Use Polkadot.js Apps to Send an ERC-20 Cross-Chain {: #use-polkadotjs-apps }

This section of the guide will show you how to build an XCM message using Polkadot.js Apps.

To get started, you can head to the extrinsics page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and set the following options:

1. Select the account from which you want to send the XCM
2. Choose the **xTokens** pallet and the **transfer** extrinsic
3. Set the currency ID to **Erc20**
4. Enter the H160 contract address of the ERC-20 
5. Set the number of tokens to send in Wei. This examples uses 1 token, so you can enter the value in Wei, which is `1000000000000000000`
6. Define the XCM destination multilocation. You'll need to target an account in another parachain or the relay chain. The asset must be registered on the target chain otherwise this call will result in a loss of the ERC-20 tokens. This example targets the relay chain with Moonbase Alpha as the origin chain. Therefore, set the following parameters:

    | Parameter |     Value      |
    |:---------:|:--------------:|
    |  Version  |       V1       |
    |  Parents  |       1        |
    | Interior  |       X1       |
    |    X1     |  AccountId32   |
    |  Network  |      Any       |
    |    Id     | Target Account |

7. Set the destination weight as `Limited`, and its value to `1000000000`. Note that on Moonbase Alpha, each XCM instruction costs around `100000000` weight units. A `transfer` consists of 4 XCM instructions, so a destination weight of `400000000` should be enough
8. Click the **Submit Transaction** button and sign the transaction

![XCM X-Tokens Transfer Extrinsic](/images/builders/interoperability/xcm/xc20/send-erc20s/send-erc20s-1.png)

!!! note
    The encoded call data for the extrinsic configured above is `0x1e000325ed7e99cf496a8c6d29f5cce425b825af67a1f0000064a7b3b6e00d000000000000000001010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d670102105e5f`. It also includes a specific ERC-20 contract address and recipient that you'll need to change.

## Use the X-Tokens Precompile to Send an ERC-20 {: #x-tokens-precompile }

To build an XCM message with the X-Tokens Precompile, you'll use the [`transfer` function](/builders/interoperability/xcm/xc20/xtokens/#xtokens-solidity-interface){target=_blank}, which enables you to call the `transfer` function of the X-Tokens Pallet through a Solidity interface, [`Xtokens.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}.

The X-Tokens precompile address on Moonbase Alpha is located at `{{ networks.moonbase.precompiles.xtokens }}`.

The `transfer` function of the precompile is similar to that of the pallet, where it accepts the following parameters:

- `currencyAddress` - the ERC-20 address of the currency to transfer. Accepts an *address*
- `amount` - the amount of tokens to transfer in Wei. Accepts a *uint256*
- `destination` - a multilocation to define the destination address for the tokens being sent via XCM. It supports different address formats such as 20 or 32 bytes addresses (Ethereum or Substrate). Accepts a [*Multilocation*](#building-the-precompile-multilocation)

- `weight` - the weight to buy in the destination chain. Accepts a *uint64*

### Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the X-Tokens Precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

--8<-- 'text/xc-20/xtokens/multilocation-structures.md'

### Use Ethereum Libraries to Send an ERC-20 {: #using-libraries-to-interact-with-xtokens}

Now that you have an understanding of how to build the multilocation, you can use an Ethereum library to call the `transfer` function of the X-Tokens Precompile and pass in the necessary parameters to send an ERC-20 cross-chain. 

For this example, you'll need to import the ABI of the X-Tokens Precompile. You can find the [X-Tokens ABI on Github](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/xtokens/abi.js){target=_blank}.

!!! remember
    The following snippets are for demonstration purposes only. Never store your private key or mnemonic in a JavaScript or TypeScript file. 

=== "Ethers.js"
    ```js
    --8<-- 'code/xtokens/send-erc20s/ethers.js'
    ```

=== "Web3.js"
    ```js
    --8<-- 'code/xtokens/send-erc20s/web3.js'
    ```

=== "Web3.py"
    ```py
    --8<-- 'code/xtokens/send-erc20s/web3.py'
    ```

