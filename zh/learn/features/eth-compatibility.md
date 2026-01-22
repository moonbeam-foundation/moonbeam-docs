---
title: Ethereum 兼容性
description: 要从以太坊过渡到 Moonbeam 吗？以下简要概述了 Moonbeam 以太坊兼容性的关键组件和主要差异。
categories: Basics
---

# Ethereum 兼容性

Moonbeam 连接了以太坊和波卡生态系统，为开发者提供了以太坊工具和基础设施的熟悉性，同时利用了波卡的可扩展性和互操作性。

本文档概述了 Moonbeam 的以太坊兼容性功能，并重点介绍了其关键组件。它还涵盖了 Moonbeam 和以太坊之间的一些关键差异，以便以太坊开发者了解会发生什么。

## 关键组件 {: #key-components }

### EVM 兼容性 {: #evm }

Moonbeam 包含一个完全兼容的 EVM，用于以 Solidity 或其他 EVM 兼容语言执行智能合约。这使开发人员能够以最少的修改在 Moonbeam 上部署现有的 Ethereum 智能合约。

### Ethereum 风格账户 {: #ethereum-style-accounts }

Moonbeam 采用 H160 Ethereum 风格账户和 ECDSA 密钥，确保与现有 Ethereum 钱包的兼容性，并促进流畅的最终用户体验。这得益于 Moonbeam 的统一账户系统，该系统修改了底层 Substrate 账户系统以默认使用 Ethereum 账户。

了解更多：

- [Moonbeam 的统一账户系统](/learn/core-concepts/unified-accounts/){target=_blank}

### JSON-RPC 支持 {: #json-rpc-support }

Moonbeam提供与以太坊完全的JSON-RPC兼容性，允许开发人员使用熟悉的以太坊工具和库与Moonbeam节点进行交互。这种兼容性扩展到帐户管理、交易提交、智能合约部署和事件监控的方法。

除了标准的以太坊RPC方法外，Moonbeam还支持非标准的Debug和Trace模块，为开发人员提供增强的智能合约执行调试和跟踪功能。Debug模块允许开发人员检查内部状态转换和执行跟踪，从而能够高效地调试复杂的智能合约。Trace模块提供详细的交易跟踪，包括操作码级别的执行信息和Gas消耗，从而方便性能分析和优化。

了解更多：

- [支持的以太坊RPC方法](builders/ethereum/json-rpc/eth-rpc/){target=_blank}
- [使用以太坊JSON-RPC方法订阅事件](builders/ethereum/json-rpc/pubsub/){target=_blank}
- [使用非标准RPC方法调试和跟踪交易](builders/ethereum/json-rpc/debug-trace/){target=_blank}

### 以太坊开发者工具和库 {: #ethereum-dev-tools }

Moonbeam 以以太坊 JSON-RPC 方法为底层支持，充分利用以太坊丰富的开发者库和环境生态系统。通过与流行的以太坊库和开发环境的无缝集成，开发者可以利用他们现有的知识和工具在 Moonbeam 上构建和部署去中心化应用程序 (DApp)。

了解更多：

- [以太坊库](builders/ethereum/libraries/){target=_blank}
- [以太坊开发环境](builders/ethereum/libraries/){target=_blank}

### 预编译合约 {: #precompiled-contracts }

Moonbeam 提供预编译合约，以允许以太坊智能合约无缝访问 Substrate 功能。这些预编译合约将链上治理、质押和身份管理等 Substrate 功能暴露给 Moonbeam 上的以太坊 DApp。 这种集成确保了以太坊开发人员可以充分利用 Moonbeam 功能的潜力，从而扩展了 Moonbeam 上 dApp 开发的可能性。

此外，开发人员可以在 Moonbeam 上的智能合约中无缝利用以太坊主网预编译。 这些预编译合约广泛应用于以太坊网络，可优化并高效地执行通用加密操作和复杂计算。 通过支持以太坊主网预编译，Moonbeam 确保了与基于以太坊的 dApp 的兼容性，同时使开发人员能够利用熟悉的工具和库在其平台上进行构建。

了解更多：

- [Moonbeam 预编译合约概述](builders/ethereum/precompiles/overview/){target=_blank}

### Ethereum 代币标准 {: #ethereum-token-standards }

Moonbeam 支持 Ethereum 代币标准，允许开发者部署和交互符合如 ERC-20、ERC-721 和 ERC-1155 等流行标准的代币。通过支持这些标准，Moonbeam 允许开发者无需修改即可部署现有的 Ethereum 代币。

由于 Moonbeam 的原生互操作性，ERC-20 可以通过跨共识消息传递 (XCM) 跨链发送到 Polkadot 生态系统内的其他链。

了解更多：

- [支持 XCM 的 ERC-20](builders/interoperability/xcm/xc20/overview/#local-xc20s){target=_blank}（也称为本地 XC-20）

## 主要区别 {: #key-differences }

### 共识机制 {: #consensus-mechanisms }

Moonbeam 使用委托权益证明（DPoS）共识机制，网络中的代币持有者可以委托候选人成为区块生产者，这些区块生产者被称为_收集人_。另一方面，以太坊使用权益证明（PoS）系统，其中验证者根据他们在网络中的权益被选中来生产和验证区块。

了解更多：

- [PoS 和 DPoS 之间的区别](learn/core-concepts/consensus-finality/#main-differences){target=_blank}

### 最终性 {: #finality }

Moonbeam 和以太坊具有不同的最终性流程。在以太坊上，存在一个检查点系统，验证者在该系统中确定检查点区块的最终性，区块至少需要 6.4 分钟才能最终确定。Moonbeam 依赖于 Polkadot 的 [GRANDPA](https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/#finality-gadget-grandpa){target=_blank} 最终性工具，它通过并行于区块生产完成该流程并允许中继链验证者对最高区块进行投票来加速最终性，从而最终确定所有通往该区块的区块。

了解更多信息：

- [Moonbeam 上的共识和最终性](learn/core-concepts/consensus-finality/){target=_blank}

### 代理账户 {: #proxy-accounts }

在 Moonbeam 和以太坊上，账户都可以由两种主要的账户类型控制：外部拥有账户 (EOA) 或智能合约。但是，在 Moonbeam 上，在这两种账户类型中，还有代理账户，可以代表另一个账户执行数量有限的操作。

了解更多：

- [代理账户概述](https://wiki.polkadot.com/learn/learn-proxies/){target=_blank}
- [如何设置代理账户](tokens/manage/proxy-accounts/){target=_blank}

### 账户余额 {: #account-balances }

以太坊上的余额非常简单明了；如果一个账户持有代币，那么该账户就拥有代币余额。在 Moonbeam 上，存在不同的余额类型以支持各种 Substrate 功能。主要有五种类型：自由余额、可减少余额、预留余额、其他冻结余额和手续费冻结余额。当使用以太坊工具时，账户会显示可减少余额，不包括锁定或冻结的余额。

了解更多：

- [Moonbeam 账户余额](learn/core-concepts/balances/){target=_blank}

### 余额转移 {: #balance-transfers }

由于 Moonbeam 是一个基于 Substrate 的链，因此可以通过以太坊和 Substrate API 进行原生资产（GLMR、MOVR 和 DEV）的余额转移。与以太坊一样，通过以太坊 API 发送的转移依赖于 `eth_sendRawTransaction`。通过 Substrate API 发送的转移使用 Balances Pallet 完成，Balances Pallet 是 Substrate 框架中的一个内置模块，提供管理账户和余额的功能。

了解更多：

- [Moonbeam 上的余额转移](learn/core-concepts/transfers-api/){target=_blank}

### 交易费用 {: #transaction-fees }

由于底层架构和共识机制的差异，Moonbeam 和以太坊计算交易费用的方式有所不同。计算交易费用的根本区别在于，以太坊使用基于 Gas 的费用系统，而 Moonbeam 使用基于权重的系统，该系统映射到所使用的 Gas。Moonbeam 还在底层 Gas 计算中实施了其他指标，包括证明大小和存储成本。

了解更多：

- [在 Moonbeam 上计算交易费用](learn/core-concepts/tx-fees/){target=_blank}
