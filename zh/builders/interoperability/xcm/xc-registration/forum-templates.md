---
title: XCM 集成论坛模板
description: 了解在创建与 Moonbeam 的跨链集成时，如何在 Moonbeam 社区论坛上制作所需的两个帖子。
categories: XCM, Integrations
---

# Moonbeam 社区论坛 XCM 集成模板

## 简介 {: #introduction }

当在 Moonriver 或 Moonbeam MainNet 上启动 XCM 集成时，必须在 [Moonbeam 社区论坛](https://forum.moonbeam.network){target=_blank} 上发布两个初步帖子，以便投票社区有机会提供反馈。这两个初步帖子是 XCM 披露和 XCM 提案。**连接到 Moonbase Alpha 时，此步骤不是必需的。**

如果仅注册资产，则必须已经建立跨链通道，因此仅需要 XCM 提案帖子即可注册资产。

建议在链上提交实际提案前五天完成此操作，以便为社区反馈提供时间。

## XCM披露 {: #xcm-disclosure }

应该发布的第一个帖子是[XCM披露类别](https://forum.moonbeam.network/c/xcm-hrmp/xcm-disclosures/15){target=_blank}中的关键披露，其中突出显示了对投票者决策至关重要的关键信息。此帖子仅在建立XCM集成时才需要；如果集成已存在且您只需要注册资产，则不需要此帖子。

点击**新主题**按钮后，将提供一个模板，其中包含要填写的相关信息。请使用Moonbeam/Moonriver标签，具体取决于您要集成的网络。

在帖子中，请提供以下信息：

- **标题** - XCM披露：*您的网络名称*
- **网络信息** - 一句话总结您的网络以及指向您网站、Twitter和其他社交渠道的相关链接

您还需要提供以下问题的答案：

- 区块链网络的代码是否为开源？如果是，请提供GitHub链接。如果不是，请解释原因
- 网络的SUDO是否已禁用？如果SUDO已禁用，网络是否由一组选定的地址控制？
- 网络的集成是否已在Moonbase Alpha TestNet上完全测试过？
- (仅适用于Moonbeam HRMP提案) 您的网络是否有Kusama部署？如果是，请提供其网络名称以及Kusama部署是否与Moonriver集成
- 区块链网络的代码是否经过审计？如果是，请提供：
  - 审计员姓名
  - 审计报告的日期
  - 审计报告的链接

## XCM 提案 {: #xcm-proposals }

第二篇文章是[XCM 提案类别](https://forum.moonbeam.network/c/xcm-hrmp/xcm-proposals/14){target=_blank}中提案的初步草案。一旦提案在链上提交并可供投票，您还必须在 [Moonbeam Polkassembly](https://moonbeam.polkassembly.io/opengov){target=_blank} 或 [Moonriver Polkassembly](https://moonriver.polkassembly.io/opengov){target=_blank} 中添加对其的描述。

点击“**新主题**”按钮后，将提供一个模板，其中包含要填写的相关信息。请使用 Moonbeam 或 Moonriver 标签，具体取决于您要集成的网络。

在 Moonbeam XCM 提案论坛帖子和 Polkassembly 中，添加以下部分和信息：

- **标题**——*YOUR_NETWORK_NAME* 提案以打开通道并注册 *ASSET_NAME*。如果您仅注册资产，则可以使用：*YOUR_NETWORK_NAME* 提案以注册 *ASSET_NAME*
- **简介**——一句话总结提案
- **网络信息**——一句话总结您的网络以及指向您网站、Twitter 和其他社交渠道的相关链接
- **摘要**——提案内容的简要说明
- **链上提案参考**——如果它是 Moonbeam 或 Moonriver 提案，则包括提案编号和提案哈希
- **技术细节**——提供社区理解提案用例和目的所需的技术信息
- **附加信息**——您希望社区了解的任何附加信息
