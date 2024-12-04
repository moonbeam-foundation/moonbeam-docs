---
title: Run a Node Flags & Options
description: A list of helpful flags for spinning up a full parachain node on Moonbeam. Also learn how to access all of the flags available for node operators.
---

# Helpful Flags for Running a Node on Moonbeam

## Introduction {: #introduction }

When spinning up your own Moonbeam node, there are some required and optional flags that can be used.

This guide will cover some of the most common flags and show you how to access all of the available flags.

## Common Flags {: #common-flags }

- **`--collator`** - enables collator mode for collator candidates and, if eligible, allows the node to actively participate in block production
- **`--port`** - specifies the peer-to-peer protocol TCP port. The default port for parachains is `{{ networks.parachain.p2p }}` and `{{ networks.relay_chain.p2p }}` for the embedded relay chain
- **`--rpc-port`** - sets the unified port for both HTTP and WS connections. The default port for parachains is `{{ networks.parachain.rpc }}` and `{{ networks.relay_chain.ws }}` for the embedded relay chain
- **`--ws-port`** - - *deprecated as of [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank}, use `--rpc-port` for HTTP and WS connections instead* - sets the unified port for both HTTP and WS connections. The default port for parachains is `{{ networks.parachain.ws }}`  and `{{ networks.relay_chain.ws }}` for the embedded relay chain
- **`--rpc-max-connections`** - specifies the maximum number of HTTP and WS server connections. The default is 100
- **`--ws-max-connections`** - *deprecated as of [client v0.33.0](https://github.com/moonbeam-foundation/moonbeam/releases/tag/v0.33.0){target=\_blank}, use `--rpc-max-connections` to adjust the combined HTTP and WS connection limit instead* - specifies the maximum number of HTTP and WS server connections. The default is 100
- **`--wasm-execution`** - specifies the method for executing Wasm runtime code. The available options are:
    - **`compiled`** - this is the default and uses the [Wasmtime](https://github.com/paritytech/wasmtime){target=\_blank} compiled runtime
    - **`interpreted-i-know-what-i-do`** - uses the [wasmi interpreter](https://github.com/wasmi-labs/wasmi){target=\_blank}
- **`--state-pruning`** - specifies the state pruning mode. For client versions prior to v0.27.0, the `--state-pruning` flag was named `--pruning`. If running a node with the `--collator` flag, the default is to keep the full state of all blocks. Otherwise, the state is only kept for the last 256 blocks. The available options are:
    - **`archive`** - keeps the full state of all blocks
    - **`<number-of-blocks>`** - specifies a custom number of blocks to keep the state for
- **`--trie-cache-size`** - specifies the size of the internal state cache. The default is `67108864`. You can try setting this value to `1073741824` (1GB) to improve collator performance. However, this value may be too low and need to be adjusted. For client versions prior to v0.27.0, the `--trie-cache-size` flag was named `--state-cache-size`
- **`--db-cache`** - specifies the memory the database cache is limited to use. It is recommended to set it to 50% of the actual RAM your server has. For example, for 32 GB RAM, the value should be set to `16000`. The minimum value is `2000`, but it is below the recommended specs
- **`--base-path`** - specifies the base path where your chain data is stored
- **`--chain`** - specifies the chain specification to use. It can be a predefined chainspec such as `{{ networks.moonbeam.chain_spec }}`, `{{ networks.moonriver.chain_spec }}`, or `{{ networks.moonbase.chain_spec }}`. Or it can be a path to a file with the chainspec (such as the one exported by the `build-spec` command)
- **`--name`** - specifies a human-readable name for the node, which can be seen on [telemetry](https://telemetry.polkadot.io){target=\_blank}, if enabled
- **`--telemetry-url`** - specifies the URL of the telemetry server to connect to. This flag can be passed multiple times as a means to specify multiple telemetry endpoints. This flag takes two parameters: the URL and the verbosity level. Verbosity levels range from 0-9, with 0 denoting the least verbosity. Expected format is '<URL VERBOSITY>', e.g. `--telemetry-url 'wss://foo/bar 0'`.
- **`--in-peers`** - specifies the maximum amount of accepted incoming connections. The default is `25`
- **`--out-peers`** - specifies the maximum amount of outgoing connections to maintain. The default is `25`
- **`--runtime-cache-size 64`** - configures the number of different runtime versions preserved in the in-memory cache to 64
- **`--eth-log-block-cache`** - size in bytes the LRU cache for block data is limited to use. This flag mostly pertains to RPC providers. The default is `300000000`
- **`--eth-statuses-cache`** - size in bytes the LRU cache for transaction statuses data is limited to use. This flag mostly pertains to RPC providers. The default is `300000000`
- **`--sync`** - sets the blockchain syncing mode, which can allow for the blockchain to be synced faster. The available options are:
    - **`full`** - downloads and validates the full blockchain history
    - **`fast`** - downloads blocks without executing them and downloads the latest state with proofs
    - **`fast-unsafe`** - same as `fast`, but skips downloading the state proofs
    - **`warp`** - downloads the latest state and proof
- **`--prometheus-port`** - specifies a custom Prometheus port

## Flags for Configuring a SQL Backend {: #flags-for-sql-backend }

- **`--frontier-backend-type`** - sets the Frontier backend type to one of the following options:
    - **`key-value`** - uses either RocksDB or ParityDB as per interited from the global backend settings. This is the default option and RocksDB is the default backend
    - **`sql`** - uses a SQL database with custom log indexing
- **`frontier-sql-backend-pool-size`** - sets the Frontier SQL backend's maximum number of database connections that a connection pool can simultaneously handle. The default is `100`
- **`frontier-sql-backend-num-ops-timeout`** - sets the Frontier SQL backend's query timeout in number of VM operations. The default is `10000000`
- **`frontier-sql-backend-thread-count`** - sets the Frontier SQL backend's auxiliary thread limit. The default is `4`
- **`frontier-sql-backend-cache-size`** - sets the Frontier SQL backend's cache size in bytes. The default value is 200MB, which is `209715200` bytes

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
