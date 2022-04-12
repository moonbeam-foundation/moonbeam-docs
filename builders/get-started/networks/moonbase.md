---
title: Get Started with Moonbase Alpha
description: The Moonbeam TestNet, named Moonbase Alpha, is the easiest way to get started with a Polkadot environment. Follow this tutorial to connect to the TestNet.
---

# Get Started with Moonbase Alpha

--8<-- 'text/testnet/connect.md'

## Block Explorers

For Moonbase Alpha, you can use any of the following block explorers:

 - **Ethereum API (Etherscan Equivalent)** — [Moonscan](https://moonbase.moonscan.io/){target=_blank}
 - **Ethereum API with Indexing** — [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/){target=_blank}
 - **Ethereum API JSON-RPC based** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha){target=_blank}
 - **Substrate API** — [Subscan](https://moonbase.subscan.io/){target=_blank} or [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}
 
For more information on each of the available block explorers, please head to the [Block Explorers](/builders/tools/explorers) section of the documentation.

## Connect MetaMask

If you already have MetaMask installed, you can easily connect MetaMask to the Moonbase Alpha TestNet:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonbase Alpha as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonbase Alpha.

If you do not have MetaMask installed, or would like to follow a tutorial to get started, please check out the [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/) guide.

## Get Tokens {: #get-tokens } 

To start building on Moonbase Alpha, you can get DEV tokens from our faucet, named [Mission Control](https://discord.gg/PfpUATX), in our Discord Channel. For specific amounts, you can always reach out directly to us via our community channels.

### Discord - Mission Control {: #discord-mission-control } 

To request tokens automatically, we've created a Discord bot (named Mission Control :sunglasses:) that will automatically send a maximum of 5 DEV tokens every 24 hours (per Discord user) when you enter your address. You can check it out on our [Discord channel](https://discord.gg/PfpUATX).
 
Under the category "Miscellaneous," you will find our **#Moonbase-Faucet** channel. 

![Discord1](/images/builders/get-started/networks/moonbase/discord-1.png)

To check your balance, enter the following message, replacing `<enter-address-here->` with your H160 address:

```
!balance <enter-address-here->
```

To get DEV tokens, enter the following message, replacing `<enter-address-here->` with your H160 address:
 
```
!faucet send <enter-address-here->
```

Mission Control will send you 5 DEV tokens and display your current account balance. Remember that Mission Control is limited to dispense once every 24 hours per Discord user.

![Discord2](/images/builders/get-started/networks/moonbase/discord-2.png)

!!! note
    Moonbase Alpha DEV tokens have no value. Please don't spam the faucet with unnecessary requests.
