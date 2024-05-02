---
title: Ethereum Compatibility
description: It can seem daunting to move to a Polkadot parachain if you’re used to Ethereum. Here’s an overview of Moonbeam's Ethereum compatability.
---

# Ethereum Compatibility

## Differences Between Moonbeam and Ethereum {: #differences-between-moonbeam-and-ethereum }

While Moonbeam strives to be compatible with Ethereum’s Web3 API and EVM, there are a number of important Moonbeam differences.

First, Moonbeam uses a Proof of Stake-based consensus mechanism, which means that Proof of Work concepts, such as difficulty, uncles, hashrate, etc., generally don’t have meaning within Moonbeam. For APIs that return values related to Ethereum’s Proof of Work, we return default values. Existing Ethereum contracts that rely on Proof of Work internals (e.g., mining pool contracts) will almost certainly not work as expected on Moonbeam.

Another significant difference between Moonbeam and Ethereum is that Moonbeam includes an extensive set of on-chain governance features based on Substrate functionality. These onchain governance modules include functionality to power upgrades to the blockchain itself based on token weighted voting.

## What Stays the Same {: #what-stays-the-same }

If you're moving portions of your existing workloads and state off of Ethereum Layer 1 to Moonbeam, you can expect minimal required changes (aside from the exceptions noted above). Your applications, contracts, and tools will largely remain unchanged.

Moonbeam supports:

 - **Solidity-Based Smart Contracts**
 - **Ecosystem Tools** (e.g., block explorers, front-end development libraries, wallets)
 - **Development Tools** (e.g., Hardhat, Remix, MetaMask)
 - **Ethereum Tokens via Bridges** (e.g., token movement, state visibility, message passing)

## Frontier {: #frontier }

[Frontier](https://polkadot-evm.github.io/frontier/){target=\_blank} is an Ethereum compatibility layer for Substrate. The goal of Frontier is to allow standard Ethereum DApps to run without modification on Substrate-based chains. Frontier makes this possible by offering some Substrate pallets that can be plugged into a Substrate runtime. The following pallets can be used independently, as needed, or collectively depending on the chain's desired functionality:

- **[EVM pallet](#evm-pallet)** - handles EVM execution
- **[Ethereum pallet](#ethereum-pallet)** - is responsible for storing block data and provides RPC compatibility
- **Base fee pallet** - adds support for EIP-1559 transactions and handles base fee calculations
- **Dynamic fee pallet** - calculates the dynamic minimum gas price

Moonbeam uses the EVM and Ethereum pallets to achieve full Ethereum compatibility. Moonbeam does not use the base fee or dynamic fee pallets. Moonbeam has its own [dynamic fee mechanism](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241/){target=\_blank} for base fee calculations, which, as of RT2300, has been rolled out to all Moonbeam-based networks.

### EVM Pallet {: #evm-pallet }

The [EVM pallet](https://polkadot-evm.github.io/frontier/frame/ethereum.html){target=\_blank} implements a sandboxed virtual stack machine and uses the [SputnikVM](https://github.com/rust-blockchain/evm/){target=\_blank} as the underlying EVM engine.

The EVM executes Ethereum smart contract bytecode, of which is typically written in a language like Solidity, and then compiles it to EVM bytecode. The goal of the EVM pallet is to emulate the functionality of executing smart contracts on Ethereum within the Substrate runtime. As such, it allows existing EVM code to be executed in Substrate-based blockchains.

Inside of the EVM are standard H160 Ethereum-style accounts, and they have associated data such as the balance and nonce. All of the accounts in the EVM are backed by a Substrate account type, which is configurable. Moonbeam has configured the Substrate account type to be a non-standard H160 account to be fully compatibile with Ethereum. As such, you only need a single account to interact with the Substrate runtime and the EVM. For more information on Moonbeam's account system, please refer to the [Unified Accounts](/learn/features/unified-accounts/){target=\_blank} page.

With a unified accounts system, a mapped Substrate account can call the EVM pallet to deposit or withdraw balance from the Substrate-base currency into a different balance managed and used by the EVM pallet. Once a balance exists, smart contracts can be created and interacted with.

The EVM pallet can also be configured so that no dispatchable calls can cause EVM execution with the exception being from other pallets in the runtime. Moonbeam is configured this way with pallet Ethereum having sole responsibility of EVM execution. Using pallet Ethereum enables EVM interactions through the Ethereum API.

If a blockchain doesn't need Ethereum emulation and only needs EVM execution, Substrate uses its account model fully and signs transactions on behalf of EVM accounts. However, in this model Ethereum RPCs are not available, and DApps must write their frontend using the Substrate API.

The EVM pallet should produce nearly identical execution results compared to Ethereum, such as gas cost and balance changes. However, there are some differences. Please refer to the [EVM module vs Ethereum network](https://polkadot-evm.github.io/frontier/frame/evm.html#evm-module-vs-ethereum-network/){target=\_blank} section of the Frontier EVM Pallet documentation for more information.

There are also some [precompiles](https://github.com/polkadot-evm/frontier/tree/4c05c2b09e71336d6b11207e6d12e486b4d2705c#evm-pallet-precompiles/){target=\_blank} that can be used alongside the EVM pallet that extend the functionality of the EVM. Moonbeam uses the following EVM precompiles:

- **[pallet-evm-precompile-simple](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_simple/){target=\_blank}** - includes five basic precompiles: ECRecover, ECRecoverPublicKey, Identity, RIPEMD160, SHA256
- **[pallet-evm-precompile-blake2](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_blake2/struct.Blake2F.html){target=\_blank}** - includes the BLAKE2 precompile
- **[pallet-evm-precompile-bn128](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/index.html){target=\_blank}** - includes three BN128 precompiles: BN128Add, BN128Mul, and BN128Pairing
- **[pallet-evm-precompile-modexp](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_modexp/struct.Modexp.html){target=\_blank}** - includes the modular exponentiation precompile
- **[pallet-evm-precompile-sha3fips](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_sha3fips/struct.Sha3FIPS256.html){target=\_blank}** -includes the standard SHA3 precompile
- **[pallet-evm-precompile-dispatch](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html){target=\_blank}** - includes the dispatch precompile

You can find an overview of most of these precompiles on the [Ethereum MainNet Precompiled Contracts](/builders/pallets-precompiles/precompiles/eth-mainnet/){target=\_blank} page.

### Ethereum Pallet {: #ethereum-pallet}

The [Ethereum pallet](https://polkadot-evm.github.io/frontier/frame/ethereum.html){target=\_blank} is responsible for handling blocks and transaction receipts and statuses. It enables sending and receiving Ethereum-formatted data to and from Moonbeam by storing an Ethereum-style block and it's associated transaction hashes in the Substrate runtime.

When a user submits a raw Ethereum transaction, it gets converted into a Substrate transaction through the pallet Ethereum's `transact` extrinsic. Using the Ethereum pallet as the sole executor of the EVM pallet, forces all of the data to be stored and transacted with in an Ethereum-compatible way. This enables block explorers such as [Moonscan](/builders/get-started/explorers#moonscan/){target=\_blank}, which is built by Etherscan, to be able to index block data.

Along with support for Ethereum-style data, the Ethereum pallet combined with the [RPC module](https://github.com/polkadot-evm/frontier/tree/master/client/rpc/){target=\_blank} provides RPC support. This enables usage of [basic Ethereum JSON-RPC methods](/builders/get-started/eth-compare/rpc-support#basic-ethereum-json-rpc-methods/){target=\_blank} which ultimately allows existing Ethereum DApps to be deployed to Moonbeam with minimal changes.
