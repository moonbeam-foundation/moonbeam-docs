---
title: XCM SDK Reference
description: A reference for the interfaces and methods in the Moonbeam XCM SDK, which can be used to send XCM transfers between Moonbeam and other chains in the ecosystem.
---

# Moonbeam XCM SDK Reference

![XCM SDK Banner](/images/builders/xcm/sdk/reference-banner.png)

## Introduction {: #introduction }

The Moonbeam XCM SDK enables developers to easily deposit and withdraw assets to Moonbeam/Moonriver from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets or which extrinsics are used on which networks to send XCM transfers.

The SDK provides an API which includes a series of interfaces to get asset information for each of the supported assets, chain information for the initialized network, utility methods, and methods to enable deposits, withdrawals, and subscription to balance information.

This page includes a list of the interfaces and methods available in the XCM SDK. For information on how to use the XCM SDK interfaces and methods, please refer to the [Using the XCM SDK](/builders/xcm/xcm-sdk/xcm-sdk){target=_blank} guide.

## Core Interfaces {: #core-sdk-interfaces }

The SDK provides the following core interfaces, which can be accessed after [initialization](/builders/xcm/xcm-sdk/xcm-sdk/#initializing):

|                            Interface                            |                                                                         Description                                                                         |
|:---------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       [`symbols`](/builders/xcm/xcm-sdk/xcm-sdk/#symbols)       |                   A list containing the asset's origin chain symbol for each of the supported assets for the initialized Moonbeam network                   |
|        [`assets`](/builders/xcm/xcm-sdk/xcm-sdk/#assets)        |    A list of the supported assets for the initialized Moonbeam network along with their asset ID, precompiled address on Moonbeam, and the asset symbol     |
|   [`moonAsset`](/builders/xcm/xcm-sdk/xcm-sdk/#native-assets)   |                      Contains the asset ID, precompile contract address, and native asset symbol for the initialized Moonbeam network                       |
| [`moonChain`](/builders/xcm/xcm-sdk/xcm-sdk/#native-chain-data) | Contains the chain key, name, WSS endpoint, parachain ID, decimals of the native asset, chain ID, and units per second for the initialized Moonbeam network |

## Core Methods {: #core-sdk-methods }

The SDK provides the following core methods, which will be covered in this guide:

|                                    Method                                    |                                    Description                                    |
|:----------------------------------------------------------------------------:|:---------------------------------------------------------------------------------:|
|           [`init()`](/builders/xcm/xcm-sdk/xcm-sdk/#initializing)            |  Initializes the XCM SDK. **Must be called first before any other SDK methods**   |
|            [`deposit()`](/builders/xcm/xcm-sdk/xcm-sdk/#deposit)             |   Initiates a deposit request to transfer assets from another chain to Moonbeam   |
|           [`withdraw()`](/builders/xcm/xcm-sdk/xcm-sdk/#withdraw)            |  Initiates a withdraw request to transfer assets from Moonbeam to another chain   |
| [`subscribeToAssetsBalanceInfo()`](/builders/xcm/xcm-sdk/xcm-sdk/#subscribe) | Listens for balance changes for a given account for each of the supported assets  |
|     [`isXcmSdkDeposit()`](/builders/xcm/xcm-sdk/xcm-sdk/#deposit-check)      | Returns a boolean indicating whether a given request is a deposit request or not  |
|    [`isXcmSdkWithdraw()`](/builders/xcm/xcm-sdk/xcm-sdk/#withdraw-check)     | Returns a boolean indicating whether a given request is a withdraw request or not |
|          [`toDecimals()`](/builders/xcm/xcm-sdk/xcm-sdk/#decimals)           |                     Returns a given balance in decimal format                     |

## Deposit {: #deposit }

When building a deposit request, you'll use multiple methods to build the underlying XCM message and send it:

|                            Method                            |                                                                                     Description                                                                                      |
|:------------------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|    [`deposit()`](/builders/xcm/xcm-sdk/xcm-sdk/#deposit)     |                         Initiates a deposit request to transfer assets from another chain to Moonbeam. **Must be called first before you can call `from()`**                         |
|       [`from()`](/builders/xcm/xcm-sdk/xcm-sdk/#from)        |                                  Sets the source chain where the deposit will originate from. **Must be called first before you can call `get()`**                                   |
|    [`get()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-deposit)     | Sets the account on Moonbeam to deposit the funds to and the source account where the deposit will be sent from. **Must be called first before you can call `send()` or `getFee()`** |
|   [`send()`](/builders/xcm/xcm-sdk/xcm-sdk/#send-deposit)    |                                                                  Sends the deposit request given an amount to send                                                                   |
| [`getFee()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-fee-deposit) |                        Returns an estimate of the fee for transferring a given amount, which will be paid in the asset specified in the `deposit()` function                         |

## Withdraw Methods {: #withdraw-methods }

When building a withdraw request, you'll use multiple methods to build the underlying XCM message and send it:

|                            Method                             |                                                                  Description                                                                  |
|:-------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------:|
|    [`withdraw()`](/builders/xcm/xcm-sdk/xcm-sdk/#withdraw)    |      Initiates a withdraw request to transfer assets from Moonbeam to another chain. **Must be called first before you can call `to()`**      |
|          [`to()`](/builders/xcm/xcm-sdk/xcm-sdk/#to)          |            Sets the destination chain where the assets will be withdrawn to. **Must be called first before you can call `get()`**             |
|    [`get()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-withdraw)     | Sets the account on the destination chain to send the withdrawn funds to. **Must be called first before you can call `send()` or `getFee()`** |
|   [`send()`](/builders/xcm/xcm-sdk/xcm-sdk/#send-withdraw)    |                                              Sends the withdraw request given an amount to send                                               |
| [`getFee()`](/builders/xcm/xcm-sdk/xcm-sdk/#get-fee-withdraw) |    Returns an estimate of the fee for transferring a given amount, which will be paid in the asset specified in the `withdraw()` function     |
