---
title: Run a Tracing Node
description:  Learn how to leverage Geth's Debug and Txpool APIs, and OpenEthereum's Trace module to run a tracing node on Moonbeam
---

# Run a Tracing Node

![Debug & Trace Moonbeam Banner](/images/node-operators/networks/tracing-node/tracing-node-banner.png)

## Introduction {: #introduction } 

Geth's `debug` and `txpool` APIs and OpenEthereum's `trace` module provide non-standard RPC methods for getting a deeper insight into transaction processing. As part of Moonbeam's goal of providing a seamless Ethereum experience for developers, there is support for some of these non-standard RPC methods. Supporting these RPC methods is an important milestone because many projects, such as [The Graph](https://thegraph.com/) or [Blockscout](https://docs.blockscout.com/), rely on them to index blockchain data.

To use the supported RPC methods, you need to run a tracing node, which is slightly different than running a full node. There is a different Docker image, called `purestake/moonbeam-tracing` that needs to be used for tracing. Additional flags will also need to be used to tell the node which of the non-standard features to support.

This guide will show you how to get started running a tracing node on Moonbeam with the `debug`, `txpool`, and `tracing` flags enabled.

## Checking Prerequisites {: #checking-prerequisites }

Running a tracing node requires you to have Docker installed. For more information on installing Docker, please visit [this page](https://docs.docker.com/get-docker/). At the time of writing, the Docker version used was 19.03.6.

If you haven't previously run a standard full Moonbeam node, you will need to setup a directory to store chain data:

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    ```

Next, make sure you set the ownership and permissions accordingly for the local directory that stores the chain data. In this case, set the necessary permissions either for a specific or current user (replace `DOCKER_USER` for the actual user that will run the `docker` command):

=== "Moonbase Alpha"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbase.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```

=== "Moonriver"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

## Run a Tracing Node {: #run-a-tracing-node }

Spinning up a `debug`, `txpool`, or `tracing` node is similar to [running a full node](/node-operators/networks/run-a-node/overview/). Instead of the standard `purestake/moonbeam` docker image, you will need to use `purestake/moonbeam-tracing` image. The latest supported version can be found on the [Docker Hub for the `moonbeam-tracing` image](https://hub.docker.com/r/purestake/moonbeam-tracing/tags).

You will also need to start your node with the following flag(s) depending on the features you would like to enable:

  - **`--ethapi=debug`** - optional flag that enables `debug_traceTransaction`, `debug_traceBlockByNumber`, and `debug_traceBlockByHash`
  - **`--ethapi=trace`** - optional flag that enables `trace_filter` 
  - **`--ethapi=txpool`** - optional flag that enables `txpool_content`, `txpool_inspect`, and `txpool_status`
  - **`--wasm-runtime-overrides=/moonbeam/<network>-substitutes-tracing`** - **required** flag for tracing that specifies the path where the local WASM runtimes are stored. Accepts the network as a parameter: `moonbase` (for development nodes and Moonbase Alpha) or `moonriver` 

The complete command for running a tracing node is as follows:

=== "Moonbeam Development Node"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --base-path=/data \
    --name="Moonbeam-Tutorial" \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    --dev
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --base-path=/data \
    --chain alphanet \
    --name="Moonbeam-Tutorial" \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    -- \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --base-path=/data \
    --chain moonriver \
    --name="Moonbeam-Tutorial" \
    --execution native \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonriver-substitutes-tracing \
    -- \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

!!! note
    If you want to run an RPC endpoint, to connect polkadot.js.org, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports.  More details are available by running `moonbeam --help`.  

You should see a terminal log similar to the following if you spun up a Moonbase Alpha tracing node:

![Debug API](/images/builders/tools/debug-trace/debug-trace-1.png)

## Additional Flags {: #additional-flags }

To use the Wasm binary stored on-chain, run the following command:

  - **`--execution=wasm`** - sets the execution strategy that should be used by all execution contexts to `wasm`

By default, the maximum number of trace entries a single request of `trace_filter` is allowed to return is `500`. A request exceeding this limit will return an error. You can set a different maximum limit with the following flag:

  - **`--ethapi-trace-max-count <uint>`** — sets the maximum number of trace entries to be returned by the node

Blocks processed by requests are temporarily stored on cache for a certain amount of time (default is `300` seconds), after which they are deleted. You can set a different time for deletion with the following flag:

  - **`-ethapi-trace-cache-duration <uint>`** — sets the duration (in seconds) after which the cache of `trace_filter,` for a given block, is discarded

## Using a Tracing Node {: #using-a-tracing-node }

To explore the different non-standard RPC methods available on Moonbeam, and how to use these methods with a tracing node, check out the [Debug & Trace](/builders/tools/debug-trace/) guide.