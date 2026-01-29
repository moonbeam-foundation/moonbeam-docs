---
title: Preimage 预编译合约
description: 了解如何通过提交包含提案中要执行的操作的preimage，来采取在链上提交提案的第一个必要步骤。
categories: Precompiles, Ethereum Toolkit
---

# 与 Preimage 预编译合约交互

## 介绍 {: #introduction }

作为一个 Polkadot 平行链和去中心化网络，Moonbeam 具有原生的链上治理功能，使利益相关者能够参与到网络的发展方向中。随着 OpenGov（也称为 Governance v2）的引入，Preimage Pallet 允许代币持有者通过提交 preimage 来创建提案，preimage 是提案中要执行的操作，在链上。提交提案需要 preimage 的哈希值。要了解更多关于 Moonbeam 治理系统的信息，例如相关术语的概述、提案的路线图等等，请参阅 [Moonbeam 上的治理](/learn/features/governance/){target=\_blank} 页面。

Preimage Precompile 直接与 Substrate 的 Preimage Pallet 交互。该 pallet 是用 Rust 编写的，通常无法从 Moonbeam 的以太坊端访问。但是，Preimage Precompile 允许您访问创建和管理 preimage 所需的函数，所有这些函数都是 Substrate Preimage Pallet 的一部分，直接从 Solidity 接口访问。

Preimage Precompile 位于以下地址：

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.preimage }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.preimage }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.preimage }}
     ```

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## 预映像Solidity接口 {: #the-preimage-solidity-interface }

[`Preimage.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=\_blank} 是一个 Solidity 接口，允许开发人员与预编译的两种方法进行交互：

??? function "**notePreimage**(*bytes memory* encodedProposal) - 在链上注册即将到来的提案的预映像。这不需要提案在调度队列中，但确实需要一旦颁布就会退还的存款。"

    === "参数"

        - `encodedProposal` - 包含要注册的编码提案的字节内存。返回预映像哈希

??? function "**unnotePreimage**(*bytes32* hash) - 从存储中清除未请求的预映像。"

    === "参数"

        - `hash` - 要从存储中移除的预映像的 bytes32 哈希

该接口还包括以下事件：

- **PreimageNoted**(*bytes32* hash) - 在链上注册预映像时发出
- **PreimageUnnoted**(*bytes32* hash) - 在链上取消注册预映像时发出

## 与 Solidity 接口交互 {: #interact-with-the-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

以下示例在 Moonbase Alpha 上演示，但是，也可以对 Moonriver 采取类似的步骤。要按照本指南中的步骤进行操作，您需要具备以下条件：

 - 安装了 MetaMask 并[连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - 一个包含一些 DEV 代币的帐户。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

### Remix 设置 {: #remix-set-up }

1. 点击**文件资源管理器**选项卡
2. 将[`Preimage.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/preimage/Preimage.sol){target=\_blank}的副本粘贴到名为 `Preimage.sol` 的 [Remix 文件](https://remix.ethereum.org){target=\_blank}中

![复制粘贴 referenda Solidity 接口到 Remix 中。](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击顶部第二个 **Compile** 选项卡
2. 然后编译接口，点击 **Compile Preimage.sol**

![使用 Remix 编译 Preimage.sol 接口。](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击 Remix 中**编译**选项卡正下方的**部署和运行**选项卡。注意：您不是在此处部署合约，而是访问已部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中选择了**注入提供程序 - Metamask**
3. 确保在**CONTRACT**下拉菜单中选择了**Preimage.sol**。由于这是一个预编译合约，因此无需部署，而是要在“**At Address**”字段中提供预编译的地址
4. 提供 Moonbase Alpha 的 Preimage 预编译地址：`{{ networks.moonbase.precompiles.preimage }}`，然后点击“**At Address**”
5. Preimage 预编译将出现在**已部署合约**列表中

![通过提供预编译的地址来访问 Preimage.sol 界面。](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-3.webp)

### 提交提案的预映像 {: #submit-a-preimage }

为了提交提案，您首先需要提交该提案的预映像，该预映像本质上定义了链上的拟议操作。您可以使用 Preimage 预编译的 `notePreimage` 函数提交预映像。`notePreimage` 函数接受编码后的提案，因此您需要采取的第一个步骤是获取编码后的提案，这可以使用 Polkadot.js Apps 轻松完成。

在本节中，您将获取提案的预映像哈希和编码后的提案数据。要获取预映像哈希，您首先需要导航到 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#){target=\_blank} 的 **Preimage** 页面：

 1. 导航到 [**Governance** 选项卡](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=\_blank}
 2. 从下拉列表中选择 **Preimages**
 3. 在 **Preimages** 页面中，单击 **+ Add preimage**

![添加新的预映像](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-4.webp)

然后按照以下步骤操作：

 1. 选择一个帐户（任何帐户都可以，因为您在此处未提交任何交易）
 2. 选择要与之交互的 pallet 和要提议的可分派函数（或操作）。您选择的操作将决定需要在以下步骤中填写的字段。在此示例中，它是 **system** pallet 和 **remark** 函数
 3. 输入备注的文本，确保它是唯一的。重复的提案（如“Hello World!”）将不被接受
 4. 单击 **Submit preimage** 按钮，但不要在下一页上签名或确认交易

![获取提案哈希](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-5.webp)

在下一个屏幕上，按照以下步骤操作：

 1. 按下三角形图标以显示字节中的编码提案
 2. 复制 **bytes**（编码提案）— 在调用 `notePreimage` 函数时需要用到它

![获取编码提案](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-6.webp)

!!! note
     您不应在此处签名并提交交易。您将在下一步中通过 `notePreimage` 函数提交此信息。

现在，您可以获取从 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/democracy){target=\_blank} 获取的编码提案的 **bytes**，并通过 Preimage 预编译的 `notePreimage` 函数提交它。要通过 `notePreimage` 函数提交预映像，请按照以下步骤操作：

1. 展开 Preimage 预编译合约以查看可用的函数
2. 找到 **notePreimage** 函数，然后按下按钮以展开该部分
3. 提供您在前一节中记下的编码提案的 **bytes**。注意，编码提案与预映像哈希不同。确保您在此字段中输入正确的值
4. 按 **transact** 并在 MetaMask 中确认交易

![使用 Preimage 预编译的 notePreimage 函数提交预映像。](/images/builders/ethereum/precompiles/features/governance/preimage/preimage-7.webp)

现在您已经提交了提案的预映像，您的提案就可以提交了！前往 [Referenda 预编译文档](/builders/ethereum/precompiles/features/governance/referenda/){target=\_blank} 了解如何提交您的提案。

如果您希望删除预映像，您可以按照上面记录的相同步骤操作，除了使用 `unnotePreimage` 函数并传入预映像哈希而不是编码提案。
