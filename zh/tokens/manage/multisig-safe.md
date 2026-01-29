---
title: Moonbeam多重签名保险箱
description: 了解如何使用 Moonbeam Safe 管理资金。在 Moonbeam 上创建一个新的多重签名保险箱，并向该保险箱接收和发送代币以及 ERC-20 代币。
categories: Tokens and Accounts
---

# 与 Moonbeam Safe 交互

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/7Wf4Zy5fiP4?si=ylJQzkNfvZzN9WOS' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 简介 {: #introduction }

单签名钱包（简称 singlesig）是一种只有一个所有者持有私钥的钱包，因此可以控制该帐户持有的所有资产。此外，如果私钥丢失，则对钱包和资金的访问权限将永远丢失。

为了解决这个问题，引入了多签名钱包（简称 multisig）。使用多重签名钱包时，会有多个所有者，因此一个所有者可能会丢失其密钥，而其他所有者仍然可以访问钱包和资金。此外，多重签名钱包可能需要阈值签名，只有在获得一定数量的批准后，提案才会作为交易执行。因此，创建了一个额外的安全层。

为了帮助管理 singlesig 和 multisig 钱包，[Gnosis Safe](https://gnosis-safe.io){target=\_blank} 被 fork 以创建 [Moonbeam Safe](https://multisig.moonbeam.network){target=\_blank}。Safe 可以配置为多重签名合约，允许多个所有者持有资金并将其转移到 Safe 以及从 Safe 转移资金。您还可以将 Safe 配置为只有一个所有者的 singlesig 合约。

本指南将向您展示如何在 Moonbase Alpha TestNet 上创建多重签名 Safe。您还将学习如何将 DEV 和 ERC-20 代币发送到 Safe 以及从 Safe 发送，以及如何使用 Safe 与智能合约交互。本指南适用于 Moonbeam 和 Moonriver。

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

## 检查先决条件 {: #checking-prerequisites }

在深入本指南之前，您需要准备一些加载了资金的 [MetaMask 账户](#metamask-accounts)，一些可用于发送到 Safe 的 [ERC-20 代币](#erc20-tokens)，以及一个可与之交互的 [已部署的智能合约](#deployed-smart-contract)。

### MetaMask 账户 {: #metamask-accounts }

在本指南中，你将在 Moonbase Alpha 上创建一个 Safe，以便进行交互和管理资金。要连接到 Safe，你需要具备以下条件：

 - 已安装 MetaMask 并[连接到 Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - 至少有两个已加载资金的帐户。
 --8<-- 'zh/text/_common/faucet/faucet-list-item.md'

你至少需要两个帐户，因为你将设置一个具有 3 个所有者的多重签名 Safe，并且任何交易都需要 2/3 的确认才能执行。因此，在本指南中，你需要在至少两个帐户之间来回切换，才能确认和发送交易。

本指南将使用以下帐户：

 - **Alice** — 0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac
 - **Bob** — 0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0
 - **Charlie** — 0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc

### ERC-20 代币 {: #erc20-tokens }

在本指南的后面部分，您将学习如何向 Safe 发送和接收 ERC-20 代币。因此，您需要部署一些 ERC-20 代币并将它们添加到您的 MetaMask 帐户中。为此，您可以查看[使用 Remix 部署到 Moonbeam](/builders/ethereum/dev-env/remix/){target=\_blank} 指南，特别是[将合约部署到 Moonbeam](/builders/ethereum/dev-env/remix/#deploying-a-contract-to-moonbeam-using-remix){target=\_blank}和[与基于 Moonbeam 的 ERC-20 交互](/builders/ethereum/dev-env/remix/#interacting-with-a-moonbeam-based-erc-20-from-metamask){target=\_blank}部分将向您展示如何部署 ERC-20 代币并将其导入到 MetaMask 中。

### 部署的智能合约 {: #deployed-smart-contract }

在本指南的结尾，您将学习如何使用 Safe 与智能合约进行交互。因此，您需要部署一个智能合约来进行交互。如果您需要详细的说明，可以参考[使用 Remix 将合约部署到 Moonbeam](/builders/ethereum/dev-env/remix/#deploying-a-contract-to-moonbeam){target=\_blank} 指南。

您可以前往 [Remix](https://remix.ethereum.org){target=\_blank} 并为以下 `SetText.sol` 合约创建一个新文件：

```solidity
--8<-- 'code/tokens/manage/multisig-safe/1.sol'
```

这是一个简单的合约，只有一个函数 `setTextData`，它接受一个字符串并用它来设置 `text` 变量。

您将需要合约地址和 ABI，因此请确保您已将其复制到某处或可以访问它们以供以后使用。

## 创建 Safe {: #create-a-safe }

要开始创建 Safe，请导航至 [Moonbeam Safe](https://multisig.moonbeam.network/?chain=mbase){target=\_blank}。在本指南中，您将在 Moonbase Alpha 上创建一个 Safe，但您也可以调整说明以在 [Moonbeam](https://multisig.moonbeam.network/?chain=mbeam){target=\_blank} 或 [Moonriver](https://multisig.moonbeam.network/?chain=mriver){target=\_blank} 上创建 Safe。要切换网络，只需单击页面右上角的网络下拉菜单。

### 连接 MetaMask {: #connect-metamask }

进入 [Moonbase Alpha](https://multisig.moonbeam.network/?chain=mbase){target=\_blank} 页面后，您可以首先连接您的钱包，从而开始创建一个 Safe：

 1. 点击 **连接钱包**
 2. 选择一个钱包来连接到 Moonbeam Safe。在此示例中，您可以使用 MetaMask。如果 MetaMask 没有出现在选项列表中，请点击 **显示更多** 并选择 **MetaMask**

![将钱包连接到 Moonbeam Safe](/images/tokens/manage/multisig-safe/safe-1.webp)

如果您尚未登录 MetaMask，系统将提示您登录。然后，系统将引导您添加和连接您的帐户，并添加和切换到 Moonbase Alpha 网络：

 1. 选择一个帐户并连接到 Safe。您需要选择至少 3 个所有者帐户中的 2 个，然后点击 **下一步**。在此示例中，已选择 Alice、Bob 和 Charlie 的帐户
 2. 点击 **连接** 以连接到所选帐户
 3. 如果您未连接到 Moonbase Alpha，也没有在 MetaMask 中添加该网络，请点击 **批准** 以将 Moonbase Alpha 添加为自定义网络
 4. 点击 **切换网络** 以将网络切换到 Moonbase Alpha

![将 MetaMask 连接到 Moonbase Alpha](/images/tokens/manage/multisig-safe/safe-2.webp)

现在，在右上角，您可以确认您已在 Moonbase Alpha 网络上连接到您的 MetaMask 帐户。如果您使用的是开发帐户，您应该会看到 Alice 的帐户地址。如果不是，请仔细检查您的 MetaMask 并切换到 Alice 的帐户。

### 创建新保险箱 {: #create-new-safe }

要在 Moonbase Alpha 上创建新的保险箱，请单击**创建新保险箱**。您将被带到一个向导，它将引导您创建新的保险箱。通过执行这些步骤并创建您的保险箱，您同意使用条款和隐私政策。因此，在开始之前，请随时查看这些条款和政策。

![创建 Safe](/images/tokens/manage/multisig-safe/safe-3.webp)

您需要为您的保险箱指定一个名称：

 1. 输入您的新保险箱的名称，您可以使用 `moonbeam-tutorial`
 2. 单击**开始**

![提交 Safe 名称](/images/tokens/manage/multisig-safe/safe-4.webp)

接下来是向导的所有者和确认部分。在本节中，您将添加保险箱的所有者并指定阈值。阈值决定了在执行交易之前需要多少所有者确认交易。

创建保险箱时可以使用许多不同的设置。保险箱可以有 1 个或多个所有者，以及不同的阈值级别。请注意，不建议仅使用 1 个所有者创建保险箱，因为它会造成单点故障的可能性。

在本指南中，您将创建一个具有 3 个所有者并需要阈值为 2 的多重签名设置，因此至少需要 3 个所有者密钥中的 2 个才能通过保险箱执行交易。

您的帐户将自动预填充为第一个所有者，但是如果您想使用其他帐户，则可以更改此设置。在此示例中，Alice 的帐户已预先填充。除了 Alice 之外，您还可以添加 Bob 和 Charlie 作为所有者：

 1. 单击**添加其他所有者**
 2. 输入 **Bob** 作为第二个所有者，以及他的地址：`0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0`
 3. 输入 **Charlie** 作为第三个所有者，以及他的地址：`0x798d4Ba9baf0064Ec19eB4F0a1a45785ae9D6DFc`
 4. 将确认阈值设置为 3 个所有者中的 **2** 个
 5. 单击**审查**以转到向导的最后一步

![输入 Safe 所有者](/images/tokens/manage/multisig-safe/safe-5.webp)

最后，您可以查看所有保险箱和所有者详细信息，如果一切正常：

 1. 单击**提交**以创建您的新保险箱。在 Moonbase Alpha 上创建保险箱的成本大约低于 0.001 DEV 代币。MetaMask 将弹出并提示您确认交易
 2. 单击**确认**以发送交易并创建保险箱

![发送交易以创建多重签名 Safe](/images/tokens/manage/multisig-safe/safe-6.webp)

处理交易并创建保险箱可能需要几分钟时间，但是一旦创建完成，您应该会看到一条消息，提示“您的保险箱已成功创建”。从那里，您可以单击**开始使用**以加载您的保险箱并开始与之交互。

![安全创建成功](/images/tokens/manage/multisig-safe/safe-7.webp)

## 配置 Safe {: #configure-safe }

您可以随时管理您的 Safe，并更改创建时设置的一些参数。为此，您可以点击左侧菜单中的 **Settings** 选项。

![修改 Safe 设置](/images/tokens/manage/multisig-safe/safe-8.webp)

在其中，您有以下选项：

 - **Safe 详情** — 允许您更改 Safe 名称。这是一个本地操作，不需要链上交互
 - **所有者** — 允许您发起链上提案，以添加/删除 Safe 的所有者
 - **策略** — 允许您发起链上提案，以更改多重签名阈值以执行交易提案
 - **高级** — 允许您检查 Safe 的其他参数，例如 nonce、模块和交易保护

## 接收和发送代币 {: #receive-and-send-tokens }

### 接收代币 {: #receive-tokens }

既然您已经创建了您的Safe，那么您可以开始与之交互了。首先，通过向其发送一些DEV代币来加载Safe。您可以从任何拥有DEV代币的帐户向Safe发送资金。对于此示例，您可以使用Alice的帐户。将鼠标悬停在资产列表中的**DEV**上，以显示“**发送**”和“**接收**”按钮。然后单击“**接收**”。

![将代币接收到Safe](/images/tokens/manage/multisig-safe/safe-9.webp)

将会出现一个弹窗，其中包含Safe的地址。复制地址，然后单击“**完成**”。

![复制Safe地址](/images/tokens/manage/multisig-safe/safe-10.webp)

接下来，打开您的MetaMask以启动交易：

 1. 单击“**发送**”以发送交易
 2. 粘贴Safe的地址
 3. 输入您要发送到Safe的DEV代币数量。对于此示例，您可以使用2个DEV代币
 4. 单击“**下一步**”
 5. 查看交易的详细信息，然后单击“**确认**”

![将DEV代币发送到Safe](/images/tokens/manage/multisig-safe/safe-11.webp)

交易将被发送，并且您的 Safe 上的 DEV 代币余额将被更新。

### 发送代币 {: #send-tokens }

既然您在 Safe 中有资金，您可以将资金从 Safe 发送到另一个帐户。对于此示例，您可以将 1 个 DEV 代币发送到 Bob 的地址。将鼠标悬停在资产列表中的 **DEV** 上，这次单击 **Send**。

![从 Safe 发送代币](/images/tokens/manage/multisig-safe/safe-12.webp)

将出现一个弹出窗口，您可以在其中输入收件人和要发送的 DEV 代币数量：

 1. 输入 Bob 的地址
 2. 从资产列表中选择 **DEV**
 3. 输入 1 个 DEV 代币
 4. 单击 **Review**

![从 Safe 向 Bob 发送 1 个 DEV 代币](/images/tokens/manage/multisig-safe/safe-13.webp)

 1. 检查详细信息，然后单击 **Submit**。MetaMask 将会弹出，您会注意到您发送的不是交易，而是消息
 2. 单击 **Sign** 以签署消息

![提交交易并签署消息](/images/tokens/manage/multisig-safe/safe-14.webp)

现在，如果您返回到 Safe，在“**Transactions**”选项卡下，您应该能够看到已发起交易提案，以将 1 个 DEV 代币发送到 Bob 的地址。但是，您还应该看到仅收到 2 个确认中的 1 个，并且需要再有 1 个所有者确认交易，然后才能执行交易。

![需要确认的交易](/images/tokens/manage/multisig-safe/safe-15.webp)

### 交易确认 {: #transaction-confirmation }

对于多重签名 Safe 的所有用例，确认（或拒绝）交易提议的过程是相似的。其中一个所有者发起执行操作的提议。其他所有者可以批准或拒绝该提议。一旦达到签名阈值，任何所有者都可以在批准后执行交易提议，或者在拒绝后放弃交易提议。

在此示例中，如果 3 个所有者中的 2 个决定拒绝该提议，那么资产将保留在 Safe 中。但是，在这种情况下，您可以从 Bob 或 Charlie 的帐户确认交易。

在 MetaMask 中将帐户切换到 Bob 的帐户（或 Charlie 的帐户）。然后返回到以 Bob 身份连接的 Safe。**确认** 按钮现在应该已启用。以 Bob 的身份，继续单击**确认**以达到阈值并发送交易。将出现一个弹出窗口，供您批准交易：

 1. 选中**执行交易**框，以便在确认后立即执行交易。您可以取消选中它，以便稍后手动执行交易
 2. 单击**提交**
 3. MetaMask 将弹出并要求您确认交易，如果一切正常，您可以单击**确认**

!!! note
    如果您收到错误，指出交易可能失败，则您可能需要增加 gas 限制。您可以在**高级选项**或 MetaMask 中执行此操作。

![提交交易确认](/images/tokens/manage/multisig-safe/safe-16.webp)

该交易将从 **QUEUE** 选项卡中删除，并且现在可以在 **HISTORY** 选项卡下找到该交易的记录。此外，Bob 的余额现在增加了 1 个 DEV 代币，而 Safe 的 DEV 代币余额减少了。

![成功执行的交易](/images/tokens/manage/multisig-safe/safe-17.webp)

恭喜，您已成功地从 Safe 中接收和发送 DEV 代币！

## 接收和发送 ERC-20 代币 {: #receive-and-send-erc20-tokens }

### 接收 ERC-20 代币 {: #receive-erc20-tokens }

接下来是在 Safe 中接收和发送 ERC-20 代币。您应该已经使用 **MYTOK** ERC-20 代币加载了您的 MetaMask。如果还没有，请参考先决条件的 [ERC-20 代币](#erc20-tokens) 部分。

在此示例中，您仍应连接到 Bob 的帐户。因此，您将从 Bob 的帐户向 Safe 发送 MYTOK 代币。

您需要再次获取 Safe 的地址，您可以通过单击左上角的**复制到剪贴板**图标来执行此操作。复制 Safe 的地址后，打开 MetaMask：

 1. 切换到 “**资产**” 选项卡，然后从列表中选择 **MYTOK**
 2. 点击 **发送**
 3. 粘贴 Safe 的地址
 4. 输入要发送的 MYTOK 数量。您应该已经在 [使用 Remix 部署到 Moonbeam](/builders/ethereum/dev-env/remix/){target=\_blank} 指南中铸造了 800 万个 MYTOK 代币。因此，在本示例中，您可以输入 1000 个 MYTOK 作为要发送的数量
 5. 点击 **下一步**
 6. 查看交易详情，然后单击**确认**以发送交易。

![将 ERC-20 发送到 Safe](/images/tokens/manage/multisig-safe/safe-18.webp)

如果您导航回 Safe，在**资产**列表中，您现在应该看到 **MyToken** 和 1000 个 MYTOK 的余额。**MyToken** 可能需要几分钟才能显示，但您无需执行任何操作即可添加资产，它会自动显示。

### 发送 ERC-20 代币 {: #send-erc20-tokens }

现在您已经将 MYTOK 加载到您的 Safe 中，您可以将一些从 Safe 发送到另一个帐户。对于此示例，您可以将 10 个 MYTOK 发送给 Charlie。

将鼠标悬停在资产列表中的 **MyToken** 上，这次点击 **Send**。

![从 Safe 发送 ERC-20](/images/tokens/manage/multisig-safe/safe-19.webp)

将出现一个弹出窗口，您可以在其中输入收件人和要发送的 MYTOK 代币数量：

 1. 输入 Charlie 的地址
 2. 从资产列表中选择 **MyToken**
 3. 输入 10 个 MYTOK 代币
 4. 点击 **Review** 并查看详细信息

![从 Safe 向 Charlie 发送 ERC-20](/images/tokens/manage/multisig-safe/safe-20.webp)

如果一切正常，您可以：

 1. 点击 **Submit**。MetaMask 将会弹出，您会注意到您发送的不是交易，而是消息
 2. 点击 **Sign** 以签署消息

![签署消息以从 Safe 向 Charlie 发送 ERC-20](/images/tokens/manage/multisig-safe/safe-21.webp)

现在，如果您返回到 Safe，在 **Transactions** 选项卡下，您应该能够看到已启动了一项交易提案，以将 10 个 MYTOK 代币发送到 Charlie 的地址。但是，您还应该看到仅收到了 2 个确认中的 1 个，并且需要 1 个所有者才能确认交易才能执行。

![需要确认的交易](/images/tokens/manage/multisig-safe/safe-22.webp)

您将需要将帐户切换到 Alice 或 Charlie，并确认交易以执行它。您可以按照上面 [交易确认](#transaction-confirmation) 部分中概述的相同步骤进行操作。

一旦交易已从其他两个帐户之一确认，则该交易将移至 **HISTORY** 选项卡。

![成功执行的交易](/images/tokens/manage/multisig-safe/safe-23.webp)

恭喜！您已成功地将 ERC-20 代币发送到 Safe 并从 Safe 中发送！

## 与智能合约交互 {: #interact-with-a-smart-contract }

在本节中，您将使用 Safe 与智能合约进行交互。您应该已经使用 Remix 部署了 `SetText.sol` 合约，如果还没有，请返回到先决条件的[已部署智能合约](#deployed-smart-contract)部分。

在本指南的这一部分，您应该仍然连接到 Alice 的帐户。

从 Safe 中：

 1. 在左侧，单击**新交易**
 2. 然后选择**合约交互**

![新合约交互](/images/tokens/manage/multisig-safe/safe-24.webp)

将出现**合约交互**弹出窗口，您可以填写合约详细信息：

 1. 在**合约地址**字段中输入合约地址
 2. 在 **ABI** 文本框中，粘贴 ABI
 3. 将出现一个**方法**下拉列表。选择 `setTextData` 函数
 4. 然后会出现一个 `_text` 输入字段。您可以输入任何您想要的内容，对于此示例，您可以使用 `polkadots and moonbeams`
 5. 单击**审查**

![创建合约交互](/images/tokens/manage/multisig-safe/safe-25.webp)

如果详细信息看起来没问题，请继续：

 1. 单击**提交**。MetaMask 将弹出，您会注意到您发送的不是交易，而是消息
 2. 单击**签名**以签署消息

![提交合约交互](/images/tokens/manage/multisig-safe/safe-26.webp)

现在，如果您返回 Safe，在**交易**选项卡下，您应该能够看到已启动了一个针对**合约交互**的交易提案。但是，您还应该看到只收到了 2 个确认中的 1 个，并且需要 1 个所有者才能确认交易才能执行。

![需要确认的交易](/images/tokens/manage/multisig-safe/safe-27.webp)

您需要将帐户切换到 Bob 或 Charlie，并确认交易才能执行。您可以按照上面[交易确认](#transaction-confirmation)部分中概述的相同步骤进行操作。

一旦交易已从其他两个帐户之一确认，该交易将移至 **HISTORY** 选项卡。

![交易历史](/images/tokens/manage/multisig-safe/safe-28.webp)

要仔细检查是否设置了正确的文本，您可以再次执行该过程，只是不要从**方法**下拉列表中选择**setTextData**，您可以选择**text**来读取 `text` 的值。这将是一个调用而不是交易，因此会出现一个**调用**按钮。单击它，直接在弹出窗口中，您应该看到调用的结果 `polkadots and moonbeams`。

![合约交互调用结果](/images/tokens/manage/multisig-safe/safe-29.webp)

恭喜，您已成功使用 Safe 与智能合约进行了交互！

## 使用 Moonbeam Safe API {: #using-moonbeam-safe-apis }

有一些 API 可用于读取和与 Moonbeam、Moonriver 和 Moonbase Alpha 的 Moonbeam Safe 进行交互。

=== "Moonbeam"

     ```text
     {{networks.moonbeam.multisig.api_page }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.multisig.api_page}}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonbase.multisig.api_page}}
     ```

作为使用 API 的示例，请尝试从 Moonbeam Safe API 中检索有关 Safe 的信息。在 Safe 页面中，复制您的 Safe 地址：

![合约交互调用结果](/images/tokens/manage/multisig-safe/safe-30.webp)

现在您可以使用该 API：

 1. 打开相应网络的 API 页面
 2. 向下滚动到 **safes** 部分，然后单击 **/safes/{address}/** 端点部分以展开其面板
 3. 点击右侧的 **Try it out** 按钮

![合约交互调用结果](/images/tokens/manage/multisig-safe/safe-31.webp)

一个大的 **Execute** 按钮应出现在面板中。

 1. 将您的 Safe 地址粘贴到 **address** 输入框中
 2. 按 **Execute**
 3. 有关您的 safe 的信息将出现在下方

![合约交互调用结果](/images/tokens/manage/multisig-safe/safe-32.webp)

恭喜！您已成功使用 Moonbeam Safe 的 API。还有许多其他端点可供使用，无论是为了方便还是添加到您自己的应用程序中。

--8<-- 'zh/text/_disclaimers/third-party-content.md'
