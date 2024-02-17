---
title: Moonbeam vs Ethereum
description: A brief comparison of Moonbeam and Ethereum for Ethereum developers looking to make the jump to Moonbeam, including what is different and what stays the same.
---

# Moonbeam vs Ethereum

Transitioning from Ethereum to Moonbeam presents an opportunity for Ethereum developers seeking a seamless migration path to a multi-chain environment. While Ethereum has established itself as a pioneer in the blockchain space, Moonbeam emerges as a compelling alternative, offering enhanced interoperability, scalability, and compatibility with Ethereum tooling and infrastructure.

This page sheds light on the fundamental similarities and distinctions between Moonbeam and Ethereum, offering valuable insights to facilitate a smooth transition.

## What Stays the Same {: #what-stays-the-same }

Moonbeam achieves Ethereum compatibility through various key features and functionalities:

- **EVM Compatibility** - Moonbeam incorporates the Ethereum Virtual Machine (EVM), allowing Ethereum smart contracts to run seamlessly on its network. This compatibility ensures that developers can deploy and interact with their existing Ethereum contracts on Moonbeam without requiring significant modifications. [Learn more about the technology behind Moonbeam's Ethereum compatibility](/learn/features/eth-compatibility){target=_blank}

- **Ethereum-style Accounts**- Moonbeam employs H160 Ethereum-style accounts and ECDSA keys, ensuring compatibility with existing Ethereum wallets and facilitating a smooth end-user user experience. This is possible due to Moonbeam's [unified accounts system](/learn/features/unified-accounts){target=_blank}, which modifies the underlying Substrate account system to use Ethereum accounts by default

- **Ethereum JSON-RPC Support** - the same Ethereum JSON-RPC methods and APIs are supported on Moonbeam, enabling developers to use familiar [Ethereum libraries](/builders/build/eth-api/libraries/){target=_blank} to interact with the network. Moonbeam also supports [event subscription](/builders/build/eth-api/pubsub){target=_blank} and non-standard RPC methods, such as the [Debug API and Trace Module](/builders/build/eth-api/debug-trace){target=_blank}, mirroring Ethereum's functionality

- **Ethereum Development Tooling** - Moonbeam integrates with popular [Ethereum development tools and frameworks](/builders/build/eth-api/dev-env/){target=_blank} such as [Hardhat](/builders/build/eth-api/dev-env/hardhat){target=_blank}, [Remix](/builders/build/eth-api/dev-env/remix){target=_blank}, and [Foundry](/builders/build/eth-api/dev-env/hardhat){target=_blank}. This integration streamlines the development process and allows developers to utilize their preferred tools when building and deploying smart contracts on Moonbeam

- **Support for Ethereum Token Standards** - Moonbeam supports Ethereum token standards such as ERC-20, ERC-721, and ERC-1155. You can transfer tokens within the Moonbeam ecosystem just like you would with Ethereum

## What's Different {: #whats-different }

Although Moonbeam mirrors Ethereum, some underlying differences are important to understand:

- **Consensus Mechanisms** - Moonbeam uses a Delegated Proof-of-Stake (DPoS) consensus mechanism, where token holders in the network can delegate candidates to become block producers, known as _collators_. On the other hand, Ethereum uses a Proof-of-Stake (PoS) system in which validators are selected based on their own stake in the network to produce and validate blocks. [Learn more about the Main Differences Between PoS and DPoS](/learn/core-concepts/consensus-finality#main-differences){target=_blank}

- **Finality** - Moonbeam and Ethereum have different finality processes. On Ethereum, there is a checkpoint system where validators determine finality at checkpoint blocks, which takes at least 6.4 minutes for a block to be finalized. Moonbeam relies on Polkadot's [GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#finality-gadget-grandpa){target=\_blank} finality gadget, which expedites finality by completing the process parallel to block production and allowing relay chain validators to vote on the highest block, finalizing all blocks leading up to that block. For more information, please refer to the [Consensus and Finality docs](/learn/core-concepts/consensus-finality){target=_blank}

- **Proxy Accounts** - on both Moonbeam and Ethereum, accounts can be controlled by two main types of accounts: Externally Owned Accounts (EOA) or smart contracts. However, on Moonbeam, within both account types, there are also [proxy accounts](https://wiki.polkadot.network/docs/learn-proxies){target=\_blank}, which can perform a limited number of actions on behalf of another account

- **Account Balances** - balances on Ethereum are fairly straightforward; if an account holds tokens, that account has a token balance. On Moonbeam, different balance types exist to support various Substrate functionality. There are five types: free, reducible, reserved, miscellaneous frozen, and fee frozen. When using Ethereum tools, accounts show the reducible balance and don't include locked or frozen balances. For more information, you can check out the [Account Balances](/learn/core-concepts/balances){target=_blank} page

- **Balance Transfers** - since Moonbeam is a Substrate-based chain, balance transfers of the native asset (GLMR, MOVR, and DEV) can occur through the Ethereum and Substrate APIs. Like Ethereum, transfers sent through the Ethereum API rely on the `eth_sendRawTransaction`. Transfers sent through the Substrate API are done using the Balances Pallet, a built-in module in the Substrate framework that provides functionality for managing accounts and balances. [Learn more about Balance Transfers](/learn/core-concepts/balances){target=_blank}

- **Transaction Fees** - the fundamental difference in how transaction fees are calculated is that Ethereum uses a gas-based fee system, and Moonbeam uses a weight-based system that maps to the gas used. Moonbeam also implements additional metrics in the underlying gas calculations, including proof size and storage costs. You can learn more about the differences on the [Calculating Transaction Fees on Moonbeam](/learn/core-concepts/tx-fees){target=\_blank} page

- **Additional RPC Support** - Moonbeam has a couple of additional custom JSON-RPC endpoints for determining finality that you won't find on Ethereum. You can review these additional endpoints on the [Moonbeam Custom API](/builders/build/moonbeam-custom-api){target=\_blank} page

- **Cross-Chain ERC-20s** - Moonbeam introduced the concept of [XC-20s](/builders/interoperability/xcm/xc20/overview){target=\_blank}, which are XCM-enabled ERC-20s. XC-20s follow the standard [ERC-20 interface](/builders/interoperability/xcm/xc20/interact#the-erc20-interface){target=\_blank}, so smart contracts and users can easily interact with them
