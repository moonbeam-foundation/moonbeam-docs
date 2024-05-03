---
title: Account Balances
description: A description of the main differences that Ethereum developers need to understand in terms of account balances on Moonbeam and how they differ from Ethereum.
---

# Moonbeam Account Balances

## Introduction {: #introduction }

While Moonbeam strives to be compatible with Ethereum's Web3 API and EVM, there are some important Moonbeam differences that developers should know and understand in terms of account balances.

One of the design goals of Moonbeam is to create an environment that is as close as possible to Ethereum, and to offer a set of Web3 RPC endpoints that are compatible with Ethereum. However, Moonbeam is also a Substrate based chain, which means that it exposes Substrate RPCs, and that it has integral functionality that is powered by Substrate such as Staking, Governance, and other features which are not part of the Ethereum API.

Moonbeam [unified accounts](/learn/core-concepts/unified-accounts/){target=\_blank} are one way that Moonbeam achieves Ethereum compatibility, by changing the underlying account type in the protocol to be Ethereum-like (H160 or 20 byte addresses starting with `0x`). Unified accounts are used by both the Substrate and Ethereum APIs, and map to the same underlying data storage on the blockchain. Nevertheless, there are important differences that users coming from Ethereum should understand when using Moonbeam accounts via the Ethereum API.

This guide will outline some of these main differences and what to expect when using Moonbeam for the first time.

## Ethereum Account Balances {: #ethereum-account-balances }

An account on Ethereum is an entity with a token balance (Ether or ETH in this case). Account-holders can send Ether transactions on Ethereum and accounts can be controlled by either users (with the private key for signing) or smart contracts.

Therefore, Ethereum has two main types of accounts: user-owned and contract-owned. No matter the type, an Ethereum account has a single balance field that represents the number of Wei owned by this address, where Wei is a denomination of ETH (1 x 10^18 Wei per ETH).

![Ethereum balances diagram](/images/learn/core-concepts/balances/balances-1.webp)

## Moonbeam Account Balances {: #moonbeam-account-balances }

An account on Moonbeam is also an entity with a token balance (the token will depend on the network). Like on Ethereum, account holders can send token transactions on the Moonbeam Network they are connected to. In addition, accounts can be controlled by users (with the private key for signing) or smart contracts.

As with Ethereum, there are two main types of accounts: user-owned and contract owned. However, on Moonbeam, within both account types, there are also [proxy accounts](https://wiki.polkadot.network/docs/learn-proxies/){target=\_blank}, which can perform a limited number of actions on behalf of another account. In terms of balances, all of Moonbeam account types have five (5) different [balance types](https://wiki.polkadot.network/docs/learn-accounts#balance-types/){target=\_blank}:

 - **Free** — refers to the balance that can be used (not locked/frozen) from the Substrate API. The concept of `free` balance depends on the action to be executed. For example, voting in democracy will not subtract the allocated balance to the vote from `free` balance, but token holders won't be able to transfers that balance
 - **Reducible** — refers to the balance that can be used (not locked/frozen) through the Ethereum API on Moonbeam. For example, this is the balance displayed by MetaMask. It is the real spendable balance, accounting for all democracy locks (displayed as transferable in Polkadot.js Apps)
 - **Reserved** — refers to the balance held due to on-chain requirements, and that can be freed by performing some on-chain action.  For example, bonds for creating a proxy account or setting an on-chain identity are shown as `reserved balance`. These funds are **not** accessible via the Ethereum API until they are freed
 - **Misc frozen** — represents a balance that the `free` balance may not drop below when withdrawing funds, except for transaction fee payment. For example, funds being used to vote on a governance proposal are shown as `misc frozen`. These funds are **not** accessible via the Ethereum API until they are freed
 - **Fee frozen** — represents a balance that the `free` balance may not drop below when specifically paying for transaction fees. These funds are **not** accessible via the Ethereum API until they are freed

![Moonbeam balances diagram](/images/learn/core-concepts/balances/balances-2.webp)

### Retrieve Your Balance {: #retrieve-your-balance }

You can check on your balances, including your free (or transferrable) and reserved balances (if exists), using the [Polkadot.js API](/builders/build/substrate-api/polkadot-js-api/){target=\_blank}.

!!! note
    --8<-- 'text/_common/endpoint-examples.md'

```js
--8<-- 'code/learn/core-concepts/balances/balance.js'
```

You can also retrieve your balance locks using the Polkadot.js API.

```js
--8<-- 'code/learn/core-concepts/balances/locks.js'
```

## Main Differences {: #main-differences }

The main difference between account balances on Ethereum and Moonbeam lies in the concept of locked and reserved balance on Moonbeam. These are tokens that are still owned by that account, but they are not spendable (yet).

From the Ethereum's API perspective, an account might show that it has a certain balance (called `reducible` balance). However, after an on-chain action, this value might increase (or decrease) without an actual balance transfer.

It is important to note that the account and behavior differences described here apply to account balances with the base asset (GLMR, MOVR) only and the balances of that asset that aren't interacting with smart contracts. As soon as a Moonbeam account balance is interacting with smart contracts, the behavior will be the same as Ethereum behavior. For example, if you wrap MOVR on Moonriver there is no way for the underlying balance to change via staking or governance actions, because that is part of the storage of the contract. In this case the reducible balance of that account has been committed to the wrapped MOVR smart contract and can't be modified by Substrate actions.
