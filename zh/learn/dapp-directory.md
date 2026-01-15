---
title: 在 Moonbeam DApp 目录中列出您的 Dapp
description: 按照本教程学习如何在 Moonbeam 或 Moonriver 上列出您的项目，或者更新 Moonbeam 基金会 DApp 目录中的当前列表。
dropdown_description: 探索 DApp 目录和列表流程
categories: Reference
---

# 如何在 Moonbeam DApp 目录中列出您的项目

## Moonbeam DApp 目录简介 {: #introduction-to-state-of-the-dapps }

Moonbeam 生态系统包含两个不同的生产网络：Moonbeam 和 Moonriver。每个网络都有其自己专门的 DApp 目录，由 Moonbeam 基金会维护：[Moonbeam](https://apps.moonbeam.network/moonbeam/app-dir){target=_blank} 和 [Moonriver](https://apps.moonbeam.network/moonriver/app-dir){target=_blank}。这些目录对从 DeFi 到 NFT 再到游戏的各种项目进行分类，为用户提供对各种应用程序的全面访问。

添加项目时，您需要提供核心项目详情，如名称、描述和相关链接。根据您的项目类型，您可以包含其他数据，例如链上统计数据和代币信息。

尽管 Moonbeam 和 Moonriver DApp 目录之间存在区别，但提交过程保持不变。要在 DApp 目录中列出您的项目，您必须向 [Moonbeam 基金会在 GitHub 上的 App Directory Data 存储库](https://github.com/moonbeam-foundation/app-directory-data){target=_blank} 提交拉取请求。本指南概述了提交所需的必要数据和格式规范。

![Moonbeam DApp 目录主页](/images/learn/dapps-list/directory-1.webp)

## 项目数据概览 {: #overview-project-data }

在 Moonbeam DApp Directory 中，一个项目的列表使用四个主要的数据来源：

- **核心项目数据**：核心项目数据，例如描述、徽标和屏幕截图。此数据还包括用于从外部平台查询数据的 ID。
- **活跃用户和交易量**：基于智能合约活动在链上的数据，适用于与项目关联的所有合约。数据通过在 Moonscan 中使用合约标签来发现，并由 DApp Directory 索引和使用。
- **TVL 数据**：协议的 TVL 数据，来源于项目在 DefiLlama 上的列表。
- **项目代币信息**：代币信息，来源于项目在 CoinGecko 上的展示。

## 使用外部数据源的先决条件 {: #configuring-external-data-sources }

在从上述来源提取数据之前，必须满足某些先决条件。 但是，值得注意的是，这些步骤可能不适用于所有项目类型。 例如，对于没有智能合约的钱包，DApp 目录目前无法显示用户和交易活动数据。

### 配置活跃用户和交易量的数据源 {: #configure-active-users }

对于在 Moonbeam 或 Moonriver 上部署了智能合约的项目，将这些合约链接到 DApp 目录项目数据非常重要。

将智能合约活动链接到 DApp 目录的端到端流程如下：

1. 智能合约所有者填写[在 Moonscan 上标记合约的表格](https://moonscan.io/contactus?id=5){target=_blank}。
2. 合约在 Moonscan 中被标记。
3. 标记的合约随后可以被生态系统分析提供商提取，以索引您项目的活动。
4. （推荐）在 FiDi 注册您的项目，以便您的活动可以被索引并公开查看。请参阅下面的 FiDi 注册部分。

要在 [Moonscan](https://moonscan.io){target=_blank} 上正确标记您项目的智能合约，请提交包含您的项目和合约详细信息的 [Moonscan 合约标记表格](https://moonscan.io/contactus?id=5){target=_blank}。

### 在 FiDi 注册以进行分析（推荐）{: #register-with-fidi }

我们鼓励新的和现有的项目在 FiDi 注册，以便您的项目活动可以在公共分析中被索引和展示。请使用 [FiDi 项目列表表格](https://docs.google.com/forms/d/e/1FAIpQLSc8c5iOzwIHhLJKRTnC48j7CAj9JY8i_lHxryNBdJdzIyDx3Q/viewform){target=_blank} 提交您的项目。

提交后，可以在 [Moonbeam FiDi 仪表板](https://moonbeam.fidi.tech/dashboard/moonbeam){target=_blank} 上查看 Moonbeam FiDi 的分析。

所需的项目信息：

如果可能，请为每个合约添加简短的目的描述，以提高完整性。

- **核心智能合约**：定义核心功能并与网络进行重要交互的主要合约的地址。可以选择包括每个合约用途的简要说明。
- **工厂合约**：如果适用，作为您的 dApp 的一部分部署其他合约的任何合约的地址。另请提供每个工厂合约的创建主题（创建事件的哈希）。
- **部署者钱包**：如果适用，用于部署您的项目合约的钱包地址。

其他项目特定信息（可选）：

- **金库/管理钱包**：具有管理控制权或资金的钱包地址。可以选择包括每个钱包功能的简要说明。
- **预言机合约**：任何预言机合约的地址。可以选择包括这些预言机提供哪些数据的简要说明。
- **桥合约**：任何桥合约的地址以及连接的链的列表。
- **治理合约**：与链上治理相关的任何合约的地址。可以选择包括对您的治理模型的简要说明。

其他注意事项：

- 如果您的项目批量处理交易，请考虑使用批量预编译。
- 工厂合约应派生自或模仿标准的 Uniswap 工厂。
- 支持 Diamond（多面代理）合约，并且会正确索引。
- 典型的列表时间为 1-2 周；FiDi 可能会联系以进行澄清。

一旦您标记了您的智能合约并准备好将您的项目提交到 DApp 目录，配置目录以利用您的智能合约数据将变得非常简单。您只需要您标记合约的 **Project** 组件。

考虑以下具有两个智能合约的示例项目：一个 Comptroller 和一个最近更新到新版本的 Router。

|  Project   | Contract Name | Contract Version |      Resulting Label       |
|:----------:|:-------------:|:----------------:|:--------------------------:|
| My Project |  Comptroller  |        V1        | My Project: Comptroller V1 |
| My Project |    Router     |        V2        |   My Project: Router V2    |

要将您的项目提交到 Moonbeam DApp 目录，请确保您已准备好您的 **Project** 名称，此处标识为 `My Project`。

如果您准备好将您的项目添加到 DApp 目录，请跳到 [如何提交您的项目列表](#how-to-submit-your-project-listing) 部分。

### 配置 TVL 的数据源 {: #configure-tvl }

如果项目代表具有 TVL 的 DeFi 协议（价值锁定在协议的智能合约中），则可以在 Moonbeam DApp 目录中显示 TVL。

TVL 数据来自 [DefiLlama](https://defillama.com){target=_blank}，因此您必须在那里列出您的项目。要列出您的项目，请参阅 DefiLlama 关于[如何列出 DeFi 项目](https://docs.llama.fi/list-your-project/submit-a-project){target=_blank}的文档。

列出您的项目后，您可以轻松配置 DApp 目录以从 DefiLlama 中提取数据。为此，您需要 DefiLlama 标识符，您可以在协议页面的 URL 中找到该标识符。例如，Moonwell 页面的 URL 是 `https://defillama.com/protocol/moonwell`，因此标识符是 `moonwell`。

如果您有标识符并且准备好将您的项目提交到 Moonbeam DApp 目录，请跳到[如何提交您的项目列表](#how-to-submit-your-project-listing)部分。

### 配置项目代币信息的数据源 {: #project-token-information }

如果一个项目有代币，则可以在 DApp 目录中显示代币的名称、当前价格和合约。

但是，数据来自 [CoinGecko](https://www.coingecko.com){target=_blank}，因此项目的代币必须在那里列出。如果您的代币未在其中列出，您可以填写 [CoinGecko 的请求表](https://support.coingecko.com/hc/en-us/requests/new){target=_blank} 以启动上市流程。

假设您的项目代币已在其中列出，您必须获得 CoinGecko **API ID** 值。您可以在 CoinGecko 代币页面的**信息**部分找到 **API ID** 值。例如，[Moonwell 代币页面](https://www.coingecko.com/en/coins/moonwell){target=_blank} 上的 **API ID** 是 `moonwell-artemis`。

如果您有 CoinGecko ID 并且已准备好将您的项目提交到 Moonbeam DApp 目录，您可以继续下一节。

### 在 Moonbeam 和 Moonriver 上部署的项目 {: #projects-with-deployments }

如果一个项目同时部署到 Moonbeam 和 Moonriver，则有两种不同的选择：

- 为每个部署创建一个单独的项目结构。
- 使用单个项目结构并修改两个项目的项目数据文件。

如果出现以下情况，则应使用单独的项目结构：

- 这两个部署在 DefiLlama 中具有不同的表示形式（即，两个不同的标识符）。
- 该项目有两个不同的代币，一个原生于 Moonbeam，另一个原生于 Moonriver。

否则，可以使用任一选项。

### 设置项目文件夹结构 {: #set-up-the-file-structure }

DApp 目录中列出的每个项目的所有配置都存储在 `projects` 文件夹中。

要开始使用，您必须有一个唯一且正确标识您的项目的名称。使用您的项目名称，您可以采取以下步骤：

1. 使用您唯一的项目名称为您的项目创建一个新目录。
2. 在您的项目目录中，您需要创建：
    1. 项目数据文件是一个 JSON 文件，用于定义所有项目数据，并包含对存储在 `logos` 和 `screenshots` 文件夹中的图像的引用。您可以使用的字段列表（带有描述）在下一节中概述。该文件必须使用您唯一的项目名称命名。
    2. 一个 `logos` 文件夹，用于存储您的项目徽标图像。
    3. （可选）一个 `screenshots` 文件夹，用于存储项目的屏幕截图。

??? code "示例文件夹结构"

    text
    --8<-- 'code/learn/dapps-list/folder-structure.md'
    

![GitHub 基于浏览器的编辑器上显示的文件结构](/images/learn/dapps-list/directory-4.webp)

有了基础文件结构，您就可以填写项目提交所需的必要信息了。

### 将信息添加到项目数据文件 {: #add-information }

您的项目数据文件是您添加项目所有信息的地方。该文件允许以下顶级属性：

| <div style="width:10vw">属性</div> |                         类型                          |                                                                                                                                                                      描述                                                                                                                                                                       |
|:--------------------------------------:|:-----------------------------------------------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|                  `id`                  |                        字符串                         |                                                                                               Moonbeam DApp 目录中 dApp 的唯一标识符。它应该是一个唯一的、人类可读的字符串，代表这个项目。例如，`my-project`                                                                                                |
|                 `slug`                 |                        字符串                         |                                                  在某些第三方来源中使用的标识符。 特别是，如果项目在 DefiLlama 中列出，则此值应设置为 DefiLlama 标识符。 有关更多信息，请参阅 [配置 TVL 的数据源](#configure-tvl) 部分                                                  |
|                 `name`                 |                        字符串                         |                                                                                                                                      项目名称，因为它将显示在 DApp 目录中。 例如，`My Project`                                                                                                                                      |
|               `category`               |                        字符串                         |                                         项目应关联的类别。 一个项目只能有一个类别，它对应于 DApp 目录左侧导航栏中的类别列表。 有关接受的值列表，请参阅[类别和标签](#category-and-tags)部分                                          |
|             `coinGeckoId`              |                        字符串                         |                                              如果项目在 CoinGecko 上列出了代币，则此属性应具有与给定代币对应的 **API ID** 值。 有关更多信息，请参阅 [配置项目代币信息的数据源](#project-token-information) 部分                                               |
|                `chains`                |                   字符串数组                    |                                                                                                               项目部署到的 Moonbeam 生态系统链的列表。 当前的有效值为 `moonbeam` 和 `moonriver`                                                                                                                |
|                 `logo`                 |            字符串到 JSON 对象的映射             |                                                                                                     与此项目关联并存储在 `logos` 目录中的徽标图像文件的映射。 有关更多信息，请参阅 [徽标](#logos) 部分                                                                                                     |
|           `shortDescription`           |                        字符串                         |                                                                                                      在目录中浏览 dapps 时，在显示卡中使用的项目简短描述。 这应保持在 80 个字符以下                                                                                                      |
|             `description`              |                        字符串                         |                                                                               项目详细信息页面中使用的较长描述。 无法使用 Markdown 或类似格式。 可以使用 `\r\n` 使用换行符。 文本应限制为几个段落                                                                                |
|                 `tags`                 |                   字符串数组                    |                                                                       此项目适用的[标签](#category-and-tags)列表。 标签值将显示在项目详细信息中。 有关接受的值列表，请参阅[类别和标签](#category-and-tags)部分                                                                        |
|              `contracts`               |            合约 JSON 对象数组            |                                                     项目合约列表。 目前，这仅用于代币合约。 构成协议的智能合约列表从 Moonscan 外部获取。 有关更多信息，请参阅 [合约](#contracts) 部分                                                      |
|                 `urls`                 |       字符串（名称）到字符串（URL）的映射        |                                                                                                        项目关联的网站和社交媒体的 URL 映射。 有关接受的属性列表，请参阅 [URL](#urls) 部分                                                                                                         |
|             `screenshots`              | 字符串（大小）到图像 JSON 对象的映射数组 |                                                                                        与此项目关联并存储在 `screenshots` 目录中的屏幕截图图像文件的列表。 有关更多信息，请参阅 [屏幕截图](#screenshots) 部分                                                                                         |
|         `projectCreationDate`          |                          整数                          |                                                                                                                                   创建项目的日期。 用于在 DApp 目录中进行排序                                                                                                                                    |

??? code "示例项目数据文件"

    
    --8<-- 'code/learn/dapps-list/project-data-file.json'

#### 类别和标签 {: #category-and-tags }

类别是项目的主要分类。一个项目只能归入一个类别，但可以有多个标签。请务必仔细选择最适合您项目的类别，以确保可以轻松找到它。任何辅助分类都可以作为标签包含在内。

目前支持的 `category` 值有：

text
--8<-- 'code/learn/dapps-list/categories.md'

目前支持的 `tag` 值有：

text
--8<-- 'code/learn/dapps-list/tags.md'

#### URLs {: #urls }

`urls` 属性名称/值对用于项目提供其网站、社交媒体等的链接。

下表列出了支持的 `urls` 属性：

| 属性名称 |                                                    描述                                                     |                     示例                     |
|:-------------:|:------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------:|
|   `website`   |                                          项目的主要网站                                          |            https://moonbeam.network/            |
|     `try`     | 用户如果想试用 dApp 应该访问的 URL。通常，此页面会有一个启动 dApp 的链接 |            https://moonbeam.network/            |
|   `twitter`   |                                     项目的 X (Twitter) 个人资料                                      |       https://x.com/MoonbeamNetwork       |
|   `medium`    |                                             项目的 Medium 站点                                              |       https://medium.com/moonbeam-network       |
|  `telegram`   |                                               项目的 Telegram                                               |         https://t.me/Moonbeam_Official          |
|   `github`    |                                          项目的 GitHub 存储库                                           | https://github.com/moonbeam-foundation/moonbeam |
|   `discord`   |                                               项目的 Discord                                                |       https://discord.com/invite/PfpUATX        |

属性名称/值对的格式应遵循 JSON 标准，例如：

--8<-- 'code/learn/dapps-list/urls.json'

#### 徽标 {: #logos }

主项目数据文件的 `logos` 属性是一个将图像大小（即 `small`，`large`，`full`）映射到相应图像 JSON 对象的映射。图像 JSON 对象包含给定图像的显示属性。

下表列出了图像 JSON 对象的属性：

| 属性       | 类型   |                                                              描述                                                                |
| :--------: | :----: | :------------------------------------------------------------------------------------------------------------------------------: |
| `fileName` | 字符串 |                                       存储在 `logos` 目录中的图像文件的名称（未限定）                                        |
|  `width`   |  整数  |                                                        徽标图像的宽度（以像素为单位）                                                         |
|  `height`  |  整数  |                                                        徽标图像的高度（以像素为单位）                                                         |
| `mimeType` | 字符串 | 文件的标准 [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types){target=\_blank}。例如，`"image/jpeg"` |

目前，仅使用 `small` 大小，并且小型徽标的尺寸应为 40x40 像素。

这是一个示例，显示了提供 `small` 和 `full` 徽标的 `logo` 属性的结构：

--8<-- 'code/learn/dapps-list/logo.json'

#### 屏幕截图 {: #screenshots }

主项目数据文件的 `screenshots` 属性是一个映射数组。数组中的每个映射对应一个特定的屏幕截图。

但是，应为每个屏幕截图提供不同大小的图像，以便在不同的上下文中使用不同的大小（例如，缩略图与全尺寸图像）。因此，对于每个屏幕截图，都有一个图像大小的映射（即 `small`、`large`、`full`）到相应的图像 JSON 对象。图像 JSON 对象包含给定图像的显示属性。

下表列出了图像 JSON 对象的属性：

|  属性  |  类型  |                                                                       描述                                                                        |
|:----------:|:------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `fileName` | 字符串 |                                      存储在 `screenshots` 目录中的图像文件的名称（不合格）                                      |
|  `width`   |  整数   |                                                          徽标图像的宽度（以像素为单位）                                                           |
|  `height`  |  整数   |                                                          徽标图像的高度（以像素为单位）                                                          |
| `mimeType` | 字符串 | 文件的标准 [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types){target=_blank}。例如，`"image/jpeg"` |

以下示例显示了两个屏幕截图（`screenshot1` 和 `screenshot2`）的 `screenshot` 属性的结构：

--8<-- 'code/learn/dapps-list/screenshots.json'

#### 合约 {: #contracts }

项目合约列表。目前，这仅用于代币合约。

构成该协议的智能合约来自 [Moonscan](https://moonscan.io){target=\_blank} 基于标签，因此不需要在此处列出。如果您没有正确标记您的合约，或者不确定它们是否按照 Moonbeam 社区标准进行标记，请参阅 [配置活跃用户和交易量的数据源](#configure-active-users) 部分。

下表列出了在合约 JSON 对象中找到的属性：

|  属性  |  类型  |                                  描述                                  |
|:----------:|:------:|:-----------------------------------------------------------------------------:|
| `contract` | String |                      智能合约的地址                       |
|  `chain`   | String | 合约部署在其上的链（即，`moonbeam` 或 `moonriver`） |
|   `name`   | String |                           合约的名称                            |

这是一个 `contracts` 数组，其中包含 WGLMR 代币的单个智能合约：

### 提交拉取请求 {: #submit-a-pull-request }

在您填充项目数据文件并添加徽标和屏幕截图后，您应该可以提交拉取请求了。

![GitHub 基于浏览器的编辑器上添加的所有项目文件](/images/learn/dapps-list/directory-5.webp)

从基于 Web 的编辑器中，执行以下步骤将您的更改提交到 `app-directory-data` 存储库：

1. 单击**源代码管理**选项卡，该选项卡应显示已添加或更改了多少页面。
2. 查看“**更改**”部分下的文件。单击“**更改**”旁边的 **+** 按钮，或者在您查看每个文件时，单击文件名旁边的 **+** 按钮，将其添加到“**暂存更改**”列表中。

![在 GitHub 基于浏览器的编辑器上暂存已更改的文件](/images/learn/dapps-list/directory-6.webp)

您的所有文件现在都应位于“**暂存更改**”部分下。您只需提交并推送更改：

1. 输入描述性的提交消息，例如“添加我的项目”，确保使用您的实际项目名称。
2. 单击**提交和推送**。

![在 GitHub 基于浏览器的编辑器上提交暂存的文件](/images/learn/dapps-list/directory-7.webp)

现在您已提交更改，您需要前往 [`app-directory-data` 存储库](https://github.com/moonbeam-foundation/app-directory-data){target=_blank} 并针对 `develop` 分支打开一个拉取请求：

1. 在存储库页面的顶部，单击横幅上显示的**比较和拉取**按钮，或者
2. 如果横幅不再存在，则需要从分支下拉列表中选择您的分支。
3. 单击**贡献**下拉列表。
4. 单击**打开拉取请求**按钮。

![GitHub 上 app-directory-data 存储库的主页](/images/learn/dapps-list/directory-8.webp)

您将被带到**比较更改**页面，您需要在该页面上：

1. 确保您将您的分支合并到 `develop` 分支中，`develop` 分支是**基础**分支。
2. 添加标题。
3. 添加更改的描述。
4. 单击**创建拉取请求**。

![在 GitHub 上 app-directory-data 存储库的“比较更改”页面上提交拉取请求](/images/learn/dapps-list/directory-9.webp)

### 审核流程 {: #review-process }

提交的拉取请求将由 Moonbeam 基金会每两周审核一次。在审核期间，特别是对于新项目，基金会可能需要验证创建拉取请求的 GitHub 用户是否为贡献者和/或代表特定项目。项目加快此过程的一种方法是，如果提交者的 GitHub 帐户也是 GitHub 上项目本身的主要贡献者。或者，团队应在拉取请求评论中留言，说明我们如何与项目团队成员联系以进行验证。

如果需要进行任何更改，则会在拉取请求中添加评论。您的拉取请求获得批准后，它将被合并，并且您的项目将被添加到 Moonbeam DApp 目录中！

## 如何更新您的项目列表 {: #how-to-update-your-project-listing }

随着项目的演变，您可能需要更新项目的列表或与列表相关的图像。您可以为您的更改创建一个新分支，从根目录 `projects` 中找到并修改您现有项目的数据，并进行所需的更改。

如果您不再使用徽标或屏幕截图，请记得将其从 `logos` 或 `screenshots` 目录中删除。

完成更改后，您必须按照[提交 Pull Request](#submit-a-pull-request)部分中的相同说明进行操作，以便 Moonbeam 基金会可以[审核](#review-process)这些更改。请注意，Pull Request 会按双周审查一次，因此如果更新紧急，您可以创建一个[论坛帖子](https://forum.moonbeam.network){target=_blank}寻求帮助。

## DApp Directory API {: #dapp-directory-api }

DApp Directory 还提供了一个可查询的 API，您可以使用它将 Moonbeam 的 DApp Directory 中的数据集成到您的应用程序中。该 API 是公开的，目前不需要身份验证。该 API 的基本 URL 如下：

bash
https://apps.moonbeam.network/api/ds/v1/app-dir/

### 查询项目 {: #query-a-project}

您可以通过将 `/projects/INSERT_PROJECT_NAME` 附加到基本 URL 来检索特定项目的所有信息。如果您需要澄清项目名称，您可以省略项目名称，如下所示，以检索每个列出的项目的数据并在响应中找到该项目。

bash
https://apps.moonbeam.network/api/ds/v1/app-dir/projects

这是一个查询 StellaSwap 的 API 的示例，它返回项目描述、社交媒体信息、用户计数、相关的智能合约地址、市场数据、图像等。

bash
https://apps.moonbeam.network/api/ds/v1/app-dir/projects/stellaswap

您可以在浏览器中访问查询 URL 目录，可以使用像 Postman 这样的工具，也可以直接从命令行使用 Curl，如下所示：

bash
curl -H "Content-Type: application/json" -X GET 'https://apps.moonbeam.network/api/ds/v1/app-dir/projects/stellaswap'

??? code "查询 StellaSwap 的 API 响应"

    
    --8<-- 'code/learn/dapps-list/stellaswap.json'

### 查询类别 {: #query-a-category}

您还可以通过[类别](#category-and-tags)查询 API。 例如，您可以使用以下查询检索有关所有 NFT 项目的信息：

bash
https://apps.moonbeam.network/api/ds/v1/app-dir/projects?category=nfts

??? code "查询 NFT 项目的 API 响应"

    
    --8<-- 'code/learn/dapps-list/nfts.json'
    

以下是所有可能的类别及其各自的参数，用于查询 API。 确保使用完全按照所示的小写格式设置的参数查询 API。

| 类别  | API 参数  |
|:--------:|:-------------:|
|  桥   |   `bridges`   |
|   DAO    |     `dao`     |
|   DEX    |     `dex`     |
|   DeFi   |    `defi`     |
|  游戏  |   `gaming`    |
|  借贷  |   `lending`   |
|   NFTs   |    `nfts`     |
|  其他   |    `other`    |
|  社交  |   `social`    |
| 钱包  |   `wallets`   |

### 查询链 {: #query-a-chain}

以下查询可用于查询 Moonbeam 或 Moonriver 上列出的所有项目。请注意，DApp 目录中不支持 Moonbase Alpha 网络。

=== "Moonbeam"

    bash
    https://apps.moonbeam.network/api/ds/v1/app-dir/projects?chain=moonbeam
    

=== "Moonriver"

    bash
    https://apps.moonbeam.network/api/ds/v1/app-dir/projects?chain=moonriver
    

<div class="page-disclaimer">
    --8<-- 'text/_disclaimers/user-generated-content.md'
</div>
