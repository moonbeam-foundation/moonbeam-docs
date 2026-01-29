---
title: 运行节点标志和选项
description: 一系列有用的标志，用于在 Moonbeam 上启动完整的平行链节点。此外，了解如何访问节点运营者可用的所有标志。
categories: 节点运营者和 Collator
---

# 在 Moonbeam 上运行节点时有用的标志

## 简介 {: #introduction }

在启动您自己的 Moonbeam 节点时，可以使用一些必需的和可选的标志。本指南将介绍一些最常见的标志，并向您展示如何访问所有可用的标志。

## 常用标志 {: #common-flags }

- **`--collator`**: 启用整理人候选人的整理人模式，如果符合条件，允许节点积极参与区块生产。
- **`--port`**: 指定对等协议 TCP 端口。平行链的默认端口是 `{{ networks.parachain.p2p }}`，嵌入式中继链的默认端口是 `{{ networks.relay_chain.p2p }}`。
- **`--rpc-port`**: 设置 HTTP 和 WS 连接的统一端口。平行链的默认端口是 `{{ networks.parachain.rpc }}`，嵌入式中继链的默认端口是 `{{ networks.relay_chain.ws }}`。
- **`--ws-port`**: *自 [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank} 起已弃用，请改用 `--rpc-port` 进行 HTTP 和 WS 连接* - 设置 HTTP 和 WS 连接的统一端口。平行链的默认端口是 `{{ networks.parachain.ws }}`，嵌入式中继链的默认端口是 `{{ networks.relay_chain.ws }}`。
- **`--rpc-max-connections`**: 指定 HTTP 和 WS 服务器连接的最大数量。默认为 100。
- **`--rpc-external`** — 监听所有接口以进行 JSON-RPC（HTTP 和 WS）。使用代理来过滤公共端点上的不安全方法。如果您接受风险，请使用 **`--unsafe-rpc-external`** 来禁止安全警告。
- **`--rpc-methods`** — 要公开哪些 RPC 方法。选项：`auto` *（默认）*、`safe`、`unsafe`。
- **`--rpc-cors`** — 逗号分隔的允许的浏览器来源 (`protocol://domain`) 或 `all` 以禁用验证。在 `--dev` 中，默认允许所有来源。
- **`--rpc-rate-limit <calls/min>`** — 每个连接的速率限制。默认禁用。
  - **`--rpc-rate-limit-whitelisted-ips <CIDR>...`** — 免于限制的 CIDR 范围。
  - **`--rpc-rate-limit-trust-proxy-headers`** — 当位于反向代理后面时，信任 `X-Forwarded-For` / `X-Real-IP`。
- **`--rpc-max-request-size <MB>`** / **`--rpc-max-response-size <MB>`** — 最大有效负载大小（默认为 `15` / `15`）。
- **`--rpc-max-subscriptions-per-connection <N>`** — 每个连接的最大并发订阅数（默认为 `1024`）。
- **`--rpc-message-buffer-capacity-per-connection <N>`** — 每个连接在反压之前的排队消息容量（默认为 `64`）。
- **`--rpc-disable-batch-requests`** 和 **`--rpc-max-batch-request-len <N>`** — 禁用批量 RPC 或限制批处理长度。
- **`--ws-max-connections`**: *自 [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank} 起已弃用，请改用 `--rpc-max-connections` 来调整组合的 HTTP 和 WS 连接限制* - 指定 HTTP 和 WS 服务器连接的最大数量。默认为 100。
- **`--wasm-execution`**: 指定执行 Wasm 运行时代码的方法。可用选项包括：
    - **`compiled`**: 这是默认选项，使用 [Wasmtime](https://github.com/paritytech/wasmtime){target=\_blank} 编译的运行时。
    - **`interpreted-i-know-what-i-do`**: 使用 [wasmi 解释器](https://github.com/wasmi-labs/wasmi){target=\_blank}。
- **`--wasmtime-instantiation-strategy`**: 控制 WASM 实例化。默认值为 `pooling-copy-on-write`（最快）。选项包括 `recreate-instance-copy-on-write`、`pooling`、`recreate-instance`。CoW 变体在不支持时会回退。
- **`--max-runtime-instances <N>`**: 每个运行时的运行时实例缓存大小。默认为 `8`，最大为 `32`。
- **`--runtime-cache-size <N>`**: 同时缓存的不同运行时的最大数量。默认为 `2`。
- **`--wasmtime-precompiled <PATH>`** / **`--wasm-runtime-overrides <PATH>`**: 版本匹配时，使用预编译的运行时或本地 WASM 覆盖。仅限高级/运维使用。
- **`--state-pruning`**: 指定状态剪枝模式。对于低于 v0.27.0 的客户端版本，`--state-pruning` 标志名为 `--pruning`。如果使用 `--collator` 标志运行节点，则默认会保留所有区块的完整状态。否则，仅保留最近 256 个区块的状态。可用选项包括：
    - **`archive`**: 保留所有区块的完整状态。
    - **`<number-of-blocks>`**: 指定要保留状态的自定义区块数。
- **`--trie-cache-size`**: 指定内部状态缓存的大小（以字节为单位）。默认为 `1073741824` (1 GB)。提供 `0` 会禁用缓存。为了提高整理人和 RPC 节点的性能，通常使用 1-4 GB 左右的值，具体取决于硬件。（在客户端 v0.27.0 之前，这是 `--state-cache-size`。）
- **`--db-cache`**: 指定数据库缓存限制使用的内存。建议将其设置为服务器实际 RAM 的 50%。例如，对于 32 GB RAM，该值应设置为 `16000`。最小值是 `2000`，但低于建议的规格。
- **`--database`**: 选择 DB 后端。选项：`auto`（检测或创建 ParityDb）、`paritydb`、`paritydb-experimental`、`rocksdb`。对于大多数运营商来说，`auto` 就可以了；某些人可能更喜欢 RocksDB 以便熟悉工具。
- **`--blocks-pruning`**: 从状态中单独剪除区块体/理由。选项：
  - `archive`：保留所有区块，
  - `archive-canonical`：仅保留最终确定的区块（默认），
  - `<NUMBER>`：保留最后 `<NUMBER>` 个最终确定的区块。
- **`--base-path`**: 指定存储链数据的基本路径。
- **`--chain`**: 指定要使用的链规范。它可以是预定义的链规范，例如 `{{ networks.moonbeam.chain_spec }}`、`{{ networks.moonriver.chain_spec }}` 或 `{{ networks.moonbase.chain_spec }}`。或者它可以是指向包含链规范的文件的路径（例如 `build-spec` 命令导出的文件）。
- **`--network-backend`**: 选择 P2P 堆栈。选项：
  - `litep2p`（默认）— 轻量级，CPU 使用率较低，生态系统正在迁移到此处。
  - `libp2p` — 为兼容性而保留的旧版后端。
- **`--name`**: 指定节点的人类可读名称，如果启用，可以在 [遥测](https://telemetry.polkadot.io){target=\_blank} 上看到。
- **`--telemetry-url`**: 指定要连接的遥测服务器的 URL。可以多次传递此标志，以指定多个遥测端点。此标志采用两个参数：URL 和详细级别。详细级别范围从 0 到 9，其中 0 表示最不详细。预期格式为“<URL VERBOSITY>”，例如 `--telemetry-url 'wss://foo/bar 0'`。
- **`--no-telemetry`**: 完全禁用遥测（默认在全局链上启用）。
- **`--prometheus-external`**: 在所有接口上公开 Prometheus 指标（默认为本地）。
- **`--no-prometheus`**: 禁用 Prometheus 端点。
- **`--no-prometheus-prefix`**: 从指标名称中删除 `moonbeam` 前缀。
- **`--in-peers`**: 指定入站全节点对等方的最大数量。默认为 `32`。
- **`--out-peers`**: 指定要维护的出站对等方的目标数量。默认为 `8`。
- **`--reserved-nodes <ADDR>...`** / **`--reserved-only`**: 锁定到一组对等方，并且（可选）**仅**与它们同步。对于专用集群或位于哨兵/拓扑后面的 RPC 节点很有用。
- **`--no-hardware-benchmarks`**: 跳过启动时的自动 CPU/内存/磁盘基准测试（如果启用，还会禁止将这些发送到遥测）。
- **`--public-addr <MULTIADDR>...`** / **`--listen-addr <MULTIADDR>...`**: P2P 的通告与监听多重地址。在 NAT/代理后面使用。
- **`--no-private-ip`** / **`--allow-private-ip`**: 根据环境禁止/允许专用地址对等互连。
- **`--in-peers-light <N>`**: 最大入站轻客户端对等方（默认为 `100`）。
- **`--max-parallel-downloads <N>`**: 要并行请求来自多少个对等方的相同已宣布区块。默认为 `5`。
- **`--runtime-cache-size 64`**: 将内存中缓存中保留的不同运行时版本的数量配置为 64。
- **`--eth-log-block-cache`**: LRU 缓存用于区块数据的大小（以字节为单位）限制使用。此标志主要与 RPC 提供程序有关。默认为 `300000000`。
- **`--eth-statuses-cache`**: LRU 缓存用于事务状态数据的大小（以字节为单位）限制使用。此标志主要与 RPC 提供程序有关。默认为 `300000000`。
- **`--sync`**: 设置区块链同步模式，这可以使区块链同步更快。可用选项包括：
    - **`full`**: 下载并验证完整的区块链历史记录。
    - **`fast`**: 下载区块而不执行它们，并下载带有证明的最新状态。
    - **`fast-unsafe`**: 与 `fast` 相同，但跳过下载状态证明。
    - **`warp`**: 下载最新状态和证明。
- **`--prometheus-port`**: 指定自定义 Prometheus 端口。
- **`--lazy-loading-remote-rpc`**: 允许通过依赖指定的 RPC 端点获取网络状态来进行[延迟加载](/node-operators/networks/run-a-node/overview/#lazy-loading){target=\_blank}，直到节点完全同步，例如 `--lazy-loading-remote-rpc 'https://moonbeam.unitedbloc.com'`，只要指定的 RPC 端点具有足够的速率限制来处理预期的负载。强烈建议使用私有（API 密钥）端点，而不是公共端点。
- **`--lazy-loading-block`**: 用于指定延迟加载的区块哈希的可选参数。此参数允许您指定一个区块哈希，从该哈希开始加载数据。如果未提供，将使用最新的区块。
- **`--lazy-loading-state-overrides`**: 用于指定延迟加载期间的状态覆盖的可选参数。此参数允许您提供一个包含状态覆盖的文件的路径。该文件可以包含任何应应用的自定义状态修改。
- **`--lazy-loading-runtime-override`**: 用于指定启动延迟加载时的运行时覆盖的可选参数。如果未提供，它将从正在分叉的区块中获取运行时。
- **`--lazy-loading-delay-between-requests`**: 使用延迟加载时，RPC 请求之间的延迟（以毫秒为单位）。此参数控制连续 RPC 请求之间等待的时间量。这有助于管理请求速率并避免使服务器不堪重负。默认值为 `100` 毫秒。
- **`--lazy-loading-max-retries-per-request`**: 使用延迟加载时，RPC 请求的最大重试次数。默认值为 `10` 次重试。
- **`--pool-type`**: 选择交易池实现。可用选项包括：
    - **`fork-aware`**: 跨竞争分叉（“视图”）跟踪待处理的交易，这减少了短暂重组期间丢弃/重新验证的交易以及 nonce/顺序故障。这是当前 Moonbeam 构建上的默认设置（Polkadot SDK 更改；来自 ~RT3600+ 的默认设置），建议在整理人和 RPC 节点上使用。
    - **`single-state`**: 使用旧版单视图池。在旧版本的二进制文件上，显式设置 `--pool-type=fork-aware` 以选择加入改进的实现。
- **`--pool-limit <N>`**: 池中交易的最大数量。默认为 `8192`。
- **`--pool-kbytes <KB>`**: 待处理交易的最大总大小。默认为 `20480` (≈20 MB)。
- **`--tx-ban-seconds <S>`**: 禁止无效交易的时间。默认为 `1800` 秒。
- **`--relay-chain-rpc-urls <URL>...`**: 通过从远程 RPC 获取中继链数据来减少资源使用。节点将按顺序尝试 URL，并在连接失败时回退。仍然连接到中继链网络，但带宽较低。
- **`--relay-chain-light-client`** (实验性的，仅限完整节点)：嵌入中继链轻客户端。使用指定的中继链链规范。
- **`--offchain-worker <mode>`**: 启用链下 worker。选项：`always`、`never`、`when-authority` *（默认）*。
- **`--enable-offchain-indexing <true|false>`**: 允许运行时在区块导入期间直接写入链下 worker DB。默认为 `false`。

### 执行策略标志 {: #execution-strategy }

这些标志用于调整运行时在不同上下文中的执行方式：

- **`--execution`**：所有上下文的全局默认设置。选项：`native`、`wasm`、`both`、`native-else-wasm`。
- **`--execution-syncing`**、**`--execution-import-block`**、**`--execution-block-construction`**、**`--execution-offchain-worker`**、**`--execution-other`**：使用与上述相同的选项集覆盖每个上下文的行为。

`Native-else-wasm` 和 `both` 有助于诊断升级期间的 native/wasm 差异；`wasm` 最安全，但速度较慢。

## 用于配置 SQL 后端的标志 {: #flags-for-sql-backend }

- **`--frontier-backend-type`**: 将 Frontier 后端类型设置为以下选项之一：
    - **`key-value`**: 根据从全局后端设置继承的设置，使用 RocksDB 或 ParityDB。这是默认选项，RocksDB 是默认后端。
    - **`sql`**: 使用带有自定义日志索引的 SQL 数据库。
- **`frontier-sql-backend-pool-size`**: 设置 Frontier SQL 后端的连接池可以同时处理的最大数据库连接数。默认为 `100`。
- **`frontier-sql-backend-num-ops-timeout`**: 设置 Frontier SQL 后端的查询超时，以 VM 操作数为单位。默认为 `10000000`。
- **`frontier-sql-backend-thread-count`**: 设置 Frontier SQL 后端的辅助线程限制。默认为 `4`。
- **`frontier-sql-backend-cache-size`**: 设置 Frontier SQL 后端的缓存大小（以字节为单位）。默认值为 200MB，即 `209715200` 字节。

## 如何访问所有可用标志 {: #how-to-access-all-of-the-available-flags }

要获得可用标志的完整列表，您可以使用在命令末尾添加 `--help` 的方式来启动您的 Moonbeam 节点。该命令会因您选择启动节点的方式以及是否使用 Docker 或 Systemd 而异。

### Docker {: #docker }

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/flags/1.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/flags/2.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/flags/3.sh'
    ```

### Systemd {: #systemd }

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/flags/4.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/flags/5.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/run-a-node/flags/6.sh'
    ```
