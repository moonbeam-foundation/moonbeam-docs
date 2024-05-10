---
title: Proxy Pallet
description: Learn how to use the available extrinsics, storage methods, and constants in the Proxy Pallet on Moonbeam to make calls on an account's behalf.
keywords: proxy, substrate, moonbeam, polkadot
---

# The Proxy Pallet

## Introduction {: #introduction }

Proxy accounts can be set up to perform a limited number of actions on behalf of users and are useful for keeping the underlying accounts safe. They allow users to keep their primary account secured safely in cold storage while enabling the proxy to actively perform functions and participate in the network with the weight of the tokens in the primary account.

[Substrate's proxy pallet](https://wiki.polkadot.network/docs/learn-proxies){target=\_blank} enables you to create proxy accounts, remove proxy accounts, make calls as a proxy account, and announce proxy transactions. To add and remove proxy accounts, you can use the proxy precompile: a Solidity interface that can be interacted through the Ethereum API. For more information on how to use this contract, please refer to the [Proxy Precompile](/builders/pallets-precompiles/precompiles/proxy/){target=\_blank} guide.

This page will provide an overview of the extrinsics, storage methods, and getters for the pallet constants available in the proxy pallet.

## Proxy Pallet Interface {: #proxy-pallet-interface }

### Extrinsics {: #extrinsics }

The proxy pallet provides the following extrinsics (functions):

- **addProxy**(delegate, proxyType, delay) - registers a proxy account for the sender that is able to make calls on the sender's behalf. If `delay` is set to a value greater than 0, the proxy account will have to announce a transaction and wait that value of blocks before attempting to execute it as a proxy. Emits a `ProxyAdded` event
- **announce**(real, callHash) - registers an announcement of a proxy transaction by proxy accounts that require a delay. Emits an `Announced` event
- **anonymous**(proxyType, delay, index) - creates a new account that cannot be accessed due to the private key being inaccessible. The sender will become a proxy for the account based on the type and delay specified. Be careful, as if the proxy is removed, the primary account will not be accessible. Emits an `AnonymousCreated` event
- **killAnonymous**(spawner, proxyType, index, height, extIndex) - removes a previously spawned anonymous proxy
- **proxy**(real, forceProxyType, call) - makes a transaction as a proxy. Emits a `ProxyExecuted` event
- **proxyAnnounced**(delegate, real, forceProxyType, call) - makes a transaction as a proxy and removes previous corresponding announcements. Emits a `ProxyExecuted` event
- **rejectAnnouncement**(delegate, callHash) - if the sender is a prime account, this removes a specific announcement from their proxy account
- **removeAnnouncement**(real, callHash) - if the sender is a proxy account, this removes a specific announcement to their prime account
- **removeProxies**() - unregisters all proxy accounts for the sender
- **removeProxy**(delegate, proxyType, delay) - unregisters a specific proxy account for the sender. Emits a `ProxyRemoved` event

!!! note
    Anonymous proxies are disabled on Moonbeam networks because they are easy to misuse. Incorrect usage can cause a permanent loss of funds and unreserved balances.

### Storage Methods {: #storage-methods }

The proxy pallet includes the following read-only storage methods to obtain chain state data:

- **announcements**(AccountId20) - returns all announcements made by the specified proxy account
- **palletVersion**() - returns the current pallet version
- **proxies**(AccountId20) - returns a map and count of all proxy accounts for a specified primary account

### Pallet Constants {: #constants }

The proxy pallet includes the following read-only functions to obtain pallet constants:

- **announcementDepositBase**() - returns the base amount of currency needed to reserve for creating an announcement
- **announcementDepositFactor**() - returns the amount of currency needed per announcement made
- **maxPending**() - returns the maximum amount of time-delayed announcements that are allowed to be pending
- **maxProxies**() - returns the maximum amount of proxies allowed for a single account
- **proxyDepositBase**() - returns the base amount of currency needed to reserve for creating a proxy
- **proxyDepositFactor**() - returns the amount of currency needed per proxy added