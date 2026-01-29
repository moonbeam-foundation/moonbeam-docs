---
title: 通过 XCM 进行远程 EVM 调用
description: 如何通过 XCM 从任何与 Moonbeam 建立了 XCM 通道的 Polkadot 平行链对 Moonbeam EVM 上的智能合约进行远程调用。
categories: XCM 远程执行, Ethereum 工具包
---

# 通过 XCM 进行远程 EVM 调用

## 简介 {: #introduction}

[XCM Transactor Pallet](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank} 提供了一个简单的界面，用于通过 XCM 执行远程跨链调用。但是，这不考虑对 Moonbeam 的 EVM 进行远程调用的可能性，仅考虑对特定于 Substrate 的 pallet（功能）进行调用。

Moonbeam 的 EVM 只能通过 [Ethereum Pallet](https://github.com/polkadot-evm/frontier/tree/master/frame/ethereum){target=\_blank} 访问。除此之外，此 pallet 还在将交易放入交易池之前处理某些交易验证。然后，它在将池中的交易插入区块之前执行另一个验证步骤。最后，它通过 `transact` 函数提供接口来执行经过验证的交易。所有这些步骤都遵循与以太坊交易在结构和签名方案方面相同的行为。

但是，直接通过 XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=\_blank} 调用 [Ethereum Pallet](https://github.com/polkadot-evm/frontier/tree/master/frame/ethereum){target=\_blank} 是不可行的。主要是因为远程 EVM 调用的调度器账户（在以太坊中称为 `msg.sender`）未在 Moonbeam 端签署 XCM 交易。XCM extrinsic 在起始链中签名，XCM 执行器通过 [`Transact`](https://github.com/paritytech/xcm-format#transact){target=\_blank} 指令从链接到起始链中发送者的已知调用者调度调用。在这种情况下，Ethereum Pallet 将无法验证签名，并最终验证交易。

为此，引入了 [Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank}。它充当 XCM [`Transact`](https://github.com/paritytech/xcm-format#transact){target=\_blank} 指令和 [Ethereum Pallet](https://github.com/polkadot-evm/frontier/tree/master/frame/ethereum){target=\_blank} 之间的中间件，因为通过 XCM 远程执行 EVM 调用时需要进行特殊考虑。该 pallet 执行必要的检查并验证交易。接下来，该 pallet 调用 Ethereum Pallet 以将交易调度到 EVM。由于访问 EVM 的方式，常规 EVM 调用和远程 EVM 调用之间存在一些差异。

以下图表描述了通过 XCM 进行的常规 EVM 调用和远程 EVM 调用的理想路径：

![通过 XCM 进行的常规 EVM 调用和远程 EVM 调用的理想路径](/images/builders/interoperability/xcm/remote-execution/remote-evm-calls/xcmevm-1.webp)

本指南将介绍常规 EVM 调用和远程 EVM 调用之间的差异。此外，它还将向您展示如何通过 [Ethereum XCM pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank} 公开的 extrinsic 执行远程 EVM 调用。

!!! note
    远程 EVM 调用通过 [XCM Transactor Pallet](/builders/interoperability/xcm/remote-execution/substrate-calls/xcm-transactor-pallet/){target=\_blank} 完成。因此，建议在尝试通过 XCM 执行远程 EVM 调用之前，先熟悉 XCM Transactor 的概念。

**请注意，通过 XCM 对 Moonbeam 的 EVM 进行的远程调用仍在积极开发中**。此外，**开发人员必须了解，发送不正确的 XCM 消息可能会导致资金损失。** 因此，至关重要的是在 TestNet 上测试 XCM 功能，然后再转移到生产环境。

## 通过 XCM 进行常规和远程 EVM 调用的区别 {: #differences-regular-remote-evm}

正如[简介](#introduction)中所述，常规和远程 EVM 调用到达 EVM 的路径截然不同。造成这种差异的主要原因是交易的调度程序。

常规 EVM 调用有一个明显的发送者，它使用其私钥对以太坊交易进行签名。ECDSA 类型的签名可以通过签名消息和签名算法生成的 `r-s` 值进行验证。以太坊签名使用一个名为 `v` 的附加变量，它是恢复标识符。

对于远程 EVM 调用，签名者在另一条链中签署 XCM 交易。Moonbeam 接收该 XCM 消息，该消息遵循通过 XCM 形式的常规远程执行：

 - [`DescendOrigin`](/builders/interoperability/xcm/core-concepts/instructions/#descend-origin){target=\_blank}（可选）
 - [`WithdrawAsset`](/builders/interoperability/xcm/core-concepts/instructions/#withdraw-asset){target=\_blank}
 - [`BuyExecution`](/builders/interoperability/xcm/core-concepts/instructions/#buy-execution){target=\_blank}
 - [`Transact`](/builders/interoperability/xcm/core-concepts/instructions/#transact){target=\_blank}

XCM 执行通过 [计算来源账户机制](/builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank}进行，默认情况下，该机制使用源链的主权账户在目标链中。如果包含 `DescendOrigin`，Moonbeam 会将 XCM 调用的来源更改为无密钥账户，源链中的用户可以通过 XCM 远程控制该账户。远程 EVM 调用从该无密钥账户（或相关的[代理](/tokens/manage/proxy-accounts/){target=\_blank}）分派。因此，由于交易未签名，因此没有签名的实际 `v-r-s` 值，而是 `0x1`。

由于远程 EVM 调用没有签名的实际 `v-r-s` 值，因此 EVM 交易哈希可能会出现冲突问题，因为它被计算为签名交易 blob 的 keccak256 哈希。因此，如果两个具有相同 nonce 的账户提交相同的交易对象，它们将最终得到相同的 EVM 交易哈希。因此，所有远程 EVM 交易都使用附加到 [以太坊 XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank} 的全局 nonce。

另一个显著差异是 gas 价格。远程 EVM 调用的费用是在 XCM 执行级别收取的。因此，EVM 级别的 gas 价格为零，并且 EVM 不会收取执行本身的费用。这也可以在远程 EVM 调用交易的回执中看到。因此，必须配置 XCM 消息，以便 `BuyExecution` 购买足够的权重来支付 gas 成本。

最后一个区别在于 gas 限制。以太坊使用 gas 计量系统来调节可以在一个区块中完成的执行量。相反，Moonbeam 使用[基于权重的系统](https://docs.polkadot.com/polkadot-protocol/parachain-basics/blocks-transactions-fees/fees/){target=\_blank}，其中每个调用都以在一个区块中执行所需的时间为特征。每个权重单位对应于一皮秒的执行时间。

截至运行时 2900，XCM 队列的配置表明 XCM 消息应在以下权重单位内执行：

=== "Moonbeam"

    ```text
    125,000,000,000（0.125 秒的区块执行时间）
    ```

=== "Moonriver"

    ```text
    500,000,000,000（0.5 秒的区块执行时间）
    ```

=== "Moonbase Alpha"

    ```text
    500,000,000,000（0.5 秒的区块执行时间）
    ```

!!! note
    在运行时 2900 之前，所有网络中 XCM 消息的权重限制均为 `20,000,000,000` 权重单位（即 `0.02` 秒的区块执行时间）。

假设 XCM 消息由于给定区块中缺少执行时间而无法执行，并且权重要求超过上述限制。在这种情况下，XCM 消息将被标记为“超重”，并且只能通过民主方式执行。

每个 XCM 消息的最大权重限制限制了通过 XCM 进行远程 EVM 调用可用的 gas 限制。对于所有基于 Moonbeam 的网络，每个权重单位的 gas 比率为 [`25,000`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/runtime/moonbase/src/lib.rs#L417){target=\_blank} ([`WEIGHT_REF_TIME_PER_SECOND`](https://paritytech.github.io/substrate/master/frame_support/weights/constants/constant.WEIGHT_REF_TIME_PER_SECOND.html){target=\_blank} / [`GAS_PER_SECOND`](https://github.com/moonbeam-foundation/moonbeam/blob/{{ networks.moonbase.spec_version }}/runtime/moonbase/src/lib.rs#L414){target=\_blank})。考虑到您需要一些 XCM 消息权重来执行 XCM 指令，远程 EVM 调用可能会消耗 2,000,000,000 个单位。以下公式可用于确定远程 EVM 调用的最大 gas 单位数：

```
Maximum Gas Units = (Maximum Weight Units - Remote EVM Weight Units) / 25,000
```

因此，可以计算出您可以为远程 EVM 调用提供的最大 gas 限制：

=== "Moonbeam"

    ```text
    Maximum Gas Units = (125,000,000,000 - 2,000,000,000) / 25,000
    Maximum Gas Units = 4,920,000
    ```

=== "Moonriver"

    ```text
    Maximum Gas Units = (500,000,000,000 - 2,000,000,000) / 25,000
    Maximum Gas Units = 19,920,000
    ```

=== "Moonbase Alpha"

    ```text
    Maximum Gas Units = (500,000,000,000 - 2,000,000,000) / 25,000
    Maximum Gas Units = 19,920,000
    ```

!!! note
    这些值将来可能会发生变化。

总之，以下是常规 EVM 调用和远程 EVM 调用之间的主要区别：

- 远程 EVM 调用使用全局 nonce（由 [以太坊 XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank} 拥有），而不是每个账户的 nonce
- 远程 EVM 调用的签名的 `v-r-s` 值为 `0x1`。无法通过标准方法（例如，通过 [ECRECOVER](/builders/ethereum/precompiles/utility/eth-mainnet/#verify-signatures-with-ecrecover){target=\_blank}）从签名中检索发送者。但是，`from` 包含在交易回执中，以及通过哈希获取交易时（使用以太坊 JSON-RPC）
- 所有远程 EVM 调用的 gas 价格为零。EVM 执行在 XCM 执行级别收费，而不是在 EVM 级别收费
- 您可以为远程 EVM 调用设置的当前最大 gas 限制不同，如上所述

## Ethereum XCM Pallet 接口 {: #ethereum-xcm-pallet-interface}

### 外在函数 {: #extrinsics }

Ethereum XCM Pallet 提供了以下外在函数（函数），可以通过 `Transact` 指令调用，以通过 XCM 访问 Moonbeam 的 EVM：

???+ function "**transact**(xcmTransaction) — 通过 XCM 远程调用 EVM 的函数。只能通过执行 XCM 消息来调用"

    === "参数"

        - `xcmTransaction` - 将被调度的调用的以太坊交易详情。版本化的 `xcmTransaction` 结构包含以下内容：
            - `gasLimit` - 以太坊交易的 gas 限制
            - `action` - 要执行的操作，它提供两个选项：`Call` 和 `Create`。[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank} 的当前实现不支持 `CREATE` 操作。因此，您无法通过远程 EVM 调用部署智能合约。对于 `Call`，您需要指定您正在交互的合约地址
            - `value` - 要发送的本地代币的数量
            - `input` - 合约交互的编码调用数据

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/interface-examples/transact.js'
        ```

    !!! note
        在以下部分中，您将准确了解如何获取以太坊交易调用数据，以及如何使用此外在函数构建 XCM 消息。

??? function "**transactThroughProxy**(transactAs, xcmTransaction) — 通过 XCM 远程调用 EVM 并从具有已知密钥的给定帐户（`msg.sender`）调度的函数"

    === "参数"

        - `xcmTransaction` - 将被调度的调用的以太坊交易详情。版本化的 `xcmTransaction` 结构包含以下内容：
            - `gasLimit` - 以太坊交易的 gas 限制
            - `action` - 要执行的操作，它提供两个选项：`Call` 和 `Create`。[Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank} 的当前实现不支持 `CREATE` 操作。因此，您无法通过远程 EVM 调用部署智能合约。对于 `Call`，您需要指定您正在交互的合约地址
            - `value` - 要发送的本地代币的数量
            - `input` - 合约交互的编码调用数据
        - `xcmTransactAs` - 将从中调度远程 EVM 调用的帐户（`msg.sender`）。此帐户需要在 Moonbeam 上将计算出的原始帐户设置为 `any` 类型的[代理](/tokens/manage/proxy-accounts/){target=\_blank}，否则远程 EVM 调用将失败。交易费用仍然由计算出的原始账户支付

    === "Polkadot.js API 示例"

        ```js
        --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/interface-examples/transact-through-proxy.js'
        ```

## 通过 XCM 构建远程 EVM 调用 {: #build-remote-evm-call-xcm}

本指南介绍如何使用从[XCM Pallet](https://github.com/paritytech/polkadot-sdk/blob/{{ polkadot_sdk }}/polkadot/xcm/pallet-xcm/src/lib.rs){target=\_blank}从 relay 链到 Moonbase Alpha 构建用于远程 EVM 调用的 XCM 消息。更具体地说，它将使用 `transact` 函数。使用 `transactThroughProxy` 函数的步骤是相同的。但是，您需要提供 `transactAs` 账户，并确保此账户已在 Moonbase Alpha 上将计算源账户设置为 `any` 类型的代理。

!!! note
    当使用 `transactThroughProxy` 时，EVM 调用由您提供的 `transactAs` 账户分派，充当 `msg.sender`，只要此账户已在您使用的基于 Moonbeam 的网络中将计算源账户设置为 `any` 类型的代理。但是，交易费用仍由计算源账户支付，因此您需要确保它有足够的资金来支付这些费用。

构建和执行远程执行的过程可以概括如下：

1. 计算将在 Moonbase Alpha 上执行的 EVM 调用的调用数据
2. 使用 EVM 调用数据生成 Moonbase Alpha 上 Ethereum XCM Pallet 的 `transact` extrinsic 的调用数据
3. 在 relay 链上构建 XCM 消息，其中将包括 `WithdrawAsset`、`BuyExecution` 和 `Transact` 指令。在 `Transact` 指令中，您将使用 Ethereum XCM `transact` 调用数据
4. 使用 relay 链上的 Alice 账户，您将通过 XCM Pallet 的 `send` extrinsic 发送 XCM 消息
5. Moonbase Alpha 上的 Alice 计算源账户将分派 EVM 调用数据

### 检查先决条件 {: #ethereumxcm-check-prerequisites}

要能够从relay chain发送调用，您需要以下内容：

- 在具有资金 (UNIT) 的relay chain上的[帐户](https://polkadot.js.org/apps/?rpc=wss://relay.api.moonbase.moonbeam.network#/accounts){target=\_blank}，以支付交易费用。您可以通过在[Moonbeam-Swap](https://moonbeam-swap.netlify.app){target=\_blank}（Moonbase Alpha上的演示Uniswap-V2克隆）上交换DEV代币（Moonbase Alpha的本地代币）来获取一些xcUNIT，然后[将它们发送到relay chain](/builders/interoperability/xcm/xc20/send-xc20s/xtokens-precompile/){target=\_blank}。此外，您可以[在Discord上联系我们](https://discord.com/invite/PfpUATX){target=\_blank}以直接获取一些UNIT代币
- 您的Computed Origin帐户的地址。请参阅 [Computed Origin](/builders/interoperability/xcm/remote-execution/computed-origins/){target=\_blank} 指南，以了解如何计算您的Computed Origin地址
- 为您的Computed Origin帐户提供资金。该帐户必须有足够的DEV代币（或Moonbeam/Moonriver的GLMR/MOVR），以支付远程EVM调用的XCM执行成本。请注意，这是将从中调度远程EVM调用的帐户 (`msg.sender`)。因此，该帐户必须满足EVM调用正确执行所需的任何条件。例如，如果您要进行ERC-20转账，请持有任何相关的ERC-20代币

!!! note
    假设您正在使用`transactThroughProxy`函数。在这种情况下，`transactAs`帐户必须满足EVM调用正确执行所需的任何条件，因为它充当 `msg.sender`。但是，Computed Origin帐户是需要持有DEV代币（或Moonbeam/Moonriver的GLMR/MOVR）以支付远程EVM调用的XCM执行成本的帐户。

### Ethereum XCM 交易调用数据 {: #ethereumxcm-transact-data }

在您将 XCM 消息从 Relay 链发送到 Moonbase Alpha 之前，您需要获取编码后的调用数据，该数据将通过执行 [`Transact`](https://github.com/paritytech/xcm-format#transact){target=\_blank} XCM 指令来分派。

在此示例中，您将与 [Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm) 的 `transact` 函数交互，该函数接受 `xcmTransaction` 作为参数。

`xcmTransaction` 参数要求您定义 `gasLimit`、`action`、`value` 和 `input`。

对于要执行的操作，您将与一个简单的 [递增合约](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=\_blank} 进行合约交互，该合约位于 `0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8`。您将调用 `increment` 函数，该函数没有输入参数，并且会将 `number` 的值增加 1。它还会将执行该函数的区块时间戳存储到 `timestamp` 变量中。

`increment` 函数的编码调用数据为 `0xd09de08a`，它是函数选择器，也是 `increment()` 的 keccak256 哈希的前八个十六进制字符（或 4 个字节）。如果您选择与具有输入参数的函数进行交互，则还需要对它们进行编码。获取编码调用数据最简单的方法是在 [Remix](/builders/ethereum/dev-env/remix/#interacting-with-a-moonbeam-based-erc-20-from-metamask){target=\_blank} 或 [Moonscan](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#code){target=\_blank} 中模拟交易。然后，在 Metamask 中，选中 **HEX DATA: 4 BYTES**（十六进制数据：4 字节）选项卡下的 **HEX**（十六进制）以获取调用数据。您无需签署交易。

现在，您已经获得了编码后的合约交互数据，您可以使用 [`eth_estimateGas` JSON-RPC 方法](https://ethereum.org/developers/docs/apis/json-rpc/#eth_estimategas){target=\_blank} 确定此调用的 gas 限制。对于此示例，您可以将 gas 限制设置为 `155000`。

对于 value，您可以将其设置为 `0`，因为此特定交互不需要 DEV（或者 Moonbeam/Moonriver 的 GLMR/MOVR）。对于需要 DEV 的交互，您需要相应地修改此值。

现在您已经拥有了 `xcmTransaction` 参数所需的所有组件，您可以构建它：

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/generate-encoded-calldata.js:5:12'
```

接下来，您可以编写脚本来获取交易的编码调用数据。您将采取以下步骤：

 1. 提供调用的输入数据。这包括：
     - 用于创建提供程序的 Moonbase Alpha 端点 URL
     - `transact` 函数的 `xcmTransaction` 参数的值
 2. 创建 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} 提供程序
 3. 使用 `xcmTransaction` 值制作 `ethereumXcm.transact` 外部函数
 4. 获取外部函数的编码调用数据。您无需签署和发送交易

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/generate-encoded-calldata.js'
```

!!! note
    您可以在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics/decode/0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00){target=\_blank} 上查看上述脚本输出的示例，使用以下编码的调用数据：`0x260001785d02000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`。

您将在下一节的 `Transact` 指令中使用编码的调用数据。

### 估计所需的最大权重 {: #estimate-weight-required-at-most }

当使用 `Transact` 指令时，您需要定义 `requireWeightAtMost` 字段，这是交易所需的权重。此字段接受两个参数：`refTime` 和 `proofSize`。`refTime` 是可用于执行的计算时间量，`proofSize` 是可使用的存储量（以字节为单位）。

要获得 `refTime` 和 `proofSize` 的估计值，您可以使用 [Polkadot.js API 的 `paymentInfo` 方法](/builders/substrate/libraries/polkadot-js-api/#fees){target=\_blank}。由于 `Transact` 调用数据需要这些权重，您可以扩展上一节中的脚本以添加对 `paymentInfo` 的调用。

`paymentInfo` 方法接受与通常传递给 `.signAndSend` 方法相同的参数，即发送帐户，以及可选的一些附加值，例如 nonce 或签名者。

要修改编码的调用数据脚本，您需要添加 Alice 的 Computed Origin 地址，并使用它来调用 `tx.paymentInfo` 方法。

???+ code "修改后的脚本"

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/estimate-required-weight.js'
    ```

在撰写本文时，该脚本返回 `refTime` 的估计值为 `3900000000`，`proofSize` 的估计值为 `9687`。

### 构建用于远程 EVM 执行的 XCM {: #build-xcm-remote-evm }

现在您已经生成了 EVM 调用的 call data，接下来将使用中继链上的 XCM Pallet 来执行远程执行。为此，您将使用 `send` 函数，它接受两个参数：

- `dest` - 表示将 XCM 消息发送到生态系统中某条链（目标链）的 XCM versioned multilocation
- `message` - 要执行的 SCALE 编码的 versioned XCM 消息

您可以按照以下步骤开始组装这些参数：

1. 构建目标链（Moonbase Alpha）的 multilocation：

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/send.js:8:8'
    ```

2. 构建 `WithdrawAsset` 指令，这需要您定义：

    - Moonbase Alpha 上 DEV 代币的 multilocation
    - 要提取的 DEV 代币数量

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/send.js:9:16'
    ```

3. 构建 `BuyExecution` 指令，这需要您定义：

    - Moonbase Alpha 上 DEV 代币的 multilocation
    - 用于购买执行费用的 DEV 代币数量
    - weight limit

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/send.js:17:25'
    ```

4. 构建 `Transact` 指令，这需要您定义：

    - origin kind
    - 交易所需的 weight（您在[估计所需的最大权重](#estimate-weight-required-at-most)部分计算得到）
    - 编码后的 call data（您在 [Ethereum XCM Transact Call Data](#ethereumxcm-transact-data) 部分生成）

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/send.js:26:35'
    ```

5. 将 XCM 指令组合为 versioned XCM 消息：

    ```js
    --8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/send.js:36:36'
    ```

现在您已经为每个参数准备好了值，就可以编写执行脚本了。您将执行以下步骤：

1. 提供调用的输入数据。这包括：
    - 用于创建 provider 的中继链 endpoint URL
    - `send` 函数每个参数对应的值
2. 创建将用于发送交易的 Keyring 实例
3. 创建 [Polkadot.js API](/builders/substrate/libraries/polkadot-js-api/){target=\_blank} provider
4. 使用 `dest` 和 `message` 值构造 `xcmPallet.send` extrinsic
5. 使用您在第二步创建的 Keyring 实例，通过 `.signAndSend` 发送交易

!!! remember
    这仅用于演示目的。切勿将您的私钥存储在 JavaScript 文件中。

```js
--8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/send.js'
```

!!! note
    您可以在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://relay.api.moonbase.moonbeam.network#/extrinsics/decode/0x630004000100a10f040c000400010403001300008a5d784563011300010403001300008a5d784563010006010300286bee007901260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00){target=\_blank} 上查看上述脚本输出示例，使用以下编码的 call data：`0x630004000100a10f040c000400010403001300008a5d784563011300010403001300008a5d784563010006010300286bee007901260001581501000000000000000000000000000000000000000000000000000000000000a72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8000000000000000000000000000000000000000000000000000000000000000010d09de08a00`。

当交易被处理后，您可以在[中继链](https://polkadot.js.org/apps/?rpc=wss://relay.api.moonbase.moonbeam.network#/explorer/query/0x2a0e40a2e5261e792190826ce338ed513fe44dec16dd416a12f547d358773f98){target=\_blank}和 [Moonbase Alpha](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer/query/0x7570d6fa34b9dccd8b8839c2986260034eafef732bbc09f8ae5f857c28765145){target=\_blank} 中查看相关的 extrinsics 和 events。

在中继链上，该 extrinsic 是 `xcmPallet.send`，关联事件是 `xcmPallet.Sent`（以及其它与费用相关的事件）。在 Moonbase Alpha 上，XCM 执行发生在 `parachainSystem.setValidationData` extrinsic 中，并且有多个关联事件值得关注：

- **parachainSystem.DownwardMessagesReceived** — 表示接收到了来自中继链的消息。对于当前的 XCM 实现，来自其它平行链的消息也会显示同样的事件
- **balances.Withdraw** — 与为支付执行费用而从账户中提取代币相关的事件。注意 `who` 地址是此前计算的 Computed Origin 账户
- **ethereum.Executed** — 与远程 EVM 调用执行相关的事件。它提供 `from`、`to`、`transactionHash`（使用非标准签名与全局 pallet nonce 计算得到）以及 `exitReason`。目前，一些常见 EVM 错误（例如 gas 不足）在 exit reason 中会显示为 `Reverted`
- **polkadotXcm.AssetsTrapped** — 当从账户中提取用于费用的部分代币没有被使用而“遗留”时会触发的事件。一般发生在 registry 中有未分配到某个账户的剩余代币时。这些代币会被临时销毁，并且可以通过民主提案取回。结合使用 `RefundSurplus` 与 `DepositAsset` 这两条 XCM 指令，可以避免资产被“trapped”

要验证通过 XCM 的远程 EVM 调用是否成功，您可以前往 [Moonscan 上的合约页面](https://moonbase.moonscan.io/address/0xa72f549a1a12b9b49f30a7f3aeb1f4e96389c5d8#readContract){target=\_blank}，查看 `number` 的新值及其时间戳。

## 通过哈希查询远程 EVM 调用交易 {: #remote-evm-call-txhash }

如前所述，常规 EVM 调用与通过 XCM 的远程 EVM 调用之间存在一些[差异](#differences-regular-remote-evm)。当您使用以太坊 JSON-RPC 通过交易哈希查询交易时，这些差异会更明显。

首先，您需要获取要查询的交易哈希。对于本示例，您可以使用上一节中的交易哈希：[0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f](https://moonbase.moonscan.io/tx/0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f){target=\_blank}。打开终端并执行以下命令：

```sh
--8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/1.sh'
```

如果 JSON-RPC 请求发送正确，响应应如下所示：

```json
--8<-- 'code/builders/interoperability/xcm/remote-execution/remote-evm-calls/2.json'
```

请注意，`v-r-s` 值被设置为 `0x1`，并且与 gas price 相关的字段被设置为 `0x0`。此外，`nonce` 字段对应的是 [Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank} 的全局 nonce，而不是调度者账户的交易计数（transaction count）。

!!! note
    在 Moonbase Alpha TestNet 上，您可能会发现一些交易哈希碰撞，因为通过 XCM 的远程 EVM 调用的早期版本并未使用 [Ethereum XCM Pallet](https://github.com/moonbeam-foundation/moonbeam/tree/master/pallets/ethereum-xcm){target=\_blank} 的全局 nonce。
