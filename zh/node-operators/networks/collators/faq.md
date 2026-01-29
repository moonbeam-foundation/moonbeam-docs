---
title: Collators 常见问题解答
description: 关于成为收集人、收集人活动以及在 Moonbeam 上运行和操作收集人节点时需要注意的一些常见问题解答。
categories: 节点运营者和收集人
---

# 常见问题解答

## 简介 {: #introduction }

收集人是平行链不可或缺的一部分。他们接收交易并为中继链验证人创建状态转换证明。

运行 Moonbeam 收集人需要 Linux 系统管理技能、仔细的监控以及对细节的关注。以下是一些已积累的技巧和窍门，应能帮助您快速启动并运行。

## 问答

**问：在哪里可以获得帮助？**

**答：** 有一个活跃而友好的 [Discord](https://discord.com/invite/PfpUATX){target=\_blank} 社区，专为整理者而设。加入服务器，即使在您需要帮助之前，也请先自我介绍。向 **gilmouta** 或 **artkaseman** 发送私信，让他们知道您是谁，如果他们发现您的节点有任何问题，他们可以与您联系。

***

**问：如何随时了解最新信息？**

**答：** 所有升级和重要的技术信息都会在 [Discord](https://discord.com/invite/PhfEbKYqak){target=\_blank} 的 **#tech-upgrades-announcements** 频道中宣布。加入并关注此频道。如果 Slack 或 Telegram 是您首选的通信渠道，您可以设置集成。

***

**问：如何注册我的节点？**

**答：** 有一个 [问卷](https://docs.google.com/forms/d/e/1FAIpQLSfjmcXdiOXWtquYlBhdgXBunCKWHadaQCgPuBtzih1fd0W3aA/viewform){target=\_blank}，您可以在其中提供您的联系信息以及一些基本的硬件规格。您必须在 Moonbase Alpha 上运行整理者节点才能填写问卷。

***

**问：硬件要求是什么？**

**答：** 运行整理者需要顶级的硬件，以便能够处理交易并最大化您的奖励。这是区块生产和奖励中一个非常重要的因素。

在顶级的裸机机器上运行 systemd 服务（即，运行物理服务器，而不是云 VM 或 docker 容器）。您可以自己运行，也可以选择提供商为您管理服务器。

每台裸机机器一次只运行一项服务。不要运行多个实例。

***

**问：运行整理者的推荐硬件是什么？**

**答：**

硬件建议：

- 顶级 CPU：
    - Ryzen 9 5950x 或 5900x
    - Intel Xeon E-2386 或 E-2388
- 位于不同数据中心和国家/地区的主服务器和备份裸机服务器（Hetzner 可以用于其中一个）
- Moonbeam 的专用服务器，不与其他任何应用程序共享
- 1 TB NVMe SSD
- 32 GB 内存

***

**问：备份节点怎么样？**

**答：** 运行两台规格相同的裸机机器，位于不同的国家/地区和服务提供商处。如果您的主服务器出现故障，您可以快速恢复备份服务器上的服务，并继续生产区块并获得奖励。请参阅下面的 [故障转移](#:~:text=What is the failover process if my Primary node is down) 上的问答。

***

**问：不同的网络是什么？**

**答：** 有三个网络，每个网络都需要专用的硬件。Moonbase Alpha TestNet 是免费的，应该用于熟悉设置。

- **Moonbeam** - Polkadot 上的生产网络
- **Moonriver** - Kusama 上的生产网络
- **Moonbase Alpha TestNet** - 开发网络

***

**问：我的防火墙允许哪些端口？**

**答：**

- 允许 TCP 端口 {{ networks.parachain.p2p }} 和 {{ networks.relay_chain.p2p }} 上的所有传入请求
- 允许来自您的管理 IP 的 TCP 端口 22 上的请求
- 丢弃所有其他端口

***

**问：是否有 CPU 优化的二进制文件？**

**答：** 在每个 [发布页面](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} 上都有 CPU 优化的二进制文件。选择适合您的 CPU 架构的二进制文件。

- **Moonbeam-znver3** - Ryzen 9
- **Moonbeam-skylake** - Intel
- **Moonbeam** - 通用，可用于所有其他

***

**问：关于监控我的节点的建议是什么？**

**答：** 监控对于网络的健康状况和最大化您的奖励非常重要。我们建议使用 [Grafana Labs](https://grafana.com){target=\_blank}。它们有一个免费层，应该可以处理 6+ 个 moonbeam 服务器。

***

**问：我应该监控哪些 KPI？**

**答：** 主要的关键绩效指标是生产的区块。此指标的 Prometheus 指标称为 `substrate_proposer_block_constructed_count`。

***

**问：我应该如何设置警报？**

**答：** 警报对于保持您的 moonbeam 节点生成区块并获得奖励至关重要。我们推荐 [pagerduty.com](https://www.pagerduty.com){target=\_blank}，它受到 [Grafana Labs](https://grafana.com){target=\_blank} 的支持。使用上面的 [KPI 查询](#:~:text=substrate_proposer_block_constructed_count)，并在其降至 1 以下时设置警报。警报应全天候呼叫值班人员。

***

**问：什么是 Nimbus 密钥？**

**答：** Nimbus 密钥就像 [Polkadot 中的会话密钥](https://wiki.polkadot.com/learn/learn-cryptography/#session-keys){target=\_blank}。您应该在主服务器和备份服务器上拥有唯一的密钥。将密钥输出保存在安全的地方，如果您收到警报，可以在半夜访问它。要创建您的密钥，请参阅文档的 [会话密钥](/node-operators/networks/collators/account-management/#session-keys){target=\_blank} 部分。

***

**问：如果我的主节点发生故障，故障转移过程是什么？**

**答：** 当主服务器发生故障时，执行故障转移到备份服务器的最佳方法是执行密钥关联更新。每个服务器都应已有一组唯一的[密钥](#:~:text=What are Nimbus keys)。运行 `setKeys` 作者映射外部函数。您可以按照 [映射外部函数](/node-operators/networks/collators/account-management/#mapping-extrinsic){target=\_blank} 指令进行操作，并修改指令以使用 `setKeys` 外部函数。

***

**问：我应该设置集中式日志记录吗？**

**答：** [Grafana Labs](https://grafana.com){target=\_blank} 也可以配置为集中式日志记录，并且强烈推荐。您可以在一个地方看到所有节点。[Kibana](https://www.elastic.co/kibana){target=\_blank} 提供了更强大的集中式日志记录功能，但 Grafana 简单且足以入门。

***

**问：我应该在日志中寻找什么？**

**答：** 日志对于确定您是否已同步并准备好加入整理者池非常有用。查看日志的末尾以确定是否：

1. 您的中继链已同步
2. 您的平行链已同步

当您的节点同步时，您应该在日志中看到**空闲**。

![同步的中继链和平行链](/images/node-operators/networks/collators/account-management/account-1.webp)

一个常见的问题是在您的节点同步之前加入池。您将无法生产任何区块或获得任何奖励。在加入候选池之前，请等待直到您同步并空闲。

--8<-- 'code/node-operators/networks/run-a-node/docker/terminal/logs.md'

中继链的同步时间比平行链长得多。在同步中继链之前，您将看不到任何最终确定的区块。

***

**问：成为整理者的抵押品是多少？**

**答：** 您需要注意两个抵押品。在继续执行这些步骤之前，请确保您的节点已配置并同步。

第一个是[加入整理者](/node-operators/networks/collators/activities/#become-a-candidate){target=\_blank}池的抵押品：

- **Moonbeam** - 至少 {{ networks.moonbeam.staking.min_can_stk }} GLMR
- **Moonriver** - 至少 {{ networks.moonriver.staking.min_can_stk }} MOVR
- **Moonbase Alpha** - 至少 {{ networks.moonbase.staking.min_can_stk }} DEV

第二个是[用于密钥关联的抵押品](/node-operators/networks/collators/account-management/#mapping-bonds){target=\_blank}：

- **Moonbeam** - 至少 {{ networks.moonbeam.staking.collator_map_bond }} GLMR
- **Moonriver** - 至少 {{ networks.moonriver.staking.collator_map_bond }} MOVR
- **Moonbase Alpha** - 至少 {{ networks.moonbase.staking.collator_map_bond }} DEV

***

**问：如何在我的整理者账户上设置身份？**

**答：** 在链上设置身份将有助于识别您的节点并吸引委托。您可以按照我们文档的[管理身份](/tokens/manage/identity/){target=\_blank}页面上的说明设置身份。
