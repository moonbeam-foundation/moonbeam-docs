---
title: Moonbase Alpha 入门指南
description: Moonbeam 测试网，名为 Moonbase Alpha，是开始使用 Polkadot 环境的最简单方法。请按照本教程连接到测试网。
categories: Basics
---

# Moonbase Alpha 入门指南

--8<-- 'zh/text/builders/get-started/networks/moonbase/connect.md'

## 区块浏览器

对于 Moonbase Alpha，您可以使用以下任一区块浏览器：

 - **以太坊 API（Etherscan 等效）**— [Moonscan](https://moonbase.moonscan.io){target=\_blank}
 - **基于以太坊 API JSON-RPC** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha){target=\_blank}
 - **Substrate API** — [Subscan](https://moonbase.subscan.io){target=\_blank} 或 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbase.moonbeam.network#/explorer){target=\_blank}

有关每个可用区块浏览器的更多信息，请访问文档的 [区块浏览器](builders/get-started/explorers/){target=\_blank} 部分。

## 连接 MetaMask

如果您已经安装了 MetaMask，您可以轻松地将 MetaMask 连接到 Moonbase Alpha 测试网：

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">Connect MetaMask</a>
</div>

!!! note
    MetaMask 将弹出窗口，请求您授予权限以将 Moonbase Alpha 添加为自定义网络。批准权限后，MetaMask 会将您当前的网路切换到 Moonbase Alpha。

如果您没有安装 MetaMask，或者想要按照教程开始操作，请查看[使用 MetaMask 与 Moonbeam 交互](tokens/connect/metamask/){target=\_blank} 指南。

## 配置 {: #configuration }

请注意以下 gas 配置参数。这些值可能会在将来的运行时升级中发生更改。

|       变量        |                   值                    |
|:---------------------:|:------------------------------------------:|
|   最低 gas 价格   | {{ networks.moonbase.min_gas_price }} Gwei |
|   目标区块时间   | {{ networks.moonbase.block_time }} 秒 |
|    区块 gas 限制    |     {{ networks.moonbase.gas_block }}      |
| 交易 gas 限制 |       {{ networks.moonbase.gas_tx }}       |

## 获取代币 {: #get-tokens }

要开始在 Moonbase Alpha 上进行构建，您可以从 Moonbase Alpha 水龙头获取 DEV 代币。对于特定数额，您可以随时通过我们的社区渠道直接与我们联系。

要从水龙头请求 DEV 代币，您可以在 [Moonbase Alpha 水龙头](https://faucet.moonbeam.network){target=\_blank} 网站上输入您的地址。水龙头每 24 小时分配 {{ networks.moonbase.website_faucet_amount }}。

![Moonbase Alpha 水龙头网站。](/images/builders/get-started/networks/moonbase/moonbase-1.webp)

!!! note
    Moonbase Alpha DEV 代币没有价值。请勿通过不必要的请求向水龙头发送垃圾邮件。

## Demo DApps {: #Demo-DApps }

Moonbase Alpha 上部署了各种 DApp，使您可以试验各种应用程序和集成。您还可以通过 [Moonbase ERC20 Minter](https://moonbase-minterc20.netlify.app){target=\_blank} 或 [Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank} DApp 获取各种测试代币。例如，[Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank} 可以帮助您获取 cross-chain 资产，例如 xcUNIT 或 xcKarura，以测试与 XCM 相关的函数。在下表中，您将找到每个示例 DApp、其关联的 URL 和 GitHub 存储库。

### 快速链接 {: #quick-links }

|                                            DApp                                            |    描述     |                                                                            存储库                                                                            |
|:------------------------------------------------------------------------------------------:|:------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|     [Moonbase ERC-20 Minter](https://moonbase-minterc20.netlify.app){target=\_blank}      |   ERC-20 水龙头    |                 [https://github.com/papermoonio/moonbase-mintableERC20](https://github.com/papermoonio/moonbase-mintableERC20){target=\_blank}                  |
|        [Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank}        |  Uniswap V2 分叉   |                       [https://github.com/papermoonio/moonbeam-uniswap](https://github.com/papermoonio/moonbeam-uniswap){target=\_blank}                        |

|        [MoonLotto Lottery](https://moonbase-moonlotto.netlify.app){target=\_blank}        |   TheGraph 演示    | [接口](https://github.com/papermoonio/moonlotto-interface){target=\_blank}, [子图](https://github.com/papermoonio/moonlotto-subgraph){target=\_blank} |
| [Moonbeam WalletConnect](https://moonbeam-walletconnect-demo.netlify.app){target=\_blank} | WalletConnect 演示 |            [https://github.com/papermoonio/moonbeam-walletconnect-demo](https://github.com/papermoonio/moonbeam-walletconnect-demo){target=\_blank}             |
|              [MoonGas](https://moonbeam-gasinfo.netlify.app){target=\_blank}              | Gas 价格追踪器  |                    [https://github.com/albertov19/moonbeam-gas-station](https://github.com/albertov19/moonbeam-gas-station){target=\_blank}                     |

!!! note
    这些 DApp 仅用于演示目的，可能不完整或不适合生产部署。

### Moonbase ERC20 铸币器 {: #moonbase-erc20-minter }

[Moonbase ERC-20 铸币器](https://moonbase-minterc20.netlify.app){target=\_blank} 使您能够铸造各种 ERC-20 测试代币，这些代币分别对应太阳系的 8 个行星和冥王星。要铸造代币，首先按右上角的 **Connect MetaMask**。然后滚动到 **Mint Tokens** 部分，然后选择所需的 ERC-20 合约。按 **Submit Tx** 并在 MetaMask 中确认交易。每次铸造将授予您 100 个代币，并且您每小时可以为每个合约铸造一次代币。

![ERC20 铸币器](/images/builders/get-started/networks/moonbase/moonbase-2.webp)

### Moonbeam Uniswap {: #moonbeam-uniswap }

[Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=\_blank} 是部署到 Moonbase Alpha 的 [Uniswap-V2](https://blog.uniswap.org/uniswap-v2){target=\_blank} 的一个分支。值得注意的是，Moonbeam Uniswap 允许开发人员轻松进行交易，以获取 [跨链资产](builders/interoperability/xcm/xc20/){target=\_blank}，例如用于 XCM 测试的 xcKarura 或 xcUNIT。要执行您的第一笔交易，请执行以下步骤：

1. 按下 **选择代币**
2. 连接您的 MetaMask 钱包并确保您在 Moonbase Alpha 网络上
3. 在提示中按下 **选择列表**
4. 选择 **Moon 菜单**
5. 从列表中搜索或选择您想要的资产，然后继续进行交易

![Moonbeam Swap](/images/builders/get-started/networks/moonbase/moonbase-3.webp)

!!! note
    如果您在 **Moon 菜单** 下仅看到部分资产列表，则您的浏览器可能已缓存旧版本的 **Moon 菜单**。清除缓存并重新添加 **Moon 菜单** 即可解决此问题。

### MoonLotto 彩票 {: #moonlotto-lottery }

[MoonLotto](https://moonbase-moonlotto.netlify.app){target=\_blank} 是 Moonbase Alpha 上的一个简单的彩票游戏，源自 [The Graph 的示例子图](https://github.com/graphprotocol/example-subgraph){target=\_blank}。购买彩票需要 1 DEV，如果至少有 10 名参与者，则每半小时选出一名获胜者。[MoonLotto.sol](https://github.com/papermoonio/moonlotto-subgraph/blob/main/contracts/MoonLotto.sol){target=\_blank} 包含了彩票的合约逻辑。要参与，请按照以下步骤操作：

1. 连接您的 MetaMask 钱包，并确保您在 Moonbase Alpha 网络上
2. 输入彩票接收者的地址或选中**我想为我的地址购买彩票**
3. 按下**在 MetaMask 上提交**并在 MetaMask 中确认交易

![MoonLotto 彩票](/images/builders/get-started/networks/moonbase/moonbase-5.webp)

### Moonbeam WalletConnect {: #moonbeam-walletconnect }

[Moonbeam WalletConnect](https://moonbeam-walletconnect-demo.netlify.app){target=\_blank} 展示了将 [WalletConnect](https://walletconnect.com){target=\_blank} 集成到您的 DApps 中并解锁对各种加密钱包的支持是多么容易。请务必查看 [演示应用程序存储库](https://github.com/papermoonio/moonbeam-walletconnect-demo){target=\_blank}，以了解 WalletConnect 集成是如何工作的。要开始使用，您可以按照以下步骤操作：

1. 按 **Connect Wallet**（连接钱包）
2. 使用 [与 WalletConnect 兼容的钱包](https://walletguide.walletconnect.network/){target=\_blank} 扫描二维码

![Moonbeam WalletConnect](/images/builders/get-started/networks/moonbase/moonbase-6.webp)

### MoonGas {: #moongas }

[MoonGas](https://moonbeam-gasinfo.netlify.app){target=\_blank} 是一个方便的仪表板，用于查看所有 Moonbeam 网络中前一个区块的交易的最低、最高和平均 Gas 价格。请注意，这些统计数据可能会因区块而异，偶尔会包含异常值。您可以查看 [MoonGas 的存储库](https://github.com/albertov19/moonbeam-gas-station){target=\_blank}。

您会注意到 Moonbeam 的最低 Gas 价格是 {{ networks.moonbeam.min_gas_price }} Gwei，而 Moonriver 的最低 Gas 价格是 {{ networks.moonriver.min_gas_price }} Gwei，Moonbase Alpha 的最低 Gas 价格是 {{ networks.moonbase.min_gas_price }} Gwei。这种差异源于 [GLMR 的 100 比 1 重新计价](https://moonbeam.network/news/moonbeam-foundation-announces-liquidity-programs-a-new-token-event-and-glmr-redenomination){target=\_blank}，因此 Moonbeam 上的 {{ networks.moonbeam.min_gas_price }} Gwei 最低值对应于 Moonriver 上的 {{ networks.moonriver.min_gas_price }} Gwei 最低值和 Moonbase 上的 {{ networks.moonbase.min_gas_price }} Gwei。

![MoonGas](/images/builders/get-started/networks/moonbase/moonbase-7.webp)
