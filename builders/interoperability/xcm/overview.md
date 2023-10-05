---
title: Cross-Consensus Messaging (XCM)
description: An overview of how cross-consensus messaging (XCM) works and how developers can leverage Polkadot/Kusama XCM to gain access to new assets.
---

# Cross-Consensus Messaging (XCM)

## Introduction {: #introduction }

[Polkadot's architecture](https://wiki.polkadot.network/docs/learn-architecture){target=_blank} allows parachains to natively interoperate with each other, enabling cross-blockchain transfers of any type of data or asset.

To do so, a [Cross-Consensus Message (XCM)](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank} format defines a language around how the message transfer between two interoperating blockchains should be performed. XCM is not specific to Polkadot, as it aims to be a generic and extensible language between different consensus systems.

This page is a brief introduction and overview of XCM and other related elements. More information can be found in [Polkadot's Wiki](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank}.

## General XCM Definitions {: #general-xcm-definitions }

--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions.md'
--8<-- 'text/builders/interoperability/xcm/general-xcm-definitions2.md'

## XCM Instructions {: #xcm-instructions }

XCM messages contain a series of [actions/instructions](https://github.com/paritytech/xcm-format#5-the-xcvm-instruction-set){target=_blank} that are executed by the Cross-Consensus Virtual Machine (XCVM). An action (for example, transferring a token from one blockchain to another) consists of instructions that the XCVM partly executes in the origin and destination chains.

For example, an XCM message that transfers DOT from Polkadot to Moonbeam will include the following XCM instructions (in that order), which are partly executed on Polkadot and partly executed on Moonbeam:

 1. [TransferReserveAsset](https://github.com/paritytech/xcm-format#transferreserveasset){target=_blank} — executed in Polkadot
 2. [ReserveAssetDepossited](https://github.com/paritytech/xcm-format#reserveassetdeposited){target=_blank} — executed in Moonbeam
 3. [ClearOrigin](https://github.com/paritytech/xcm-format#clearorigin){target=_blank} — executed in Moonbeam
 4. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank} — executed in Moonbeam
 5. [DepositAsset](https://github.com/paritytech/xcm-format#depositasset){target=_blank} — executed in Moonbeam

## XCM Transport Protocols {: #xcm-transport-protocols }

Polkadot implements two cross-consensus or transport protocols for acting on XCM messages between its constituent parachains, Moonbeam being one of them:

- **Vertical Message Passing (VMP)** — is divided into two kinds of message-passing transport protocols:

    * **Upward Message Passing (UMP)** — allows parachains to send messages to their relay chain, for example, from Moonbeam to Polkadot
    * **Downward Message Passing (DMP)** — allows the relay chain to pass messages down to one of their parachains, for example, from Polkadot to Moonbeam

- **Cross-Chain Message Passing (XCMP)** — allows two parachains to exchange messages as long as they are connected to the same relay chain. Cross-chain transactions are resolved using a simple queuing mechanism based on a Merkle tree to ensure fidelity. Collators exchange messages between parachains, while the relay chain validators will verify that the message transmission happened

!!! note
    Currently, while XCMP is being developed, a stop-gap protocol is implemented called Horizontal Relay-routed Message Passing (HRMP), in which the messages are stored in and read from the relay chain. This will be deprecated in the future for the full XCMP implementation.

![Vertical Message Passing and Cross-chain Message Passing Overview](/images/builders/interoperability/xcm/overview/overview-1.png)

Furthermore, the two most common use-cases for XCM messages, at least in the early stages of its implementations, are:

- **Asset Teleporting** — consists of moving an asset from one blockchain to another by destroying the amount being transferred in the origin chain and creating a clone (same amount as destroyed) on the target chain. In such cases, each chain holds the native asset as reserve, similar to a burn-mint bridging mechanism. The model requires a certain degree of trust, as any of the two chains could maliciously mint more assets
- **Remote Transfers** — consists of moving an asset from one blockchain to another via an intermediate account in the origin chain that is trustlessly owned by the target chain. This intermediate account is known as the "sovereign" account. In such cases, the origin chain asset is not destroyed but held by the sovereign account. The XCM execution in the target chain mints a wrapped (also referred to as "virtual" or  "cross-chain" asset) representation to a target address. The wrapped representation is always interchangeable on a 1:1 basis with the native asset. This is similar to a lock-mint / burn-unlock bridging mechanism

![Asset Teleporting and Remote Transfers](/images/builders/interoperability/xcm/overview/overview-2.png)

A much more detailed article about XCM can be found in the [Polkadot Wiki](https://wiki.polkadot.network/docs/learn-crosschain){target=_blank}.

Initially, Moonbeam will only support remote transfers. All cross-chain assets on Moonbeam will be known as _xc + TokenName_. For example, Polkadot's DOT representation on Moonbeam is known as _xcDOT_ and Kusama's KSM representation on Moonriver is _xcKSM_. You can read more about the XC-20 standard in the [XC-20s and Cross-Chain Assets](/builders/interoperability/xcm/xc20){target=_blank} overview.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

## Channel Registration {: #channel-registration }

Before two chains can start communicating, a messaging channel must be opened. Channels are unidirectional, meaning that a channel from chain A to chain B will only pass messages from A to B. Consequently, asset transfers will be possible only from chains A to B. Therefore, two channels must be opened to send messages (or transfer assets) back and forth.

A channel for XCMs between the relay chain and parachain is automatically opened when a connection is established. However, when parachain A wants to open a communication channel with parachain B, parachain A must send an open channel extrinsic in its network. This extrinsic is an XCM as well! This XCM message consists at least of the following [XCM instructions](#xcm-instructions) (in that specific order):

 1. [WithdrawAsset](https://github.com/paritytech/xcm-format#withdrawasset){target=_blank}
 2. [BuyExecution](https://github.com/paritytech/xcm-format#buyexecution){target=_blank}
 3. [Transact](https://github.com/paritytech/xcm-format#transact){target=_blank}

Here, **Transact** will include the encoded call data to execute a channel open/accept action in the relay chain. Additional instructions can be included to refund assets that were not consumed during the execution.

The XCM message sent to the relay chain consists of at least:

- The destination where the message will be executed (relay chain in this case)
- The account that will pay the fees (paid in the relay chain token)
- Fees that the transaction can consume when executed
- Encoded call data, obtained by mimicking the extrinsic on the relay chain. This includes the following encoded information:
    * Method to be called in the relay chain (open channel)
    * Parachain ID of the target chain (parachain B in this example)
    * Maximum number of messages in the destination queue
    * Maximum size of the messages to be sent

The transaction fees are paid in the cross-chain (xc) representation of the relay chain asset (_xcRelayChainAsset_). For example, for Polkadot/Moonbeam, the transaction fees are paid in _xcDOT_. Similarly, for Kusama/Moonriver, the transaction fees are paid in _xcKSM_. Therefore, the account paying for the fees must have enough _xcRelayChainAsset_. This might be tackled on Moonbeam/Moonriver by having fees from incoming XCM messages, which are paid in the origin chain asset, sent to the treasury, and using the treasury account to pay for the channel registration extrinsic.

Even though parachain A has expressed its intentions of opening an XCM channel with parachain B, the latter has not signaled to the relay chain its intentions to receive messages from parachain A. Therefore, to have an established channel, parachain B must send an extrinsic (an XCM) to the relay chain. The accepting channel extrinsic is similar to the previous one. However, the encoded call data only includes the new method (accept channel) and the parachain ID of the sender (parachain A in this example). Once both parachains have agreed, the channel is opened within the following epoch change.

![XCM Channel Registration Overview](/images/builders/interoperability/xcm/overview/overview-3.png)

All the actions mentioned above can be executed via SUDO (if available), or through democracy (technical committee or referenda).

Once the channel is established, assets need to be registered before being transferred through XCMs, either by being baked into the runtime as a constant, or through a pallet. The asset registration process for Moonbeam is explained in the next section.

## XCM Asset Registration {: #xcm-asset-registration }

Once a channel is established between parachains (or relay chain-parachain), asset registration can occur.

In general, asset registration can happen at a runtime level, which means that a runtime upgrade is required, after which the asset is now registered and supported by XCM. However, Moonbeam included a Substrate pallet to handle asset registration without the need for runtime upgrades, making the process a lot simpler.

When registering an XCM asset, the extrinsic must include (among other things):

- Parachain ID of where the origin asset is located
- Type of asset. At the time of writing, you can register either the native parachain token or an asset created via the [Pallet Assets](https://github.com/paritytech/polkadot-sdk/blob/master/substrate/frame/assets/src/lib.rs){target=_blank}, by providing its index
- An asset name, symbol, and decimal count
- Minimum balance

After the XCM asset is registered, the units per second of execution may be set. This is a metric used to charge the incoming XCM message for its execution in the target parachain, similar to gas fees in the Ethereum world. Nevertheless, fees can be charged in another token, for example, DOT. If the amount of tokens being sent via the XCM is not enough to cover the XCM execution, the XCM transaction fails, and the spent fee is not refunded.

Once the channel has been successfully established, the XCM asset registered in the target parachain, and the units per second of execution set, users should be able to start transferring assets.

All the actions mentioned above can be executed via SUDO (if available), or through Democracy (technical committee or referenda).

## Moonbeam and XCM {: #moonbeam-and-xcm }

As Moonbeam is a parachain within the Polkadot ecosystems, one of the most direct implementations of XCM is to enable asset transfer from Polkadot and other parachains from/to Moonbeam. This will allow users to bring their tokens to Moonbeam and all its dApps.

Expanding on Moonbeam's unique Ethereum compatibility features, foreign assets will be represented via a standard [ERC-20 interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} through a precompiled contract. XCM assets on Moonbeam are called XC-20s, to differentiate native XCM assets from ERC-20 generated via the EVM. The precompile contract will access the necessary Substrate functions to perform the required actions. Nevertheless, from a developer's perspective, XC-20s are ERC-20 tokens with the added benefit of being an XCM cross-chain asset, and dApps can easily support them through a familiar ERC-20 interface.  

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-4.png)

The precompile does not support cross-chain transfers to stay as close as possible to the original ERC-20 interface. Consequently, developers will have to rely on the Substrate API and XCMs to move the assets back to their original chain, or on a different [precompile contract](https://github.com/moonbeam-foundation/moonbeam/tree/master/precompiles/xtokens){target=_blank} to access XCM based features from the Ethereum API.

Depending on the target blockchain, asset transfers can be done via teleporting or remote transfers, the latter being the most common method used. Initially, Moonbeam will only support remote transfers.

The following sections provide a high-level overview of the two initial use cases for XCM on Moonbeam: asset transfers from/to Polkadot (via VMP) and asset transfers from/to other parachains (via XCMP). This page will be expanded as more interoperability features become available, such as movements of ERC-20 tokens from Moonbeam to other parachains, or movement of other assets to Moonbeam as ERC-20 representations.

### Moonbeam & Polkadot {: #moonbeam-polkadot }

As Moonbeam is a parachain within the Polkadot ecosystem, XCM + VMP allows DOT transfers from/to Polkadot/Moonbeam. This section goes through a high-level overview of all the actions involved during the execution of such XCM messages.

Once a project is onboarded as a parachain it automatically has a bi-directional communication channel with the relay chain. Therefore, there is no need for chain registration. However, the relay chain native token needs to be registered on the parachain.

Alice (Polkadot) wants to transfer a certain amount of DOT from Polkadot to her account on Moonbeam, named Alith. Therefore, she initiates an XCM that expresses her intentions. For such transfers, Moonbeam owns a sovereign account on Polkadot.

Consequently, the XCM message execution on Polkadot will transfer the amount of DOT to Moonbeam's sovereign account on Polkadot. Once the assets are deposited, the second part of the message is sent to Moonbeam.

Moonbeam will locally execute the action the XCM message is programmed to do. In this case, it is to mint and transfer the same amount of _xcDOT_ (cross-chain DOT) to the account defined by Alice, which in this case is Alith. The fee to execute the XCM in the target parachain is paid in the asset being transferred (_xcDOT_ for this example).

![Transfers from the Relay Chain to Moonbeam](/images/builders/interoperability/xcm/overview/overview-5.png)

Note the following:

- Alice and Alith accounts can be different. For example, Polkadot's accounts are SR25519 (or ED25519), while Moonbeam's are ECDSA (Ethereum styled) accounts. They can also have different owners
- There is a certain degree of trust, where one chain relies on the other to execute its part of the XCM message. This is programmed at a runtime level, so that it can be easily verified
- For this example, cross-chain DOT (_xcDOT_) are a wrapped representation of the original DOT being held in Moonbeam's sovereign account on Polkadot. _xcDOT_ can be transferred within Moonbeam at any time, and they can be redeemed for DOT on a 1:1 basis as well

Alith deposited her _xcDOT_ in a liquidity pool. Next, Charleth acquires some _xcDOT_ by swapping against that liquidity pool, and he wants to transfer some _xcDOT_ to Charley's Polkadot account. Therefore, he initiates an XCM that expresses his intentions.

Consequently, the XCM message execution on Moonbeam will burn the number of _xcDOT_. Once the assets are burned, the second part of the message is sent to Polkadot.

Polkadot will execute the action the XCM message is programmed to do locally. In this case, it is to transfer the same amount of _xcDOT_ burned from the Moonbeam sovereign account to the account defined by Charleth, which in this case is Charley.

![Transfers Back from Moonbeam to the Relay Chain](/images/builders/interoperability/xcm/overview/overview-6.png)

### Moonbeam & Other Parachains {: #moonbeam-other-parachains }

As Moonbeam is a parachain within the Polkadot ecosystem, XCM + XCMP allows asset transfers from/to Moonbeam and other parachains. This section goes through a high-level overview of the main differences compared to XCMs from/to Polkadot/Moonbeam.

The first requirement is that a channel between the parachains must exist, and the asset being transferred must be registered in the target parachain. Only when both conditions are met can XCMs be sent between parachains.

Then, when Alith (Moonbeam) transfers a certain amount of GLMR from Moonbeam to another account (Alice) in a target parachain, tokens are sent to a sovereign Account owned by that target parachain on Moonbeam.

As the XCM message is executed in the target parachain, it is expected that this will mint and transfer the same amount of _xcGLMR_ (cross-chain GLMR) to the account defined by Alith, which in this case is Alice. The fee to execute the XCM in the target parachain is paid in the transferred asset (_xcGLMR_ for this example).

![Transfers from Moonbeam to another Parachain](/images/builders/interoperability/xcm/overview/overview-7.png)

As explained in the previous section, the process is similar for _xcGLMR_ to move back to Moonbeam. First, the XCM message execution burns the number of _xcGLMR_ returned to Moonbeam. Once burned, the remnant part of the message is sent to Moonbeam via the relay chain. Moonbeam will locally execute the XCM message's, and transfer GLMR (the same amount of burned _xcGLMR_) from the target parachain sovereign account to the specified address.
