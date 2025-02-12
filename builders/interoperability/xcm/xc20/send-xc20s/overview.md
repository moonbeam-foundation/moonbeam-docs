---
title: XC-20 Transfers Overview
description: Explore the types of asset transfers and some of the fundamentals of remote asset transfers via XCM, including the XCM instructions for asset transfers.
---

# Overview of XC-20 Transfers

## Introduction {: #introduction }

Assets can move between parachains using XCM. Two main approaches exist:

- **Asset teleporting** – destroys tokens on the reserve chain and mints the same amount on the destination chain. Each chain holds the native asset as a reserve, similar to a burn-mint bridging mechanism. Because each chain can create tokens, a degree of trust is required
- **Remote transfers** – moves tokens from the reserve chain to a Sovereign account (an account on the reserve chain trustlessly controlled by the destination chain). The destination chain then mints a wrapped (also called “virtual” or “cross-chain”) representation. This wrapped version is always interchangeable 1:1 with the original asset, functioning like a lock-mint and burn-unlock bridge. The chain where the asset originates is known as the reserve chain

![Asset Teleporting and Remote Transfers](/images/builders/interoperability/xcm/xc20/send-xc20s/overview/overview-1.webp)

Moonbeam currently uses remote transfers for XC-20 transfers.

This page covers the fundamentals of XCM-based remote transfers. To learn how to perform XC-20 transfers, refer to the the [XC-20 transfers via the Substrate API](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank} guide.

## XCM Instructions for Asset Transfers {: #xcm-instructions-for-asset-transfers }

The XCM Pallet and Precompile abstract much of the complexity involved in cross-chain asset transfers, automatically constructing the necessary XCM messages. Nevertheless, having a basic understanding of the underlying instructions can be useful. 

For reference, you can find the Polkadot XCM Pallet extrinsics for sending XC-20s in the [Using the Polkadot XCM Pallet To Send XC-20s guide](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=_blank}.

The instructions in each XCM transfer vary depending on the asset and the transfer route. For example, returning a native token like xcDOT to its reserve chain (from Moonbeam to Polkadot) differs from sending DOT from Polkadot to Moonbeam. Below are examples of the instructions commonly involved in these token transfers.

### Instructions to Transfer a Reserve Asset from the Reserve Chain {: #transfer-native-from-origin }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

This process invokes `TransferReserveAsset` with `assets`, `dest`, and `xcm`parameters. Within the `xcm` parameter, you typically specify the `BuyExecution` and `DepositAsset` instructions. As shown in the [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L630){target=\_blank}, the flow also includes `ReserveAssetDeposited` and `ClearOrigin` to complete the transfer.

For more information on constructing an XCM message for asset transfers, such as DOT to Moonbeam, refer to the [Polkadot XCM Pallet guide](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}.

### Instructions to Transfer a Reserve Asset back to the Reserve Chain {: #transfer-native-to-origin }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

Steps 3 through 6 are automatically triggered by the `InitiateReserveWithdraw` instruction (step 2) and execute on Polkadot. Once `InitiateReserveWithdraw` is invoked on Moonbeam, the assembled XCM message instructs Polkadot to run those final instructions, completing the cross-chain transfer. In other words, while Moonbeam constructs the XCM instructions behind the scenes, they ultimately execute on Polkadot to complete the asset’s return to its reserve chain.

For more information on constructing an XCM message to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you refer to the guide to the [Polkadot XCM Pallet](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=_blank}.

!!! note
	The specific instructions may vary over time, but this overall flow remains consistent: the tokens are withdrawn from the user on Moonbeam, burned from the local representation, and unlocked on the reserve chain. At the end of the process, they become fully accessible again on their reserve chain.
