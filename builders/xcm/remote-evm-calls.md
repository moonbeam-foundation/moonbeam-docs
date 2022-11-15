---
title: Remote EVM Calls Through XCM
description: How to do remote calls to smart contracts on Moonbeam EVM through XCM from any Polkadot parachain that has an XCM channel established with Moonbeam.
---

# Remote EVM Calls Through XCM

![Remote EVM Calls Banner](/images/builders/xcm/remote-evm-calls/xcmevm-banner.png)

## Introduction {: #introduction}

The [XCM-transactor pallet](/builders/xcm/xcm-transactor/){target=_blank} provides a simple interface to perform remote cross-chain calls through XCM. However, this does not consider the possibility of doing remote calls to Moonbeam's EVM, only to Substrate specific pallets (functionalities).

Moonbeam's EVM is only accessible through the [Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}. Among many other things, this pallet handles certain validations of transactions before getting them into the transaction pool. Then, it performs other validation step before inserting a transaction from the pool in a block. Lastly, it provides the interface through a `transact` function to execute a validated transaction. All these steps follow the same behavior as an Ethereum transaction in terms of structure and signature scheme.

However, calling the [Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank} directly through an XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} is not feasible. Mainly because the dispatcher account for the remote EVM call (referred to as `msg.sender` in  Ethereum) does not sign the XCM transaction on the Moonbeam side. The XCM extrinsic is signed in the origin chain, and the XCM executor dispatches the call, through the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} instruction, from a known caller linked to the sender in the origin chain. In this context, the Ethereum pallet will not be able to verify the signature and, ultimately, validate the transaction.

To this end, the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} was introduced. It acts as a middleware between the XCM [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} instruction and the [Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}, as special considerations need to be made when performing EVM calls remotely through XCM. The pallet performs the necessary checks and validates the transaction. Next, the pallet calls the Ethereum pallet to dispatch the transaction to the EVM. Due to how the EVM is accessed, there are some differences between regular and remote EVM calls.

The happy path for both regular and remote EVM calls through XCM is portrayed in the following diagram:

![Happy parth for regular and remote EVM calls through XCM](/images/builders/xcm/remote-evm-calls/xcmevm-1.png)

This guide will go through the differences between regular and remote EVM calls. In addition, it will show you how to perform remote EVM calls through the extrinsic exposed by the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}. 

!!! note
    Remote EVM calls are done through the [XCM-transactor pallet](/builders/xcm/xcm-transactor/){target=_blank}. Therefore, it is recommended to get familiar with XCM-transactor concepts before trying to perform remote EVM calls through XCM.

**Note that remote calls to Moonbeam's EVM through XCM are still being actively developed**. In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions {: #general-xcm-definitions }

--8<-- 'text/xcm/general-xcm-definitions2.md'

 - **Derivative accounts** — an account derivated from another account. Derivative accounts are keyless (the private key is unknown). Consequently, derivative accounts related to XCM-specific use cases can only be accessed through XCM-related extrinsics. For remote EVM calls, the primary type is:
     - **Multilocation-derivative account** — this produces a keyless account derivated from the new origin set by the [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM instruction, and the provided multilocation. For Moonbeam-based networks, [the derivation method](https://github.com/PureStake/moonbeam/blob/master/primitives/xcm/src/location_conversion.rs#L31-L37){target=_blank} is calculating the `blake2` hash of the multilocation, which includes the origin parachain ID, and truncating the hash to the correct length (20 bytes for Ethereum-styled account). The XCM call [origin conversion](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L343){target=_blank} happens when the `Transact` instruction gets executed. Consequently, each parachain can convert the origin with its own desired procedure, so the user who initiated the transaction might have a different derivative account per parachain. This derivative account pays for transaction fees, and it is set as the dispatcher of the call

 - **Transact information** — relates to extra weight and fee information for the XCM remote execution part of the XCM-transactor extrinsic. This is needed because the sovereign account pays the XCM transaction fee. Therefore, XCM-transactor calculates what the fee is and charges the sender of the XCM-transactor extrinsic the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/){target=_blank} to repay the sovereign account

## Differences Between Regular and Remote EVM Calls Through XCM {: #differences-regular-remote-evm}

As explained in the [Introduction](#introduction), the paths that regular and remote EVM calls take to get to the EVM are quite different. The main reason behind this difference is the dispatcher of the transaction.

A regular EVM call has an apparent sender who signs the Ethereum transaction with its private key. The signature, of ECDSA type, can be verified with the signed message and the `r-s` values that are produced from the signing algorithm. Ethereum signatures use an additional variable, called `v`, which is the recovery identifier.

With remote EVM calls, the signer signed an XCM transaction in another chain. Moonbeam receives that XCM message which must be constructed with the following instructions:

 - [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} 
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} 
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} 

The first instruction, `DescendOrigin`, will mutate the origin of the XCM call on the Moonbeam side to a keyless account through the **multilocation-derivative account** mechanism described in the [Relevant XCM Definitions section](#general-xcm-definitions). The remote EVM call is dispatched from that keyless account (or a related [proxy](/tokens/manage/proxy-accounts/){target=_blank}). Therefore, because the transaction is not signed, it does not have the real `v-r-s` values of the signature, but `0x1` instead.

Because a remote EVM call does not have the actual `v-r-s` values of the signature, there could be collision problems of the EVM transaction hash, as it is calculated as the keccak256 hash of the signed transaction blob. In consequence, if two accounts with the same nonce submit the same transaction object, they will end up with the same EVM transaction hash. Therefore, all remote EVM transactions use a global nonce that is attached to the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.

Another significant difference is in terms of the gas price. The fee for remote EVM calls is charged at an XCM execution level. Consequently, the gas price at an EVM level is zero, and the EVM will not charge for the execution itself. This can also be seen in the receipt of a remote EVM call transaction. Accordingly, the XCM message must be configured so that the `BuyExecution` buys enough weight to cover the gas cost.

The last difference is in terms of gas limit. Ethereum uses a gas-metered system to moderate the amount of execution that can be done in a block. On the contrary, Moonbeam uses a [weight-based system](https://docs.substrate.io/build/tx-weights-fees/){target=_blank}, in which each call is characterized by the time it takes to execute in a block. Each unit of weight corresponds to one picosecond of execution time.

The configuration of the XCM queue suggests that XCM messages should be executable within `20,000,000,000` weight units (that is, `0.02` seconds of block execution time). Suppose the XCM message can't be executed due to the lack of execution time in a given block, and the weight requirement is over `20,000,000,000`. In that case, the XCM message will be marked as `overweight` and would only be executable through democracy.

The `20,000,000,000` weight limit per XCM message constrains the gas limit available for remote EVM calls through XCM. For all Moonbeam-based networks, there is a ratio of [`25,000` units of gas per unit of weight](https://github.com/PureStake/moonbeam/blob/master/runtime/moonbase/src/lib.rs#L371-L375){target=_blank}. Considering that you need some of the XCM message weight to execute the XCM instructions themselves. Therefore, a remote EVM call might have around `18,000,000,000` weight left, which is `720,000` gas units. Consequently, the maximum gas limit you can provide for a remote EVM call is around `720,000` gas units. Note that this might change in the future.

In summary, these are the main differences between regular and remote EVM calls:

1. Remote EVM calls use a global nonce (owned by the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}) instead of a nonce per account
2. The `v-r-s` values of the signature for remote EVM calls are `0x1`. The sender can't be retrieved from the signature through standard methods (for example, through [ECRECOVER](/builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover){target=_blank}). Nevertheless, the `from` is included in both the transaction receipt and when getting the transaction by hash (using the Ethereum JSON RPC)
3. The gas price for all remote EVM calls is zero. The EVM execution is charged at an XCM execution level and not at an EVM level
4. The current maximum gas limit you can set for a remote EVM call is `720,000` gas units

## Ethereum-XCM Pallet Interface {: #ethereum-xcm-pallet-interface}

### Extrinsics {: #extrinsics }

The Ethereum-XCM pallet provides the following extrinsics (functions) that can be called by the `Transact` instruction to access Moonbeam's EVM through XCM:

 - **transact**(xcmTransaction) — function to remotely call the EVM through XCM. Only callable through the execution of an XCM message
 - **transactThroughProxy**(transactAs, xcmTransaction) — similar to the `transact` extrinsic, but with `transactAs` as an additional field. This function allows the remote EVM call to be dispatched from a given account with known keys (the `msg.sender`). This account needs to have set the **multilocation-derivative account** as a proxy of type `any` on Moonbeam. On the contrary, the dispatch of the remote EVM call will fail. Transaction fees are still paid by the **multilocation-derivative account**

Where the inputs that need to be provided can be defined as:

 - **xcmTransaction** — contains the Ethereum transaction details of the call that will be dispatched. This includes the call data, `msg.value` and gas limit
 - **transactAs** — account from which the remote EVM call will be dispatched (the `msg.sender`). The account set in this field needs to have set the **multilocation-derivative account** as a proxy of type `any` on Moonbeam. Transaction fees are still paid by the **multilocation-derivative account**

## Building a Remote EVM call through XCM {: #build-remove-evm-call-xcm}

This guide covers building an XCM message for remote EVM calls using the XCM pallet from the relay chain to Moonbase Alpha. More specifically, it will use the `transact` function. The steps to use the `transactThroughProxy` function are identical. However, you'll need to provide the `transactAs` account and ensure that this account has set the **multilocation-derivative account** as a proxy of type `any` on Moonbase Alpha.

!!! note
    When using `transactThroughProxy`, the EVM call is dispatched by the **transactAs** account you provide, acting as the `msg.sender`, as long as this account has set the the **multilocation-derivative account** as a proxy of type `any` in the Moonbeam-based network you are using. However, transaction fees are still paid by the **multilocation-derivative account**, so you need to ensure it has enough funds to cover them.

### Checking Prerequisites {: #ethereumxcm-check-prerequisites}

To be able to send the call in Polkadot.js Apps from the relay chain, you need to have the following:

 - An [account](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} on the relay chain with funds (`UNIT`) to pay for the transaction fees. You can acquire some `xcUNIT` by swapping for DEV tokens (Moonbase Alpha's native token) on [Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}, a demo Uniswap-V2 clone on Moonbase Alpha, and then [send them to the relay chain](/builders/xcm/xc20/xtokens/){target_blank}. Additionally, you can [contact us](https://discord.gg/PfpUATX){target=_blank} to get some `UNIT` tokens directly

 - Fund the **multilocation-derivative account**, which you can obtain by following the steps [in the next section](#calculate-multilocation-derivative){target=_blank}. The account must have enough DEV tokens (or GLMR/MOVR for Moonbeam/Moonriver) to cover the cost of the XCM execution of the remote EVM call. Note that this is the account from which the remote EVM call will be dispatched (the `msg.sender`). Consequently, the account must satisfy whatever conditions are required for the EVM call to be executed correctly. For example, hold any relevant ERC-20 token if you are doing an ERC-20 transfer
 
!!! note
    Suppose you are using the `transactThroughProxy` function. In that case, the `transactAs` account must satisfy whatever conditions are required for the EVM call to be executed correctly, as it acts as the `msg.sender`. However, the **multilocation-derivative account** is the one that needs to hold the DEV tokens (or GLMR/MOVR for Moonbeam/Moonriver) to cover the cost of the XCM execution of the remote EVM call.

### Calculating the Multilocation-Derivative Account {: #calculate-multilocation-derivative}

As mentioned before, a remote EVM call is dispatched from an account called the **multilocation-derivative account**. This is calculated using the information provided by the [`Descend Origin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction. Consequently, the computed account depends directly on how the instruction is constructed.

For example, from the relay chain, the [`DescendOrigin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction is natively injected by the [`XCM Pallet`](https://github.com/paritytech/polkadot/blob/master/xcm/pallet-xcm/src/lib.rs){target=_blank}. In the case of Moonbase Alpha's relay chain (based on Westend), is with the following format (a multilocation junction):

```
{
  "descendOrigin":
    {
    "x1":
      {
        "accountId32":
        {
          "network":
          {
            "named":"0x57657374656e64"
          },
        "id":"decodedAddress"
        }  
      }
  }
}
```

Where the `named` value corresponds to "Westend" in hex (in this example), and the `decodedAddress` corresponds to the address of the account who signed the transaction on the relay chain (in a 64 bytes format). When the XCM instruction gets executed in Moonbeam (Moonbase Alpha in this example), the origin will have mutated to the following multilocation:

```
{
  "descendOrigin":
    {
    "parents":1,
    "interior":
    {
      "x1":
      {
        "accountId32":
        {
          "network":
          {
            "named":"0x57657374656e64"
          },
         "id":"decodedAddress"
        }
      }
    }
  }
}
```
This is the multilocation used to calculate the **multilocation-derivative account**. You can use this [calculate **multilocation-derivative account** script](https://github.com/albertov19/xcmTools/blob/main/calculateMultilocationDerivative.ts){target=_blank} to help you obtain its value. This example uses Alice's relay chain account, where the decoded value is `0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f`. Consequently, you can obtain its **multilocation-derivative account** for Moonbase Alpha's relay chain by running the following command:

```sh
ts-node calculateMultilocationDerivative.ts \
--w wss://wss.api.moonbase.moonbeam.network \
--a 0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f \
--n 0x57657374656e64
```

The execution of the code should provide the following response:

```sh
{"parents":1,"interior":{"x1":{"accountId32":{"network":{"named":"0x57657374656e64"},"id":"0x78914a4d7a946a0e4ed641f336b498736336e05096e342c799cc33c0f868d62f"}}}}
32 byte address is 0x4e21340c3465ec0aa91542de3d4c5f4fc1def526222c7363e0f6f860ea4e503c
20 byte address is 0x4e21340c3465ec0aa91542de3d4c5f4fc1def526
```

For this example, the **multilocation-derivative account** for Moonbase Alpha is `0x4e21340c3465ec0aa91542de3d4c5f4fc1def526`. Note that only Alice is the only person who can access this account through a remote transact from the relay chain, as she is the owner of its private keys and the **multilocation-derivative account** is keyless.

### Ethereum-XCM Transact Call Data {: #ethereumxcm-transact-data}

Before you send the XCM message from the relay chain to Moonbase Alpha, you need to get the encoded call data that will be dispatched through the execution of the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM instruction. In this example, you'll build the encoded call data for the `transact` function of the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}. 

The encoded call data needs the contract interaction that will be executed via XCM. For this example, you'll be interacting with a simple [incrementer contract](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}, more specifically, the `increment` function. This function has no input argument and will increase the value of the `number` by one. Also, it will store the block's timestamp in which the function is executed to the `timestamp` variable. 

The encoded call data of the interaction with the `increment` function is `0xd09de08a`, which is the first eight hexadecimal characters (or 4 bytes) of the keccak256 hash of `increment()`. If the function has input parameters, they also need to be encoded. The easiest way to get the encoded call data is to emulate a transaction either in [Remix](/builders/build/eth-api/dev-env/remix/#interacting-with-a-moonbeam-based-erc-20-from-metamask){target=_blank} or [Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank}. Next, in Metamask, check the **HEX DATA: 4 BYTES** selector under the **HEX** tab before signing it. You don't need to sign the transaction. 

With the contract interaction data, you can build the encoded call data for the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} call. To do so, head to the extrinsics page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} and set the following options (note that the extrinsics page only shows when you have an account):

!!! note
    The current implementation of the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} does not support the `CREATE` operation. Therefore, you can't deploy a smart contract through remote EVM calls.

1. Choose the **ethereumXcm** pallet
2. Choose the **transact** method
3. Set the XCM transaction version to **V2**. The previous version is deprecated and will be removed in a future release
4. Set the gas limit to the desired value. It is recommended to manually execute an `eth_estimateGas` JSON RPC call to understand how much gas is needed. For this example, the gas limit was set to `71000`
5. Set the action to **Call**
6. Enter the address of the contract you want to interact with. For this example, it is the [incrementer contract](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=_blank} at address `0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8`
7. Set the value to `0`. Note that this is because this particular interaction does not need DEV (or GLMR/MOVR for Moonbeam/Moonriver). You'll need to modify this value accordingly
8. Enter the encoded call data of the interaction with the smart contract. For this example, it is `0xd09de08a`
9. Verify all the parameters, and copy the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} encoded call data

!!! note
    The encoded call data for the call configured above is `0x260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`.

![Ethereum-XCM pallet encoded call data](/images/builders/xcm/remote-evm-calls/xcmevm-2.png)

### Building the XCM for Remote XCM Execution {: #build-xcm-remote-evm}

In this example, you'll build an XCM message to execute a remote EVM call in Moonbase Alpha from its relay chain through the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM instruction and the `transact` function of the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.

If you've [checked the prerequisites](#ethereumxcm-check-prerequisites) and you've the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} [encoded call data](#ethereumxcm-transact-data), head to the extrinsics page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics){target=_blank} and set the following options:

1. Select the account from which you want to send the XCM. Make sure the account complies with all the [prerequisites](#ethereumxcm-check-prerequisites)
2. Choose the **xcmPallet** pallet
3. Choose the **send** method
4. Set the destination version to **V1**
5. To target Moonbase Alpha, set the destination to:
```
{
  "parents":0,
  "interior":
    {
    "x1":
      {
      "Parachain": 1000
    }
  }
}
```
6. Set the message version to **V2**
7. Add three items to the message and configure them in the following way (you may need to **Add item** for some of the instructions to add an asset):
```
{
  "WithdrawAsset":
    [
      {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
    ],
  "BuyExecution":
    {
      "fees": {
        "id":
          {
            "Concrete":
              {
                "parents": 0,
                "interior": {
                  "X1": {
                    "PalletInstance": 3
                  }
                }
              }
            "Fungible": 100000000000000000
          }
      },
      "weightLimit": "Unlimited"
    },
  "Transact":
    {
      "originType": "SovereignAccount",
      "requiredWeightAtMost": "4000000000",
      "call": {
        "encoded": "0x260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00"
      }

    }
}
```
8. Click the **Submit Transaction** button and sign the transaction

!!! note
    The encoded call data for the call configured above is 
    `0x630001000100a10f020c00040000010403001300008a5d78456301130000010403001300008a5d784563010006010300286bee7901260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`.

![Remote XCM Call from Relay Chain](/images/builders/xcm/remote-evm-calls/xcmevm-3.png)

Once the transaction is processed, you can check the relevant extrinsics and events in the [relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x2a0e40a2e5261e792190826ce338ed513fe44dec16dd416a12f547d358773f98){target=_blank} and [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x7570d6fa34b9dccd8b8839c2986260034eafef732bbc09f8ae5f857c28765145){target=_blank}. 

In the relay chain, the extrinsic is `xcmPallet.send`, and the associated event is `xcmPallet.Sent` (among others related to the fee). In Moonbase Alpha, the XCM execution happens within the `parachainSystem.setValidationData` extrinsic, and there are multiple associated events that can be highlighted:

 - **parachainSystem.DownwardMessagesReceived** — event that signals that a message from the relay chain was received. With the current XCM implementation, messages from other parachains will show the same event
 - **balances.Withdraw** — event related to the withdrawing of tokens to pay for the execution of the call. Note that the ``who`` address is the **multilocation-derivative account** calculated before
 - **ethereum.Executed** — event associated with the execution of the remote EVM call. It provides the ``from``, ``to``, ``transactionHash`` (calculated with the non-standard signature and global pallet nonce), and the ``exitReason``. Currently, some common EVM errors, like out of gas, will show ``Reverted`` in the exit reason
 - **polkadotXcm.AssetsTrapped** — event that is emitted when part of the tokens withdrawn from the account (for fees) was not used. Generally, this happens when you provide more weight than required or there is no associated XCM refund instruction. These tokens are temporarily burned and can be retrieved through a democracy proposal

To verify that the remote EVM call through XCM was successful, you can head to the [contract's page in Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#readContract){target=_blank} and verify the new value for the number and its timestamp.

## Remote EVM Call Transaction by Hash {: #remove-evm-call-txhash}

As mentioned before, there are some [differences between regular and remote XCM EVM calls]( #differences-regular-remote-evm). Some main differences can be seen when retrieving the transaction by its hash using the Ethereum JSON RPC.

To do so, you first need to retrieve the transaction hash you want to query. For this example, you can use the transaction hash from the [previous section](#build-remove-evm-call-xcm), which is [0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a](https://moonbase.moonscan.io/tx/0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a){target=_blank}. Open the terminal, and execute the following command:

```sh
curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"eth_getTransactionByHash",
    "params": ["0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a"]
  }
'
```

If the JSON RPC request is sent correctly, the response should look like this:

```JSON
{
    "jsonrpc": "2.0",
    "result": {
        "hash": "0x85735a6be6aa0b3ad5f6ce877d8b9048137876517d9ca5b309bcd93ae997bf7a",
        "nonce": "0x1",
        "blockHash": "0xc4b573da6943cc94e55c2fb429160c5b24d91a9da6798102a28dd611c3b76cc0",
        "blockNumber": "0x2e7cf1",
        "transactionIndex": "0x0",
        "from": "0x4e21340c3465ec0aa91542de3d4c5f4fc1def526",
        "to": "0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8",
        "value": "0x0",
        "gasPrice": "0x0",
        "maxFeePerGas": "0x0",
        "maxPriorityFeePerGas": "0x0",
        "gas": "0x11558",
        "input": "0xd09de08a",
        "creates": null,
        "raw": "0xa902e7800180808301155894a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d88084d09de08ac0010101",
        "publicKey": "0x3a9b57bdedea5ddd864355487de6285e032eb8798316da6848587c7f67d71a7a7592a1094ba2123f95659827f40a7096ab4fc278fdde688e3a90ee16eed5f720",
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

Note that the `v-r-s` values are set to `0x1`, and the gas price-related fields are set to `0x0`. In addition, the `nonce` field corresponds to a global nonce of the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}, and not the transaction count of the dispatcher account.

!!! note
    You might be able to find some transaction hash collisions in the Moonbase Alpha TestNet, as early versions of remote EVM calls through XCM did not use a global nonce of the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.

## XCM-Utils Precompile {: #xcmutils-precompile}

The XCM-utils precompile contract gives developers polkadot related utility functions directly within the EVM. This allows for easier transactions and interactions with other XCM related precompiles. Similar to other [precompile contracts](/builders/pallets-precompiles/precompiles/){target=_blank}, the XCM-utils precompile is located at the following addresses:

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xcm_utils}}
     ```

### The XCM-Utils Solidity Interface {: #xcmutils-solidity-interface } 
[XcmUtils.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-utils/XcmUtils.sol){target=_blank} is an interface to interact with the precompile.

!!! note
    The precompile will be updated in the future to include additional features. Feel free to suggest additional utility functions in the [Discord](https://discord.gg/PfpUATX){target=_blank}.

The interface includes the following functions:

 - **multilocationToAddress**(*Multilocation memory* multilocation) — read-only function that returns the multilocation-derivative account from a given multilocation
 - **weightMessage**(*bytes memory* message) — read-only function that returns the weight that an XCM message will consume on the chain. The message parameter must be a scale encoded xcm mversioned xcm message
 - **getUnitsPerSecond**(*Multilocation memory* multilocation) — read-only function that gets the units per second for a given asset in the form of a `Multilocation`. The multilocation must describe an asset that can be supported as a fee payment, such as an [external XC-20](/builders/xcm/xc20/xc20){target=_blank}, or else this function will revert

The `Multilocation` struct in the XCM-utils precompile is built the [same as the XCM-transactor](/builders/xcm/xcm-transactor#building-the-precompile-multilocation) precompile's `Multilocation`.