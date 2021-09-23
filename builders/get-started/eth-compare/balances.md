---
title: Account Balances
description: A description of the main differences that Ethereum developers need to understand in terms of account balances on Moonbeam.
---

## Introduction

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important Moonbeam differences that developers should know and understand in terms of account balances.

This guide will outline some of these main differences and what to expect when using Moonbeam for the first time.

## Ethereum Account Balances

An account on Ethereum is an entity with a token balance (Ether or ETH in this case). Account-holders can send Ether transactions on Ethereum and can be controlled by either users (with the private key for signing) or smart contracts.

Therefore, Ethereum has two main types of accounts: user-owned and contract-owned. No matter the type, an Ethereum account has a single balance field that represents the number of Wei owned by this address, where Wei is a denomination of ETH (1 x 10^18 Wei per ETH).

_An image will be here_

## Moonbeam Account Balances

An account on Moonbeam is also an entity with a token balance (the token will depend on the network). Like on Ethereum, account holders can send token transactions on the Moonbeam Network they are connected to. In addition, accounts can be controlled by users (with the private key for signing) or smart contracts.

As with Ethereum, there are two main type of accounts: user-owned and contract owned. There are [proxy accounts](https://wiki.polkadot.network/docs/learn-proxies) within user-owned accounts, which can perform a limited number of actions on behalf of another account. However, in terms of balances, all of Moonbeam account types have four (4) different [balance types](https://wiki.polkadot.network/docs/learn-accounts#balance-types):

 - **Free** — refers to the balance that can be used. The `free` balance is also what is available for the Ethereum API on Moonbeam. For example, this is the balance displayed by MetaMask
 - **Reserved** — refers to the balance held due to on-chain requirements and can be freed by performing some on-chain action. For example, funds that are being staked at a protocol level (parachain staking) are shown as `reserved balance`. These funds are **not** accessible via the Ethereum API until they are freed
 - **Misc frozen** — represents a balance that the `free` balance may not drop below when withdrawing funds, except for transaction fee payment. For example, funds being used to vote on a governance proposal are shown as `misc frozen`. These funds are **not** accessible via the Ethereum API until they are freed
  **Fee frozen** — represents a balance that the `free` balance may not drop below when specifically paying for transaction fees. These funds are **not** accessible via the Ethereum API until they are freed

_An image will be here_

## Main Differences

The main difference between account balances on Ethereum and Moonbeam lies in the concept of a locked balance in Moonbeam. These are tokens that are still owned by that account, but they are not spendable.

From the Ethereum's API perspective, an account might show that it has a certain balance (called `free` balance). After an on-chain action, this value might increase (or decrease) without and actual balance transfer.