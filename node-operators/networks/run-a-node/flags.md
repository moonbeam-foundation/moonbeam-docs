---
title: Run a Node Flags & Options
description: A list of helpful flags for spinning up a full parachain node on Moonbeam. Also learn how to access all of the flags available for node operators.
categories: Node Operators and Collators
---

# Helpful Flags for Running a Node on Moonbeam

## Introduction {: #introduction }

When spinning up your own Moonbeam node, there are some required and optional flags that can be used. This guide will cover some of the most common flags and show you how to access all of the available flags.

## Common Flags {: #common-flags }

- **`--collator`**: Enables collator mode for collator candidates and, if eligible, allows the node to actively participate in block production.
- **`--port`**: Specifies the peer-to-peer protocol TCP port. The default port for parachains is `{{ networks.parachain.p2p }}` and `{{ networks.relay_chain.p2p }}` for the embedded relay chain.
- **`--rpc-port`**: Sets the unified port for both HTTP and WS connections. The default port for parachains is `{{ networks.parachain.rpc }}` and `{{ networks.relay_chain.ws }}` for the embedded relay chain.
- **`--ws-port`**: *deprecated as of [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank}, use `--rpc-port` for HTTP and WS connections instead* - Sets the unified port for both HTTP and WS connections. The default port for parachains is `{{ networks.parachain.ws }}`  and `{{ networks.relay_chain.ws }}` for the embedded relay chain.
- **`--rpc-max-connections`**: Specifies the maximum number of HTTP and WS server connections. The default is 100.
- **`--rpc-external`** — Listen on all interfaces for JSON-RPC (HTTP & WS). Use a proxy to filter unsafe methods on public endpoints. Use **`--unsafe-rpc-external`** to suppress the safety warning if you accept the risk.
- **`--rpc-methods`** — Which RPC methods to expose. Options: `auto` *(default)*, `safe`, `unsafe`.
- **`--rpc-cors`** — Comma-separated allowed browser origins (`protocol://domain`) or `all` to disable validation. In `--dev`, default allows all origins.
- **`--rpc-rate-limit <calls/min>`** — Per-connection rate limit. Disabled by default.  
  - **`--rpc-rate-limit-whitelisted-ips <CIDR>...`** — CIDR ranges exempt from the limit.  
  - **`--rpc-rate-limit-trust-proxy-headers`** — Trust `X-Forwarded-For` / `X-Real-IP` when behind a reverse proxy.
- **`--rpc-max-request-size <MB>`** / **`--rpc-max-response-size <MB>`** — Max payload sizes (default `15` / `15`).
- **`--rpc-max-subscriptions-per-connection <N>`** — Max concurrent subscriptions per connection (default `1024`).
- **`--rpc-message-buffer-capacity-per-connection <N>`** — Per-connection queued message capacity before back-pressure (default `64`).
- **`--rpc-disable-batch-requests`** and **`--rpc-max-batch-request-len <N>`** — Disable batch RPC or cap batch length.
- **`--ws-max-connections`**: *deprecated as of [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank}, use `--rpc-max-connections` to adjust the combined HTTP and WS connection limit instead* - Specifies the maximum number of HTTP and WS server connections. The default is 100.
- **`--wasm-execution`**: Specifies the method for executing Wasm runtime code. The available options are:
    - **`compiled`**: This is the default and uses the [Wasmtime](https://github.com/paritytech/wasmtime){target=\_blank} compiled runtime.
    - **`interpreted-i-know-what-i-do`**: Uses the [wasmi interpreter](https://github.com/wasmi-labs/wasmi){target=\_blank}.
- **`--wasmtime-instantiation-strategy`**: Controls WASM instantiation. Default is `pooling-copy-on-write` (fastest). Options include `recreate-instance-copy-on-write`, `pooling`, `recreate-instance`. CoW variants fall back where unsupported.
- **`--max-runtime-instances <N>`**: Size of the runtime instances cache per runtime. Default `8`, max `32`.
- **`--runtime-cache-size <N>`**: Max number of distinct runtimes cached simultaneously. Default `2`.  
- **`--wasmtime-precompiled <PATH>`** / **`--wasm-runtime-overrides <PATH>`**: Use precompiled runtimes or local WASM overrides when version matches. Advanced/ops use only.
- **`--state-pruning`**: Specifies the state pruning mode. For client versions prior to v0.27.0, the `--state-pruning` flag was named `--pruning`. If running a node with the `--collator` flag, the default is to keep the full state of all blocks. Otherwise, the state is only kept for the last 256 blocks. The available options are:
    - **`archive`**: Keeps the full state of all blocks.
    - **`<number-of-blocks>`**: Specifies a custom number of blocks to keep the state for.
- **`--trie-cache-size`**: Specifies the size of the internal state cache in bytes. The default is `1073741824` (1 GB). Providing `0` disables the cache. For performance on collators and RPC nodes, values around 1–4 GB are common, depending on hardware. (Prior to client v0.27.0 this was `--state-cache-size`.)
- **`--db-cache`**: Specifies the memory the database cache is limited to use. It is recommended to set it to 50% of the actual RAM your server has. For example, for 32 GB RAM, the value should be set to `16000`. The minimum value is `2000`, but it is below the recommended specs.
- **`--database`**: Selects the DB backend. Options: `auto` (detect or create ParityDb), `paritydb`, `paritydb-experimental`, `rocksdb`. For most operators, `auto` is fine; RocksDB may be preferred by some for tooling familiarity.
- **`--blocks-pruning`**: Prunes block bodies/justifications separately from state. Options:  
  - `archive`: keep all blocks,  
  - `archive-canonical`: keep finalized blocks only (default),  
  - `<NUMBER>`: keep the last `<NUMBER>` finalized blocks.
- **`--base-path`**: Specifies the base path where your chain data is stored.
- **`--chain`**: Specifies the chain specification to use. It can be a predefined chainspec such as `{{ networks.moonbeam.chain_spec }}`, `{{ networks.moonriver.chain_spec }}`, or `{{ networks.moonbase.chain_spec }}`. Or it can be a path to a file with the chainspec (such as the one exported by the `build-spec` command).
- **`--network-backend`**: Select the P2P stack. Options:  
  - `litep2p` (default) — lightweight, lower CPU usage, ecosystem is migrating here.  
  - `libp2p` — legacy backend kept for compatibility.
- **`--name`**: Specifies a human-readable name for the node, which can be seen on [telemetry](https://telemetry.polkadot.io){target=\_blank}, if enabled.
- **`--telemetry-url`**: Specifies the URL of the telemetry server to connect to. This flag can be passed multiple times as a means to specify multiple telemetry endpoints. This flag takes two parameters: the URL and the verbosity level. Verbosity levels range from 0-9, with 0 denoting the least verbosity. Expected format is '<URL VERBOSITY>', e.g. `--telemetry-url 'wss://foo/bar 0'`.
- **`--no-telemetry`**: Disable telemetry entirely (it is on by default on global chains).
- **`--prometheus-external`**: Expose Prometheus metrics on all interfaces (default is local).
- **`--no-prometheus`**: Disable the Prometheus endpoint.
- **`--no-prometheus-prefix`**: Remove the `moonbeam` prefix from metric names.
- **`--in-peers`**: Specifies the maximum number of inbound full-node peers. The default is `32`.
- **`--out-peers`**: Specifies the target number of outbound peers to maintain. The default is `8`.
- **`--reserved-nodes <ADDR>...`** / **`--reserved-only`**: Pin to a set of peers and (optionally) sync **only** with them. Useful for private clusters or RPC nodes behind sentry/topology.
- **`--no-hardware-benchmarks`**: Skip automatic CPU/memory/disk benchmarks at startup (also suppresses sending these to telemetry if enabled).
- **`--public-addr <MULTIADDR>...`** / **`--listen-addr <MULTIADDR>...`**: Advertised vs listen multiaddresses for P2P. Use when behind NAT/proxies.
- **`--no-private-ip`** / **`--allow-private-ip`**: Forbid/allow private address peering depending on environment.
- **`--in-peers-light <N>`**: Max inbound light-client peers (default `100`).
- **`--max-parallel-downloads <N>`**: How many peers to request the same announced blocks from in parallel. Default `5`.
- **`--runtime-cache-size 64`**: Configures the number of different runtime versions preserved in the in-memory cache to 64.
- **`--eth-log-block-cache`**: Size in bytes the LRU cache for block data is limited to use. This flag mostly pertains to RPC providers. The default is `300000000`.
- **`--eth-statuses-cache`**: Size in bytes the LRU cache for transaction statuses data is limited to use. This flag mostly pertains to RPC providers. The default is `300000000`.
- **`--sync`**: Sets the blockchain syncing mode, which can allow for the blockchain to be synced faster. The available options are:
    - **`full`**: Downloads and validates the full blockchain history.
    - **`fast`**: Downloads blocks without executing them and downloads the latest state with proofs.
    - **`fast-unsafe`**: Same as `fast`, but skips downloading the state proofs.
    - **`warp`**: Downloads the latest state and proof.
- **`--prometheus-port`**: Specifies a custom Prometheus port.
- **`--lazy-loading-remote-rpc`**: Allows [lazy loading](/node-operators/networks/run-a-node/overview/#lazy-loading){target=\_blank} by relying on a specified RPC endpoint for network state until the node is fully synchronized e.g. `--lazy-loading-remote-rpc 'https://moonbeam.unitedbloc.com'`, as long as the specified RPC endpoint has sufficient rate limits to handle the expected load. Private (API key) endpoints are strongly recommended over public endpoints.
- **`--lazy-loading-block`**: Optional parameter to specify the block hash for lazy loading. This parameter allows you to specify a block hash from which to start loading data. If not provided, the latest block will be used.
- **`--lazy-loading-state-overrides`**: Optional parameter to specify state overrides during lazy loading. This parameter allows you to provide a path to a file containing state overrides. The file can contain any custom state modifications that should be applied.
- **`--lazy-loading-runtime-override`**: Optional parameter to specify a runtime override when starting the lazy loading. If not provided, it will fetch the runtime from the block being forked.
- **`--lazy-loading-delay-between-requests`**: The delay (in milliseconds) between RPC requests when using lazy loading. This parameter controls the amount of time to wait between consecutive RPC requests. This can help manage request rate and avoid overwhelming the server. Default value is `100` milliseconds.
- **`--lazy-loading-max-retries-per-request`**: The maximum number of retries for an RPC request when using lazy loading. Default value is `10` retries.
- **`--pool-type`**: Selects the transaction pool implementation. The available options are:
    - **`fork-aware`**: Tracks pending transactions across competing forks ("views"), which reduces dropped/re-validated transactions and nonce/order glitches during brief reorgs. This is the default on current Moonbeam builds (Polkadot SDK change; default from ~RT3600+) and is recommended on collators and RPC nodes.
    - **`single-state`**: Uses the legacy single-view pool. On older binaries, explicitly set `--pool-type=fork-aware` to opt in to the improved implementation.
- **`--pool-limit <N>`**: Max number of transactions in the pool. Default `8192`.
- **`--pool-kbytes <KB>`**: Max total size of pending transactions. Default `20480` (≈20 MB).
- **`--tx-ban-seconds <S>`**: How long to ban invalid transactions. Default `1800` seconds.
- **`--relay-chain-rpc-urls <URL>...`**: Reduce resource usage by fetching relay-chain data from remote RPC(s). The node will try the URLs in order and fall back if a connection fails. Still connects to the relay chain network but with lower bandwidth.
- **`--relay-chain-light-client`** (experimental, full nodes only): Embed a relay-chain light client. Uses the specified relay-chain chainspec.
- **`--offchain-worker <mode>`**: Enable offchain workers. Options: `always`, `never`, `when-authority` *(default)*.
- **`--enable-offchain-indexing <true|false>`**: Allow the runtime to write directly to the offchain workers DB during block import. Default `false`.


### Execution Strategy Flags {: #execution-strategy }

These tune how the runtime executes in different contexts:

- **`--execution`**: Global default for all contexts. Options: `native`, `wasm`, `both`, `native-else-wasm`.
- **`--execution-syncing`**, **`--execution-import-block`**, **`--execution-block-construction`**, **`--execution-offchain-worker`**, **`--execution-other`**: Override per-context behavior with the same option set as above.

`Native-else-wasm` and `both` can help diagnose native/wasm divergence during upgrades; `wasm` is safest but slower.


## Flags for Configuring a SQL Backend {: #flags-for-sql-backend }

- **`--frontier-backend-type`**: Sets the Frontier backend type to one of the following options:
    - **`key-value`**: Uses either RocksDB or ParityDB as per inherited from the global backend settings. This is the default option and RocksDB is the default backend.
    - **`sql`**: Uses a SQL database with custom log indexing.
- **`frontier-sql-backend-pool-size`**: Sets the Frontier SQL backend's maximum number of database connections that a connection pool can simultaneously handle. The default is `100`.
- **`frontier-sql-backend-num-ops-timeout`**: Sets the Frontier SQL backend's query timeout in number of VM operations. The default is `10000000`.
- **`frontier-sql-backend-thread-count`**: Sets the Frontier SQL backend's auxiliary thread limit. The default is `4`.
- **`frontier-sql-backend-cache-size`**: Sets the Frontier SQL backend's cache size in bytes. The default value is 200MB, which is `209715200` bytes.

## How to Access All of the Available Flags {: #how-to-access-all-of-the-available-flags }

For a complete list of the available flags, you can spin up your Moonbeam node with `--help` added to the end of the command. The command will vary depending on how you choose to spin up your node, and if you're using Docker or Systemd.

### Docker {: #docker }

=== "Moonbeam"

    ```bash
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
    --help
    ```

=== "Moonriver"

    ```bash
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
    --help
    ```

=== "Moonbase Alpha"

    ```bash
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
    --help
    ```

### Systemd {: #systemd }

=== "Moonbeam"

    ```bash
    # If you used the release binary
    ./{{ networks.moonbeam.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonbeam.binary_name }} --help
    ```

=== "Moonriver"

    ```bash
    # If you used the release binary
    ./{{ networks.moonriver.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonriver.binary_name }} --help
    ```

=== "Moonbase Alpha"

    ```bash
    # If you used the release binary
    ./{{ networks.moonbase.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonbase.binary_name }} --help
    ```
