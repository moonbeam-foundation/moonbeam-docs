---
title: Author Mapping Precompile
description: 本指南旨在帮助整理者学习如何使用 Author Mapping Solidity 接口将 Session Key 映射到 Moonbeam 地址，以便支付区块奖励。
keywords: solidity, ethereum, author mapping, collator, moonbeam, precompiled, contracts, block producer
categories: 节点运营商和整理者
---

# 与作者映射预编译交互

## 简介 {: #introduction }

Moonbeam 上的作者映射预编译合约允许收集人候选人通过熟悉且易于使用的 Solidity 接口将 Session Key 映射到用于支付区块奖励的 Moonbeam 地址。这使候选人可以使用 Ledger 或任何其他与 Moonbeam 兼容的 Ethereum 钱包完成作者映射。但是，建议您在气隙计算机上生成密钥。您可以参考[收集人要求页面的帐户要求部分](node-operators/networks/collators/requirements/#account-requirements){target=\_blank}以了解更多信息。

要成为收集人候选人，您必须[运行一个收集人节点](node-operators/networks/run-a-node/overview/){target=\_blank}。您还需要[加入候选人池](node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}，完全同步您的节点，并在生成会话密钥并将其映射到您的帐户之前提交所需的[保证金](#bonds)。映射会话密钥时，必须支付[额外的保证金](#bonds)。

预编译合约位于以下地址：

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.author_mapping }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.author_mapping }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.precompiles.author_mapping }}
     ```

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## Author Mapping Solidity 接口 {: #the-solidity-interface }

[`AuthorMappingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=\_blank} 是一个 Solidity 接口，允许开发者与预编译方法进行交互。

- **removeKeys**() - 移除作者 ID 和会话密钥。替换已弃用的 `clearAssociation` 外部函数
- **setKeys**(*bytes memory* keys) — 接受调用 `author_rotateKeys` 的结果，这是您的 Nimbus 和 VRF 密钥的串联公钥，并立即设置作者 ID 和会话密钥。在密钥轮换或迁移后非常有用。调用 `setKeys` 需要 [bond](#bonds)。替换已弃用的 `addAssociation` 和 `updateAssociation` 外部函数
- **nimbusIdOf**(*address* who) - 检索给定地址的 Nimbus ID。如果给定地址不存在 Nimbus ID，则返回 `0`
- **addressOf**(*bytes32* nimbusId) - 检索与给定 Nimbus ID 关联的地址。如果 Nimbus ID 未知，则返回 `0`
- **keysOf**(*bytes32* nimbusId) - 检索与给定 Nimbus ID 关联的密钥。如果 Nimbus ID 未知，则返回空字节

## 必需的保证金 {: #bonds }

要学习本教程，您需要加入候选池并将您的会话密钥映射到您的 H160 以太坊风格的帐户。执行这两个操作需要两个保证金。

加入候选池的最低保证金设置如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.min_can_stk }} GLMR
    ```

=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.min_can_stk }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.min_can_stk }} DEV
    ```

当将会话密钥与您的帐户映射时，会发送一个保证金。此保证金是每个注册的会话密钥的保证金。保证金设置如下：

=== "Moonbeam"

    ```text
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    ```
  
=== "Moonriver"

    ```text
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    ```

=== "Moonbase Alpha"

    ```text
    {{ networks.moonbase.staking.collator_map_bond }} DEV
    ```

## 与Solidity接口互动 {: #interact-with-the-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

以下示例在 Moonbase Alpha 上演示，但是，Moonbeam 和 Moonriver 也可以采取类似的步骤。 你应该：

- 安装 MetaMask 并[连接到 Moonbase Alpha](tokens/connect/metamask/){target=\_blank}
- 拥有一个包含 DEV 代币的帐户。你应该有足够的代币来支付[候选人和映射保证金](#bonds)，以及发送交易并将你的会话密钥映射到你的帐户的 gas 费用。要获得足够的 DEV 代币来遵循本指南，你可以直接通过 [Moonbeam Discord 服务器](https://discord.com/invite/PfpUATX){target=\_blank}联系管理员
- 确保你正在[运行排序人节点](node-operators/networks/run-a-node/overview/){target=\_blank}并且已完全同步
- 确保你已[加入候选人池](node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}

如前所述，你可以通过将 Ledger 连接到 MetaMask 来使用它。请参阅 [Ledger](tokens/connect/ledger/){target=\_blank} 指南以将你的 Ledger 导入到 MetaMask。请注意，不建议将 Ledger 用于生产用途。有关更多信息，请参阅[排序人要求中的帐户要求](node-operators/networks/collators/requirements/#account-requirements){target=\_blank}。

### 生成会话密钥 {: #generate-session-keys }

--8<-- 'zh/text/node-operators/networks/collators/account-management/generate-session-keys.md'

### Remix 设置 {: #remix-set-up }

首先，获取 [`AuthorMappingInterface.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/author-mapping/AuthorMappingInterface.sol){target=\_blank} 的副本，并执行以下步骤：

1. 点击 **File explorer** 选项卡
2. 将文件内容复制并粘贴到名为 `AuthorMappingInterface.sol` 的 [Remix 文件](https://remix.ethereum.org){target=\_blank}中

![将授权映射接口复制并粘贴到 Remix 中](/images/node-operators/networks/collators/author-mapping/author-mapping-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击**编译**标签，从上往下数第二个
2. 然后编译接口，点击**Compile AuthorMappingInterface.sol**

![编译 AuthorMappingInterface.sol](/images/node-operators/networks/collators/author-mapping/author-mapping-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击Remix中**Compile**(编译)选项卡下方的 **Deploy and Run**(部署和运行) 选项卡。注意：您不是在此处部署合约，而是访问已部署的预编译合约
2. 确保在 **ENVIRONMENT**(环境) 下拉菜单中选择了 **Injected Provider - Metamask**
3. 确保在 **CONTRACT**(合约) 下拉菜单中选择了 **AuthorMappingInterface.sol**。由于这是一个预编译合约，因此无需部署，而是需要在 **At Address**(在地址) 字段中提供预编译的地址
4. 提供 Moonbase Alpha 的作者映射预编译的地址：`{{networks.moonbase.precompiles.author_mapping}}` 并点击 **At Address**(在地址)

![提供地址](/images/node-operators/networks/collators/author-mapping/author-mapping-3.webp)

作者映射预编译将出现在 **Deployed Contracts**(已部署合约)列表中。

### 映射会话密钥 {: #map-session-keys }

下一步是将您的会话密钥映射到您的 H160 帐户（以太坊风格的地址）。请确保您持有此帐户的私钥，因为这是支付区块奖励的地方。

要将会话密钥映射到您的帐户，您需要位于[候选池](node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}中。一旦您成为候选人，您需要发送一个映射 extrinsic。请注意，这将绑定每个已注册作者 ID 的代币。

在开始之前，请确保您已连接到要将您的会话密钥映射到的帐户。这将是您收到区块奖励的帐户。

1. 展开 **AUTHORMAPPING** 合约
2. 展开 **setKeys** 方法
3. 输入您的会话密钥
4. 单击 **transact**
5. 通过单击 **Confirm** 确认出现的 MetaMask 交易

![映射您的会话密钥](/images/node-operators/networks/collators/author-mapping/author-mapping-4.webp)

要验证您是否已成功映射您的会话密钥，您可以使用 [author mapping pallet](node-operators/networks/collators/account-management/#author-mapping-interface){target=\_blank} 的 `mappingWithDeposit` 方法或 `nimbusLookup` 方法。为此，请参阅 [Collator 帐户管理指南的“检查映射”部分](node-operators/networks/collators/account-management/#check-the-mappings){target=\_blank}。
