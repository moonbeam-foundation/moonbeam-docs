---
title: 如何连接 MetaMask
description: 本指南将引导您了解如何将基于浏览器的以太坊钱包 MetaMask 连接到基于 Moonbeam 的网络，以及如何转移资金。
categories: Tokens and Accounts, Ethereum Toolkit
---

# 使用 MetaMask 与 Moonbeam 交互

## 简介 {: #introduction }

开发人员可以利用 Moonbeam 的以太坊兼容性功能将 [MetaMask](https://metamask.io){target=\_blank} 等工具集成到他们的 dApp 中。 这样，他们就可以使用 MetaMask 提供的注入库与区块链进行交互。

目前，MetaMask 可以配置为连接到以下几个网络：Moonbeam、Moonriver、Moonbase Alpha 测试网和一个 Moonbeam 开发节点。

如果您已经安装了 MetaMask，您可以轻松地将 MetaMask 连接到您选择的网络：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbeam">连接到 Moonbeam</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonriver">连接到 Moonriver</a>
</div>

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">连接到 Moonbase Alpha</a>
</div>

!!! note
    MetaMask 将会弹出窗口，请求您授予添加自定义网络的权限。 一旦您批准了这些权限，MetaMask 将切换您当前的网络。

--8<-- 'zh/text/_disclaimers/third-party-content-intro.md'

## 安装 MetaMask 扩展 {: #install-the-metamask-extension }

首先，您需要从 Chrome 商店安装一个全新的默认 [MetaMask](https://metamask.io){target=\_blank}。下载、安装并初始化扩展后，请按照**入门**指南进行操作。在其中，您需要创建一个钱包，设置密码，并存储您的秘密备份短语(这可以直接访问您的资金，所以请确保将其存储在安全的地方)。

## 设置钱包 {: #setup-a-wallet }

安装 [MetaMask](https://metamask.io){target=\_blank} 后，设置将自动打开一个新任务，并显示欢迎屏幕。在这里，您有两种选择：

- **创建新钱包** - 您将完成一些步骤以获得新的种子短语。确保您安全地存储此短语，并且不要公开分享
- **导入现有钱包** - 您已经存储了一个种子短语，并且您想从该恢复短语中恢复一个帐户

![Metamask 设置界面](/images/tokens/connect/metamask/metamask-1.webp)

选择适合您需要的选项后，请按照步骤操作，您应该一切准备就绪。

!!! note
    通过更改所谓的地址索引，可以从种子短语中派生多个帐户。默认情况下，当从种子短语创建或导入帐户时，您将获得地址索引为 0 的帐户。您只需在主 Metamask 屏幕中添加新帐户即可获得其他索引。

## 导入账户 {: #import-accounts }

创建钱包或导入现有钱包后，如果您持有私钥，您也可以将任何账户导入到 MetaMask 中。

在本示例中，您将使用开发账户的私钥。点击账户切换器按钮，使用私钥导入账户。也就是显示账户 **1(Account 1)** 的地方。

![从私钥 MetaMask 菜单导入账户](/images/tokens/connect/metamask/metamask-2.webp)

接下来，点击 **导入账户**。

![从私钥账户切换器菜单导入账户](/images/tokens/connect/metamask/metamask-3.webp)

最后，输入您要导入的账户的私钥。例如，您可以使用 Moonbeam 开发节点中预先注资的账户之一。本指南使用 Gerald 的密钥。输入私钥后，点击 **导入**。

??? note "开发账户地址和私钥"
    --8<-- 'zh/code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'
    --8<-- 'zh/code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

![将您的账户密钥粘贴到 MetaMask 中](/images/tokens/connect/metamask/metamask-4.webp)

您最终应该得到一个导入的 **账户 2**，如下所示：

![MetaMask 显示您的新账户 2](/images/tokens/connect/metamask/metamask-5.webp)

## 将 MetaMask 连接到 Moonbeam {: #connect-metamask-to-moonbeam }

一旦您安装了 [MetaMask](https://metamask.io){target=\_blank} 并创建或导入了一个帐户，您就可以将其连接到任何基于 Moonbeam 的网络。为此，请执行以下步骤：

1. 点击左上角的网络选择器菜单
2. 选择 **添加网络**

![在 Metamask 菜单中添加新网络](/images/tokens/connect/metamask/metamask-6.webp)

接下来，转到页面底部并点击 **手动添加网络**：

![在 Metamask 中手动添加网络](/images/tokens/connect/metamask/metamask-7.webp)

在这里，您可以为以下网络配置 MetaMask：

=== "Moonbeam"
    |          字段           |                                      值                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |         网络名称          |                                    `Moonbeam`                                    |
    |          RPC URL          |                     `{{ networks.moonbeam.public_rpc_url }}`                     |
    |          链 ID           | `{{ networks.moonbeam.chain_id }}` (hex: `{{ networks.moonbeam.hex_chain_id }}`) |
    |       符号（可选）        |                                      `GLMR`                                      |
    |     区块浏览器（可选）     |                     `{{ networks.moonbeam.block_explorer }}`                     |

=== "Moonriver"
    |          字段           |                                       值                                        |
    |:-------------------------:|:----------------------------------------------------------------------------------:|
    |         网络名称          |                                    `Moonriver`                                     |
    |          RPC URL          |                     `{{ networks.moonriver.public_rpc_url }}`                      |
    |          链 ID           | `{{ networks.moonriver.chain_id }}` (hex: `{{ networks.moonriver.hex_chain_id }}`) |
    |       符号（可选）        |                                       `MOVR`                                       |
    |     区块浏览器（可选）     |                     `{{ networks.moonriver.block_explorer }}`                      |

=== "Moonbase Alpha"
    |          字段           |                                      值                                       |
    |:-------------------------:|:--------------------------------------------------------------------------------:|
    |         网络名称          |                                 `Moonbase Alpha`                                 |
    |          RPC URL          |                        `{{ networks.moonbase.rpc_url }}`                         |
    |          链 ID           | `{{ networks.moonbase.chain_id }}` (hex: `{{ networks.moonbase.hex_chain_id }}`) |
    |       符号（可选）        |                                      `DEV`                                       |
    |     区块浏览器（可选）     |                     `{{ networks.moonbase.block_explorer }}`                     |

=== "Moonbeam Dev Node"
    |          字段           |                                         值                                          |
    |:-------------------------:|:--------------------------------------------------------------------------------------:|
    |         网络名称          |                                     `Moonbeam Dev`                                     |
    |          RPC URL          |                          `{{ networks.development.rpc_url }}`                          |
    |          链 ID           | `{{ networks.development.chain_id }}` (hex: `{{ networks.development.hex_chain_id }}`) |
    |       符号（可选）        |                                         `DEV`                                          |
    |     区块浏览器（可选）     |                      `{{ networks.development.block_explorer }}`                       |

为此，请填写以下信息：

1. **网络名称** - 代表您要连接的网络的名称
2. **RPC URL** - 网络的 [RPC 端点](/builders/get-started/endpoints/){target=\_blank}
3. **Chain ID** - 以太坊兼容网络的链 ID
4. **符号** - （可选）网络原生代币的符号。例如，对于 Moonbeam，该值为 **GLMR**
5. **区块浏览器** - （可选）[区块浏览器](/builders/get-started/explorers/){target=\_blank} 的 URL
6. 验证所有信息后，点击 **保存**

![在 Metamask 中添加网络](/images/tokens/connect/metamask/metamask-8.webp)

添加网络后，您将被重定向到一个屏幕，声明您已成功添加一个网络。此外，系统将提示您**切换到 Moonbase Alpha**，这是本示例中添加的网络。

![在 Metamask 中成功添加网络](/images/tokens/connect/metamask/metamask-9.webp)

## 与网络互动 {: #interact-with-the-network }

一旦您将 [Metamask 连接](#connect-metamask-to-moonbeam) 到任何基于 Moonbeam 的网络，您就可以通过以下方式开始使用您的钱包：

- 向另一个地址发送代币转账
- 将 ERC-20 添加到 Metamask 并与之互动
- 将 ERC-721 添加到 Metamask 并与之互动

### 发起转账 { #initiate-a-transfer }

本节演示了如何将一个简单的 Token 转账到另一个地址，作为使用 Metamask 和 Moonbeam 的一个例子。

若要执行此操作，请按照以下步骤操作：

1. 确保您已连接到正确的网络
2. 确保您已选择要用于转账的帐户
3. 在 Metamask 钱包的主屏幕上，单击**发送**

![在 Metamask 中发起余额转账](/images/tokens/connect/metamask/metamask-10.webp)

接下来，您可以输入要向其发送 Token 的地址。在此示例中，选择了一个已导入到 Metamask 的钱包，称为 **Bob**。

![在 Metamask 中选择要向其发送 Token 的帐户](/images/tokens/connect/metamask/metamask-11.webp)

在下一个屏幕上，请按照以下步骤操作：

1. 输入要发送的 Token 数量
2. 验证所有信息是否正确，然后单击**下一步**

![在 Metamask 中设置要发送的 Token 数量](/images/tokens/connect/metamask/metamask-12.webp)

最后，确认所有与 Gas 相关的参数和费用都正确。在验证一切正常后，单击**确认**。此时，您的交易已发送到网络！

![在 Metamask 中确认交易](/images/tokens/connect/metamask/metamask-13.webp)

确认交易后，您将返回到钱包的主屏幕，在那里您将看到交易显示为“**待处理**”。不到一分钟后，交易应显示为“**已确认**”。如果单击您的交易，您可以查看更多详细信息并在区块浏览器中查看它。

![在 Metamask 中确认交易](/images/tokens/connect/metamask/metamask-14.webp)

### 添加 ERC-20 代币 {: #add-an-erc20-token }

要将 ERC-20 代币添加到您的 MetaMask 钱包，您需要使用其地址导入代币：

1. 确保您已切换到 MetaMask 中的 **Tokens** 选项卡
2. 点击 **Import tokens**
3. 输入您要导入的代币的合约地址。**Token symbol** 和 **Token decimal** 字段将自动填充，但如果需要，您可以编辑 **Token symbol**
4. 点击 **Next**

![Tokens 选项卡和 MetaMask 中的导入代币流程，其中定义了代币地址、符号和小数位。](/images/tokens/connect/metamask/metamask-15.webp)

接下来，您将能够查看代币导入详细信息。要完成导入，您可以点击 **Import**。

![查看代币详细信息并在 MetaMask 中完成导入。](/images/tokens/connect/metamask/metamask-16.webp)

在 **Tokens** 选项卡下，您将能够看到代币以及该代币的帐户余额。

![在 MetaMask 的 Tokens 选项卡上的资产列表中查看导入的代币。](/images/tokens/connect/metamask/metamask-17.webp)

### 添加 ERC-721 代币 {: #add-an-erc721-token }

要将 ERC-721 添加到您的 MetaMask 钱包，您需要代币的地址：

1. 确保您已切换到 MetaMask 中的**NFTs**选项卡
2. 点击**导入 NFT**
3. 输入您要导入的 NFT 的**地址**和**代币 ID**
4. 点击**导入**

![MetaMask 中的“NFTs”选项卡和导入 NFT 的过程，您可以在这里定义 NFT 的地址和代币 ID。](/images/tokens/connect/metamask/metamask-18.webp)

导入 NFT 后，您将能够在 **NFTs** 选项卡中看到 NFT 的预览。您可以单击 NFT 以查看更多详细信息。

![在 MetaMask 的“NFTs”选项卡上的 NFT 列表中查看导入的 NFT。](/images/tokens/connect/metamask/metamask-19.webp)

--8<-- 'zh/text/_disclaimers/third-party-content.md'
