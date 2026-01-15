---
title: 运行 Moonbeam 开发节点
description: 按照本教程学习如何启动您的第一个 Moonbeam 开发节点，如何为开发目的对其进行配置，以及如何连接到它。
categories: 基础
---

# 本地 Moonbeam 开发节点入门

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/-bRooBW2g0o' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## 简介 {: #introduction }

Moonbeam 开发节点是您自己的个人开发环境，用于在 Moonbeam 上构建和测试应用程序。对于以太坊开发人员来说，它与 Hardhat Network 类似。它使您能够快速轻松地开始，而无需中继链的开销。您可以使用 `--sealing` 选项启动您的节点，以便在收到交易后立即、手动或以自定义间隔授权区块。默认情况下，当收到交易时将创建一个区块，这与 Hardhat Network 的 instamine 功能的默认行为类似。

如果您遵循本指南直到最后，您将拥有一个在您的本地环境中运行的 Moonbeam 开发节点，其中包含 10 个预先资助的[账户](#pre-funded-development-accounts)。

!!! note
    本教程是使用 [Moonbase Alpha](https://github.com/moonbeam-foundation/moonbeam/releases/tag/{{ networks.development.build_tag }}){target=_blank} 的 {{ networks.development.build_tag }} 标签创建的。Moonbeam 平台及其依赖的 [Frontier](https://github.com/polkadot-evm/frontier){target=_blank} 组件(实现基于 Substrate 的以太坊兼容性)仍在非常活跃的开发中。
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

## 启动 Moonbeam 开发节点 {: #spin-up-a-node }

启动并运行 Moonbeam 节点有两种方法。您可以使用 [Docker 运行预构建二进制文件](#getting-started-with-docker)，也可以[在本地编译二进制文件](#getting-started-with-the-binary-file)并自行设置开发节点。使用 Docker 是一种快速便捷的入门方式，因为您无需安装 Substrate 和所有依赖项，并且可以跳过节点构建过程。但是，您需要[安装 Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}。另一方面，如果您决定完成构建开发节点的过程，则可能需要大约 30 分钟或更长时间才能完成，具体取决于您的硬件。

### 使用 Docker 启动节点 {: #getting-started-with-docker }

使用 Docker 可以在几秒钟内启动一个节点。安装 Docker 后，您可以按照以下步骤启动节点：

1. 执行以下命令下载最新的 Moonbeam 镜像：

    bash
    docker pull moonbeamfoundation/moonbeam:{{ networks.development.build_tag }}
    

    控制台日志的末尾应如下所示：

    --8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/docker-pull.md'

2. 通过运行以下 Docker 命令来启动 Moonbeam 开发节点，该命令将在本地测试中以即时密封模式启动节点，以便在收到交易时立即生成区块：

    === "Ubuntu"

        bash
        docker run --rm --name {{ networks.development.container_name }} --network host \
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        

    === "MacOS"

        bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 \
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        

    === "Windows"

        bash
        docker run --rm --name {{ networks.development.container_name }} -p 9944:9944 ^
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} ^
        --dev --rpc-external
        

    !!! note "对于 Apple Silicon 用户"
        如果 Docker 命令在 Apple Silicon 上失败或行为异常，请在 Docker Desktop 设置中启用 **Use Rosetta for x86_64/amd64 emulation on Apple Silicon**，并对 pull 和 run 命令使用 `amd64` 平台：

        bash
        docker pull --platform=linux/amd64 moonbeamfoundation/moonbeam:{{ networks.development.build_tag }}
        

        bash
        docker run --rm --platform=linux/amd64 --name {{ networks.development.container_name }} -p 9944:9944 \
        moonbeamfoundation/moonbeam:{{ networks.development.build_tag }} \
        --dev --rpc-external
        

        如果性能仍然不足，请考虑[使用二进制文件启动节点](#getting-started-with-the-binary-file)。

如果成功，您应该看到一个输出，显示一个空闲状态，等待生成区块：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/docker-run.md'

有关示例中使用的一些标志和选项的更多信息，请查看 [标志](#node-flags) 和 [选项](#node-options)。如果您想查看所有标志、选项和子命令的完整列表，请运行以下命令打开帮助菜单：

bash
docker run --rm --name {{ networks.development.container_name }} \
moonbeamfoundation/moonbeam \
--help

要继续本教程，下一节不是必需的，因为您已经使用 Docker 启动了一个节点。您可以跳到 [配置您的 Moonbeam 开发节点](#configure-moonbeam-dev-node) 部分。

### 使用二进制文件启动节点 {: #getting-started-with-the-binary-file }

除了使用 Docker 之外，您还可以使用 Moonbeam 二进制文件启动节点。这种方法比较耗时。根据您的硬件，此过程可能需要大约 30 分钟才能完成。

!!! note
    如果您知道自己在做什么，可以直接从 [Moonbeam 发布页面](https://github.com/moonbeam-foundation/moonbeam/releases){target=_blank} 下载附加到每个版本的预编译二进制文件。这些文件并非在所有系统中都能使用。例如，这些二进制文件仅适用于具有特定依赖项版本的 x86-64 Linux。确保兼容性的最安全方法是在要运行它的系统上编译二进制文件。

要构建二进制文件，您可以采取以下步骤：

1. 克隆 Moonbeam 仓库的特定标签，您可以在 [Moonbeam GitHub 仓库](https://github.com/moonbeam-foundation/moonbeam){target=_blank} 上找到：

    ```bash
    git clone -b {{ networks.development.build_tag }} https://github.com/moonbeam-foundation/moonbeam
    cd moonbeam
    ```

    !!! note
        安装文件路径中的空格会导致编译错误。

2. 检查是否已安装 Rust。如果已安装 Rust，请跳过接下来的两个步骤。否则，通过执行 [Rust 推荐的方法](https://rust-lang.org/tools/install/){target=_blank} 安装 Rust 及其先决条件：

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/installrust.md'
    ```

3. 通过运行以下命令更新您的 PATH 环境变量：

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
    ```

4. 通过运行以下命令构建开发节点：

    !!! note
        如果您使用的是 Ubuntu 20.04 或 22.04，则需要确保在构建二进制文件之前已安装这些额外的依赖项：

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

    以下是构建输出尾部的样子：

    --8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/compile.md'

!!! note
    初始构建需要一段时间。根据您的硬件，您应该预计构建过程大约需要 30 分钟才能完成。

然后，您将需要使用以下命令在开发模式下运行节点：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'
```

!!! note
    对于不熟悉 Substrate 的人来说，`--dev` 标志是一种在单节点开发配置中运行基于 Substrate 的节点以进行测试的方式。当您使用 `--dev` 标志运行节点时，您的节点以全新状态启动，并且其状态不会持久存在。

您应该看到如下所示的输出，显示空闲状态，等待生成区块：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/terminal/run-binary.md'

有关示例中使用的一些标志和选项的更多信息，请查看 [标志](#node-flags) 和 [选项](#node-options)。如果您想查看所有标志、选项和子命令的完整列表，请运行以下命令打开帮助菜单：

```bash
./target/release/moonbeam --help
```

## 配置您的 Moonbeam 开发节点 {: #configure-moonbeam-dev-node }

既然您已经知道如何启动并运行标准的 Moonbeam 开发节点，您可能想知道如何配置它。以下部分将介绍您启动节点时可以使用的一些常见配置。

### 用于配置节点的常用标志 {: #node-flags }

标志不接受参数。要使用标志，请将其添加到命令的末尾。例如：

bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/runnode.md'

- **`--dev`** - 指定开发链
- **`--tmp`** - 运行一个临时节点，其中所有配置将在进程结束时删除
- **`--rpc-external`** - 监听所有 RPC 和 WebSocket 接口

### 配置区块生产 {: #configure-block-production }

默认情况下，您的 Moonbeam 开发节点以即时密封模式启动，该模式会在收到交易时立即生成区块。但是，您可以使用 `--sealing` 选项指定何时应生成或密封区块。

`--sealing` 标志接受以下任何参数：

- `instant` - 正如我们已经介绍过的，这是默认选项，其中区块在收到交易后立即生成
- `manual` - 允许您手动生成区块。如果收到交易，则在您手动创建一个区块之前不会生成区块
- 以毫秒为单位的间隔 - 以特定的时间间隔生成一个区块。例如，如果您将其设置为 `6000`，您将使节点每 6 秒生成一次区块

该标志应以下列格式附加到启动命令中：

text
--sealing <interval>

如果您选择 `manual`，您需要自己手动创建区块，这可以使用 `engine_createBlock` JSON-RPC 方法完成：

text
engine_createBlock(createEmpty: *bool*, finalize: *bool*, parentHash?: *BlockHash*)

例如，您可以使用以下代码片段，使用 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank} 手动创建一个区块，这是一个以太坊库，可以轻松地与 JSON-RPC 方法进行交互：

js
import { ethers } from 'ethers';

const produceBlock = async () => {
  // Connect to the Ethereum node (if applicable, replace the URL with your node's address)
  const provider = new ethers.JsonRpcProvider(
    '{{ networks.development.rpc_url }}'
  );

  // Set the custom JSON-RPC method and parameters
  const method = 'engine_createBlock';
  const params = [true, true, null];

  try {
    // Send the custom JSON-RPC call
    const result = await provider.send(method, params);
  } catch (error) {
    // Handle any errors that may occur
    console.error('Error:', error.message);
  }
};

produceBlock();

!!! note
    如果您不熟悉 Ethers，请参阅 [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=_blank} 文档页面以了解更多信息。

## 预先注资的开发账户 {: #pre-funded-development-accounts }

Moonbeam 有一个[统一账户](/learn/core-concepts/unified-accounts/){target=_blank}系统，使用户能够拥有一个以太坊样式的 H160 账户，该账户可以与 Substrate API 和以太坊 API 交互。因此，您可以通过 [Polkadot.js Apps](/tokens/connect/polkadotjs/#connect-polkadotjs-apps){target=_blank} 或 [MetaMask](/tokens/connect/metamask/){target=_blank}（或任何其他[EVM 钱包](/tokens/connect/){target=_blank}）与您的账户进行交互。此外，您还可以使用其他[开发工具](/builders/ethereum/dev-env/){target=_blank}，例如 [Remix](/builders/ethereum/dev-env/remix/){target=_blank} 和 [Hardhat](/builders/ethereum/dev-env/hardhat/){target=_blank}。

您的 Moonbeam 开发节点带有十个预先提供的以太坊样式账户，用于开发。这些地址来自 Substrate 的规范开发助记词：

```text
bottom drive obey lake curtain smoke basket hold race lonely fit walk
```

??? note "开发账户地址和私钥"
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-accounts.md'

开发节点还包含一个用于测试目的的额外预先注资账户：

--8<-- 'code/builders/get-started/networks/moonbeam-dev/dev-testing-account.md'

您可以使用这些账户的私钥将它们连接到 [MetaMask](/tokens/connect/metamask/){target=_blank}、[Talisman](/tokens/connect/talisman/){target=_blank}、[Polkadot.js Apps](/tokens/connect/polkadotjs/){target=_blank} 等。

## 开发节点端点 {: #access-your-development-node }

您可以使用以下 RPC 和 WSS 端点访问您的 Moonbeam 开发节点：

===

    text
    {{ networks.development.rpc_url }}
    

===

    text
    {{ networks.development.wss_url }}

## 区块浏览器 {: #block-explorers }

对于 Moonbeam 开发节点，您可以使用以下任何一个区块浏览器：

 - **Substrate API** — WS 端口 `{{ networks.parachain.ws }}` 上的 [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9944#/explorer){target=\_blank}
 - **基于以太坊 API JSON-RPC** — HTTP 端口 `{{ networks.parachain.ws }}` 上的 [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbeamDevNode){target=\_blank}

## Debug、Trace 和 TxPool API {: #debug-trace-txpool-apis }

您还可以通过运行跟踪节点来访问一些非标准的 RPC 方法，这允许开发人员在运行时检查和调试交易。跟踪节点使用与标准 Moonbeam 开发节点不同的 Docker 镜像。

要了解如何运行 Moonbeam 开发跟踪节点，请查看[运行跟踪节点](/node-operators/networks/tracing-node/){target=\_blank}指南，并务必在整个说明中切换到 **Moonbeam 开发节点** 选项卡。然后，要使用您的跟踪节点访问非标准的 RPC 方法，请查看[调试 & 跟踪](/builders/ethereum/json-rpc/debug-trace/){target=\_blank}指南。

## 清理开发节点 {: #purging-your-node }

如果您想删除与您的节点相关联的数据，您可以将其清除。清除节点的说明因您最初启动节点的方式而异。

### 清理使用 Docker 启动的节点 {: #purge-docker-node }

如果您使用 Docker 启动节点时使用了 `-v` 标志来指定容器的挂载目录，您需要清理该目录。为此，您可以运行以下命令：

bash
sudo rm -rf {{ networks.moonbase.node_directory }}/*

如果您按照本指南中的说明操作，并且没有使用 `-v` 标志，您可以停止并删除 Docker 容器。相关数据将随之删除。为此，您可以运行以下命令：

bash
sudo docker stop `CONTAINER_ID` && docker rm `CONTAINER_ID`
