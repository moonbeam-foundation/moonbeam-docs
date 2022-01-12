---
title: Transfers API
description: A description of the main differences that developers need to understand in terms of the different balance transfers available on Moonbeam.
---

![Moonbeam v Ethereum - Transfers API Banner](/images/builders/get-started/eth-compare/transfers-api-banner.png)

## Introduction

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important Moonbeam differences that developers should know and understand in terms of balance transfers of the base network token (for example, GLMR and MOVR).

Token holders have two ways of initiating a balance transfer on Moonbeam. On one hand, users can use the Ethereum API via apps like MetaMask, MathWallet, or any other tools that use the Ethereum JSON-RPC. On the other hand, users can use the Substrate API, via the Polkadot.js Apps website, or directly using the Substrate RPC.

Developers need to be aware that token holders can leverage both APIs to transfer the base layer network token. Note that these comments do not apply to transfers of other assets like ERC-20 based assets in the Moonriver or Moonbeam EVMs. Transfers of these assets are only done via the Ethereum APIs since these are smart contract interactions.

This guide will outline some of these main differences around both APIs for base layer network token balance transfers and what to expect when using Moonbeam for the first time.

## Ethereum Transfers

A simple balance transfer using the Ethereum API relies on the `eth_sendRawTransaction` JSON RPC. This can be directly from one account to another or via a smart contract.

There are different strategies to listen for transfers or balance changes on Ethereum, which are not covered in this documentation. But they are all focused on different strategies using the Ethereum JSON RPC.

## Moonbeam Transfers

As stated before, Moonbeam enables token holders to execute base layer network token transfers via both the Ethereum and Substrate API. There are multiple scenarios to trigger token transfer on Moonbeam. Consequently, to monitor all transfers, **you should use the Polkadot.js SDK** (Substrate API).

Before going over the different scenarios, there are two different elements associated with a block:

 - **Extrinsic** — refers to state changes that originated outside of the system itself. The most common form of extrinsic is a transaction. They are ordered by execution
 - **Events** — refers to logs generated from the extrinsic. There can be multiple events per extrinsic. They are ordered by execution

The different transfer scenarios are:

 - **Substrate transfer** — it will create an extrinsic, either `balances.transfer` or `balances.transferKeepAlive`. It will trigger **one** `balances.Transfer` event
 - **Substrate feature** — some native Substrate features can create extrinsic that would send tokens to an address. For example, [Treasury](/learn/features/treasury/) can create an extrinsic such as `treasury.proposeSend`, which will trigger **one or multiple** `balances.Transfer` events
 - **Ethereum transfer** — it will create an `ethereum.transact` extrinsic, with an empty input. It will trigger **one** `balances.Transfer` event
 - **Ethereum transfers via smart contracts** — it will create an `ethereum.transact` extrinsic, with some data as input. It will trigger **one or multiple** `balances.Transfer` events

All the scenarios described above will effectively transfer base layer network tokens. The easiest way to monitor them all is to rely on the `balances.Transfer` event.

## Monitor All Balance Transfers with the Substrate API

The [Polkadot.js API package](https://polkadot.js.org/docs/api/start) provides developers a way to interact with Substrate chains using Javascript.

The following code snippet uses Polkadot.js to loop through each event fetched from the provider. Then, it checks it corresponds to a `balances.Transfer` event. If so, it will extract the `from`, `to` and `amount` of the transfer and display it on the console. Note that the `amount` is shown in the smallest unit (Wei).  You can find all the available information about Polkadot.js and the Substrate JSON RPC in their [official documentation site](https://polkadot.js.org/docs/substrate/rpc).

--8<-- 'code/vs-ethereum/balance-event.md'

In addition, you can find more code snippets related to more specific cases around balance transfers in [this script](https://gist.github.com/crystalin/b2ce44a208af60d62b5ecd1bad513bce).
