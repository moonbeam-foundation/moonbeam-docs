---
title: Gasless Transactions with the Call Permit Precompile
description: Enable gas-less transactions in your dApp with Moonbeam's Call Permit Precompile! Learn how to implement the Call Permit Precompile to improve user experience.
---

# Use the Call Permit Precompile to Send Gasless Transactions

![Banner Image](/images/tutorials/eth-api/call-permit-gasless-txs/gasless-banner.png)

_March 30, 2023 | by Erin Shaben_

## Introduction {: #introduction } 

To interact with dApps on Moonbeam, users typically need to hold GLMR, Moonbeam's native token, in order to pay for transaction fees. This requirement creates an obstacle for dApps in terms of user experience, as a user needs to ensure they keep a balance of the native token to interact with the dApp.

One solution to this problem is gasless transactions. Gasless transactions are a type of transaction that does not require the user to pay for the gas required to execute the transaction. The gas for these transactions can be covered by a third-party service or it can be deducted from the user's balance of a different token, depending on the implementation.

Gasless transactions can be especially beneficial for users that make small transactions frequently, as is the case with gaming dApps like [Damned Pirates Society](https://damnedpiratessociety.io/){target=_blank} (DPS). In DPS, users go on voyages in search of treasure and with the goal of growing their fleet. Users can earn Doubloons (DBL), the primary in-game currency, while on voyages and spend their DBL on repairing and upgrading their Flagship, buying support ships, and more. Currently, if a user wants to repair their Flagship, they'll need to have DBL to pay for the repair and GLMR to pay for transaction fees. Wouldn't it be ideal to lower the barrier to entry by implementing gasless transactions so users wouldn't need to worry about keeping a GLMR balance on top of their DBL balance? From a dApp's perspective, it would keep users on their platform, as their users wouldn't need to leave the dApp to fund their GLMR balance; they could keep on gaming.

Gasless transactions can be implemented using Moonbeam's [Call Permit Precompile](/builders/pallets-precompiles/precompiles/call-permit){target=_blank}, which is a Solidity interface that allows a user to sign a permit, an [EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank} signed message, that can then be dispatched by your dApp. The Call Permit Precompile can be used to execute any EVM call. The best part is that you don't need to modify your existing contracts.

In this tutorial, we'll walk through the process of implementing gasless transactions in a dApp, using DPS Flagship repairs as an example. We'll go over building an EIP-712 signed message, signing it, and dispatching it with the Call Permit Precompile. 

## What are EIP-712 Signed Messages? {: #eip-712-signed-messages }

An [EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank} signed message is a message that is structured, hashed, and signed in a standardized way. The benefit of the EIP-712 standardization is that message data can be displayed in a much more human-readable way for users signing these messages, so they can better understand what exactly they're signing. Before this standardization existed, users had to sign off on unreadable and difficult-to-decode hexadecimal strings, which made it easy for users to misplace their trust and sign off on messages with malicious data.

The EIP-712 standard specifies how the message data should be structured by requiring developers to define a JSON structure of the message data that users will sign off on and specifying a domain separator. The main goal of the domain separator is to prevent replay attacks. We'll cover both of these requirements in the following sections.

## Checking Prerequisites {: #checking-prerequisites }

For this tutorial, you'll need the following:

- An account with funds.
  --8<-- 'text/faucet/faucet-list-item.md'
- A project with [Ethers](/builders/build/eth-api/libraries/ethersjs){target=_blank} installed:
    ```
    npm i ethers
    ```

- 
--8<-- 'text/common/endpoint-examples.md'

## Configure your Project {: #configure-your-project }

To get started, make sure you have a project with Ethers installed, as specified in the [prerequisites](#checking-prerequisites). To configure Ethers for Moonbeam, you'll need to:

1. Import `ethers`
2. Define the network configurations
3. Create an `ethers` provider

=== "Moonbeam"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';

    // 2. Define network configurations
    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });
    ```

=== "Moonriver"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';

    // 2. Define network configurations
    const providerRPC = {
      moonriver: {
        name: 'moonriver',
        rpc: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // {{ networks.moonriver.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonriver.rpc, {
      chainId: providerRPC.moonriver.chainId,
      name: providerRPC.moonriver.name,
    });
    ```

=== "Moonbase Alpha"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';

    // 2. Define network configurations
    const providerRPC = {
      moonbase: {
        name: 'moonbase-alpha',
        rpc: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbase.rpc, {
      chainId: providerRPC.moonbase.chainId,
      name: providerRPC.moonbase.name,
    });
    ```

=== "Moonbeam Dev Node"

    ```js
    // 1. Import ethers
    import { ethers } from 'ethers';

    // 2. Define network configurations
    const providerRPC = {
      dev: {
        name: 'moonbeam-development',
        rpc: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // {{ networks.development.hex_chain_id }} in hex,
      },
    };
    // 3. Create ethers provider
    const provider = new ethers.JsonRpcProvider(providerRPC.dev.rpc, {
      chainId: providerRPC.dev.chainId,
      name: providerRPC.dev.name,
    });
    ```

As previously mentioned, there are several ways to set up gasless transactions. For the purposes of this tutorial, we'll assume that there is a third-party account that pays the fees. As such, you'll need to have a signer for the user of the dApp, which is connected to your user's wallet, and a signer for the third-party account paying for the transaction fees. This tutorial assumes that you already have these signers in place, but if needed, you can set up the following generic signers for testing purposes:

```js
const userSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
const thirdPartyGasSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
```

!!! remember
    Never store your private keys in a JavaScript or TypeScript file.

Now that we've set up the initial configurations, let's dive into building the EIP-712 signed message.

## Build an EIP-712 Typed Message {: #build-an-eip-712-signed-message }

There are three components that we'll need to build an EIP-712 typed message: the domain separator, the typed data structure for the data that users will sign, and the actual message data.

The domain separator and the typed data structure will be based on the [Call Permit Precompile](/builders/pallets-precompiles/precompiles/call-permit){target=_blank}. The steps to build both of these components will always be the same, regardless of the data that is being signed. The actual message data is what will change depending on your individual use case.

### Define the Domain Separator {: #define-domain-separator }

We'll first start off with the domain separator, which will define the Call Permit Precompile as the signing domain. Permits will get dispatched by calling the `dispatch` function of the Call Permit Precompile, which is why the Call Permit Precompile is always going to be the signing domain. As previously mentioned, the goal of the domain separator is to avoid replay attacks. 

--8<-- 'text/precompiles/call-permit/domain-separator.md'

We're using Ethers in this example, which requires the domain separator to be in the format specified by the [`TypedDataDomain` interface](https://docs.ethers.org/v6/api/hashing/#TypedDataDomain){target=_blank}, but if desired, you could generate the domain separator as a *bytes32* representation using the [`DOMAIN_SEPARATOR()` function of the Call Permit Precompile](/builders/pallets-precompiles/precompiles/call-permit/#:~:text=DOMAIN_SEPARATOR()){target=_blank}.

The domain separator for each Moonbeam network is as follows:

=== "Moonbeam"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonbeam.chain_id }},
      verifyingContract: '{{ networks.moonbeam.precompiles.call_permit}}',
    };
    ```

=== "Moonriver"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonriver.chain_id }},
      verifyingContract: '{{ networks.moonriver.precompiles.call_permit}}',
    };
    ```

=== "Moonbase Alpha"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonbase.chain_id }},
      verifyingContract: '{{ networks.moonbase.precompiles.call_permit}}',
    };
    ```

=== "Moonbeam Dev Node"

    ```js
    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.development.chain_id }},
      verifyingContract: '{{ networks.moonbase.precompiles.call_permit}}',
    };
    ```

### Define the Typed Data Structure {: #define-typed-data-structure }

Next, we'll need to define the typed data structure. The typed data structure defines the acceptable types of data that our users will be signing. If you take a look at the [`dispatch` function of the Call Permit Precompile](/builders/pallets-precompiles/precompiles/call-permit/#the-call-permit-interface){target=_blank}, you'll see the data that we need to send, along with the associated types, is as follows:

```sol
function dispatch(
    address from,
    address to,
    uint256 value,
    bytes memory data,
    uint64 gaslimit,
    uint256 deadline,
    uint8 v,
    bytes32 r,
    bytes32 s
) external returns (bytes memory output);
```

We'll need to add each of the above parameters to our typed data structure, with a couple of modifications. We don't need to include the signature-related parameters, but we do need to include a parameter for the `nonce` of the `from` account, which will be a *uint256*. The signature-related parameters aren't needed at this point because we're building the message data for the users to sign. We'll circle back to the signature-related parameters after we've finished building the message and requested the signature.

So, if we grab the rest of the parameters, we can start to build our data structure. The primary type will be `CallPermit` and it will be an array of objects that correspond to each of the parameters and define the `name` and `type` of each parameters:

```js
const types = {
  CallPermit: [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    { name: 'gaslimit', type: 'uint64' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
};
```

### Define the Message Data {: #define-message-data }

In the previous step, we defined the typed data structure of the data that our users will be signing. So the next step will be to build the message data that follows the structure we defined. **Please note that the message data we're using in this section is for demo purposes only**.

Since we are going to implement gasless transactions for repairing a Flagship, we're going to be interacting with the [Shipyard V1 contract](https://moonscan.io/address/0x34031A5533BF30e0CEc0b7891d2e07aa194d8511#code){target=_blank}, which is located at this address: `0x34031A5533BF30e0CEc0b7891d2e07aa194d8511`.

So, let's start by going over the arguments required to build the message data:

- `from` - your user's address, which you can easily get from your user's Ethers signer using `signer.address`
- `to` - the contract address that you want to interact with. For this example, we'll use the address of DPS's Shipyard V1 contract
- `value` - the value to be transferred from the `from` account. This will be `0` as DBL are used to repair Flagships, not GLMR
- `data` - the calldata to be executed, which we'll calculate in the following steps
- `gaslimit`- the gas limit the call requires
- `nonce` - the nonce of the `from` account. This isn't your standard nonce, but the nonce for permits dispatched through the Call Permit Precompile specifically. To get this nonce, you can call the Call Permit Precompile's `nonces` function and pass in the address of the `from` account
- `deadline` - the deadline in UNIX seconds after which the permit will expire and no longer be valid

The message will resemble the following:

```js
const message = {
  from: userSigner.address,
  to: '0x34031A5533BF30e0CEc0b7891d2e07aa194d8511', // Shipyard V1 contract address
  value: 0,
  data: 'TODO: Calculate the data that will repair a Flagship',
  gaslimit: 100000,
  nonce: 'TODO: Use the Call Permit Precompile to get the nonce of the from account',
  deadline: '1680587122996', // Randomly created deadline in the future
};
```

Now, let's dig a little bit deeper and tackle the `TODO` items. We'll start off by calculating the `data` value.

If you take a look at the [`DPSShipyard.sol` contract's code](https://moonscan.io/address/0x34031A5533BF30e0CEc0b7891d2e07aa194d8511#code){target=_blank}, you'll see the [`repairFlagship` function](https://moonscan.io/address/0x34031A5533BF30e0CEc0b7891d2e07aa194d8511#code#F1#L78){target=_blank}. The `repairFlagship` function accepts two parameters: *DPSFlagshipI* `_flagship` and *uint256* `_flagshipId`. The *DPSFlagshipI* type represents the address of the `DPSFlagship.sol` contract.

With this in mind, we'll need the function selector of the `repairFlagship` function, which is `0x1ad12483`, and the arguments for the `_flagship` and `_flagshipId` to build the `data` value. The `_flagship` argument will be the address of the `DPSFlagship.sol` contract, which is `0x4634ba8bB97A82A809161ea595F95A1Fa1255Bff`. For the purposes of this example, we'll assume that the user who owns Flagship #1078 has suffered some damage to their ship during their last voyage and wants to repair it. So we'll need to convert 1078 to hexadecimal format, which is `436`. 

Before we combine the function selector and two arguments, which will result in the value we'll pass into the `data` parameter, we'll need to pad the `_flagship` and `_flagshipId` arguments with zeroes so they are 32 bytes (64 hexadecimal characters):

The `_flagship` value will be:

```
0000000000000000000000004634ba8bb97a82a809161ea595f95a1fa1255bff
```

And the `_flagshipId` value will be:

```
0000000000000000000000000000000000000000000000000000000000000436
```

Altogether, the `data` will be:

```js
data: '0x1ad124830000000000000000000000004634ba8bb97a82a809161ea595f95a1fa1255bff0000000000000000000000000000000000000000000000000000000000000436'
```

Lastly, we'll need to get the `nonce` of the `from` account. As previously mentioned, we can use the `nonces` function of the Call Permit Precompile to get this value. To do so, you'll need to create a contract instance for the Call Permit Precompile:

1. Create a new file in your project that contains the ABI of the Call Permit Precompile. You can find the [ABI on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/precompiles/call-permit/abi.js){target=_blank}
2. Import the ABI into your Ethers file
3. Create an instance of the Call Permit Precompile using the precompile's address, the ABI of the precompile, and the third-party account for transaction fees as the signer, as we'll use this signer to dispatch the signed permit later on
4. Call the `nonces` function and pass in the `signer.account` of the user, which is the same as the `from` account

```js
...
import abi from './callPermitABI.js'

...

const callPermit = new ethers.Contract(
    '{{ networks.moonbeam.precompiles.call_permit }}', 
    abi, 
    thirdPartyGasSigner
);

const nonce = await callPermit.nonces(userSigner.address);
```

??? code "View the script so far"

    ```js
    import { ethers } from 'ethers';
    import abi from './callPermitABI.js'

    const providerRPC = {
      moonbeam: {
        name: 'moonbeam',
        rpc: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // {{ networks.moonbeam.hex_chain_id }} in hex,
      },
    };
    const provider = new ethers.JsonRpcProvider(providerRPC.moonbeam.rpc, {
      chainId: providerRPC.moonbeam.chainId,
      name: providerRPC.moonbeam.name,
    });

    // Insert your own signer logic or use the following for testing purposes
    const userSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);
    const thirdPartyGasSigner = new ethers.Wallet('INSERT-PRIVATE-KEY', provider);

    const domain = {
      name: 'Call Permit Precompile',
      version: '1',
      chainId: {{ networks.moonbeam.chain_id }},
      verifyingContract: '{{ networks.moonbeam.precompiles.call_permit}}',
    };

    const types = {
      CallPermit: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'gaslimit', type: 'uint64' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };

    const callPermit = new ethers.Contract(
      '{{ networks.moonbeam.precompiles.call_permit }}', 
      abi, 
      thirdPartyGasSigner
    );

    const nonce = await callPermit.nonces(userSigner.address);

    const message = {
      from: userSigner.address,
      to: '0xccB3707967dDcFA47b19f5AEEfe7764a5e0E43cC', // Crew for Coin V1 contract address
      value: 0,
      data: '0x1ad124830000000000000000000000004634ba8bb97a82a809161ea595f95a1fa1255bff0000000000000000000000000000000000000000000000000000000000000436',
      gaslimit: 100000,
      nonce,
      deadline: '1680587122996', // Randomly created deadline in the future
    };
    ```

    !!! remember
        Never store your private keys in a JavaScript or TypeScript file.

So far, we've created the domain separator, defined the data structure of our EIP-712 message, and assembled the data for the message. Next, we'll need to request the signature for our EIP-712 typed message!

## Get Signature for EIP-712 Typed Messages {: #use-ethers-to-sign-eip712-messages }

For this next step, we're going to use our Ethers signer and the `signer.signTypedData` function to prompt our users to sign the EIP-712 typed message we've assembled.

The `signTypedData` function is pretty straight-forward at this point:

```js
const signature = await signer.signTypedData(
  domain, // The domain separator
  types, // The typed data structure
  message // The message data
);
console.log(`Signature hash: ${signature}`);
```

Next, we'll use the signature to dispatch the permit using the Call Permit Precompile's `dispatch` function.

## Dispatch a Signed EIP-712 Message {: #dispatch-eip712-message }

Before an EIP-712 signed message can be dispatched, we'll need to get the signature-related parameters from the signed message. To do so, you can use Ethers' `Signature.from` function:

```js
const ethersSignature = ethers.Signature.from(signature);
```

Now that we have all of the values needed to dispatch the permit, we can call the `dispatch` function of the Call Permit Precompile. The arguments passed to the `dispatch` function must be the exact same arguments that were passed in for the `value` parameter of the `signTypedData` function. You'll send the following function using an account associated with your dApp as the signer (not the signer associated with the user), and it will dispatch the permit that the user signed:

```js
const dispatch = await callPermit.dispatch(
  message.from,
  message.to,
  message.value,
  message.data,
  message.gaslimit,
  message.deadline,
  ethersSignature.v,
  ethersSignature.r,
  ethersSignature.s,
);

await dispatch.wait();
console.log(`Transaction hash: ${dispatch.hash}`);
```

??? code "View the complete script"
    ```js
    --8<-- 'code/precompiles/call-permit/dispatch-call-permit.js'
    ```

    !!! remember
        Never store your private keys in a JavaScript or TypeScript file.

And that's it! Congrats! You've learned how to implement gasless transactions using the Call Permit Precompile on Moonbeam. You can now adapt the logic in this tutorial for your own dApp!

--8<-- 'text/disclaimers/educational-tutorial.md'
--8<-- 'text/disclaimers/third-party-content.md'