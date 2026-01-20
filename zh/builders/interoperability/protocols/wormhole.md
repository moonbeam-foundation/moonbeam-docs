...

## title: 通过 Wormhole 实现跨链 description: 了解如何桥接资产、设置中继器，以及如何使用 Wormhole 将您的 Moonbeam DApp 连接到多个区块链上的资产和功能。 categories: GMP Providers

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

```text
zeros to add = (32 bytes - 20 bytes) * 2 hexadecimal characters
zeros to add = 24
```

例如，如果您的连接合约的地址是 `0xaf108eF646c8214c9DD9C13CBC5fadf964Bbe293`，您将在 Remix 中输入以下内容：

```text
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

{
"source_path": "builders/interoperability/protocols/wormhole.md",
"source_language": "EN",
"target_language": "ZH",
"checksum": "e9973e919af819b67ba10da65062f10448c8f609f5485ed00d44434323a5ebdc",
"content": "### Setting up the Executor Component {: #setting-up-the-executor-component}\\n\\nFinally, you must handle the executor component. Recall that the executor component takes workflow data from the Redis database and does some sort of execution action with that data. For most relayers, this execution will involve an on-chain transaction, since a relayer acts as a trustless oracle for VAAs.\\n\\nThe `relayer-engine` package helps handle the wallets for the plugin. Currently, the package only supports Solana and EVM wallets, but with further development more chains will be supported. But it’s not impossible to integrate NEAR or Algorand into the relayer, since you would just have to write your own wallet handling system in addition to the one already provided by the package.\\n\\nTo work with the built-in wallet handling system provided by the package, open the file at `relayer-engine-config/executor.json.example`. This example script is provided to show you how to format your private keys (the current key is provided by Wormhole).\\n\\nRename the example file to `executor.json`. In the `privateKeys` object of `executor.json`, replace the content of each array with your private key. The account of the private key entries will be the one that pays for execution fees in the relayer’s executor component.\\n\\nPlease manage your keys with care, as exposing them can result in loss of funds. While `executor.json` is ignored by git in this repository, please be sure that the wallet you are using for TestNet has no MainNet funds just to be safe.\\n\\n\\n\\nRemove any entries from the `privateKeys` object if their key belongs to a chain that you are not using.\\n\\nIf you are using a chain that wasn’t listed in the EVM TestNet table above, you will have to add your own array. The key for this array should be the Wormhole chain ID of the other EVM that you chose to deploy on before. For example, if you deployed on the Fantom TestNet, you would add the following object, since the Wormhole chain ID of the Fantom TestNet is `10`.\\n\\n\\n\\nNow that the wallets are sorted out for the executor, look at the code of the executor itself, which is in the `plugins/simplegeneralmessage_plugin/src/plugin.ts` file. If you haven’t been following along, the entire file can be accessed in [its GitHub repository](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=\_blank}.\\n\\nThe `handleWorkflow(workflow, providers, execute)` function is where all of the logic is, though there are some helper functions underneath it. This is the function that the `relayer-engine` package invokes when there is a workflow in the Redis database that’s to be used. Notice the three parameters that are injected into the function: `workflow`, `providers`, and `execute`.\\n\\n- The `workflow` object provides the data that was stored in the database during the listener component’s execution of the `consumeEvent(vaa, stagingArea)` function. In this case, only the VAA and time it was received was stored in the database, which are stored in the local `payload` variable\\n- The `providers` object injects Ethers and other chains’ providers, which might be helpful for querying on-chain data or doing other blockchain related actions. As mentioned before, the only providers that are currently supported by the package are Solana and EVMs. The `providers` object isn’t used in this implementation\\n- The `execute` object currently has two functions in it: `onEVM(options)` and `onSolana(options)`. These functions require a Wormhole chain ID and a callback function that has a wallet object injected into it. The wallet included is based off of the private key that was configured in the `executor.json` file\\n\\nThe first substantial thing this function does is parse the workflow object, then parse its VAA with some helper functions. Afterwards, it takes the parsed VAA payload, converts it into a hexadecimal format, and uses the Ethers utility to ABI-decode the payload into its separate values that were defined way-back-when in the smart contract.\\n\\nWith the data that was decoded by Ethers, it’s possible to figure out to which contract and which chain the payload is being sent to, since that data was packaged into the message. The function checks if the specified destination chain ID belongs to an EVM, and will execute using the `execute.onEVM(options)` function mentioned before. Otherwise, it logs an error since this system doesn’t expect to interact with non-EVM chains for simplicity.\\n\\n`` ts\n// Consumes a workflow for execution\nasync handleWorkflow(\n  workflow: Workflow,\n  providers: Providers,\n  execute: ActionExecutor\n): Promise<void> {\n  this.logger.info(`Workflow ${workflow.id} received...`);\n\n  const { vaa } = this.parseWorkflowPayload(workflow);\n  const parsed = wh.parseVaa(vaa);\n  this.logger.info(`Parsed VAA. seq: ${parsed.sequence}`);\n\n  // Here we are parsing the payload so that we can send it to the right recipient\n  const hexPayload = parsed.payload.toString('hex');\n  let [recipient, destID, sender, message] =\n    ethers.utils.defaultAbiCoder.decode(\n      ['bytes32', 'uint16', 'bytes32', 'string'],\n      '0x' + hexPayload\n    );\n  recipient = this.formatAddress(recipient);\n  sender = this.formatAddress(sender);\n  const destChainID = destID as ChainId;\n  this.logger.info(\n    `VAA: ${sender} sent \"${message}\" to ${recipient} on chain ${destID}.`\n  );\n\n  // Execution logic\n  if (wh.isEVMChain(destChainID)) {\n    // This is where you do all of the EVM execution.\n    // Add your own private wallet for the executor to inject in \n    // relayer-engine-config/executor.json\n    await execute.onEVM({\n      chainId: destChainID,\n      f: async (wallet, chainId) => {\n        const contract = new ethers.Contract(recipient, abi, wallet.wallet);\n        const result = await contract.processMyMessage(vaa);\n        this.logger.info(result);\n      },\n    });\n  } else {\n    // The relayer plugin has a built-in Solana wallet handler, which you could use\n    // here. NEAR & Algorand are supported by Wormhole, but they're not supported by\n    // the relayer plugin. If you want to interact with NEAR or Algorand you'd have\n    // to make your own wallet management system, that's all\n    this.logger.error(\n      'Requested chainID is not an EVM chain, which is currently unsupported.'\n    );\n  }\n};\n ``\\n\\nIn the callback function, it creates a [contract object](https://docs.ethers.org/v6/api/contract/#Contract){target=\_blank} with the Ethers package. The ABI that it imports is exported from the `SimpleGeneralMessage` contract’s compilation, so this code is assuming that the recipient of the message specified in the VAA is or inherits from a `SimpleGeneralMessage` contract.\\n\\nThen, the code attempts to execute the `processMyMessage(bytes32 VAA)` function with the VAA, which was previously defined as the function that messages are relayed to. Recall that this function name was arbitrarily chosen for the smart contract because the relayer could specify any function to call. That freedom is expressed in the ability for a developer to change this relayer’s code!\\n\\n`ts\nawait execute.onEVM({\n  chainId: destChainID,\n  f: async (wallet, chainId) => {\n    const contract = new ethers.Contract(recipient, abi, wallet.wallet);\n    const result = await contract.processMyMessage(vaa);\n    this.logger.info(result);\n  },\n});\n`\\n\\nThe final piece is to check `relayer-engine-config/common.json`. This config file controls the execution of the entire relayer. Ensure that the TestNet EVMs that you are using are listed within the `supportedChains` object of this file. The plugin will not run properly if it’s not listed. If a chain that you are using is not listed, you will have to import the data from [Wormhole’s developer documentation](https://wormhole.com/docs/products/reference/supported-networks/){target=\_blank} into the config file in a format like below.\\n\\nThere are also additional configurations for the relayer. For example, the `mode` string is set to `"BOTH"` to ensure that both the listener and executor plugins are used, but a developer could decide to run only one if they wanted. Additionally, there are multiple log levels to specify, such as `"error"` for just error messages. For this demo, however, just leave the configuration settings as is.\\n\\n\\n\\nThat’s it for the configuration! Now to run it. In your terminal instance (one that isn’t running the spy node), navigate to the parent folder. Run the following command:\\n\\n`bash\nnpm run start\n`\\n\\nYou should see something similar to the logs below in the console.\\n\\n--8\<-- 'code/builders/interoperability/protocols/wormhole/terminal/run-start.md'\\n",
"translated_content": "### 设置执行器组件 {: #setting-up-the-executor-component}\\n\\n最后，您必须处理执行器组件。回想一下，执行器组件从 Redis 数据库获取工作流数据，并使用该数据执行某种执行操作。对于大多数中继器来说，此执行将涉及链上交易，因为中继器充当 VAA 的无信任预言机。\\n\\n`relayer-engine` 包有助于处理插件的钱包。目前，该包仅支持 Solana 和 EVM 钱包，但随着进一步的开发，将支持更多链。但是，将 NEAR 或 Algorand 集成到中继器中并非不可能，因为除了该包已提供的钱包处理系统之外，您只需编写自己的钱包处理系统。\\n\\n要使用该包提供的内置钱包处理系统，请打开 `relayer-engine-config/executor.json.example` 中的文件。此示例脚本旨在向您展示如何格式化您的私钥（当前密钥由 Wormhole 提供）。\\n\\n将示例文件重命名为 `executor.json`。在 `executor.json` 的 `privateKeys` 对象中，将每个数组的内容替换为您的私钥。私钥条目的帐户将是为中继器的执行器组件中的执行费用支付的帐户。\\n\\n请谨慎管理您的密钥，因为暴露它们可能会导致资金损失。虽然此存储库中的 git 忽略了 `executor.json`，但请确保您用于 TestNet 的钱包没有 MainNet 资金，以确保安全。\\n\\n\\n\\n如果您使用的链的密钥不属于您使用的链，请从 `privateKeys` 对象中删除任何条目。\\n\\n如果您使用的是上面 EVM TestNet 表格中未列出的链，则需要添加您自己的数组。此数组的键应为您之前选择部署的其他 EVM 的 Wormhole 链 ID。例如，如果您部署在 Fantom TestNet 上，则应添加以下对象，因为 Fantom TestNet 的 Wormhole 链 ID 为 `10`。\\n\\n\\n\\n现在钱包已为执行器排序，请查看执行器本身的代码，该代码位于 `plugins/simplegeneralmessage_plugin/src/plugin.ts` 文件中。如果您一直关注，则可以在 [其 GitHub 存储库](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=\_blank} 中访问整个文件。\\n\\n`handleWorkflow(workflow, providers, execute)` 函数是所有逻辑所在的位置，但下面有一些辅助函数。这是当 Redis 数据库中存在要使用的工作流时 `relayer-engine` 包调用的函数。请注意注入到该函数中的三个参数：`workflow`、`providers` 和 `execute`。\\n\\n- `workflow` 对象提供在侦听器组件执行 `consumeEvent(vaa, stagingArea)` 函数期间存储在数据库中的数据。在本例中，只有 VAA 和接收时间存储在数据库中，它们存储在局部 `payload` 变量中\\n- `providers` 对象注入 Ethers 和其他链的提供程序，这可能有助于查询链上数据或执行其他与区块链相关的操作。如前所述，该包目前仅支持 Solana 和 EVM。在此实现中未使用 `providers` 对象\\n- `execute` 对象目前包含两个函数：`onEVM(options)` 和 `onSolana(options)`。这些函数需要 Wormhole 链 ID 和一个回叫函数，该函数注入了一个钱包对象。包含的钱包基于在 `executor.json` 文件中配置的私钥\\n\\n此函数的第一个实质性操作是解析工作流对象，然后使用一些辅助函数解析其 VAA。然后，它获取解析的 VAA 有效负载，将其转换为十六进制格式，并使用 Ethers 实用程序将有效负载 ABI 解码为智能合约中先前定义的单独值。\\n\\n使用 Ethers 解码的数据，可以确定有效负载发送到哪个合约和哪个链，因为该数据已打包到消息中。该函数检查指定的目的地链 ID 是否属于 EVM，并将使用之前提到的 `execute.onEVM(options)` 函数执行。否则，它会记录错误，因为为了简单起见，此系统不希望与非 EVM 链交互。\\n\\n`` ts\n// Consumes a workflow for execution\nasync handleWorkflow(\n  workflow: Workflow,\n  providers: Providers,\n  execute: ActionExecutor\n): Promise<void> {\n  this.logger.info(`Workflow ${workflow.id} received...`);\n\n  const { vaa } = this.parseWorkflowPayload(workflow);\n  const parsed = wh.parseVaa(vaa);\n  this.logger.info(`Parsed VAA. seq: ${parsed.sequence}`);\n\n  // Here we are parsing the payload so that we can send it to the right recipient\n  const hexPayload = parsed.payload.toString('hex');\n  let [recipient, destID, sender, message] =\n    ethers.utils.defaultAbiCoder.decode(\n      ['bytes32', 'uint16', 'bytes32', 'string'],\n      '0x' + hexPayload\n    );\n  recipient = this.formatAddress(recipient);\n  sender = this.formatAddress(sender);\n  const destChainID = destID as ChainId;\n  this.logger.info(\n    `VAA: ${sender} sent \"${message}\" to ${recipient} on chain ${destID}.`\n  );\n\n  // Execution logic\n  if (wh.isEVMChain(destChainID)) {\n    // This is where you do all of the EVM execution.\n    // Add your own private wallet for the executor to inject in \n    // relayer-engine-config/executor.json\n    await execute.onEVM({\n      chainId: destChainID,\n      f: async (wallet, chainId) => {\n        const contract = new ethers.Contract(recipient, abi, wallet.wallet);\n        const result = await contract.processMyMessage(vaa);\n        this.logger.info(result);\n      },\n    });\n  } else {\n    // The relayer plugin has a built-in Solana wallet handler, which you could use\n    // here. NEAR & Algorand are supported by Wormhole, but they're not supported by\n    // the relayer plugin. If you want to interact with NEAR or Algorand you'd have\n    // to make your own wallet management system, that's all\n    this.logger.error(\n      'Requested chainID is not an EVM chain, which is currently unsupported.'\n    );\n  }\n};\n ``\\n\\n在回叫函数中，它使用 Ethers 包创建一个 [合约对象](https://docs.ethers.org/v6/api/contract/#Contract){target=\_blank}。它导入的 ABI 从 `SimpleGeneralMessage` 合约的编译中导出，因此这段代码假设 VAA 中指定的消息接收者是或继承自 `SimpleGeneralMessage` 合约。\\n\\n然后，该代码尝试使用 VAA 执行 `processMyMessage(bytes32 VAA)` 函数，该函数之前定义为消息中继到的函数。请记住，此函数名称是为智能合约任意选择的，因为中继器可以指定要调用的任何函数。开发人员更改此中继器的代码的能力表达了这种自由！\\n\\n`ts\nawait execute.onEVM({\n  chainId: destChainID,\n  f: async (wallet, chainId) => {\n    const contract = new ethers.Contract(recipient, abi, wallet.wallet);\n    const result = await contract.processMyMessage(vaa);\n    this.logger.info(result);\n  },\n});\n`\\n\\n最后一步是检查 `relayer-engine-config/common.json`。此配置文件控制整个中继器的执行。确保您使用的 TestNet EVM 列在此文件的 `supportedChains` 对象中。如果未列出，则插件将无法正常运行。如果您使用的链未列出，则需要从 [Wormhole 的开发者文档](https://wormhole.com/docs/products/reference/supported-networks/){target=\_blank} 中将数据导入到配置文件中，格式如下。\\n\\n还有其他中继器配置。例如，`mode` 字符串设置为 `"BOTH"` 以确保使用侦听器和执行器插件，但如果开发人员愿意，他们可以决定只运行一个。此外，还有多个日志级别可以指定，例如仅用于错误消息的 `"error"`。但是，对于此演示，只需保留配置设置即可。\\n\\n\\n\\n配置到此为止！现在运行它。在您的终端实例（一个未运行间谍节点的实例）中，导航到父文件夹。运行以下命令：\\n\\n`bash\nnpm run start\n`\\n\\n您应该在控制台中看到类似于以下日志的内容。\\n\\n--8\<-- 'code/builders/interoperability/protocols/wormhole/terminal/run-start.md'\\n",
"branch": "origin/rose1",
"commit": "dd18343c719f9c17cec2c6833eb13c617f846ccc",
"chunk_index": 13,
"chunk_total": 15
}

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
