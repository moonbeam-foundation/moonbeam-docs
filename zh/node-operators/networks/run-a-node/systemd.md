---
title: 使用 Systemd 在 Moonbeam 上运行节点
description: 如何运行一个完整的平行链节点，以便您拥有自己的 RPC 端点或使用 Systemd 为 Moonbeam 网络生成区块。
categories: 节点运营者和整理者
---

# 使用 Systemd 在 Moonbeam 上运行节点

## 简介 {: #introduction }

在基于 Moonbeam 的网络上运行完整节点，您可以连接到网络，与引导节点同步，获得对 RPC 端点的本地访问权限，在平行链上创建区块等等。

在本指南中，您将学习如何使用 [Systemd](https://systemd.io){target=\_blank} 启动 Moonbeam 节点，以及如何维护和清除您的节点。

如果您有兴趣自己编译二进制文件（可能需要 30 多分钟并需要 32GB 的内存），您可以查看 [手动编译 Moonbeam 二进制文件](node-operators/networks/run-a-node/compile-binary/){target=\_blank} 指南。

## 检查先决条件 {: #checking-prerequisites }

以下各节将介绍使用二进制文件并将 Moonbeam 完整节点作为 systemd 服务运行的过程。要开始使用，您需要：

- 确保您正在运行 Ubuntu 18.04、20.04 或 22.04。Moonbeam 可以在其他 Linux 版本上运行，但 Ubuntu 是目前唯一经过测试的版本
- 确保您的系统符合[要求](node-operators/networks/run-a-node/overview/#requirements){target=\_blank}。当连接到 Kusama 上的 Moonriver 或 Polkadot 上的 Moonbeam 时，完全同步嵌入式中继链需要几天时间

## 下载最新的发布版本二进制文件 {: #the-release-binary }

要下载最新的[发布版本二进制文件](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank}，请按照以下步骤操作：

1. 创建一个目录来存储二进制文件和链数据（您可能需要 `sudo`）

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

2. 使用 `wget` 获取最新的[发布版本二进制文件](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank}，并将其输出到上一步创建的目录中

    === "Moonbeam"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbeam.parachain_release_tag }}/moonbeam \
        -O {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonriver.parachain_release_tag }}/moonbeam \
        -O {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/{{ networks.moonbase.parachain_release_tag }}/moonbeam \
        -O {{ networks.moonbase.node_directory }}/moonbeam
        ```

3. 要验证您是否下载了正确的版本，可以在终端中运行以下命令

    === "Moonbeam"

        ```bash
        sha256sum {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        sha256sum {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        sha256sum {{ networks.moonbase.node_directory }}/moonbeam
        ```

    您应该收到以下输出：

    === "Moonbeam"

        ```text
        {{ networks.moonbeam.parachain_sha256sum }}
        ```

    === "Moonriver"

        ```text
        {{ networks.moonriver.parachain_sha256sum }}
        ```

    === "Moonbase Alpha"

        ```text
        {{ networks.moonbase.parachain_sha256sum }}
        ```

## 设置服务 {: #set-up-the-service }

以下命令将设置有关运行服务的所有内容：

1. 创建一个服务帐户来运行该服务

    === "Moonbeam"

        ```bash
        adduser moonbeam_service --system --no-create-home
        ```

    === "Moonriver"

        ```bash
        adduser moonriver_service --system --no-create-home
        ```

    === "Moonbase Alpha"

        ```bash
        adduser moonbase_service --system --no-create-home
        ```

2. 确保你正确配置了用于存储链数据的本地目录的所有权和权限，并且还记得授予二进制文件执行权限

    === "Moonbeam"

        ```bash
        sudo chown -R moonbeam_service {{ networks.moonbeam.node_directory }}
        sudo chmod +x {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        sudo chown -R moonriver_service {{ networks.moonriver.node_directory }}
        sudo chmod +x {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        sudo chown -R moonbase_service {{ networks.moonbase.node_directory }}
        sudo chmod +x {{ networks.moonbase.node_directory }}/moonbeam
        ```

## 创建配置文件 {: #create-the-configuration-file }

接下来，创建 systemd 服务文件。如果您正在配置一个排序人节点，请使用下面的[特定于排序人的](#collator)配置文件片段。

首先，您需要创建一个名为 `/etc/systemd/system/moonbeam.service` 的文件来存储配置。

请注意，在以下启动配置中，您必须：

- 将 `INSERT_YOUR_NODE_NAME` 替换为您选择的节点名称。您必须在两个地方执行此操作：一个用于平行链，另一个用于中继链
- 将 `INSERT_RAM_IN_MB` 替换为您服务器实际 RAM 的 50%。例如，对于 32GB 的 RAM，该值必须设置为 `16000`。最小值为 `2000`，但低于建议的规格
- 仔细检查二进制文件是否位于如下所述的正确路径中 (_ExecStart_)
- 如果您使用了不同的目录，请仔细检查基本路径

有关以下启动命令中使用的标志以及其他常用标志的概述，请参阅我们文档的 [标志](node-operators/networks/run-a-node/flags/){target=\_blank} 页面。

### 完整节点 {: #full-node }

=== "Moonbeam"

    ```bash
    [Unit]
    Description="Moonbeam systemd 服务"
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
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"

    ```bash
    [Unit]
    Description="Moonriver systemd 服务"
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
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"

    ```bash
    [Unit]
    Description="Moonbase Alpha systemd 服务"
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
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast

    [Install]
    WantedBy=multi-user.target
    ```

--8<-- 'zh/text/node-operators/networks/run-a-node/external-access.md'

??? code "Moonbeam 启动命令示例"

    ```bash
    [Unit]
    Description="Moonbeam systemd 服务"
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
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --unsafe-rpc-external \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

--8<-- 'zh/text/node-operators/networks/run-a-node/sql-backend.md'

??? code "Moonbeam 启动命令示例"

    ```bash
    [Unit]
    Description="Moonbeam systemd 服务"
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
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         --frontier-backend-type sql \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

### Collator {: #collator }

从 v0.39.0 开始，新的 Moonbeam Collator 节点将不再在启动时自动生成会话密钥。v0.39.0 之前的节点无需更改其处理会话密钥的方式。

设置新节点时，运行以下命令以生成会话密钥，并将其存储在磁盘上，以便在启动命令中引用：

=== "Moonbeam"

    ```bash
    /var/lib/moonbeam-data/moonbeam key generate-node-key --base-path /var/lib/moonbeam-data --chain moonbeam && sudo chown -R moonbeam_service /var/lib/moonbeam-data
    ```

=== "Moonriver"

    ```bash
    /var/lib/moonriver-data/moonbeam key generate-node-key --base-path /var/lib/moonriver-data --chain moonriver && sudo chown -R moonriver_service /var/lib/moonriver-data
    ```

=== "Moonbase Alpha"

    ```bash
    /var/lib/alphanet-data/moonbeam key generate-node-key --base-path /var/lib/alphanet-data --chain alphanet  && sudo chown -R moonbase_service  /var/lib/alphanet-data
    ```

!!! note
    可以使用启动命令中的 `--unsafe-force-node-key-generation` 参数绕过此步骤，但不建议这样做。

现在，您可以创建 systemd 配置文件：

=== "Moonbeam"

    ```bash
    [Unit]
    Description="Moonbeam systemd 服务"
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
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbeam.node_directory }} \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"

    ```bash
    [Unit]
    Description="Moonriver systemd 服务"
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
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonriver.node_directory }} \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"

    ```bash
    [Unit]
    Description="Moonbase Alpha systemd 服务"
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
         --collator \
         --trie-cache-size 1073741824 \
         --db-cache INSERT_RAM_IN_MB \
         --base-path {{ networks.moonbase.node_directory }} \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "INSERT_YOUR_NODE_NAME" \
         -- \
         --name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
         --sync fast

    [Install]
    WantedBy=multi-user.target
    ```

## 运行服务 {: #run-the-service }

--8<-- 'zh/text/node-operators/networks/run-a-node/systemd/run-service.md'

--8<-- 'code/node-operators/networks/run-a-node/systemd/terminal/status.md'

您也可以通过运行以下命令查看日志：

```bash
journalctl -f -u moonbeam.service
```

--8<-- 'code/node-operators/networks/run-a-node/systemd/terminal/logs.md'

在同步过程中，您会同时看到来自嵌入式中继链（[Relaychain]）和从平行链（[🌗]）的日志。这些日志会显示目标区块（实时网络状态）和最佳区块（本地节点已同步的状态）。

!!! note
    嵌入式中继链完全同步可能需要几天时间。请确保您的系统满足[要求](/node-operators/networks/run-a-node/overview/#requirements){target=\\_blank}。

如果您出于任何原因需要停止服务，可以运行：

```bash
systemctl stop moonbeam.service
```

## 维护您的节点 {: #maintain-your-node }

随着 Moonbeam 开发的不断进行，有时需要升级您的节点软件。当有可用升级时，节点运营商将在我们的 [Discord 频道](https://discord.com/invite/PfpUATX){target=\_blank} 上收到通知，并了解升级是否必要（某些客户端升级是可选的）。升级过程很简单，对于完整节点或收集人节点都是一样的。

如果您想要更新您的客户端，您可以保持现有的链数据不变，只需按照以下步骤更新二进制文件：

1. 停止 systemd 服务

    ```bash
    sudo systemctl stop moonbeam.service
    ```

2. 删除旧的二进制文件

    === "Moonbeam"

        ```bash
        rm {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        rm {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        rm {{ networks.moonbase.node_directory }}/moonbeam
        ```

3. 从 [GitHub 上的 Moonbeam 发布二进制文件](https://github.com/moonbeam-foundation/moonbeam/releases){target=\_blank} 获取最新版本，并运行以下命令以更新到该版本

    === "Moonbeam"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam \
        -O {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam \
        -O {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        wget https://github.com/moonbeam-foundation/moonbeam/releases/download/INSERT_NEW_VERSION_TAG/moonbeam \
        -O {{ networks.moonbase.node_directory }}/moonbeam
        ```

    !!! note
        如果您[手动编译了二进制文件](node-operators/networks/run-a-node/compile-binary/){target=\_blank}，则需要将二进制文件从 `./target/release/{{ networks.moonbeam.binary_name }}` 移动到数据目录。

4. 更新权限

    === "Moonbeam"

        ```bash
        chmod +x {{ networks.moonbeam.node_directory }}/moonbeam
        chown moonbeam_service {{ networks.moonbeam.node_directory }}/moonbeam
        ```

    === "Moonriver"

        ```bash
        chmod +x {{ networks.moonriver.node_directory }}/moonbeam
        chown moonriver_service {{ networks.moonriver.node_directory }}/moonbeam
        ```

    === "Moonbase Alpha"

        ```bash
        chmod +x {{ networks.moonbase.node_directory }}/moonbeam
        chown moonbase_service {{ networks.moonbase.node_directory }}/moonbeam
        ```

5. 启动您的服务

    ```bash
    systemctl start moonbeam.service
    ```

要检查服务的状态和/或日志，您可以参考[之前的命令](#run-the-service)。

## 清理您的节点 {: #purge-your-node }

如果您需要一个全新的 Moonbeam 节点实例，您可以通过删除关联的数据目录来清理您的节点。

您首先需要停止 systemd 服务：

```bash
sudo systemctl stop moonbeam
```

要清理您的平行链和中继链数据，您可以运行以下命令：

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
