---
title: 设置代理账户
description: 了解如何在基于 Moonbeam 的网络上设置代理账户，以便保护您冷存储中的基础账户安全。
categories: 代币和账户
---

# 设置代理帐户

## 介绍 {: #introduction }

可以设置代理账户来代表用户执行有限数量的操作，这对于保持底层账户的安全非常有用。它们允许用户将其主账户安全地保存在冷存储中，同时使代理能够主动执行功能并以主账户中代币的权重参与网络。

可以设置代理账户来执行特定的 Substrate 功能，例如作者映射、质押、余额等。例如，这可以允许您授予受信任的个人代表您执行 collator 或 delegator 功能的权限。代理也可以用于将质押账户安全地保存在冷存储中。

本指南将向您展示如何在 Moonbase Alpha TestNet 上设置代理帐户以进行余额转移以及如何执行代理交易。

## 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备：

- 打开 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer){target=_blank} 并连接到 Moonbase Alpha
- 在 Moonbase Alpha 上创建或拥有两个帐户
- 至少一个帐户必须有 `DEV` 代币。
 --8<-- 'text/_common/faucet/faucet-list-item.md'

如果您在将帐户导入 Polkadot.js Apps 时需要帮助，请查看[使用 Polkadot.js Apps 与 Moonbeam 交互](/tokens/connect/polkadotjs/#creating-or-importing-an-h160-account){target=_blank} 指南。

## 常规定义 {: #general-definitions }

设置代理账户时，代理的保证金将从您的可用余额中取出，并转移到您的保留余额中。添加代理需要链上存储空间，因此需要保证金，并且每次添加或删除代理时都会重新计算保证金。从您的账户中删除所有代理后，保证金将返还到您的可用余额中。

存款根据存款基数和存款因子计算：

- **存款基数** - 为账户保留代理列表所需的金额
- **存款因子** - 主账户拥有的每个代理需要保留的额外金额

计算存款的公式为：

text
存款基数 + 存款因子 * 代理数量

===
    |    变量    |                       值                       |
    |:--------------:|:-------------------------------------------------:|
    |  存款基数  |  {{ networks.moonbeam.proxy.deposit_base }} GLMR  |
    | 存款因子 | {{ networks.moonbeam.proxy.deposit_factor }} GLMR |
    |  最大代理数   | {{ networks.moonbeam.proxy.max_proxies }} proxies |

===
    |    变量    |                       值                        |
    |:--------------:|:--------------------------------------------------:|
    |  存款基数  |  {{ networks.moonriver.proxy.deposit_base }} MOVR  |
    | 存款因子 | {{ networks.moonriver.proxy.deposit_factor }} MOVR |
    |  最大代理数   | {{ networks.moonriver.proxy.max_proxies }} proxies |

===
    |    变量    |                       值                       |
    |:--------------:|:-------------------------------------------------:|
    |  存款基数  |  {{ networks.moonbase.proxy.deposit_base }} DEV   |
    | 存款因子 | {{ networks.moonbase.proxy.deposit_factor }} DEV  |
    |  最大代理数   | {{ networks.moonbase.proxy.max_proxies }} proxies |

## 代理类型 {: #proxy-types }

创建代理帐户时，您必须选择一种代理类型，该类型将定义代理的使用方式。可用选项包括：

- **`AuthorMapping`** - 此类型的代理帐户供收集人用于将服务从一台服务器迁移到另一台服务器
- **`CancelProxy`** - 允许代理帐户拒绝和删除任何已宣布的代理调用
- **`Staking`** - 允许代理帐户执行与 Staking 相关的交易，例如收集人或委托人功能，包括 `authorMapping()`
- **`Governance`** - 允许代理帐户进行与治理相关的交易，例如投票或提出民主提案
- **`NonTransfer`** - 此类型的代理帐户可以提交任何类型的交易，但余额转账除外
- **`Balances`** - 允许代理帐户仅进行与发送资金相关的交易
- **`IdentityJudgement`** - 允许代理帐户从注册服务商处请求对[帐户身份](/tokens/manage/identity/){target=_blank}进行判断。可以发布以下判断：
    - **unknown** -（默认）尚未做出任何判断
    - **fee paid** - 表示用户已请求判断，并且正在进行中
    - **reasonable** - 该信息看起来合理，但未执行深入检查（即正式的 KYC 流程）
    - **known good** - 该信息已被证明是正确的
    - **out of date** - 该信息曾经是好的，但现在已过期
    - **low quality** - 该信息质量低或不精确，但可以通过更新进行修复
    - **erroneous** - 该信息是错误的，可能表明存在恶意意图
- **`Any`** - 允许代理帐户使用代理 pallet 支持的任何功能

在本指南中，您将使用余额代理类型设置代理帐户。由于此类型允许代理代表主帐户支出资金，因此您应谨慎行事，并且仅向您信任的帐户提供访问权限。代理将有权转移主帐户中的所有资金，如果不信任，代理可能会耗尽主帐户。另外，请确保不要忘记在需要时删除代理。

## 创建代理帐户 {: #creating-a-proxy-account }

### 通过 Moonbeam DApp {: #create-via-the-moonbeam-dapp }

在 [Moonbeam dApp](https://apps.moonbeam.network/moonbeam/proxy){target=_blank} 上创建代理账户非常简单。为此，请按照以下步骤操作：

1. 切换网络切换器按钮以选择您想要的网络
2. 导航到 **Proxy** 页面
3. 确保您已连接到您希望添加代理的主账户  
4. 输入您想要委托代理控制权的地址
5. 从 **proxyType** 下拉菜单中，选择所需的代理类型，例如余额代理
6. （可选）您可以使用指定的区块数来添加时间延迟，这可以为主账户提供审查待处理交易的时间
7. 点击 **添加代理** 并在您的钱包中确认交易

![通过 Apps.Moonbeam.Network 添加代理账户](/images/tokens/manage/proxy-accounts/proxies-1.webp)

### 通过 Polkadot.js Apps 创建 {: #create-via-polkadot-js-apps }

您可以通过几种方式在 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network){target=_blank} 中创建代理账户，可以从 **Extrinsics** 页面或 **Accounts** 页面创建。但是，要创建时间延迟代理，您需要使用 **Extrinsics** 页面。时间延迟通过指定基于区块数量的延迟期，为代理提供额外的安全层。这将阻止代理账户执行交易，直到延迟期结束。延迟使控制代理的主账户有时间审查待处理的交易，可能会发现恶意行为，并在必要时在执行前取消。

要开始创建您的代理账户，请前往 **Developer** 选项卡，然后从下拉菜单中选择 [**Extrinsics**](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}。接下来，您需要执行以下步骤：

1. 选择主账户
2. 从 **submit the following extrinsic** 下拉菜单中，选择 **proxy**
3. 选择 **addProxy** extrinsic
4. 选择代理的 **delegate** 账户
5. 从 **proxyType** 下拉菜单中，选择 **Balances**
6. （可选）您可以使用指定的区块数量添加时间延迟，这可以使主账户有时间审查待处理的交易
7. 点击 **Submit Transaction**

![从 Polkadot.js Apps 的 Extrinsics 页面添加代理账户。](/images/tokens/manage/proxy-accounts/proxies-2.webp)

然后，系统将提示您授权并签署交易。继续并点击 **Sign and Submit** 以创建代理关系。

成功提交交易后，您将收到一些确认交易的通知。

如前所述，您也可以从 **Accounts** 页面创建代理。为此，请导航到 **Accounts** 页面，然后执行以下步骤：

1. 选择主账户旁边的 3 个垂直点
2. 选择 **Add proxy**

![从 Polkadot.js Apps 的 Accounts 页面选择 Add proxy 菜单项。](/images/tokens/manage/proxy-accounts/proxies-3.webp)

!!! note
    如果账户已经有代理，则将显示 **Manage proxies** 作为选项，而不是 **Add proxy**。

将出现一个弹出窗口，您将可以在其中输入所需的信息，例如被代理/主账户、代理账户和代理类型，以便创建代理账户。首先点击 **Add Proxy**。

![从 Polkadot.js Apps 的 Accounts 页面添加代理账户](/images/tokens/manage/proxy-accounts/proxies-4.webp)

然后按照以下步骤操作：

1. 选择您要设置为代理的账户
2. 选择代理类型
3. 点击 **Submit** 并签署交易

![添加代理账户的详细信息，包括代理账户和类型。](/images/tokens/manage/proxy-accounts/proxies-5.webp)

在下一节中，您将学习如何验证您的代理账户是否已成功设置。

## 验证您的代理帐户 {: #verifying-your-proxy-account }

### 通过 Moonbeam DApp {: #verify-via-the-moonbeam-dapp }

当您使用主帐户连接到 [Moonbeam DApp](https://apps.moonbeam.network/moonbeam/proxy){target=_blank} 时，您可以在**您的代理**部分中看到具有对您连接的主帐户的代理控制权的帐户列表。

![通过apps.moonbeam.network验证创建的代理](/images/tokens/manage/proxy-accounts/proxies-6.webp)

或者，通过将代理帐户连接到 [Moonbeam DApp](https://apps.moonbeam.network/moonbeam/proxy){target=_blank}，您可以在**代理给您的帐户**部分中看到连接的帐户具有代理控制权的帐户列表。

![通过apps.moonbeam.network验证代理控制帐户](/images/tokens/manage/proxy-accounts/proxies-7.webp)

### 通过 Polkadot.js Apps {: #verify-via-polkadot-js-apps }

您可以通过几种方式验证您的代理账户是否已成功设置。可以通过**账户**页面或**链状态**页面进行验证。

要从 [**链状态** 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/chainstate){target=_blank} 检查您的代理账户，您可以按照以下步骤操作：

1. 从**选择状态查询**下拉菜单中，选择 **proxy**
2. 选择 **proxies** extrinsic
3. 选择您的主（代理）账户
4. 点击 **+** 按钮发送查询

![通过 Polkadot.js Apps 的 Extrinsics 页面验证您的代理账户。](/images/tokens/manage/proxy-accounts/proxies-8.webp)

结果将显示在页面上，其中包含有关您的所有代理的信息，包括委托/代理账户地址、代理类型、指定的延迟时间以及您的所有代理在 Wei 中的总绑定金额。

如前所述，您还可以从**账户**页面检查您的代理账户。为此，您可以导航到**账户**页面，主账户旁边应该有一个代理图标。将鼠标悬停在该图标上，然后单击**管理代理**以查看您的代理。

![将鼠标悬停在代理图标上，以通过 Polkadot.js Apps 的“账户”页面管理您的代理。](/images/tokens/manage/proxy-accounts/proxies-9.webp)

将出现一个弹出窗口，您可以在其中查看所有代理账户的概览。

![查看您的代理账户。](/images/tokens/manage/proxy-accounts/proxies-10.webp)

## 执行代理交易 {: #executing-a-proxy-transaction }

既然您已经创建了代理账户并验证已成功设置，您就可以使用代理账户代表主账户执行交易。

要执行交易，请返回 [**Extrinsics** 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank} 并执行以下步骤：

1. 从**使用选择账户**下拉菜单中选择要提交交易的代理账户
2. 从**提交以下外部操作**菜单中，选择 **proxy**
3. 选择 **proxy** 外部操作
4. 从 **real** 下拉菜单中选择主账户
5. 选择 **balances** 调用
6. 选择 **transfer** 外部操作
7. 在 **dest** 字段中，输入您要发送资金的地址
8. 在 **value** 字段中，输入要以 Wei 为单位发送的资金量。对于此示例，您可以发送 2 个 DEV 代币，即 Wei 为单位的 `2000000000000000000`
9. 点击 **Submit Transaction**

![从 Polkadot.js 应用程序的 Extrinsics 页面执行代理交易。](/images/tokens/manage/proxy-accounts/proxies-11.webp)

将弹出一个窗口，供您授权和签署交易。输入您的代理账户密码，然后点击 **Sign and Submit**。

如果交易成功完成，您应该会看到几个通知弹出，并且如果您转到 **Accounts** 页面，您会看到您的主账户余额已减少。如果您检查您将资金发送到的账户的余额，您会注意到那里的余额增加了。

就这样！您已成功使用代理账户代表您的主账户执行了交易。

## 删除代理帐户 {: #removing-a-proxy-account }

### 通过 Moonbeam DApp {: #remove-via-the-moonbeam-dapp }

要删除代理账户，请将您的主账户连接到 [Moonbeam DApp](https://apps.moonbeam.network/moonbeam/proxy){target=_blank}，然后按您要删除的代理账户旁边的 **删除**。或者，您可以使用 **删除所有代理** 删除主账户的所有代理账户。在任何一种情况下，您都必须在您的钱包中确认交易。

![通过 Apps.Moonbeam.Network 删除账户](/images/tokens/manage/proxy-accounts/proxies-12.webp)

### 通过 Polkadot.js Apps {: #remove-via-polkadot-js-apps }

与添加代理帐户类似，您可以通过几种方式删除代理帐户，可以从**Extrinsics**页面或**Accounts**页面删除。无论您使用哪个页面，您都可以选择删除单个代理帐户或与您的主帐户关联的所有代理。

要从 [**Extrinsics** 页面](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/extrinsics){target=_blank}删除代理，您可以按照以下步骤操作：

1. 从**使用所选帐户**下拉菜单中，选择您的主帐户
2. 然后选择**代理**
3. 选择 **removeProxy** 以删除单个代理，或选择 **removeProxies** 以删除所有关联的代理
4. 如果删除单个代理，请在 **delegate** 字段中输入要删除的代理帐户
5. 选择要删除的 **proxyType**，在本例中选择 **Balances**
6. （可选）选择以区块数为单位的延迟期
7. 单击**提交交易**

![从 Polkadot.js Apps 的 Extrinsics 页面删除代理帐户](/images/tokens/manage/proxy-accounts/proxies-13.webp)

将弹出一个窗口，供您授权并签署交易。虽然任何帐户通常都可以签署交易，但删除代理必须由主帐户执行。输入您的密码，然后单击**签名并提交**。

您可以按照[验证您的代理帐户](#verifying-your-proxy-account)部分中的步骤检查代理是否已删除。

如前所述，您也可以从“**Accounts**”页面删除代理。为此，在“**Accounts**”页面上，选择主帐户旁边的 3 个垂直点，然后选择“**Manage Proxies**”。

![单击“管理代理”按钮以查看和管理您的代理帐户。](/images/tokens/manage/proxy-accounts/proxies-14.webp)

将弹出一个窗口，显示您的代理帐户的概览。要删除单个代理，您可以选择要删除的代理旁边的 **X** 按钮。代理将从列表中消失，然后您需要单击“**Submit**”。接下来，您将能够输入您的密码并提交交易。或者要删除所有代理，您可以单击“**Clear all**”，然后您将自动被提示输入您的密码并提交交易。

![从 Polkadot.js Apps 的 Accounts 页面删除代理帐户。](/images/tokens/manage/proxy-accounts/proxies-15.webp)

成功提交交易后，您可以查看您当前的代理，或者如果您删除了所有代理，您会注意到代理图标不再显示在主帐户旁边。

就这样！您已成功创建代理、查看与您的主帐户关联的所有代理帐户、执行代理交易并删除代理帐户！
