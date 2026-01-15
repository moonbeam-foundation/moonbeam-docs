---
title: 编译二进制文件以运行节点
description: 了解如何手动编译二进制文件以运行完整的 Moonbeam 节点。编译二进制文件可能需要大约 30 分钟，并且至少需要 32GB 的内存。
categories: 节点运营商和收集人
---

# 手动编译 Moonbeam 二进制文件

## 简介

在基于 Moonbeam 的网络上运行完整节点，您可以连接到网络、与引导节点同步、获得对 RPC 端点的本地访问权限、在平行链上创建区块等等。

本指南适用于具有编译 [Substrate](https://docs.polkadot.com/){target=_blank} 区块链节点经验的人员。平行链节点类似于典型的 Substrate 节点，但存在一些差异。Substrate 平行链节点将是一个更大的构建，因为它包含运行平行链本身的代码，以及同步中继链和促进两者之间通信的代码。此构建非常大，可能需要 30 分钟以上，并且至少需要 32 GB 的内存。

要快速入门而无需自己编译二进制文件，可以使用[发布二进制文件](/node-operators/networks/run-a-node/systemd/){target=_blank}。

## 编译二进制文件 {: #compile-the-binary }

手动编译二进制文件可能需要大约 30 分钟，并需要 32GB 的内存。

以下命令将构建 Moonbeam 平行链的最新版本。

1. 克隆 Moonbeam 存储库。

    ```bash
    git clone https://github.com/moonbeam-foundation/moonbeam
    cd moonbeam
    ```

2. 检查最新版本。

    ```bash
    git checkout tags/$(git describe --tags)
    ```

3. 如果您已经安装了 Rust，请跳过接下来的两个步骤。否则，[通过 Rust 推荐的方法](https://rust-lang.org/tools/install/){target=_blank} 安装 Rust 及其先决条件。

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/installrust.md'
    ```

4. 更新您的 `PATH` 环境变量。

    ```bash
    --8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
    ```

5. 构建平行链二进制文件。

    !!! note
        如果您使用的是 Ubuntu 20.04 或 22.04，则需要在构建二进制文件之前安装这些额外的依赖项：

        ```bash
        apt install clang protobuf-compiler libprotobuf-dev pkg-config libssl-dev -y 
        ```

    ```bash
    cargo build --release
    ```

![编译二进制文件](/images/node-operators/networks/run-a-node/compile-binary/full-node-binary-1.webp)

如果在终端中出现 _cargo not found error_ 错误，请手动将 Rust 添加到您的系统路径或重新启动您的系统：

```bash
--8<-- 'code/builders/get-started/networks/moonbeam-dev/updatepath.md'
```

现在，您可以使用 Moonbeam 二进制文件来运行 Systemd 服务。要设置和运行该服务，请参阅[使用 Systemd 在 Moonbeam 上运行节点](/node-operators/networks/run-a-node/systemd/){target=_blank}指南。
