---
title: 运行追踪节点
description: 了解如何利用 Geth 的 Debug 和 Txpool API，以及 OpenEthereum 的 Trace 模块在 Moonbeam 上运行追踪节点。
categories: 节点运营商和验证人
---

# 运行追踪节点

## 简介 {: #introduction }

Geth 的 `debug` 和 `txpool` API 以及 OpenEthereum 的 `trace` 模块提供了非标准的 RPC 方法，可以更深入地了解交易处理过程。作为 Moonbeam 为开发者提供无缝以太坊体验的目标的一部分，我们支持其中的一些非标准 RPC 方法。支持这些 RPC 方法是一个重要的里程碑，因为许多项目（例如 [The Graph](https://thegraph.com){target=\_blank}）都依赖它们来索引区块链数据。

要使用支持的 RPC 方法，您需要运行一个追踪节点，这与运行完整节点略有不同。有一个不同的 Docker 镜像，名为 `moonbeamfoundation/moonbeam-tracing`，需要用于追踪。还需要使用一些额外的标志来告知节点要支持哪些非标准功能。

本指南将向您展示如何通过启用 `debug`、`txpool` 和 `tracing` 标志，开始在 Moonbeam 上运行追踪节点。

## 检查先决条件 {: #checking-prerequisites }

与运行常规节点类似，您可以使用 Docker 或 Systemd 启动跟踪节点。如果您选择使用 Docker，则必须[安装 Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}（如果您尚未安装）。在编写本文时，使用的 Docker 版本为 19.03.6。

## 追踪节点标记 {: #tracing-node-flags }

启动 `debug`、`txpool` 或 `tracing` 节点类似于[运行完整节点](/node-operators/networks/run-a-node/overview/){target=\_blank}，但需要额外的标记来启用非标准的以太坊 RPC 模块。这些标记控制追踪深度、缓存和运行时配置。

- **`--ethapi debug`**: 启用具有 RPC 方法（如 `debug_traceTransaction`、`debug_traceBlockByNumber`、`debug_traceBlockByHash` 和 `debug_traceCall`）的 `debug` 模块。
- **`--ethapi trace`**: 启用 `trace` 模块及其相关联的 RPC 方法（如 `trace_filter`）。
- **`--ethapi txpool`**: 启用 `txpool` 模块，该模块提供 `txpool_content`、`txpool_inspect` 和 `txpool_status`。
- **`--wasm-runtime-overrides <path/to/overrides>`**: 追踪**必需**。指定本地 Wasm 运行时的存储路径。
  - 对于 Docker 设置，请使用 `/moonbeam/<network>-substitutes-tracing`，其中 `<network>` 为 `moonbeam`、`moonriver` 或 `moonbase`（对于 Moonbase Alpha 或开发节点）。
- **`--runtime-cache-size 64`**: **必需**。配置在内存缓存中保存的不同运行时版本的数量为 `64`。
- **`--ethapi-max-permits <uint>`**: 设置追踪模块（`debug`、`trace`）共享的并发追踪任务数。默认值：`10`。
- **`--ethapi-trace-max-count <uint>`**: 设置单个 `trace_filter` 请求可以返回的最大追踪条目数。默认值：`500`。
- **`--ethapi-trace-cache-duration <uint>`**: 在丢弃某区块的缓存 `trace_filter` 结果之前的持续时间（以秒为单位）。默认值：`300`。
- **`--eth-log-block-cache <bytes>`**: 用于存储区块数据的 LRU 缓存的大小（以字节为单位）。默认值：`300000000`。
- **`--eth-statuses-cache <bytes>`**: 用于存储交易状态数据的 LRU 缓存的大小（以字节为单位）。默认值：`300000000`。
- **`--fee-history-limit <uint>`**: 设置 `eth_feeHistory` 请求的最大费用历史记录缓存大小。默认值：`2048`。
- **`--max-past-logs <uint>`**: 单个日志查询返回的最大日志数。默认值：`10000`。
- **`--max-block-range <uint>`**: 单个日志查询中允许的最大区块跨度。默认值：`1024`。
- **`--tracing-raw-max-memory-usage <bytes>`**: 原始追踪请求使用的内存上限（堆栈、存储和内存数据）。默认值：`20000000`。

!!! note
    如果您想运行一个 RPC 端点以连接到 Polkadot.js Apps 或您自己的 dApp，请使用 `--unsafe-rpc-external` 标记以允许外部访问 RPC 端口。运行 `moonbeam --help` 可以获得更多详细信息。

## 使用 Docker 运行追踪节点 {: #run-a-tracing-node-with-docker }

如果您之前没有运行过标准的完整 Moonbeam 节点，则需要设置一个目录来存储链数据：

=== "Moonbeam"

    ```bash
    mkdir {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"

    ```bash
    mkdir {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"

    ```bash
    mkdir {{ networks.moonbase.node_directory }}
    ```

在开始之前，您需要为特定用户或当前用户设置必要的权限（将 `INSERT_DOCKER_USER` 替换为将运行 `docker` 命令的实际用户）：

=== "Moonbeam"

    ```bash
    # chown to a specific user
    chown INSERT_DOCKER_USER {{ networks.moonbeam.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"

    ```bash
    # chown to a specific user
    chown INSERT_DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"

    ```bash
    # chown to a specific user
    chown INSERT_DOCKER_USER {{ networks.moonbase.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```

您需要使用 `moonbeamfoundation/moonbeam-tracing` 镜像，而不是标准的 `moonbeamfoundation/moonbeam` Docker 镜像。最新受支持的版本可以在 [`moonbeam-tracing` 镜像的 Docker Hub](https://hub.docker.com/r/moonbeamfoundation/moonbeam-tracing/tags){target=\_blank} 上找到。

现在，执行 docker run 命令。请注意，您必须：

 - 在两个不同的地方替换 `INSERT_YOUR_NODE_NAME`。
 - 将 `INSERT_RAM_IN_MB` 替换为您服务器实际 RAM 的 50%。例如，对于 32 GB 的 RAM，该值必须设置为 `16000`。最小值为 `2000`，但低于建议的规格。

--8<-- 'zh/text/node-operators/networks/run-a-node/client-changes.md'

运行追踪节点的完整命令如下：

=== "Moonbeam"

    ```bash
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonbeam.tracing_tag }} \
    --base-path /data \
    --chain {{ networks.moonbeam.chain_spec }} \
    --name "INSERT_YOUR_NODE_NAME" \
    --state-pruning archive \
    --trie-cache-size 1073741824 \
    --db-cache INSERT_RAM_IN_MB \
    --ethapi debug,trace,txpool \
    --wasm-runtime-overrides /moonbeam/moonbeam-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --name "INSERT_YOUR_NODE_NAME (Embedded Relay)"
    ```

=== "Moonriver"

    ```bash
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonriver.tracing_tag }} \
    --base-path /data \
    --chain {{ networks.moonriver.chain_spec }} \
    --name "INSERT_YOUR_NODE_NAME" \
    --state-pruning archive \
    --trie-cache-size 1073741824 \
    --db-cache INSERT_RAM_IN_MB \
    --ethapi debug,trace,txpool \
    --wasm-runtime-overrides /moonbeam/moonriver-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --name "INSERT_YOUR_NODE_NAME (Embedded Relay)"
    ```

=== "Moonbase Alpha"

    ```bash
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonbase.tracing_tag }} \
    --base-path /data \
    --chain {{ networks.moonbase.chain_spec }} \
    --name "INSERT_YOUR_NODE_NAME" \
    --state-pruning archive \
    --trie-cache-size 1073741824 \
    --db-cache INSERT_RAM_IN_MB \
    --ethapi debug,trace,txpool \
    --wasm-runtime-overrides /moonbeam/moonbase-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --name "INSERT_YOUR_NODE_NAME (Embedded Relay)"
    ```

=== "Moonbeam Dev Node"

    ```bash
    docker run --network="host" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.development.tracing_tag }} \
    --name "INSERT_YOUR_NODE_NAME" \
    --ethapi debug,trace,txpool \
    --wasm-runtime-overrides /moonbeam/moonbase-substitutes-tracing \
    --runtime-cache-size 64 \
    --dev
    ```

如果您启动了一个 Moonbase Alpha 追踪节点，您应该会看到类似于以下内容的终端日志：

--8<-- 'zh/code/builders/ethereum/json-rpc/debug-trace/terminal/start-up-logs.md'

## 使用 Systemd 运行追踪节点 {: #run-a-tracing-node-with-systemd }

当您使用 Systemd 运行节点时，首先需要设置 Moonbeam 二进制文件。为此，您需要按照[使用 Systemd 在 Moonbeam 上运行节点](/node-operators/networks/run-a-node/systemd/){target=\_blank} 页面上的说明进行操作。通常，您需要：

1. 按照[发布二进制文件](/node-operators/networks/run-a-node/systemd/#the-release-binary){target=\_blank} 说明设置 Moonbeam 二进制文件。或者，如果您想自己编译二进制文件，可以按照 [编译二进制文件](/node-operators/networks/run-a-node/systemd/#compile-the-binary){target=\_blank} 说明进行操作
2. 按照[设置服务](/node-operators/networks/run-a-node/systemd/#setup-the-service){target=\_blank} 说明中的说明进行操作

完成上述特定部分的说明后，您可以继续阅读以下说明。

### 设置 Wasm 覆盖 {: #setup-the-wasm-overrides }

您需要为 Wasm 运行时覆盖创建一个目录，并从 GitHub 上的 [Moonbeam 运行时覆盖存储库](https://github.com/moonbeam-foundation/moonbeam-runtime-overrides){target=\_blank} 中获取它们。

您可以将存储库克隆到本地计算机上的任何位置。为简单起见，您可以使用存储链上数据的目录。要设置 Wasm 覆盖文件，您可以采取以下步骤：

1. 克隆 [Moonbeam 运行时覆盖存储库](https://github.com/moonbeam-foundation/moonbeam-runtime-overrides){target=\_blank}

    ```bash
    git clone https://github.com/moonbeam-foundation/moonbeam-runtime-overrides.git
    ```

2. 将 Wasm 覆盖移动到您的链上数据目录中：

    === "Moonbeam"

        ```bash
        mv moonbeam-runtime-overrides/wasm {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"

        ```bash
        mv moonbeam-runtime-overrides/wasm {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"

        ```bash
        mv moonbeam-runtime-overrides/wasm {{ networks.moonbase.node_directory }}
        ```

3. 删除您未运行的网络的覆盖文件

    === "Moonbeam"

        ```bash
        rm {{ networks.moonbeam.node_directory }}/wasm/moonriver-runtime-* &&  rm {{ networks.moonbeam.node_directory }}/wasm/moonbase-runtime-*
        ```

    === "Moonriver"

        ```bash
        rm {{ networks.moonriver.node_directory }}/wasm/moonbeam-runtime-* &&  rm {{ networks.moonriver.node_directory }}/wasm/moonbase-runtime-*
        ```

    === "Moonbase Alpha"

        ```bash
        rm {{ networks.moonbase.node_directory }}/wasm/moonbeam-runtime-* &&  rm {{ networks.moonbase.node_directory }}/wasm/moonriver-runtime-*
        ```

4. 设置覆盖的用户权限：

    === "Moonbeam"

        ```bash
        chmod +x {{ networks.moonbeam.node_directory }}/wasm/*
        chown moonbeam_service {{ networks.moonbeam.node_directory }}/wasm/*
        ```

    === "Moonriver"

        ```bash
        chmod +x {{ networks.moonriver.node_directory }}/wasm/*
        chown moonriver_service {{ networks.moonriver.node_directory }}/wasm/*
        ```

    === "Moonbase Alpha"

        ```bash
        chmod +x {{ networks.moonbase.node_directory }}/wasm/*
        chown moonbase_service {{ networks.moonbase.node_directory }}/wasm/*
        ```

### 创建配置文件 {: #create-the-configuration-file }

下一步是创建 systemd 配置文件，您需要：

 - 在两个不同的位置替换 `INSERT_YOUR_NODE_NAME`
 - 将 `INSERT_RAM_IN_MB` 替换为您服务器实际 RAM 的 50%。例如，对于 32 GB 的 RAM，该值必须设置为 `16000`。最小值是 `2000`，但低于建议的规格
 - 仔细检查二进制文件是否位于下方所述的正确路径中 (_ExecStart_)
 - 如果您使用了不同的目录，请仔细检查基本路径
 - 将文件命名为 `/etc/systemd/system/moonbeam.service`

--8<-- 'zh/text/node-operators/networks/run-a-node/client-changes.md'

=== "Moonbeam"

    ```bash
    [Unit]
    Description="Moonbeam systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbeam_service
    SyslogIdentifier=moonbeam
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbeam.node_directory }}/{{ networks.moonbeam.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --ethapi debug,trace,txpool \
         --wasm-runtime-overrides {{ networks.moonbeam.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"

    ```bash
    [Unit]
    Description="Moonriver systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonriver_service
    SyslogIdentifier=moonriver
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonriver.node_directory }}/{{ networks.moonriver.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonriver.node_directory }} \
         --ethapi debug,trace,txpool \
         --wasm-runtime-overrides {{ networks.moonriver.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"

    ```bash
    [Unit]
    Description="Moonbase Alpha systemd service"
    After=network.target
    StartLimitIntervalSec=0

    [Service]
    Type=simple
    Restart=on-failure
    RestartSec=10
    User=moonbase_service
    SyslogIdentifier=moonbase
    SyslogFacility=local7
    KillSignal=SIGHUP
    ExecStart={{ networks.moonbase.node_directory }}/{{ networks.moonbase.binary_name }} \
         --state-pruning archive \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbase.node_directory }} \
         --ethapi debug,trace,txpool \
         --wasm-runtime-overrides {{ networks.moonbase.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)"
        
    [Install]
    WantedBy=multi-user.target
    ```

!!! note
    如果您想要运行 RPC 端点，以连接 polkadot.js.org，或运行您自己的应用程序，请使用 `--unsafe-rpc-external` 标志来运行具有外部 RPC 端口访问权限的完整节点。 运行 `moonbeam --help` 可以获得更多详细信息。

### 运行服务 {: #run-the-service }

--8<-- 'zh/text/node-operators/networks/run-a-node/systemd/run-service.md'

--8<-- 'zh/code/node-operators/networks/tracing-node/terminal/status.md'

您也可以运行以下命令来查看追踪节点启动时的日志：

```bash
journalctl -f -u moonbeam.service
```

您的终端应显示类似于以下内容的日志：

--8<-- 'zh/code/node-operators/networks/tracing-node/terminal/logs.md'

## 使用追踪节点 {: #using-a-tracing-node }

要了解 Moonbeam 上可用的不同非标准 RPC 方法，以及如何通过追踪节点使用这些方法，请查看[调试与追踪](/builders/ethereum/json-rpc/debug-trace/)指南。
