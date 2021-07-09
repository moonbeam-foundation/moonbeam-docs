---
title: Integrate MetaMask
description: Learn how to use MetaMask with Moonriver, the Moonbeam deployment on Kusama. This tutorial shows you how to connect a default installation of MetaMask to Moonriver.
---

# Connect MetaMask to Moonriver

## Introduction

This guide outlines the steps needed to connect MetaMask to Moonriver. In contrast to our previous MetaMask guide, this is much simpler because you don't need to connect to a local running Moonbeam node. Let's jump right into it.

--8<-- 'text/common/create-metamask-wallet.md'

## Connecting to Moonriver

Once you finish creating or importing a wallet, you will see the main MetaMask interface. In here, click in the top right logo and go to Settings.

![MetaMask3](/images/testnet/testnet-metamask3.png)

Navigate to the Networks tab and click the "Add Network" button.

![MetaMask4](/images/testnet/testnet-metamask4.png)

In here, fill out the following information and then click Save:

 - Network Name: `Moonriver`
 - New RPC URL: `{{ networks.moonriver.rpc_url }}`
 - ChainID: `{{ networks.moonriver.chain_id }}`
 - Symbol (Optional): `MOVR`

![MetaMask5](/images/moonriver/moonriver-integrate-metamask-1.png)

That's it! You have succesfully connected MetaMask to the Moonbeam deployment on Kusama, Moonriver.
