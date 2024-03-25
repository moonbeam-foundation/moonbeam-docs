---
title: Technology & Architecture
description: Moonbeam is built using Rust and the Substrate framework, enabling rich tools for implementation but also allowing for specialization and optimization.
---

# Technology & Architecture

## The Moonbeam Development Stack {: #the-moonbeam-development-stack }

Moonbeam is a smart contract blockchain platform built in the Rust programming language using the Substrate framework.

### Rust Programming Language {: #rust-programming-language }

Rust is a good language for implementing a blockchain. It is highly performant like C and C++ but has built-in memory safety features enforced at compile time, preventing many common bugs and security issues arising from C and C++ implementations.

### Substrate Framework {: #substrate-framework }

Substrate provides a rich set of tools for creating blockchains, including a runtime execution environment that enables a generic state transition function and a pluggable set of modules that implement various blockchain subsystems.

Moonbeam leverages multiple existing Substrate frame pallets to provide key blockchain services and functionality, including core blockchain data structures, peer-to-peer networking, consensus mechanisms, accounts, assets, and balances. Custom pallets and logic in the runtime implement Moonbeam-specific behavior and functionality, such as cross-chain token integration. For leveraged pallets, Moonbeam will strive to stay as close as possible to the upstream Substrate codebase and incorporate Substrate bug fixes, enhancements, and new features on an ongoing basis.

### Frontier: Substrate's Ethereum Compatibility Layer {: #frontier }

[Frontier](https://polkadot-evm.github.io/frontier/){target=\_blank} serves as Substrate's Ethereum compatibility layer, facilitating the seamless operation of standard Ethereum DApps on Substrate-based chains without requiring modifications. This compatibility is achieved by integrating specialized Substrate pallets into the Substrate runtime. These pallets include the EVM pallet, responsible for executing EVM operations; the Ethereum pallet, which manages block data storage and offers RPC compatibility; the Base Fee pallet, enabling support for EIP-1559 transactions and handling base fee calculations; and the Dynamic Fee pallet, responsible for computing dynamic minimum gas prices.

Moonbeam uses the EVM and Ethereum pallets to achieve full Ethereum compatibility. Moonbeam does not use the Base Fee or Dynamic Fee pallets. Instead, Moonbeam has its own [dynamic fee mechanism](https://forum.moonbeam.foundation/t/proposal-status-idea-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=\_blank} for base fee calculations.

By basing our EVM implementation on the Substrate EVM Pallet, we get a full Rust-based EVM implementation and support from the Parity engineering team.

## Blockchain Runtime {: #blockchain-runtime }

The core Moonbeam runtime specifies the state transition function and behavior of the Moonbeam blockchain. The Moonbeam runtime is built using [FRAME](/learn/platform/glossary/#substrate-frame-pallets){target=\_blank}. It includes several standard pallets as well as several custom ones. The runtime is compiled to a [WebAssembly (Wasm)](/learn/platform/glossary/#webassemblywasm){target=\_blank} binary as well as a native binary. These compiled versions are executed in the Polkadot relay chain and Moonbeam node environments.

!!! note
    Substrate FRAME pallets are a collection of Rust-based modules that provide the functionality required when building a blockchain. WebAssembly is an open standard that defines a portable binary code format. Different programming languages, compilers, and browsers support it. Find more definitions [in our glossary](/learn/platform/glossary/){target=\_blank}.

Some of the key Substrate FRAME pallets used in the Moonbeam runtime include:

 - **Balances** — support for accounts, balances, and transfers
 - **EVM** — full Rust-based EVM implementation based on SputnikVM. Provides the state transition logic for Moonbeam-based smart contracts (part of Frontier)
 - **Ethereum** — provides emulation of Ethereum block processing for the EVM (part of Frontier)
 - **Executive** — orchestration layer that dispatches calls to other runtime modules
 - **Identity** — support for setting on-chain identities for account addresses
 - **System** — provides low-level types, storage, and blockchain functions
 - **Treasury** — on-chain treasury that can be used to fund public goods such as a parachain slot

In addition to these Substrate FRAME Pallets, Moonbeam implements custom pallets to achieve additional functionality, such as:

- **Parachain Staking** - enables a Delegated Proof of Stake (DPoS) system
- **Moonbeam Orbiters** - supports the [Orbiter Program](/node-operators/networks/collators/orbiter){target=\_blank}, which diversifies the collator pool
- **XCM Transactor** - simplifies remote cross-chain calls via [Cross-Consensus Messaging (XCM)](/builders/interoperability/xcm/overview){target=\_blank}
- **Asset Manager** - registers XCM assets

Moonbeam also uses the Cumulus library to provide integration to the Polkadot relay chain.

## Ethereum Compatibility Architecture {: #ethereum-compatibility-architecture }

Smart contracts on Moonbeam can be implemented using Solidity, Vyper, and any other language that can compile smart contracts to EVM-compatible bytecode. Moonbeam aims to provide a low-friction and secure environment for the development, testing, and execution of smart contracts, that is compatible with the existing Ethereum developer toolchain.

The execution behavior and semantics of Moonbeam-based smart contracts strive to be as close as possible to Ethereum Layer 1. Moonbeam is a single shard, so cross-contract calls have the same synchronous execution semantics as on Ethereum Layer 1.

![Diagram showing the interactions made possible through Moonbeam's Ethereum compatibility](/images/learn/platform/technology-diagram.webp)

A high-level interaction flow is shown above. A Web3 RPC call from a DApp or existing Ethereum developer tool, such as Hardhat, is received by a Moonbeam node. The node has both Web3 RPCs and Substrate RPCs available, meaning you can use Ethereum or Substrate tools when interacting with a Moonbeam node. These RPC calls are handled by associated Substrate runtime functions. The Substrate runtime checks signatures and handles any extrinsics. Smart contract calls are ultimately passed to the EVM to execute the state transitions.

### Ethereum Pallet {: #ethereum-pallet}

The [Ethereum pallet](https://polkadot-evm.github.io/frontier/frame/ethereum.html){target=\_blank} is responsible for handling blocks and transaction receipts and statuses. It enables sending and receiving Ethereum-formatted data to and from Moonbeam by storing an Ethereum-style block and its associated transaction hashes in the Substrate runtime.

When a user submits a raw Ethereum transaction, it converts into a Substrate transaction through the pallet Ethereum's `transact` extrinsic. Using the Ethereum pallet as the sole executor of the EVM pallet forces all of the data to be stored and transacted in an Ethereum-compatible way. This enables block explorers such as [Moonscan](/builders/get-started/explorers#moonscan){target=\_blank}, which is built by Etherscan, to be able to index block data.

Along with support for Ethereum-style data, the Ethereum pallet combined with the [RPC module](https://github.com/polkadot-evm/frontier/tree/master/client/rpc){target=\_blank} provides RPC support. This enables usage of [basic Ethereum JSON-RPC methods](/learn/core-concepts/rpc-support#basic-ethereum-json-rpc-methods){target=\_blank}, which ultimately allows existing Ethereum DApps to be deployed to Moonbeam with minimal changes.

### EVM Pallet {: #evm-pallet }

The [EVM pallet](https://polkadot-evm.github.io/frontier/frame/ethereum.html){target=\_blank} implements a sandboxed virtual stack machine and uses the [SputnikVM](https://github.com/rust-blockchain/evm){target=\_blank} as the underlying EVM engine.

The EVM executes Ethereum smart contract bytecode, typically written in a language like Solidity, and then compiles it to EVM bytecode. The EVM pallet aims to emulate the functionality of executing smart contracts on Ethereum within the Substrate runtime. As such, it allows existing EVM code to be executed in Substrate-based blockchains.

Inside the EVM are standard H160 Ethereum-style accounts, with associated data such as the balance and nonce. All of the accounts in the EVM are backed by a configurable Substrate account type. Moonbeam has configured the Substrate account type to be a non-standard H160 account fully compatible with Ethereum. So, you only need a single account to interact with the Substrate runtime and the EVM. For more information on Moonbeam's account system, please refer to the [Unified Accounts](/learn/core-concepts/unified-accounts/){target=\_blank} page.

With a unified accounts system, a mapped Substrate account can call the EVM pallet to deposit or withdraw balance from the Substrate-base currency into a different balance managed and used by the EVM pallet. Once a balance exists, smart contracts can be created and interacted with.

The EVM pallet can also be configured so that no dispatchable calls can cause EVM execution, with the exception being from other pallets in the runtime. Moonbeam is configured this way, with the Ethereum pallet having sole responsibility for EVM execution. Using the Ethereum pallet enables EVM interactions through the Ethereum API.

If a blockchain doesn't need Ethereum emulation and only needs EVM execution, Substrate uses its account model fully and signs transactions on behalf of EVM accounts. However, Ethereum RPCs are unavailable in this model, and DApps must write their frontend using the Substrate API.

The EVM pallet should produce nearly identical execution results to Ethereum, such as gas cost and balance changes. However, there are some differences. Please refer to the [EVM module vs Ethereum network](https://polkadot-evm.github.io/frontier/frame/evm.html#evm-module-vs-ethereum-network){target=\_blank} section of the Frontier EVM Pallet documentation for more information.

There are also some [precompiles](https://github.com/polkadot-evm/frontier/tree/4c05c2b09e71336d6b11207e6d12e486b4d2705c#evm-pallet-precompiles){target=\_blank} that can be used alongside the EVM pallet that extends the functionality of the EVM. Moonbeam uses the following EVM precompiles:

- **[pallet-evm-precompile-simple](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_simple/){target=\_blank}** - includes five basic precompiles: ECRecover, ECRecoverPublicKey, Identity, RIPEMD160, SHA256
- **[pallet-evm-precompile-blake2](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_blake2/struct.Blake2F.html){target=\_blank}** - includes the BLAKE2 precompile
- **[pallet-evm-precompile-bn128](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/index.html){target=\_blank}** - includes three BN128 precompiles: BN128Add, BN128Mul, and BN128Pairing
- **[pallet-evm-precompile-modexp](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_modexp/struct.Modexp.html){target=\_blank}** - includes the modular exponentiation precompile
- **[pallet-evm-precompile-sha3fips](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_sha3fips/struct.Sha3FIPS256.html){target=\_blank}** -includes the standard SHA3 precompile
- **[pallet-evm-precompile-dispatch](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html){target=\_blank}** - includes the dispatch precompile

You can find an overview of most of these precompiles on the [Ethereum MainNet Precompiled Contracts](/builders/pallets-precompiles/precompiles/eth-mainnet){target=\_blank} page.
