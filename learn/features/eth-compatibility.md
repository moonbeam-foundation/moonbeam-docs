---
title: Ethereum Compatibility
description: Transitioning from Ethereum to Moonbeam? Here's a brief overview of the key components and key differences of Moonbeam's Ethereum compatibility.
---

# Ethereum Compatibility

Moonbeam bridges the Ethereum and Polkadot ecosystems, offering developers the familiarity of Ethereum's tooling and infrastructure while leveraging Polkadot's scalability and interoperability.

This documentation overviews Moonbeam's Ethereum compatibility features and highlights its key components. It also covers some critical differences between Moonbeam and Ethereum so Ethereum developers know what to expect.

## Key Components {: #key-components }

### EVM Compatibility {: #evm }

Moonbeam incorporates a fully compatible EVM to execute smart contracts in Solidity or other EVM-compatible languages. This enables developers to deploy existing Ethereum smart contracts on Moonbeam with minimal modifications.

Learn more:

- [Moonbeam's Ethereum-compatibility architecture](/learn/platform/technology#ethereum-compatibility-architecture){target=\_blank}

### Ethereum-style Accounts {: #ethereum-style-accounts }

Moonbeam employs H160 Ethereum-style accounts and ECDSA keys, ensuring compatibility with existing Ethereum wallets and facilitating a smooth end-user user experience. This is possible due to Moonbeam's unified accounts system, which modifies the underlying Substrate account system to use Ethereum accounts by default.

Learn more:

- [Moonbeam's unified accounts system](/learn/core-concepts/unified-accounts){target=\_blank}

### JSON-RPC Support {: #json-rpc-support }

Moonbeam offers full JSON-RPC compatibility with Ethereum, allowing developers to interact with Moonbeam nodes using familiar Ethereum tools and libraries. This compatibility extends to methods for account management, transaction submission, smart contract deployment, and event monitoring.

In addition to standard Ethereum RPC methods, Moonbeam supports non-standard Debug and Trace modules, providing developers with enhanced debugging and tracing capabilities for smart contract execution. The Debug module allows developers to inspect internal state transitions and execution traces, enabling efficient debugging of complex smart contracts. The Trace module provides detailed transaction traces, including opcode-level execution information and gas consumption, facilitating performance analysis and optimization.

Learn more:

- [Supported Ethereum RPC methods](/builders/json-rpc/eth-rpc){target=\_blank}
- [Subscribe to events with Ethereum JSON-RPC methods](/builders/json-rpc/pubsub){target=\_blank}
- [Debug and trace transactions with non-standard RPC methods](/builders/json-rpc/debug-trace){target=\_blank}

### Ethereum Developer Tools and Libraries {: #ethereum-dev-tools }

With the underlying support for Ethereum JSON-RPC methods, Moonbeam leverages Ethereum's rich ecosystem of developer libraries and environments. With seamless integration of popular Ethereum libraries and development environments, developers can leverage their knowledge and tooling to build and deploy decentralized applications (DApps) on Moonbeam.

Learn more:

- [Ethereum libraries](/builders/build/eth-api/libraries){target=\_blank}
- [Ethereum development environments](/builders/build/eth-api/libraries){target=\_blank}

### Precompiled Contracts {: #precompiled-contracts }

Moonbeam provides precompiled contracts that allow Ethereum smart contracts to seamlessly access Substrate functionality. These precompiled contracts expose Substrate features such as on-chain governance, staking, and identity management to Ethereum-based DApps on Moonbeam. This integration ensures that Ethereum developers can harness the full potential of Moonbeam's features, expanding the possibilities for dApp development on Moonbeam.

In addition, developers can leverage Ethereum MainNet precompiles seamlessly within their smart contracts on Moonbeam. These precompiled contracts, widely used on the Ethereum network, offer optimized and efficient execution of common cryptographic operations and complex computations. By supporting Ethereum MainNet precompiles Moonbeam ensures compatibility with Ethereum-based dApps while enabling developers to utilize familiar tools and libraries to build on its platform.

Learn more:

- [Overview of the precompiled contracts on Moonbeam](/builders/pallets-precompiles/precompiles/overview){target=\_blank}

### Ethereum Token Standards {: #ethereum-token-standards }

Moonbeam supports Ethereum token standards, allowing developers to deploy and interact with tokens that adhere to popular standards such as ERC-20, ERC-721, and ERC-1155. By supporting these standards, Moonbeam enables developers to deploy existing Ethereum tokens without modifications.

Due to Moonbeam's native interoperability, ERC-20s can be sent cross-chain to other chains within the Polkadot ecosystem via Cross-Consensus Messaging (XCM).

Learn more:

- [Create common OpenZeppelin contracts such as ERC-20, ERC-721, and ERC-1155 tokens](/builders/build/eth-api/dev-env/openzeppelin/contracts){target=\_blank}
- [XCM-enabled ERC-20s](/builders/interoperability/xcm/xc20/overview#local-xc20s){target=\_blank} (also referred to as local XC-20s)

## Key Differences {: #key-differences }

### Consensus Mechanisms {: #consensus-mechanisms }

Moonbeam uses a Delegated Proof-of-Stake (DPoS) consensus mechanism, where token holders in the network can delegate candidates to become block producers, known as _collators_. On the other hand, Ethereum uses a Proof-of-Stake (PoS) system in which validators are selected based on their stake in the network to produce and validate blocks.

Learn more:

- [Differences between PoS and DPoS](/learn/core-concepts/consensus-finality#main-differences){target=_blank}

### Finality {: #finality }

Moonbeam and Ethereum have different finality processes. On Ethereum, there is a checkpoint system where validators determine finality at checkpoint blocks, which takes at least 6.4 minutes for a block to be finalized. Moonbeam relies on Polkadot's [GRANDPA](https://wiki.polkadot.network/docs/learn-consensus#finality-gadget-grandpa){target=\_blank} finality gadget, which expedites finality by completing the process parallel to block production and allowing relay chain validators to vote on the highest block, finalizing all blocks leading up to that block.

Learn more:

- [Consensus and finality on Moonbeam](/learn/core-concepts/consensus-finality){target=_blank}

### Proxy Accounts {: #proxy-accounts }

On both Moonbeam and Ethereum, accounts can be controlled by two main types of accounts: Externally Owned Accounts (EOA) or smart contracts. However, on Moonbeam, within both account types, there are also proxy accounts, which can perform a limited number of actions on behalf of another account.

Learn more:

- [An overview of proxy accounts](https://wiki.polkadot.network/docs/learn-proxies){target=\_blank}
- [How to set up a proxy account](/tokens/manage/proxy-accounts){target=\_blank}

### Account Balances {: #account-balances }

Balances on Ethereum are fairly straightforward; if an account holds tokens, that account has a token balance. On Moonbeam, different balance types exist to support various Substrate functionality. There are five types: free, reducible, reserved, miscellaneous frozen, and fee frozen. When using Ethereum tools, accounts show the reducible balance and don't include locked or frozen balances.

Learn more:

- [Moonbeam account balances](/learn/core-concepts/balances){target=_blank}

### Balance Transfers {: #balance-transfers }

Since Moonbeam is a Substrate-based chain, balance transfers of the native asset (GLMR, MOVR, and DEV) can occur through the Ethereum and Substrate APIs. Like Ethereum, transfers sent through the Ethereum API rely on the `eth_sendRawTransaction`. Transfers sent through the Substrate API are done using the Balances Pallet, a built-in module in the Substrate framework that provides functionality for managing accounts and balances.

Learn more:

- [Balance transfers on Moonbeam](/learn/core-concepts/transfers-api){target=_blank}

### Transaction Fees {: #transaction-fees }

Moonbeam and Ethereum calculate transaction fees differently due to variations in their underlying architectures and consensus mechanisms. The fundamental difference in how transaction fees are calculated is that Ethereum uses a gas-based fee system, and Moonbeam uses a weight-based system that maps to the gas used. Moonbeam also implements additional metrics in the underlying gas calculations, including proof size and storage costs.

Learn more:

- [Calculating transaction fees on Moonbeam](/learn/core-concepts/tx-fees){target=\_blank}
