---
title: 共识 & 最终性
description: 以太坊开发者应该了解的关于 Moonbeam 共识和最终性与以太坊的主要区别。
categories: 基础
---

# Moonbeam 共识与最终性

## 简介 {: #introduction }

虽然 Moonbeam 致力于与以太坊的 Web3 API 和 EVM 兼容，但在共识和最终性方面，开发人员应该了解并理解 Moonbeam 的一些重要差异。

简而言之，共识是不同参与方就共享状态达成一致的方式。当区块被创建时，网络中的节点必须决定哪个区块将代表下一个有效状态。最终性定义了该有效状态何时不能被更改或撤销。

以太坊最初使用基于[工作量证明（PoW）](https://ethereum.org/developers/docs/consensus-mechanisms/pow/){target=_blank}的共识协议，该协议提供概率最终性。然而，在 2022 年，以太坊切换到[权益证明（PoS）](https://ethereum.org/developers/docs/consensus-mechanisms/pos/){target=_blank}，它提供确定性最终性，并且不再使用 PoW。相比之下，Moonbeam 使用基于委托权益证明（DPoS）的混合共识协议，该协议也提供确定性最终性。DPoS 是 Polkadot 的[提名权益证明（NPoS）](https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/){target=_blank}概念的演变，它通过允许委托人选择他们想要支持的收集人候选者以及支持的幅度，从而将更多的权力交到代币持有者手中。

本指南将概述围绕共识和最终性的一些主要差异，以及首次使用 Moonbeam 时的预期。

## 以太坊共识和最终性 {: #ethereum-consensus-and-finality }

以太坊目前使用 PoS 共识协议，其中验证者在网络中质押 ETH，并负责生成区块和检查新区块的有效性。区块生成的时间是固定的，分为 12 秒的 slot 和 32 个 slot 的 epoch。每个 slot 随机选择一个验证者来生成区块并将其广播到网络。每个 slot 都有一个随机选择的验证者委员会，负责确定区块的有效性。在网络中质押的越多，验证者被选中生成或验证区块的机会就越大。

最终性在以太坊的 PoS 共识协议中是确定性的，并通过“检查点”区块实现。验证者在特定的检查点区块上就区块的状态达成一致，这些检查点区块始终是 epoch 中的第一个区块，如果三分之二的验证者同意，则该区块将被最终确定。区块的最终性可以被撤销；但是，存在强大的经济激励措施，因此验证者不会试图串通以撤销区块。您可以在 Vitalik 的 [On Settlement Finality](https://blog.ethereum.org/2016/05/09/on-settlement-finality){target=_blank} 博客中的 Casper 部分的最终性下找到更多信息。

## Moonbeam 共识和最终性 {: #moonbeam-consensus-and-finality }

在 Polkadot 中，有收集人和验证人。[收集人](https://wiki.polkadot.com/learn/learn-collator/){target=_blank}通过收集用户的交易并为中继链[验证人](https://wiki.polkadot.com/learn/learn-validator/){target=_blank}生成状态转换证明来维护平行链（在本例中为 Moonbeam）。收集人集合（生成区块的节点）是根据他们在网络中拥有的权益来选择的。

对于最终性，Polkadot 和 Kusama 依赖于 [GRANDPA](https://docs.polkadot.com/polkadot-protocol/architecture/polkadot-chain/pos-consensus/#finality-gadget-grandpa){target=_blank}。GRANDPA 为任何给定的交易（区块）提供确定性的最终性。换句话说，当一个区块或交易被标记为最终时，除非通过链上治理或分叉，否则它不能被撤销。Moonbeam 遵循这种确定性的最终性。

## PoS 和 DPoS 之间的主要区别 {: #main-differences }

在共识方面，Moonbeam 基于委托权益证明，而以太坊依赖于标准权益证明系统，它们略有不同。虽然这两种机制都依赖于使用权益来验证和创建新区块，但仍存在一些关键差异。

对于以太坊上的 PoS，验证者会根据其在网络中的权益被选中来生产和验证区块。只要验证者已存放验证者押金，他们就可以被选中来生产和验证区块。但是，如前所述，在网络中的权益越大，验证者被选中来生产和验证区块的机会就越高。

另一方面，对于 Moonbeam 上的 DPoS，收集者有资格根据他们自己的权益加上他们在网络中委托的权益来生产区块。任何通证持有者都可以选择将其权益委托给收集者候选人。按权益（包括委托）排序靠前的收集者候选人将加入活跃集。活跃集中的候选人数量受[治理](/learn/features/governance/){target=_blank}的约束。一旦进入活跃集，就会随机选择收集者来使用 Nimbus 共识框架生产区块。重要的是要注意，一旦收集者进入活跃集，他们的总权益不会影响他们被选中生产区块的机会。

在最终性方面，由于以太坊使用的检查点最终性系统，以太坊上的区块完成最终确定所需的时间可能比 Moonbeam 上要长得多。在以太坊中，验证者在检查点区块处确定最终性，检查点区块始终是 epoch 中的第一个区块。由于一个 epoch 有 32 个 slot，每个 slot 为 12 秒，因此区块完成最终确定至少需要 384 秒或 6.4 分钟。

Moonbeam 不使用检查点区块，而是依赖于 Polkadot 的 GRANDPA 最终性工具，其中最终性过程与区块生产并行完成。此外，最终性过程整合了区块链的结构，这允许中继链验证者对他们认为有效的最高区块进行投票。在这种情况下，投票将适用于所有达到最终确定区块的区块，这加快了最终确定过程。在区块被包含在中继链中之后，区块可以在 Moonbeam 上的一个区块内完成最终确定。

## 使用以太坊 RPC 端点检查交易最终性 {: #check-tx-finality-with-ethereum-rpc-endpoints }

虽然最终性工具各不相同，但您可以使用相同且相当简单的策略来检查以太坊和 Moonbeam 上的交易最终性：

 1. 您向网络询问最新的已完成区块的哈希值
 2. 您使用哈希值检索区块号
 3. 您将其与交易的区块号进行比较。如果您的交易包含在先前的区块中，则表示已完成
 4. 作为安全检查，按编号检索区块并验证给定的交易哈希是否在该区块中

下面的代码段遵循此策略来检查事务的最终性。它使用 [默认区块参数](https://ethereum.org/developers/docs/apis/json-rpc/#default-block){target=_blank} 的 `finalized` 选项来获取最新的已完成区块。

--8<-- 'text/_common/endpoint-examples.md'

!!! note
    以下各节中提供的代码段不适用于生产环境。请确保针对每种用例进行调整。

===

    ```js
    --8<-- 'code/learn/core-concepts/consensus-finality/ethers.js'
    ```

===

    ```js
    --8<-- 'code/learn/core-concepts/consensus-finality/web3.js'
    ```

===

    ```py
    --8<-- 'code/learn/core-concepts/consensus-finality/web3.py'
    ```

## 使用 Moonbeam RPC 端点检查交易最终性 {: #check-tx-finality-with-moonbeam-rpc-endpoints }

Moonbeam 增加了对两个自定义 RPC 端点 `moon_isBlockFinalized` 和 `moon_isTxFinalized` 的支持，它们可用于检查链上事件是否已最终确定。 这些方法更直接一些，因为您无需比较区块号来确保您的交易已最终确定。

有关更多信息，您可以访问 Moonbeam 自定义 API 页面的[最终性 RPC 端点](/builders/ethereum/json-rpc/moonbeam-custom-api/#rpc-methods){target=_blank}部分。

您可以修改上面 Ethereum RPC 部分中的脚本，以使用 `moon_isBlockFinalized` 和 `moon_isTxFinalized`。 为此，您可以使用 [Web3.js](https://web3js.readthedocs.io){target=_blank} 和 [Ethers.js](https://docs.ethers.org/v6){target=_blank} 的 `send` 方法自定义调用 Substrate JSON-RPC。 也可以使用 [Web3.py](https://web3py.readthedocs.io){target=_blank} 和 `make_request` 方法进行自定义 RPC 请求。 您需要将方法名称和参数传递给自定义请求，您可以在 [Moonbeam 自定义 API](/builders/ethereum/json-rpc/moonbeam-custom-api/){target=_blank} 页面上找到它们。

???+ code "moon_isBlockFinalized"

    === "Ethers.js"

        ```js
        --8<-- 'code/learn/core-concepts/consensus-finality/custom-rpc/block/ethers.js'
        ```

    === "Web3.js"

        ```js
        --8<-- 'code/learn/core-concepts/consensus-finality/custom-rpc/block/web3.js'
        ```

    === "Web3.py"

        ```py
        --8<-- 'code/learn/core-concepts/consensus-finality/custom-rpc/block/web3.py'
        ```

??? code "moon_isTxFinalized"

    === "Ethers.js"

        ```js
        --8<-- 'code/learn/core-concepts/consensus-finality/custom-rpc/tx/ethers.js'
        ```

    === "Web3.js"

        ```js
        --8<-- 'code/learn/core-concepts/consensus-finality/custom-rpc/tx/web3.js'
        ```

    === "Web3.py"

        ```py
        --8<-- 'code/learn/core-concepts/consensus-finality/custom-rpc/tx/web3.py'
        ```

## 使用 Substrate RPC 终结点检查交易最终性 {: #check-tx-finality-with-substrate-rpc-endpoints }

使用 Substrate JSON-RPC 中的以下三个 RPC 请求，您可以获取当前最终确定的区块，并将其与您要检查最终性的交易的区块号进行比较：

- `chain_getFinalizedHead` - 第一个请求获取最后一个最终确定区块的区块哈希值
- `chain_getHeader` - 第二个请求获取给定区块哈希值的区块头
- `eth_getTransactionReceipt` - 这将检索给定交易哈希值的交易回执

[Polkadot.js API 软件包](/builders/substrate/libraries/polkadot-js-api/){target=_blank} 和 [Python Substrate 接口软件包](/builders/substrate/libraries/py-substrate-interface/){target=_blank} 为开发人员提供了一种使用 JavaScript 和 Python 与 Substrate 链交互的方式。

您可以在 [Polkadot.js 官方文档站点](https://polkadot.js.org/docs/substrate/rpc){target=_blank} 中找到有关 Polkadot.js 和 Substrate JSON-RPC 的更多信息，在 [PySubstrate 官方文档站点](https://jamdottech.github.io/py-polkadot-sdk/){target=_blank} 中找到有关 Python Substrate 接口的更多信息。

===

    ```js
    --8<-- 'code/learn/core-concepts/consensus-finality/polkadotjs.js'
    ```

===

    ```py
    --8<-- 'code/learn/core-concepts/consensus-finality/pysubstrateinterface.py'
    ```

--8<-- 'text/_disclaimers/third-party-content.md'
