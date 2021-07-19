---
title: Integrate MetaMask
description: Learn how to use MetaMask with the Moonbeam TestNet. This tutorial shows you how to connect a default installation of MetaMask to Moonbase Alpha.
---

# Connect MetaMask to Moonbase Alpha

## Introduction

This guide outlines the steps needed to connect MetaMask to Moonbase Alpha. In contrast to the MetaMask guide for a Moonbeam development node, this is much simpler because you don't need to connect to a local running Moonbeam node. Let's jump right into it.

If you already have MetaMask installed, you can easily connect MetaMask to the Moonbase Alpha TestNet:


<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonbase Alpha as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonbase Alpha.
    
--8<-- 'text/common/create-metamask-wallet.md'

## Connecting to Moonbase Alpha

Once you finish creating or importing a wallet, you will see the main MetaMask interface. In here, click in the top right logo and go to Settings.

![MetaMask3](/images/testnet/testnet-metamask3.png)

Navigate to the Networks tab and click the "Add Network" button.

![MetaMask4](/images/testnet/testnet-metamask4.png)

In here, fill out the following information and then click Save:

  - Network Name: `Moonbase Alpha`
  - RPC URL: `{{ networks.moonbase.rpc_url }}`
  - ChainID: `{{ networks.moonbase.chain_id }}`
  - Symbol (Optional): `DEV`
  - Block Explorer: `{{ networks.moonbase.block_explorer }}`

![MetaMask5](/images/testnet/testnet-metamask5.png)

That's it! You have succesfully connected MetaMask to the Moonbeam TestNet, Moonbase.
