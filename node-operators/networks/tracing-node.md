---
title: Run a Tracing Node
description: Learn how to leverage Geth's Debug and Txpool APIs, and OpenEthereum's Trace module to run a tracing node on Moonbeam.
categories: Node Operators and Collators
---

# Run a Tracing Node

## Introduction {: #introduction }

Geth's `debug` and `txpool` APIs and OpenEthereum's `trace` module provide non-standard RPC methods for getting a deeper insight into transaction processing. As part of Moonbeam's goal of providing a seamless Ethereum experience for developers, there is support for some of these non-standard RPC methods. Supporting these RPC methods is an important milestone because many projects, such as [The Graph](https://thegraph.com){target=\_blank}, rely on them to index blockchain data.

To use the supported RPC methods, you need to run a tracing node, which is slightly different than running a full node. There is a different Docker image, called `moonbeamfoundation/moonbeam-tracing` that needs to be used for tracing. Additional flags will also need to be used to tell the node which of the non-standard features to support.

This guide will show you how to get started running a tracing node on Moonbeam with the `debug`, `txpool`, and `tracing` flags enabled.

## Checking Prerequisites {: #checking-prerequisites }

Similarly to running a regular node, you can spin up a tracing node using Docker or Systemd. If you choose to use Docker, you must [install Docker](https://docs.docker.com/get-started/get-docker/){target=\_blank} if you haven't already. At the time of writing, the Docker version used was 19.03.6.

## Tracing Node Flags {: #tracing-node-flags }

Spinning up a `debug`, `txpool`, or `tracing` node is similar to [running a full node](/node-operators/networks/run-a-node/overview/){target=_blank}, but requires additional flags to enable the non-standard Ethereum RPC modules. These flags control tracing depth, caching, and runtime configuration.

- **`--ethapi debug`**: Enables the `debug` module with RPC methods such as `debug_traceTransaction`, `debug_traceBlockByNumber`, `debug_traceBlockByHash`, and `debug_traceCall`.
- **`--ethapi trace`**: Enables the `trace` module and its associated RPC methods like `trace_filter`.
- **`--ethapi txpool`**: Enables the `txpool` module, which provides `txpool_content`, `txpool_inspect`, and `txpool_status`.
- **`--wasm-runtime-overrides <path/to/overrides>`**: **Required** for tracing. Specifies the path where local Wasm runtimes are stored.  
  - For Docker setups, use `/moonbeam/<network>-substitutes-tracing`, where `<network>` is `moonbeam`, `moonriver`, or `moonbase` (for Moonbase Alpha or dev nodes).
- **`--runtime-cache-size 64`**: **Required**. Configures the number of different runtime versions preserved in the in-memory cache to `64`.
- **`--ethapi-max-permits <uint>`**: Sets the number of concurrent tracing tasks shared by tracing modules (`debug`, `trace`). Default: `10`.
- **`--ethapi-trace-max-count <uint>`**: Sets the maximum number of trace entries that a single `trace_filter` request can return. Default: `500`.
- **`--ethapi-trace-cache-duration <uint>`**: Duration (in seconds) after which cached `trace_filter` results for a block are discarded. Default: `300`.
- **`--eth-log-block-cache <bytes>`**: Size of the LRU cache (in bytes) used for storing block data. Default: `300000000`.
- **`--eth-statuses-cache <bytes>`**: Size of the LRU cache (in bytes) used for storing transaction status data. Default: `300000000`.
- **`--fee-history-limit <uint>`**: Sets the maximum fee history cache size for `eth_feeHistory` requests. Default: `2048`.
- **`--max-past-logs <uint>`**: Maximum number of logs returned by a single log query. Default: `10000`.
- **`--max-block-range <uint>`**: Maximum block span allowed in a single log query. Default: `1024`.
- **`--tracing-raw-max-memory-usage <bytes>`**: Upper bound for memory used by raw tracing requests (stack, storage, and memory data). Default: `20000000`.

!!! note
    If you want to run an RPC endpoint to connect to Polkadot.js Apps or your own dApp, use the `--unsafe-rpc-external` flag to allow external access to RPC ports. More details are available by running `moonbeam --help`.
 

## Run a Tracing Node with Docker {: #run-a-tracing-node-with-docker }

If you haven't previously run a standard full Moonbeam node, you will need to setup a directory to store chain data:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/1.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/2.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/3.sh'
    ```

Before getting started, you'll need to set the necessary permissions either for a specific or current user (replace `INSERT_DOCKER_USER` for the actual user that will run the `docker` command):

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/4.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/5.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/6.sh'
    ```

Instead of the standard `moonbeamfoundation/moonbeam` docker image, you will need to use `moonbeamfoundation/moonbeam-tracing` image. The latest supported version can be found on the [Docker Hub for the `moonbeam-tracing` image](https://hub.docker.com/r/moonbeamfoundation/moonbeam-tracing/tags){target=\_blank}.

Now, execute the docker run command. Note that you have to:

 - Replace `INSERT_YOUR_NODE_NAME` in two different places
 - Replace `INSERT_RAM_IN_MB` for 50% of the actual RAM your server has. For example, for 32 GB RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs

--8<-- 'text/node-operators/networks/run-a-node/client-changes.md'

The complete command for running a tracing node is as follows:

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/7.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/8.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/9.sh'
    ```

=== "Moonbeam Dev Node"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/10.sh'
    ```

You should see a terminal log similar to the following if you spun up a Moonbase Alpha tracing node:

--8<-- 'code/builders/ethereum/json-rpc/debug-trace/terminal/start-up-logs.md'

## Run a Tracing Node with Systemd {: #run-a-tracing-node-with-systemd }

When you run a node using Systemd, you'll need to start off by setting up the Moonbeam binary. To do so you'll need to follow the instructions on the [Run a Node on Moonbeam Using Systemd](/node-operators/networks/run-a-node/systemd/){target=\_blank} page. In general, you'll need to:

1. Setup the Moonbeam binary by following the [Release Binary](/node-operators/networks/run-a-node/systemd/#the-release-binary){target=\_blank} instructions. Or if you want to compile the binary yourself, you can follow the [Compile the Binary](/node-operators/networks/run-a-node/systemd/#compile-the-binary){target=\_blank} instructions
2. Follow the instructions in the [Setup the Service](/node-operators/networks/run-a-node/systemd/#setup-the-service){target=\_blank} instructions

Once you've finished going through the instructions in those specific sections, you can continue on to the below instructions.

### Setup the Wasm Overrides {: #setup-the-wasm-overrides }

You'll need to create a directory for the Wasm runtime overrides and obtain them from the [Moonbeam Runtime Overrides repository](https://github.com/moonbeam-foundation/moonbeam-runtime-overrides){target=\_blank} on GitHub.

You can clone the repository to any location on your local machine. For simplicity, you can use the directory where you're storing on-chain data. To set up the Wasm override files, you can take the following steps:

1. Clone the [Moonbeam Runtime Overrides repository](https://github.com/moonbeam-foundation/moonbeam-runtime-overrides){target=\_blank}

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/11.sh'
    ```

2. Move the Wasm overrides into your on-chain data directory:

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/12.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/13.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/14.sh'
        ```

3. Delete the override files for the networks that you aren't running

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/15.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/16.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/17.sh'
        ```

4. Set user permissions for the overrides:

    === "Moonbeam"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/18.sh'
        ```

    === "Moonriver"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/19.sh'
        ```

    === "Moonbase Alpha"

        ```bash
        --8<-- 'code/node-operators/networks/tracing-node/20.sh'
        ```

### Create the Configuration File {: #create-the-configuration-file }

The next step is to create the systemd configuration file, you'll need to:

 - Replace `INSERT_YOUR_NODE_NAME` in two different places
 - Replace `INSERT_RAM_IN_MB` for 50% of the actual RAM your server has. For example, for 32 GB RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs
 - Double-check that the binary is in the proper path as described below (_ExecStart_)
 - Double-check the base path if you've used a different directory
 - Name the file `/etc/systemd/system/moonbeam.service`

--8<-- 'text/node-operators/networks/run-a-node/client-changes.md'

=== "Moonbeam"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/21.sh'
    ```

=== "Moonriver"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/22.sh'
    ```

=== "Moonbase Alpha"

    ```bash
    --8<-- 'code/node-operators/networks/tracing-node/23.sh'
    ```

!!! note
    If you want to run an RPC endpoint, to connect polkadot.js.org, or to run your own application, use the `--unsafe-rpc-external` flag to run the full node with external access to the RPC ports. More details are available by running `moonbeam --help`.

### Run the Service {: #run-the-service }

--8<-- 'text/node-operators/networks/run-a-node/systemd/run-service.md'

--8<-- 'code/node-operators/networks/tracing-node/terminal/status.md'

You can also run the following command to see logs of the tracing node spinning up:

```bash
--8<-- 'code/node-operators/networks/tracing-node/24.sh'
```

Your terminal should display logs similar to the following:

--8<-- 'code/node-operators/networks/tracing-node/terminal/logs.md'

## Using a Tracing Node {: #using-a-tracing-node }

To explore the different non-standard RPC methods available on Moonbeam, and how to use these methods with a tracing node, check out the [Debug & Trace](/builders/ethereum/json-rpc/debug-trace/) guide.
