---
title: Technology & Architecture
description: Moonbeam is built using Rust and Polkadot's Substrate framework, enabling rich tools for implementation while allowing for specialization and optimization.
---

# Technology & Architecture

## The Moonbeam Development Stack {: #the-moonbeam-development-stack }

Moonbeam is a smart contract blockchain platform built in the Rust programming language using the Substrate framework. Substrate, developed by [Parity Technologies](https://www.parity.io/){target=_blank} (the original founding contributors of Polkadot), is an open-source, modular SDK for creating blockchains. Substrate allows developers to customize their blockchains while still benefiting from features such as forkless upgrades, shared security (when connected as a parachain to Polkadot or Kusama), and an extensive library of pre-built runtime modules known as pallets.

### Rust Programming Language {: #rust-programming-language }

Rust is a good language for implementing a blockchain. It is highly performant like C and C++ but has built-in memory safety features enforced at compile time, preventing many common bugs and security issues arising from C and C++ implementations.

### Substrate Framework {: #substrate-framework }

Substrate provides a rich set of tools for creating blockchains, including a runtime execution environment that enables a generic state transition function and a pluggable set of modules (pallets) that implement various blockchain subsystems. By using Substrate, Moonbeam can leverage several key features offered to parachains launched on the Polkadot relay chain, including:

- **Shared security** — Polkadot's validators secure all parachains  
- **Cross-Consensus Messaging (XCM)** — native interoperability with other parachains  
- **Flexible upgrades** — Substrate’s forkless upgrade mechanism

Pallets are at the heart of Substrate-based chains, providing specific functionality in modular form. Examples include:

- **Balances pallet** — manages account balances and transfers  
- **Assets pallet** — handles the creation and management of on-chain fungible assets  
- **Consensus pallets** — provide mechanisms like AURA or BABE for block production  
- **Governance pallets** — facilitate on-chain governance  
- **Frontier pallets** — the Ethereum compatibility layer pioneered by the Moonbeam team  
- **Parachain Staking pallet** — enables Delegated Proof of Stake (DPoS)  

In addition to these pallets provided by Polkadot's Substrate, developers can [create their own pallets](https://docs.substrate.io/tutorials/collectibles-workshop/03-create-pallet){target=_blank} to add custom functionality. Moonbeam leverages multiple existing Substrate frame pallets as well as several custom pallets for features such as cross-chain token integration, the [Orbiter Program](/node-operators/networks/collators/orbiter/){target=_blank}, and more. You can find the Moonbeam runtime (built using Substrate) and related pallets in the [Moonbeam GitHub repository](https://github.com/moonbeam-foundation/moonbeam){target=_blank}.

Moonbeam also uses the Cumulus library to facilitate integration with the Polkadot relay chain.

### Frontier: Substrate's Ethereum Compatibility Layer {: #frontier }

[Frontier](https://polkadot-evm.github.io/frontier){target=\_blank} serves as Substrate's Ethereum compatibility layer, facilitating the seamless operation of standard Ethereum DApps on Substrate-based chains without requiring modifications. This compatibility is achieved by integrating specialized Substrate pallets into the Substrate runtime. These pallets include:

- **EVM pallet** — responsible for executing EVM operations  
- **Ethereum pallet** — manages block data storage and offers RPC compatibility  
- **Base Fee pallet and Dynamic Fee pallet** — provide EIP-1559 functionality (not used in Moonbeam)

Moonbeam uses the EVM and Ethereum pallets to achieve full Ethereum compatibility. Instead of the Base Fee or Dynamic Fee pallets, Moonbeam has its own [dynamic fee mechanism](https://forum.moonbeam.network/t/proposal-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=\_blank} for base fee calculations. Basing the EVM implementation on the Substrate EVM Pallet provides a Rust-based EVM engine and support from the Parity engineering team.

## Blockchain Runtime {: #blockchain-runtime }

The core Moonbeam runtime specifies the state transition function and behavior of the Moonbeam blockchain. The runtime is built using [FRAME](/learn/platform/glossary/#substrate-frame-pallets){target=\_blank}, compiled to a [WebAssembly (Wasm)](/learn/platform/glossary/#webassemblywasm){target=\_blank} binary as well as a native binary. These compiled versions are executed in the Polkadot relay chain and Moonbeam node environments.

!!! note
    Substrate FRAME pallets are a collection of Rust-based modules that provide the functionality required when building a blockchain. WebAssembly is an open standard that defines a portable binary code format. Different programming languages, compilers, and browsers support it. Find more definitions [in our glossary](/learn/platform/glossary/){target=\_blank}.

Some of the key Substrate FRAME pallets used in the Moonbeam runtime include:

 - **Balances** — support for accounts, balances, and transfers  
 - **EVM** — a full Rust-based EVM implementation based on SputnikVM (part of Frontier)  
 - **Ethereum** — provides emulation of Ethereum block processing for the EVM (part of Frontier)  
 - **Executive** — orchestration layer that dispatches calls to other runtime modules  
 - **Identity** — support for setting on-chain identities for account addresses  
 - **System** — provides low-level types, storage, and blockchain functions  
 - **Treasury** — on-chain treasury that can be used to fund public goods such as a parachain slot  

In addition to these Substrate FRAME Pallets, Moonbeam implements custom pallets to achieve additional functionality, such as:

- **Parachain Staking** — enables a Delegated Proof of Stake (DPoS) system  
- **Moonbeam Orbiters** — supports the [Orbiter Program](/node-operators/networks/collators/orbiter/){target=\_blank}, which diversifies the collator pool  
- **XCM Transactor** — simplifies remote cross-chain calls via [Cross-Consensus Messaging (XCM)](/builders/interoperability/xcm/overview/){target=\_blank}  
- **Asset Manager** — registers XCM assets  

### Forkless Upgrades {: #forkless-upgrades }

One of the best things about developing on Polkadot with Substrate is the ability to introduce [forkless upgrades](https://docs.substrate.io/maintain/runtime-upgrades){target=_blank} to blockchain runtimes. In traditional blockchain architectures, substantial changes to the blockchain's rules often require a hard fork, which can be disruptive and contentious.  

Substrate takes a different approach by separating the blockchain's state (data) from its logic (rules). Logic lives in the runtime, which is itself stored on-chain. Whenever a new runtime is uploaded (via FRAME's `set_code` call) and approved through on-chain governance, all nodes automatically switch to the new runtime at a specified block. This process is seamless and does not split the network.  

Moonbeam regularly uses forkless upgrades to add features or fixes without requiring node operators to upgrade their software manually. You can keep track of and discuss upcoming Moonbeam upgrades on the [Moonbeam forum](https://forum.moonbeam.network){target=_blank}.

## Ethereum Compatibility Architecture {: #ethereum-compatibility-architecture }

Smart contracts on Moonbeam can be implemented using Solidity, Vyper, and any other language that compiles smart contracts to EVM-compatible bytecode. Moonbeam aims to provide a low-friction and secure environment for the development, testing, and execution of smart contracts while remaining compatible with the existing Ethereum developer toolchain.

The execution behavior and semantics of Moonbeam-based smart contracts strive to be as close as possible to Ethereum Layer 1. Moonbeam is a single shard, so cross-contract calls have the same synchronous execution semantics as on Ethereum Layer 1.

![Diagram showing the interactions made possible through Moonbeam's Ethereum compatibility](/images/learn/platform/technology-diagram.webp)

A high-level interaction flow is shown above. A Web3 RPC call from a DApp or existing Ethereum developer tool, such as Hardhat, is received by a Moonbeam node. The node has both Web3 RPCs and Substrate RPCs available, meaning you can use Ethereum or Substrate tools when interacting with a Moonbeam node. Associated Substrate runtime functions handle these RPC calls. The Substrate runtime checks signatures and handles any extrinsics. Smart contract calls are ultimately passed to the EVM to execute the state transitions.

### Ethereum Pallet {: #ethereum-pallet}

The [Ethereum pallet](https://polkadot-evm.github.io/frontier/frame/ethereum.html){target=\_blank} is responsible for handling blocks and transaction receipts and statuses. It enables sending and receiving Ethereum-formatted data to and from Moonbeam by storing an Ethereum-style block and its associated transaction hashes in the Substrate runtime.

When a user submits a raw Ethereum transaction, it converts into a Substrate transaction through the Ethereum pallet's `transact` extrinsic—using the Ethereum pallet as the sole executor of the EVM pallet forces all of the data to be stored and transacted in an Ethereum-compatible way, which is how explorers like [Moonscan](/builders/get-started/explorers/#moonscan){target=\_blank} (built by Etherscan) can index block data.

### EVM Pallet {: #evm-pallet }

The [EVM pallet](https://polkadot-evm.github.io/frontier/frame/ethereum.html){target=\_blank} implements a sandboxed virtual stack machine and uses the [SputnikVM](https://github.com/rust-ethereum/evm){target=\_blank} as the underlying EVM engine. It executes Ethereum smart contract bytecode in a manner similar to Ethereum mainnet, including gas metering and state changes.

Moonbeam uses unified accounts, meaning an H160 (Ethereum-style) address is also a valid Substrate address, so you only need a single account to interact with the Substrate runtime and the EVM. Once a balance exists in the EVM, smart contracts can be created and interacted with through standard Ethereum RPC calls.  
The EVM pallet should produce nearly identical execution results to Ethereum, such as gas cost and balance changes. However, there are some differences. Please refer to the [EVM module vs Ethereum network](https://polkadot-evm.github.io/frontier/frame/evm.html#evm-module-vs-ethereum-network){target=\_blank} section of the Frontier EVM Pallet documentation for more information. Although the EVM pallet aims for near-identical behavior to Ethereum, some differences exist, for example, Moonbeam’s [dynamic fee mechanism](https://forum.moonbeam.network/t/proposal-dynamic-fee-mechanism-for-moonbeam-and-moonriver/241){target=\_blank}. For more information, refer to the [Frontier EVM Pallet documentation](https://polkadot-evm.github.io/frontier/frame/evm.html#evm-module-vs-ethereum-network){target=\_blank}.

Moonbeam includes additional EVM precompiles for functionalities like cryptographic operations (ECRecover, SHA256, BLAKE2, BN128) and dispatching Substrate calls directly from within the EVM. Moonbeam uses the following EVM precompiles:

- **[pallet-evm-precompile-simple](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_simple){target=\_blank}** - includes five basic precompiles: ECRecover, ECRecoverPublicKey, Identity, RIPEMD160, SHA256
- **[pallet-evm-precompile-blake2](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_blake2/struct.Blake2F.html){target=\_blank}** - includes the BLAKE2 precompile
- **[pallet-evm-precompile-bn128](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_bn128/index.html){target=\_blank}** - includes three BN128 precompiles: BN128Add, BN128Mul, and BN128Pairing
- **[pallet-evm-precompile-modexp](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_modexp/struct.Modexp.html){target=\_blank}** - includes the modular exponentiation precompile
- **[pallet-evm-precompile-sha3fips](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_sha3fips/struct.Sha3FIPS256.html){target=\_blank}** -includes the standard SHA3 precompile
- **[pallet-evm-precompile-dispatch](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm_precompile_dispatch/struct.Dispatch.html){target=\_blank}** - includes the dispatch precompile

You can find an overview of most of these precompiles on the [Ethereum MainNet Precompiled Contracts](/builders/ethereum/precompiles/utility/eth-mainnet/){target=\_blank} page.

## Native Interoperability {: #native-interoperability }

While Substrate allows developers to create blockchains, one of its most significant advantages is that it supports integration for native interoperability through relay chains like Polkadot and Kusama.  

A relay chain is a central chain that connects several blockchains, known as parachains. Each parachain is a distinct blockchain with its runtime and state, but all are connected to and secured by the relay chain. Once connected, parachains can communicate via [Cross-Consensus Messaging (XCM)](/builders/interoperability/xcm/overview/){target=_blank} to exchange information and conduct transactions in the same language, enabling a wide range of interoperable applications.  

Moonbeam and Moonriver have established XCM connections with a large number of parachains. You can see a visualization of all XCM integrations in this [XCM Channel Viewer](https://dotsama-channels.vercel.app/#/){target=_blank}.