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

## XCM Transport Protocols {: #xcm-transport-protocols }

Polkadot implements two cross-consensus or transport protocols for acting on XCM messages between its constituent parachains, Moonbeam being one of them:

- **Vertical Message Passing (VMP)** — is divided into two kinds of message-passing transport protocols:

    * **Upward Message Passing (UMP)** — allows parachains to send messages to their relay chain, for example, from Moonbeam to Polkadot
    * **Downward Message Passing (DMP)** — allows the relay chain to pass messages down to one of their parachains, for example, from Polkadot to Moonbeam

- **Cross-Chain Message Passing (XCMP)** — allows two parachains to exchange messages as long as they are connected to the same relay chain. Cross-chain transactions are resolved using a simple queuing mechanism based on a Merkle tree to ensure fidelity. Collators exchange messages between parachains, while the relay chain validators will verify that the message transmission happened

!!! note
    Currently, while XCMP is being developed, a stop-gap protocol is implemented called Horizontal Relay-routed Message Passing (HRMP), in which the messages are stored in and read from the relay chain. This will be deprecated in the future for the full XCMP implementation.

![Vertical Message Passing and Cross-chain Message Passing Overview](/images/builders/interoperability/xcm/overview/overview-1.png)

## Establishing Cross-Chain Communication {: #channel-registration }

Before two chains can start communicating, a messaging channel must be opened. Channels are unidirectional, meaning that a channel from chain A to chain B will only pass messages from A to B. Therefore, two channels must be opened to send messages back and forth.

A channel for XCMs between the relay chain and parachain is automatically opened when a connection is established. However, when parachain A wants to open a communication channel with parachain B, parachain A must send an open channel extrinsic to its network. This extrinsic is an XCM as well!

Even though parachain A has expressed its intentions of opening an XCM channel with parachain B, the latter has not signaled to the relay chain its intentions to receive messages from parachain A. Therefore, to have an established channel, parachain B must send an extrinsic (an XCM) to the relay chain. The accepting channel extrinsic is similar to the previous one. However, the encoded call data only includes the new method (accept channel) and the parachain ID of the sender (parachain A in this example). Once both parachains have agreed, the channel is opened within the following epoch.

To learn more about the channel registration process, please refer to the [How to Establish an XC Integration with Moonbeam](/builders/interoperability/xcm/xc-registration/xc-integration/){target=_blank} guide.

![XCM Channel Registration Overview](/images/builders/interoperability/xcm/overview/overview-2.png)

Once the channel is established, cross-chain messages can be sent between parachains. For asset transfers, assets need to be registered before being transferred through XCMs, either by being baked into the runtime as a constant or through a pallet. Moonbeam relies on a Substrate pallet to handle asset registration without the need for runtime upgrades, making the process a lot simpler.

To learn how to register an asset on Moonbeam and the information necessary to add Moonbeam assets to another chain, please refer to the [How to Register Cross-Chain Assets](/builders/interoperability/xcm/xc-registration/assets/){target=_blank} guide.

## XCM Use Cases {: #xcm-use-cases }

The two most common use-cases for XCM messages, at least in the early stages of its implementations, are:

- **Asset Transfer** — consists of moving an asset from one blockchain to another. Currently, there are two main type of asset transfer using XCM:
     - **Asset Teleporting** — consists of moving an asset from one blockchain to another by destroying the amount being transferred in the origin chain and creating a clone (same amount as destroyed) on the target chain. In such cases, each chain holds the native asset as reserve, similar to a burn-mint bridging mechanism. The model requires a certain degree of trust, as any of the two chains could maliciously mint more assets
    - **Remote Transfers** — consists of moving an asset from one blockchain to another via an intermediate account in the origin chain that is trustlessly owned by the target chain. This intermediate account is known as the "sovereign" account. In such cases, the origin chain asset is not destroyed but held by the sovereign account. The XCM execution in the target chain mints a wrapped (also referred to as "virtual" or  "cross-chain" asset) representation to a target address. The wrapped representation is always interchangeable on a 1:1 basis with the native asset. This is similar to a lock-mint / burn-unlock bridging mechanism

![Asset Teleporting and Remote Transfers](/images/builders/interoperability/xcm/overview/overview-3.png)

- **Remote Transact** — consists of remotely executing function calls on other blockchains via XCM. An XCM is constructed so that you buy execution time in the destination blockchain and execute some arbitrary bytes that represent a function call in that specific blockchain 

## Moonbeam and XCM {: #moonbeam-and-xcm }

As Moonbeam is a parachain within the Polkadot ecosystems, one of the most direct implementations of XCM is to enable asset transfer from Polkadot and other parachains from/to Moonbeam. This will allow users to bring their tokens to Moonbeam and all its dApps.

Expanding on Moonbeam's unique Ethereum compatibility features, foreign assets will be represented via a standard [ERC-20 interface](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/assets-erc20/ERC20.sol){target=_blank} through a precompiled contract. XCM assets on Moonbeam are called XC-20s, to differentiate native XCM assets from ERC-20 generated via the EVM. The precompile contract will access the necessary Substrate functions to perform the required actions. Nevertheless, from a developer's perspective, XC-20s are ERC-20 tokens with the added benefit of being an XCM cross-chain asset, and dApps can easily support them through a familiar ERC-20 interface.  

![Moonbeam XC-20 XCM Integration With Polkadot](/images/builders/interoperability/xcm/overview/overview-4.png)

The precompile does not support cross-chain transfers to stay as close as possible to the original ERC-20 interface. Consequently, developers will have to rely on the [X-Tokens pallet](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-pallet/){target=_blank}, the [X-Tokens precompile](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=_blank} and XCMs to move the assets back to their original chain.

Depending on the target blockchain, asset transfers can be done via teleporting or remote transfers, the latter being the most common method used. Initially, Moonbeam will only support remote transfers.

Another unique feature offered by Moonbeam is the ability to initiate XCM actions from EVM smart contracts, or to call its EVM through XCM messages. This unlocks a new set of possibilities, where contracts on Moonbeam can access parachain-specific funcionalities via XCM, or other parachain ecosystems can use EVM smart contracts on Moonbeam to expand their functions.

The following sections provide a high-level overview of the two initial use cases for XCM on Moonbeam: asset transfers from/to Polkadot (via VMP) and asset transfers from/to other parachains (via XCMP). This page will be expanded as more interoperability features become available, such as movements of ERC-20 tokens from Moonbeam to other parachains, or movement of other assets to Moonbeam as ERC-20 representations.

### Moonbeam & Polkadot {: #moonbeam-polkadot }

As Moonbeam is a parachain within the Polkadot ecosystem, XCM + VMP allows DOT transfers from/to Polkadot/Moonbeam. This section goes through a high-level overview of all the actions involved during the execution of such XCM messages.

Once a project is onboarded as a parachain it automatically has a bi-directional communication channel with the relay chain. Therefore, there is no need for chain registration. However, the relay chain native token needs to be registered on the parachain.

Alice (Polkadot) wants to transfer a certain amount of DOT from Polkadot to her account on Moonbeam, named Alith. Therefore, she initiates an XCM that expresses her intentions. For such transfers, Moonbeam owns a Sovereign account on Polkadot.

Consequently, the XCM message execution on Polkadot will transfer the amount of DOT to Moonbeam's Sovereign account on Polkadot. Once the assets are deposited, the second part of the message is sent to Moonbeam.

Moonbeam will locally execute the action the XCM message is programmed to do. In this case, it is to mint and transfer the same amount of _xcDOT_ (cross-chain DOT) to the account defined by Alice, which in this case is Alith. The fee to execute the XCM in the target parachain is paid in the asset being transferred (_xcDOT_ for this example).

![Transfers from the Relay Chain to Moonbeam](/images/builders/interoperability/xcm/overview/overview-5.png)

Note the following:

- Alice and Alith accounts can be different. For example, Polkadot's accounts are SR25519 (or ED25519), while Moonbeam's are ECDSA (Ethereum styled) accounts. They can also have different owners
- There is a certain degree of trust, where one chain relies on the other to execute its part of the XCM message. This is programmed at a runtime level, so that it can be easily verified
- For this example, cross-chain DOT (_xcDOT_) are a wrapped representation of the original DOT being held in Moonbeam's Sovereign account on Polkadot. _xcDOT_ can be transferred within Moonbeam at any time, and they can be redeemed for DOT on a 1:1 basis as well (minus some fees)

Alith deposited her _xcDOT_ in a liquidity pool. Next, Charleth acquires some _xcDOT_ by swapping against that liquidity pool, and he wants to transfer some _xcDOT_ to Charley's Polkadot account. Therefore, he initiates an XCM that expresses his intentions.

Consequently, the XCM message execution on Moonbeam will burn the number of _xcDOT_. Once the assets are burned, the second part of the message is sent to Polkadot.

Polkadot will execute the action the XCM message is programmed to do locally. In this case, it is to transfer the same amount of _xcDOT_ burned from the Moonbeam Sovereign account to the account defined by Charleth, which in this case is Charley.

![Transfers Back from Moonbeam to the Relay Chain](/images/builders/interoperability/xcm/overview/overview-6.png)

### Moonbeam & Other Parachains {: #moonbeam-other-parachains }

As Moonbeam is a parachain within the Polkadot ecosystem, XCM + XCMP allows asset transfers from/to Moonbeam and other parachains. This section goes through a high-level overview of the main differences compared to XCMs from/to Polkadot/Moonbeam.

The first requirement is that a channel between the parachains must exist, and the asset being transferred must be registered in the target parachain. Only when both conditions are met can XCMs be sent between parachains.

Then, when Alith (Moonbeam) transfers a certain amount of GLMR from Moonbeam to another account (Alice) in a target parachain, tokens are sent to a Sovereign Account owned by that target parachain on Moonbeam.

As the XCM message is executed in the target parachain, it is expected that this will mint and transfer the same amount of _xcGLMR_ (cross-chain GLMR) to the account defined by Alith, which in this case is Alice. The fee to execute the XCM in the target parachain is paid in the transferred asset (_xcGLMR_ for this example).

![Transfers from Moonbeam to another Parachain](/images/builders/interoperability/xcm/overview/overview-7.png)

As explained in the previous section, the process is similar for _xcGLMR_ to move back to Moonbeam. First, the XCM message execution burns the number of _xcGLMR_ returned to Moonbeam. Once burned, the remnant part of the message is sent to Moonbeam via the relay chain. Moonbeam will locally execute the XCM message's, and transfer GLMR (the same amount of burned _xcGLMR_) from the target parachain Sovereign account to the specified address.
