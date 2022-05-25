---
title: Remote Execution Through XCM
description: Learn how to do remote XCM calls in other chains using the XCM-Transactor pallet. The XCM-Transactor precompile allows you to access these core functions via the Ethereum API.
---

# Using the XCM-Transactor Pallet for Remote Executions

![X-Tokens Precompile Contracts Banner](/images/builders/xcm/xc20/xtokens/xtokens-banner.png)

## Introduction {: #introduction}

XCM messages are comprised of a [series of instructions](/builders/xcm/overview/#xcm-instructions) that are executed by the Cross-Consensus Virtual Machine (XCVM). Combinations of these instructions result in predetermined actions such as cross-chain token transfers and, more interestingly, remote cross-chain execution.

Nevertheless, building an XCM message from scratch is somewhat tricky. Moreover, XCM messages are sent to other participants in the ecosystem from the root account (that is, SUDO or through a democratic vote), which is not ideal for projects that want to leverage remote cross-chain calls via a simple transaction. 

To assess these issues, developers can leverage wrapper functions/pallets to use XCM features on Polkadot/Kusama, such as the [XCM-Transactor pallet](https://github.com/PureStake/moonbeam/blob/master/pallets/xcm-transactor/src/lib.rs){target=_blank}. Moreover, the XCM-transactor pallet allows users to perform remote cross-chain calls from an account derivated from the sovereign account, so that they can be easily executed with a simple transaction.

This guide will show you how to use the XCM-Transactor pallet to send XCM messages from a Moonbeam-based network to other chains in the ecosystem (relay chain/parachains). In addition, you'll also learn how to use the XCM-Transactor precompile to perform the same actions via the Ethereum API. 

**Note that there are still limitations in what you can remotely execute through XCM messages**.

**Developers must understand that sending incorrect XCM messages can result in the loss of funds.** Consequently, it is essential to test XCM features on a TestNet before moving to a production environment.

--8<-- 'text/xcm/general-xcm-definitions.md'

- **Derivative account** —  an account derivated from another account using a simple index. The derivation is done by calculating the Blake2 hash of `modlpy/utilisuba` + `originalAddress` + `index`. Because the private keys of this account is unknown, transactions must be initiated with the `utility.asDerivative` method. When transacting through the derivative account, transaction fees are paid by the origin account, but the transaction is dispatched from the derivative account. For example, Alice has a derivative account with an index `0`. If she transfers any balance using the `asDerivative` function, Alice would still pay for transaction fees, but the funds being transferred will be withdrawn from the derivative account at index `0`