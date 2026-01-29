---
title: 使用 Docker 运行节点
description: 如何运行一个完整的平行链节点，以便您拥有自己的 RPC 端点，或者使用 Docker 为 Moonbeam 网络生产区块。
categories: 节点运营者和整理者
---

# 使用 Docker 在 Moonbeam 上运行节点

## 简介 {: #introduction }

在基于 Moonbeam 的网络上运行完整节点，您可以连接到网络、与引导节点同步、获得对 RPC 端点的本地访问权限、在平行链上创建区块等等。

在本指南中，您将学习如何使用 [Docker](https://www.docker.com){target=\_blank} 快速启动 Moonbeam 节点，以及如何维护和清除您的节点。

## 检查先决条件 {: #checking-prerequisites }

要开始，您需要：

- [安装 Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank}。在撰写本文时，使用的 Docker 版本为 24.0.6
- 确保您的系统满足[要求](/node-operators/networks/run-a-node/overview/#requirements){target=\_blank}。当连接到 Kusama 上的 Moonriver 或 Polkadot 上的 Moonbeam 时，完全同步嵌入式中继链需要几天时间

## 设置链数据的存储 {: #storage-chain-data }

要设置用于存储链数据的目录，您需要：

1. 创建一个本地目录

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

2. 设置存储链数据的本地目录的所有权和权限。您可以为特定用户或当前用户设置权限（将 `INSERT_DOCKER_USER` 替换为将运行 `docker` 命令的实际用户）

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

## 启动命令 {: #start-up-commands }

要启动您的节点，您需要执行 `docker run` 命令。如果您正在设置一个整理人节点，请确保按照[整理人](#collator-node)的代码片段进行操作。

请注意，在以下启动命令中，您必须：

- 将 `INSERT_YOUR_NODE_NAME` 替换为您选择的节点名称。您需要在两个地方执行此操作：一个用于平行链，一个用于中继链
- 将 `INSERT_RAM_IN_MB` 替换为您服务器实际 RAM 的 50%。例如，对于 32GB 的 RAM，该值必须设置为 `16000`。最小值是 `2000`，但它低于推荐的规格

有关以下启动命令中使用的标志以及其他常用标志的概述，请参阅我们文档的[标志](/node-operators/networks/run-a-node/flags/){target=\_blank}页面。

!!! note "对于 Apple Silicon 用户"
    如果 Docker 命令在 Apple Silicon 上失败或行为异常，请在 Docker Desktop 设置中启用 **Use Rosetta for x86_64/amd64 emulation on Apple Silicon**，并对 pull 和 run 命令使用 `amd64` 平台。 例如：

    ```bash
    docker pull --platform=linux/amd64 moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }}
    ```

    ```bash
    docker run --platform=linux/amd64 ...
    ```

### 完整节点 {: #full-node }

???+ code "Linux 代码片段"

    === "Moonbeam"

        ```bash
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonriver"

        ```bash
        docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonriver.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonbase Alpha"

        ```bash
        docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonbase.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

??? code "MacOS 代码片段"

    === "Moonbeam"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain moonbeam \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonriver"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path /data \
        --chain moonriver \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonbase Alpha"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path /data \
        --chain alphanet \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

--8<-- 'zh/text/node-operators/networks/run-a-node/external-access.md'

??? code "Moonbeam 的启动命令示例"

    === "Linux"

        ```bash hl_lines="11"
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        --unsafe-rpc-external \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "MacOS"

        ```bash hl_lines="10"
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain moonbeam \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        --unsafe-rpc-external \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

--8<-- 'zh/text/node-operators/networks/run-a-node/sql-backend.md'

??? code "Moonbeam 的启动命令示例"

    === "Linux"

        ```bash hl_lines="12"
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        # This is a comment
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        --frontier-backend-type sql \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "MacOS"

        ```bash hl_lines="10"
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain moonbeam \
        --name "INSERT_YOUR_NODE_NAME" \
        --state-pruning archive \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        --frontier-backend-type sql \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

### Collator 节点

从 v0.39.0 开始，新的 Moonbeam collator 节点将不再在启动时自动生成会话密钥。v0.39.0 之前的节点不需要更改他们处理会话密钥的方式。

设置新节点时，运行以下命令以生成会话密钥并将其存储在磁盘上，这些会话密钥将在启动命令中引用：

=== "Moonbeam"

    ```bash
    docker run --network="host" -v "/var/lib/moonbeam-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
     moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} key generate-node-key --base-path /var/lib/moonbeam-data --chain moonbeam 
    ```

=== "Moonriver"

    ```bash
    docker run --network="host" -v "/var/lib/moonriver-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
     moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} key generate-node-key --base-path /var/lib/moonriver-data --chain moonriver 
    ```

=== "Moonbase Alpha"

    ```bash
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
     moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} key generate-node-key --base-path /var/lib/alphanet-data --chain alphanet && sudo chown -R moonbase_service  /var/lib/alphanet-data
    ```

!!! note
    您需要[将新创建的文件夹的所有权更改](#storage-chain-data)为 Docker 的特定用户或当前用户。可以使用启动命令中的 `--unsafe-force-node-key-generation` 参数绕过节点密钥生成步骤，尽管这不是推荐的做法。

现在您可以运行您的 Docker 启动命令了：

???+ code "Linux snippets"

    === "Moonbeam"

        ```bash
        docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonbeam.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonriver"

        ```bash
        docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonriver.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonbase Alpha"

        ```bash
        docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path /data \
        --chain {{ networks.moonbase.chain_spec }} \
        --name "INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --db-cache INSERT_RAM_IN_MB \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

??? code "MacOS snippets"

    === "Moonbeam"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
        --base-path /data \
        --chain moonbeam \
        --name "INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonriver"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
        --base-path /data \
        --chain moonriver \
        --name "INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

    === "Moonbase Alpha"

        ```bash
        docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
        -u $(id -u ${USER}):$(id -g ${USER}) \
        moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
        --base-path /data \
        --chain alphanet \
        --name "INSERT_YOUR_NODE_NAME" \
        --collator \
        --trie-cache-size 1073741824 \
        --pool-type=fork-aware \
        -- \
        --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
        --sync fast
        ```

## 同步您的节点 {: #syncing-your-node }

一旦 Docker 拉取了必要的镜像，您的完整节点将启动，显示大量信息，例如链规格、节点名称、角色、创世状态等等。

--8<-- 'zh/code/node-operators/networks/run-a-node/docker/terminal/start.md'

在同步过程中，您将看到来自嵌入式中继链 ([Relaychain]) 和平行链 ([🌗]) 的日志。这些日志显示了一个目标区块（实时网络状态）和一个最佳区块（本地节点同步状态）。

--8<-- 'zh/code/node-operators/networks/run-a-node/docker/terminal/logs.md'

如果您按照 Moonbase Alpha 的安装说明进行操作，一旦同步完成，您将在本地运行一个 Moonbase Alpha TestNet 节点！对于 Moonbeam 或 Moonriver，一旦同步，您将连接到对等节点，并看到网络上正在生成的区块！

!!! note
    完全同步嵌入式中继链可能需要几天时间。请确保您的系统满足[要求](/node-operators/networks/run-a-node/overview/#requirements){target=\_blank}。

## 维护您的节点 {: #maintain-your-node }

随着 Moonbeam 开发的不断进行，有时需要升级您的节点软件。当有可用升级时，节点运营商会在我们的 [Discord 频道](https://discord.com/invite/PfpUATX){target=\_blank} 上收到通知，并得知这些升级是否是必要的（有些客户端升级是可选的）。升级过程非常简单，对于完整节点或整理者节点都是一样的。

1. 停止 Docker 容器：

    ```bash
    sudo docker stop INSERT_CONTAINER_ID
    ```

2. 通过 [Moonbeam GitHub 版本](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} 页面获取最新版本的 Moonbeam
3. 使用最新版本来启动您的节点。为此，请在启动命令中替换为最新版本并运行它

一旦您的节点再次运行，您应该会在终端中看到日志。

## 清理你的节点 {: #purge-your-node }

如果您需要一个全新的 Moonbeam 节点实例，您可以通过删除关联的数据目录来清理您的节点。

您首先需要停止 Docker 容器：

```bash
sudo docker stop INSERT_CONTAINER_ID
```

如果您在启动节点时未使用 `-v` 标志来指定用于存储链数据的本地目录，则数据文件夹与 Docker 容器本身相关。因此，删除 Docker 容器将删除链数据。

如果您确实使用 `-v` 标志启动了节点，您将需要清理指定的目录。例如，对于建议的数据目录，您可以运行以下命令来清理您的平行链和中继链数据：

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/*
    ```

要仅删除特定链的平行链数据，您可以运行：

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/chains/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/chains/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/chains/*
    ```

类似地，要仅删除中继链数据，您可以运行：

=== "Moonbeam"

    ```bash
    sudo rm -rf {{ networks.moonbeam.node_directory }}/polkadot/*
    ```

=== "Moonriver"

    ```bash
    sudo rm -rf {{ networks.moonriver.node_directory }}/polkadot/*
    ```

=== "Moonbase Alpha"

    ```bash
    sudo rm -rf {{ networks.moonbase.node_directory }}/polkadot/*
    ```

--8<-- 'zh/text/node-operators/networks/run-a-node/post-purge.md'
