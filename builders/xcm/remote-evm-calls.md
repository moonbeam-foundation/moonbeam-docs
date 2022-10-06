---
title: Remote EVM Calls Through XCM
description: How to do remote call to Moonbeam EVM from other chains through XCM, and tap into the Moonbeam EVM ecosystem from any parachain in the Polkadot ecosystem
---

# Remote EVM Calls Through XCM

![Remote EVM Calls Banner](/images/builders/xcm/remove-evm-calls/xcmevm-banner.png)

## Introduction {: #introduction}

The [XCM-transactor pallet](/builders/xcm/xcm-transactor/){target=_blank} provides a simple interface to perform remote cross-chain calls through XCM. However, this does not consider the possibility to do remote calls to Moonbeam's EVM.

Moonbeam's EVM is only accesible through the [Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}. Among many other things, this pallet handles validating transactions before going into the transaction pool. Then, it performs another validation step before inserting a transaction from the pool in a block. Lastly, it provides the interface through a `transact` function to execute a validated transaction. All these steps follow the same behaviour as an Ethereum transaction, in terms of structure and signature scheme.

However, calling the [Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank} directly through an XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} is not feasible. Mainly because the dispatcher account for the remote EVM call (referred to as `msg.sender` in  Ethereum) does not sign the XCM transaction on the Moonbeam side. The XCM extrinsic is signed in the origin chain, and the XCM executor dispatches the call, through the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} instruction, from a kwown caller linked to the sender in the origin chain. In this context, the Ethereum pallet will not be able to verify the signature, and ultimately, validate the transaction.

To this end, the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank} was introduced. It acts as a middleware between the XCM [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank} instruction and the [Ethereum pallet](https://github.com/paritytech/frontier/tree/master/frame/ethereum){target=_blank}, as special considerations need to be made when performing EVM calls remotely through XCM. The pallet performs the necessary checks and validates transaction. Next, the pallet calls the Ethereum pallet to dispatch the transaction to the EVM. Due to the difference of how the EVM is accessed, there are some differences between regular and remote EVM calls.

This guide will go through the differences between regular and remote EVM calls. In addition, it will show you perform remote EVM calls through the two extrinsics exposed by the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}. 

!!! note
    Remote EVM calls are done through the [XCM-transactor pallet](/builders/xcm/xcm-transactor/){target=_blank}. Therefore, it is recommended to get familiar with XCM-transactor concepts before trying to perform remote EVM calls through XCM.

**Note that remote calls to Moonbeam's EVM through XCM is still being actively developed**. In addition, **developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Relevant XCM Definitions {: #general-xcm-definitions }

 - **Derivative accounts** — an account derivated from another account. Derivative accounts are keyless (the private key is unknown). Consequently, derivative accounts related to XCM-specific use cases can only be accessed through XCM extrinsics. For remote EVM calls, the main type is:
  
     - **Multilocation-derivative account** — this produces a keyless account derivated from the new origin set by the [`Descend Origin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} XCM instruction, and the provided mulitlocation. For Moonbeam-based networks, [the derivation method](https://github.com/PureStake/moonbeam/blob/master/primitives/xcm/src/location_conversion.rs#L31-L37){target=_blank} is calculating the `blake2` hash of the multilocation, which includes the origin parachain ID, and truncating the hash to the correct length (20 bytes for Ethereum-styled account). The XCM call [origin conversion](https://github.com/paritytech/polkadot/blob/master/xcm/xcm-executor/src/lib.rs#L343){target=_blank} happens when the `Transact` instruction gets executed. Consequently, each parachain can convert the origin with its own desired procedure, so the user who initiated the transaction might have a different derivative account per parachain. This derivative account pays for transaction fees, and it is set as the dispatcher of the call

 - **Transact information** — relates to extra weight and fee information for the XCM remote execution part of the XCM-transactor extrinsic. This is needed because the XCM transaction fee is paid by the sovereign account. Therefore, XCM-transactor calculates what this fee is and charges the sender of the XCM-transactor extrinsic the estimated amount in the corresponding [XC-20 token](/builders/xcm/xc20/overview/){target=_blank}, to repay the sovereign account

## Differences Between Regular and Remote EVM Calls Through XCM

As explained in the [introduction](#introduction), the paths that a regular and remote EVM call takes to get to the EVM is quite different. The main reason behind this difference is in the dispatcher of the transaction.

A regular EVM call has a clear sender, that is who signed the Ethereum transaction. With remote EVM calls, the signer signed an XCM transaction in another chain. Moonbeam receives that XCM message which must be constructed with the following instructions:

 - [`Descend Origin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank}
 - [`WithdrawAsset`](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank} 
 - [`BuyExecution`](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} 
 - [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} 

The first instruction, `DescendOrigin`, will mutate the origin of the XCM call on the Moonbeam side to a keyless account, through the `Multilocation-derivative account` mechanism described in the [Relevant XCM Definitions section](#general-xcm-definitions). The remote EVM call is dispatched from that keyless account (or a related [proxy](/tokens/manage/proxy-accounts/){target=_blank}), therefore this transaction is not signed (it does not have the real `v-r-s` values of the signature, but `0x1` instead).

Because a remote EVM call does not have the real `v-r-s` values of the signature, there could be collusion problems of the EVM transaction hash, as it is calculated as the Keccak256 hash of the signed transaction blob. If two accounts with the same nonce submit the same transaction object, they will end up with the same EVM transaction hash. Consequently, all remote EVM transactions use a global nonce that is attached to the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}.

Lastly, another major difference is in terms of the gas price. The fee of remote EVM calls is charged at a XCM execution level. Consequently, the EVM gas price is zero, and the EVM will not charge for the execution itself. This can also be seen in the receipt of a remote EVM call transaction.

In summary, there are three main differences between regular and remote EVM calls:

1. Remote EVM calls use a global nonce (owned by the [Ethereum-XCM pallet](https://github.com/PureStake/moonbeam/tree/master/pallets/ethereum-xcm){target=_blank}), instead of a nonce per account
2. The `v-r-s` values of the signature for remote EVM calls are `0x1`. The sender can't be retreive from the signature through standard methods (for example, through [ECRECOVER](/builders/pallets-precompiles/precompiles/eth-mainnet/#verify-signatures-with-ecrecover){target=_blank}). Nevertheless, the `from` is included in both the the transaction receipt and when getting the transaction by hash (using the Eth JSON RPC)
3. The gas price for all remote EVM calls is zero. The EVM execution is charged at an XCM execution level, and not at an EVM level

## Ethereum-XCM Pallet Interface {: #ethereum-xcm-pallet-interface}

### Extrinsics {: #extrinsics }

The Ethereum-XCM pallet provides the following extrinsics (functions):

 - **transact**(xcmTransaction) — only callable through XCM
 - **transactThroughProxy**(transactAs, xcmTransaction) — similar to the **transact** extrinsic, but with **transactAs** as an additional field. This function allows the remote EVM call to be dispatched from a given account. This account needs to have set the multilocation derivative as an **any** type proxy. On the contrary, the dispatch of the remote EVM call will fail

Where the inputs that need to be provided can be defined as:

 - **xcmTransaction** — XXX
 - **transactAs** — account from which the remote EVM call will be dispatched from. This account needs to have set the multilocation derivative as an **any** type proxy

## Building an remote EVM call through XCM with the XCM-Transactor Pallet {: #build-remove-evm-call-xcm}

This guide covers building an XCM message for remote EVM calls using the XCM pallet from the relay chain to Moonbase Alpha. More specifically, it will use the `transact` function. The steps to use the `transactThroughProxy` function are identical, you'll need to provide the **transactAs** account, and make sure that this account has set the multilocation derivative as an **any** type proxy.

### Checking Prerequisites {: #ethereumxcm-check-prerequisites}

To be able to send the extrinsics in Polkadot.js Apps from the relay chain, you need to have:

 - An [account](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/accounts){target=_blank} on the relay chain with funds (`UNIT`) to pay for the transaction fees. You can acquire some `xcUNIT` by swapping for DEV tokens (Moonbase Alpha's native token) on [Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=_blank}, a demo Uniswap-V2 clone on Moonbase Alpha, and them [send them to the relay chain](/builders/xcm/xc20/xtokens/){target_blank}. On the contrary, you can [contact us](https://discord.gg/PfpUATX){target=_blank} to get some `UNIT` tokens directly

 - Fund the **multilocation-derivative account**, which you can obtained by following the steps [in the next section](#calculate-multilocation-derivative){target=_blank}. The account must have enough DEV tokens to cover the cost of the XCM execution of the remote EVM call. Note that this is the account where the remote EVM call will be dispatch from Consequently, the account will need to satisfy whatever conditions are requred for the EVM call to be executed correctly. For example, hold any relevant ERC-20 token if you are doing an ERC-20 transfer
 
!!! note
    If you are using the `transactAs` function, the **transactAs** account is the one that needs to hold the DEV tokens to cover the cost of the XCM execution of the remote EVM call, and it will need to satisfy whatever conditions are required for the EVM call to be executed correctly.

### Calculating the Multilocation-Derivative Account {: #calculate-multilocation-derivative}

As mentioned before, a remote EVM call is dispatched from an account called the **multilocation-derivative account**. This is calculated using the information provided by the [`Descend Origin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instruction. Consequently, the calculated account depends directly on how the instruction is constructed.

For example, from the relay chain, the [`Descend Origin`](https://github.com/paritytech/xcm-format#descendorigin){target=_blank} instructions is natively injected by the [`xcmPallet`](https://github.com/paritytech/polkadot/blob/master/xcm/pallet-xcm/src/lib.rs){target=_blank}. In the case of Moonbase Alpha's relay chain (based on Westend), is with the following format:

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

Where `named` value corresponds to `Westend` (in this example), and the `decodedAddress` corresponds to the address of the account who signed the transaction on the relay chain (in a 64 bytes format). When the XCM instruction gets to Moonbeam (Moonbase Alpha in this example), it is reanchored as follows:

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
Therefore, you can use this [calculate **multilocation-derivative account** script](https://github.com/albertov19/xcmTools/blob/main/calculateMultilocationDerivative.ts){target=_blank} to help you obtain its value. This example uses Alice's relay chain account, which decoded value is `0x26cf24c4f6f16e13422d11670db82ab3f537b98a7dbd851a8cb85fbc4050d64e`. Consequently, you can obtain its **multilocation-derivative account** for Moonbase Alpha's relay chain by running the following command:

```sh
ts-node calculateMultilocationDerivative.ts \
--w wss://wss.api.moonbase.moonbeam.network \
--a 0x26cf24c4f6f16e13422d11670db82ab3f537b98a7dbd851a8cb85fbc4050d64e \
--n 0x57657374656e64
```

The execution of the code should provide the following response:

```sh
{"parents":1,"interior":{"x1":{"accountId32":{"network":{"named":"0x57657374656e64"},"id":"0x26cf24c4f6f16e13422d11670db82ab3f537b98a7dbd851a8cb85fbc4050d64e"}}}}
32 byte address is 0xbf67dcc77cff57b8ddd2d25d61f6876f4e6e2fdd55db2c47f70dfffc352d6889
20 byte address is 0xbf67dcc77cff57b8ddd2d25d61f6876f4e6e2fdd
```

For this example, the **multilocation-derivative account** for Moonbase Alpha is `0xbf67dcc77cff57b8ddd2d25d61f6876f4e6e2fdd`.

### Etherem-XCM Transact Function {: #ethereumxcm-transact}

In this example, you'll build an XCM message to execute a remote EVM call in Moonbase Alpha from its relay chain through the [`Transact`](https://github.com/paritytech/xcm-format#transact){target=_blank} XCM instruction and the `transact` function of the Ethereum-XCM pallet.

If you've [checked the prerequisites](#ethereumxcm-check-prerequisites), head to the extrinsic page of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics} and set the following options:

1. Select the account from which you want to send the XCM. Make sure the account complies with all the [prerequisites](ethereumxcm-check-prerequisites)
2. Choose the **xcmPallet** pallet
3. Choose the **send** extrinsic
4. Set the destination version to **v1**
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
6. Set the message version to **v2**
7. Add three elements and configure them in the following way:
5. Enter the index of the derivative account you've been registered to. For this example, the index value is `42`. Remember that the derivate account depends on the index
6. Set the currency ID to **ForeignAsset**. This is because you are not transferring DEV tokens (*SelfReserve*)
7. Enter the asset ID. For this example, `xcUNIT` has an asset id of `42259045809535163221576417993425387648`. You can check all available assets IDs in the [XC-20 address section](/builders/xcm/xc20/overview/#current-xc20-assets){target=_blank} 
8. Set the destination weight. The value must include the `asDerivative` extrinsic as well. However, the weight of the XCM instructions is added by the XCM-transactor pallet. For this example, `1000000000` is enough
9.  Enter the inner call that will be executed in the destination chain. This is the encoded call data of the pallet, method, and input values to be called. It can be constructed in Polakdot.js Apps (must be connected to the destination chain), or using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=_blank}. For this example, the inner call is `0x04000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8`, which is a simple balance transfer of 1 `UNIT` to Alice's account in the relay chain. You can decode the call in [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/extrinsics/decode){target=_blank}
10. Click the **Submit Transaction** button and sign the transaction

!!! note
    The encoded call data for the extrinsic configured above is `0x2103002a00018080778c30c20fa2ebc0ed18d2cbca1f00ca9a3b00000000a404000030fcfb53304c429689c8f94ead291272333e16d77a2560717f3a7a410be9b208070010a5d4e8`.

![XCM-Transactor Transact Through Derivative Extrinsic](/images/builders/xcm/xcm-transactor/xcmtransactor-1.png)

Once the transaction is processed, you can check the relevant extrinsics and events in [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer/query/0x14cebfb2b4a4c0bf72cb2562344e6803263f45491d2ab14e7b91115ebd52e706){target=_blank} and the [relay chain](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Ffrag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network#/explorer/query/0x630456e6578d5b414db2e83486a6961ff90dc06bf979988b370dcb0e57550e41){target=_blank}. Note that, in Moonbase Alpha, there is an event associated to the `transactThroughDerivative` method, but also some `xcUNIT` tokens are burned to repay the sovereign account for the transactions fees. In the relay chain, the `paraInherent.enter` extrinsic shows a `balance.Transfer` event, where 1 `UNIT` token is transferred to Alice's address. Still, the transaction fees are paid by the Moonbase Alpha sovereign account.

## Retrieve Registered Derivative Indexes

To fetch a list of all registered addresses allowed to operate through the Moonbeam-based network sovereign account and their corresponding indexes, head to the **Chain State** section of [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/chainstate){target=_blank} (under the **Developer** tab). In there, take the following steps:

1. From the **selected state query** dropdown, choose **xcmTransactor**
2. Select the **indexToAccount** method
3. (Optional) Disable/enable the include options slider. This will allow you to query the address authorized for a given index or request all addresses for all registered indexes
4. If you've enabled the slider, enter the index to query
5. Send the query by clicking on the **+** button

![Check Registered Derivative Indexes](/images/builders/xcm/xcm-transactor/xcmtransactor-2.png)

## XCM-Transactor Precompile {: #xcmtransactor-precompile}

The XCM-transactor precompile contract allows developers to access the XCM-transactor pallet features through the Ethereum API of Moonbeam-based networks. Similar to other [precompile contracts](/builders/build/canonical-contracts/precompiles/){target=_blank}, the XCM-transactor precompile is located at the following addresses:

=== "Moonbeam"
     ```
     {{networks.moonbeam.precompiles.xcm_transactor}}
     ```

=== "Moonriver"
     ```
     {{networks.moonriver.precompiles.xcm_transactor}}
     ```

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.xcm_transactor}}
     ```

### The XCM-Transactor Solidity Interface {: #xcmtrasactor-solidity-interface } 

[XcmTransactor.sol](https://github.com/PureStake/moonbeam/blob/master/precompiles/xcm-transactor/XcmTransactor.sol){target=_blank} is an interface through which developers can interact with the XCM-transactor pallet using the Ethereum API.

The interface includes the following functions:

 - **index_to_account**(*uint16* index) — read-only function that returns the registered address authorized to operate using a derivative account of the Moonbeam-based network sovereign account for the given index
  - **transact_info**(*Multilocation* *memory* multilocation) — read-only function that, for a given chain defined as a multilocation, returns the transact information
  <!-- - **transact_info_with_signed**(*Multilocation* *memory* multilocation) — read-only function that, for a given chain defined as a multilocation, returns the transact information considering the 3 XCM instructions associated to the external call execution, but also returns extra weight information associated with the `decendOrigin` XCM instruction to execute the remote call  -->
 - **fee_per_second**(*Multilocation* *memory* multilocation) — read-only function that, for a given asset as a multilocation, returns units of token per second of the XCM execution that is charged as the XCM execution fee. This is useful when, for a given chain, there are multiple assets that can be used for fee payment
 - **transact_through_derivative**(*uint8* transactor, *uint16* index, *address*  address, *uint64* weight, *bytes* *memory* inner_call) — function that represents the `transactThroughDerivative` method described in the [previous example](#xcmtransactor-transact-through-derivative). Instead of the currency ID (asset ID), you'll need to provide the [assets precompile address](#xcmtransactor-check-prerequisites) for the `address` of the token that is used for fee payment
 - **transact_through_derivative_multilocation**(*uint8* transactor, *uint16* index, *Multilocation* *memory* fee_asset, *uint64* weight, *bytes* *memory* inner_call) — function that represents the `transactThroughDerivativeMultilocation` method. It is very similar `transact_through_derivative`, but you need to provide the asset multilocation of the token that is used for fee payment instead of the XC-20 token `address`

### Building the Precompile Multilocation {: #building-the-precompile-multilocation }

In the XCM-transactor precompile interface, the `Multilocation` structure is defined as follows:

--8<-- 'text/xcm/xcm-precompile-multilocation.md'

The following code snippet goes through some examples of `Multilocation` structures, as they would need to be fed into the XCM-transactor precompile functions:


```js
// Multilocation targeting the relay chain asset from a parachain
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

// Multilocation targeting aUSD asset on Acala
{
    1, // parents = 1
    // Size of array is 1, meaning is an X1 interior
    [
        "0x00000007D0", // Selector Parachain, ID = 2000 (Acala)
        "0x060001" // General Key Selector + Asset Key
    ]
}
```