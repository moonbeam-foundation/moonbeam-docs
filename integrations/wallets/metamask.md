---
title: MetaMask
description: This guide walks you through how to connect MetaMask, an browser-based Ethereum wallet, to Moonbeam.
---

# Interacting with Moonbeam Using MetaMask

![Intro diagram](/images/integrations/integrations-metamask-banner.png)

## Introduction

Developers can leverage Moonbeam's Ethereum compatibility features to integrate tools, such as [MetaMask](https://metamask.io/), into their DApps. By doing so, they can use the injected library MetaMask provides to interact with the blockchain.

Currently, MetaMask can be configured to connect to two networks: a Moonbeam development node or the Moonbase Alpha TestNet.

If you already have MetaMask installed, you can easily connect MetaMask to the Moonbase Alpha test network:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonbase Alpha as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonbase Alpha.


## Connect MetaMask to Moonbeam

Once you have [MetaMask](https://metamask.io/) installed, you can connect it to Moonbeam by clicking on the top right logo and opening the settings.

![MetaMask3](/images/testnet/testnet-metamask3.png)

Next, navigate to the Networks tab and click on the "Add Network" button.

![MetaMask4](/images/testnet/testnet-metamask4.png)

Here you can configure MetaMask for the following networks:

Moonbeam development node:

--8<-- 'text/metamask-local/development-node-details.md'

Moonbase Alpha TestNet:

--8<-- 'text/testnet/testnet-details.md'

## Step-by-step Tutorials

In the case that you are interested in a more detailed step-by-step guide, you can go to our specific tutorials:

 - MetaMask on a [Moonbeam development node](/getting-started/local-node/using-metamask/)
 - MetaMask on [Moonbase Alpha](/getting-started/testnet/metamask/)
