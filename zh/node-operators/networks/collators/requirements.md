---
title: Moonbeam 区块收集人要求
description: 了解在 Moonbeam 网络上成为并维护一个区块收集人节点的要求，包括硬件、保证金等要求。
categories: 节点运营商和区块收集人
---

# Collator 要求

## 简介 {: #introduction }

在深入运行验证人节点之前，需要记住一些要求。首先，您需要遵守社区准则并满足技术要求。您应该拥有顶级的硬件，安全创建和存储的帐户，满足绑定要求，并填写验证人问卷。

建议在 Moonbase Alpha TestNet 上完成所有必要的要求，然后再在像 Moonbeam 或 Moonriver 这样的生产网络上进行整理。

本指南将帮助您开始满足验证人的要求，以便您可以立即启动并运行您的节点。

## 社区准则 {: #community-guidelines }

收集人有责任以诚实的方式为网络服务。如果发生以下任何禁止的违规行为，可能会通过链上治理采取行动：

- 任何实体在任何一个网络中运行超过四个收集人
- 收集人使用相同的 Nimbus 密钥运行多个节点，导致含糊不清。含糊不清是指在同一区块高度提交多个区块的行为，这会导致网络分叉。由于它意味着网络降级，因此严格禁止这样做。恶意行为者（试图获得更多包含/生成的区块）或错误（运行具有相同密钥的备份节点）可能会执行此操作。每个节点都需要有自己唯一的密钥，并且任何备份解决方案都需要确保不可能出现含糊不清的情况
- 收集人的行为不光彩，对社区或其他收集人不友好

有必要对社区和网络做出一定程度的承诺，以赢得委托人社区的信任并吸引更多的委托。以下是一些为社区做贡献的建议：

- 积极参与社区
    - [加入 Discord](/node-operators/networks/collators/overview/#join-discord){target=\_blank} 并进行自我介绍，根据需要提供更新，并帮助支持社区成员或其他收集人
- 创建教程和教育内容
- [成为 Moonbeam 大使](https://moonbeam.network/community/ambassador){target=\_blank}
- 贡献与生态系统相关的开源软件
- 积极参与治理并对提案进行投票

## 硬件要求 {: #hardware-requirements }

整理人必须运行具有整理选项的完整节点。为此，请按照[运行节点](/node-operators/networks/run-a-node/overview/)教程和[使用 Systemd](/node-operators/networks/run-a-node/systemd/)的安装步骤进行操作。确保您使用整理人的特定代码片段。

!!! note
    运行 **整理人** 节点的 CPU 要求高于上述教程中提供的要求。为了使您的整理人节点能够跟上高交易吞吐量，具有高时钟速度和单核性能的 CPU 非常重要，因为区块生产/导入过程几乎完全是单线程的。
    也不建议在 Docker 中运行您的整理人节点，因为它会对性能产生重大影响。

从硬件角度来看，拥有顶级的硬件对于最大限度地提高区块生产和奖励非常重要。以下是一些表现良好并提供最佳结果的硬件建议：

- **推荐 CPU** - Intel Xeon E-2386/2388 或 Ryzen 9 5950x/5900x
- **推荐 NVMe** - 1 TB NVMe
- **推荐 RAM** - 32 GB RAM

此外，您还应考虑以下事项：

- 由于大多数云提供商都专注于多线程而不是单线程性能，因此建议使用裸机提供商
- 您应该在不同的数据中心和国家/地区拥有主备裸机服务器。Hetzner 适用于其中一台服务器，但不应用于两台服务器
- 您的 Moonbeam 服务器应仅专用于 Moonbeam，请勿将同一服务器用于其他应用

## 账户要求 {: #account-requirements }

与 Polkadot 验证人类似，您需要创建一个账户。对于 Moonbeam 来说，这是一个 H160 账户或一个以太坊风格的账户，您需要持有该账户的私钥。作为收集人，您有责任正确管理您自己的密钥。不正确的操作可能会导致资金损失。

虽然可以使用许多以太坊钱包，但为了生产目的，建议尽可能安全地生成密钥。还建议生成备份密钥。您实际上可以使用 Moonbeam 二进制文件通过一个名为 Moonkey 的工具来生成密钥。它可用于生成以太坊风格的账户和 Substrate 风格的账户。

为了安全地生成密钥，建议在与外界隔离的机器上进行。生成密钥后，请务必安全地存储它们。为了安全地存储您的密钥，以下是一些建议，从最不安全到最安全：

- 写下您的密钥并进行塑封
- 将您的密钥刻在金属板上
- 使用像 [Horcrux](https://gitlab.com/unit410/horcrux){target=\_blank} 这样的工具来分片您的密钥

与往常一样，建议您自己进行研究并使用您认为是值得信赖的工具。

### Moonkey 入门 {: #getting-started-with-moonkey }

第一步是获取 GitHub 上托管的 moonkey 二进制文件。为此，您可以下载一个二进制文件（已在 Linux/Ubuntu 上测试）：

`https://github.com/moonbeam-foundation/moonbeam/releases/download/v0.8.0/moonkey`

下载该工具后，请确保您具有执行二进制文件的正确访问权限。接下来，通过检查下载文件的哈希值来检查您是否拥有正确的版本。

对于基于 Linux 的系统（如 Ubuntu），打开终端并转到 moonkey 二进制文件所在的文件夹。到达那里后，您可以使用 sha256sum 工具来计算 SHA256 哈希值：

```text
019c3de832ded3fccffae950835bb455482fca92714448cc0086a7c5f3d48d3e
```

验证哈希后，建议将二进制文件移动到气隙机器（无网络接口）。您也可以直接在气隙设备中检查文件的哈希值。

### 使用 Moonkey 生成账户 {: #generating-an-account-with-moonkey }

使用 moonkey 二进制文件非常简单。每次执行该二进制文件时，都会显示与新创建的帐户相关的信息。

此信息包括：

- **助记词种子** - 一个 24 字的助记词，用可读的文字表示您的帐户。这可以直接访问您的资金，因此您需要安全地存储这些词
- **私钥** - 与您的帐户关联的私钥，用于签名。它从助记词种子派生而来。这可以直接访问您的资金，因此您需要安全地存储它
- **公共地址** - 您帐户的地址
- **派生路径** - 告诉分层确定性 (HD) 钱包如何派生特定密钥

!!! note
    请安全地存储私钥/助记词，不要与任何人分享。私钥/助记词可以直接访问您的资金。

建议您在气隙计算机中使用该二进制文件。

### 其他 Moonkey 功能 {: #other-moonkey-features }

Moonkey 提供了一些额外的功能。可以提供以下标志：

- `-help` – 打印帮助信息
- `-version` – 打印您正在运行的 moonkey 的版本
- `-w12` – 生成一个 12 个单词的助记词种子（默认为 24 个）

以下选项可用：

- `-account-index` – 提供作为输入以在派生路径中使用的帐户索引
- `-mnemonic` – 提供作为输入的助记词

## 保证金要求 {: #bonding-requirements }

您需要注意两种保证金：一种是加入整理人池的保证金，另一种是用于密钥关联的保证金。

### 最小验证人抵押 {: #minimum-collator-bond }

首先，您需要抵押（自抵押）至少一定数量的代币，才能被认为符合资格并成为候选人。只有总抵押量（包括自抵押和委托抵押）排名前列的一定数量的验证人候选人才能进入活跃验证人集合。

=== "Moonbeam"
    |          字段           |                          值                           |
    |:-------------------------:|:--------------------------------------------------------:|
    |      最小自抵押数量       |     {{ networks.moonbeam.staking.min_can_stk }} GLMR     |
    |        活跃集合规模       | {{ networks.moonbeam.staking.max_candidates }} collators |

=== "Moonriver"
    |          字段           |                           值                           |
    |:-------------------------:|:---------------------------------------------------------:|
    |      最小自抵押数量       |     {{ networks.moonriver.staking.min_can_stk }} MOVR     |
    |        活跃集合规模       | {{ networks.moonriver.staking.max_candidates }} collators |

=== "Moonbase Alpha"
    |          字段           |                          值                           |
    |:-------------------------:|:--------------------------------------------------------:|
    |      最小自抵押数量       |     {{ networks.moonbase.staking.min_can_stk }} DEV      |
    |        活跃集合规模       | {{ networks.moonbase.staking.max_candidates }} collators |

### 密钥关联保证金 {: #key-association-bond }

其次，您需要一个用于密钥关联的保证金。当[将您的作者 ID 映射](/node-operators/networks/collators/account-management/){target=\_blank}（会话密钥）到您的帐户以获取区块奖励时，需要此保证金，并且每个注册的作者 ID 都需要。

=== "Moonbeam"
    |   变量   |                         值                          |
    |:------------:|:------------------------------------------------------:|
    | 最低保证金 | {{ networks.moonbeam.staking.collator_map_bond }} GLMR |

=== "Moonriver"
    |   变量   |                          值                          |
    |:------------:|:-------------------------------------------------------:|
    | 最低保证金 | {{ networks.moonriver.staking.collator_map_bond }} MOVR |

=== "Moonbase Alpha"
    |   变量   |                         值                         |
    |:------------:|:-----------------------------------------------------:|
    | 最低保证金 | {{ networks.moonbase.staking.collator_map_bond }} DEV |

## 收集人问卷调查表 {: #collator-questionnaire }

这里有一份[收集人调查问卷](https://docs.google.com/forms/d/e/1FAIpQLSfjmcXdiOXWtquYlBhdgXBunCKWHadaQCgPuBtzih1fd0W3aA/viewform){target=\_blank}，旨在评估 Moonbase Alpha 上所有收集人的状态。在填写此表格之前，您应该在 Moonbase Alpha 上运行一个收集人节点。您将能够提供您的联系方式以及一些基本的硬件规格。如果您的节点出现任何问题，这提供了一种在您和 Moonbeam 团队之间开通沟通渠道的方式。
