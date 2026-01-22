---
title: 运行 Moonbeam 开发节点
description: 按照本教程学习如何启动您的第一个 Moonbeam 开发节点，如何为开发目的对其进行配置以及如何连接到它。
categories: Basics
---


# Moonbeam本地开发节点入门

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/-bRooBW2g0o' frameborder='0' allowfullscreen></iframe></div>

<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 简介 {: #introduction }

Moonbeam 开发节点是您自己的个人开发环境，用于在 Moonbeam 上构建和测试应用程序。对于以太坊开发人员来说，它与 Hardhat 网络类似。它使您能够快速轻松地开始，而无需中继链的开销。您可以使用 `--sealing` 选项启动节点，以便在收到交易后立即、手动或以自定义间隔创建区块。默认情况下，当收到交易时，将创建一个区块，这类似于 Hardhat 网络 instamine 功能的默认行为。

如果您按照本指南操作到最后，您将拥有一个 Moonbeam 开发节点在您的本地环境中运行，其中包含 10 个预先资助的 [帐户](#pre-funded-development-accounts)。

!!! note

    本教程是使用 \[Moonbase Alpha\](https://github.com/moonbeam-foundation/moonbeam/releases/tag/{{ networks.development.build_tag }}){target=\_blank} 的 {{ networks.development.build_tag }} 标签创建的。Moonbeam 平台及其依赖的 [Frontier](https://github.com/polkadot-evm/frontier){target=\_blank} 组件来实现基于 Substrate 的以太坊兼容性，目前仍在非常积极的开发中。

    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 启动 Moonbeam 开发节点 {: #spin-up-a-node }

有两种方法可以开始运行 Moonbeam 节点。您可以使用 [Docker 运行预构建的二进制文件](#getting-started-with-docker)，也可以[在本地编译二进制文件](#getting-started-with-the-binary-file) 并自己设置开发节点。使用 Docker 是一种快速便捷的入门方式，因为您无需安装 Substrate 和所有依赖项，也可以跳过节点构建过程。它确实要求您[安装 Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}。另一方面，如果您决定完成构建开发节点的过程，则可能需要大约 30 分钟或更长时间才能完成，具体取决于您的硬件。

### 使用 Docker 启动节点 {: #getting-started-with-docker }

使用 Docker 可以在几秒钟内启动一个节点。安装 Docker 后，您可以按照以下步骤启动您的节点：

1. 执行以下命令来下载最新的 Moonbeam 镜像：

    ```bash
    docker pull moonbeamfoundation/moonbeam:{{ networks.development.build_tag }}
    ```

    控制台日志的尾部应如下所示：

    --8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/docker-pull.md'

1. 运行以下 Docker 命令启动 Moonbeam 开发节点，该命令将以即时密封模式启动节点以进行本地测试，以便在收到交易时立即生成区块：

    === "Ubuntu"
        
        ```bash
        docker run --rm --name {{ networks.development.container_name }} --network host \
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        ```

    === "MacOS"

        ```bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        ```

    === "Windows"
    
        ```bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
          moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} ^
          --dev --rpc-external
        ```

    !!! note "适用于 Apple Silicon 用户"

        如果 Docker 命令在 Apple Silicon 上失败或行为异常，请在 Docker Desktop 设置中启用 **Use Rosetta for x86_64/amd64 emulation on Apple Silicon**，并对 pull 和 run 命令使用 `amd64` 平台：

        ```bash
        docker pull --platform=linux/amd64 moonbeamfoundation/moonbeam:{{ networks.development.build_tag }}
        ```

        ```bash
        docker run --rm --platform=linux/amd64 --name {{ networks.development.container_name }} -p 9944:9944 \
          moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
          --dev --rpc-external
        ```

        如果性能仍然不足，请考虑[使用二进制文件启动节点](#getting-started-with-the-binary-file)。

如果成功，您应该看到一个输出，显示一个空闲状态，等待区块被生成：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/docker-run.md'

有关示例中使用的一些标志和选项的更多信息，请查看 [Flags](#node-flags) 和 [Options](#node-options)。如果您想查看所有标志、选项和子命令的完整列表，请运行以下命令打开帮助菜单：

```bash
docker run --rm --name {{ networks.development.container_name }} \
  moonbeamfoundation/moonbeam \
  --help
```

要继续本教程，下一节不是必需的，因为您已经使用 Docker 启动了一个节点。您可以跳到 [配置您的 Moonbeam 开发节点](#configure-moonbeam-dev-node) 部分。

### 使用二进制文件启动节点 {: #getting-started-with-the-binary-file }

除了使用 Docker 之外，您还可以使用 Moonbeam 二进制文件启动节点。此方法更耗时。根据您的硬件，此过程可能需要大约 30 分钟才能完成。

!!! note

    如果您知道自己在做什么，您可以直接从 [Moonbeam 发布页面](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} 下载附加到每个版本的预编译二进制文件。这些不适用于所有系统。例如，这些二进制文件仅适用于具有特定依赖项版本的 x86-64 Linux。确保兼容性的最安全方法是在将要运行它的系统上编译二进制文件。

要构建二进制文件，您可以采取以下步骤：

1. 克隆 Moonbeam 仓库的特定标签，您可以在 [Moonbeam GitHub 仓库](https://github.com/moonbeam-foundation/moonbeam){target=\_blank} 上找到它：

    ```bash
    git clone -b {{ networks.development.build_tag }} https://github.com/moonbeam-foundation/moonbeam
    cd moonbeam
    ```

    !!! note

        安装文件路径中的空格会导致编译错误。

1. 检查是否已安装 Rust。如果已安装 Rust，请跳过接下来的两个步骤。否则，通过执行 [Rust 推荐的方法](https://rust-lang.org/tools/install/){target=\_blank} 安装 Rust 及其先决条件：

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/installrust.md'
    ```

1. 通过运行以下命令更新您的 PATH 环境变量：

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
    ```

1. 通过运行以下命令构建开发节点：

    !!! note

        如果您使用的是 Ubuntu 20.04 或 22.04，那么您需要确保在构建二进制文件之前安装了这些额外的依赖项：

        ```bash
        apt install clang protobuf-compiler libprotobuf-dev pkg-config libssl-dev -y
        ```

        对于 MacOS 用户，可以通过 Homebrew 安装这些依赖项：

        ```bash
        brew install llvm
        brew install protobuf
        ```

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/build.md'
    ```

    以下是构建输出的尾部应显示的内容：

    --8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/compile.md'

!!! note

    初始构建需要一段时间。根据您的硬件，您应该预计构建过程大约需要 30 分钟才能完成。

然后，您将希望使用以下命令在开发模式下运行节点：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'
```

!!! note

    对于不熟悉 Substrate 的人来说，`--dev` 标志是一种在单节点开发者配置中运行基于 Substrate 的节点以进行测试的方式。当您使用 `--dev` 标志运行节点时，您的节点会在全新状态下启动，并且其状态不会持久存在。

您应该会看到如下所示的输出，显示一个空闲状态，等待生成区块：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/run-binary.md'

有关示例中使用的一些标志和选项的更多信息，请查看 [标志](#node-flags) 和 [选项](#node-options)。如果您想查看所有标志、选项和子命令的完整列表，请通过运行以下命令打开帮助菜单：

```bash
./target/release/moonbeam --help
```

## 配置您的 Moonbeam 开发节点 {: #configure-moonbeam-dev-node }

既然您已经知道如何启动并运行标准的 Moonbeam 开发节点，您可能想知道如何配置它。以下部分将介绍您启动节点时可以使用的常见配置。

### 配置节点的常用标志 {: #node-flags }

标志不接受参数。要使用标志，请将其添加到命令的末尾。例如：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'
```

- **`--dev`** - 指定开发链
- **`--tmp`** - 运行一个临时节点，在该节点中，所有配置将在进程结束时删除
- **`--rpc-external`** - 侦听所有 RPC 和 WebSocket 接口

### 配置节点的常用选项 {: #node-options }

选项接受选项右侧的参数。例如：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnodewithsealinginterval.md'
```

- **`-l <log pattern>` 或 `--log <log pattern>`** - 设置自定义日志过滤器。日志模式的语法是 `<target>=<level>`。例如，要打印所有的 JSON-RPC 日志，命令如下所示：`-l json=trace`
- **`--sealing <interval>`** - 块在开发服务中应该被密封的时间。interval 接受的参数：`instant`、`manual` 或表示定时器间隔的毫秒数（例如，`6000` 将使节点每 6 秒生成一次块）。默认值为 `instant`。有关更多信息，请参阅下面的 [配置区块生产](#configure-block-production) 部分
- **`--rpc-port <port>`** - 设置 HTTP 和 WS 连接的统一端口。接受一个端口作为参数。默认为 {{ networks.parachain.rpc }}
- **`--ws-port <port>`** - *自 [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank} 起已弃用，请改用 `--rpc-port` 进行 HTTP 和 WS 连接* - 设置 WebSockets RPC 服务器 TCP 端口。从 [client v0.30.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.30.0){target=\_blank} 开始，它为 HTTP 和 WS 连接设置统一端口。接受一个端口作为参数
- **`--rpc-max-connections <connections>`** - 指定组合的 HTTP 和 WS 连接限制。默认为 100 个连接
- **`--ws-max-connections <connections>`** - *自 [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank} 起已弃用，请改用 `--rpc-max-connections` 限制 HTTP 和 WS 连接* - 此标志调整组合的 HTTP 和 WS 连接限制。默认为 100 个连接
- **`--rpc-cors <origins>`** - 指定允许访问 HTTP 和 WS RPC 服务器的浏览器来源。来源可以是允许访问的来源的逗号分隔列表，或者您也可以指定 `null`。当运行开发节点时，默认是允许所有来源

有关标志和选项的完整列表，请启动您的 Moonbeam 开发节点，并在命令末尾添加 `--help`。

### 配置区块生产 {: #configure-block-production }

默认情况下，您的 Moonbeam 开发节点以即时密封模式启动，即在收到交易后立即生成区块。但是，您可以使用 `--sealing` 选项指定何时生成或密封区块。

`--sealing` 标志接受以下任何参数：

- `instant` - 正如我们已经介绍过的，这是默认选项，即在收到交易后立即生成区块
- `manual` - 允许您手动生成区块。如果收到交易，则在您手动创建一个区块之前，不会生成区块
- 毫秒为单位的时间间隔 - 以特定的时间间隔生成区块。例如，如果您将其设置为 `6000`，则节点将每 6 秒生成一个区块

该标志应以下列格式附加到启动命令：

```bash
--sealing <interval>
```

如果您选择 `manual`，则需要手动创建区块，这可以通过 `engine_createBlock` JSON-RPC 方法来完成：

```text
engine_createBlock(createEmpty: *bool*, finalize: *bool*, parentHash?: *BlockHash*)
```

例如，您可以使用以下代码段通过 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} 手动创建一个区块，这是一个以太坊库，可以轻松地与 JSON-RPC 方法进行交互：

```js
import { ethers } from 'ethers';

const produceBlock = async () => {
  // Connect to the Ethereum node (if applicable, replace the URL with your node's address)
  const provider = new ethers.JsonRpcProvider('{{ networks.development.rpc_url }}');

  // Set the custom JSON-RPC method and parameters
  const method = 'engine_createBlock';
  const params = [true, true, null];

  try {
    // Send the custom JSON-RPC call
    const result = await provider.send(method, params);
    console.log(result);
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error:', error.message);
  }
};

produceBlock();
```

!!! note

    如果您不熟悉 Ethers，请参阅 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} 文档页面以了解更多信息。

## 预充值开发账户 {: #pre-funded-development-accounts }

Moonbeam 有一个[统一账户](learn/core-concepts/unified-accounts/){target=\_blank}系统，使用户能够拥有一个以太坊风格的 H160 账户，该账户可以与 Substrate API 和以太坊 API 交互。因此，您可以通过 [Polkadot.js Apps](tokens/connect/polkadotjs/#connect-polkadotjs-apps){target=\_blank} 或 [MetaMask](tokens/connect/metamask/){target=\_blank}（或任何其他 [EVM 钱包](tokens/connect/){target=\_blank}）与您的账户进行交互。此外，您还可以使用其他[开发工具](builders/ethereum/dev-env/){target=\_blank}，例如 [Remix](builders/ethereum/dev-env/remix/){target=\_blank} 和 [Hardhat](builders/ethereum/dev-env/hardhat/){target=\_blank}。

您的 Moonbeam 开发节点附带十个已预先充值的以太坊风格的帐户，用于开发。这些地址源自 Substrate 的规范开发助记词：

```text
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

??? note "开发账户地址和私钥"

    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'

开发节点还包含一个用于测试目的的额外预充值帐户：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

您可以使用这些账户的私钥将它们连接到 [MetaMask](/tokens/connect/metamask/){target=\_blank}、[Talisman](/tokens/connect/talisman/){target=\_blank}、[Polkadot.js Apps](/tokens/connect/polkadotjs/){target=\_blank} 等。

## 开发节点端点 {: #access-your-development-node }

您可以使用以下 RPC 和 WSS 端点访问您的 Moonbeam 开发节点：

=== "HTTP"

    ```
    {{ networks.development.rpc_url }}
    ```

=== "WSS"

    ```
    {{ networks.development.wss_url }}
    ```

## 区块浏览器 {: #block-explorers }

对于 Moonbeam 开发节点，您可以使用以下任何一个区块浏览器：

- **Substrate API** — [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer){target=\_blank}，位于 WS 端口 `{{ networks.parachain.ws }}` 上
- **基于 Ethereum API JSON-RPC** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbeamDevNode){target=\_blank}，位于 HTTP 端口 `{{ networks.parachain.ws }}` 上

## Debug, Trace, 和 TxPool APIs {: #debug-trace-txpool-apis }

您还可以通过运行跟踪节点来访问一些非标准的 RPC 方法，这允许开发人员在运行时检查和调试交易。跟踪节点使用与标准 Moonbeam 开发节点不同的 Docker 镜像。

要了解如何运行 Moonbeam 开发跟踪节点，请查看[运行跟踪节点](/node-operators/networks/tracing-node/){target=\_blank}指南，并确保在整个说明中切换到 **Moonbeam 开发节点**选项卡。然后，要使用跟踪节点访问非标准 RPC 方法，请查看[Debug & Trace](/builders/ethereum/json-rpc/debug-trace/){target=\_blank}指南。

## 清理开发节点 {: #purging-your-node }

如果您想删除与您的节点相关联的数据，您可以清理它。清理节点的说明取决于您最初启动节点的方式。

### 清除通过 Docker 启动的节点 {: #purge-docker-node }

如果你使用 Docker 启动节点，并通过 `-v` 标志为容器指定了挂载目录，那么你需要清除该目录。为此，你可以运行以下命令：


```bash
sudo rm -rf {{ networks.moonbase.node_directory }}/*
```

如果你按照本指南的说明操作且未使用 `-v` 标志，你可以停止并移除 Docker 容器。相关数据也会随之一起删除。为此，你可以运行以下命令：

```bash
sudo docker stop `CONTAINER_ID` && docker rm `CONTAINER_ID`
```
### 清除通过二进制文件启动的节点 {: #purge-binary-node }

通过二进制文件运行节点时，数据会存储在本地目录中，通常位于 `~/.local/shared/moonbeam/chains/development/db`。如果你想启动一个全新的节点实例，你可以删除该文件夹中的内容，或者在 `moonbeam` 文件夹内运行以下命令：


```bash
./target/release/moonbeam purge-chain --dev -y
```

这将删除数据文件夹。请注意，所有链数据都会因此丢失。如需了解所有可用的 `purge-chain` 命令，请参阅我们文档中的 [清除二进制数据](node-operators/networks/run-a-node/systemd/#purging-compiled-binary){target=\_blank} 部分。
