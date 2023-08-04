---
title: Run a Tracing Node
description:  Learn how to leverage Geth's Debug and Txpool APIs, and OpenEthereum's Trace module to run a tracing node on Moonbeam
---

# Run a Tracing Node

![Debug & Trace Moonbeam Banner](/images/node-operators/networks/tracing-node/tracing-node-banner.png)

## Introduction {: #introduction }

Geth's `debug` and `txpool` APIs and OpenEthereum's `trace` module provide non-standard RPC methods for getting a deeper insight into transaction processing. As part of Moonbeam's goal of providing a seamless Ethereum experience for developers, there is support for some of these non-standard RPC methods. Supporting these RPC methods is an important milestone because many projects, such as [The Graph](https://thegraph.com/){target=_blank} or [Blockscout](https://docs.blockscout.com/){target=_blank}, rely on them to index blockchain data.

To use the supported RPC methods, you need to run a tracing node, which is slightly different than running a full node. There is a different Docker image, called `purestake/moonbeam-tracing` that needs to be used for tracing. Additional flags will also need to be used to tell the node which of the non-standard features to support.

This guide will show you how to get started running a tracing node on Moonbeam with the `debug`, `txpool`, and `tracing` flags enabled.

## Checking Prerequisites {: #checking-prerequisites }

Similarly to running a regular node, you can spin up a tracing node using Docker or Systemd. If you choose to use Docker, you must [install Docker](https://docs.docker.com/get-docker/){target=_blank} if you haven't already. At the time of writing, the Docker version used was 19.03.6.

## Tracing Node Flags {: #tracing-node-flags }

Spinning up a `debug`, `txpool`, or `tracing` node is similar to [running a full node](/node-operators/networks/run-a-node/overview/){target=_blank}. However, there are some additional flags that you may want to enable specific tracing features:

  - **`--ethapi=debug`** - optional flag that enables `debug_traceTransaction`, `debug_traceBlockByNumber`, and `debug_traceBlockByHash`
  - **`--ethapi=trace`** - optional flag that enables `trace_filter`
  - **`--ethapi=txpool`** - optional flag that enables `txpool_content`, `txpool_inspect`, and `txpool_status`
  - **`--wasm-runtime-overrides=<path/to/overrides>`** - **required** flag for tracing that specifies the path where the local Wasm runtimes are stored. If you're using Docker, the path is as follows: `/moonbeam/<network>-substitutes-tracing`. Accepts the network as a parameter: `moonbeam`, `moonriver`, or `moonbase` (for development nodes and Moonbase Alpha)
  - **`--runtime-cache-size 64`** - **required** flag that configures the number of different runtime versions preserved in the in-memory cache to 64
  - **`--execution=wasm`** - sets the execution strategy that should be used by all execution contexts to `wasm`. In other words, this enables usage of the Wasm binary stored on-chain
  - **`--ethapi-trace-max-count <uint>`** — sets the maximum number of trace entries to be returned by the node. The default maximum number of trace entries a single request of `trace_filter` returns is `500`
  - **`-ethapi-trace-cache-duration <uint>`** — sets the duration (in seconds) after which the cache of `trace_filter,` for a given block, is discarded. The default amount of time blocks are stored in the cache is `300` seconds

!!! note
    If you want to run an RPC endpoint, to connect to Polkadot.js Apps, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports.  More details are available by running `moonbeam --help`.  

## Run a Tracing Node with Docker {: #run-a-tracing-node-with-docker }

If you haven't previously run a standard full Moonbeam node, you will need to setup a directory to store chain data:

=== "Moonbeam"
    ```
    mkdir {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"
    ```
    mkdir {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"
    ```
    mkdir {{ networks.moonbase.node_directory }}
    ```

Before getting started, you'll need to set the necessary permissions either for a specific or current user (replace `DOCKER_USER` for the actual user that will run the `docker` command):

=== "Moonbeam"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbeam.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbeam.node_directory }}
    ```

=== "Moonriver"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonriver.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonriver.node_directory }}
    ```

=== "Moonbase Alpha"
    ```
    # chown to a specific user
    chown DOCKER_USER {{ networks.moonbase.node_directory }}

    # chown to current user
    sudo chown -R $(id -u):$(id -g) {{ networks.moonbase.node_directory }}
    ```

Instead of the standard `purestake/moonbeam` docker image, you will need to use `purestake/moonbeam-tracing` image. The latest supported version can be found on the [Docker Hub for the `moonbeam-tracing` image](https://hub.docker.com/r/purestake/moonbeam-tracing/tags).

Now, execute the docker run command. Note that you have to:

 - Replace `YOUR-NODE-NAME` in two different places
 - Replace `<50% RAM in MB>` for 50% of the actual RAM your server has. For example, for 32 GB RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs

!!! note
    For client versions prior to v0.27.0, the `--state-pruning` flag was named `--pruning`.

    For client versions prior to v0.30.0, `--rpc-port` was used to specify the port for HTTP connections and `--ws-port` was used to specify the port for WS connections. As of client v0.30.0, the `--rpc-port` has been deprecated and the `--ws-port` flag is for both HTTP and WS connections. Similarly, the `--rpc-max-connections` flag has been deprecated and is now hardcoded to 100. You can use `--ws-max-connections` to adjust the combined HTTP and WS connection limit.

The complete command for running a tracing node is as follows:

=== "Moonbeam"
    ```
    docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonbeam.tracing_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbeam.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --state-pruning archive \
    --trie-cache-size 0 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbeam-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --execution wasm \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonriver"
    ```
    docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonriver.tracing_tag }} \
    --base-path=/data \
    --chain {{ networks.moonriver.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --state-pruning archive \
    --trie-cache-size 0 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonriver-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --execution wasm \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.moonbase.tracing_tag }} \
    --base-path=/data \
    --chain {{ networks.moonbase.chain_spec }} \
    --name="YOUR-NODE-NAME" \
    --state-pruning archive \
    --trie-cache-size 0 \
    --db-cache <50% RAM in MB> \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    --runtime-cache-size 64 \
    -- \
    --execution wasm \
    --name="YOUR-NODE-NAME (Embedded Relay)"
    ```

=== "Moonbeam Dev Node"
    ```
    docker run --network="host" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    {{ networks.development.tracing_tag }} \
    --name="YOUR-NODE-NAME" \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    --runtime-cache-size 64 \
    --dev
    ```

You should see a terminal log similar to the following if you spun up a Moonbase Alpha tracing node:

![Debug API](/images/builders/build/eth-api/debug-trace/debug-trace-1.png)

## Run a Tracing Node with Systemd {: #run-a-tracing-node-with-systemd }

When you run a node using Systemd, you'll need to start off by setting up the Moonbeam binary. To do so you'll need to follow the instructions on the [Run a Node on Moonbeam Using Systemd](/node-operators/networks/run-a-node/systemd/){target=_blank} page. In general, you'll need to:

1. Setup the Moonbeam binary by following the [Release Binary](/node-operators/networks/run-a-node/systemd/#the-release-binary){target=_blank} instructions. Or if you want to compile the binary yourself, you can follow the [Compile the Binary](/node-operators/networks/run-a-node/systemd/#compile-the-binary){target=_blank} instructions
2. Follow the instructions in the [Setup the Service](/node-operators/networks/run-a-node/systemd/#setup-the-service){target=_blank} instructions

Once you've finished going through the instructions in those specific sections, you can continue on to the below instructions.

### Setup the Wasm Overrides {: #setup-the-wasm-overrides }

You'll need to create a directory for the Wasm runtime overrides and obtain them from the [Moonbeam Runtime Overrides repository](https://github.com/moonbeam-foundation/moonbeam-runtime-overrides){target=_blank} on GitHub.

You can clone the repository to any location on your local machine. For simplicity, you can use the directory where you're storing on-chain data. To set up the Wasm override files, you can take the following steps:

1. Clone the [Moonbeam Runtime Overrides repository](https://github.com/moonbeam-foundation/moonbeam-runtime-overrides){target=_blank}
    ```
    git clone https://github.com/moonbeam-foundation/moonbeam-runtime-overrides.git
    ```

2. Move the Wasm overrides into your on-chain data directory:

    === "Moonbeam"
        ```
        mv moonbeam-runtime-overrides/wasm {{ networks.moonbeam.node_directory }}
        ```

    === "Moonriver"
        ```
        mv moonbeam-runtime-overrides/wasm {{ networks.moonriver.node_directory }}
        ```

    === "Moonbase Alpha"
        ```
        mv moonbeam-runtime-overrides/wasm {{ networks.moonbase.node_directory }}
        ```

3. Delete the override files for the networks that you aren't running

    === "Moonbeam"
        ```
        rm {{ networks.moonbeam.node_directory }}/wasm/moonriver-runtime-* &&  rm {{ networks.moonbeam.node_directory }}/wasm/moonbase-runtime-*
        ```

    === "Moonriver"
        ```
        rm {{ networks.moonriver.node_directory }}/wasm/moonbeam-runtime-* &&  rm {{ networks.moonriver.node_directory }}/wasm/moonbase-runtime-*
        ```

    === "Moonbase Alpha"
        ```
        rm {{ networks.moonbase.node_directory }}/wasm/moonbeam-runtime-* &&  rm {{ networks.moonbase.node_directory }}/wasm/moonriver-runtime-*
        ```

4. Set user permissions for the overrides:

    === "Moonbeam"
        ```
        chmod +x {{ networks.moonbeam.node_directory }}/wasm/*
        chown moonbeam_service {{ networks.moonbeam.node_directory }}/wasm/*
        ```

    === "Moonriver"
        ```
        chmod +x {{ networks.moonriver.node_directory }}/wasm/*
        chown moonriver_service {{ networks.moonriver.node_directory }}/wasm/*
        ```

    === "Moonbase Alpha"
        ```
        chmod +x {{ networks.moonbase.node_directory }}/wasm/*
        chown moonbase_service {{ networks.moonbase.node_directory }}/wasm/*
        ```

### Create the Configuration File {: #create-the-configuration-file }

The next step is to create the systemd configuration file, you'll need to:

 - Replace `YOUR-NODE-NAME` in two different places
 - Replace `<50% RAM in MB>` for 50% of the actual RAM your server has. For example, for 32 GB RAM, the value must be set to `16000`. The minimum value is `2000`, but it is below the recommended specs
 - Double-check that the binary is in the proper path as described below (_ExecStart_)
 - Double-check the base path if you've used a different directory
 - Name the file `/etc/systemd/system/moonbeam.service`

!!! note
    For client versions prior to v0.27.0, the `--state-pruning` flag was named `--pruning`.

    For client versions prior to v0.30.0, `--rpc-port` was used to specify the port for HTTP connections and `--ws-port` was used to specify the port for WS connections. As of client v0.30.0, the `--rpc-port` has been deprecated and the `--ws-port` flag is for both HTTP and WS connections. Similarly, the `--rpc-max-connections` flag has been deprecated and is now hardcoded to 100. You can use `--ws-max-connections` to adjust the combined HTTP and WS connection limit.

=== "Moonbeam"
    ```
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
         --execution wasm \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbeam.node_directory }} \
         --ethapi=debug,trace,txpool \
         --wasm-runtime-overrides={{ networks.moonbeam.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonbeam.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonriver"
    ```
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
         --execution wasm \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonriver.node_directory }} \
         --ethapi=debug,trace,txpool \
         --wasm-runtime-overrides={{ networks.moonriver.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonriver.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"
    
    [Install]
    WantedBy=multi-user.target
    ```

=== "Moonbase Alpha"
    ```
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
         --execution wasm \
         --state-pruning=archive \
         --trie-cache-size 0 \
         --db-cache <50% RAM in MB> \
         --base-path {{ networks.moonbase.node_directory }} \
         --ethapi=debug,trace,txpool \
         --wasm-runtime-overrides={{ networks.moonbase.node_directory }}/wasm \
         --runtime-cache-size 64 \
         --chain {{ networks.moonbase.chain_spec }} \
         --name "YOUR-NODE-NAME" \
         -- \
         --execution wasm \
         --name="YOUR-NODE-NAME (Embedded Relay)"

    [Install]
    WantedBy=multi-user.target
    ```

!!! note
    If you want to run an RPC endpoint, to connect polkadot.js.org, or to run your own application, use the flags `--unsafe-rpc-external` and/or `--unsafe-ws-external` to run the full node with external access to the RPC ports. More details are available by running `moonbeam --help`.

### Run the Service {: #run-the-service }

--8<-- 'text/systemd/run-service.md'

![Service Status](/images/node-operators/networks/tracing-node/tracing-1.png)

You can also run the following command to see logs of the tracing node spinning up:

```
journalctl -f -u moonbeam.service
```

Your terminal should display logs similar to the following:

![Service logs of wasm rutime overrides being processed](/images/node-operators/networks/tracing-node/tracing-2.png)

## Using a Tracing Node {: #using-a-tracing-node }

To explore the different non-standard RPC methods available on Moonbeam, and how to use these methods with a tracing node, check out the [Debug & Trace](/builders/build/eth-api/debug-trace/) guide.