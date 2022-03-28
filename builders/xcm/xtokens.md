---
title: X-Tokens 
description:  Learn how to send XC-20s to other chains using the X-Tokens pallet. In addition, the X-Tokens precompile allows you to access core functions via the Ethereum API
---

# Using the X-Tokens Pallet

![X-Tokens Precompile Contracts Banner](/images/builders/xcm/xc20/xtokens-banner.png)

## Introduction {: #introduction } 

Building an XCM message for fungible asset transfers is not an easy task. Consequently, there are wrapper functions/pallets that developer can leverage to make use of XCM features on Polkadot/Kusama.

One example of such wrappers is the [X-Tokens](https://github.com/open-web3-stack/open-runtime-module-library/tree/master/xtokens) pallet, which provides different methods to transfer fungible assets via XCM.

This guide will show you how to leverage the X-Tokens pallet to send XC-20s from a Moonbeam-based network to other chains in the ecosystem. Moreover, you'll also learn how to use the X-Tokens precompile to perform the same actions but via the Ethereum API.

## X-Tokens Pallet Interface {:x-tokens-pallet-interface}

The X-Tokens pallet provide the following extrinsics (functions):

 - **transfer(currencyId, amount, dest, destWeight)** — transfer a currency, defined as either the native token (self reserved), or with the asset ID
 - **transferMultiasset(asset, dest, destWeight)** — transfer a fungible asset, defined by its multilocation
 - **transferMultiassetWithFee(asset, fee, dest, destWeight)** — transfer a fungible asset, but it allows to pay the fee with a different asset. Both are defined by their multilocation
 - **transferMultiassets(assets, feeItem, dest, destWeight)** — transfer several fungible assets, specifying which is used as fee. Each asset is defined by its multilocation
 - **transferMulticurrencies(currencies, feeItem, dest, destWeight)** — transfer different curriencies, specifying which is used as fee. Each currency is defined as either the native token (self reserved), or with the asset ID
 - **transferWithFee(currencyId, amount, fee, dest, destWeight)** — transfer a currency, but it allows to pay the fee with a different asset. Both are defined by their multilocation

Where the inputs that need to be provide can be define as:



The only read method that the pallet provides is `palletVersion`, which provides the version of the X-Tokens pallet being used.

## Building an XCM with the X-Tokens Pallet


