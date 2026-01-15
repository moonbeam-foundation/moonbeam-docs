---
title: 使用 Foundry 部署合约
description: 了解如何使用 Foundry（一个以太坊开发环境）在 Moonbeam 上编译、部署和调试 Solidity 智能合约。
categories: Dev Environments, Ethereum Toolkit
---

# 使用 Foundry 部署到 Moonbeam

## 简介 {: #introduction }

[Foundry](https://github.com/foundry-rs/foundry){target=_blank} 是一个用 Rust 编写的以太坊开发环境，它可以帮助开发人员管理依赖项、编译项目、运行测试、部署合约以及从命令行与区块链进行交互。Foundry 可以直接与 Moonbeam 的以太坊 API 交互，因此可用于将智能合约部署到 Moonbeam 中。

以下四个工具构成了 Foundry：

- **[Forge](https://getfoundry.sh/forge/overview/){target=_blank}** - 编译、测试和部署合约
- **[Cast](https://getfoundry.sh/cast/overview/){target=_blank}** - 用于与合约交互的命令行界面
- **[Anvil](https://getfoundry.sh/anvil/overview/){target=_blank}** - 用于开发目的的本地 TestNet 节点，可以复刻预先存在的网络
- **[Chisel](https://getfoundry.sh/chisel/overview/){target=_blank}** - 一个 Solidity REPL，用于快速测试 Solidity 代码片段

本指南将介绍如何在 Moonbase Alpha TestNet 上使用 Foundry 编译、部署和调试以太坊智能合约。本指南也适用于 Moonbeam、Moonriver 或 Moonbeam 开发节点。

## 检查先决条件 {: #checking-prerequisites }

要开始使用，您需要以下内容：

 - 拥有一个有资金的帐户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
--8<-- 'text/_common/endpoint-examples-list-item.md'
 - 安装了 [Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank}

## 创建 Foundry 项目 {: #creating-a-foundry-project }

如果您还没有 Foundry 项目，则需要创建一个。您可以按照以下步骤创建一个：

1. 如果您还没有安装 Foundry，请先安装。如果在 Linux 或 MacOS 上，您可以运行以下命令：
  
    bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    

    如果在 Windows 上，您需要安装 Rust，然后从源代码构建 Foundry：

    bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh
    cargo install --git https://github.com/foundry-rs/foundry foundry-cli anvil --bins --locked
    

2. 创建项目，这将创建一个包含三个文件夹的文件夹，并打开它：

    bash
    forge init foundry && cd foundry
    

创建默认项目后，您应该会看到三个文件夹。

- `lib` - 项目的所有依赖项，以 git 子模块的形式存在
- `src` - 放置智能合约 (具有功能) 的位置
- `test` - 放置项目 forge 测试的位置，测试使用 Solidity 编写

除了这三个文件夹之外，还会创建一个 git 项目，以及一个预先编写的 `.gitignore` 文件，其中忽略了相关的文件类型和文件夹。

## 编译 Solidity {: #compiling-solidity }

一旦安装了所有依赖项，您就可以编译合约：

bash
forge build

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/compile.md'

编译后，将创建两个文件夹：`out` 和 `cache`。您的合约的 ABI 和字节码将包含在 `out` 文件夹中。默认 Foundry 项目初始化中包含的 `.gitignore` 已经忽略了这两个文件夹。

## 部署合约 {: #deploying-the-contract }

使用 Foundry 部署合约主要有两种方式。第一种是直接使用命令`forge create`。还有一种更灵活、更强大的选择是 Foundry 脚本，它可以在任何部署之前运行模拟。在以下章节中，将介绍`forge create`和 Foundry 脚本。

### 使用 Forge Create {: #using-forge-create }

在部署之前，您需要通过导入您的私钥来设置您的密钥库。您可以使用 `cast wallet import` 命令来完成此操作，如下所示：

bash
cast wallet import deployer --interactive

这将提示您：

1. 输入您的私钥
2. 输入一个密码来加密密钥库

该账户将以“deployer”的名称保存在您的密钥库中。然后，您可以在部署命令中使用此账户名称。在部署合约或发送交易时，系统会提示您输入密钥库密码。

使用 `forge create` 部署合约只需要一个命令，但您必须包含 RPC 端点和构造函数参数。`MyToken.sol` 在其构造函数中要求提供初始的 token 供应量，因此以下每个命令都包含 100 作为构造函数参数。您可以使用以下命令为正确的网络部署 `MyToken.sol` 合约：

===

    bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    

===

    bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    

===

    bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    

===

    bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.development.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    

在您部署合约并且几秒钟过去后，您应该在终端中看到地址。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/deploy.md'

恭喜！您的合约已上线！保存该地址，因为您将在下一步使用它与此合约实例进行交互。

### 通过Solidity脚本进行部署 {: #deploying-via-solidity-scripting }

与 [`forge create`](#deploying-the-contract) 相比，Solidity脚本是一种更强大、更灵活的合约部署方式。编写Solidity脚本与编写典型的Solidity智能合约相同，尽管您永远不会部署此合约。

您可以使用各种参数来定制 `forge script` 的行为。除了本地模拟之外，所有组件都是可选的，本地模拟是每次运行的必需部分。`forge script` 命令将尝试按以下顺序执行所有适用的步骤：

1. **本地模拟** - 在本地EVM中模拟交易
2. **链上模拟** - 通过提供的RPC URL模拟交易
3. **广播** - 当提供 `--broadcast` 标志并且模拟成功时，将分派交易
4. **验证** - 当提供 `--verify` 标志和有效的API密钥时，基于API的智能合约验证

现在，继续编写脚本。在脚本文件夹中，创建一个名为 `MyToken.s.sol` 的文件。复制并粘贴以下文件的内容。

```solidity
--8<-- 'code/builders/ethereum/dev-env/foundry/MyToken-script.sol'
```

请注意，即使上面的脚本没有被部署，它仍然需要Solidity合约的所有典型格式，例如pragma语句。

对于此示例，Foundry将首先尝试本地模拟和针对提供的RPC的模拟，然后再部署合约。请记住，它将按顺序执行所有相关步骤。如果任何模拟失败，Foundry将不会继续进行部署。您可以使用以下命令部署 `MyToken.sol` 合约。

```bash
forge script script/MyToken.s.sol --rpc-url {{ networks.moonbase.rpc_url }} --broadcast --account deployer
```

如果脚本的执行成功，您的终端应类似于以下输出。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/script.md'

就是这样！有关使用Foundry进行Solidity脚本的更多信息，请务必查看 [Foundry的文档站点](https://getfoundry.sh/guides/scripting-with-solidity/){target=_blank}。

## 与合约交互 {: #interacting-with-the-contract }

Foundry 包含 cast，一个用于执行以太坊 RPC 调用的 CLI。

尝试使用 Cast 检索你的 token 名称，其中 `INSERT_YOUR_CONTRACT_ADDRESS` 是你在上一节中部署的合约地址：

===

    bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbeam.rpc_url }}
    

===

    bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonriver.rpc_url }}
    

===

    bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbase.rpc_url }}
    

===

    bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.development.rpc_url }}
    

你应该得到十六进制格式的数据：

text
0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000

这很难读懂，但你可以使用 Cast 将其转换为你想要的格式。在这种情况下，数据是文本，因此你可以将其转换为 ASCII 字符以查看 “My Token”：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/cast.md'

bash
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000

你也可以使用 cast 改变数据。尝试通过将 token 发送到零地址来销毁 token。

===

    bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --chain {{ networks.moonbeam.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    

===

    bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --chain {{ networks.moonriver.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    

===

    bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --chain {{ networks.moonbase.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    

===

    bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.development.rpc_url }} \
    --chain {{ networks.development.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    

该交易将由你的 Moonbase 帐户签名，并广播到网络。输出应类似于：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/burn.md'

恭喜，你已使用 Foundry 成功部署并与合约交互！

## 使用 Anvil 进行 Fork {: #forking-with-cast-anvil }

如前所述，[Anvil](https://getfoundry.sh/anvil/overview/#anvil){target=_blank} 是一个用于开发目的的本地 TestNet 节点，可以 Fork 预先存在的网络。Fork Moonbeam 允许您与部署在网络上的实时合约进行交互。

使用 Anvil 进行 Fork 时，需要注意一些限制。由于 Anvil 基于 EVM 实现，因此您无法与任何 Moonbeam 预编译合约及其功能进行交互。预编译是 Substrate 实现的一部分，因此无法在模拟的 EVM 环境中复制。这禁止您与 Moonbeam 上的跨链资产以及基于 Substrate 的功能（如质押和治理）进行交互。

要 Fork Moonbeam 或 Moonriver，您需要拥有自己的端点和 API 密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}之一获取。

要从命令行 Fork Moonbeam，可以从 Foundry 项目目录中运行以下命令：

===

    ```bash
    anvil --fork-url {{ networks.moonbeam.rpc_url }}
    ```

===

    ```bash
    anvil --fork-url {{ networks.moonriver.rpc_url }}
    ```

===

    ```bash
    anvil --fork-url {{ networks.moonbase.rpc_url }}
    ```

您的 Fork 实例将拥有 10 个开发帐户，这些帐户预先存入了 10,000 个测试代币。Fork 实例在 `http://127.0.0.1:8545/` 上可用。终端中的输出应类似于以下内容：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/fork-anvil.md'

要验证您是否已 Fork 网络，可以查询最新的区块号：

```bash
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

如果您将 `result` 从 [十六进制转换为十进制](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=_blank}，您应该从 Fork 网络的时间获得最新的区块号。您可以使用[区块浏览器](/builders/get-started/explorers/){target=_blank}交叉引用区块号。

从这里，您可以将新合约部署到 Moonbeam 的 Fork 实例，或与已部署的合约进行交互。在此指南中的先前示例的基础上，您可以使用 Cast 进行调用，以检查您部署合约的帐户中铸造的 MYTOK 代币的余额：

```bash
cast call INSERT_CONTRACT_ADDRESS  "balanceOf(address)(uint256)" INSERT_YOUR_ADDRESS --rpc-url http://localhost:8545
```

## 使用 Chisel {: #using-chisel }

Chisel 是一个 Solidity REPL 或 shell。它允许开发者直接在控制台中编写 Solidity 代码来测试小段代码，从而让开发者跳过项目设置和合约部署步骤，以实现快速处理。

由于 Chisel 主要用于快速测试，因此可以在 Foundry 项目之外使用。但是，如果在 Foundry 项目中执行，它将在运行时保留 `foundry.toml` 中的配置。

在本例中，你将测试 Solidity 中 `abi` 的一些功能，因为它足够复杂，可以演示 Chisel 的用处。要开始使用 Chisel，请在命令行中运行以下命令来启动 shell：

bash
chisel

在 shell 中，你可以编写 Solidity 代码，就像它在函数中运行一样：

solidity
bytes memory myData = abi.encode(100, true, "Develop on Moonbeam");

假设你对 `abi` 如何编码数据感兴趣，因为你正在研究如何在区块链上最有效地存储数据，从而节省 gas。要查看 `myData` 在内存中的存储方式，你可以在 Chisel shell 中使用以下命令：

bash
!memdump

`memdump` 将转储当前会话中的所有数据。你可能会看到类似下面的内容。如果你不擅长阅读十六进制，或者如果你不知道 ABI 编码的工作原理，那么你可能找不到 `myData` 变量的存储位置。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/memdump.md'

幸运的是，Chisel 让你轻松地找出这些信息的存储位置。使用 `!rawstack` 命令，你可以找到堆栈中变量值的位置：

bash
!rawstack myData

在这种情况下，由于 bytes 的长度超过 32 字节，因此会显示内存指针。但这正是所需要的，因为你已经从 `!memdump` 命令中知道了整个堆栈。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/rawstack.md'

`!rawstack` 命令显示 `myData` 变量存储在 `0x80`，因此当将其与从 `!memdump` 命令检索到的内存转储进行比较时，`myData` 看起来像这样存储：

text
[0x80:0xa0]: 0x00000000000000000000000000000000000000000000000000000000000000a0
[0xa0:0xc0]: 0x0000000000000000000000000000000000000000000000000000000000000064
[0xc0:0xe0]: 0x0000000000000000000000000000000000000000000000000000000000000001
[0xe0:0x100]: 0x0000000000000000000000000000000000000000000000000000000000000060
[0x100:0x120]: 0x0000000000000000000000000000000000000000000000000000000000000013
[0x120:0x140]: 0x446576656c6f70206f6e204d6f6f6e6265616d00000000000000000000000000

乍一看，这很有意义，因为 `0xa0` 的值为 `0x64`，等于 100，而 `0xc0` 的值为 `0x01`，等于 true。如果你想了解更多关于 ABI 编码的工作原理，[Solidity 的 ABI 文档很有帮助](https://docs.soliditylang.org/en/v0.8.18/abi-spec.html){target=_blank}。在这种情况下，这种数据打包方法中有很多零，因此作为智能合约开发者，你可以尝试使用结构体或使用位代码更有效地将数据打包在一起。

由于你已经完成了这段代码，你可以清除 Chisel 的状态，这样它就不会干扰你想要尝试的任何未来逻辑（在运行同一 Chisel 实例时）：

bash
!clear

还有一种更简单的方法可以使用 Chisel 进行测试。当编写以分号（`;`）结尾的代码时，Chisel 会将其作为语句运行，并将其值存储在 Chisel 的运行时状态中。但是，如果你只需要查看 ABI 编码的数据是如何表示的，那么你可以将代码作为表达式运行。要使用相同的 `abi` 示例来尝试此操作，请在 Chisel shell 中编写以下内容：

bash
abi.encode(100, true, "Develop on Moonbeam")

你应该看到类似以下内容：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/expression.md'

虽然它没有以相同的方式显示数据，但你仍然可以获得数据的内容，并且它还可以进一步分解信息的编码方式，例如让你知道 `0xa0` 值定义了数据的长度。

默认情况下，当你离开 Chisel shell 时，不会保留任何数据。但是你可以指示 chisel 这样做。例如，你可以按照以下步骤存储变量：

1. 在 Chisel 中存储一个 `uint256`
    bash
    uint256 myNumber = 101;
    

2. 使用 `!save` 存储会话。在本例中，你可以使用数字 `1` 作为保存 ID
    bash
    !save 1
    

3. 退出会话
    bash
    !quit
    

然后，要查看和交互你存储的 Chisel 状态，你可以按照以下步骤操作：

1. 查看已保存的 Chisel 状态列表
     bash
     chisel list
     

2. 加载你存储的状态
    bash
    chisel load 1
    

3. 查看从前一组步骤保存在 Chisel 中的 `uint256`
    bash
    !rawstack myNumber
    

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/save-state.md'

你甚至可以在使用 Chisel 时 fork 网络：

bash
!fork {{ networks.moonbase.rpc_url }}

然后，例如，你可以查询 Moonbase Alpha 的一个 collator 的余额：

text
{{ networks.moonbase.staking.candidates.address1 }}.balance

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/query-balance.md'

如果你想了解更多关于 Chisel 的信息，请下载 Foundry 并参考其[官方参考页面](https://getfoundry.sh/chisel/reference/){target=_blank}。
