---
title: 确信投票预编译合约
description: 了解如何通过 Moonbeam 上的确信投票预编译，直接通过 Solidity 接口对全民公投进行投票、设置投票代理等。
categories: Precompiles, Ethereum Toolkit
---

# 与信念投票预编译交互

## 简介 {: #introduction }

作为 Polkadot 平行链和去中心化网络，Moonbeam 具有原生的链上治理功能，使利益相关者能够参与网络的发展方向。随着 OpenGov（也称为 Governance v2）的引入，确信投票 Pallet 允许代币持有者对提案进行、委托和管理确信加权的投票。要了解有关 Moonbeam 治理系统的更多信息，例如相关术语、原则、机制等的概述，请参阅 [Moonbeam 上的治理](learn/features/governance/){target=\_blank} 页面。

确信投票预编译直接与 Substrate 的确信投票 Pallet 交互。此 Pallet 以 Rust 编写，通常无法从 Moonbeam 的 Ethereum API 端访问。但是，确信投票预编译允许您直接从 Solidity 接口访问 Substrate 确信投票 Pallet 的治理相关功能。此外，这还实现了大大改善的最终用户体验。例如，代币持有者可以直接从 MetaMask 对提案进行投票或委托投票，而无需在 Polkadot.js Apps 中导入帐户并浏览复杂的 UI。

确信投票预编译位于以下地址：

=== "Moonbeam"

     ```text
     {{ networks.moonbeam.precompiles.conviction_voting }}
     ```

=== "Moonriver"

     ```text
     {{ networks.moonriver.precompiles.conviction_voting }}
     ```

=== "Moonbase Alpha"

     ```text
     {{ networks.moonbase.precompiles.conviction_voting }}
     ```

--8<-- 'zh/text/builders/ethereum/precompiles/security.md'

## 置信投票 Solidity 接口 {: #the-conviction-voting-solidity-interface }

[`ConvictionVoting.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank} 是一个 Solidity 接口，允许开发人员与预编译的方法进行交互。

该接口包含一个 `Conviction` 枚举，用于定义 [置信乘数](learn/features/governance/#conviction-multiplier-v2){target=\_blank} 类型。该枚举具有以下变量：

 - **None** - 0.1 倍投票，已解锁
 - **Locked1x** - 1 倍投票，在成功投票后的一个执行期内锁定
 - **Locked2x** - 2 倍投票，在成功投票后的 2 倍执行期内锁定
 - **Locked3x** - 4 倍投票，在成功投票后的 4 倍执行期内锁定
 - **Locked4x** - 8 倍投票，在成功投票后的 8 倍执行期内锁定
 - **Locked5x** - 16 倍投票，在成功投票后的 16 倍执行期内锁定
 - **Locked6x** - 32 倍投票，在成功投票后的 32 倍执行期内锁定

该接口包含以下函数：

??? function "**votingFor**(*address* who, *uint16* trackId) - 返回给定账户和 Track 的投票"

    === "参数"

        - `who` - 要查询投票的账户地址
        - `trackId` - 需要进行请求更改的 uint16 Track ID

??? function "**classLocksFor**(*address* who) - 返回给定账户的类锁"

    === "参数"

        - `who` - 要查询类锁的账户地址

??? function "**voteYes**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - 对投票（公民投票）投置信加权的“赞成”票"

    === "参数"

        - `pollIndex` - 投票（公民投票）的 uint32 索引
        - `voteAmount` - 要锁定以进行投票的 uint256 余额
        - `conviction` - Conviction 代表上述 `Conviction` 枚举中的一个值

??? function "**voteNo**(*uint32* pollIndex, *uint256* voteAmount, *Conviction* conviction) - 对投票（公民投票）投置信加权的“反对”票"

    === "参数"

        - `pollIndex` - 投票（公民投票）的 uint32 索引
        - `voteAmount` - 要锁定以进行投票的 uint256 余额
        - `conviction` - Conviction 代表上述 `Conviction` 枚举中的一个值

??? function "**voteSplit**(*uint32* pollIndex, *uint256* aye, *uint256* nay) - 投拆分票，在投票（公民投票）中，给定数量锁定为“赞成”，给定数量锁定为“反对”"

    === "参数"

        - `pollIndex` - 投票（公民投票）的 uint32 索引
        - `aye` - 要锁定以进行“赞成”票的 uint256 余额
        - `nay` - 要锁定以进行“反对”票的 uint256 余额

??? function "**voteSplitAbstain**(*uint32* pollIndex, *uint256* aye, *uint256* nay) - 投弃权拆分票，在投票（公民投票）中，给定数量锁定为“赞成”，给定数量锁定为“反对”，给定数量锁定为（支持）弃权票"

    === "参数"

        - `pollIndex` - 投票（公民投票）的 uint32 索引
        - `aye` - 要锁定以进行“赞成”票的 uint256 余额
        - `nay` - 要锁定以进行“反对”票的 uint256 余额

??? function "**removeVote**(*uint32* pollIndex) - 移除投票（公民投票）中的投票。"

    === "参数"

        - `pollIndex` - 投票（公民投票）的 uint32 索引

??? function "**removeVoteForTrack**(*uint32* pollIndex, *uint16* trackId) - 从投票（公民投票）中特定 track 移除投票。"

    === "参数"

        - `pollIndex` - 投票（公民投票）的 uint32 索引
        - `trackId` - 需要进行请求更改的 uint16 Track ID

??? function "**removeOtherVote**(*address* target, *uint16* trackId, *uint32* pollIndex) - 为另一个投票者移除投票（公民投票）中的投票。"

    === "参数"

        - `target` - 具有要移除或解锁的投票或代币的地址
        - `trackId` - 需要进行请求更改的 uint16 Track ID
        - `pollIndex` - 投票（公民投票）的 uint32 索引

??? function "**delegate**(*uint16* trackId, *address* representative, *Conviction* conviction, *uint256* amount) - 委托另一个账户为代表，代表发送账户为特定 Track 投置信加权的投票"

    === "参数"

        - `trackId` - 需要进行请求更改的 uint16 Track ID
        - `representative` - 要委托为代表的账户地址
        - `conviction` - Conviction 代表上述 `Conviction` 枚举中的一个值
        - `amount` - 要委托的 uint256 余额

??? function "**undelegate**(*uint16* trackId) - 移除调用者对特定 Track 的投票委托"

    === "参数"

        - `trackId` - 需要进行请求更改的 uint16 Track ID

??? function "**unlock**(*uint16* trackId, *address* target) - 解锁特定 Track 的特定账户的已锁定代币"

    === "参数"

        - `trackId` - 需要进行请求更改的 uint16 Track ID
        - `target` - 具有要移除或解锁的投票或代币的地址

该接口还包含以下事件：

- **Voted**(*uint32 indexed* pollIndex, *address* voter, *bool* aye, *uint256* voteAmount, *uint8* conviction) - 当账户进行投票时发出
- **VoteSplit**(*uint32 indexed* pollIndex, *address* voter, *uin256* aye, *uint256* nay) - 当账户进行拆分投票时发出
- **VoteSplitAbstained**(*uint32 indexed* pollIndex, *address* voter, *uin256* aye, *uint256* nay, *uint256* nay) - 当账户进行弃权拆分投票时发出
- **VoteRemoved**(*uint32 indexed* pollIndex, *address* voter) - 当账户 (`voter`) 的投票已从正在进行的投票（公民投票）中移除时发出
- **VoteRemovedForTrack**(*uint32 indexed* pollIndex, *uint16* trackId, *address* voter) - 当账户 (`voter`) 的投票已从特定 Track 的正在进行的投票（公民投票）中移除时发出
- **VoteRemovedOther**(*uint32 indexed* pollIndex, *address* caller, *address* target, *uint16* trackId) - 当账户 (`caller`) 移除了另一个账户 (`target`) 的投票时发出
- **Delegated**(*uint16 indexed* trackId, *address* from, *address* to, *uint256* delegatedAmount, *uint8* conviction) - 当账户 (`from`) 将给定数量的置信加权投票委托给另一个账户 (`to`) 时发出
- **Undelegated**(*uint16 indexed* trackId, *address* caller) - 当账户 (`caller`) 的委托被移除为特定 Track 时发出
- **Unlocked**(*uint16 indexed* trackId, *address* caller) - 当账户 (`caller`) 的锁定代币被解锁为特定 Track 时发出

## 与 Solidity 接口交互 {: #interact-with-the-solidity-interface }

### 检查先决条件 {: #checking-prerequisites }

以下示例在 Moonbase Alpha 上演示，但是，对于 Moonriver，可以采取类似的步骤。要遵循本指南中的步骤，您需要具备以下条件：

 - 安装 MetaMask 并[连接到 Moonbase Alpha](tokens/connect/metamask/){target=\_blank}
 - 具有一些 DEV 代币的帐户。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

### Remix 设置 {: #remix-set-up }

1. 点击**文件资源管理器**选项卡
2. 将 [`ConvictionVoting.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=\_blank} 的副本粘贴到名为 `ConvictionVoting.sol` 的 [Remix 文件](https://remix.ethereum.org){target=\_blank} 中

![将全民投票 Solidity 接口复制并粘贴到 Remix 中。](/images/builders/ethereum/precompiles/features/governance/conviction-voting/conviction-voting-1.webp)

### 编译合约 {: #compile-the-contract }

1. 点击顶部的第二个 **Compile** 选项卡
2. 然后要编译接口，点击 **Compile ConvictionVoting.sol**

![使用 Remix 编译 ConvictionVoting.sol 接口。](/images/builders/ethereum/precompiles/features/governance/conviction-voting/conviction-voting-2.webp)

### 访问合约 {: #access-the-contract }

1. 点击Remix中**Compile**标签正下方的**Deploy and Run**标签。注意：您不是在此处部署合约，而是访问已部署的预编译合约
2. 确保在**ENVIRONMENT**下拉菜单中选择了**Injected Provider - Metamask**
3. 确保在**CONTRACT**下拉菜单中选择了**ConvictionVoting.sol**。由于这是一个预编译合约，因此无需部署，而是需要在**At Address**字段中提供预编译的地址
4. 提供 Moonbase Alpha 的 Conviction Voting Precompile 地址：`{{ networks.moonbase.precompiles.conviction_voting }}`，然后点击 **At Address**
5. Conviction Voting Precompile 将出现在 **Deployed Contracts** 列表中

![通过提供预编译地址来访问 ConvictionVoting.sol 接口。](/images/builders/ethereum/precompiles/features/governance/conviction-voting/conviction-voting-3.webp)

### 投票表决 {: #vote-on-a-referendum }

您可以在引导期或决定期的任何时间锁定代币并对全民公投进行投票。为了使全民公投获得通过，它需要获得最低的批准和支持，这因轨道而异。有关每个相关期间以及各轨道批准和支持要求的更多信息，请参阅[治理概述页面的 OpenGov 部分](learn/features/governance/#opengov){target=\_blank}。

首先，您需要获取要投票的全民公投的索引。要获取全民公投的索引，请前往 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=\_blank} 并执行以下步骤：

1. 从**治理**选项卡下拉菜单中，选择**全民公投**
2. 找到您想要投票的全民公投。您可以通过单击三角形图标查看有关特定全民公投的更多详细信息。如果没有三角形图标，则表示仅提交了提案哈希，尚未提交提案的预映像
3. 记下全民公投索引

![查看 Polkadot.js Apps 上的全民公投列表。](/images/builders/ethereum/precompiles/features/governance/conviction-voting/conviction-voting-4.webp)

现在，您可以返回 Remix 以通过信念投票预编译合约对全民公投进行投票。您可以使用两种方法对全民公投进行投票：`voteYes` 或 `voteNo`。您可能已经发现，如果您同意该提案，您将使用 `voteYes`，如果不同意，您将使用 `voteNo`。您将指定您想要通过投票锁定的代币数量和信念，使用您想要在[前面提到的 `Conviction` 枚举](#the-conviction-voting-solidity-interface)中投票的信念的索引。例如，如果您想在一个成功的投票后锁定您的代币两个颁布期，您将在 `Locked2x` 信念中输入 `2`。有关信念的更多信息，您可以查看[Governance v2 文档的信念乘数部分](learn/features/governance/#conviction-multiplier-v2){target=\_blank}。

要提交您的投票，您可以采取以下步骤：

1. 展开信念投票预编译合约以查看可用的函数（如果尚未打开）
2. 找到 **voteYes** 或 **voteNo** 函数（无论您想如何投票），然后按按钮展开该部分
3. 输入要投票的全民公投的索引
4. 输入要以 Wei 锁定的代币数量。避免在此处输入您的全部余额，因为您需要支付交易费用
5. 输入您想要投票的信念
6. 按**交易**并在 MetaMask 中确认交易

![使用信念投票预编译合约的 voteYes 函数对提案进行投票。](/images/builders/ethereum/precompiles/features/governance/conviction-voting/conviction-voting-5.webp)

全民公投结束后，您可以使用信念投票预编译合约来删除您的投票并解锁您的代币。

### 委托投票 {: #delegate-a-vote }

除了自己对全民公投进行投票外，您还可以将具有信念权重的投票委托给在特定主题上更了解的人代表您投票，这个过程称为投票委托。您甚至可以为每个 Track 委托一个不同的帐户。

要开始，您可以采取以下步骤：

1. 找到 **delegate** 函数并按下按钮以展开该部分
2. 输入您希望委托使用的 Track 的 Track ID。Track ID 可以在 [Polkadot.js Apps 的 Referenda 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network%2Fpublic-ws#/referenda){target=\_blank} 中找到
3. 输入将有权代表您投票的委托帐户
4. 输入他们可以使用的 Wei 中的代币数量。避免在此处输入您的全部余额，因为您需要支付交易手续费
5. 输入他们可以使用的信念
6. 按下 **transact** 并在 MetaMask 中确认交易

![使用信念投票预编译的委托函数委托投票。](/images/builders/ethereum/precompiles/features/governance/conviction-voting/conviction-voting-6.webp)

现在，委托帐户可以代表您投票！如果您不再希望委托投票存在，您可以使用信念投票预编译的 `undelegate` 函数将其删除。

就这样！您已完成对 Conviction Voting Precompile 的介绍。[`ConvictionVoting.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/conviction-voting/ConvictionVoting.sol){target=
_blank} 中记录了更多功能 — 如果您对这些功能或信念投票预编译的任何其他方面有任何疑问，请随时通过 [Discord](https://discord.com/invite/PfpUATX){target=\_blank} 与我们联系。
