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

The X-Tokens Pallet and XCM Precompile simplify cross-chain asset transfers by abstracting away the process of building the XCM message. This guide provides insight into the underlying instructions used by XCM to transfer assets cross-chain.

For reference, the XCM extrinsics used by the Polkadot XCM Pallet are defined at the top of the [Using the Polkadot XCM Pallet To Send XC-20s guide](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}.

The specific instructions in each XCM depend on the asset being transferred and the route taken. For example, sending a native asset back to its reserve chain (for instance, xcDOT from Moonbeam back to Polkadot) differs from sending it from its reserve to a new chain (DOT from Polkadot to Moonbeam).

Examples of the XCM instructions typically involved in token transfers are included below.

### Instructions to Transfer a Reserve Asset from the Reserve Chain {: #instructions-to-transfer-a-reserve-asset-from-the-reserve-chain }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/DOT-to-xcDOT-instructions.md'

For more information on constructing an XCM message for self-reserve (native) asset transfers—such as DOT to Moonbeam—refer to the [Polkadot XCM Pallet guide](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}.

This process calls `TransferReserveAsset` with `assets`, `dest`, and `xcm` parameters. Within `xcm`, the typical instructions are `BuyExecution` and `DepositAsset`. The [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L671){target=\_blank} on GitHub includes `ReserveAssetDeposited` and `ClearOrigin` alongside `BuyExecution` and `DepositAsset` to finalize the transfer.

### Instructions to Transfer a Reserve Asset back to the Reserve Chain {: #instructions-to-transfer-a-reserve-asset-back-to-the-reserve-chain }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/overview/xcDOT-to-DOT-instructions.md'

For details on constructing an XCM message to move reserve assets back to their reserve chain—such as xcDOT from Moonbeam to Polkadot—refer to the [Polkadot XCM Pallet guide](/builders/interoperability/xcm/xc20/send-xc20s/xcm-pallet/){target=\_blank}.

It calls `WithdrawAsset` followed by `InitiateReserveWithdraw` with `assets`, `dest`, and `xcm` parameters. Within `xcm`, the typical instructions are `BuyExecution` and `DepositAsset`. The [`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/xcm-executor/src/lib.rs#L903){target=\_blank} combines `WithdrawAsset` and `ClearOrigin` with `BuyExecution` and `DepositAsset` to complete the transfer.
