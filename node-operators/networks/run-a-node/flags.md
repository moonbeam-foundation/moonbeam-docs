---
title: Run a Node Flags & Options
description: A list of helpful flags for spinning up a full parachain node on Moonbeam. Also learn how to access all of the flags available for node operators.
---

# Helpful Flags for Running a Node on Moonbeam

![Full Node Moonbeam Banner](/images/node-operators/networks/run-a-node/flags/flags-banner.png)

## Introduction {: #introduction }

When spinning up your own Moonbeam node, there are some required and optional flags that can be used.

This guide will cover some of the most common flags and show you how to access all of the available flags.

## Common Flags {: #common-flags }

- **`--validator`** - enables validator mode for collator candidates and, if eligible, allows the node to actively participate in block production
- **`--port`** - specifies the peer-to-peer protocol TCP port. The default port for parachains is `{{ networks.parachain.p2p }}` and `{{ networks.relay_chain.p2p }}` for the embedded relay chain
- **`--rpc-port`**  - specifies the HTTP RPC server TCP port. The default port for parachains is `{{ networks.parachain.rpc }}`  and `{{ networks.relay_chain.rpc }}` for the embedded relay chain
- **`--ws-port`** - specifies the WebSockets RPC server TCP port. The default port for parachains is `{{ networks.parachain.ws }}`  and `{{ networks.relay_chain.ws }}` for the embedded relay chain
- **`--execution`** - specifies the execution strategy that should be used by all execution contexts. The Substrate runtime is compiled into a native executable which is included locally as part of the node and a WebAssembly (Wasm) binary that is stored on-chain. The available options are:
    - **`native`** - only execute with the native build
    - **`wasm`** - only execute with the Wasm build
    - **`both`** - execute with both native and Wasm builds
    - **`nativeelsewasm`** - execute with the native build if possible and if it fails, then execute with Wasm
- **`--wasm-execution`** - specifies the method for executing Wasm runtime code. The available options are:
    - **`compiled`** - this is the default and uses the [Wasmtime](https://github.com/paritytech/wasmtime){target=_blank} compiled runtime
    - **`interpreted-i-know-what-i-do`** - uses the [wasmi interpreter](https://github.com/paritytech/wasmi){target=_blank}
- **`--state-pruning`** - specifies the state pruning mode. If running a node with the `--validator` flag, the default is to keep the full state of all blocks. Otherwise, the state is only kept for the last 256 blocks. The available options are:
    - **`archive`** - keeps the full state of all blocks
    - **`<number-of-blocks>`** - specifies a custom number of blocks to keep the state for
- **`--state-cache-size`** - specifies the size of the internal state cache. The default is `67108864`. You can set this value to `0` to disable the cache and improve collator performance
- **`--db-cache`** - specifies the memory the database cache is limited to use. It is recommended to set it to 50% of the actual RAM your server has. For example, for 32 GB RAM, the value should be set to `16000`. The minimum value is `2000`, but it is below the recommended specs 
- **`--base-path`** - specifies the base path where your chain data is stored
- **`--chain`** - specifies the chain specification to use. It can be a predefined chainspec such as `{{ networks.moonbeam.chain_spec }}`, `{{ networks.moonriver.chain_spec }}`, or `{{ networks.moonbase.chain_spec }}`. Or it can be a path to a file with the chainspec (such as the one exported by the `build-spec` command)
- **`--name`** - specifies a human-readable name for the node, which can be seen on [telemetry](https://telemetry.polkadot.io/){target=_blank}, if enabled
- **`--telemetry-url`** - specifies the URL of the telemetry server to connect to. This flag can be passed multiple times as a means to specify multiple telemetry endpoints. This flag takes two parameters: the URL and the verbosity level. Verbosity levels range from 0-9, with 0 denoting the least verbosity. Expected format is '<URL VERBOSITY>', e.g. `--telemetry-url 'wss://foo/bar 0'`.
- **`--in-peers`** - specifies the maximum amount of accepted incoming connections. The default is `25`
- **`--out-peers`** - specifies the maximum amount of outgoing connections to maintain. The default is `25`
- **`--runtime-cache-size 64`** - configures the number of different runtime versions preserved in the in-memory cache to 64
- **`--eth-log-block-cache`** - size in bytes the LRU cache for block data is limited to use. This flag mostly pertains to RPC providers. The default is `300000000`
- **`--eth-statuses-cache`** - size in bytes the LRU cache for transaction statuses data is limited to use. This flag mostly pertains to RPC providers. The default is `300000000` 

## How to Access All of the Available Flags {: #how-to-access-all-of-the-available-flags }

For a complete list of the available flags, you can spin up your Moonbeam node with `--help` added to the end of the command. The command will vary depending on how you choose to spin up your node, and if you're using Docker or Systemd.

### Docker {: #docker }

=== "Moonbeam"
    ```
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
    --help
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
    --help
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
    --help
    ```

### Systemd {: #systemd }

=== "Moonbeam"
    ```
    # If you used the release binary
    ./{{ networks.moonbeam.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonbeam.binary_name }} --help
    ```

=== "Moonriver"
    ```
    # If you used the release binary
    ./{{ networks.moonriver.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonriver.binary_name }} --help
    ```

=== "Moonbase Alpha"
    ```
    # If you used the release binary
    ./{{ networks.moonbase.binary_name }} --help

    # Or if you compiled the binary
    ./target/release/{{ networks.moonbase.binary_name }} --help
    ```
