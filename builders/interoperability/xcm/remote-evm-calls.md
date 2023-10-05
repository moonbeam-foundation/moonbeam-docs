---
title: Remote EVM Calls Through XCM
description: How to do remote calls to smart contracts on Moonbeam EVM through XCM from any Polkadot parachain that has an XCM channel established with Moonbeam.
---

# Remote EVM Calls Through XCM

## Introduction {: #introduction}

The [XCM Transactor Pallet](/builders/interoperability/xcm/xcm-transactor/){target=_blank} provides a simple interface to perform remote cross-chain calls through XCM. However, this does not consider the possibility of doing remote calls to Moonbeam's EVM, only to Substrate specific pallets (functionalities).

Moonbeam's EVM is only accessible through the [Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}. Among many other things, this pallet handles certain validations of transactions before getting them into the transaction pool. Then, it performs another validation step before inserting a transaction from the pool in a block. Lastly, it provides the interface through a `transact` function to execute a validated transaction. All these steps follow the same behavior as an Ethereum transaction in terms of structure and signature scheme.

However, calling the [Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank} directly through an XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} is not feasible. Mainly because the dispatcher account for the remote EVM call (referred to as `msg.sender` in  Ethereum) does not sign the XCM transaction on the Moonbeam side. The XCM extrinsic is signed in the origin chain, and the XCM executor dispatches the call, through the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} instruction, from a known caller linked to the sender in the origin chain. In this context, the Ethereum Pallet will not be able to verify the signature and, ultimately, validate the transaction.

To this end, the [Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} was introduced. It acts as a middleware between the XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} instruction and the [Ethereum Pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}, as special considerations need to be made when performing EVM calls remotely through XCM. The pallet performs the necessary checks and validates the transaction. Next, the pallet calls the Ethereum Pallet to dispatch the transaction to the EVM. Due to how the EVM is accessed, there are some differences between regular and remote EVM calls.

The happy path for both regular and remote EVM calls through XCM is portrayed in the following diagram:

![Happy path for regular and remote EVM calls through XCM](/images/builders/interoperability/xcm/remote-evm-calls/xcmevm-1.png)

This guide will go through the differences between regular and remote EVM calls. In addition, it will show you how to perform remote EVM calls through the extrinsic exposed by the [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.

!!! note
    Remote EVM calls are done through the [XCM Transactor Pallet](/builders/interoperability/xcm/xcm-transactor/){target=_blank}. Therefore, it is recommended to get familiar with XCM Transactor concepts before trying to perform remote EVM calls through XCM.

**Note that remote calls to Moonbeam's EVM through XCM are still being actively developed**. In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions {: #general-xcm-definitions }

--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions2.md'

 - **Multilocation-derivative account** —  an account derivated from the new origin set by the [Descend Origin](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM instruction and the provided multilocation, which is typically the sovereign account from which the XCM originated. Derivative accounts are keyless (the private key is unknown). Consequently, derivative accounts related to XCM-specific use cases can only be accessed through XCM extrinsics. For Moonbeam-based networks, [the derivation method](https://github.com/moonbeam-foundation/moonbeam/blob/master/primitives/xcm/src/location_conversion.rs#L31-L37){target=_blank} is calculating the `blake2` hash of the multilocation, which includes the origin parachain ID, and truncating the hash to the correct length (20 bytes for an Ethereum-styled account). The XCM call [origin conversion](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L343){target=_blank} happens when the `Transact` instruction gets executed. Consequently, each parachain can convert the origin with its own desired procedure, so the user who initiated the transaction might have a different derivative account per parachain. This derivative account pays for transaction fees, and it is set as the dispatcher of the call
 - **Transact information** — relates to extra weight and fee information for the XCM remote execution part of the XCM Transactor extrinsic. This is needed because the sovereign account pays the XCM transaction fee. Therefore, XCM Transactor calculates what the fee is and charges the sender of the XCM Transactor extrinsic the estimated amount in the corresponding [XC-20 token](/builders/interoperability/xcm/xc20/overview/){target=_blank} to repay the sovereign account

## Differences Between Regular and Remote EVM Calls Through XCM {: #differences-regular-remote-evm}

As explained in the [Introduction](#introduction), the paths that regular and remote EVM calls take to get to the EVM are quite different. The main reason behind this difference is the dispatcher of the transaction.

A regular EVM call has an apparent sender who signs the Ethereum transaction with its private key. The signature, of ECDSA type, can be verified with the signed message and the `r-s` values that are produced from the signing algorithm. Ethereum signatures use an additional variable, called `v`, which is the recovery identifier.

With remote EVM calls, the signer signed an XCM transaction in another chain. Moonbeam receives that XCM message which must be constructed with the following instructions:

 - [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank}

The first instruction, `DescendOrigin`, will mutate the origin of the XCM call on the Moonbeam side to a keyless account through the **multilocation-derivative account** mechanism described in the [Relevant XCM Definitions section](#general-xcm-definitions). The remote EVM call is dispatched from that keyless account (or a related [proxy](/tokens/manage/proxy-accounts/){target=_blank}). Therefore, because the transaction is not signed, it does not have the real `v-r-s` values of the signature, but `0x1` instead.

Because a remote EVM call does not have the actual `v-r-s` values of the signature, there could be collision problems of the EVM transaction hash, as it is calculated as the keccak256 hash of the signed transaction blob. In consequence, if two accounts with the same nonce submit the same transaction object, they will end up with the same EVM transaction hash. Therefore, all remote EVM transactions use a global nonce that is attached to the [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.

Another significant difference is in terms of the gas price. The fee for remote EVM calls is charged at an XCM execution level. Consequently, the gas price at an EVM level is zero, and the EVM will not charge for the execution itself. This can also be seen in the receipt of a remote EVM call transaction. Accordingly, the XCM message must be configured so that the `BuyExecution` buys enough weight to cover the gas cost.

The last difference is in terms of gas limit. Ethereum uses a gas-metered system to moderate the amount of execution that can be done in a block. On the contrary, Moonbeam uses a [weight-based system](https://docs.substrate.io/build/tx-weights-fees/){target=_blank}, in which each call is characterized by the time it takes to execute in a block. Each unit of weight corresponds to one picosecond of execution time.

The configuration of the XCM queue suggests that XCM messages should be executable within `20,000,000,000` weight units (that is, `0.02` seconds of block execution time). Suppose the XCM message can't be executed due to the lack of execution time in a given block, and the weight requirement is over `20,000,000,000`. In that case, the XCM message will be marked as `overweight` and would only be executable through democracy.

The `20,000,000,000` weight limit per XCM message constrains the gas limit available for remote EVM calls through XCM. For all Moonbeam-based networks, there is a ratio of [`25,000` units of gas per unit of weight](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/runtime/moonbase/src/lib.rs#L393){target=_blank} ([`WEIGHT_REF_TIME_PER_SECOND`](https://paritytech.github.io/substrate/master/frame_support/weights/constants/constant.WEIGHT_REF_TIME_PER_SECOND.html){target=_blank} / [`GAS_PER_SECOND`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/runtime/moonbase/src/lib.rs#L389){target=_blank}). Considering that you need some of the XCM message weight to execute the XCM instructions themselves. Therefore, a remote EVM call might have around `18,000,000,000` weight left, which is `720,000` gas units. Consequently, the maximum gas limit you can provide for a remote EVM call is around `720,000` gas units. Note that this might change in the future.

In summary, these are the main differences between regular and remote EVM calls:

- Remote EVM calls use a global nonce (owned by the [Ethereum-XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}) instead of a nonce per account
- The `v-r-s` values of the signature for remote EVM calls are `0x1`. The sender can't be retrieved from the signature through standard methods (for example, through [ECRECOVER](/builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover){target=_blank}). Nevertheless, the `from` is included in both the transaction receipt and when getting the transaction by hash (using the Ethereum JSON-RPC)
- The gas price for all remote EVM calls is zero. The EVM execution is charged at an XCM execution level and not at an EVM level
- The current maximum gas limit you can set for a remote EVM call is `720,000` gas units

## Ethereum XCM Pallet Interface {: #ethereum-xcm-pallet-interface}

### Extrinsics {: #extrinsics }

The Ethereum XCM pallet provides the following extrinsics (functions) that can be called by the `Transact` instruction to access Moonbeam's EVM through XCM:

 - **transact**(xcmTransaction) — function to remotely call the EVM through XCM. Only callable through the execution of an XCM message
 - **transactThroughProxy**(transactAs, xcmTransaction) — similar to the `transact` extrinsic, but with `transactAs` as an additional field. This function allows the remote EVM call to be dispatched from a given account with known keys (the `msg.sender`). This account needs to have set the **multilocation-derivative account** as a [proxy](/tokens/manage/proxy-accounts){target=_blank} of type `any` on Moonbeam. On the contrary, the dispatch of the remote EVM call will fail. Transaction fees are still paid by the **multilocation-derivative account**

Where the inputs that need to be provided can be defined as:

 - **xcmTransaction** — contains the Ethereum transaction details of the call that will be dispatched. This includes the call data, `msg.value` and gas limit
 - **transactAs** — account from which the remote EVM call will be dispatched (the `msg.sender`). The account set in this field needs to have set the **multilocation-derivative account** as a proxy of type `any` on Moonbeam. Transaction fees are still paid by the **multilocation-derivative account**

## Building a Remote EVM call through XCM {: #build-remove-evm-call-xcm}

This guide covers building an XCM message for remote EVM calls using the [XCM Pallet](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/pallet-xcm/src/lib.rs){target=_blank} from the relay chain to Moonbase Alpha. More specifically, it will use the `transact` function. The steps to use the `transactThroughProxy` function are identical. However, you'll need to provide the `transactAs` account and ensure that this account has set the **multilocation-derivative account** as a proxy of type `any` on Moonbase Alpha.

!!! note
    When using `transactThroughProxy`, the EVM call is dispatched by the **transactAs** account you provide, acting as the `msg.sender`, as long as this account has set the the **multilocation-derivative account** as a proxy of type `any` in the Moonbeam-based network you are using. However, transaction fees are still paid by the **multilocation-derivative account**, so you need to ensure it has enough funds to cover them.

### Checking Prerequisites {: #ethereumxcm-check-prerequisites}

To be able to send the call from the relay chain, you need to have the following:

 - An [account](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} on the relay chain with funds (UNIT) to pay for the transaction fees. You can acquire some xcUNIT by swapping for DEV tokens (Moonbase Alpha's native token) on [Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}, a demo Uniswap-V2 clone on Moonbase Alpha, and then [send them to the relay chain](/builders/interoperability/xcm/xc20/xtokens/){target_blank}. Additionally, you can [contact us](https://discord.gg/PfpUATX){target=_blank} to get some UNIT tokens directly

 - Fund the **multilocation-derivative account**, which you can obtain by following the steps [in the next section](#calculate-multilocation-derivative){target=_blank}. The account must have enough DEV tokens (or GLMR/MOVR for Moonbeam/Moonriver) to cover the cost of the XCM execution of the remote EVM call. Note that this is the account from which the remote EVM call will be dispatched (the `msg.sender`). Consequently, the account must satisfy whatever conditions are required for the EVM call to be executed correctly. For example, hold any relevant ERC-20 token if you are doing an ERC-20 transfer
 
!!! note
    Suppose you are using the `transactThroughProxy` function. In that case, the `transactAs` account must satisfy whatever conditions are required for the EVM call to be executed correctly, as it acts as the `msg.sender`. However, the **multilocation-derivative account** is the one that needs to hold the DEV tokens (or GLMR/MOVR for Moonbeam/Moonriver) to cover the cost of the XCM execution of the remote EVM call.

### Calculating the Multilocation-Derivative Account {: #calculate-multilocation-derivative}

As mentioned before, a remote EVM call is dispatched from an account called the **multilocation-derivative account**. This is calculated using the information provided by the [`Descend Origin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction. Consequently, the computed account depends directly on how the instruction is constructed.

For example, from the relay chain, the [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction is natively injected by the [XCM Pallet](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/pallet-xcm/src/lib.rs){target=_blank}. In the case of Moonbase Alpha's relay chain (based on Westend), is with the following format (a multilocation junction):

```js
{
  DescendOrigin: {
    X1: {
      AccountId32: {
        network: { westend: null },
        id: decodedAddress,
      },
    },
  },
}
```

Where the `decodedAddress` corresponds to the address of the account who signed the transaction on the relay chain (in a decoded 32 bytes format). You can make sure that your address is properly decoded by using the following snippet, which will decode an address if needed and ignore it if not:

```js
import { decodeAddress } from '@polkadot/util-crypto';
const decodedAddress = decodeAddress('INSERT_ADDRESS');
```

When the XCM instruction gets executed in Moonbeam (Moonbase Alpha in this example), the origin will have mutated to the following multilocation:

```js
{
  DescendOrigin: {
    parents: 1,
    interior: {
      X1: {
        AccountId32: {
          network: { westend: null },
          id: decodedAddress,
        },
      },
    },
  },
}
```

--8<-- 'text/builders/interoperability/xcm/calculate-multilocation-derivative-account.md'

For example, for Alice's relay chain account of `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`, you can calculate her Moonbase Alpha **multilocation-derivative account** by running:


```sh
yarn calculate-multilocation-derivative-account \
--ws-provider wss://wss.api.moonbase.moonbeam.network \
--address 5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT \
--parents 1
```

The relevant values for this calculation are summarized in the following table:

|                    Name                     |                                                                           Value                                                                           |
|:-------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        Origin Chain Encoded Address         |                                                    `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`                                                     |
|        Origin Chain Decoded Address         |                                           `0x3ec5f48ad0567c752275d87787954fef72f557b8bfa5eefc88665fa0beb89a56`                                            |
| Multilocation Received in Destination Chain | `{"parents":1,"interior":{"x1":{"accountId32":{"network": {"westend":null},"id":"0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c"}}}}` |
| Multilocation-Derivative Account (32 bytes) |                                           `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0afb2e78fdbbbf4ce26c2556c`                                            |
| Multilocation-Derivative Account (20 bytes) |                                                       `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`                                                        |

Consequently, for this example, the **multilocation-derivative account** for Moonbase Alpha is `0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0`. Note that Alice is the only person who can access this account through a remote transact from the relay chain, as she is the owner of its private keys and the **multilocation-derivative account** is keyless.

### Ethereum XCM Transact Call Data {: #ethereumxcm-transact-data }

Before you send the XCM message from the relay chain to Moonbase Alpha, you need to get the encoded call data that will be dispatched through the execution of the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM instruction.

In this example, you'll be interacting with the `transact` function of the [Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm), which accepts an `xcmTransaction` as a parameter.

The `xcmTransaction` parameter requires you to define:

- A gas limit
- The action to be executed, which provides two options: `Call` and `Create`. The current implementation of the [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} does not support the `CREATE` operation. Therefore, you can't deploy a smart contract through remote EVM calls. For `Call`, you'll need to specify the contract address you're interacting with
- The value of native tokens to send
- The input, which is the encoded call data of the contract interaction

For the action to be executed, you'll be performing a contract interaction with a simple [incrementer contract](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}, which is located at `0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8`. You'll be calling the `increment` function, which has no input argument and will increase the value of the `number` by one. Also, it will store the block's timestamp in which the function is executed to the `timestamp` variable.

The encoded call data of the interaction with the `increment` function is `0xd09de08a`, which is the first eight hexadecimal characters (or 4 bytes) of the keccak256 hash of `increment()`. If you choose to interact with a function that has input parameters, they also need to be encoded. The easiest way to get the encoded call data is to emulate a transaction either in [Remix](/builders/build/eth-api/dev-env/remix/#interacting-with-a-moonbeam-based-erc-20-from-metamask){target=_blank} or [Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}. Next, in Metamask, check the **HEX DATA: 4 BYTES** selector under the **HEX** tab before signing it. You don't need to sign the transaction.

Now that you have the encoded contract interaction data, you can determine the gas limit for this call using the [`eth_estimateGas` JSON-RPC method](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas){target=_blank}. For this example, you can set the gas limit to `155000`.

For the value, you can set it to `0` since this particular interaction does not need DEV (or GLMR/MOVR for Moonbeam/Moonriver). For an interaction that requires DEV, you'll need to modify this value accordingly.

Now that you have all of the components required for the `xcmTransaction` parameter, you can build it:

```js
const xcmTransaction = {
  V2: {
    gasLimit: 155000,
    action: { Call: '0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8' }, // Call the incrementer contract
    value: 0,
    input: '0xd09de08a', // Call the increment function
  },
};
```

Next, you can write the script to get the encoded call data for the transaction. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The Moonbase Alpha endpoint URL to create the provider
     - The value for the `xcmTransaction` parameter of the `transact` function
 2. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 3. Craft the `ethereumXcm.transact` extrinsic with the `xcmTransaction` value
 4. Get the encoded call data for the extrinsic. You don't need to sign and send the transaction

```js
--8<-- 'code/builders/interoperability/xcm/remote-evm-calls/generate-encoded-call-data.js'
```

!!! note
    You can view an example of the output of the above script on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00){target=_blank} using the following encoded call data: `0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`.

You'll use the encoded call data in the `Transact` instruction in the following section.

### Estimate Weight Required At Most {: #estimate-weight-required-at-most }

When using the `Transact` instruction, you'll need to define the `requireWeightAtMost` field, which is the required weight for the transaction. This field accepts two arguments: the `refTime` and `proofSize`. The `refTime` is the amount of computational time that can be used for execution, and the `proofSize` is the amount of storage in bytes that can be used.

To get an estimate for the `refTime` and `proofSize`, you can use the `paymentInfo` method of the Polkadot.js API. Since these weights are required for the `Transact` call data, you can extend the script from the previous section to add in the call to `paymentInfo`.

The `paymentInfo` method accepts the same parameters you would normally pass to the `.signAndSend` method, which is the sending account and, optionally, some additional values such as a nonce or signer.

To modify the encoded call data script, you'll need to add in logic to create a Keyring for the sender, which in this case is Alice. Then you'll simply need to take the `tx` and call the `paymentInfo` method and pass in Alice's Keyring.

### Building the XCM for Remote XCM Execution {: #build-xcm-remote-evm}

In this example, you'll build an XCM message to execute a remote EVM call in Moonbase Alpha from its relay chain through the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM instruction and the `transact` function of the [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.

Now that you've generated the [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} [encoded call data](#ethereumxcm-transact-data), you're going to use the XCM Pallet on the relay chain to perform a remote execution. To do so, you'll use the `send` function, which accepts two parameters: `dest` and `message`. You can start assembling these parameters by taking the following steps:

1. Build the multilocation of the destination, which is Moonbase Alpha:

    ```js
    const dest = { V3: { parents: 0, interior: { X1: { Parachain: 1000 } } } };
    ```

2. Build the `WithdrawAsset` instruction, which will require you to define:

    - The multilocation of the DEV token on Moonbase Alpha
    - The amount of DEV tokens to withdraw

    ```js
    const instr1 = {
      WithdrawAsset: [
        {
          id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
          fun: { Fungible: 10000000000000000n }, // 0.01 DEV
        },
      ],
    };
    ```

3. Build the `BuyExecution` instruction, which will require you to define:

    - The multilocation of the DEV token on Moonbase Alpha
    - The amount of DEV tokens to buy for execution
    - The weight limit

    ```js
    const instr2 = {
      BuyExecution: [
        {
          id: { Concrete: { parents: 0, interior: { X1: { PalletInstance: 3 } } } },
          fun: { Fungible: 10000000000000000n }, // 0.01 DEV
        },
        { Unlimited: null },
      ],
    };
    ```

4. Build the `Transact` instruction, which will require you to define:

    - The origin kind
    - The required weight for the transaction. You'll need to define a value for `refTime`, which is the amount of computational time that can be used for execution, and the `proofSize`, which is the amount of storage in bytes that can be used. Both figures can be calculated using the `paymentInfo` method of the Polkadot.js API. To calculate these values, you can modify the encoded call data script to call the `paymentInfo` method of the `ethereumXcm.transact(xcmTransaction)` transaction. To call the `paymentInfo` method, you'll need to pass in the senders account. You can pass in Alice's account on the relay chain: `5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT`:

        ```js
        ...

        const tx = api.tx.ethereumXcm.transact(xcmTransaction);
        const alice = '5DV1dYwnQ27gKCKwhikaw1rz1bYdvZZUuFkuduB4hEK3FgDT';
        const info = await tx.paymentInfo(alice);
        console.log(`Required Weight: ${info.weight.toString()}`);
        ```

        ??? code "Complete modified script"
            ```js
            --8<-- 'code/builders/interoperability/xcm/remote-evm-calls/estimate-required-weight.js'
            ```

        The script, at the time of writing, returns an estimate of `3900000000` for `refTime` and `38750` for `proofSize`.

    - The encoded call data, which you generated in the [Ethereum XCM Transact Call Data](#ethereumxcm-transact-data) section

    ```js
    const instr3 = {
      Transact: {
        originKind: 'SovereignAccount',
        requireWeightAtMost: { refTime: 3900000000n, proofSize: 38750n },
        call: {
          encoded:
            '0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00',
        },
      },
    };
    ```

5. Combine the XCM instructions into a versioned XCM message:

    ```js
    const message = { V3: [instr1, instr2, instr3] };
    ```

Now that you have the values for each of the parameters, you can write the script for the execution. You'll take the following steps:

 1. Provide the input data for the call. This includes:
     - The relay chain endpoint URL to create the provider
     - The values for each of the parameters of the `send` function
 2. Create a Keyring instance that will be used to send the transaction
 3. Create the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank} provider
 4. Craft the `xcmPallet.send` extrinsic with the `dest` and `message` values
 5. Send the transaction using the `signAndSend` extrinsic and the Keyring instance you created in the second step

!!! remember
    This is for demo purposes only. Never store your private key in a JavaScript file.

```js
--8<-- 'code/builders/interoperability/xcm/remote-evm-calls/send.js'
```

!!! note
    You can view an example of the output of the above script on [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics/decode/0x630003000100a10f030c00040000010403000f0000c16ff28623130000010403000f0000c16ff2862300060103004775e87a5d02007901260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00){target=_blank} using the following encoded call data: `0x630003000100a10f030c00040000010403000f0000c16ff28623130000010403000f0000c16ff2862300060103004775e87a5d02007901260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`.

Once the transaction is processed, you can check the relevant extrinsics and events in the [relay chain](https://polkadot.js.org/apps/?rpc=wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x2a0e40a2e5261e792190826ce338ed513fe44dec16dd416a12f547d358773f98){target=_blank} and [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/0x7570d6fa34b9dccd8b8839c2986260034eafef732bbc09f8ae5f857c28765145){target=_blank}.

In the relay chain, the extrinsic is `xcmPallet.send`, and the associated event is `xcmPallet.Sent` (among others related to the fee). In Moonbase Alpha, the XCM execution happens within the `parachainSystem.setValidationData` extrinsic, and there are multiple associated events that can be highlighted:

 - **parachainSystem.DownwardMessagesReceived** — event that signals that a message from the relay chain was received. With the current XCM implementation, messages from other parachains will show the same event
 - **balances.Withdraw** — event related to the withdrawing of tokens to pay for the execution of the call. Note that the `who` address is the **multilocation-derivative account** calculated before
 - **ethereum.Executed** — event associated with the execution of the remote EVM call. It provides the `from`, `to`, `transactionHash` (calculated with the non-standard signature and global pallet nonce), and the `exitReason`. Currently, some common EVM errors, like out of gas, will show `Reverted` in the exit reason
 - **polkadotXcm.AssetsTrapped** — event that is emitted when part of the tokens withdrawn from the account (for fees) are not used. Generally, when there are leftover tokens in the registry that are not allocated to an account. These tokens are temporarily burned and can be retrieved through a democracy proposal. A combination of both `RefundSurplus` and `DepositAsset` XCM instructions can prevent assets from getting trapped

To verify that the remote EVM call through XCM was successful, you can head to the [contract's page in Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#readContract){target=_blank} and verify the new value for the number and its timestamp.

## Remote EVM Call Transaction by Hash {: #remove-evm-call-txhash}

As mentioned before, there are some [differences between regular and remote XCM EVM calls]( #differences-regular-remote-evm). Some main differences can be seen when retrieving the transaction by its hash using the Ethereum JSON-RPC.

To do so, you first need to retrieve the transaction hash you want to query. For this example, you can use the transaction hash from the [previous section](#build-remove-evm-call-xcm), which is [0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f](https://moonbase.moonscan.io/tx/0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f){target=_blank}. Open the terminal, and execute the following command:

```sh
curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"eth_getTransactionByHash",
    "params": ["0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f"]
  }
'
```

If the JSON-RPC request is sent correctly, the response should look like this:

```json
{
    "jsonrpc": "2.0",
    "result": {
        "hash": "0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f",
        "nonce": "0x129",
        "blockHash": "0xeb8222567e434215f472f0c53f68a606c77ea8f475e5fbc3a5b715db6cce8887",
        "blockNumber": "0x46c268",
        "transactionIndex": "0x0",
        "from": "0xdd2399f3b5ca0fc584c4637283cda4d73f6f87c0",
        "to": "0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8",
        "value": "0x0",
        "gasPrice": "0x0",
        "maxFeePerGas": "0x0",
        "maxPriorityFeePerGas": "0x0",
        "gas": "0x25d78",
        "input": "0xd09de08a",
        "creates": null,
        "raw": "0x02eb820507820129808083025d7894a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d88084d09de08ac0010101",
        "publicKey": "0x14745b9075ac0f0426c61c9a2895f130ea6f3b964e8f49cefdb4e2d248306f19396361d877f8b9ad60a94a5ec28325a1b9baa2ae59e7a9f6fe1731caec130ab4",
        "chainId": "0x507",
        "standardV": "0x1",
        "v": "0x1",
        "r": "0x1",
        "s": "0x1",
        "accessList": [],
        "type": "0x2"
    },
    "id": 1
}
```

Note that the `v-r-s` values are set to `0x1`, and the gas price-related fields are set to `0x0`. In addition, the `nonce` field corresponds to a global nonce of the [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}, and not the transaction count of the dispatcher account.

!!! note
    You might be able to find some transaction hash collisions in the Moonbase Alpha TestNet, as early versions of remote EVM calls through XCM did not use a global nonce of the [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.
