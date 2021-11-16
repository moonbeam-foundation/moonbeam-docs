---
title: Using Polkadot.js Extension
description: Follow this quick tutorial to learn how to use Moonbeam’s Ethereum-standard H160 addresses with the Polkadot JS Extension.
---

# Interacting with Moonbeam Using the Polkadot.js Extension

![Intro diagram](/images/tokens/connect/polkadotjs/polkadotjs-banner.png)

## Introduction {: #introduction } 

The Polkadot.js extension manages accounts and facilitates the signing of transactions with those accounts. It is not a full-featured wallet like [MetaMask](/tokens/connect/metamask). However, the extension has the ability to inject accounts into the browser, which provides a similar user experience to a full-featured wallet with the benefit of added security.

Creating and mantaining accounts in the Polkadot.js extension is more secure than creating them directly in Polkadot.js Apps. With the extension, the accounts live outside of the browser and are only injected into sites that you specifically authorize. Additionally, the extension can protect you from known phishing sites. 

With the latest update to the Polkadot JS extension, the plugin now natively supports H160 addresses used by Moonriver and Moonbeam. 

## Installing the Polkadot.js Extension {: #installing-the-polkadot.js-extension } 

The Polkadot.js extension is compatible with Chrome, Brave, and Firefox. To install it, head to [this link](https://polkadot.js.org/extension/) and click on your respective browser. If you're using Brave, click on the Chrome link. 

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjsext/polkadotjs-ext-1.png)

After switching, the Polkadot.js site will not only connect to Moonbase Alpha, but also change its styling to make a perfect match.

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-2.png)

## Update Metadata {: #update-metadata } 

It's important to update the extension metadata, otherwise you may not see all of the latest updates reflected in the extension. To do so, first. head to [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.moonriver.moonbeam.network#/settings).

Then, ensure you're on the Moonriver or Moonbeam Network and take the following steps: 

 1. Click on the "Settings" Tab
 2. Navigate to "Metadata"
 3. Enable the "Use Ledger Live" feature

![Connect to Moonbase Alpha](/images/tokens/connect/polkadotjs/polkadotjs-app-3.png)

!!! note
    Moonbeam uses Ethereum-style H160 addresses across all of its networks - Moonbeam, Moonriver, and Moonbase Alpha. There is no need to create separate accounts for use on each chain.

