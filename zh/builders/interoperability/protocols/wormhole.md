---
title: 通过 Wormhole 实现跨链
description: 了解如何桥接资产、设置中继器，以及如何使用 Wormhole 将您的 Moonbeam DApp 连接到多个区块链上的资产和功能。
categories: GMP Providers
---

# Wormhole 网络

## 简介

[Wormhole](https://wormhole.com){target=_blank} 是一种通过称为可验证操作批准 (VAA) 的消息来验证和保护 Web3 跨链通信的协议。Wormhole 的基础设施使 dApp 用户只需单击一下即可与任何连接链上的任何资产或应用程序进行交互。Wormhole 由多重签名方案协议和 19 个签名[守护者](https://wormhole.com/docs/protocol/infrastructure/guardians/){target=_blank}提供支持，允许 dApp 跨链传递任意消息。

Wormhole 由多个模块化交换组件组成，这些组件可以独立使用，并且支持由众多团队构建的越来越多的可组合应用程序。在其协议之上构建 xDapp 可以实现快速的跨链资产转移和跨链逻辑，从而实现最大的 Web3 互操作性。Wormhole 的架构包括签名守护者网络、桥接智能合约和中继器。请查看技术堆栈图以了解更多详细信息。

![Wormhole 技术堆栈图](/images/builders/interoperability/protocols/wormhole/wormhole-1.webp)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## 入门 {: #getting-started }

这里有一些资源可以帮助您开始使用 Wormhole 构建跨链应用程序：

- **[开发者文档](https://wormhole.com/docs/){target=_blank}** - 用于技术指南
- **[Portal](https://portalbridge.com/#/transfer){target=_blank}** - 一个桥接 UI，用于跨链转移资产

## 合约 {: #contracts }

查看已部署到 Moonbeam 的 Wormhole 合约列表，以及通过 Wormhole 连接到 Moonbeam 的网络。

- **MainNet 合约** - [Moonbeam](https://wormhole.com/docs/products/reference/supported-networks/#moonbeam){target=_blank}

## 使用中继器引擎设置专用中继器 {: #setting-up-a-specialized-relayer-with-the-relayer-engine }

在本节中，您将部署一个基本的 Wormhole 连接智能合约，并启动一个专用中继器以跨链发送消息。

首先，介绍一些背景知识。VAA，或可验证的操作批准，是 Wormhole 对验证的跨链消息的版本。如果 Wormhole 的 19 个签名守护者中有 13 个验证了特定消息，则该消息将被批准，并且可以在其他链上接收。与守护者网络（充当 Wormhole 协议的验证者）相邻的是网络间谍。他们不进行任何验证工作。相反，他们监视守护者网络，并充当接口，以允许用户和应用程序查看已批准的 VAA。

中继器的作用是为目标链的执行付费，并且在许多协议中，中继器反过来由用户付费。Wormhole 尚未提供通用中继器，因此 Wormhole 的架构要求 dApp 开发人员创建和维护自己的专用中继器（而不是拥有一个可以为许多不同的智能合约执行的中继器）。如果开发人员希望让合约调用者支付目标链上的 gas 费，则他们必须设计自己的系统。这可能看起来需要更多的工作，但它可以更精细地调整消息的处理方式。例如，中继器可以同时将同一消息发送到多个链，这称为多播。

### 检查先决条件 {: #checking-prerequisites }

要学习本教程，您需要具备以下条件：

- [安装MetaMask并连接到Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- [安装Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}
- 拥有一个已用`DEV`代币充值的帐户。
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- 使同一帐户拥有来自您选择的 Wormhole 连接的 EVM 的原生货币。水龙头[在下表中](#deploying-the-wormhole-contract-with-remix-on-moonbase-alpha)

### 在 Moonbase Alpha 上使用 Remix 部署 Wormhole 合约 {:deploying-the-wormhole-contract-with-remix-on-moonbase-alpha}

要发送跨链消息，在本指南中，您需要部署和使用智能合约。连接到 Wormhole 的每个链都将具有 [Wormhole 核心桥](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=_blank} 的某种实现，其目的是发布和验证 VAA。核心桥合约的每个实现（每个链一个）都受到守护者网络中每个守护者的监视，这就是他们知道何时开始验证消息的方式。

与其他跨链协议不同，Wormhole 不提供父智能合约供用户继承和构建。这是因为 Wormhole 的第一个链 Solana 在其智能合约中没有像 Solidity 提供的典型继承。为了保持每个链上的设计体验相似，Wormhole 让他们的 Solidity 开发人员直接与 EVM 链上的 Wormhole 核心桥智能合约进行交互。

您今天要部署的 [智能合约](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/SimpleGeneralMessage.sol){target=_blank} 存储在一个 Git 存储库中，该存储库是从 Wormhole 的中继引擎存储库中 fork 而来的。它将字符串从一个链发送到另一个链，并在通过 Wormhole 的协议接收时存储字符串。要部署脚本，请将合约复制并粘贴到 Remix 中，或打开此 [Remix gist 链接](https://remix.ethereum.org/?gist=6aac8f954e245d6394f685af5d404b4b){target=_blank}。

首先，此智能合约中的代码在某些领域（如安全性）中得到了简化。在编写用于生产的智能合约时，请查看 [Wormhole 文档](https://wormhole.com/docs/){target=_blank}，以便更好地理解标准。需要明确的是，**请勿在生产中使用以下智能合约**。

1. 转到 **Solidity Compiler** 选项卡
2. 按下 **Compile** 按钮
3. 然后，转到 Remix 的 **Deploy & Run Transactions** 选项卡
4. 将环境设置为 **Injected Web3**。这将使用 MetaMask 作为 Web3 提供程序。确保您的 MetaMask 已连接到 Moonbase Alpha 网络

![设置智能合约部署](/images/builders/interoperability/protocols/wormhole/wormhole-2.webp)

要在每个链上进行部署，您将需要 Wormhole 核心桥的本地实例以及提到的链的链 ID。下表中提供了精选的 TestNets 的所有这些数据。您可以在 Wormhole 的 [支持的网络文档](https://wormhole.com/docs/products/reference/supported-networks/){target=_blank} 上找到其他网络的端点。请记住，您应该仅将 EVM 用于此演示，因为为此演示设计的智能合约和中继器仅支持 EVM。

| 网络和水龙头                                                       | 核心桥地址                                  | Wormhole 链 ID |
| :------------------------------------------------------------------: | :--------------------------------------------: | :--------------: |
| [Polygon Mumbai](https://faucet.polygon.technology){target=_blank} | 0x0CBE91CF822c73C2315FB05100C2F714765d5c20 |        5         |
|  [Avalanche Fuji](https://faucet.avax.network){target=_blank}  | 0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C |        6         |
| [Fantom TestNet](https://faucet.fantom.network){target=_blank}  | 0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7 |       10         |
|       [Sepolia](https://www.sepoliafaucet.io){target=_blank}       | 0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78 |      10002       |
| [Moonbase Alpha](https://faucet.moonbeam.network){target=_blank} | 0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901 |        16         |

1. 确保选择的合约是 **SimpleGeneralMessage**
2. 使用箭头按钮打开部署菜单
3. 在 **_CHAINID** 输入中输入相关的链 ID
4. 在 **WORMHOLE_CORE_BRIDGE_ADDRESS** 输入中输入相关的核心桥地址
5. 按下 **transact** 按钮以启动部署交易
6. 按下 MetaMask 中的 **Confirm** 按钮以进行部署

在 Moonbase Alpha 上部署合约后，请务必复制其地址，并使用连接到 Wormhole 的任何其他 [EVM TestNets](https://wormhole.com/docs/products/reference/supported-networks/){target=_blank} 之一重复该过程，以便您可以跨链发送消息。请记住，您必须在 MetaMask 中更改您的网络才能部署到正确的网络。

### Whitelisting Moonbase Alpha’s Connected Contract

### 运行 Wormhole 守护者网络间谍 {: #running-wormhole-guardian-spy }

现在您将为 Wormhole 运行 TestNet 中继器！本演练基于 Wormhole 的 [relayer-engine](https://github.com/wormhole-foundation/relayer-engine){target=_blank} GitHub 存储库，截至撰写本文时，该存储库位于提交 [`cc0aad4`](https://github.com/wormhole-foundation/relayer-engine/commit/cc0aad43787a87ecd9f0d9893d8ccf92901d7adb){target=_blank}。它处于相对活跃的开发中，这可能会导致文件夹结构的巨大变化。

克隆已专门为与 `SimpleGeneralMessage` 交互而准备的 [relayer-engine 的 fork](https://github.com/jboetticher/relayer-engine-docs-example){target=_blank}。[Docker](https://docs.docker.com/get-started/get-docker/){target=_blank} 和 [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm){target=_blank} 是运行此中继器所必需的，因此请务必将它们安装到您的设备上。

首先：设置。使用 npm 包管理器使用命令行安装依赖项（如 ethers 和 中继器引擎本身）。

```bash
npm install
cd plugins/simplegeneralmessage_plugin
npm install 
```

完成后，四处看看不同的文件夹。有三个文件夹：`src`、`relay-engine-config` 和 `plugins`。`src` 文件夹包含充当整个应用程序起点的脚本，因此它包括设置。`relay-engine-config` 包括特定于 `SimpleGeneralMessage` 智能合约的 JSON 配置文件。`plugins` 文件夹包含具有与 `SimpleGeneralMessage` 智能合约的中继相关的逻辑的插件。

在详细介绍如何运行任何内容或任何插件脚本如何工作之前，您需要了解中继器的不同组件以及中继器的作用。

中继器过滤并接收来自守护者网络的 VAA，并对其执行“某些操作”。在本例中，中继器将过滤由守护者批准的、源自您部署的连接合约的消息，然后解析 VAA，然后确定其目的地，最后尝试在目的地执行名为 `processMyMessage(bytes32 VAA)` 的函数。重要的是要了解来自其他参与者的其他中继器可以接收此 VAA，并且其他中继器可以以他们认为合适的任何方式执行任何 VAA。

从技术角度来看，此中继器的实现有四个部分。

1. 一个非验证间谍节点，用于监视 Wormhole 守护者网络中的所有 VAA
2. 一个称为侦听器的组件，它接收间谍节点的输出，筛选出与中继器相关的输出，并将它们打包到工作流对象中
3. 一个 Redis 数据库，用于存储侦听器输出的工作流对象
4. 一个称为执行器的组件，它从数据库中弹出工作流并以某种方式处理它们（在本例中，在目标链上发送事务）

从头开始，这可能很多。幸运的是，Wormhole 提供了 `relayer-engine` 包来帮助进行设置。

最好按顺序处理这四个组件的配置和设置，因此从间谍节点开始。间谍节点使用 Docker，因此请确保 Docker 在尝试启动节点之前处于活动状态。启动 Docker 容器的命令很长，因此为了简化操作，它已作为 npm 脚本添加到存储库的父目录中。只需运行：

```bash
npm run testnet-spy
```

首先，您应该看到来自 Docker 容器启动的一些日志。然后，大量日志应该充斥控制台。这些都是通过 Wormhole TestNet 的所有 VAA，而且有很多！不用担心，您不必破译任何这些日志：代码可以为您执行此操作。让它在后台运行，并获取另一个终端实例以继续执行下一步。

--8<-- 'code/builders/interoperability/protocols/wormhole/terminal/setup-spy.md'

### 设置监听器组件 {:setting-up-the-listener-component}

现在来分解中继器的自定义代码和可配置组件。监听器组件，顾名思义，监听间谍节点的相关消息。要定义相关消息是什么，您必须编辑一个配置文件。

在 `plugins/simplegeneralmessage_plugin/config/devnet.json` 中，存在一个名为 `spyServiceFilters` 的数组。此数组中的每个对象都将合约的 VAA 列入白名单，使其与中继器相关。该对象包含一个 `chainId` (一个 Wormhole 链 ID) 和一个 `emitterAddress`。例如，在下图中，第一个对象将监视由 Moonbase Alpha 上的 `0x428097dCddCB00Ab65e63AB9bc56Bb48d106ECBE` 发送的 VAA（Wormhole 链 ID 为 16）。

请务必编辑 `spyServiceFilters` 数组，以便中继器监听您部署的两个合约。

在 `simplegeneralmessage_plugin` 文件夹中，打开 `src/plugin.ts`。此文件包含中继器的监听器和执行器组件的插件代码，但注释应使其明显 বিপজ্জনক，哪些函数与哪个组件相关。该文件的代码片段如下所示，您应该按照步骤操作，但如果您没有，可以在 [其 GitHub 存储库](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=_blank} 中访问整个文件。

查看下面的 `getFilters()` 函数。注意到一些熟悉的东西了吗？ `spyServiceFilters` 对象被注入到 `getFilters()` 所属的插件类中。请注意，没有进行任何过滤，这只是过滤器的准备工作。VAA 的实际过滤发生在 `relayer-engine` 包中，该包使用此 `getFilters()` 函数来了解要过滤的内容。

如果开发人员想要向过滤器添加其他逻辑，他们可以在这里添加，但对于您的目的而言，简单地列出一些硬编码的地址就足够了。

```ts
 // 中继器如何注入 VAA 过滤器。
 // 这是虚拟插件提供的默认实现。
 getFilters(): ContractFilter[] {
   if (this.pluginConfig.spyServiceFilters) {
     return this.pluginConfig.spyServiceFilters;
   }
   this.logger.error('Contract filters not specified in config');
   throw new Error('Contract filters not specified in config');
 }
```

过滤之后，监听器需要使用下面的 `consumeEvent(vaa, stagingArea)` 函数将工作流数据写入 Redis 数据库。

工作流只是执行器需要从监听器获取的数据，以便进行适当的执行。在这种情况下，添加到工作流的唯一信息是接收 VAA 的时间和 VAA 中的已解析数据本身。如果开发人员想要向工作流添加更多相关信息，他们可以在 `workflowData` 对象中执行此操作。

`nextStagingArea` 对象是一种使已消耗的事件（已过滤的 VAA）相互影响的方式。例如，如果开发人员想要将两个 VAA 打包到一个工作流中，他们不会每次都返回一个 `workflowData`。

```ts
 // 接收 VAA 并返回工作流。
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

这就是监听器组件所必需的全部内容。幸运的是，大多数代码都隐藏在 `relayer-engine` 包中的用户面前。

如果您还记得组件列表，那么第三个是 Redis 数据库组件。与数据库有关的大多数代码都对用户隐藏，因为 `relayer-engine` 包将从数据库中写入和读取数据，然后将任何相关数据注入回插件代码中。要运行 Redis 数据库，只需在父目录中运行以下命令：

```bash
npm run redis
```

### 设置执行器组件 {: #setting-up-the-executor-component}

最后，您必须处理执行器组件。回想一下，执行器组件从 Redis 数据库获取工作流数据，并使用该数据执行某种执行操作。对于大多数中继器来说，此执行将涉及链上交易，因为中继器充当 VAA 的无信任预言机。

`relayer-engine` 软件包有助于处理插件的钱包。目前，该软件包仅支持 Solana 和 EVM 钱包，但随着进一步的开发，将支持更多的链。但是，将 NEAR 或 Algorand 集成到中继器中并非不可能，因为除了软件包已经提供的钱包处理系统之外，您只需编写自己的钱包处理系统即可。

要使用软件包提供的内置钱包处理系统，请打开 `relayer-engine-config/executor.json.example` 中的文件。此示例脚本旨在向您展示如何格式化您的私钥（当前密钥由 Wormhole 提供）。

将示例文件重命名为 `executor.json`。在 `executor.json` 的 `privateKeys` 对象中，将每个数组的内容替换为您的私钥。私钥条目的帐户将是为中继器的执行器组件中的执行费用支付的帐户。

请谨慎管理您的密钥，因为泄露它们可能会导致资金损失。虽然 `executor.json` 在此存储库中被 git 忽略，但请确保您用于 TestNet 的钱包没有 MainNet 资金，以确保安全。

如果您不使用某个链，请从 `privateKeys` 对象中删除其密钥对应的条目。

如果您使用的链未在上面的 EVM TestNet 表格中列出，您将必须添加自己的数组。此数组的键应该是您之前选择部署的其他 EVM 的 Wormhole 链 ID。例如，如果您部署在 Fantom TestNet 上，您将添加以下对象，因为 Fantom TestNet 的 Wormhole 链 ID 为 `10`。

现在已经为执行器整理好了钱包，请查看执行器本身的代码，该代码位于 `plugins/simplegeneralmessage_plugin/src/plugin.ts` 文件中。如果您一直没有关注，可以在 [其 GitHub 存储库](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=_blank} 中访问整个文件。

`handleWorkflow(workflow, providers, execute)` 函数是所有逻辑所在的位置，尽管在它下面有一些辅助函数。这是 `relayer-engine` 软件包在 Redis 数据库中存在要使用的工作流时调用的函数。请注意注入到该函数中的三个参数：`workflow`、`providers` 和 `execute`。

- `workflow` 对象提供在侦听器组件执行 `consumeEvent(vaa, stagingArea)` 函数期间存储在数据库中的数据。在本例中，只有 VAA 和接收时间存储在数据库中，它们存储在本地 `payload` 变量中
- `providers` 对象注入 Ethers 和其他链的提供程序，这可能有助于查询链上数据或执行其他区块链相关操作。如前所述，该软件包目前仅支持 Solana 和 EVM 的提供程序。`providers` 对象在此实现中未使用
- `execute` 对象目前有两个函数：`onEVM(options)` 和 `onSolana(options)`。这些函数需要一个 Wormhole 链 ID 和一个回调函数，该函数中注入了一个钱包对象。包含的钱包基于在 `executor.json` 文件中配置的私钥

此函数执行的第一个实质性操作是解析工作流对象，然后使用一些辅助函数解析其 VAA。之后，它获取已解析的 VAA 有效负载，将其转换为十六进制格式，并使用 Ethers 实用程序通过 ABI 解码将有效负载解码为智能合约中定义的单独值。

通过 Ethers 解码的数据，可以确定有效负载被发送到哪个合约和哪个链，因为该数据已打包到消息中。该函数检查指定的目的地链 ID 是否属于 EVM，并将使用之前提到的 `execute.onEVM(options)` 函数执行。否则，它会记录错误，因为为了简单起见，此系统不希望与非 EVM 的链交互。

```ts
// Consumes a workflow for execution
async handleWorkflow(
  workflow: Workflow,
  providers: Providers,
  execute: ActionExecutor
): Promise<void> {
  this.logger.info(`Workflow ${workflow.id} received...`);

  const { vaa } = this.parseWorkflowPayload(workflow);
  const parsed = wh.parseVaa(vaa);
  this.logger.info(`Parsed VAA. seq: ${parsed.sequence}`);

  // Here we are parsing the payload so that we can send it to the right recipient
  const hexPayload = parsed.payload.toString('hex');
  let [recipient, destID, sender, message] =
    ethers.utils.defaultAbiCoder.decode(
      ['bytes32', 'uint16', 'bytes32', 'string'],
      '0x' + hexPayload
    );
  recipient = this.formatAddress(recipient);
  sender = this.formatAddress(sender);
  const destChainID = destID as ChainId;
  this.logger.info(
    `VAA: ${sender} sent "${message}" to ${recipient} on chain ${destID}.`
  );

  // Execution logic
  if (wh.isEVMChain(destChainID)) {
    // This is where you do all of the EVM execution.
    // Add your own private wallet for the executor to inject in 
    // relayer-engine-config/executor.json
    await execute.onEVM({
      chainId: destChainID,
      f: async (wallet, chainId) => {
        const contract = new ethers.Contract(recipient, abi, wallet.wallet);
        const result = await contract.processMyMessage(vaa);
        this.logger.info(result);
      },
    });
  } else {
    // The relayer plugin has a built-in Solana wallet handler, which you could use
    // here. NEAR & Algorand are supported by Wormhole, but they're not supported by
    // the relayer plugin. If you want to interact with NEAR or Algorand you'd have
    // to make your own wallet management system, that's all
    this.logger.error(
      'Requested chainID is not an EVM chain, which is currently unsupported.'
    );
  }
};
```

在回调函数中，它使用 Ethers 软件包创建一个 [合约对象](https://docs.ethers.org/v6/api/contract/#Contract){target=_blank}。它导入的 ABI 从 `SimpleGeneralMessage` 合约的编译中导出，因此该代码假设 VAA 中指定的消息接收者是或继承自 `SimpleGeneralMessage` 合约。

然后，代码尝试使用 VAA 执行 `processMyMessage(bytes32 VAA)` 函数，该函数之前被定义为消息中继到的函数。回想一下，此函数名称是为智能合约任意选择的，因为中继器可以指定要调用的任何函数。这种自由体现在开发人员更改此中继器的代码的能力中！

```ts
await execute.onEVM({
  chainId: destChainID,
  f: async (wallet, chainId) => {
    const contract = new ethers.Contract(recipient, abi, wallet.wallet);
    const result = await contract.processMyMessage(vaa);
    this.logger.info(result);
  },
});
```

最后一步是检查 `relayer-engine-config/common.json`。此配置文件控制整个中继器的执行。确保您正在使用的 TestNet EVM 列在此文件的 `supportedChains` 对象中。如果未列出，则插件将无法正常运行。如果您使用的链未列出，您将必须从 [Wormhole 的开发者文档](https://wormhole.com/docs/products/reference/supported-networks/){target=_blank} 导入数据到配置文件中，格式如下。

还有中继器的其他配置。例如，`mode` 字符串设置为 `"BOTH"`，以确保同时使用侦听器和执行器插件，但开发人员可以决定仅运行一个插件（如果他们愿意）。此外，还有多个日志级别可以指定，例如 `"error"` 仅用于错误消息。但是，对于此演示，只需保留配置设置不变即可。

配置就完成了！现在来运行它。在您的终端实例（一个没有运行 spy 节点的实例）中，导航到父文件夹。运行以下命令：

```bash
npm run start
```

您应该在控制台中看到类似于以下日志的内容。

--8<-- 'code/builders/interoperability/protocols/wormhole/terminal/run-start.md'

### 使用 Wormhole 从 Moonbase 发送跨链消息 {: #send-message-from-moonbase }

现在，要发送跨链消息，您只需调用 `sendMessage(string memory message, address destAddress, uint16 destChainId)` 函数。

使用 Remix 界面。此示例将向 Fantom TestNet 发送跨链消息，但您可以将 `destChainId` 替换为您想要的任何 EVM。检查以下事项：

1. 环境是网络 1287 (Moonbase Alpha) 上的 **注入提供程序**
2. 您的钱包中有来自 [水龙头](https://faucet.moonbeam.network){target=_blank} 的大量资金，以支付源链和目标链上的交易 gas 成本
3. 在 **sendMessage** 部分的 **message** 输入中放入您选择的简短消息（在本例中为“this is a message”）
4. 将目标链上 SimpleGeneralMessage 实例的地址放入 **destAddress** 输入中
5. 将目标链的 Wormhole 链 ID 放入 **sendMessage** 部分的 **destChainId** 输入中
6. 完成所有这些操作后，交易执行并在 MetaMask 中确认

![发送交易](/images/builders/interoperability/protocols/wormhole/wormhole-5.webp)

几秒钟到一分钟后，跨链消息应该通过您在本地计算机上托管的中继器正确中继。

--8<-- 'code/builders/interoperability/protocols/wormhole/terminal/send.md'

## Moonbeam路由流动性集成 {: #moonbeam-routed-liquidity-integration }

Wormhole将通过Moonbeam路由流动性（MRL）计划向平行链提供流动性。该计划允许通过Moonbeam网络发送流动性，从而将流动性从Wormhole连接的链一键转移到平行链钱包。
[MRL](/builders/interoperability/mrl/){target=_blank} 利用 [GMP预编译](/builders/ethereum/precompiles/interoperability/gmp/){target=_blank}，其文档解释了应如何构建跨链消息以正确使用预编译。

--8<-- 'text/_disclaimers/third-party-content.md'
