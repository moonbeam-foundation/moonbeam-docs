---
title: Send ERC-20s Cross-Chain via XCM
description: Transfer any ERC-20 token cross-chain with ease via XCM. Our step-by-step tutorial will guide you through the process. Start sending tokens across chains today!
---

# Send ERC-20s Cross Chain via XCM

![X-Tokens Precompile Contracts Banner](/images/builders/interoperability/xcm/xc20/send-erc20s/send-erc20s-banner.png)

## Introduction {: #introduction } 

You can send any ERC-20 directly through XCM from Moonbeam to any other chains in the ecosystem (relay chain or parachains) as long as the ERC-20 is registered as an XCM asset on that chain.

This is made possible via the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/#X-Tokens-pallet-interface){target=_blank} and the [ERC-20 XCM Bridge Pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/erc20-xcm-bridge){target=_blank} on Moonbeam. The X-Tokens Pallet provides different methods to transfer fungible assets and is the same pallet used to [send external XC-20s](/builders/interoperability/xcm/xc20/xtokens){target=_blank} and native assets cross-chain. On the other hand, the ERC-20 XCM Bridge Pallet handles the underlying functionality to support XCM-enabled ERC-20s.

This guide will show you how to leverage the X-Tokens Pallet to build an XCM message to transfer an ERC-20 to another chain. Moreover, you'll also learn how to use the X-Tokens Precompile to perform the same actions via the Ethereum API. For more information, you can refer to the documentation on the [X-Tokens Pallet](/builders/interoperability/xcm/xc20/xtokens/#x-tokens-pallet-interface){target=_blank} and [X-Tokens Precompile](/builders/interoperability/xcm/xc20/xtokens/#xtokens-precompile){target=_blank}.

**Please note that this feature is currently only available for testing purposes on Moonbase Alpha**, it is not yet available on Moonbeam or Moonriver.

## Relevant XCM Definitions {: #relevant-definitions }

This guide assumes you have a basic understanding of XCM. If not, please take time to review the [XCM Overview](/builders/interoperability/xcm/overview){target=_blank} page.

For this guide specifically, you'll need to have an understanding of the following definitions:

--8<-- 'text/xcm/general-xcm-definitions2.md'

## Checking Prerequisites {: #checking-prerequisites }

For this guide, you will need the following:

- An [account loaded in Polkadot.js](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/accounts){target=_blank} funded with [DEV tokens](/builders/get-started/networks/moonbase/#get-tokens){target=_blank}. Your account should also hold the ERC-20 tokens you want to send
- The contract address of the ERC-20 token
- A recipient address on the target chain where you'll be sending the ERC-20 to

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

### Use the Polkadot.js API to Send an ERC-20 Cross-Chain {: #use-polkadotjs-apps }

This section of the guide will show you how to build and send an XCM message to transfer an ERC-20 cross-chain using the Polkadot.js API. This is purely for example purposes only. Before sending assets cross-chain, make sure that the asset you're sending is [registered in the target chain](#register-an-erc-20-on-another-chain); otherwise the call will result in a loss of the assets.

Since you'll be interacting with the `transfer` function of the X-Tokens Pallet, you'll need to gather the arguments for the `currencyId`, `amount`, `dest`, and `destWeight`. For this example, you can send 1 ERC-20 token to an account on the relay chain:

- The `currencyId` has the following parameters:

    |    Parameter    |         Value         |
    |:---------------:|:---------------------:|
    |   CurrencyId    |         Erc20         |
    | ContractAddress | Target ERC-20 Address |

- The `amount` is straightforward, you can provide the value of ERC-20 tokens you want to transfer in Wei. For this example, you can transfer 1 token, which would be `1000000000000000000n`
- The `dest` should be an XCM v3 Multilocation, which has the following parameters:

    | Parameter |     Value      |
    |:---------:|:--------------:|
    |  Version  |       V3       |
    |  Parents  |       1        |
    | Interior  |       X1       |
    |    X1     |  AccountId32   |
    |  Network  |      None      |
    |    Id     | Target Account |

    !!! note
        The `Network` parameter is optional, and as such, if you don't specify one, it will default to `None`.

- The `destWeightLimit` should be an XCM v3 Weight Limit, which has the following parameters:

    |    Parameter    |   Value   |
    |:---------------:|:---------:|
    | DestWeightLimit |  Limited  |
    |     RefTime     | 400000000 |
    |    ProofSize    |     0     |

Note that on Moonbase Alpha, each XCM instruction costs around `100000000` weight units. A `transfer` consists of 4 XCM instructions, so a destination weight of `400000000` should be enough.

Altogether, you should have the following variables for each parameter of the `transfer` function:

```js
const currencyId = { Erc20 : { contractAddress: ERC_20_ADDRESS } };
const amount = 1000000000000000000n;
const dest = { V3: { parents: 1, interior: { X1: { AccountId32: { id: RELAY_ACC_ADDRESS } } } } };
const destWeightLimit = { Limited: { refTime: 400000000, proofSize: 0 } };
```

Now that we have the values for each of the parameters, we can begin to write a script for the transfer. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - Moonbase Alpha endpoint URL to create the provider
     - The values for each of the parameters of the `transfer` function
 2. Create a Keyring instance that will be used to send the transaction. **This is for demo purposes only. Never store your private key in a JavaScript file**
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 4. Craft the `xTokens.transfer` extrinsic with the `currencyId`, `amount`, `dest`, and `destWeightLimit`
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

```js
import { ApiPromise, WsProvider } from '@polkadot/api'; // Version 9.13.6
import { Keyring } from '@polkadot/api';

// 1. Provide input data
const providerWsURL = 'wss://wss.api.moonbase.moonbeam.network';
const currencyId = { Erc20: { contractAddress: ERC_20_ADDRESS } };
const amount = 1000000000000000000n;
const dest = {
  V3: {
    parents: 1,
    interior: { X1: { AccountId32: { id: RELAY_ACC_ADDRESS } } },
  },
};
const destWeightLimit = { Limited: { refTime: 400000000, proofSize: 0 } };

// 2. Create Keyring instance
const keyring = new Keyring({ type: 'ethereum' });
const alice = keyring.addFromUri(PRIVATE_KEY);

const sendErc20 = async () => {
  // 3. Create Substrate API provider
  const substrateProvider = new WsProvider(providerWsURL);
  const api = await ApiPromise.create({ provider: substrateProvider });

  // 4. Craft the extrinsic
  const tx = api.tx.xTokens.transfer(currencyId, amount, dest, destWeightLimit);

  // 5. Send the transaction
  const txHash = await tx.signAndSend(alice);
  console.log(`Submitted with hash ${txHash}`);
};

sendErc20();
```

!!! note
    You can view an example of the above script with a preconfigured ERC-20 contract address and recipient on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x1e000325ed7e99cf496a8c6d29f5cce425b825af67a1f0000064a7b3b6e00d00000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a0630102105e5f00){target=_blank} using the following encoded call data: `0x1e000325ed7e99cf496a8c6d29f5cce425b825af67a1f0000064a7b3b6e00d00000000000000000301010100c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a0630102105e5f00`.

## Use the X-Tokens Precompile to Send an ERC-20 {: #x-tokens-precompile }

To build an XCM message with the X-Tokens Precompile, you'll use the [`transfer` function](/builders/interoperability/xcm/xc20/xtokens/#xtokens-solidity-interface){target=_blank}, which enables you to call the `transfer` function of the X-Tokens Pallet through a Solidity interface, [`Xtokens.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/xtokens/Xtokens.sol){target=_blank}.

The X-Tokens precompile address is located at:

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

The `transfer` function of the precompile is similar to that of the pallet, where it accepts the following parameters:

- `currencyAddress` - the ERC-20 address of the currency to transfer. Accepts an *address*
- `amount` - the amount of tokens to transfer in Wei. Accepts a *uint256*
- `destination` - a multilocation to define the destination address for the tokens being sent via XCM. It supports different address formats such as 20 or 32 bytes addresses (Ethereum or Substrate). Accepts a [*Multilocation*](#building-the-precompile-multilocation)
- `weight` - the weight to buy in the destination chain. Accepts a *uint64*

### Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the X-Tokens Precompile interface, the `Multilocation` structure is defined as follows:

```js
 struct Multilocation {
    uint8 parents;
    bytes[] interior;
}
```

Note that each multilocation has a `parents` element, defined in this case by a `uint8`, and an array of bytes. Parents refer to how many "hops" in the upwards direction you have to do if you are going through the relay chain. Being a `uint8`, the normal values you would see are:

|   Origin    | Destination | Parents Value |
|:-----------:|:-----------:|:-------------:|
| Parachain A | Parachain A |       0       |
| Parachain A | Relay Chain |       1       |
| Parachain A | Parachain B |       1       |

The bytes array (`bytes[]`) defines the interior and its content within the multilocation. The size of the array defines the `interior` value as follows:

|    Array     | Size | Interior Value |
|:------------:|:----:|:--------------:|
|      []      |  0   |      Here      |
|    [XYZ]     |  1   |       X1       |
|  [XYZ, ABC]  |  2   |       X2       |
| [XYZ, ... N] |  N   |       XN       |

!!! note
    Interior value `Here` is often used for the relay chain (either as a destination or to target the relay chain asset).

Suppose the bytes array contains data. Each element's first byte (2 hexadecimal numbers) corresponds to the selector of that `XN` field. For example:

| Byte Value |    Selector    | Data Type |
|:----------:|:--------------:|-----------|
|    0x00    |   Parachain    | bytes4    |
|    0x01    |  AccountId32   | bytes32   |
|    0x02    | AccountIndex64 | u64       |
|    0x03    |  AccountKey20  | bytes20   |
|    0x04    | PalletInstance | byte      |
|    0x05    |  GeneralIndex  | u128      |
|    0x06    |   GeneralKey   | bytes[]   |

Next, depending on the selector and its data type, the following bytes correspond to the actual data being provided. Note that for `AccountId32`, `AccountIndex64`, and `AccountKey20`, the `network` field seen in the Polkadot.js API example is optional, and if an option is not provided, it defaults to `None`. For the precompile, you'll need to specify `None` and it will need to be appended at the end. For example:

|    Selector    |       Data Value       |         Represents         |
|:--------------:|:----------------------:|:--------------------------:|
|   Parachain    |    "0x00+000007E7"     |     Parachain ID 2023      |
|  AccountId32   | "0x01+AccountId32+00"  | AccountId32, Network None  |
|  AccountKey20  | "0x03+AccountKey20+00" | AccountKey20, Network None |
| PalletInstance |       "0x04+03"        |     Pallet Instance 3      |

!!! note
    The `interior` data usually needs to be wrapped around quotes. On the contrary, you might get an `invalid tuple value` error.

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
        // AccountKey32 Selector + Address in hex + Network = None
    ]
}
```

### Use Ethereum Libraries to Send an ERC-20 Cross-Chain {: #using-libraries-to-interact-with-xtokens}

Now that you have an understanding of how to build the multilocation, you can use an Ethereum library to call the `transfer` function of the X-Tokens Precompile and pass in the necessary parameters to send an ERC-20 cross-chain. 

For this example, you'll need to import the ABI of the X-Tokens Precompile. You can find the [X-Tokens ABI on Github](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/xtokens/abi.js){target=_blank}.

The following snippets are purely for example purposes only. Before sending assets cross-chain, make sure that the asset you're sending is registered in the target chain; otherwise the call will result in a loss of the assets.

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

## Register an ERC-20 on Another Chain {: #register-an-erc-20-on-another-chain }

As previously mentioned, you can send any ERC-20 through XCM to any other chains in the ecosystem (relay chain or parachains) as long as the ERC-20 is registered as an XCM asset on that chain.

In order to register an ERC-20 on another chain, you'll need the multilocation of the asset on Moonbeam. The multilocation will include the parachain ID of Moonbeam, the pallet instance, and the address of the ERC-20. The pallet instance will be `48`, which corresponds to the index of the ERC-20 XCM Bridge Pallet, as this is the pallet that enables any ERC-20 to be transferred via XCM. 

=== "Moonbase Alpha"

    |    Variable    |                     Value                      |
    |:--------------:|:----------------------------------------------:|
    |   Parachain    |                      1000                      |
    | PalletInstance |                       48                       |
    |  AccountKey20  | { network: Any, key: ERC20_ADDRESS_GOES_HERE } |