---
title: 运行排序人节点
description: 一旦您运行了一个节点，有关如何在Moonbeam网络中成为排序人的说明。
categories: Basics, Node Operators and Collators
---

# 在 Moonbeam 上运行 Collator

## 简介 {: #introduction }

收集人是网络中的成员，他们维护其参与的平行链。他们运行一个完整的节点（针对其特定的平行链和中继链），并为中继链验证人生成状态转换证明。

在成为收集人候选人之前，需要考虑一些[要求](/node-operators/networks/collators/requirements/){target=\_blank}，包括机器、绑定、帐户和社区要求。

候选人需要绑定（自绑定）最少数量的代币才能被认为符合资格。只有一定数量的按总权益（包括自绑定和委托权益）排名的顶级收集人候选人才能进入活跃的收集人集合。否则，收集人将保留在候选人池中。

一旦候选人被选中进入活跃的收集人集合，他们就有资格生成区块。

Moonbeam 使用 Nimbus Parachain 共识框架。这提供了一个两步过滤器，用于将候选人分配到活跃的收集人集合，然后将收集人分配到区块生产时隙：

 - 平行链权益质押过滤器根据每个网络中质押的代币数量选择顶级候选人。 对于每个网络的确切顶级候选人数量和最低绑定金额，您可以查看我们文档的[最低收集人绑定](/node-operators/networks/collators/requirements/#minimum-collator-bond){target=\_blank}部分。 这个经过筛选的池称为选定的候选人（也称为活跃集合），它们每轮都会轮换
 - 固定大小子集过滤器为每个区块生产时隙选择先前选定的候选人的伪随机子集

用户可以在 Moonbeam、Moonriver 和 Moonbase Alpha 上启动完整节点并激活 `collate` 功能，以作为收集人候选人参与生态系统。 为此，您可以查看文档的[运行节点](/node-operators/networks/run-a-node/){target=\_blank}部分，并使用 [Docker](/node-operators/networks/run-a-node/docker/){target=\_blank} 或 [Systemd](/node-operators/networks/run-a-node/systemd/){target=\_blank} 启动节点。

## 加入 Discord {: #join-discord }

作为一名收集人，及时了解最新情况和配置变化非常重要。如果您的节点出现任何问题，能够轻松地与我们联系以及我们能够轻松地与您联系也很重要，因为这不仅会对收集人和委托人的奖励产生负面影响，还会对网络产生负面影响。

为此，我们使用 [Discord](https://discord.com/invite/moonbeam){target=\_blank}。与收集人最相关的 Discord 频道如下：

 - **tech-upgrades-announcements** — 我们将在此发布收集人需要遵循的任何更新或配置变更。我们还将在此公布需要监控的任何技术问题，例如网络停滞
 - **collators** — 这是常规的收集人讨论频道。我们很自豪拥有一个活跃而友好的收集人社区，如果您有任何问题，可以在这里提问。如果出现任何需要他们注意的问题，我们也会在此处 @ 收集人。
 - **meet-the-collators** — 在此频道中，您可以向潜在的委托人介绍自己

加入 Discord 后，随时可以私信 *gilmouta* 或 *artkaseman* 并介绍自己。这将帮助团队确定在您的节点出现问题时应联系的人员，并可以分配相关的 Discord 收集人角色，允许您在 *meet-the-collators* 中发帖。
