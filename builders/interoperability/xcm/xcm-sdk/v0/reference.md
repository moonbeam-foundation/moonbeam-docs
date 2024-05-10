---
title: XCM SDK Reference for v0
description: A reference for the interfaces and methods in the Moonbeam XCM SDK, which can be used to send XCM transfers between Moonbeam and other chains in the ecosystem.
---

# Moonbeam XCM SDK Reference: v0

## Introduction {: #introduction }

The Moonbeam XCM SDK enables developers to easily deposit and withdraw assets to Moonbeam/Moonriver from the relay chain and other parachains in the Polkadot/Kusama ecosystem. With the SDK, you don't need to worry about determining the multilocation of the origin or destination assets or which extrinsics are used on which networks to send XCM transfers.

The SDK provides an API which includes a series of interfaces to get asset information for each of the supported assets, chain information for the initialized network, utility methods, and methods to enable deposits, withdrawals, and subscription to balance information.

This page includes a list of the interfaces and methods available in the XCM SDK for v0. For information on how to use the XCM SDK interfaces and methods, please refer to the [Using the XCM SDK for v0](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk){target=\_blank} guide.

If you're using v1.x, please refer to the [SDK guides specific to v1](/builders/interoperability/xcm/xcm-sdk/v1){target=\_blank}.

## Core Interfaces {: #core-sdk-interfaces }

The SDK provides the following core interfaces, which can be accessed after [initialization](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#initializing){target=\_blank}:

|                                              Interface                                              |                                                                         Description                                                                         |
|:---------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       [`symbols`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#symbols){target=\_blank}       |                   A list containing the asset's origin chain symbol for each of the supported assets for the initialized Moonbeam network                   |
|        [`assets`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#assets){target=\_blank}        |    A list of the supported assets for the initialized Moonbeam network along with their asset ID, precompiled address on Moonbeam, and the asset symbol     |
|   [`moonAsset`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#native-assets){target=\_blank}   |                      Contains the asset ID, precompile contract address, and native asset symbol for the initialized Moonbeam network                       |
| [`moonChain`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#native-chain-data){target=\_blank} | Contains the chain key, name, WSS endpoint, parachain ID, decimals of the native asset, chain ID, and units per second for the initialized Moonbeam network |

## Core Methods {: #core-sdk-methods }

The SDK provides the following core methods:

|                                                      Method                                                      |                                      Description                                      |
|:----------------------------------------------------------------------------------------------------------------:|:-------------------------------------------------------------------------------------:|
|           [`init()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#initializing){target=\_blank}            |    Initializes the XCM SDK. **Must be called first before any other SDK methods**     |
|            [`deposit()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#deposit){target=\_blank}             |         Initiates a deposit to transfer assets from another chain to Moonbeam         |
|           [`withdraw()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#withdraw){target=\_blank}            |        Initiates a withdraw to transfer assets from Moonbeam to another chain         |
| [`subscribeToAssetsBalanceInfo()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#subscribe){target=\_blank} |   Listens for balance changes for a given account for each of the supported assets    |
|     [`isXcmSdkDeposit()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#deposit-check){target=\_blank}      | Returns a boolean indicating whether the given transfer data is for a deposit or not  |
|    [`isXcmSdkWithdraw()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#withdraw-check){target=\_blank}     | Returns a boolean indicating whether the given transfer data is for a withdraw or not |
|           [`toDecimal()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#decimals){target=\_blank}           |                       Returns a given balance in decimal format                       |
|           [`toBigInt()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#decimals){target=\_blank}            |                       Returns a given decimal in BigInt format                        |

## Deposit Methods {: #deposit-methods }

When building the transfer data needed for a deposit, you'll use multiple methods to build the underlying XCM message and send it:

|                                              Method                                              |                                                                                                              Description                                                                                                               |
|:------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|    [`deposit()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#deposit){target=\_blank}     |                                                                                 Initiates a deposit to transfer assets from another chain to Moonbeam                                                                                  |
|       [`from()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#from){target=\_blank}        |                                    Sets the source chain where the deposit will originate from. <br> This function is returned from the `deposit()` function. <br> **Must call `deposit()` first**                                     |
|    [`get()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#get-deposit){target=\_blank}     |           Sets the account on Moonbeam to deposit the funds to and the <br> source account where the deposit will be sent from. <br> This function is returned from the `from()` function. <br> **Must call `from()` first**           |
|   [`send()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#send-deposit){target=\_blank}    |                                          Sends the deposit transfer data given an amount to send. <br> This function is returned from the `get()` function. <br> **Must call `get()` first**                                           |
| [`getFee()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#get-fee-deposit){target=\_blank} | Returns an estimate of the fee for transferring a given amount, <br> which will be paid in the asset specified in the `deposit()` function. <br> This function is returned from the `get()` function. <br> **Must call `get()` first** |

## Withdraw Methods {: #withdraw-methods }

When building the transfer data needed for a withdraw, you'll use multiple methods to build the underlying XCM message and send it:

|                                              Method                                               |                                                                                                               Description                                                                                                               |
|:-------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|    [`withdraw()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#withdraw){target=\_blank}    |                                                                                 Initiates a withdraw to transfer assets from Moonbeam to another chain                                                                                  |
|          [`to()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#to){target=\_blank}          |                                 Sets the destination chain where the assets will be withdrawn to. <br> This function is returned from the `withdraw()` function. <br> **Must call `withdraw()` first**                                  |
|    [`get()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#get-withdraw){target=\_blank}     |                                   Sets the account on the destination chain to send the withdrawn funds to. <br> This function is returned from the `to()` function. <br> **Must call `to()` first**                                    |
|   [`send()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#send-withdraw){target=\_blank}    |                                          Sends the withdraw transfer data given an amount to send. <br> This function is returned from the `get()` function. <br> **Must call `get()` first**                                           |
| [`getFee()`](/builders/interoperability/xcm/xcm-sdk/v0/xcm-sdk/#get-fee-withdraw){target=\_blank} | Returns an estimate of the fee for transferring a given amount, <br> which will be paid in the asset specified in the `withdraw()` function. <br> This function is returned from the `get()` function. <br> **Must call `get()` first** |
