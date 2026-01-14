---
title: Collective Precompile 合约
description: 了解如何使用 Moonbeam Collective Precompile 通过 Moonbeam 上的任何集体（例如财政委员会）来执行民主职能。
keywords: solidity, ethereum, collective, proposal, council technical, committee, moonbeam, precompiled, contracts
categories: Precompiles, Ethereum Toolkit
---

# 与集体预编译交互

## 简介 {: #introduction }

通过 Collective Precompile，用户可以直接从 Solidity 接口与 [Substrate 的 collective pallet](https://paritytech.github.io/substrate/master/pallet_collective/index.html){target=_blank} 进行交互。

Collective 是由一组负责特定民主相关操作的成员组成，例如提案、投票、执行和结束动议。每个集体都可以执行具有不同来源的不同操作。因此，可以创建具有非常具体范围的集体。目前有两个集体：财政委员会集体和 OpenGov 技术委员会集体。因此，每个集体都有一个预编译合约。有关 OpenGov 技术委员会的更多信息，请参阅 [Moonbeam 上的治理](/learn/features/governance/){target=_blank} 页面，有关财政委员会的更多信息，请参阅 [Moonbeam 上的财政](/learn/features/treasury/){target=_blank} 页面。

本指南将向您展示如何使用 Collective Precompile 提出、投票和结束提案。

Collective Precompile 位于以下地址：

=== "Moonbeam"
     |         Collective          |                               地址                                |
     |:---------------------------:|:--------------------------------------------------------------------:|
     |      财政委员会       |        {{networks.moonbeam.precompiles.collective_treasury }}        |
     | OpenGov 技术委员会 | {{networks.moonbeam.precompiles.collective_opengov_tech_committee }} |

=== "Moonriver"
     |         Collective          |                                地址                                |
     |:---------------------------:|:---------------------------------------------------------------------:|
     |      财政委员会       |        {{networks.moonriver.precompiles.collective_treasury }}        |
     | OpenGov 技术委员会 | {{networks.moonriver.precompiles.collective_opengov_tech_committee }} |

=== "Moonbase Alpha"
     |         Collective          |                               地址                                |
     |:---------------------------:|:--------------------------------------------------------------------:|
     |      财政委员会       |        {{networks.moonbase.precompiles.collective_treasury }}        |
     | OpenGov 技术委员会 | {{networks.moonbase.precompiles.collective_opengov_tech_committee }} |

--8<-- 'text/builders/ethereum/precompiles/security.md'

## 集体 Solidity 接口 {: #the-call-permit-interface }

[`Collective.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=\_blank} 是一个 Solidity 接口，允许开发人员与预编译的五个方法进行交互。

该接口包括以下函数：

??? function "**execute**(*bytes memory* proposal) - 以集体的一个成员的身份执行提案。发送者必须是集体的成员。如果 Substrate 提案已分派但失败，则*不会*恢复"

    === "参数"

        - `proposal` - bytes memory 包含 [SCALE 编码](https://docs.polkadot.com/polkadot-protocol/parachain-basics/data-encoding/){target=\_blank} 的 Substrate 调用，该调用建议一项操作

??? function "**propose**(*uint32* threshold, *bytes memory* proposal) - 添加一个新的提案以供投票。发送者必须是集体的成员。如果阈值小于 2，则将直接分派和执行提案，并将提案者作为分派者。如果满足阈值，则返回新提案的索引"

    === "参数"

        - `threshold` - uint32 分派提案所需的成员数量
        - `proposal` - bytes memory 包含 [SCALE 编码](https://docs.polkadot.com/polkadot-protocol/parachain-basics/data-encoding/){target=\_blank} 的 Substrate 调用，该调用建议一项操作

??? function "**vote**(*bytes32* proposalHash, *uint32* proposalIndex, *bool* approve) - 对提案进行投票。发送者必须是集体的成员"

    === "参数"

        - `proposalHash` - bytes32 提案的哈希值
        - `proposalIndex` - uint32 提案的索引
        - `approve` - bool 指示投票是否批准提案

??? function "**close**(*bytes32* proposalHash, *uint32* proposalIndex, *uint64* proposalWeightBound, *uint32* lengthBound) - 关闭提案。一旦有足够的投票，任何人都可以调用。返回一个布尔值，指示提案是否已执行或删除"

    === "参数"

        - `proposalHash` - bytes32 提案的哈希值
        - `proposalIndex` - uint32 提案的索引
        - `proposalWeightBound` - uint64 提案可以使用的 Substrate 权重的最大量。如果提案调用使用更多，则调用将恢复
        - `lengthBound` - uint32 大于或等于 SCALE 编码的提案长度（以字节为单位）的值

??? function "**proposalHash**(*bytes memory* proposal) - 计算提案的哈希值"

    === "参数"

        - `proposal` - bytes memory 包含 [SCALE 编码](https://docs.polkadot.com/polkadot-protocol/parachain-basics/data-encoding/){target=\_blank} 的 Substrate 调用，该调用建议一项操作

该接口包括以下事件：

- **Executed**(*bytes32* proposalHash) - 在执行提案时发出
- **Proposed**(*address indexed* who, *uint32* indexed proposalIndex, *bytes32 indexed* proposalHash, *uint32* threshold) - 当提案已成功提出并且可以执行或投票时发出
- **Voted**(*address indexed* who, *bytes32 indexed proposalHash, *bool* voted) - 在对提案进行投票时发出
- **Closed**(*bytes32 indexed* proposalHash) - 在提案已关闭时发出

## 与Solidity接口交互 {: #interacting-with-the-solidity-interface }

本节的示例将向您展示如何使用 Treasury Council Collective Precompile 提交 Treasury 提案。因此，该提案将受到满足 Treasury Council 投票要求的约束。接受 Treasury 提案的门槛是至少五分之三的 Treasury Council 成员。另一方面，拒绝提案的门槛是至少二分之一的 Treasury Council 成员。请记住，为了提出提案并对其进行投票，您必须是 Treasury Council 的成员。

如果您不是 Moonbeam、Moonriver 或 Moonbase Alpha 上的 Treasury Council 成员，您可以使用 [Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank} 测试 Collective Precompile 的功能。Moonbeam 开发节点带有[十个预先资助的帐户](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=_blank}，其中 Baltathar、Charleth 和 Dorothy 会自动设置为 Treasury Council 集体的成员。您可以使用这三个帐户中的任何一个来按照本指南的其余部分进行操作。

### 检查先决条件 {: #checking-prerequisites }

本指南中的示例将在 Moonbeam 开发节点上展示，但它可以适用于任何基于 Moonbeam 的网络。

要开始使用，您需要具备以下条件：

 - 安装 MetaMask 并[连接到基于 Moonbeam 的网络之一](/tokens/connect/metamask/){target=_blank}
 - 拥有一个有资金的账户。如果使用 Moonbeam 开发节点，则开发账户已预先充值。对于 Moonbeam、Moonriver 或 Moonbase Alpha，您需要为您的账户充值。
  --8<-- 'text/_common/faucet/faucet-list-item.md'

如果您使用的是 Moonbeam 开发节点和开发账户，您还需要执行以下操作：

- 将您的开发节点设置为按时间间隔（例如每 6 秒（6000 毫秒））使用 `--sealing 6000` 标志来密封区块
- [将 Polkadot.js 应用程序连接到您的本地 Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/#connecting-polkadot-js-apps-to-a-local-moonbeam-node){target=_blank}
- 将 Baltathar、Charleth 和/或 Dorothy 的账户导入到 [Polkadot.js 应用程序](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} 和 [MetaMask](/tokens/connect/metamask/#import-accounts){target=_blank}

### Remix 设置 {: #remix-set-up }

1. 获取 [`Collective.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/collective/Collective.sol){target=_blank} 的副本
2. 将文件内容复制并粘贴到名为 `Collective.sol` 的 [Remix 文件](https://remix.ethereum.org){target=_blank}中

![将 Collective 接口复制并粘贴到 Remix 中](/images/builders/ethereum/precompiles/features/governance/collective/collective-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击顶部的第二个 **Compile** 选项卡
2. 然后要编译接口，点击 **Compile Collective.sol**

![编译 Collective.sol](/images/builders/ethereum/precompiles/features/governance/collective/collective-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击 Remix 中**Compile**选项卡正下方的 **Deploy and Run** 选项卡。注意：您不是在此处部署合约； 而是访问已部署的预编译合约
2. 确保在 **ENVIRONMENT** 下拉菜单中选择了 **Injected Provider - Metamask**
3. 确保在 **CONTRACT** 下拉菜单中选择了 **Collective - Collective.sol**。 由于这是一个预编译合约，因此无需部署，而是需要在 **At Address** 字段中提供预编译的地址
4. 提供 Collective 预编译的地址，`{{networks.moonbase.precompiles.collective_treasury}}`，然后点击 **At Address**
5. Collective 预编译将出现在 **Deployed Contracts** 的列表中

![访问预编译合约](/images/builders/ethereum/precompiles/features/governance/collective/collective-3.webp)

### 创建提案 {: #create-a-proposal }

为了提交一份提案以供财政委员会集体投票，您必须首先创建一个财政提案。如果您想要投票的财政提案已经存在，并且您拥有提案索引，则可以跳到下一节。

要提交财政提案，您可以通过 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws%3A%2F%2F127.0.0.1%3A9944#/treasury){target=_blank} 财政页面进行提交。 对于此示例，您可以创建一个简单的提案，向 Alith 发送 10 个 DEV 代币，这些代币可用于举办社区活动。 要开始使用，请单击**提交提案**，然后填写以下信息：

1. 从**使用帐户提交**下拉列表中，选择您要用来提交提案的帐户。 提案的保证金将从该帐户中扣除
2. 选择**受益人**，在此示例中可以是 **Alith**
3. 输入 `10` 作为**值**
4. 单击**提交提案**，然后签名并提交提案

![提交财政提案](/images/builders/ethereum/precompiles/features/governance/collective/collective-4.webp)

您应该会看到提案出现在**提案**部分中。 如果这是创建的第一个提案，它将具有 `0` 的提案索引，这在下一节中将需要。 要查看所有提案，您可以导航到**开发者**选项卡，选择**链状态**，然后执行以下步骤：

1. 从**选定的状态查询**下拉列表中，选择 **treasury**
2. 选择 **proposals** 外部函数
3. 关闭**包括选项**滑块
4. 单击 **+** 提交查询
5. 结果将显示在下方，其中包含提案索引和提案详细信息

![查看所有财政提案](/images/builders/ethereum/precompiles/features/governance/collective/collective-5.webp)

现在您有了提案和提案索引，您将能够在以下部分中使用集体预编译来批准该提案。

### 提议提案 {: #propose-the-proposal }

为了使用 Collective Precompile 提出一个提案，以便相应的集体可以对其进行投票，您需要获取要由提案执行的调用的编码调用数据。 您可以从 Polkadot.js Apps 获取编码的调用数据。 对于此示例，您需要提议 treasury pallet 的 **approveProposal** extrinsic。 为此，请导航到“**Developer**”选项卡，选择“**Extrinsics**”，然后执行以下步骤：

1. 选择一个帐户（任何帐户都可以，因为您无需在此处提交任何交易）
2. 选择 **treasury** pallet
3. 选择 **approveProposal** extrinsic
4. 输入集体将投票批准的提案索引
5. 复制提案的 **encoded call data**

![获取编码的提案](/images/builders/ethereum/precompiles/features/governance/collective/collective-6.webp)

在此示例中，此示例中提案的 extrinsic 编码调用数据为 `0x110200`。

有了编码的提案后，您可以返回到 Remix 并在“**Deployed Contracts**”部分下展开 **COLLECTIVE** 预编译合约。 确保您已连接到作为财政委员会成员的帐户，并按照以下步骤提议批准：

1. 展开 **propose** 函数
2. 输入 **threshold**。 请记住，要批准 Treasury 提案，需要至少五分之三的财政委员会成员投票批准。 因此，在此示例中，您可以将阈值设置为 `2`
3. 对于 **proposal** 字段，您可以粘贴从 Polkadot.js Apps 检索到的编码提案
4. 点击 **transact**
5. MetaMask 将会弹出，您可以确认交易

![提议批准](/images/builders/ethereum/precompiles/features/governance/collective/collective-7.webp)

### 对提案进行投票 {: #vote-on-a-proposal }

要对提案进行投票，您需要通过将编码后的提案传递到 **proposalHash** 函数中来获取提案哈希值。

![获取提案哈希值](/images/builders/ethereum/precompiles/features/governance/collective/collective-8.webp)

获得提案哈希后，请确保您已连接到作为财政委员会成员的帐户，并按照以下步骤对提案进行投票：

1. 在 Remix 中展开 **vote** 函数
2. 输入 **proposalHash**
3. 输入 **proposalIndex**
4. 在 **approve** 字段中输入 `true`
5. 点击 **transact**
6. MetaMask 将会弹出，您可以确认交易

![对提案进行投票](/images/builders/ethereum/precompiles/features/governance/collective/collective-9.webp)

将阈值设置为 `2`，您需要在 MetaMask 中切换帐户到财政委员会集体的另一个成员，并重复上述步骤进行投票并达到阈值。一旦达到阈值，您就可以关闭提案，这将自动执行它，如果获得批准，提案将进入队列，放置到一个支出周期中，在该周期内，所提议的金额将分配给受益人。在这种情况下，一旦提案被放入支出周期，10 个 DEV 代币将被分配给 Alith。

## 关闭提案 {: #close-a-proposal }

如果提案获得足够的票数，任何人都可以关闭提案。您不需要成为财政委员会的成员才能关闭提案。要关闭提案，您可以采取以下步骤：

1. 展开 **close** 函数
2. 输入 **proposalHash**
3. 输入 **proposalIndex**
4. 输入 **proposalWeightBound**，在此示例中可以为 `1000000000`
5. 输入 **lengthBound**，它可以是等于或大于提案的编码调用数据长度的值。对于此示例，编码的调用数据为 `0x110200`，因此，您可以将此值设置为 `8`
6. 点击 **transact**
7. MetaMask 将会弹出，您可以确认交易

![关闭提案](/images/builders/ethereum/precompiles/features/governance/collective/collective-10.webp)

您可以使用 Polkadot.js Apps 验证提案是否已获得批准。从 **Developer** 选项卡中，选择 **Chain State**，然后执行以下步骤：

1. 选择 **treasury** pallet
2. 选择 **approvals** extrinsic
3. 点击 **+** 以提交查询
4. 提案将出现在批准列表中

![查看财政部批准](/images/builders/ethereum/precompiles/features/governance/collective/collective-11.webp)

一旦提案进入支出期，资金将分配给受益人，原始保证金将返还给提案人。如果财政部资金耗尽，已批准的提案将保留在存储中，直到下一个支出期财政部再次拥有足够的资金。
