---
title: Integrate MetaMask
description: Learn how to use MetaMask with Moonriver, the Moonbeam deployment on Kusama. This tutorial shows you how to connect a default installation of MetaMask to Moonriver.
---

# Connect MetaMask to Moonriver

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/ywpc1UwpIyg' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style><div class='caption'>In this video, we'll show you how to connect your MetaMask wallet to the Moonriver network</a></div>

## Introduction

This guide outlines the steps needed to connect MetaMask to Moonriver. In contrast to the MetaMask guide for a Moonbeam development node, this is much simpler because you don't need to connect to a local running Moonbeam node. Let's jump right into it.

If you already have MetaMask installed, you can easily connect MetaMask to the Moonriver:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonriver as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonriver.

--8<-- 'text/common/create-metamask-wallet.md'

## Connecting to Moonriver

Once you finish creating or importing a wallet, you will see the main MetaMask interface. In here, click in the top right logo and go to Settings.

![MetaMask3](/images/testnet/testnet-metamask3.png)

Navigate to the Networks tab and click the "Add Network" button.

![MetaMask4](/images/testnet/testnet-metamask4.png)

In here, fill out the following information and then click Save:

 - Network Name: `Moonriver`
 - RPC URL: `{{ networks.moonriver.rpc_url }}`
 - ChainID: `{{ networks.moonriver.chain_id }}`
 - Symbol (Optional): `MOVR`
 - Block Explorer (Optional): `{{ networks.moonriver.block_explorer }}`

![MetaMask5](/images/moonriver/moonriver-integrate-metamask-1.png)

That's it! You have succesfully connected MetaMask to the Moonbeam deployment on Kusama, Moonriver.
