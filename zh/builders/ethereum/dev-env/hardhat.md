---
title: 使用 Hardhat 部署合约
description: 了解如何使用 Hardhat（一种以太坊开发环境）在 Moonbeam 上编译、部署和调试 Solidity 智能合约。
categories: Dev Environments, Ethereum Toolkit
---

# 使用 Hardhat 部署到 Moonbeam

## 简介 {: #introduction }

[Hardhat](https://hardhat.org){target=_blank} 是一个灵活且可扩展的以太坊开发环境，可以简化智能合约的开发过程。由于 Moonbeam 与以太坊兼容，因此您可以使用 Hardhat 在 Moonbeam 上开发和部署智能合约。

Hardhat 采用基于任务的开发方法，您可以在其中定义和执行[任务](https://hardhat.org/hardhat-runner/docs/advanced/create-task){target=_blank}，以执行特定操作。这些操作包括编译和部署合约、运行测试等等。任务是高度可配置的，因此您可以创建、自定义和执行适合您需求的任务。

您还可以通过使用[插件](https://hardhat.org/hardhat-runner/plugins){target=_blank}来扩展 Hardhat 的功能。插件是与 Hardhat 集成的外部扩展，可为您的工作流程提供额外的功能和工具。例如，有一些用于常见以太坊库的插件，例如 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank} 和 [viem](/builders/ethereum/libraries/viem/){target=_blank}，一个扩展 Chai 断言库以包含以太坊特定功能的插件等等。所有这些插件都可用于扩展您在 Moonbeam 上的 Hardhat 项目。

本指南将简要介绍 Hardhat，并向您展示如何使用 Hardhat 在 Moonbase Alpha 测试网上编译、部署和调试以太坊智能合约。本指南也适用于 Moonbeam、Moonriver 或 Moonbeam 开发节点。以下内容针对的是 Hardhat 3（当前版本：3.0.17）。

请注意，虽然 Hardhat 附带一个 [Hardhat Network](https://hardhat.org/docs#hardhat-network){target=_blank} 组件，该组件提供本地开发环境，但您应该改用[本地 Moonbeam 开发节点](/builders/get-started/networks/moonbeam-dev/){target=_blank}。您可以像连接任何其他网络一样，将 Moonbeam 开发节点连接到 Hardhat。

## 检查先决条件 {: #checking-prerequisites }

要开始，您需要以下内容：

- 拥有 Node.js 22.10.0 或更高版本（Hardhat 3 仅支持偶数编号的 LTS 版本）和 npm
- 已[安装MetaMask](/tokens/connect/metamask/#install-the-metamask-extension){target=_blank}并[连接到Moonbase Alpha](/tokens/connect/metamask/#connect-metamask-to-moonbeam){target=_blank}。
- 拥有一个有资金的帐户。
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- --8<-- 'text/_common/endpoint-examples-list-item.md'

## 创建 Hardhat 项目 {: #creating-a-hardhat-project }

如果您还没有 Hardhat 项目，您需要创建一个。您可以通过完成以下步骤来创建一个：

1. 为您的项目创建一个目录。

    ```bash
    mkdir hardhat && cd hardhat
    ```

2. 初始化项目，这将创建一个 `package.json` 文件。

    ```bash
    npm init -y
    ```

3. 安装 Hardhat。

    ```bash
    npm install --save-dev hardhat
    ```

4. 创建一个 Hardhat 项目。

    ```bash
    npx hardhat --init
    ```

    !!! note
        `npx` 用于运行本地安装在项目中的可执行文件。虽然 Hardhat 可以全局安装，但建议在每个项目中本地安装，以便您可以按项目控制版本。

5. 系统将提示您一系列问题来设置您的项目：

    - 选择 **Hardhat 3 Beta (推荐用于新项目)** 而不是 Hardhat 2。
    - 选择初始化项目的位置（默认为当前目录）。
    - 确认转换为 ESM（Hardhat v3 需要）。
    - 选择要初始化的项目类型：
        - 一个使用 Node Test Runner 和 viem 的 TypeScript Hardhat 项目
        - 一个使用 Mocha 和 Ethers.js 的 TypeScript Hardhat 项目

    对于此示例，您可以根据自己的偏好选择任一选项。如果您选择 Mocha 和 Ethers.js 选项，您将获得一个具有以下结构的项目：
    
    - `contracts/Counter.sol` 中的示例合约
    - `test/Counter.ts` 中的测试文件
    - TypeScript 配置
    - Mocha 和 Ethers.js 依赖项

    该项目将设置为所有必要的依赖项和配置，以便您可以开始开发。

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/hardhat-create.md'

## Hardhat 配置文件 {: #hardhat-configuration-file }

Hardhat 配置文件是进入 Hardhat 项目的入口点。它定义了 Hardhat 项目的各种设置和选项，例如要使用的 Solidity 编译器版本以及可以将合约部署到的网络。

如果您正在使用 JavaScript，请在您的 `package.json` 中保留 `"type": "module"`。一个最小的 `hardhat.config.js` 看起来像这样：

```js
import { defineConfig } from 'hardhat/config';

export default defineConfig({
  solidity: '0.8.28',
});
```

如果您选择了 TypeScript 模板，则该文件将为 `hardhat.config.ts`，并且配置内容将相同。对于此示例，您可以将 Solidity 编译器版本保持在 `0.8.28`；但是，如果您正在使用需要更高版本的合约，请不要忘记在此处更新它。

如果您的项目模板未添加本指南中使用的插件和库，请安装它们：

```bash
npm install --save-dev @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-ignition-ethers @nomicfoundation/hardhat-keystore ethers
```

接下来，您需要修改您的配置文件以添加要将合约部署到的网络的网络配置。对于 Moonbeam 网络，您需要指定以下内容：

- **`url`**: 节点的 [RPC 端点](/builders/get-started/endpoints/){target=_blank}。
- **`chainId`**: 链 ID，用于验证网络。
- **`accounts`**: 可用于部署和与合约交互的帐户。您可以输入帐户私钥的数组，也可以使用 [HD 钱包](https://github.com/ethereumbook/ethereumbook/blob/develop/src/chapter_5.md#hierarchical-deterministic-wallets-bip-32bip-44){target=_blank}。
- **`type`**: 对于 Moonbeam 上的外部 RPC 网络，请设置 `type: 'http'`。
- **`chainType`**: 对于 Moonbeam 网络，请设置 `chainType: 'l1'`。

Hardhat 通过 `@nomicfoundation/hardhat-keystore` 插件包含一个加密的密钥管理器，它可以将敏感数据保存在源代码控制之外。安装并导入插件后，使用密钥库设置您的密钥：

=== "Moonbeam"

    ```bash
    npx hardhat keystore set MOONBEAM_RPC_URL
    npx hardhat keystore set MOONBEAM_PRIVATE_KEY
    ```

=== "Moonriver"

    ```bash
    npx hardhat keystore set MOONRIVER_RPC_URL
    npx hardhat keystore set MOONRIVER_PRIVATE_KEY
    ```

=== "Moonbase Alpha"

    ```bash
    npx hardhat keystore set MOONBASE_RPC_URL
    npx hardhat keystore set MOONBASE_PRIVATE_KEY
    ```

=== "Moonbeam Dev"

    ```bash
    npx hardhat keystore set DEV_RPC_URL
    npx hardhat keystore set DEV_PRIVATE_KEY
    ```

!!! warning
    Hardhat 控制台任务当前不会提示输入密钥库密码。在运行 `npx hardhat console` 之前，请为您的配置变量使用环境变量，或者在使用密钥库时，通过脚本/任务而不是控制台进行交互。

然后，更新您的配置文件以使用加密的密钥和 ESM 语法：

=== "Moonbeam"

```js
import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    moonbeam: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('MOONBEAM_RPC_URL'),
      chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
      accounts: [configVariable('MOONBEAM_PRIVATE_KEY')],
    },
  },
});
```

=== "Moonriver"

```js
import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    moonriver: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('MOONRIVER_RPC_URL'),
      chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
      accounts: [configVariable('MOONRIVER_PRIVATE_KEY')],
    },
  },
});
```

=== "Moonbase Alpha"

```js
import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    moonbase: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('MOONBASE_RPC_URL'),
      chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
      accounts: [configVariable('MOONBASE_PRIVATE_KEY')],
    },
  },
});
```

=== "Moonbeam Dev"

```js
import hardhatEthers from '@nomicfoundation/hardhat-ethers';
import hardhatIgnitionEthers from '@nomicfoundation/hardhat-ignition-ethers';
import hardhatKeystore from '@nomicfoundation/hardhat-keystore';
import { configVariable, defineConfig } from 'hardhat/config';

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
  solidity: '0.8.28',
  networks: {
    dev: {
      type: 'http',
      chainType: 'l1',
      url: configVariable('DEV_RPC_URL'),
      chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
      accounts: [configVariable('DEV_PRIVATE_KEY')],
    },
  },
});
```

当您运行需要这些密钥的任务时，Hardhat 将提示您输入密码以解密它们。密钥仅在需要时才会被解密，这意味着只有当 Hardhat 任务使用密钥时，您才需要输入密码。

如果您计划在您的项目中使用任何插件，您需要安装该插件并将其导入到您的 Hardhat 配置文件 (`hardhat.config.ts` 或 `hardhat.config.js`) 中。一旦导入了插件，它就会成为 [Hardhat 运行时环境](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment){target=_blank} 的一部分，并且您可以在任务、脚本等中利用该插件的功能。

有关可用配置选项的更多信息，请参阅 Hardhat 关于 [配置](https://hardhat.org/hardhat-runner/docs/config#networks-configuration){target=_blank} 的文档。

## 合约文件 {: #the-contract-file }

现在您已经配置了您的项目，您可以通过创建智能合约来开始开发过程。该合约将是一个简单的合约，允许您存储一个可以稍后检索的值，称为 `Box`。

要添加合约，您将采取以下步骤：

1. 更改到 `contracts` 目录。

    ```bash
    cd contracts
    ```

2. 创建一个 `Box.sol` 文件。

    ```bash
    touch Box.sol
    ```

3. 打开文件并将以下合约添加到其中：

    ```solidity
    // contracts/Box.sol
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.1;

    contract Box {
        uint256 private value;

        // Emitted when the stored value changes
        event ValueChanged(uint256 newValue);

        // Stores a new value in the contract
        function store(uint256 newValue) public {
            value = newValue;
            emit ValueChanged(newValue);
        }

        // Reads the last stored value
        function retrieve() public view returns (uint256) {
            return value;
        }
    }
    ```

## 编译合约 {: #compiling-solidity }

下一步是编译 `Box.sol` 智能合约。为此，您可以使用内置的 `compile` 任务，该任务将在 `contracts` 目录中查找 Solidity 文件，并使用 Hardhat 配置文件中定义的版本和编译器设置来编译它们。

要使用 `compile` 任务，您只需运行：

```bash
npx hardhat compile
```

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/compile.md'

编译后，将创建一个 `artifacts` 目录，其中包含合约的字节码和元数据，它们是 `.json` 文件。最好将此目录添加到 `.gitignore` 文件中。

如果在编译合约后对其进行了更改，则可以使用相同的命令再次编译它。Hardhat 将查找任何更改并重新编译合约。如果未找到任何更改，则不会编译任何内容。如果需要，您可以使用 `clean` 任务强制编译，这将清除缓存并删除旧的构件。

## 部署合约 {: #deploying-the-contract }

要部署合约，您将使用 Hardhat Ignition，这是一个用于部署智能合约的声明式框架。Hardhat Ignition 旨在简化智能合约部署和测试相关的重复性任务的管理。有关更多信息，请务必查看 [Hardhat Ignition 文档](https://hardhat.org/ignition/docs/getting-started#overview){target=\_blank}。

要为您的 Ignition 模块设置正确的文件结构，请创建一个名为 `ignition` 的文件夹和一个名为 `modules` 的子目录。然后，在其中添加一个名为 `Box.js` 的新文件。您可以使用以下命令执行所有这三个步骤：

```bash
cd ignition/modules && touch Box.js
```

接下来，您可以编写 Hardhat Ignition 模块。要开始，请执行以下步骤：

1. 从 Hardhat Ignition 模块导入 `buildModule` 函数。
2. 使用 `buildModule` 导出模块。
3. 使用 `getAccount` 方法选择部署者账户。
4. 部署 `Box` 合约。
5. 从模块返回一个对象。这使得 `Box` 合约可以在 Hardhat 测试和脚本中进行交互。

```js
// 1. Import the `buildModule` function from the Hardhat Ignition module
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

// 2. Export a module using `buildModule`
// Use `export default` instead of `module.exports`
export default buildModule('BoxModule', (m) => {
  // 3. Use the `getAccount` method to select the deployer account
  const deployer = m.getAccount(0);

  // 4. Deploy the `Box` contract
  const box = m.contract('Box', [], {
    from: deployer,
  });

  // 5. Return an object from the module
  return { box };
});
```

要运行脚本并部署 `Box.sol` 合约，请使用以下命令，该命令要求您指定在 Hardhat 配置文件中定义的网络名称。如果您未指定网络，则 hardhat 默认会将合约部署到本地 Hardhat 网络。

```bash
npx hardhat ignition deploy ./ignition/modules/Box.js --network moonbase
```

!!! note
    如果您使用的是另一个 Moonbeam 网络，请确保指定正确的网络。网络名称需要与 Hardhat 配置文件中定义的名称匹配。

系统将提示您输入 Hardhat secrets manager 的密码。接下来，系统将提示您确认要部署到的网络。确认后几秒钟，合约将被部署，您将在终端中看到合约地址。

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/deploy-moonbase.md'

恭喜，您的合约已上线！保存该地址，您将在下一步中使用它与此合约实例进行交互。

## 与合约交互 {: #interacting-with-the-contract }

您可以使用 Hardhat 通过两种方式与新部署的合约进行交互：从辅助脚本运行控制台样式的命令（推荐用于 Hardhat 3），或重用该脚本以通过 `run` 任务自动执行交互。

### 运行脚本 {: #run-the-script }

使用 `run` 任务对已部署的 `Box` 合约执行辅助脚本，以便您可以验证密钥库解锁流程是否正常，并确认合约将新值存储在 Moonbase Alpha 上。

sh
npx hardhat run --network moonbase scripts/box-console.ts

系统将提示您输入 Hardhat 密钥库密码（如果您使用的是加密密钥），之后脚本将连接到 Moonbase Alpha，附加到您部署的 `Box` 合约，并记录调用 `store(5n)` 前后存储的值。 运行后，您应该看到类似于以下的输出：

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/interact.md'

该脚本会打印正在使用的签名者、交易前存储的值、提交的交易哈希以及调用 `store(5n)` 后更新的值。

## Hardhat 分叉 {: #hardhat-forking }

您可以使用 Hardhat [分叉](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks){target=_blank} 任何与 EVM 兼容的链，包括 Moonbeam。分叉在本地模拟实时 Moonbeam 网络，使您能够在本地测试环境中与 Moonbeam 上部署的合约进行交互。由于 Hardhat 分叉基于 EVM 实现，您可以使用 [Moonbeam 支持的标准 Ethereum JSON-RPC 方法](/builders/ethereum/json-rpc/eth-rpc/){target=_blank} 和 [Hardhat](https://hardhat.org/hardhat-network/docs/reference#json-rpc-methods-support){target=_blank} 与分叉进行交互。

使用 Hardhat 分叉时，需要注意一些限制。您无法与任何 Moonbeam 预编译合约或其函数进行交互。预编译是 Substrate 实现的一部分，因此无法在模拟的 EVM 环境中复制。这禁止您与 Moonbeam 上的跨链资产以及基于 Substrate 的功能（如质押和治理）进行交互。

### 分叉 Moonbeam {: #forking-moonbeam }

您可以从命令行分叉 Moonbeam，或配置您的 Hardhat 项目以始终从您的 Hardhat 配置文件运行分叉。要分叉 Moonbeam 或 Moonriver，您需要拥有自己的端点和 API 密钥，您可以从支持的[端点提供商](/builders/get-started/endpoints/){target=_blank}之一获取。

要从命令行分叉 Moonbeam，您可以从 Hardhat 项目目录中运行以下命令：

===

    ```sh
npx hardhat node --fork {{ networks.moonbeam.rpc_url }}
    ```

===

    ```sh
npx hardhat node --fork {{ networks.moonriver.rpc_url }}
    ```

===

    ```sh
npx hardhat node --fork {{ networks.moonbase.rpc_url }}
    ```

如果您喜欢配置您的 Hardhat 项目，您可以使用以下配置更新您的 Hardhat 配置文件：

===

    ```js
...
networks: {
  hardhat: {
    forking: {
      url: '{{ networks.moonbeam.rpc_url }}',
    },
  },
},
...
    ```

===

    ```js
...
networks: {
  hardhat: {
    forking: {
      url: '{{ networks.moonriver.rpc_url }}',
    },
  },
},
...
    ```

===

    ```js
...
networks: {
  hardhat: {
    forking: {
      url: '{{ networks.moonbase.rpc_url }}',
    },
  },
},
...
    ```

当您启动 Hardhat 分叉时，您将拥有 20 个预先存入 10,000 个测试代币的开发帐户。 分叉实例可在 `http://127.0.0.1:8545/` 上找到。 终端中的输出应类似于以下内容：

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/private-keys.md'

要验证您是否已分叉网络，您可以查询最新的区块号：

```sh
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

如果您将 `result` 从 [十六进制转换为十进制](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=_blank}，您应该从分叉网络的时间获取最新的区块号。 您可以使用[区块浏览器](/builders/get-started/explorers/){target=_blank}交叉引用区块号。

从这里，您可以将新合约部署到 Moonbeam 的分叉实例，或通过创建已部署合约的本地实例来与已部署的合约进行交互。

要与已部署的合约进行交互，您可以使用 `ethers` 在 `scripts` 目录中创建一个新脚本。 因为您将使用 Hardhat 运行它，所以您可以直接从 Hardhat 运行时导入 `ethers`，而无需额外的设置。 在脚本中，您可以使用以下代码段访问网络上的实时合约：

```js
import { ethers } from 'hardhat';

async function main() {
  const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');

  const contract = new ethers.Contract(
    'INSERT_CONTRACT_ADDRESS',
    'INSERT_CONTRACT_ABI',
    provider
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

--8<-- 'text/_disclaimers/third-party-content.md'
