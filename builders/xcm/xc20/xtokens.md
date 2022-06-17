---
title: Send XC-20s to Other Chains
description: Learn how to send XC-20s to other chains using the X-Tokens pallet. The X-Tokens precompile allows you to access core functions via the Ethereum API.
---

# Using the X-Tokens Pallet To Send XC-20s

![X-Tokens Precompile Contracts Banner](/images/builders/xcm/xc20/xtokens/xtokens-banner.png)

## Introduction {: #introduction } 

Building an XCM message for fungible asset transfers is not an easy task. Consequently, there are wrapper functions/pallets that developers can leverage to use XCM features on Polkadot/Kusama.

One example of such wrappers is the [X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} pallet, which provides different methods to transfer fungible assets via XCM.

This guide will show you how to leverage the X-Tokens pallet to send XC-20s from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains). Moreover, you'll also learn how to use the X-Tokens precompile to perform the same actions via the Ethereum API.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions {: #relevant-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions.md'
--8<-- 'text/xcm/general-xcm-definitions2.md'

## X-Tokens Pallet Interface {: #x-tokens-pallet-interface}

The X-Tokens pallet provides the following extrinsics (functions):

 - **transfer(currencyId, amount, dest, destWeight)** — transfer a currency, defined as either the native token (self reserved), or with the asset ID
 - **transferMultiasset(asset, dest, destWeight)** — transfer a fungible asset, defined by its multilocation
 - **transferMultiassetWithFee(asset, fee, dest, destWeight)** — transfer a fungible asset, but it allows the sender to pay the fee with a different asset. Both are defined by their multilocation
 - **transferMultiassets(assets, feeItem, dest, destWeight)** — transfer several fungible assets, specifying which is used as the fee. Each asset is defined by its multilocation
 - **transferMulticurrencies(currencies, feeItem, dest, destWeight)** — transfer different curriencies, specifying which is used as the fee. Each currency is defined as either the native token (self reserved) or with the asset ID
 - **transferWithFee(currencyId, amount, fee, dest, destWeight)** — transfer a currency, but it allows the sender to pay the fee with a different asset. Both are defined by their multilocation

Where the inputs that need to be provided can be defined as:

 - **currencyId/currencies** — the ID/IDs of the currency/currencies being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, `SelfReserve` refers to the native token, and `ForeignAsset` refers to the asset ID of the XC-20 (not to be confused with the XC-20 address)
 - **amount** — the number of tokens that are going to be sent via XCM
 - **dest** — a multilocation to define the destination address for the tokens being sent via XCM. It supports different address formats such as 20 or 32 bytes addresses (Ethereum or Substrate)
 - **destWeight** — the maximum amount of execution time you want to provide in the destination chain to execute the XCM message being sent. If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the sovereign account or a special pallet. **It is important to correctly set the destination weight to avoid failed XCM executions**
 - **asset/assets** — a multilocation to define the asset/assets being sent via XCM. Each parachain has a different way to reference assets. For example, Moonbeam-based networks reference their native tokens with the pallet balances index
 - **fee** — a multilocation to define the asset used to pay for the XCM execution in the target chain
 - **feeItem** — an index to define the asset position of an array of assets being sent, used to pay for the XCM execution in the target chain. For example, if only one asset is being sent, the `feeItem` would be `0`

The only read-method that the pallet provides is `palletVersion`, which provides the version of the X-Tokens pallet being used.

## Building an XCM Message with the X-Tokens Pallet {: #build-xcm-xtokens-pallet}

This guide covers the process of building an XCM message using the X-Tokens pallet, more specifically, with the `transfer` and `transferMultiasset` functions. Nevertheless, these two cases can be extrapolated to the other functions, especially once familiar with multilocations.

!!! note
    Each parachain can allow/forbid specific methods from a pallet. Consequently, developers must ensure to use methods that are allowed. On the contrary, the transaction will fail with an error similar to `system.CallFiltered`.

You'll be transfering `xcUNIT` tokens, which is the [XC-20](/builders/xcm/xc20/overview){target=_blank} representation of the Alphanet relay chain token `UNIT`. An `xcUNIT` is an [external XC-20](/builders/xcm/xc20/xc20){target=_blank}. You can adapt this guide for another external XC-20 or a [mintable XC-20](/builders/xcm/xc20/mintable-xc20){target=_blank}.

### Checking Prerequisites {: #xtokens-check-prerequisites}

To be able to send the extrinsics in Polkadot.js Apps, you need to have the following:

- An [account loaded in Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} funded with [DEV tokens](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}
- The asset ID of the asset you're transferring
    - For external XC-20s, you can get the [list of asset IDs from Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/assets){target=_blank}
    - For mintable XC-20s, please refer to the [Retrieve List of Mintable XC-20s](/builders/xcm/xc20/mintable-xc20/#retrieve-list-of-mintable-xc-20s){target=_blank} section of the Mintable XC-20s page
- The number of decimals the asset you're transferring has
    - For external XC-20s, please refer to the [Retrieve Metadata for External XC-20s](/builders/xcm/xc20/xc20/#x-chain-assets-metadata){target=_blank} section of the External XC-20 page
    - For mintable XC-20s, please refer to the [Retrieve Metadata for Mintable XC-20s](/builders/xcm/xc20/mintable-xc20/#retrieve-metadata-for-mintable-xc-20s){target=_blank} section of the Mintable XC-20s page
- Some `xcUNIT` tokens. You can swap `DEV` tokens (Moonbase Alpha's native token) for `xcUNIT`s on [Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}, a demo Uniswap-V2 clone on Moonbase Alpha

![Moonbeam Swap xcUNITs](/images/builders/xcm/xc20/xtokens/xtokens-1.png)

To check your `xcUNIT` balance, you can add the XC-20 to MetaMask with the following address:

```
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

If you're interested in how the precompile address is calculated, you can check out the following guides:

- [Calculate External XC-20 Precompile Addresses](/builders/xcm/xc20/xc20/#calculate-xc20-address){target=_blank}
- [Calculate Mintable XC-20 Precompile Addresses](/builders/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}

### X-Tokens Transfer Function {: #xtokens-transfer-function}

In this example, you'll build an XCM message to transfer `xcUNIT` from Moonbase Alpha back to its [relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} through the `transfer` function of the X-Tokens pallet.

Head to the extrinsic page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and set the following options (you can adapt for [mintable XC-20s](/builders/xcm/xc20/mintable-xc20/){target=_blank}):

1. Select the account from which you want to send the XCM
2. Choose the **xTokens** pallet
3. Choose the **transfer** extrinsic
4. Set the currency ID to **ForeignAsset** for external XC-20s or **LocalAssetReserve** for mintable XC-20s. Since `xcUNIT` is an external XC-20, you can choose **ForeignAsset**
5. Enter the asset ID. For this example, `xcUNIT` has an asset id of `42259045809535163221576417993425387648`
6. Set the number of tokens to send. For this example, you are sending 1 `xcUNIT`, but you have to account for the 12 decimals of `xcUNIT`
7. To define the XCM destination multilocation, you have to target an account in the relay chain from Moonbase Alpha as the origin. Therefore, set the following parameters:

    | Parameter |     Value      |
    |:---------:|:--------------:|
    |  Version  |       V1       |
    |  Parents  |       1        |
    | Interior  |       X1       |
    |    X1     |  AccountId32   |
    |  Network  |      Any       |
    |    Id     | Target Account |

8. Set the destination weight to `1000000000`. Note that on Moonbase Alpha, each XCM instruction costs around `100000000` weight units. A `transfer` consists of 4 XCM instructions, so a destination weight of `400000000` should be enough
9. Click the **Submit Transaction** button and sign the transaction

!!! note
    The encoded call data for the extrinsict configured above is `0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000101010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300ca9a3b00000000`. It also includes a specific recipient that you'll need to change.

![XCM X-Tokens Transfer Extrinsic](/images/builders/xcm/xc20/xtokens/xtokens-2.png)


Once the transaction is processed, the **TargetAccount** should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain. On Polkadot.js Apps, can check the relevant extrinsics and events in [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0xf163f304b939bc10b6d6abcd9fd12ea00b6f6cd3f12bb2a32b759b56d2f1a40d){target=_blank} and the [relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x5b997e806303302007c6829ab8e5b166a8aafc6a68f10950cc5aa8c6981ea605){target=_blank}. 

### X-Tokens Transfer MultiAsset Function {: #xtokens-transfer-multiasset-function}

In this example, you'll build an XCM message to transfer `xcUNIT` from Moonbase Alpha back to its [relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} using the `transferMultiasset` function of the X-Tokens pallet.

Head to the extrinsic page of [Polkadot JS Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and set the following options:

1. Select the account from which you want to send the XCM
2. Choose the **xTokens** pallet
3. Choose the **transferMultiasset** extrinsic
4. To define the XCM asset multilocation, you have to target `UNIT` in the relay chain from Moonbase Alpha as the origin. Each chain sees its own asset differently. Therefore, you will have to set a different asset multilocation for each destination. For this example, the relay chain token can be defined as:

    | Parameter | Value |
    |:---------:|:-----:|
    |  Version  |  V1   |
    |  Parents  |   1   |
    | Interior  | Here  |

    If you're adapting this guide for a mintable XC-20, you have to to specify the pallet where the asset was created and the asset ID. Therefore, you would set the following parameters:

    |   Parameter    |  Value   |
    |:--------------:|:--------:|
    |    Version     |    V1    |
    |    Parents     |    1     |
    |    Interior    |    X2    |
    | PalletInstance |    36    |
    |  GeneralIndex  | Asset ID |

5. Set the asset type as **Fungible**
6. Set the number of tokens to send. For this example, you are sending 1 `xcUNIT`, but you have to account for the 12 decimals
7. To define the XCM destination multilocation, you have to target an account in the relay chain from Moonbase Alpha as the origin. Therefore, set the following parameters:

    | Parameter |     Value      |
    |:---------:|:--------------:|
    |  Version  |       V1       |
    |  Parents  |       1        |
    | Interior  |       X1       |
    |    X1     |  AccountId32   |
    |  Network  |      Any       |
    |    Id     | Target Account |

8. Set the destination weight to `1000000000`. Note that on Moonbase Alpha, each XCM instruction costs around `100000000` weight units. A `transferMultiasset` consists of 4 XCM instructions, so a destination weight of `400000000` should be enough
9. Click the **Submit Transaction** button and sign the transaction

!!! note
    The encoded call data for the extrinsict configured above is `0x1e010100010000070010a5d4e80101010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300ca9a3b00000000`. It also includes a specific recipient that you'll need to change.

![XCM X-Tokens Transfer Extrinsic](/images/builders/xcm/xc20/xtokens/xtokens-3.png)

Once the transaction is processed, the **TargetAccount** should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain. On Polkadot.js Apps, you can check the relevant extrinsics and events in [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x7711a9bb672782acf6702ebb235cdcbd982d536835e6d00fb07ba716eb1ec982){target=_blank} and the [relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x03d402f171aa4ab52d6c72d693fb6e76399b88fd44587f748aa685e9b53727ea){target=_blank}.

## X-Tokens Precompile {: #xtokens-precompile}

The X-Tokens precompile contract allows developers to access XCM token transfer features through the Ethereum API of Moonbeam-based networks. As with other [precompile contracts](/builders/build/canonical-contracts/precompiles/){target=_blank}, the X-Tokens precompile is located at the following addresses:

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.xtokens}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.xtokens}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xtokens}}
     ```

### The X-Tokens Solidity Interface {: #xtokens-solidity-interface } 

[Xtokens.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank} is an interface through which developers can interact with the X-Tokens pallet using the Ethereum API.

The interface includes the following functions:

 - **transfer**(*address* currency_address, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — function that represents the `transfer` method described in the [previous example](/builders/xcm/xc20/xtokens/#xtokens-transfers-function). Instead of using the currency ID, you'll need to provide the assets precompile address for the `currency_address`:
    - For [external XC-20s](/builders/xcm/xc20/xc20){target=_blank}, provide the [XC-20 precompile address](/builders/xcm/xc20/xc20/#current-xc20-assets){target=_blank}
    - For [mintable XC-20s](/builders/xcm/xc20/mintable-xc20){target=_blank}, you can follow the instructions for [calculating the precompile address](/builders/xcm/xc20/mintable-xc20/#calculate-xc20-address){target=_blank}
    - For native tokens (i.e., GLMR, MOVR, and DEV), provide the [ERC-20 precompile](/builders/build/canonical-contracts/precompiles/erc20/#the-erc20-interface){target=_blank} address, which is `{{networks.moonbeam.precompiles.erc20 }}`

    The `destination` multilocation is built in a particular way that is described in the following section   
    
 - **transfer_multiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — function that represents the `transferMultiasset` method described in the [previous example](/builders/xcm/xc20/xtokens/#xtokens-transfer-multiasset-function). Both multilocations are built in a particular way that is described in the following section

### Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the X-Tokens precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into the X-Tokens precompile functions:


```js
// Multilocation targeting the relay chain or its asset from a parachain
{
    1, // parents = 1
    [] // interior = here
}

// Multilocation targeting Moonbase Alpha DEV token from another parachain
{
    1, // parents = 1
    // Size of array is 2, meaning is an X2 interior
    [
        "0x00000003E8", // Selector Parachain, ID = 1000 (Moonbase Alpha)
        "0x0403" // Pallet Instance = 3
    ]
}

// Multilocation targeting Alice's account on the Relay Chain from Moonbase Alpha
{
    1, // parents = 0
    // Size of array is 1, meaning is an X1 interior
    [
        "0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300" 
        // AccountKey32 Selector + Address in hex + Network = Any
    ]
}
```