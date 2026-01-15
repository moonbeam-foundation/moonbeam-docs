---
title: Collator 账户管理
description: 了解如何管理您的 collator 账户，包括生成会话密钥、映射 Nimbus ID、设置身份以及创建代理账户。
categories: Node Operators and Collators
---

# Collator 帐户管理

## 简介 {: #introduction }

在 Moonbeam 类的网络上运行排序人节点时，您需要了解一些账户管理活动。首先，您需要为您的主服务器和备份服务器创建[会话密钥](https://wiki.polkadot.com/learn/learn-cryptography/#session-keys){target=_blank}，这些密钥将用于确定区块生产和签署区块。

此外，您可以考虑一些可选的账户管理活动，例如设置链上身份或设置代理账户。

本指南将介绍如何管理您的排序人账户，包括生成和轮换您的会话密钥、注册和更新您的会话密钥、设置身份以及创建代理账户。

## 添加和更新会话密钥的流程 {: #process }

首次添加会话密钥的流程与轮换会话密钥的流程相同。创建/轮换会话密钥的流程如下：

1. 使用 `author_rotateKeys` RPC 方法[生成会话密钥](#session-keys)。调用此方法的响应将是一个 128 个十六进制字符的字符串，其中包含 Nimbus ID 和 VRF 会话密钥的公钥
2. 如果您尚未[加入候选池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}，请加入
3. 使用 [Author Mapping Pallet](#author-mapping-interface) 的 `setKeys(keys)` extrinsic 将[会话密钥映射](#mapping-extrinsic)到您的候选帐户，该 extrinsic 接受整个 128 个十六进制字符的字符串作为输入。首次调用 `setKeys` 时，您需要提交一个[映射 bond](#mapping-bonds)。如果您要轮换密钥并且之前已提交了映射 bond，则无需新的 bond

以下部分概述了该过程的每个步骤。

## 生成会话密钥 {: #session-keys }

--8<-- 'text/node-operators/networks/collators/account-management/generate-session-keys.md'

## 管理会话密钥 {: #manage-session-keys }

创建或轮换会话密钥后，您可以使用 Author Mapping Pallet 中的 extrinsics 来管理会话密钥。您可以映射会话密钥、验证链上映射并删除会话密钥。

### 作者映射 Pallet 接口 {: #author-mapping-interface }

`authorMapping` 模块具有以下外部调用：

- **setKeys**(keys) — 接受调用 `author_rotateKeys` 的结果，该结果是您的 Nimbus 和 VRF 密钥的串联公钥，并立即设置会话密钥。在密钥轮换或迁移后非常有用。调用 `setKeys` 需要 [担保](#mapping-bonds)。替换已弃用的 `addAssociation` 和 `updateAssociation` 外部调用
- **removeKeys**() - 删除会话密钥。如果您打算停止整理并离开候选池，则这是唯一需要的。替换已弃用的 `clearAssociation` 外部调用

该模块还添加了以下 RPC 调用（链状态）：

- **mappingWithDeposit**(NimbusPrimitivesNimbusCryptoPublic | string | Uint8Array) — 显示链上存储的所有映射，或者仅显示与提供的 Nimbus ID 相关的映射
- **nimbusLookup**(AccountId20) - 显示所有整理者或给定整理者地址的帐户 ID 到 Nimbus ID 的反向映射

### 映射会话密钥 {: #mapping-extrinsic }

有了新生成的会话密钥后，下一步是将您的会话密钥映射到您的 H160 帐户（以太坊风格的地址）。请确保您持有此帐户的私钥，因为区块奖励将支付到此帐户。

要将会话密钥映射到您的帐户，您需要位于[候选池](/node-operators/networks/collators/activities/#become-a-candidate){target=_blank}中。一旦您成为候选人，您需要发送一个映射外部函数，这需要一个映射保证金。

#### 映射保证金 {: #mapping-bonds }

映射保证金是根据注册的会话密钥计算的。将您的会话密钥映射到您的帐户的保证金如下所示：

=== "Moonbeam"

    text
    {{ networks.moonbeam.staking.collator_map_bond }} GLMR
    
  
=== "Moonriver"

    text
    {{ networks.moonriver.staking.collator_map_bond }} MOVR
    

=== "Moonbase Alpha"

    text
    {{ networks.moonbase.staking.collator_map_bond }} DEV

#### 使用 Polkadot.js Apps 映射会话密钥 {: #use-polkadotjs-apps }

在本节中，您将学习如何通过 Polkadot.js Apps 映射会话密钥。要学习如何通过作者映射预编译合约创建映射，您可以参考[与作者映射预编译交互](/node-operators/networks/collators/author-mapping/){target=\_blank}页面。

要从 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=\_blank} 创建映射（确保您已连接到正确的网络），请点击页面顶部的 **Developer**，从下拉菜单中选择 **Extrinsics** 选项，然后执行以下步骤：

 1. 选择您想要将作者 ID 关联到的帐户，您将使用该帐户签署此交易
 2. 选择 **authorMapping** extrinsic
 3. 将方法设置为 **setKeys()**
 4. 输入 **keys**。这是通过上一节中的 RPC 调用 `author_rotateKeys` 获得的响应，它是您的 Nimbus ID 和 VRF 密钥的串联公钥
 5. 点击 **Submit Transaction**

![作者 ID 映射到账户 Extrinsic](/images/node-operators/networks/collators/account-management/account-1.webp)

!!! note
    如果您收到以下错误，您可能需要尝试再次轮换和映射您的密钥：`VRF PreDigest was not included in the digests (check rand key is in keystore)`。

如果交易成功，您将在屏幕上看到确认通知。如果没有，请确保您已[加入候选池](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}。

### 检查映射 {: #checking-the-mappings }

您可以通过验证链状态来检查当前的链上映射。您可以通过两种方式执行此操作：通过 `mappingWithDeposit` 方法或 `nimbusLookup` 方法。这两种方法都可用于查询所有整理者或特定整理者的链上数据。

您可以检查特定整理者的当前链上映射，也可以检查链上存储的所有映射。

#### 使用 Nimbus 查找方法 {: #using-nimbus-lookup }

要使用 `nimbusLookup` 方法检查特定整理人的映射，您需要整理人的地址。如果您没有将参数传递给该方法，您可以检索所有链上映射。

从 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank} 中，单击页面顶部的 **Developer**，然后从下拉菜单中选择 **Chain State**，并按照以下步骤操作：

 1. 选择 **authorMapping** 作为要查询的状态
 2. 选择 **nimbusLookup** 方法
 3. 提供一个整理人的地址以进行查询。或者，您可以禁用滑块以检索所有映射
 4. 单击 **+** 按钮以发送 RPC 调用

![Nimbus ID 映射链状态](/images/node-operators/networks/collators/account-management/account-3.webp)

您应该能够看到与提供的 H160 帐户关联的 nimbus ID。如果没有提供帐户，这将返回所有存储在链上的映射。

### 删除会话密钥 {: #removing-session-keys }

在删除会话密钥之前，您需要确保已停止整理并离开候选池。要停止整理，您需要安排一个离开候选池的请求，等待一段延迟时间，然后执行该请求。有关分步说明，请参阅 Moonbeam Collator Activities 页面的[停止整理](/node-operators/networks/collators/activities/#stop-collating){target=_blank}部分。

离开候选池后，您可以删除您的会话密钥。之后，您存入的映射保证金将退还到您的帐户。

从 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/assets){target=_blank} 中，单击页面顶部的 **Developer**，然后从下拉列表中选择 **Extrinsics**，并按照以下步骤操作：

1. 选择您的帐户
2. 选择 **authorMapping** pallet 和 **removeKeys** extrinsic
3. 单击 **Submit Transaction**

![Polkadot.js Apps 上的删除会话密钥](/images/node-operators/networks/collators/account-management/account-4.webp)

交易完成后，映射保证金将退还给您。要确保密钥已删除，您可以按照[检查映射](#checking-the-mappings)部分中的步骤操作。

## 设置身份 {: #setting-an-identity }

设置链上身份可以使您的收集人节点易于识别。与显示您的帐户地址相反，将显示您选择的显示名称。

您可以通过几种方式设置您的身份，要了解如何为您的收集人节点设置身份，请查看我们文档的[管理您的帐户身份](/tokens/manage/identity/){target=_blank}页面。

## 代理账户 {: #proxy-accounts }

代理账户是指可以启用以代表您执行有限数量操作的账户。通过代理，用户可以将主账户安全地保存在冷存储中，同时使用代理代表主账户积极参与网络。您可以随时删除代理账户的授权。作为额外的安全层，您可以设置具有延迟期的代理。此延迟期将使您有时间审查交易，并在交易自动执行之前根据需要取消交易。

要了解如何设置代理账户，请参阅我们文档的[设置代理账户](/tokens/manage/proxy-accounts/){target=_blank}页面。
