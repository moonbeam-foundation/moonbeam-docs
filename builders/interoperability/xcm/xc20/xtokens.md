---
title: Send XC-20s to Other Chains
description: Learn how to send XC-20s to other chains using the X-Tokens Pallet. The X-Tokens Precompile allows you to access core functions via the Ethereum API.
---

# Using the X-Tokens Pallet To Send XC-20s

## Introduction {: #introduction }

Building an XCM message for fungible asset transfers is not an easy task. Consequently, there are wrapper functions and pallets that developers can leverage to use XCM features on Polkadot and Kusama.

One example of such wrappers is the [X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens){target=_blank} Pallet, which provides different methods to transfer fungible assets via XCM.

This guide will show you how to leverage the X-Tokens Pallet to send [XC-20s](/builders/interoperability/xcm/xc20/overview/){target=_blank} from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains). Moreover, you'll also learn how to use the X-Tokens Precompile to perform the same actions via the Ethereum API.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions {: #relevant-definitions }

This guide assumes you have a basic understanding of XCM. If not, please take time to review the [XCM Overview](/builders/interoperability/xcm/overview){target=_blank} page.

For this guide specifically, you'll need to have an understanding of the following definitions:

--8<-- 'text/xcm/general-xcm-definitions2.md'

## X-Tokens Pallet Interface {: #x-tokens-pallet-interface }

### Extrinsics {: #extrinsics }

The X-Tokens Pallet provides the following extrinsics (functions):

 - **transfer**(currencyId, amount, dest, destWeightLimit) — transfer a currency, defined as either the native token (self reserved), or with the asset ID
 - **transferMultiasset**(asset, dest, destWeightLimit) — transfer a fungible asset, defined by its multilocation
 - **transferMultiassetWithFee**(asset, fee, dest, destWeightLimit) — transfer a fungible asset, but it allows the sender to pay the fee with a different asset. Both are defined by their multilocation
 - **transferMultiassets**(assets, feeItem, dest, destWeightLimit) — transfer several fungible assets, specifying which is used as the fee. Each asset is defined by its multilocation
 - **transferMulticurrencies**(currencies, feeItem, dest, destWeightLimit) — transfer different currencies, specifying which is used as the fee. Each currency is defined as either the native token (self reserved) or with the asset ID
 - **transferWithFee**(currencyId, amount, fee, dest, destWeightLimit) — transfer a currency, but it allows the sender to pay the fee with a different asset. Both are defined by their multilocation

Where the inputs that need to be provided can be defined as:

 - **currencyId/currencies** — the ID/IDs of the currency/currencies being sent via XCM. Different runtimes have different ways to define the IDs. In the case of Moonbeam-based networks, a currency can be defined as one of the following:

    - `SelfReserve` - refers to the native token
    - `ForeignAsset` - refers to the asset ID of an [External XC-20](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank} (not to be confused with the XC-20 address)
    - `LocalAssetReserve` - refers to the asset ID of a [Mintable XC-20](/builders/interoperability/xcm/xc20/mintable-xc20){target=_blank} (not to be confused with the XC-20 address). It is recommended to use [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank} instead via the `Erc20` currency type
    - `Erc20` - refers to the contract address of a [Local XC-20 (ERC-20)](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}

 - **amount** — the number of tokens that are going to be sent via XCM
 - **dest** — a multilocation to define the destination address for the tokens being sent via XCM. It supports different address formats, such as 20 or 32-byte addresses (Ethereum or Substrate)
 - **destWeightLimit** — an enum that represents the maximum amount of execution time you want to provide in the destination chain to execute the XCM message being sent. The enum contains the following options:

    - `Unlimited` - allows for the entire amount used for gas to be used to pay for weight
    - `Limited` - limits the amount used for gas to a particular value
    
    If not enough weight is provided, the execution of the XCM will fail, and funds might get locked in either the Sovereign account or a special pallet. **It is important to correctly set the destination weight to avoid failed XCM executions**

 - **asset/assets** — a multilocation to define the asset/assets being sent via XCM. Each parachain has a different way to reference assets. For example, Moonbeam-based networks reference their native tokens with the Balances Pallet index
 - **fee** — a multilocation to define the asset used to pay for the XCM execution in the target chain
 - **feeItem** — an index to define the asset position of an array of assets being sent, used to pay for the XCM execution in the target chain. For example, if only one asset is being sent, the `feeItem` would be `0`

### Storage Methods {: #storage-methods }

The X-Tokens Pallet includes the following read-only storage method:

- **palletVersion**() - provides the version of the X-Tokens Pallet being used

### Pallet Constants {: #constants }

The X-Tokens Pallet includes the following read-only functions to obtain pallet constants:

- **baseXcmWeight**() - returns the base XCM weight required for execution
- **selfLocation**() - returns the multilocation of the chain

## XCM Instructions for Transfers via X-Tokens {: #xcm-instructions }

The XCM instructions used for the X-Tokens Pallet extrinsics are defined in the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank} repository.

Regardless of which transfer extrinsic is used, the instructions are the same for sending the native asset back to its origin chain, such as xcDOT from Moonbeam back to Polkadot, and sending the native asset from the origin chain to a destination chain, such as DOT from Polkadot to Moonbeam.

--8<-- 'text/x-tokens/xcm-instructions.md'

## Building an XCM Message with the X-Tokens Pallet {: #build-xcm-xtokens-pallet}

This guide covers the process of building an XCM message using the X-Tokens Pallet, more specifically, with the `transfer` and `transferMultiasset` functions. Nevertheless, these two cases can be extrapolated to the other functions, especially once you become familiar with multilocations.

!!! note
    Each parachain can allow/forbid specific methods from a pallet. Consequently, developers must ensure that they use methods that are allowed. On the contrary, the transaction will fail with an error similar to `system.CallFiltered`.

You'll be transferring xcUNIT tokens, which are the [XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank} representation of the Alphanet relay chain token, UNIT. You can adapt this guide for any other XC-20.

### Checking Prerequisites {: #xtokens-check-prerequisites}

To follow along with the examples in this guide, you need to have the following:

- An account with funds.
 --8<-- 'text/faucet/faucet-list-item.md'
- Some xcUNIT tokens. You can swap DEV tokens (Moonbase Alpha's native token) for xcUNITs on [Moonbeam-Swap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}, a demo Uniswap-V2 clone on Moonbase Alpha

    ![Moonbeam Swap xcUNIT](/images/builders/interoperability/xcm/xc20/xtokens/xtokens-1.png)

To check your xcUNIT balance, you can add the XC-20 to MetaMask with the following address:

```text
0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080
```

!!! note
    If you're interested in how the precompile address is calculated, you can check out the [Calculate External XC-20 Precompile Addresses](/builders/interoperability/xcm/xc20/overview/#calculate-xc20-address){target=_blank} guide.

You can adapt this guide for another [external XC-20 or a local XC-20](/builders/interoperability/xcm/xc20/overview){target=_blank}. If you're adapting this guide for another external XC-20, you'll need to have the asset ID of the asset you're transferring and the number of decimals the asset has, which you can get by following the [Retrieve List of External XC-20s](/builders/interoperability/xcm/xc20/overview/#list-xchain-assets){target=_blank} guide. If you're adapting this guide for a local XC-20, you'll need to have the contract address of the XC-20.

### X-Tokens Transfer Function {: #xtokens-transfer-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to its relay chain through the `transfer` function of the X-Tokens Pallet. To do this, you can use the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api){target=_blank}.

Since you'll be interacting with the `transfer` function of the X-Tokens Pallet, you can take the following steps to gather the arguments for the `currencyId`, `amount`, `dest`, and `destWeightLimit`:

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

3. Define the multilocation of the destination, which will target an account on the relay chain from Moonbase Alpha. Note that the only asset that the relay chain can receive is its own:

    ```js
    const dest = { 
      V3: { 
        parents: 1, 
        interior: { X1: { AccountId32: { id: relayAccount } } } 
      } 
    };
    ```

    !!! note
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specify a `network` parameter. If you don't specify one, it will default to `None`.

4. Set the `destWeightLimit` to `Unlimited`. In JavaScript, you'll need to set `Unlimited` to `null` (as outlined in the [TypeScript interface for `XcmV3WeightLimit`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L5734){target=_blank}):

    ```js
    const destWeightLimit = { Unlimited: null };
    ```

    !!! note
        If you wanted to limit the destination weight, you could do so by using `Limited`, which requires you to enter values for `refTime` and `proofSize`. Where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used.

        In JavaScript, this translates to:

        ```js
        { Limited: { refTime: 'INSERT_ALLOWED_AMOUNT', proofSize: 'INSERT_ALLOWED_AMOUNT' } };
        ```

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transfer` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 4. Craft the `xTokens.transfer` extrinsic with the `currencyId`, `amount`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/xtokens/transfer.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=_blank} using the following encoded calldata: `0x1e00018080778c30c20fa2ebc0ed18d2cbca1f0010a5d4e800000000000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`.

Once the transaction is processed, the target account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

### X-Tokens Transfer Multiasset Function {: #xtokens-transfer-multiasset-function}

In this example, you'll build an XCM message to transfer xcUNIT from Moonbase Alpha back to its relay chain using the `transferMultiasset` function of the X-Tokens Pallet.

Since you'll be interacting with the `transferMultiasset` function of the X-Tokens Pallet, you can take the following steps to gather the arguments for the `asset`, `dest`, and `destWeightLimit`:

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
        For an `AccountId32`, `AccountIndex64`, or `AccountKey20`, you have the option of specify a `network` parameter. If you don't specify one, it will default to `None`.

3. Set the destination weight limit to `Unlimited`. In JavaScript, you'll need to set `Unlimited` to `null` (as outlined in the [TypeScript interface for `XcmV3WeightLimit`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/typescript-api/src/moonbase/interfaces/augment-api-tx.ts#L5734){target=_blank}):

    ```js
    const destWeightLimit = { Unlimited: null };
    ```

    !!! note
        If you wanted to limit the destination weight, you could do so by using `Limited`, which requires you to enter values for `refTime` and `proofSize`. Where `refTime` is the amount of computational time that can be used for execution and `proofSize` is the amount of storage in bytes that can be used.

        In JavaScript, this translates to:

        ```js
        { Limited: { refTime: 'INSERT_ALLOWED_AMOUNT', proofSize: 'INSERT_ALLOWED_AMOUNT' } };
        ```

Now that you have the values for each of the parameters, you can write the script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transferMultiasset` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 4. Craft the `xTokens.transferMultiasset` extrinsic with the `asset`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/xtokens/transferMultiAsset.js'
```

!!! note
    You can view an example of the above script, which sends 1 xcUNIT to Alice's account on the relay chain, on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300){target=_blank} using the following encoded calldata: `0x1e010300010000070010a5d4e80301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300`

Once the transaction is processed, the account on the relay chain should have received the transferred amount minus a small fee that is deducted to execute the XCM on the destination chain.

#### Override Local XC-20 Gas Limits {: #override-local-xc20-gas-limits }

If you are transferring a local XC-20, the default units of gas is as follows for each network:

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
import { numberToU8a, stringToU8a, u8aToHex } from '@polkadot/util';

// 1. Convert `gas_limit:` to bytes
const gasLimitString = 'gas_limit:';
const u8aGasLimit = stringToU8a(gasLimitString);

// 2. Convert the gas value to little-endian formatted bytes
const gasLimitValue = 300000;
const u8aGasLimitValue = numberToU8a(gasLimitValue);
const littleEndianValue = u8aGasLimitValue.reverse();

// 3. Combine and zero pad the gas limit string and the gas limit 
// value to 32 bytes
const u8aCombinedGasLimit = new Uint8Array(32);
u8aCombinedGasLimit.set(u8aGasLimit, 0);
u8aCombinedGasLimit.set(littleEndianValue, u8aGasLimit.length);

// 4. Convert the bytes to a hex string
const data = u8aToHex(u8aCombinedGasLimit);
console.log(`The GeneralKey data is: ${data}`);
```

The following is an example multilocation with the gas limit set to `300000`:

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
            { 
              GeneralKey: {
                // gas_limit: 300000
                data: '0x6761735f6c696d69743ae0930400000000000000000000000000000000000000',
                length: 32,
              },
            },
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

## X-Tokens Precompile {: #xtokens-precompile}

The X-Tokens Precompile contract allows developers to access XCM token transfer features through the Ethereum API of Moonbeam-based networks. As with other [precompile contracts](/builders/pallets-precompiles/precompiles/){target=_blank}, the X-Tokens Precompile is located at the following addresses:

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

--8<-- 'text/precompiles/security.md'

### The X-Tokens Solidity Interface {: #xtokens-solidity-interface }

[Xtokens.sol](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank} is an interface through which developers can interact with the X-Tokens Pallet using the Ethereum API.

The interface includes the following functions:

 - **transfer**(*address* currencyAddress, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — function that represents the `transfer` method described in the [previous example](#xtokens-transfer-function). Instead of using the currency ID, you'll need to provide the asset's address for the `currencyAddress`:
    - For [External XC-20s](/builders/interoperability/xcm/xc20/overview/#external-xc20s){target=_blank}, provide the [XC-20 precompile address](/builders/interoperability/xcm/xc20/overview/#current-xc20-assets){target=_blank}
    - For native tokens (i.e., GLMR, MOVR, and DEV), provide the [ERC-20 precompile](/builders/pallets-precompiles/precompiles/erc20/#the-erc20-interface){target=_blank} address, which is `{{networks.moonbeam.precompiles.erc20 }}`
    - For [Local XC-20s](/builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}, provide the token's address

    The `destination` multilocation is built in a particular way that is described in the following section

 - **transferMultiasset**(*Multilocation* *memory* asset, *uint256* amount, *Multilocation* *memory* destination, *uint64* weight) — function that represents the `transferMultiasset` method described in the [previous example](#xtokens-transfer-multiasset-function). Both multilocations are built in a particular way that is described in the following section

### Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the X-Tokens Precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into the X-Tokens Precompile functions:

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
        '0x00000003E8', // Selector Parachain, ID = 1000 (Moonbase Alpha)
        '0x0403' // Pallet Instance = 3
    ]
}

// Multilocation targeting Alice's account on the relay chain from Moonbase Alpha
{
    1, // parents = 1
    // Size of array is 1, meaning is an X1 interior
    [
        '0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300' 
        // AccountKey32 Selector + Address in hex + Network(Option) Null
    ]
}
```

### Using Libraries to Interact with X-Tokens {: #using-libraries-to-interact-with-xtokens}

The Multilocation structs can be formatted like any other struct when using libraries to interact with the Ethereum API. The following code snippet include the previous [X-Tokens transfer function](#xtokens-transfer-function), the [X-Tokens multiasset transfer function](#xtokens-transfer-multiasset-function), and sample Multilocation struct examples. You can find the [X-Tokens ABI on Github](https://raw.githubusercontent.com/moonbeam-foundation/moonbeam-docs/master/.snippets/code/xtokens/abi.js){target=_blank}.

=== "Ethers.js"

    ```js
    --8<-- 'code/xtokens/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/xtokens/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/xtokens/web3.py'
    ```

!!! note
    To test out the above examples on Moonbeam or Moonriver, you can replace the RPC URL with your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}.
