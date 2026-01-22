---
title: 使用 Foundry 部署合约
description: 了解如何使用 Foundry（一个以太坊开发环境）在 Moonbeam 上编译、部署和调试 Solidity 智能合约。
categories: 开发环境, 以太坊工具包
---


# 使用 Foundry 部署到 Moonbeam

## 简介 {: #introduction }

[Foundry](https://github.com/foundry-rs/foundry){target=\_blank} 是一个用 Rust 编写的以太坊开发环境，可帮助开发人员管理依赖项、编译项目、运行测试、部署合约以及从命令行与区块链进行交互。Foundry 可以直接与 Moonbeam 的以太坊 API 交互，因此可用于将智能合约部署到 Moonbeam 中。

Foundry 由四个工具组成：

- **[Forge](https://getfoundry.sh/forge/overview/){target=\_blank}** - 编译、测试和部署合约
- **[Cast](https://getfoundry.sh/cast/overview/){target=\_blank}** - 用于与合约交互的命令行界面
- **[Anvil](https://getfoundry.sh/anvil/overview/){target=\_blank}** - 用于开发目的的本地 TestNet 节点，可以 Fork 预先存在的网络
- **[Chisel](https://getfoundry.sh/chisel/overview/){target=\_blank}** - 一个 Solidity REPL，用于快速测试 Solidity 代码片段

本指南将介绍如何使用 Foundry 在 Moonbase Alpha 测试网上编译、部署和调试以太坊智能合约。本指南也适用于 Moonbeam、Moonriver 或 Moonbeam 开发节点。

## 检查先决条件 {: #checking-prerequisites }

要开始，您将需要以下内容：

- 拥有一个有资金的帐户。

--8<-- 'text/_common/faucet/faucet-list-item.md'

--8<-- 'text/_common/endpoint-examples-list-item.md'

- 安装了[Foundry](https://getfoundry.sh/introduction/installation/){target=\_blank}

## 创建 Foundry 项目 {: #creating-a-foundry-project }

如果还没有 Foundry 项目，您需要创建一个。 您可以通过完成以下步骤来创建一个：

1. 如果您还没有安装 Foundry，请安装它。 如果在 Linux 或 MacOS 上，您可以运行以下命令：

    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

    如果在 Windows 上，您必须先安装 Rust，然后从源代码构建 Foundry：

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh
    cargo install --git https://github.com/foundry-rs/foundry foundry-cli anvil --bins --locked
    ```

1. 创建项目，这将创建一个包含三个文件夹的文件夹，并打开它：

    ```bash
    forge init foundry && cd foundry
    ```

创建默认项目后，您应该看到三个文件夹。

- `lib` - 项目的所有依赖项，以 git 子模块的形式存在
- `src` - 放置智能合约（带有功能）的位置
- `test` - 放置项目的 forge 测试的位置，这些测试是用 Solidity 编写的

除了这三个文件夹之外，还将创建一个 git 项目，以及一个预先编写的 `.gitignore` 文件，其中忽略了相关的文件类型和文件夹。

## 源文件夹 {: #the-src-folder }

`src` 文件夹中可能已经包含 `Counter.sol`，这是一个最小化的 Solidity 合约。你可以将其删除。为避免报错，你还应删除 `scripts` 文件夹中的 `Counter.s.sol` 文件，以及 `test` 文件夹中的 `Counter.t.sol` 文件。在接下来的步骤中，你将部署一个 ERC-20 合约。在 `contracts` 目录中，你可以创建 `MyToken.sol` 文件：

```bash
cd src
touch MyToken.sol
```

打开该文件并将以下合约内容添加进去：

```solidity
--8<-- 'code/builders/ethereum/dev-env/foundry/ERC20.sol'
```

在尝试编译之前，请先安装 OpenZeppelin 合约作为依赖项。你可能需要先将之前的更改提交到 git。默认情况下，Foundry 使用 git 子模块（submodules）而不是 npm 包，因此不会使用传统的 npm 导入路径和命令。相反，请使用 OpenZeppelin 的 GitHub 仓库名称：

```bash
forge install OpenZeppelin/openzeppelin-contracts
```
## 编译 Solidity {: #compiling-solidity }

当所有依赖项都安装完成后，你可以编译该合约：

```bash
forge build
```

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/compile.md'

编译完成后，会创建两个文件夹：out 和 cache。合约的 ABI 和字节码将包含在 out 文件夹中。这两个文件夹已被 Foundry 项目初始化时默认生成的 .gitignore 忽略。

## 部署合约 {: #deploying-the-contract }

使用 Foundry 部署合约主要有两种方式。第一种是直接使用命令 `forge create`。还有一种更灵活、更强大的方式是使用 Foundry 脚本，它可以在部署前运行模拟。在以下章节中，将介绍 `forge create` 和 Foundry 脚本。

### 使用 Forge Create {: #using-forge-create }

在部署之前，您需要通过导入您的私钥来设置您的密钥库。您可以使用 `cast wallet import` 命令，如下所示：

```bash
cast wallet import deployer --interactive
```

这将提示您：

1. 输入您的私钥
1. 输入密码以加密密钥库

该帐户将以“deployer”的名称保存在您的密钥库中。然后，您可以在部署命令中使用此帐户名。在部署合约或发送交易时，系统将提示您输入密钥库密码。

使用 `forge create` 部署合约只需要一个命令，但您必须包含 RPC 端点和构造函数参数。`MyToken.sol` 在其构造函数中要求提供初始令牌供应量，因此以下每个命令都包含 100 作为构造函数参数。 您可以使用以下命令为正确的网络部署 `MyToken.sol` 合约：

=== "Moonbeam"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonriver"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonbase Alpha"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonbeam Dev Node"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.development.rpc_url }} \
    --broadcast \
    --account deployer \
    --constructor-args 100
    ```

部署合约并在几秒钟后，您应该在终端中看到该地址。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/deploy.md'

恭喜！您的合约已上线！保存该地址，您将在下一步中使用它与此合约实例进行交互。

### 通过 Solidity 脚本部署 {: #deploying-via-solidity-scripting }

与 [`forge create`](#deploying-the-contract) 相比，Solidity 脚本是一种更强大、更灵活的合约部署方式。编写 Solidity 脚本与编写常规 Solidity 智能合约完全相同，不过你不会实际部署这个脚本合约本身。

你可以通过多种参数来自定义 `forge script` 的行为。除本地模拟（每次运行都必须执行）之外，其它组件都是可选的。`forge script` 命令会按以下顺序尝试执行所有适用步骤：

1. **本地模拟** - 在本地 EVM 中模拟交易
1. **链上模拟** - 通过提供的 RPC URL 模拟交易
1. **广播** - 提供 `--broadcast` 标志且模拟成功时，将交易发送到链上
1. **验证** - 提供 `--verify` 标志并配置有效的 API Key 时，进行基于 API 的智能合约验证

接下来，开始编写脚本。在 `script` 文件夹中创建一个名为 `MyToken.s.sol` 的文件，然后将下方文件的内容复制并粘贴进去：

```solidity
--8<-- 'code/builders/ethereum/dev-env/foundry/MyToken-script.sol'
```

请注意，即使上述脚本不会被部署，它仍然需要具备 Solidity 合约的典型格式，例如 pragma 声明。

在本示例中，Foundry 会在部署合约之前，先尝试进行本地模拟，然后再对提供的 RPC 进行模拟。请记住，它会按顺序执行所有相关步骤。如果任一模拟失败，Foundry 将不会继续部署。你可以使用以下命令部署 `MyToken.sol` 合约：

```bash
forge script script/MyToken.s.sol --rpc-url {{ networks.moonbase.rpc_url }} --broadcast --account deployer
```

如果脚本执行成功，你的终端输出应类似于下方内容。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/script.md'

完成！如需了解更多关于使用 Foundry 进行 Solidity 脚本编写的信息，请查看 [Foundry 文档站点](https://getfoundry.sh/guides/scripting-with-solidity/)
{target=\_blank}。

## 与合约交互 {: #interacting-with-the-contract }

Foundry 包含 cast，这是一个用于执行以太坊 RPC 调用的 CLI。

尝试使用 Cast 检索您的令牌名称，其中 `INSERT_YOUR_CONTRACT_ADDRESS` 是您在上一节中部署的合约的地址：

=== "Moonbeam"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.development.rpc_url }}
    ```

您应该以十六进制格式获取此数据：

```text
0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

这远非可读，但您可以使用 Cast 将其转换为所需的格式。 在这种情况下，数据是文本，因此您可以将其转换为 ASCII 字符以查看“My Token”：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/cast.md'

```bash
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

您也可以使用 cast 改变数据。 尝试通过将令牌发送到零地址来销毁令牌。

=== "Moonbeam"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.moonbeam.rpc_url }} \
      --chain {{ networks.moonbeam.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonriver"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.moonriver.rpc_url }} \
      --chain {{ networks.moonriver.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbase Alpha"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.moonbase.rpc_url }} \
      --chain {{ networks.moonbase.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbeam Dev Node"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
      --rpc-url {{ networks.development.rpc_url }} \
      --chain {{ networks.development.chain_id }} \
      INSERT_YOUR_CONTRACT_ADDRESS \
      "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

该事务将由您的 Moonbase 帐户签名并广播到网络。 输出应类似于：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/burn.md'

恭喜，您已使用 Foundry 成功部署并与合约交互！

## 使用 Anvil 进行 Fork {: #forking-with-cast-anvil }

如前所述，[Anvil](https://getfoundry.sh/anvil/overview/#anvil){target=\_blank} 是一个用于开发目的的本地 TestNet 节点，可以 fork 预先存在的网络。Fork Moonbeam 允许您与部署在网络上的实时合约进行交互。

使用 Anvil 进行 fork 时，需要注意一些限制。由于 Anvil 基于 EVM 实现，因此您无法与任何 Moonbeam 预编译合约及其功能进行交互。预编译是 Substrate 实现的一部分，因此无法在模拟的 EVM 环境中复制。这禁止您与 Moonbeam 上的跨链资产以及基于 Substrate 的功能（如质押和治理）进行交互。

要 fork Moonbeam 或 Moonriver，您需要拥有自己的端点和 API 密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=\_blank}之一处获得。

要从命令行 fork Moonbeam，您可以从 Foundry 项目目录中运行以下命令：

=== "Moonbeam"

    ```bash
    anvil --fork-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    anvil --fork-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    anvil --fork-url {{ networks.moonbase.rpc_url }}
    ```

您的 fork 实例将拥有 10 个预先注资 10,000 个测试 token 的开发账户。fork 实例可在 `http://127.0.0.1:8545/` 上使用。终端中的输出应类似于以下内容：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/fork-anvil.md'

要验证您是否已 fork 网络，可以查询最新的区块号：

```bash
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

如果您将 `result` 从 [十六进制转换为十进制](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=\_blank}，您应该获得从您 fork 网络时开始的最新区块号。您可以使用 [区块浏览器](/builders/get-started/explorers/){target=\_blank} 交叉引用区块号。

从这里，您可以将新合约部署到您的 Moonbeam fork 实例，或者与已经部署的合约进行交互。在此指南的前一个示例的基础上，您可以使用 Cast 进行调用，以检查您部署合约的账户中已铸造的 MYTOK token 的余额：

```bash
cast call INSERT_CONTRACT_ADDRESS  "balanceOf(address)(uint256)" INSERT_YOUR_ADDRESS --rpc-url http://localhost:8545
```

## 使用 Chisel {: #using-chisel }

Chisel 是一个 Solidity REPL 或 shell。它允许开发者直接在控制台编写 Solidity 来测试小段代码，让您可以跳过项目设置和合约部署等本应快速完成的流程。

由于 Chisel 主要用于快速测试，它可以在 Foundry 项目之外使用。但如果在 Foundry 项目中执行，它会在运行时沿用 `foundry.toml` 的配置。

在本示例中，您将测试 Solidity 中 `abi` 的一些功能，因为它足够复杂，能展示 Chisel 的用途。要开始使用 Chisel，请在命令行运行以下命令以启动 shell：

```bash
chisel
```

在 shell 中，您可以像在函数内运行一样编写 Solidity 代码：

```solidity
bytes memory myData = abi.encode(100, true, "Develop on Moonbeam");
```

假设您想了解 `abi` 如何编码数据，因为您在研究如何更高效地在区块链上存储数据从而节省 gas。要查看 `myData` 在内存中的存储方式，可以在 Chisel shell 中使用以下命令：

```bash
!memdump
```

`memdump` 会导出当前会话中的所有数据。您很可能会看到类似下面的输出。如果您不擅长阅读十六进制，或者不了解 ABI 编码的工作方式，可能无法找到 `myData` 变量存储的位置。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/memdump.md'

幸运的是，Chisel 可以轻松帮您找出这些信息存储的位置。使用 `!rawstack` 命令，可以找到变量值在栈中的位置：

```bash
!rawstack myData
```

在这种情况下，由于 bytes 超过 32 字节，显示的是内存指针。但这正是所需信息，因为您已经通过 `!memdump` 命令了解了整个栈的内容。

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/rawstack.md'

`!rawstack` 命令显示 `myData` 变量存储在 `0x80`，因此与 `!memdump` 命令得到的内存转储进行对比后，可以看到 `myData` 的存储方式如下：

```text
[0x80:0xa0]: 0x00000000000000000000000000000000000000000000000000000000000000a0
[0xa0:0xc0]: 0x0000000000000000000000000000000000000000000000000000000000000064
[0xc0:0xe0]: 0x0000000000000000000000000000000000000000000000000000000000000001
[0xe0:0x100]: 0x0000000000000000000000000000000000000000000000000000000000000060
[0x100:0x120]: 0x0000000000000000000000000000000000000000000000000000000000000013
[0x120:0x140]: 0x446576656c6f70206f6e204d6f6f6e6265616d00000000000000000000000000
```

乍一看这很合理，因为 `0xa0` 的值是 `0x64`，即 100，而 `0xc0` 的值是 `0x01`，即 true。如果想进一步了解 ABI 编码的工作方式，可以参考 [Solidity 文档中的 ABI 说明](https://docs.soliditylang.org/en/v0.8.18/abi-spec.html){target=\_blank}。在这种数据打包方式中有大量的零，作为智能合约开发者，您可能会尝试使用结构体或通过按位操作将数据更高效地打包在一起。

完成这段代码后，您可以清理 Chisel 的状态，避免干扰后续想要尝试的逻辑（在同一 Chisel 实例内运行）：

```bash
!clear
```

使用 Chisel 还有更简单的测试方法。当代码以分号（`;`）结尾时，Chisel 会将其作为语句运行，并将其值存储在 Chisel 的运行时状态中。但如果您只需要查看 ABI 编码数据的表示形式，那么可以直接将代码作为表达式运行。要用相同的 `abi` 示例试试看，请在 Chisel shell 中输入：

```bash
abi.encode(100, true, "Develop on Moonbeam")
```

您应该会看到类似下面的内容：

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/expression.md'

虽然显示方式不同，但您仍然得到了数据的内容，并且还能进一步拆解编码信息，例如 `0xa0` 的值表示数据长度。

默认情况下，离开 Chisel shell 时不会持久化数据。但您可以指示 Chisel 进行持久化。例如，可以按以下步骤存储一个变量：

1. 在 Chisel 中存储一个 `uint256`

    ```bash
    uint256 myNumber = 101;
    ```

1. 使用 `!save` 保存会话。在此示例中，可以使用数字 `1` 作为保存 ID

    ```bash
    !save 1
    ```

1. 退出会话

    ```bash
    !quit
    ```

然后，要查看和操作已保存的 Chisel 状态，可以执行以下步骤：

1. 查看已保存的 Chisel 状态列表

    ```bash
    chisel list
    ```

1. 加载已保存的状态

    ```bash
    chisel load 1
    ```

1. 查看前面步骤中保存在 Chisel 中的 `uint256`

    ```bash
    !rawstack myNumber
    ```

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/save-state.md'

您甚至可以在使用 Chisel 时 fork 网络：

```bash
!fork {{ networks.moonbase.rpc_url }}
```

例如，可以查询 Moonbase Alpha 某个候选节点的余额：

```text
{{ networks.moonbase.staking.candidates.address1 }}.balance
```

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/query-balance.md'

如果想进一步了解 Chisel，请下载 Foundry 并参考其[官方参考页面](https://getfoundry.sh/chisel/reference/){target=\_blank}。

## 将 Foundry 与 Hardhat 结合使用 {: #foundry-with-hardhat }

很多时候，您想要集成的项目全部基于 [Hardhat](/builders/ethereum/dev-env/hardhat/){target=\_blank} 搭建，要将整个项目转换为 Foundry 非常费力。通过创建同时使用 Hardhat 和 Foundry 功能的混合项目，可以避免这部分额外工作。借助 Hardhat 的 [hardhat-foundry 插件](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-foundry){target=\_blank} 可以实现。

要将现有的 Foundry 项目转换为混合项目，本质上需要在同一文件夹中安装一个 Hardhat 项目：

```bash
npm init
npm install --save-dev hardhat @nomicfoundation/hardhat-foundry
npx hardhat init
```

更多信息请参考我们关于[创建 Hardhat 项目](/builders/ethereum/dev-env/hardhat/#creating-a-hardhat-project){target=\_blank}的文档。

初始化新的 Hardhat 项目后，会出现几个新的文件夹和文件：`contracts`、`hardhat.config.js`、`scripts` 和 `test/Lock.js`。您需要进行一些修改来创建混合项目：

1. 编辑仓库中的 `hardhat.config.js` 文件。打开它并在顶部添加以下内容：

    ```javascript
    require("@nomicfoundation/hardhat-foundry");
    ```

    添加 `hardhat-foundry` 插件后，Hardhat 的常规 `contracts` 文件夹将无法使用，因为此时 Hardhat 期望所有智能合约都存储在 Foundry 的 `src` 文件夹中

1. 将 `contracts` 文件夹中的所有智能合约移动到 `src` 文件夹，然后删除 `contracts` 文件夹

1. 编辑 `foundry.toml` 文件，确保通过 Git 子模块和 npm 安装的依赖项都能被 Forge 编译。编辑 `profile.default`，确保 `libs` 项同时包含 `lib` 和 `node_modules`：

    ```toml
    [profile.default]
    src = 'src'
    out = 'out'
    libs = ['lib', 'node_modules']
    solc = '0.8.20'
    evm_version = 'london'
    ```

现在，无论依赖项来自哪里，`forge build` 和 `npx hardhat compile` 都可以正常运行。

`forge test` 和 `npx hardhat test` 此时都可以访问所有智能合约和依赖项。`forge test` 只会运行 Solidity 测试，而 `npx hardhat test` 只会运行 JavaScript 测试。如果想配合使用，可以在 `package.json` 中创建一个新的脚本：

```json
"scripts": {
    "test": "npx hardhat test && forge test"
}
```

您可以通过以下命令运行该脚本：

```bash
npm run test
```

最后，虽然非必需，但可以将 `scripts` 文件夹中的所有 JavaScript 脚本移到 Foundry 的 `script` 文件夹，并删除 `scripts` 文件夹，以避免有两个用途相同的文件夹。

--8<-- 'text/_disclaimers/third-party-content.md'
