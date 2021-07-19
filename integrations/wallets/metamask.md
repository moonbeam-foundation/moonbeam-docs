---
title: MetaMask
description: This guide walks you through how to connect MetaMask, an browser-based Ethereum wallet, to Moonbeam.
---

# Interacting with Moonbeam Using MetaMask

![Intro diagram](/images/integrations/integrations-metamask-banner.png)

## Introduction

Developers can leverage Moonbeam's Ethereum compatibility features to integrate tools, such as [MetaMask](https://metamask.io/), into their DApps. By doing so, they can use the injected library MetaMask provides to interact with the blockchain.

Currently, MetaMask can be configured to connect to a few networks: a Moonbeam development node, the Moonbase Alpha TestNet, and Moonriver.

If you already have MetaMask installed, you can easily connect MetaMask to the network of your choice:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">Connect to Moonbase Alpha</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">Connect to Moonriver</a>
</div>

!!! note
    MetaMask will popup asking for permission to add a a custom network. Once you approve permissions, MetaMask will switch your current network.

Learn [how to integrate a Connect MetaMask button](#integrate-metamask-into-a-dapp) into your dapp, so that users can connect to Moonbase Alpha with a simple click of a button.

## Connect MetaMask to Moonbeam

Once you have [MetaMask](https://metamask.io/) installed, you can connect it to Moonbeam by clicking on the top right logo and opening the settings.

![MetaMask3](/images/testnet/testnet-metamask3.png)

Next, navigate to the Networks tab and click on the "Add Network" button.

![MetaMask4](/images/testnet/testnet-metamask4.png)

Here you can configure MetaMask for the following networks:

=== "Moonbeam Development Node"

    - Network Name: `Moonbeam Dev`
    - RPC URL: `{{ networks.development.rpc_url }}`
    - ChainID: `{{ networks.development.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.development.block_explorer }}`

=== "Moonbase Alpha TestNet"

    - Network Name: `Moonbase Alpha`
    - RPC URL: `{{ networks.moonbase.rpc_url }}`
    - ChainID: `{{ networks.moonbase.chain_id }}`
    - Symbol (Optional): `DEV`
    - Block Explorer (Optional): `{{ networks.moonbase.block_explorer }}`

=== "Moonriver"

    - Network Name: `Moonriver`
    - RPC URL: `{{ networks.moonriver.rpc_url }}`
    - ChainID: `{{ networks.moonriver.chain_id }}`
    - Symbol (Optional): `MOVR`
    - Block Explorer (Optional): `{{ networks.moonriver.block_explorer }}`

## Step-by-step Tutorials

In the case that you are interested in more detailed, step-by-step guides to configure MetaMask to Moonbeam, you can go to our specific tutorials:

 - MetaMask on a [Moonbeam development node](/getting-started/local-node/using-metamask/)
 - MetaMask on [Moonbase Alpha](/getting-started/moonbase/metamask/)
## Integrate MetaMask into a DApp

With the release of MetaMask's [Custom Networks API](https://consensys.net/blog/metamask/connect-users-to-layer-2-networks-with-the-metamask-custom-networks-api/), users can be prompted to add Moonbeam's Testnet, Moonbase Alpha. 

This section will take you through the process of adding a "Connect to Moonbase Alpha" button that will prompt users to connect their MetaMask account(s) to Moonbase Alpha. Your users will no longer need to know or worry about Moonbase Alpha's network configurations and adding a custom network to MetaMask. To interact with Moonbeam from your dApp, all users will need to do is click a few buttons to connect to Moonbase Alpha and get started.

MetaMask injects a global Ethereum API into websites users visit at `window.ethereum`, which allows the websites to read and request the users' blockchain data. You'll be using the Ethereum provider to walk your users through the process of adding Moonbase Alpha as a custom network. In general, you will have to:

- Check if the Ethereum provider exists and if it's MetaMask
- Request the user's account address
- Add Moonbase Alpha as a new chain

This guide is divided into two sections. First, it'll cover adding a button that will be used to trigger MetaMask to pop-up and connect to Moonbase Alpha. The second part of the guide will create the logic for connecting the user to MetaMask. This way when you click the button you can actually test the functionality as you go through the guide.

### Checking Prerequisites

To add the Connect MetaMask button you'll need a JavaScript project and the MetaMask browser extension installed for local testing.

It's recommended to use MetaMask's `detect-provider` utility package to detect the provider injected at `window.ethereum`. The package handles detecting the provider for the MetaMask extension and MetaMask Mobile. To install the package in your JavaScript project, run:

```
npm install @metamask/detect-provider
```
### Add a Button

You'll start off by adding a button that will be used to connect MetaMask to Moonbase Alpha. You want to start with the button so when you create the logic in the next step you can test the code as you make your way through the guide. 

The function we will create in the next section of the guide will be called `configureMoonbaseAlpha`. So the button on click should call `configureMoonbaseAlpha`.

```html
<button onClick={configureMoonbaseAlpha()}>Connect to Moonbase Alpha</button>
```

### Add Logic

Now that you have created the button, you need to add the `configureMoonbaseAlpha` function that will be used on click. 

1. Detect the provider at `window.ethereum` and check if it's MetaMask. If you want a simple solution you can directly access `window.ethereum`. Or you can use MetaMask's `detect-provider` package and it will detect the provider for MetaMask extension and MetaMask Mobile for you.
```javascript
import detectEthereumProvider from '@metamask/detect-provider';

const configureMoonbaseAlpha = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider) {
        // Logic will go here    
    } else {
        console.error("Please install MetaMask");
    }
}
```

2. Request the user's accounts by calling the `eth_requestAccounts` method. This will prompt MetaMask to pop-up and ask the user to select which accounts they would like to connect to. Behind the scenes, permissions are being checked by calling `wallet_requestPermissions`. Currently the only permissions are for `eth_accounts`. So you're ultimately verifying that you have access to the user's addresses returned from `eth_accounts`. If you're interested in learning more about the permissions system, check out [EIP-2255](https://eips.ethereum.org/EIPS/eip-2255).
```javascript
import detectEthereumProvider from '@metamask/detect-provider';

const configureMoonbaseAlpha = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider) {
        try {
            await provider.request({ method: "eth_requestAccounts"});
        } catch(e) {
            console.error(e);
        }  
    } else {
        console.error("Please install MetaMask");
    }
}
```
<img src="/images/integrations/integrations-metamask-1.png" alt="Integrate MetaMask into a Dapp - Select account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;"/>
<img src="/images/integrations/integrations-metamask-2.png" alt="Integrate MetaMask into a Dapp - Connect account" style="width: 50%; display: block; margin-left: auto; margin-right: auto;" />

3. Add Moonbase Alpha as a new chain by calling `wallet_addEthereumChain`. This will prompt the user to provide permission to add Moonbase Alpha as a custom network. 
```javascript
import detectEthereumProvider from '@metamask/detect-provider';

const configureMoonbaseAlpha = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (provider) {
        try {
            await provider.request({ method: "eth_requestAccounts"});
            await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: "0x507", // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
                        chainName: "Moonbase Alpha",
                        nativeCurrency: {
                            name: 'DEV',
                            symbol: 'DEV',
                            decimals: 18
                        },
                       rpcUrls: ["https://rpc.testnet.moonbeam.network"],
                       blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network/"]
                    },
                ]
            })
        } catch(e) {
            console.error(e);
        }  
    } else {
        console.error("Please install MetaMask");
    }
}
```

<img src="/images/integrations/integrations-metamask-3.png" alt="Integrate MetaMask into a Dapp - Add network" style="width: 50%; display: block; margin-left: auto; margin-right: auto;"/>

Once the network has been successfully added, it will also prompt the user to then switch to Moonbase Alpha.

<img src="/images/integrations/integrations-metamask-4.png" alt="Integrate MetaMask into a Dapp - Switch to network" style="width: 50%; display: block; margin-left: auto; margin-right: auto;"/>

So, now you should have a button that, on click, walks users through the entire process of connecting their MetaMask accounts to Moonbase Alpha. 

<img src="/images/integrations/integrations-metamask-5.png" alt="Integrate MetaMask into a Dapp - Account connected to Moonbase Alpha"/>

### Confirm Connection

It's possible that you'll have logic that relies on knowing whether a user is connected to Moonbase Alpha or not. Perhaps you want to disable the button if the user is already connected. To confirm a user is connected to Moonbase Alpha, you can call `eth_chainId`, which will return the users current chain ID:

```javascript
    const chainId = await provider.request({
        method: 'eth_chainId'
    })
    // Moonbase Alpha's chainId is 1287, which is 0x507 in hex
    if (chainId === "0x507"){
        // At this point, you might want to disable the "Connect" button
        // or inform the user that they are already connected to the
        // Moonbase Alpha testnet
    }
```

### Listen to Account Changes

To ensure that your project or dApp is staying up to date with the latest account information, you can add the `accountsChanged` event listener that MetaMask provides. MetaMask emits this event when the return value of `eth_accounts` changes. If an address is returned, it is your user's most recent account that provided access permissions. If no address is returned, that means the user has not provided any accounts with access permissions.

```javascript
    provider.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
            // MetaMask is locked or the user doesn't have any connected accounts
            console.log('Please connect to MetaMask.');
        } 
    })
```

### Listen to Chain Changes

To keep your project or dApp up to date with any changes to the connected chain, you'll want to subscribe to the `chainChanged` event. MetaMask emits this event every time the connected chain changes.

```javascript
    provider.on("chainChanged", () => {
        // MetaMask recommends reloading the page unless you have good reason not to
        window.location.reload();
    })
```

MetaMask recommends reloading the page whenever the chain changes, unless there is a good reason not to, as it's important to always be in sync with chain changes.
