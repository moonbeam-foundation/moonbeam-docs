---
title: Interacting with the Proxy Precompile
description: How to use the Moonbeam proxy Solidity precompile interface to add and remove proxy accounts from Substrate's proxy pallet.
keywords: solidity, ethereum, proxy, moonbeam, precompiled, contracts, substrate
---

# Interacting with the Proxy Precompile

![Proxy Moonbeam Banner](/images/builders/pallets-precompiles/precompiles/proxy/proxy-banner.png)

## Introduction {: #introduction } 

The proxy precompile on Moonbeam allows accounts to set proxy accounts that can perform specific limited actions on their behalf, such as governance, staking, or balance transfers.

If a user wanted to provide a second user access to a limited number of actions on their behalf, traditionally the only method to do so would be by providing the first account's private key to the second. However, Moonbeam has included the [Substrate proxy pallet](/builders/pallets-precompiles/pallets/proxy){target=_blank}, which enables proxy accounts. Proxy accounts ought to be used due to the additional layer of security that they provide, where many accounts can perform actions for a main account. This is best if, for example, a user wants to keep their wallet safe in cold storage but still wants to access parts of the wallet's functionality like governance or staking.  

To learn more about proxy accounts and how to set them up for your own purposes without use of the proxy precompile, view the [Setting up a Proxy Account](/tokens/manage/proxy-accounts){target=_blank} page.

The proxy precompile is only available on Moonbase Alpha and is located at the following address:

=== "Moonbase Alpha"
     ```
     {{networks.moonbase.precompiles.proxy}}
     ```

## The Proxy Solidity Interface {: #the-proxy-solidity-interface } 

[`Proxy.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank} is an interface through which Solidity contracts can interact with the proxy pallet. You do not have to be familiar with the Substrate API since you can interact with it using the Ethereum interface you're familiar with.

The interface includes the following functions:

 - **addProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) — registers a proxy account for the sender after a specified number of `delay` blocks (generally zero). Will fail if a proxy for the caller already exists
 - **removeProxy**(*address* delegate, *ProxyType* proxyType, *uint32* delay) — removes a registered proxy for the sender
 - **removeProxies**() — removes all of the proxy accounts delegated to the sender
 - **isProxy**(*address* real, *address* delegate, *ProxyType* proxyType, *uint32* delay) — returns a boolean, `true` if the delegate address is a proxy of type `proxyType`, for address `real`, with the specified `delay`
 
## Proxy Types {: #proxy-types }

There are multiple types of proxy roles that can be delegated to accounts, where are represented in `Proxy.sol` through the `ProxyType` enum. The following list includes all of the possible proxies and the type of transactions they can make on behalf of the primary account:

 - **Any** — the any proxy will allow the proxy account to make any type of transaction
 - **NonTransfer** — the non-transfer proxy will allow the proxy account to make any type of transaction, except for balance transfers
 - **Governance** - the governance proxy will allow the proxy account to make any type of governance related transaction (includes both democracy or council pallets)
 - **Staking** - the staking proxy will allow the proxy account to make staking related transactions
 - **CancelProxy** - the cancel proxy will allow the proxy account to reject and remove delayed proxy announcements (of the primary account)
 - **Balances** - the balances proxy will allow the proxy account to only make balance transfers
 - **AuthorMapping** - this type of proxy account is used by collators to migrate services from one server to another
 - **IdentityJudgement** - the identity judgement proxy will allow the proxy account to judge and certify the personal information associated with accounts on Polkadot

## Interact with the Solidity Interface {: #interact-with-the-solidity-interface }

### Checking Prerequisites {: #checking-prerequisites } 

The below example is demonstrated on Moonbase Alpha, however, similar steps can be taken for Moonbeam and Moonriver. You should:  

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - Have an account with some DEV tokens.
  --8<-- 'text/faucet/faucet-list-item.md'
 - Have a second account that you control to use as a proxy account (funding optional)

### Remix Set Up {: #remix-set-up } 

To get started, get a copy of [`Proxy.sol`](https://github.com/PureStake/moonbeam/blob/master/precompiles/proxy/Proxy.sol){target=_blank} and take the following steps:

1. Click on the **File explorer** tab
2. Copy and paste the file contents into a [Remix file](https://remix.ethereum.org/){target=_blank} named `Proxy.sol`

![Copying and Pasting the Proxy Interface into Remix](/images/builders/pallets-precompiles/precompiles/proxy/proxy-1.png)

### Compile the Contract {: #compile-the-contract } 

1. Click on the **Compile** tab, second from top
2. Then to compile the interface, click on **Compile Proxy.sol**

![Compiling Proxy.sol](/images/builders/pallets-precompiles/precompiles/proxy/proxy-2.png)

### Access the Contract {: #access-the-contract } 

1. Click on the **Deploy and Run** tab, directly below the **Compile** tab in Remix. Note: you are not deploying a contract here, instead you are accessing a precompiled contract that is already deployed
2. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down
3. Ensure **Proxy.sol** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the precompile in the **At Address** field
4. Provide the address of the proxy precompile for Moonbase Alpha: `{{networks.moonbase.precompiles.proxy}}` and click **At Address**
5. The proxy precompile will appear in the list of **Deployed Contracts**

![Provide the address](/images/builders/pallets-precompiles/precompiles/proxy/proxy-3.png)

### Add a Proxy {: #add-proxy } 

You can add a proxy for your account via the proxy precompile if your account doesn't already have a proxy. In this example, you will add a [balances](#:~:text=Balances) proxy to an account by taking the following steps:

1. Expand the proxy precompile contract to see the available functions
2. Find the **addProxy** function and press the button to expand the section
3. Insert your second account's address as the **delegate**, `5` as **proxyType**, `0` and as **delay**
4. Press **transact** and confirm the transaction in MetaMask

!!! note
     When constructing the transaction in Remix, the **proxyType** is represented as a `uint8`, instead of the expected enum `ProxyType`. In Solidity, enums are compiled as `uint8`, so when you pass in `5` for **proxyType**, you indicate the sixth element in the `ProxyType` enum, which is the balances proxy.

![Call the addProxy function](/images/builders/pallets-precompiles/precompiles/proxy/proxy-4.png)

### Check a Proxy's Existence {: #check-proxy } 

You can determine whether or not an account is a proxy account for a primary account. In this example, you will insert the parameters of the [previously added proxy](#add-proxy) to determine if the proxy account was successfully added:

1. Find the **isProxy** function and press the button to expand the section
2. Insert your primary account's address as **real**, your second account's address as **delegate**, `5` as **proxyType**, and `0` as **delay**
3. Press **call**

If everything went correctly, the output should be `true`.

![Call the isProxy function](/images/builders/pallets-precompiles/precompiles/proxy/proxy-5.png)

### Remove a Proxy {: #remove-proxy } 

You can remove a proxy from your account via the proxy precompile. In this example, you will remove the balances proxy [previously added](#add-proxy) to your delegate account by taking the following steps:

1. Expand the proxy precompile contract to see the available functions
2. Find the **removeProxy** function and press the button to expand the section
3. Insert your second account's address as the **delegate**, `5` as **proxyType**, `0` and as **delay**
4. Press **transact** and confirm the transaction in MetaMask

After the transaction is confirmed, if you repeat the steps to [check for a proxy's existence](#check-proxy), the result should be `false`.

![Call the removeProxy function](/images/builders/pallets-precompiles/precompiles/proxy/proxy-6.png)

And that's it! You've completed your introduction to the proxy precompile. Additional information on setting up proxies is available on the [Setting up a Proxy Account](/tokens/manage/proxy-accounts){target=_blank} page and the [Proxy Accounts](https://wiki.polkadot.network/docs/learn-proxies){target=_blank} page on Polkadot's documentation. Feel free to reach out on [Discord](https://discord.gg/moonbeam){target=_blank} if you have any questions about any aspect of the proxy precompile.