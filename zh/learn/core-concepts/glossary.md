---
title: 术语表
description: 我们编制了一份与 Polkadot 相关的术语表，方便您了解更多关于该生态系统的信息。
categories: Reference
---

# 词汇表

有很多术语是 Polkadot、Substrate 以及新兴的 Parity/Web3 生态系统所特有的。我们整理了一个术语列表，我们认为您在查看 Moonbeam 文档、计划和教程时会想要了解这些术语。

### Collators {: #collators }

收集人是支持 Polkadot 网络中平行链所需的关键网络参与者之一。在 Moonbeam 中，收集人是负责区块生产并将生产的区块提交到 Polkadot 中继链以进行最终确认的节点。

### 委托人 {: #delegators }

Moonbeam 代币持有者可以通过质押代币来支持平行链上的特定收集人候选者。任何持有最少数量代币作为[可用余额](https://wiki.polkadot.com/learn/learn-accounts/#balance-types#balance-types){target=_blank}的用户都可以通过质押代币成为委托人。

### 提名人 {: #nominators }

中继链代币持有者，他们选择“支持”验证人。他们可以获得验证人奖励的一部分，但如果验证人行为不端，他们的质押代币可能会被削减。一个提名人最多可以支持 16 个验证人，并且他们的抵押物会在被选入验证人集合的支持验证人之间完全分配。

### 提名权益证明 {: #nominated-proof-of-stake }

Polkadot用于选择其区块验证人集以最大化链安全性的机制。其核心是一个权益证明系统（PoS），其中提名人支持验证人。获得最高支持的验证人被选为会话的验证人集的一部分。如果验证人有不当行为，其质押的权益将被削减。因此，提名人应该对他们提名的验证人进行尽职调查。

### 平行链 {: #parachains }

一种拥有插槽并连接到 Polkadot 的区块链。平行链从 Polkadot 获得共享安全性，并能够与 Polkadot 网络上的其他平行链进行交互。他们必须锁定 DOT（原生中继链代币）以确保在特定时期内（最长两年）获得插槽。

### Parathreads {: #parathreads }

一种可以连接到 Polkadot 的区块链。Parathreads 能够与 Polkadot 网络的其他成员交互，但它们以逐块为基础（以 DOT 为单位）竞标区块最终确定权。它们与其他 parathreads 竞争区块最终确定权，这意味着出价最高的区块将被选中在该轮中最终确定。

### Polkadot {: #polkadot }

一个连接的区块链网络，提供共享安全性和链间交互能力。Polkadot 是使用 Substrate 开发框架构建的。连接到 Polkadot 的链称为平行链。

### 中继链 {: #relay-chain }

支持 Polkadot 网络的骨干区块链。平行链连接到中继链，并使用它进行共享安全和消息传递。中继链上的验证人帮助保护平行链的安全。

### 智能合约 {: #smart-contract }

[智能合约](https://en.wikipedia.org/wiki/Smart_contract){target=_blank}是一种计算机程序或交易协议，旨在根据合同或协议的条款自动执行、控制或记录具有法律相关性的事件和行为。智能合约旨在减少对受信任的中间人、仲裁和执行成本的需求，并减少欺诈损失以及恶意和意外的异常情况。

### Substrate {: #substrate }

一个基于 Rust 的区块链开发框架，由 Parity Technologies 基于他们实现多个区块链客户端的经验创建。Substrate 附带构建区块链所需的许多模块和功能，包括 P2P 网络、共识机制、质押、加密货币、链上治理模块等等。它大大减少了实现区块链所需的时间和工程工作量。Substrate 现在是 [Polkadot SDK](https://polkadot.com/platform/sdk/){target=_blank} 的一部分。

### Substrate Frame Pallets {: #substrate-frame-pallets }

Substrate Frame Pallets 是一系列基于 Rust 的模块，提供了构建区块链所需的功能。

### 验证人 {: #validators }

通过在网络中质押 DOT 来保护 Polkadot 中继链的节点，如果行为不端，它们将被罚没。它们确定来自平行链上的收集人的区块，并与其他验证人一起参与下一个中继链区块的共识。

### WebAssembly/Wasm {: #webassemblywasm }

WebAssembly 是一个开放标准，它定义了一种可移植的二进制代码格式。它受到不同编程语言、编译器和浏览器的支持。
