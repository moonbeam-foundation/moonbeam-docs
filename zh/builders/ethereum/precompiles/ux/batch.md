---
title:  批量预编译合约
description: 了解如何通过 Moonbeam 的批量预编译合约的 Solidity 接口一次性处理多个转账和合约交互。
keywords: solidity, ethereum, batch, transaction, moonbeam, precompiled, contracts
categories: Precompiles, Ethereum Toolkit
---

# 与批量预编译交互

## 介绍 {: #introduction }

Moonbeam 上的批量预编译合约允许开发者将多个 EVM 调用合并为一个。

目前，让用户与多个合约交互需要在用户的钱包中进行多次交易确认。一个例子是批准智能合约访问某个代币，然后再转移它。通过批量预编译，开发者可以通过批量交易来改善用户体验，因为它最大限度地减少了用户需要确认的交易数量，只需一次确认即可。此外，由于批量处理避免了多个基本 Gas 费（开始一笔交易最初花费的 21000 个单位的 Gas），因此可以降低 Gas 费。

预编译直接与 [Substrate 的 EVM pallet](https://polkadot-evm.github.io/frontier/rustdocs/pallet_evm/){target=_blank} 交互。批量函数的调用者的地址将充当所有子交易的 `msg.sender`，但与 [委托调用](https://docs.soliditylang.org/en/v0.8.15/introduction-to-smart-contracts.html#delegatecall-callcode-and-libraries){target=_blank} 不同，目标合约仍然会影响其自身的存储。这实际上与用户签署多个交易相同，但只需要一次确认。

预编译位于以下地址：

=== "Moonbeam"

    `{{ networks.moonbeam.precompiles.batch }}`

=== "Moonriver"

    `{{ networks.moonriver.precompiles.batch }}`

=== "Moonbase Alpha"

    `{{ networks.moonbase.precompiles.batch }}`

--8<-- 'text/builders/ethereum/precompiles/security.md'

## Batch Solidity 接口 {: #the-batch-interface }

[`Batch.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank} 是一个 Solidity 接口，允许开发人员与预编译的三个方法进行交互。

该接口包括以下函数：

??? function "**batchSome**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) - 执行多个调用，其中每个数组的相同索引组合成单个子调用所需的信息。 如果一个子调用回退，将仍然尝试后续的子调用"

    === "参数"

        - `to` - address[] 地址数组，用于将子交易定向到，其中每个条目是一个子交易
        - `value` - uint256[] 原生货币值数组，用于在子交易中发送，其中索引对应于 to 数组中相同索引的子交易。 如果此数组短于 to 数组，则所有后续的子交易将默认为值 0
        - `callData` - bytes[] 调用数据数组，用于包含在子交易中，其中索引对应于 to 数组中相同索引的子交易。 如果此数组短于 to 数组，则所有后续的子交易将不包含调用数据
        - `gasLimit` - uint64[] gas 限制数组，用于子交易中，其中索引对应于 to 数组中相同索引的子交易。 值为 0 被解释为无限制，并将转发批量交易的所有剩余 gas。 如果此数组短于 to 数组，则所有后续的子交易将转发所有剩余 gas

??? function "**batchSomeUntilFailure**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) - 执行多个调用，其中每个数组的相同索引组合成单个子调用所需的信息。 如果一个子调用回退，则不会执行后续的子调用"

    === "参数"

        - `to` - address[] 地址数组，用于将子交易定向到，其中每个条目是一个子交易
        - `value` - uint256[] 原生货币值数组，用于在子交易中发送，其中索引对应于 to 数组中相同索引的子交易。 如果此数组短于 to 数组，则所有后续的子交易将默认为值 0
        - `callData` - bytes[] 调用数据数组，用于包含在子交易中，其中索引对应于 to 数组中相同索引的子交易。 如果此数组短于 to 数组，则所有后续的子交易将不包含调用数据
        - `gasLimit` - uint64[] gas 限制数组，用于子交易中，其中索引对应于 to 数组中相同索引的子交易。 值为 0 被解释为无限制，并将转发批量交易的所有剩余 gas。 如果此数组短于 to 数组，则所有后续的子交易将转发所有剩余 gas

??? function "**batchAll**(*address[]* to, *uint256[]* value, *bytes[]* callData, *uint64[]* gasLimit) - 以原子方式执行多个调用，其中每个数组的相同索引组合成单个子调用所需的信息。 如果一个子调用回退，则所有子调用都会回退"

    === "参数"

        - `to` - address[] 地址数组，用于将子交易定向到，其中每个条目是一个子交易
        - `value` - uint256[] 原生货币值数组，用于在子交易中发送，其中索引对应于 to 数组中相同索引的子交易。 如果此数组短于 to 数组，则所有后续的子交易将默认为值 0
        - `callData` - bytes[] 调用数据数组，用于包含在子交易中，其中索引对应于 to 数组中相同索引的子交易。 如果此数组短于 to 数组，则所有后续的子交易将不包含调用数据
        - `gasLimit` - uint64[] gas 限制数组，用于子交易中，其中索引对应于 to 数组中相同索引的子交易。 值为 0 被解释为无限制，并将转发批量交易的所有剩余 gas。 如果此数组短于 to 数组，则所有后续的子交易将转发所有剩余 gas

该接口还包括以下必需的事件：

- **SubcallSucceeded**(*uint256* index) - 当给定索引的子调用成功时发出
- **SubcallFailed**(*uint256* index) - 当给定索引的子调用失败时发出

## 与Solidity接口交互 {: #interact-with-the-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备：

- [已安装MetaMask并连接到Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- 在Moonbase Alpha上创建或拥有两个帐户，以测试批处理预编译中的不同功能
- 至少一个帐户需要有`DEV`代币。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

### 示例合约 {: #example-contract}

合约 `SimpleContract.sol` 将用作批量处理合约交互的示例，但实际上，任何合约都可以进行交互。

```solidity
--8<-- 'code/builders/ethereum/precompiles/ux/batch/simple-contract.sol'
```

### Remix 设置 {: #remix-set-up }

您可以使用 [Remix](https://remix.ethereum.org){target=_blank} 与批量预编译进行交互。您需要 [`Batch.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/batch/Batch.sol){target=_blank} 和 [`SimpleContract.sol`](#example-contract) 的副本。要将预编译添加到 Remix 并按照教程进行操作，您需要：

1. 点击**文件浏览器**标签
2. 将 `Batch.sol` 合约粘贴到名为 **Batch.sol** 的 Remix 文件中
3. 将 `SimpleContract.sol` 合约粘贴到名为 **SimpleContract.sol** 的 Remix 文件中

### 编译合约 {: #compile-the-contract }

接下来，您需要在 Remix 中编译这两个文件：

1. 确保您已打开 **Batch.sol** 文件
2. 单击顶部的第二个 **Compile** 选项卡
3. 要编译合约，请单击 **Compile Batch.sol**

![编译 Batch.sol](/images/builders/ethereum/precompiles/ux/batch/batch-1.webp)

如果接口编译成功，您将在 **Compile** 选项卡旁边看到一个绿色复选标记。

### 访问预编译 {: #access-the-precompile }

您可以通过预编译合约的地址访问接口，而不是部署批处理预编译：

1. 在 Remix 中，点击**编译**选项卡正下方的**部署和运行**选项卡。请注意，预编译合约已经部署
2. 确保在**环境**下拉菜单中选择了 **注入提供程序 - Metamask**。选择 **注入提供程序 - Metamask** 后，MetaMask 可能会提示您将您的帐户连接到 Remix
3. 确保在**帐户**下显示了正确的帐户
4. 确保在**合约**下拉菜单中选择了 **Batch - Batch.sol**。由于这是一个预编译合约，因此无需部署任何代码。相反，我们将在**地址**字段中提供预编译的地址
5. 提供批处理预编译的地址：`{{networks.moonbase.precompiles.batch}}`，然后点击**地址**

![访问地址](/images/builders/ethereum/precompiles/ux/batch/batch-2.webp)

**BATCH** 预编译将出现在**已部署合约**列表中。

### 部署示例合约 {: #deploy-example-contract }

另一方面，`SimpleContract.sol` 将被部署为一个新合约。在开始本节之前，请使用 `SimpleContract.sol` 文件重复[编译步骤](#compile-the-contract)。

1. 在 Remix 中，单击 **Compile** 选项卡正下方的 **Deploy and Run** 选项卡
2. 确保在 **ENVIRONMENT** 下拉列表中选择了 **Injected Provider - Metamask**。选择 **Injected Provider - Metamask** 后，MetaMask 可能会提示您将您的帐户连接到 Remix
3. 确保 **ACCOUNT** 下显示正确的帐户
4. 确保在 **CONTRACT** 下拉列表中选择了 **SimpleContract - SimpleContract.sol**
5. 点击 **Deploy**
6. 点击 **Confirm** 确认出现的 MetaMask 交易

![部署 SimpleContract](/images/builders/ethereum/precompiles/ux/batch/batch-3.webp)

**SIMPLECONTRACT** 合约将出现在 **Deployed Contracts** 列表中。

### 通过预编译发送本地货币 {: #send-native-currency-via-precompile }

通过批量预编译发送本地货币比在 Remix 或 MetaMask 中按几个按钮要复杂。在此示例中，您将使用 **batchAll** 函数以原子方式发送本地货币。

交易有一个 value 字段，用于指定要随之发送的本地货币量。在 Remix 中，这由“**部署和运行交易**”选项卡中的“**VALUE**”输入表示。但是，对于批量预编译，此数据在批量函数的 **value** 数组输入中提供。

尝试通过 Moonbase Alpha 上的批量预编译将本地货币转移到您选择的两个钱包：

1. 确保您连接的钱包中至少有 0.5 DEV
2. 展开“**已部署合约**”下的批量合约
3. 展开 **batchAll** 函数
4. 对于 **to** 输入，以以下格式插入您的地址：`["INSERT_ADDRESS_1", "INSERT_ADDRESS_2"]`，其中第一个地址对应于您选择的第一个钱包，第二个地址对应于您选择的第二个钱包
5. 对于 **value** 输入，插入您希望为每个地址转移的 Wei 金额。例如，`["100000000000000000", "200000000000000000"]` 会将 0.1 DEV 转移到第一个地址，将 0.2 DEV 转移到第二个地址
6. 对于剩余的 **callData** 和 **gasLimit** 输入，插入 `[]`。调用数据和 gas 限制不是转移本地货币的问题
7. 按“**交易**”
8. 在 MetaMask 扩展中按“**确认**”以确认交易

![发送批量转移](/images/builders/ethereum/precompiles/ux/batch/batch-4.webp)

交易完成后，请务必检查两个帐户的余额，无论是在 MetaMask 中还是在[区块浏览器](/builders/get-started/explorers/){target=_blank}中。恭喜！您现在已通过批量预编译发送了批量转移。

!!! note
     通常，如果您想将本地货币发送到合约或通过合约发送，则必须在整个交易对象中设置该值，并与可支付函数交互。但是，由于批量预编译直接与 Substrate 代码交互，因此这不是典型的以太坊交易，因此没有必要。

### 通过预编译进行函数交互 {: #function-interaction-via-precompile }

本节的示例将使用 **batchAll** 函数，该函数可确保事务以原子方式解析。请记住，还有另外两个批量函数可以继续子事务（即使出现错误），或者停止后续子事务，但不恢复先前的子事务。

与函数交互与[发送原生币](#send-native-currency-via-precompile)非常相似，因为它们都是事务。但是，需要调用数据才能正确地将输入提供给函数，并且发送者可能希望限制每个子事务中花费的 gas 量。

`callData` 和 `gasLimit` 字段与和合约交互的子事务更相关。对于批量接口中的每个函数，`callData` 输入是一个数组，其中每个索引对应于子事务的每个接收者的调用数据，即每个 `to` 输入。如果 `callData` 数组的大小小于 `to` 数组，则剩余的子事务将没有调用数据（没有输入的函数）。`gasLimit` 输入是一个数组，对应于每个子事务可以花费的 gas 量。如果它在索引处的值为 0，或者索引是数组的大小或更大（且小于 `to` 数组的大小），则将转发来自先前子事务的所有剩余 gas。

要使用预编译来发送原子批量事务，请执行以下步骤：

1. 使用其标题右侧的复制按钮复制 `SimpleContract.sol` 合约的地址。请务必同时拥有[上一节中的调用数据](#find-a-contract-interactions-call-data)
2. 展开 **已部署的合约** 下的批量合约
3. 展开 **batchAll** 函数
4. 对于 **to** 输入，插入您先前复制的 `SimpleContract.sol` 合约的地址，格式如下：`["INSERT_SIMPLE_CONTRACT_ADDRESS"]`
5. 对于值输入，由于 `SimpleContract.sol` 不需要支付任何原生币，因此插入 `["0"]` 作为 0 Wei
6. 对于 **callData** 输入，插入上一节中的调用数据，格式如下：`["INSERT_CALL_DATA"]`
7. 对于 **gasLimit** 输入，插入 `[]`。您可以输入 gas 限制值，但它是可选的
8. 按 **transact**
9. 在 MetaMask 扩展程序中按 **Confirm** 以确认交易

![批量函数交互](/images/builders/ethereum/precompiles/ux/batch/batch-6.webp)

如果您使用了与教程相同的调用数据，检查以确保交易成功：

1. 展开 **已部署的合约** 下的 `SimpleContract.sol` 合约
2. 在 **messages** 按钮的右侧，插入 `1`
3. 按蓝色 **messages** 按钮

![SimpleContract 确认](/images/builders/ethereum/precompiles/ux/batch/batch-7.webp)

短语 **“moonbeam”** 应该出现在它下面。恭喜！您已使用批量预编译与函数进行了交互。

### 组合子交易 {: combining-subtransactions }

到目前为止，转移原生货币和与函数交互是分开的，但它们可以交织在一起。

以下四个字符串可以组合作为批量交易的输入。 它们会将 1 DEV 交易到公共 Gerald (`0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b`) 帐户，并与预先部署的 `SimpleContract.sol` 智能合约交互两次。 以下是详细的分解：

有三个子交易，因此 `to` 的输入数组中有三个地址。 第一个是公共 Gerald 帐户，接下来的两个是预先部署的 `SimpleContract.sol` 智能合约。 如果愿意，可以将最后两个替换为您自己的 `SimpleContract.sol` 实例。 或者，只替换一个：您可以在一条消息中与多个合约交互。

text
[
  "0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b",
  "0xd14b70a55F6cBAc06d4FA49b99be0370D0e1BD39", 
  "0xd14b70a55F6cBAc06d4FA49b99be0370D0e1BD39"
]

`value` 数组也将有三个值。 `to` 输入数组中的第一个地址与发送 1 DEV 有关，因此 Wei 中的 1 DEV 在数组中。 以下两个值为 0，因为它们的子交易与之交互的函数不接受或不需要原生货币。

text
["1000000000000000000", "0", "0"]

您将需要 `callData` 数组的三个值。 由于转移原生货币不需要调用数据，因此该字符串只是空白。 数组中的第二个和第三个值对应于将消息设置为 id 5 和 6 的 **setMessage** 的调用。

text
[
  "0x", 
  "0x648345c8000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000009796f752061726520610000000000000000000000000000000000000000000000", 
  "0x648345c800000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000e61206d6f6f6e6265616d2070726f000000000000000000000000000000000000"
]

最后的输入是 `gas_input`。此数组将留空，以将所有剩余 gas 转发到每个子交易。

text
[]

尝试以相同的方式在 Remix 中使用这些输入发送批量交易[您批量调用函数的方式](#function-interaction-via-precompile)。

就这样！ 您已使用 MetaMask 和 Remix 成功与 ERC-20 预编译合约进行交互！

## Ethereum 开发库 {: #ethereum-development-libraries }

如果您已经学习了 Moonbeam 上的 [Ethers.js 教程](/builders/ethereum/libraries/ethersjs/){target=_blank}，您可能会发现很难找到函数的调用数据。答案隐藏在 Ether 的 `Interface` 对象中，其中的 [encodeFunctionData](https://docs.ethers.org/v6/api/abi/#Interface-encodeFunctionData){target=_blank} 函数允许您输入函数名称和输入，以接收最终的调用数据。

!!! note
    以下各节中提供的代码片段不适用于生产环境。请确保针对每个用例进行调整。

===

     js
     --8<-- 'code/builders/ethereum/precompiles/ux/batch/ethers-batch.js'
     

===

     js
     --8<-- 'code/builders/ethereum/precompiles/ux/batch/web3js-batch.js'
     

===

     py
     --8<-- 'code/builders/ethereum/precompiles/ux/batch/web3py-batch.py'
     

之后，您应该可以像通常与 [Ethers](/builders/ethereum/libraries/ethersjs/){target=_blank} 中的合约交互一样与批处理预编译进行交互。
