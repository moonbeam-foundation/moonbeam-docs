---
title: 通过 Wormhole 实现跨链
description: 了解如何桥接资产、设置中继器，以及如何使用 Wormhole 将您的 Moonbeam DApp 连接到多个区块链上的资产和功能。
categories: GMP Providers
---


# Wormhole网络

## 介绍

[Wormhole](https://wormhole.com){target=\_blank} 是一种协议，通过称为可验证操作批准（VAA）的消息来验证和保护 Web3 的跨链通信。Wormhole 的基础设施使用户只需单击一下，即可与任何连接链上的任何资产或应用程序进行交互。Wormhole 由多重签名协议和 19 个签名[守护者](https://wormhole.com/docs/protocol/infrastructure/guardians/){target=\_blank}提供支持，允许 dApp 跨链传递任意消息。

Wormhole 由多个模块化可互换组件组成，这些组件可以独立使用，并支持由众多团队构建的越来越多的可组合应用程序。在其协议之上构建 xDapps 可以实现快速的跨链资产转移和跨链逻辑，从而实现最大的 Web3 互操作性。Wormhole 的架构包括签名守护者网络、桥接智能合约和中继器。请查看技术堆栈图以获取更多详细信息。

![Wormhole Technology Stack diagram](/images/builders/interoperability/protocols/wormhole/wormhole-1.webp)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 入门 {: #getting-started }

这里有一些资源可以帮助您开始使用 Wormhole 构建跨链应用程序：

- **[开发者文档](https://wormhole.com/docs/){target=\_blank}** - 用于技术指南
- **[Portal](https://portalbridge.com/#/transfer){target=\_blank}** - 一个用于跨链转移资产的桥接 UI

## 合约 {: #contracts }

请参阅已部署到 Moonbeam 的 Wormhole 合约列表，以及通过 Wormhole 连接到 Moonbeam 的网络。

- **MainNet 合约** - [Moonbeam](https://wormhole.com/docs/products/reference/supported-networks/#moonbeam){target=\_blank}

## 使用 Relayer 引擎设置专用 Relayer {: #setting-up-a-specialized-relayer-with-the-relayer-engine }

在本节中，您将部署一个基本的 Wormhole 连接的智能合约，并启动一个专门的 relayer 以跨链发送消息。

首先，介绍一些背景知识。VAA，或可验证的操作批准，是 Wormhole 版本的已验证的跨链消息。如果 Wormhole 的 19 个签名守护者中的 13 个验证了特定消息，则该消息将被批准并且可以在其他链上接收。与守护者网络（充当 Wormhole 协议的验证者）相邻的是网络间谍。他们不进行任何验证工作。相反，他们监视守护者网络并充当接口，允许用户和应用程序查看哪些 VAA 已被批准。

Relayer 的作用是为目标链的执行付费，并且在许多协议中，relayer 反过来由用户付费。Wormhole 尚未提供通用的 relayer，因此 Wormhole 的架构要求 dApp 开发人员创建并维护他们自己的专用 relayer（而不是拥有可以为许多不同智能合约执行的 relayer）。如果开发人员希望合约调用者支付目标链上的 gas 费用，则他们必须设计自己的系统。这可能看起来工作量更大，但它可以更精细地调整消息的处理方式。例如，relayer 可以同时将同一消息发送到多个链，这称为多播。

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备以下条件：

- [已安装MetaMask并连接到Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- [已安装Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
- 拥有一个已获得`DEV`代币的帐户。

--8<-- 'text/_common/faucet/faucet-list-item.md'

- 让同一个帐户获得来自您选择的Wormhole连接的EVM的原生货币。水龙头[在下表中](#deploying-the-wormhole-contract-with-remix-on-moonbase-alpha)

### 在 Moonbase Alpha 上使用 Remix 部署 Wormhole 合约 {:deploying-the-wormhole-contract-with-remix-on-moonbase-alpha}

要发送跨链消息，在本指南中，您需要部署和使用智能合约。连接到 Wormhole 的每个链都将具有 [Wormhole 核心桥](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank} 的某种实现，其目的是发布和验证 VAA。核心桥合约的每个实现（每个链一个）都受到守护者网络中每个守护者的监视，这就是他们知道何时开始验证消息的方式。

与其他跨链协议不同，Wormhole 不提供父智能合约供用户继承来构建。这是因为 Wormhole 的第一个链 Solana 在其智能合约中没有像 Solidity 提供的典型继承。为了保持每个链上的设计体验相似，Wormhole 让他们的 Solidity 开发人员直接与 EVM 链上的 Wormhole 核心桥智能合约交互。

您今天将部署的[智能合约](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/SimpleGeneralMessage.sol){target=\_blank} 存储在从 Wormhole 的 relayer engine 存储库中forked的 Git 存储库中。它将字符串从一个链发送到另一个链，并在通过 Wormhole 协议接收时存储字符串。要部署脚本，请将合约复制并粘贴到 Remix 中，或打开此 [Remix gist 链接](https://remix.ethereum.org/?gist=6aac8f954e245d6394f685af5d404b4b){target=\_blank}。

首先，此智能合约中的代码在某些领域（如安全性）中得到了简化。在编写用于生产的智能合约时，请查看 [Wormhole 文档](https://wormhole.com/docs/){target=\_blank}，以更好地了解标准。需要明确的是，**请勿在生产中使用以下智能合约**。

1. 转到 **Solidity Compiler** 选项卡
1. 按下 **Compile** 按钮
1. 然后，转到 Remix 的 **Deploy & Run Transactions** 选项卡
1. 将环境设置为 **Injected Web3**。 这将使用 MetaMask 作为 Web3 提供商。 确保您的 MetaMask 已连接到 Moonbase Alpha 网络

![设置智能合约部署](/images/builders/interoperability/protocols/wormhole/wormhole-2.webp)

要在每个链上进行部署，您将需要 Wormhole 核心桥的本地实例和所提及链的链 ID。 下表提供了针对少数几个 TestNet 的所有这些数据。 您可以在 Wormhole 的 [支持的网络文档](https://wormhole.com/docs/products/reference/supported-networks/){target=\_blank} 上找到其他网络的端点。 请记住，您应该仅将 EVM 用于此演示，因为为此演示设计的智能合约和 relayer 仅支持 EVM。

|                          Network & Faucet                           |            Core Bridge Address             | Wormhole Chain ID |
| :-----------------------------------------------------------------: | :----------------------------------------: | :---------------: |
| [Polygon Mumbai](https://faucet.polygon.technology){target=\_blank} | 0x0CBE91CF822c73C2315FB05100C2F714765d5c20 |         5         |
|    [Avalanche Fuji](https://faucet.avax.network){target=\_blank}    | 0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C |         6         |
|   [Fantom TestNet](https://faucet.fantom.network){target=\_blank}   | 0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7 |        10         |
|       [Sepolia](https://www.sepoliafaucet.io){target=\_blank}       | 0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78 |       10002       |
|  [Moonbase Alpha](https://faucet.moonbeam.network){target=\_blank}  | 0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901 |        16         |

1. 确保选择的合约是 **SimpleGeneralMessage**
1. 使用箭头按钮打开部署菜单
1. 在 **\_CHAINID** 输入中输入相关的链 ID
1. 在 **WORMHOLE_CORE_BRIDGE_ADDRESS** 输入中输入相关的核心桥地址
1. 按下 **transact** 按钮以启动部署交易
1. 按下 MetaMask 中的 **Confirm** 按钮以进行部署

在 Moonbase Alpha 上部署合约后，请务必复制其地址，并对连接到 Wormhole 的任何其他 [EVM TestNet](https://wormhole.com/docs/products/reference/supported-networks/){target=\_blank}之一重复该过程，以便您可以跨链发送消息。 请记住，您必须更改 MetaMask 中的网络才能部署到正确的网络。

### 将 Moonbase Alpha 的连接合约列入白名单 {:whitelisting-moonbase-alpha-connected-contract}

此时，您应该已经将相同的智能合约部署了两次。一次在 Moonbase Alpha 上，另一次在另一个 EVM 链上。

Wormhole 建议在其连接的合约中包含一个白名单系统，在尝试发送跨链消息之前，您需要在 `SimpleGeneralMessage` 中使用该系统。

要添加列入白名单的合约，您必须调用 `addTrustedAddress(bytes32 sender, uint16 _chainId)` 函数，该函数需要一个 *bytes32* 格式的地址和一个链 ID。您可以在[上表](#deploying-the-wormhole-contract-with-remix-on-moonbase-alpha)和 [Wormhole 的文档](https://wormhole.com/docs/products/reference/supported-networks/){target=\_blank}中找到链 ID。

```solidity
function addTrustedAddress(bytes32 sender, uint16 _chainId) external {
    myTrustedContracts[sender][_chainId] = true;
}
```

请注意，`sender` 参数是 `bytes32` 类型，而不是 `address` 类型。Wormhole 的 VAA 以 `bytes32` 的形式提供发射器（源）地址，因此它们以 `bytes32` 的形式存储和检查。要将 `address` 类型转换为 `bytes32`，您需要填充额外的 24 个零。这是因为 `address` 值为 20 字节，小于 `bytes32` 的 32 字节。每个字节都有 2 个十六进制字符，因此：

```
zeros to add = (32 bytes - 20 bytes) * 2 hexadecimal characters
zeros to add = 24
```

例如，如果您的连接合约的地址是 `0xaf108eF646c8214c9DD9C13CBC5fadf964Bbe293`，您将在 Remix 中输入以下内容：

```
0x000000000000000000000000af108ef646c8214c9dd9c13cbc5fadf964bbe293
```

现在使用 Remix 确保您的两个连接合约彼此信任。如果您打算来回发送消息，则必须在您已部署的两个合约上执行此操作。要在不同链上的合约之间切换，请通过 MetaMask 连接到目标网络。

1. 确保您处于**注入** **提供程序**环境中
1. 确保您使用的是正确的帐户
1. 另请检查合约是否仍为 **SimpleGeneralMessage**
1. 最后，获取目标合约的地址，并将其粘贴到**地址**输入中

![地址](/images/builders/interoperability/protocols/wormhole/wormhole-3.webp)

要添加受信任的远程地址：

1. 在已部署的合约中找到 **addTrustedAddress** 函数并将其打开
1. 当您在 Moonbase Alpha 上时，将 **sender** 设置为您部署在另一个 EVM TestNet 上的合约的格式正确的（填充了 24 个零）地址
1. 将 **\_chainId** 设置为部署另一个合约的链的 Wormhole 链 ID。之后，进行交易并在 MetaMask 中确认

当您在备用 EVM TestNet 上时，将 **sender** 设置为您部署在 Moonbase Alpha 上的合约的格式正确的（填充了 24 个零）地址。将 **\_chainId** 设置为 Moonbase Alpha 的 Wormhole 链 ID (16)。最后，进行交易并在 MetaMask 中确认。

![添加受信任的地址](/images/builders/interoperability/protocols/wormhole/wormhole-4.webp)

在本节中，您应该已经在两个链上发送了两个交易，以将地址列入两个合约的白名单。之后，您应该可以连接的合约之间发送消息。

### 设置监听器组件 {:setting-up-the-listener-component}

现在来分解中继器的自定义代码和可配置组件。 监听器组件，顾名思义，用于侦听间谍节点的相关消息。 要定义相关消息是什么，您必须编辑配置文件。

在 `plugins/simplegeneralmessage_plugin/config/devnet.json` 中，存在一个名为 `spyServiceFilters` 的数组。 此数组中的每个对象都将合约的 VAA 列入白名单，以便与中继器相关。 该对象包含一个 `chainId` (Wormhole 链 ID) 和一个 `emitterAddress`。 例如，在下图中，第一个对象将监视由 `0x428097dCddCB00Ab65e63AB9bc56Bb48d106ECBE` 在 Moonbase Alpha 上发送的 VAA (Wormhole 链 ID 为 16)。

请务必编辑 `spyServiceFilters` 数组，以便中继器侦听您部署的两个合约。

在 `simplegeneralmessage_plugin` 文件夹中，打开 `src/plugin.ts`。 此文件包含中继器的监听器和执行器组件的插件代码，但注释应清楚地表明哪些函数与哪个组件相关。 文件的片段显示在下面，您应该按照操作进行，但如果您没有这样做，则可以在 [其 GitHub 存储库](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=\_blank} 中访问整个文件。

查看下面的 `getFilters()` 函数。 注意到有什么熟悉的东西吗？ `spyServiceFilters` 对象被注入到 `getFilters()` 所属的插件类中。 请注意，没有进行任何过滤，这只是过滤器的准备工作。 VAA 的实际过滤发生在 `relayer-engine` 包中，该包使用此 `getFilters()` 函数来了解要过滤的内容。

如果开发人员想要向过滤器添加其他逻辑，他们可以在此处添加，但就您的目的而言，仅列出一些硬编码的地址即可。

```ts
 // How the relayer injects the VAA filters.
 // This is the default implementation provided by the dummy plugin.
 getFilters(): ContractFilter[] {
   if (this.pluginConfig.spyServiceFilters) {
     return this.pluginConfig.spyServiceFilters;
   }
   this.logger.error('Contract filters not specified in config');
   throw new Error('Contract filters not specified in config');
 }
```

过滤后，监听器需要使用下面的 `consumeEvent(vaa, stagingArea)` 函数将工作流数据写入 Redis 数据库。

工作流只是执行器需要从监听器获得的数据，以便进行正确的执行。 在这种情况下，添加到工作流的唯一信息是接收 VAA 的时间和 VAA 本身中的已解析数据。 如果开发人员想要向工作流添加更多相关信息，他们可以在 `workflowData` 对象中执行此操作。

`nextStagingArea` 对象是一种让已使用事件（已过滤的 VAA）相互影响的方式。 例如，如果开发人员想要将两个 VAA 打包到一个工作流中，他们不会每次都返回 `workflowData`。

```ts
 // Receives VAAs and returns workflows.
  async consumeEvent(
    vaa: ParsedVaaWithBytes,
    stagingArea: StagingAreaKeyLock,
  ): Promise<
    |
    {
      workflowData: WorkflowPayload;
      workflowOptions?: WorkflowOptions;
    }
    |
    undefined
  > {
    this.logger.debug(`VAA hash: ${vaa.hash.toString('base64')}`);

    return {
      workflowData: {
        vaa: vaa.bytes.toString('base64'),
      },
    };
  }
```

这就是监听器组件所需的一切。 幸运的是，大部分代码都隐藏在 `relayer-engine` 包中的用户面前。

如果您还记得组件列表，则第三个是 Redis 数据库组件。 与数据库有关的大部分代码都隐藏在用户面前，因为 `relayer-engine` 包将从中写入和读取数据，然后将任何相关数据注入回插件代码中。 要运行 Redis 数据库，只需在父目录中运行以下命令：

```bash
npm run redis
```

### 使用 Wormhole 从 Moonbase 发送跨链消息 {: #send-message-from-moonbase }

现在，要发送跨链消息，您只需要调用 `sendMessage(string memory message, address destAddress, uint16 destChainId)` 函数。

使用 Remix 接口。此示例将向 Fantom TestNet 发送跨链消息，但您可以将 `destChainId` 替换为您想要的任何 EVM。检查以下事项：

1. 环境为网络 1287 (Moonbase Alpha) 上的 **Injected Provider**
1. 您的钱包中有来自 [水龙头](https://faucet.moonbeam.network){target=\_blank} 的大量资金，以支付源链和目标链上的交易 gas 成本
1. 在 **sendMessage** 部分的 **message** 输入中放入您选择的简短消息（在本例中为“this is a message”）
1. 将目标链上 SimpleGeneralMessage 实例的地址放入 **destAddress** 输入中
1. 将目标链的 Wormhole 链 ID 放入 **sendMessage** 部分的 **destChainId** 输入中
1. 完成所有这些操作后，交易执行并在 MetaMask 中确认它

![发送交易](/images/builders/interoperability/protocols/wormhole/wormhole-5.webp)

几秒钟到一分钟后，跨链消息应通过您在本地计算机上托管的中继器正确中继。

--8<-- 'code/builders/interoperability/protocols/wormhole/terminal/send.md'

## Moonbeam 路由流动性集成 {: #moonbeam-routed-liquidity-integration }

Wormhole 将通过 Moonbeam 路由流动性 (MRL) 计划为平行链提供流动性。此计划允许通过 Moonbeam 网络发送流动性，从而将来自 Wormhole 连接链的流动性一键转移到平行链钱包。
[MRL](/builders/interoperability/mrl/){target=\_blank} 利用 [GMP 预编译](/builders/ethereum/precompiles/interoperability/gmp/){target=\_blank}，其文档解释了应如何构造跨链消息以正确使用预编译。

--8<-- 'text/_disclaimers/third-party-content.md'
