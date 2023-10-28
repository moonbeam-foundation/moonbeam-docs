---
title: XCM Instructions for XC-20 Transfers
description: Learn about the XCM instructions that are used under the hood by the X-Tokens Precompile and X-Tokens Pallet to transfer XC-20s cross-chain.
---

# XCM Instructions for Transfers via X-Tokens

## Introduction {: #introduction }

The X-Tokens Pallet and X-Tokens Precompile make it easy to send assets cross-chain by abstracting away the process of building the XCM message for the transfer. This guide aims to fill in some knowledge gaps about the abstracted logic, in particular, what XCM instructions are used to build the XCM message.

The XCM instructions used for the [X-Tokens Pallet extrinsics](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet#extrinsics){target=_blank} are defined in the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank} repository.

Regardless of which transfer extrinsic is used, the instructions are the same for sending the native asset back to its origin chain, such as xcDOT from Moonbeam back to Polkadot, and sending the native asset from the origin chain to a destination chain, such as DOT from Polkadot to Moonbeam.

## Instructions to Transfer a Self-Reserve Asset from the Reserve Chain {: #transfer-native-from-origin }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/instructions/DOT-to-xcDOT-instructions.md'

To check how the instructions for an XCM message are built to transfer self-reserve (native) assets to a target chain, such as DOT to Moonbeam, you can refer to the [`transfer_self_reserve_asset`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.spec_version}}/xtokens/src/lib.rs#L680){target=_blank} function in the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank} repository (as an example). It calls `TransferReserveAsset` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`TransferReserveAsset` instruction](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L514){target=_blank}. The XCM message is constructed by combining the `ReserveAssetDeposited` and `ClearOrigin` instructions with the `xcm` parameter, which, as mentioned, includes the `BuyExecution` and `DepositAsset` instructions.

## Instructions to Transfer a Self-Reserve Asset to the Reserve Chain {: #transfer-native-to-origin }

--8<-- 'text/builders/interoperability/xcm/xc20/send-xc20s/instructions/xcDOT-to-DOT-instructions.md'

To check how the instructions for an XCM message are built to transfer reserve assets to a target chain, such as xcDOT to Polkadot, you can refer to the [`transfer_to_reserve`](https://github.com/open-web3-stack/open-runtime-module-library/blob/polkadot-{{networks.polkadot.spec_version}}/xtokens/src/lib.rs#L697){target=_blank} function in the [X-Tokens Open Runtime Module Library](https://github.com/open-web3-stack/open-runtime-module-library/tree/polkadot-{{networks.polkadot.spec_version}}/xtokens){target=_blank} repository. It calls `WithdrawAsset`, then `InitiateReserveWithdraw` and passes in `assets`, `dest`, and `xcm` as parameters. In particular, the `xcm` parameter includes the `BuyExecution` and `DepositAsset` instructions. If you then head over to the Polkadot GitHub repository, you can find the [`InitiateReserveWithdraw` instruction](https://github.com/paritytech/polkadot-sdk/blob/master/polkadot/xcm/xcm-executor/src/lib.rs#L638){target=_blank}. The XCM message is constructed by combining the `WithdrawAsset` and `ClearOrigin` instructions with the `xcm` parameter, which, as mentioned, includes the `BuyExecution` and `DepositAsset` instructions.
