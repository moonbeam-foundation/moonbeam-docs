---
title: Bobabase
description: Bobabase is the official TestNet for the Boba Layer Two Deployment on Moonbeam. Follow this tutorial to connect to Bobabase.
---

# Get Started with Bobabase

![Bobabase Banner](/images/builders/get-started/networks/bobabase/bobabase-banner.png)

## Introduction
[Boba](https://boba.network/){target=_blank} is a compute-focused Layer 2 (L2) built on the Optimistic Rollup developed by [Optimism](https://www.optimism.io/){target=_blank}. Boba augments the compute capabilities of EVM-compatible blockchains with a variety of features including [Turing hybrid compute](https://docs.boba.network/turing/turing){target=_blank}. After launching on Ethereum, Boba has brought its Layer 2 scaling solution to Moonbeam. Bobabase is the name of Boba's TestNet deployment on Moonbase Alpha. Bobabeam (not yet live) refers to Boba's MainNet deployment on Moonbeam.

## Network Endpoints {: #network-endpoints }

--8<-- 'text/endpoints/bobabase.md'

## Chain ID {: #chain-id } 

Bobabase chain ID is: `{{ networks.bobabase.chain_id }}`, which is `{{ networks.bobabase.hex_chain_id }}` in hex.

## Block Explorer

The Bobabase block explorer is an [instance of Blockscout]({{ networks.bobabase.block_explorer }}){target=_blank}.


## Connect MetaMask {: #connect-metamask }

If you already have MetaMask installed, you can easily connect MetaMask to Bobabase:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="bobabase">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Bobabase as a custom network. Once you approve permissions, MetaMask will switch your current network to Bobabase.

If you do not have MetaMask installed, or would like to follow a tutorial to get started, please check out the [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/){target=_blank} guide.

## Get Tokens with the Faucet {: #get-tokens-with-the-faucet } 

TestNet BOBA is distributed via a tweet-authenticated faucet on [Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}, a home for your Boba Layer 2 activities akin to [apps.moonbeam.network](https://apps.moonbeam.network/){target=_blank}. Bobabase allows fee payment in either DEV or TestNet BOBA, and you can toggle this setting via a dropdown in the upper right corner.


To get some TestNet BOBA, take the following steps:

1. Head to [Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank}
2. Ensure you're on the [BobaBase Network](#connect-metamask) and Click **Connect** to Connect your MetaMask Wallet
3. Press **Tweet Now**, and Send the Public Tweet
4. Copy the link to the tweet and paste it in the box 
5. Press **Authenticated Faucet** and sign the following MetaMask popup

![Bobabase Faucet](/images/builders/get-started/networks/bobabase/bobabase-1.png)

If you don't have a Twitter account, you can contact us on [Discord](https://discord.gg/PfpUATX){target=_blank} to receive TestNet BOBA.

## Bridge from Moonbase Alpha to Bobabase {: #bridge-from-moonbase-alpha-to-bobabase }

[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank} enables you to bridge various assets to and from Bobabase. To bridge assets from Moonbase Alpha to Bobabase, take the following steps:

1. Head to [Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank} and press **Connect**
2. Click on **Moonbase Wallet** in the upper left corner 
3. Next to the asset you'd like to bridge, press **Bridge to L2**
4. Enter the amount you'd like to bridge and press **Bridge**
5. Confirm the transaction in MetaMask

![Bridge to Bobabase](/images/builders/get-started/networks/bobabase/bobabase-2.png)

## Bridge from Bobabase to Moonbase Alpha {: #bridge-from-bobabase-to-moonbase-alpha }

[Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank} enables you to bridge various assets to and from Bobabase. Note, when bridging back from the Layer 2, there is a {{ networks.bobabase.exit_delay_period_days }}-day delay before your funds are available on Moonbase Alpha. This delay is an inherent safety feature of the optimistic rollup architecture and applies only when bridging from the Layer 2 back to the Layer 1. To bridge assets from Bobabase to Moonbase Alpha, take the following steps:

1. Head to [Bobabase Gateway]({{ networks.bobabase.gateway }}){target=_blank} and press **Connect**
2. Click on **Boba Wallet** in the upper left corner
3. Next to the asset you'd like to bridge, press **Bridge to L1** 
4. Enter the amount you'd like to bridge and press **Bridge**
5. Confirm the transaction in MetaMask
6. Your funds will be available on Moonbase Alpha in {{ networks.bobabase.exit_delay_period_days }} days. Note, there is no follow up claim transaction necessary, Boba automatically handles this step on your behalf

![Bridge to Bobabase](/images/builders/get-started/networks/bobabase/bobabase-3.png)