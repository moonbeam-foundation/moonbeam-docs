---
title: Moonbeam API 提供者和终端节点
description: 使用受支持的 API 提供者之一连接到公共终端节点，或者为 Moonbeam 基础网络创建自定义 JSON-RPC 和 WSS 终端节点。
categories: JSON-RPC APIs, Reference
---

# 网络端点

## 公共端点 {: #public-endpoints }

基于 Moonbeam 的网络有两个端点可供用户连接：一个用于 HTTPS，另一个用于 WSS。

本节中的端点仅用于开发目的，不适合在生产应用程序中使用。

如果您正在寻找适合生产使用的 API 提供商，您可以查看本指南的 [端点提供商](#endpoint-providers) 部分。

### Moonbeam {: #moonbeam }

--8<-- 'text/builders/get-started/endpoints/moonbeam.md'

### Moonriver {: #moonriver }

--8<-- 'text/builders/get-started/endpoints/moonriver.md'

### Moonbase Alpha {: #moonbase-alpha }

--8<-- 'text/builders/get-started/endpoints/moonbase.md'

## RPC端点提供商 {: #endpoint-providers }

您可以使用以下任何API提供商创建适合开发或生产用途的自定义端点：

- [1RPC](#1rpc)
- [Chainstack](#chainstack)
- [dRPC NodeCloud](#drpc)
- [Dwellir](#dwellir)
- [GetBlock](#getblock)
- [OnFinality](#onfinality)
- [UnitedBloc](#unitedbloc)

### 1RPC {: #1rpc}

[1RPC](https://www.1rpc.io){target=_blank} 是一个免费且私密的 RPC 中继，通过防止数据收集、用户跟踪和其他方的网络钓鱼企图来保护用户隐私。它通过分布式中继将用户请求隧道传输到其他 RPC 提供商，同时使用安全 enclave 技术防止跟踪用户元数据，例如 IP 地址、设备信息和钱包可链接性。

创建 1RPC 的目的是为了成为区块链基础设施社区的一项开放倡议。 他们的动力来自于帮助构建更好的 Web3 的共同利益使命，并鼓励任何重视用户隐私的人加入到这项开放合作中来。

前往 [1RPC](https://www.1rpc.io){target=_blank} 官方网站进行设置！

![1RPC](/images/builders/get-started/endpoints/endpoints-1.webp)

### Chainstack {: #chainstack }

[Chainstack](https://chainstack.com/){target=_blank}，Web3 基础设施提供商，为 Moonbeam 提供免费和付费的端点。免费的开发者计划起始于每月 300 万次请求和每秒 25 次请求 (RPS)。您可以使用付费计划轻松扩展。

要开始使用免费的开发者计划端点，请使用电子邮件或任何社交帐户（如 GitHub 或 X (Twitter)）注册。

1. 访问 [Chainstack](https://console.chainstack.com/){target=_blank}
2. 注册
3. 部署 Moonbeam 节点

![Chainstack](/images/builders/get-started/endpoints/endpoints-2.webp)

### dRPC 节点云 {: #drpc }

dRPC.org 提供公共和付费的 [Moonbeam RPC](https://drpc.org/chainlist/moonbeam-mainnet-rpc){target=_blank} 端点，从而提供与区块链节点的高效、低延迟连接。付费层包括更高的请求限制、更低的延迟以及用于优化性能的高级分析。

如何使用 dRPC：

1. 在 [dRPC.org](https://drpc.org/){target=_blank} 注册或登录
2. 在控制面板中，创建一个 API 密钥
3. 单击密钥并选择所需的端点

如需全天候支持，请加入 dRPC 的 [Discord](https://drpc.org/discord){target=_blank}。

### Dwellir {: #dwellir }

[Dwellir](https://www.dwellir.com){target=_blank} 是一种区块链运营服务，可确保全球可扩展性、低延迟和 99.99% 的正常运行时间保证，无论您的业务位于何处，都能提供快速可靠的节点运营。公共端点服务是在全球地理分布的裸机服务器。由于该服务是公共的，因此无需注册或管理 API 密钥。

要开始使用开发者端点或专用节点，您需要联系我们：

1. 访问 [Dwellir](https://www.dwellir.com/contact){target=_blank}
2. 提交您的**电子邮件**和您的节点请求

![Dwellir](/images/builders/get-started/endpoints/endpoints-3.webp)

### GetBlock {: #getblock }

[GetBlock](https://getblock.io){target=_blank} 是一项服务，可提供对 Moonbeam 和 Moonriver 的即时 API 访问，并通过共享和专用节点提供。[专用节点](https://docs.getblock.io/getting-started/plans-and-limits/choosing-your-plan#dedicated-nodes){target=_blank} 提供对私有服务器的访问，具有快速的速度且没有速率限制。[共享节点](https://docs.getblock.io/getting-started/plans-and-limits/choosing-your-plan#shared-nodes){target=_blank} 提供免费的基于 API/附加组件的端点，以便您快速开始使用。

要开始使用 GetBlock，您可以转到 [GetBlock 注册页面](https://account.getblock.io/sign-up){target=_blank} 并注册一个新帐户。然后，从您的帐户**仪表板**中，您可以查看和管理现有多个协议的端点，还可以创建新的端点。

创建一个新的基于 API/附加组件的端点非常简单，您只需：

1. 从可用区块链的列表中填写所需协议的信息
2. 选择您希望端点指向的网络（**Mainnet**、**Testnet** 等）
3. 从 **API/附加组件**下拉列表中选择 **JSON-RPC**
4. 单击最右侧的 **Get** 按钮，您就可以开始了！

![GetBlock](/images/builders/get-started/endpoints/endpoints-4.webp)

### OnFinality {: #onfinality }

[OnFinality](https://onfinality.io/en){target=_blank} 为客户提供基于免费 API 密钥的端点，以代替公共端点。此外，OnFinality 还提供付费服务层级，与免费层级相比，这些层级提供更高的速率限制和更高的性能。您还可以获得更深入的应用程序使用情况分析。

要创建自定义 OnFinality 端点，请访问 [OnFinality](https://onfinality.io/en){target=_blank} 并注册，或者如果您已经注册，您可以直接登录。从 OnFinality **控制面板**，您可以：

1. 单击 **API 服务**
2. 从下拉列表中选择网络
3. 您的自定义 API 端点将自动生成

![OnFinality](/images/builders/get-started/endpoints/endpoints-5.webp)

### UnitedBloc {: #unitedbloc }

[UnitedBloc](https://medium.com/unitedbloc/unitedbloc-rpc-c84972f69457){target=_blank} 是来自 Moonbeam 和 Moonriver 的社区收集者的集合。为了给社区提供价值，他们为 Moonbeam、Moonriver 和 Moonbase Alpha 网络提供公共 RPC 服务。

公共端点服务由八个地理位置分散的裸机服务器提供，这些服务器通过 GeoDNS 进行全局负载均衡，并通过 NGINX 进行区域负载均衡。由于该服务是公共的，因此无需注册或管理 API 密钥。

参与此倡议的收集者是：

 - Blockshard (CH)
 - BloClick (ES)
 - BrightlyStake (IN)
 - CertHum (US)
 - GPValidator (PT)
 - Hetavalidation (AU)
 - Legend (AE)
 - PathrockNetwork (DE)
 - Polkadotters (CZ)
 - SIK | crifferent.de (DE)
 - StakeBaby (GR)
 - StakeSquid (GE)
 - TrueStaking (US)

他们还提供一个[公共 Grafana 仪表板](https://monitoring.unitedbloc.com:3030/public-dashboards/7444d2ab76ee45eda181618b0f0ecb98?orgId=1){target=_blank}，其中包含一些很酷的指标。

查看[公共端点部分](#public-endpoints)以获取相关 URL。您可以通过他们的 [Telegram 频道](https://t.me/+tRvy3z5-Kp1mMGMx){target=_blank} 与他们联系，或在其 [博客文章页面](https://medium.com/unitedbloc/unitedbloc-rpc-c84972f69457){target=_blank} 上阅读有关其倡议的更多信息。

## 使用 RPC 端点提供程序进行延迟加载 {: #lazy-loading-with-RPC-Endpoint-Providers }

通过延迟加载，Moonbeam 节点可以在后台下载网络状态的同时运行，从而无需等待完全同步即可使用。要使用延迟加载启动 Moonbeam 节点，您需要[下载 Moonbeam 发布二进制文件](/node-operators/networks/run-a-node/systemd/#the-release-binary){target=_blank}或[编译二进制文件](/node-operators/networks/run-a-node/compile-binary/#compile-the-binary){target=_blank}。您可以使用以下标志激活延迟加载：

`--lazy-loading-remote-rpc 'INSERT-RPC-URL'`

延迟加载是高度资源密集型的，需要大量的 RPC 请求才能运行。为了避免受到限制，建议您使用[专用端点](#endpoint-providers)（即带有 API 密钥的端点），而不是公共端点。如果您使用带有公共端点的延迟加载，则可能会受到速率限制。使用此功能启动节点后，您将看到如下输出：

--8<-- 'code/node-operators/networks/run-a-node/terminal/lazy-loading.md'

### 使用延迟加载覆盖状态

默认情况下，您不会在终端中看到详细的日志记录。要覆盖此设置并显示延迟加载日志，您可以将以下标志添加到启动 Moonbeam 节点的命令中：`-l debug`。您可以使用以下可选参数进一步自定义延迟加载功能的使用：

- **`--lazy-loading-block`** - 指定一个区块哈希，从中开始加载数据。如果未提供，将使用最新的区块
- **`--lazy-loading-delay-between-requests`** - 使用延迟加载时，RPC 请求之间的延迟（以毫秒为单位）。此参数控制连续 RPC 请求之间等待的时间量。这有助于管理请求速率并避免服务器负载过大。默认值为 `100` 毫秒
- **`--lazy-loading-max-retries-per-request`** - 使用延迟加载时，RPC 请求的最大重试次数。默认值为 `10` 次重试
- **`--lazy-loading-runtime-override`** - WASM 文件的路径，用于在派生时覆盖运行时。如果未提供，它将从正在派生的区块中获取运行时
- **`--lazy-loading-state-overrides`** - JSON 文件的路径，其中包含派生时要应用的状态覆盖

#### 简单的存储项覆盖

状态覆盖文件应定义您要覆盖的相应托盘、存储项和值，如下所示：

[
 {
     "pallet": "System",
     "storage": "SelectedCandidates",
     "value": "0x04f24ff3a9cf04c71dbc94d0b566f7a27b94566cac"
 }
]

#### 覆盖账户的可用余额

要覆盖特定账户的余额，您可以按照以下方式覆盖相应账户的系统 pallet 的账户存储项：

[
  {
    "pallet": "System",
    "storage": "Account",
    "key": "TARGET_ADDRESS",
    "value": "0x460c000002000000010000000600000069e10de76676d0800000000000000000040a556b0e032de12000000000000000004083a09e15c74c1b0100000000000000000000000000000000000000000000080"
  }
]

??? note "关于覆盖账户余额的详细信息"

    如上所示，覆盖账户余额可能是一个复杂的过程。但是，本指南会将其分解为易于遵循的步骤。在进行任何更改之前，您应该获取与键对应的现有值（即本例中的账户）。您可以转到 [**Polkadot.js 应用程序上的链状态**](https://polkadot.js.org/apps/?rpc=wss://wss.api.moonbeam.network#/chainstate){target=_blank}，并通过提供您要查询的账户来查询系统 pallet。提交查询后，您将获得一个可读的账户结构，如下所示：

    text
    {
      nonce: 3,142
      consumers: 2
      providers: 1
      sufficients: 6
      data: {
        free: 1,278,606,392,142,175,328,676
        reserved: 348,052,500,000,000,000,000
        frozen: 20,413,910,106,633,175,872
        flags: 170,141,183,460,469,231,731,687,303,715,884,105,728
      }
    }
    

    虽然这可以作为参考，但您要查找的信息是编码的存储键，即使不提交链状态查询也可以访问该键。在本例中，对应于系统 pallet 和所选账户 `0x3B939FeaD1557C741Ff06492FD0127bd287A421e` 的编码存储键为：

    text
    0x26aa394eea5630e07c48ae0c9558cef7b99d880ec681799c0cf30e8886371da9b882fedb4f75b055c709ec5b66b5d9933b939fead1557c741ff06492fd0127bd287a421e
    

    请注意，此编码存储键将随着任何输入更改而更改，例如查询不同的账户。然后，转到 [Polkadot.js 应用程序](https://polkadot.js.org/apps/#/chainstate/raw){target=_blank} 上的 **Raw Storage** 选项卡。输入上述存储键并提交查询。响应是 SCALE 编码的账户结构，其中的一部分包含可用余额信息，将在本示例中修改：

    text
    0x460c0000020000000100000006000000a4d92a6a4e6b3a5045000000000000000040a556b0e032de12000000000000004083a09e15c74c1b010000000000000000000000000000000000000000000080
    

    值字段中编码了相当多的数据，因为它是一个由多个值组成的复杂结构。该结构包括：

    text
    struct AccountInfo {
        nonce: u32,             // 交易计数
        consumers: u32,         // 消费者数量
        providers: u32,         // 提供者数量
        sufficients: u32,       // 充足数量
        data: AccountData {     // 余额信息
            free: u128,         // 可用余额
            reserved: u128,     // 保留余额
            frozen: u128,       // 冻结余额
            flags: u128         // 账户标志
        }
    }
    

    您可以将 SCALE 编码结构的每个部分与它所代表的 Alice 账户信息的相应部分相关联：

    text
    0x460c0000        // nonce (u32): 3,142
    02000000          // consumers (u32): 2
    01000000          // providers (u32): 1
    06000000          // sufficients (u32): 6

    a4d92a6a4e6b3a5045000000000000000
    // free (u128): 1,278,606,392,142,175,328,676

    40a556b0e032de1200000000000000000
    // reserved (u128): 348,052,500,000,000,000,000

    4083a09e15c74c1b01000000000000000
    // frozen (u128): 20,413,910,106,633,175,872

    00000000000000000000000000000080
    // flags (u128): 170,141,183,460,469,231,731,687,303,715,884,105,728
    

    请记住，这些值是小端编码的。要将十六进制小端编码值转换为十进制，您可以使用 [Substrate Utilities 转换器](https://www.shawntabrizi.com/substrate-js-utilities/){target=_blank}，使用 **Balance to Hex (Little Endian)** 转换器。

    在本示例中，现有的可用余额 `1,278,606,392,142,175,328,676` Wei 或大约 `1278.60` DEV 是 `a4d92a6a4e6b3a5045`。以下示例会将值更改为 `500,000` DEV，即 `500,000,000,000,000,000,000,000` Wei 或 `0x000080d07666e70de169` 编码为十六进制小端值。正确填充以适合 SCALE 编码的存储值时，它变为 `69e10de76676d08000000000000000000`，因此该表现在如下所示：

    text
    0x460c0000        // nonce (u32): 3,142
    02000000          // consumers (u32): 2
    01000000          // providers (u32): 1
    06000000          // sufficients (u32): 6

    69e10de76676d08000000000000000000
    // free (u128): 500,000,000,000,000,000,000,000

    40a556b0e032de1200000000000000000
    // reserved (u128): 348,052,500,000,000,000,000

    4083a09e15c74c1b01000000000000000
    // frozen (u128): 20,413,910,106,633,175,872

    00000000000000000000000000000080
    // flags (u128): 170,141,183,460,469,231,731,687,303,715,884,105,728
    

    因此，SCALE 编码的覆盖值如下：

    text
    0x460c000002000000010000000600000069e10de76676d0800000000000000000040a556b0e032de12000000000000000004083a09e15c74c1b0100000000000000000000000000000000000000000000080
    

    您现在可以在 `state-overrides.json` 文件中指定 SCALE 编码的覆盖值，如下所示：

    
    [
      {
        "pallet": "System",
        "storage": "Account",
        "key": "0x3b939fead1557c741ff06492fd0127bd287a421e",
        "value": "0x460c000002000000010000000600000069e10de76676d0800000000000000000040a556b0e032de12000000000000000004083a09e15c74c1b0100000000000000000000000000000000000000000000080"
      }
    ]
    

    要使用余额状态覆盖运行延迟加载，您可以使用以下命令：

    bash
    --lazy-loading-remote-rpc 'INSERT_RPC_URL' --lazy-loading-state-overrides ./state-overrides.json

#### 覆盖 ERC-20 代币余额

要覆盖 ERC-20 代币余额，请在 EVM 的 AccountStorages 中找到存储给定代币合约和帐户的 `balanceOf` 数据的存储槽。此存储槽由代币合约的 H160 地址和相应的 H256 存储密钥确定。获得此槽后，在 `state-overrides.json` 文件中指定新的余额值以实现覆盖。

在下面的示例中，我们将帐户 `0x3b939fead1557c741ff06492fd0127bd287a421e` 的 [Wormhole USDC 合约 (`0x931715FEE2d06333043d11F658C8CE934aC61D0c`)](https://moonscan.io/address/0x931715FEE2d06333043d11F658C8CE934aC61D0c){target=_blank} 的代币余额覆盖为 5,000 美元 USDC。由于 Wormhole USDC 使用 6 位小数，因此 5,000 美元对应于整数形式的 `5000000000`，即十六进制的 `0x12a05f200`。

[
    {
        "pallet": "EVM",
        "storage": "AccountStorages",
        "key": [
            "0x931715FEE2d06333043d11F658C8CE934aC61D0c",
            "0x8c9902c0f94ae586c91ba539eb52087d3dd1578da91158308d79ff24a8d4f342"
        ],
        "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
    }
]

您可以使用以下脚本计算要覆盖的帐户的精确存储槽：

js
import { ethers from 'ethers';

function getBalanceSlot(accountAddress) {
  // Convert address to bytes32 and normalize
  const addr = ethers.zeroPadValue(accountAddress, 32);

  // CAUTION! The storage slot used here is 5, which
  // is specific to Wormhole contracts
  // The storage slot index for other tokens may vary
  const packedData = ethers.concat([
    addr,
    ethers.zeroPadValue(ethers.toBeHex(5), 32),
  ]);

  // Calculate keccak256
  return ethers.keccak256(packedData);
}

// Example usage
const address = 'INSERT_ADDRESS';
console.log(getBalanceSlot(address));

您可以将相同的过程应用于其他 ERC-20 代币合约。以下部分演示了使用各种 ERC-20 代币覆盖 `0x3B939FeaD1557C741Ff06492FD0127bd287A421e` 帐户。请记住，每当您切换到其他代币时，请更新 H160 代币合约地址。此外，您需要为要覆盖其余额的每个不同帐户重新计算 H256 存储槽。

??? code "示例：覆盖 Wormhole BTC 代币余额"

    
    [
        {
            "pallet": "EVM",
            "storage": "AccountStorages",
            "key": [
                "0xE57eBd2d67B462E9926e04a8e33f01cD0D64346D",
                "0x8c9902c0f94ae586c91ba539eb52087d3dd1578da91158308d79ff24a8d4f342"
            ],
            "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
        }
    ]
    

??? code "示例：覆盖 Wormhole ETH 代币余额"

    
    [
        {
            "pallet": "EVM",
            "storage": "AccountStorages",
            "key": [
                "0xab3f0245B83feB11d15AAffeFD7AD465a59817eD",
                "0x8c9902c0f94ae586c91ba539eb52087d3dd1578da91158308d79ff24a8d4f342"
            ],
            "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
        }
    ]
    

??? code "示例：覆盖 WELL 代币余额"

    因为 [WELL 代币](https://moonbeam.moonscan.io/token/0x511ab53f793683763e5a8829738301368a2411e3){target=_blank} 不使用代理实现合约，所以存储槽计算有所不同。余额映射位于槽 `1`，而不是槽 `5`。您可以使用以下脚本确定要覆盖的您自己的帐户的 WELL 代币余额的精确存储槽：

    js
    import { ethers from 'ethers';

    function getBalanceSlot(accountAddress) {
      // Convert address to bytes32 and normalize
      const addr = ethers.zeroPadValue(accountAddress, 32);

      // Caution! The storage slot index used here is 1
      // The storage slot index for other tokens may vary
      const packedData = ethers.concat([
        addr,
        ethers.zeroPadValue(ethers.toBeHex(1), 32),
      ]);

      // Calculate keccak256
      return ethers.keccak256(packedData);
    }

    // Example usage
    const address = 'INSERT_ADDRESS';
    console.log(getBalanceSlot(address));
    

    因此，存储覆盖将是：

    
    [
        {
            "pallet": "EVM",
            "storage": "AccountStorages",
            "key": [
                "0x511aB53F793683763E5a8829738301368a2411E3",
                "0x728d3daf4878939a6bb58cbc263f39655bb57ea15db7daa0b306f3bf2c3f1227"
            ],
            "value": "0x000000000000000000000000000000000000000000000000000000012a05f200"
        }
    ]

## Tracing RPC 端点供应商 {: #tracing-providers }

通过 Tracing RPC 端点，您可以访问非标准的 RPC 方法，例如属于 Geth 的 `debug` 和 `txpool` API 以及 OpenEthereum 的 `trace` 模块的方法。要查看 Moonbeam 上支持的用于调试和追踪的非标准 RPC 方法列表，请参阅[调试 API 和追踪模块](/builders/ethereum/json-rpc/debug-trace/){target=_blank} 指南。

以下供应商提供 tracing RPC 端点：

- [OnFinality](#onfinality-tracing)

### OnFinality {: #onfinality-tracing }

[OnFinality](https://onfinality.io/en){target=_blank} 的 Trace API 可用于快速开始在 Moonbeam 和 Moonriver 上跟踪和调试交易。它仅适用于 [Growth 和 Ultimate 计划](https://onfinality.io/en/pricing){target=_blank} 的用户。

要使用 Trace API，您只需从您的 [私有 RPC 端点](#onfinality) 调用您选择的跟踪方法。有关支持的网络和跟踪方法的列表，请查看 [OnFinality 的 Trace API 文档](https://documentation.onfinality.io/support/trace-api#TraceAPI-SupportedNetworks){target=_blank}。

请注意，如果您要跟踪历史区块，建议您使用自己的专用跟踪节点来回填任何数据，然后在您赶上进度后，您可以切换到使用 Trace API。您可以查看 [如何在 OnFinality 上为 Moonbeam 部署跟踪节点](https://onfinality.medium.com/how-to-deploy-a-trace-node-for-moonbeam-on-onfinality-85683181d290){target=-_blank} 这篇文章，以获取有关如何启动您自己的专用跟踪节点的更多信息。
