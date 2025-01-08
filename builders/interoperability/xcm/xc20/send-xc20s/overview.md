---
title: XC-20 Transfers Overview
description: Explore the types of asset transfers and some of the fundamentals of remote asset transfers via XCM, including the XCM instructions used for asset transfers.
---

# Overview of XC-20 Transfers

## Introduction {: #introduction }

The right combination of XCM instructions can be used to move an asset from one parachain to another. Currently, there are two main types of asset transfers using XCM: asset teleporting and remote transfers.

Asset teleporting consists of moving an asset from one blockchain to another by destroying the amount being transferred in the origin chain and creating a clone (same amount as destroyed) on the target chain. In such cases, each chain holds the native asset as a reserve, similar to a burn-mint bridging mechanism. The model requires a certain degree of trust, as any of the two chains could maliciously mint more assets.

Remote transfers consist of moving an asset from one blockchain to another via an intermediate account in the origin chain that is trustlessly owned by the target chain. This intermediate account is known as the "Sovereign" account. In such cases, the origin chain asset is not destroyed but held by the Sovereign account. The XCM execution in the target chain mints a wrapped (also referred to as "virtual" or  "cross-chain" asset) representation to a target address. The wrapped representation is always interchangeable on a 1:1 basis with the native asset. This is similar to a lock-mint and burn-unlock bridging mechanism. The chain where the asset originated is called the reserve chain.

![Asset Teleporting and Remote Transfers](/images/builders/interoperability/xcm/xc20/send-xc20s/overview/overview-1.webp)

Moonbeam currently uses remote transfers for XC-20 transfers via XCM.

This page covers the fundamentals of XCM remote transfers. If you want to learn how to perform XC-20 token transfers, please refer to the [XC-20 transfers via the Substrate API](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank} or the [XC-20 transfers via the Ethereum API](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=\_blank} guides.

## XCM Instructions for Asset Transfers {: #xcm-instructions-for-asset-transfers }

The X-Tokens Pallet and X-Tokens Precompile make it easy to send assets cross-chain by abstracting away the process of building the XCM message for the transfer. This guide aims to fill in some knowledge gaps about the abstracted logic, in particular, what XCM instructions are used to build the XCM message to send assets cross-chain.

The XCM extrinsics used by the PolkadotXCM Pallet are defined at the top of the [Using the PolkadotXCM Pallet To Send XC-20s guide](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}.

The set of XCM instructions to be used depends on the token being transferred and the route taken. For example, there is one set of XCM instructions for sending the native asset back to its origin chain (reserve chain), such as xcDOT from Moonbeam back to Polkadot, and another set of XCM instructions for sending the native asset from the origin chain to a destination chain, such as DOT from Polkadot to Moonbeam.

The following sections provide some examples of the XCM instructions involved in token transfers via XCM.

### Instructions to Transfer a Reserve Asset from the Reserve Chain {: #transfer-native-from-origin }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

For more information on constructing an XCM message to transfer self-reserve (native) assets to a target chain, such as DOT to Moonbeam, you can refer to the guide to the [PolkadotXCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}.

It calls `TransferReserveAsset` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L671){target=\_blank}. The XCM message is constructed by combining the `ReserveAssetDeposited` and `ClearOrigin` instructions with the `xcm` parameter, which, as mentioned, includes the `BuyExecution` and `DepositAsset` instructions.

### Instructions to Transfer a Reserve Asset back to the Reserve Chain {: #transfer-native-to-origin }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

For more information on constructing an XCM message to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you can refer to the guide to the [PolkadotXCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}.

It calls `WithdrawAsset`, then `InitiateReserveWithdraw`, and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{polkadot_sdk}}/polkadot/xcm/xcm-executor/src/lib.rs#L903){target=\_blank}. The XCM message is constructed by combining the `WithdrawAsset` and `ClearOrigin` instructions with the `xcm` parameter, which, as mentioned, includes the `BuyExecution` and `DepositAsset` instructions.
