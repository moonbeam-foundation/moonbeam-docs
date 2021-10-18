---
title: Debug & Trace
description:  Learn how to leverage Geth's Debug and Txpool APIs, and OpenEthereum's Trace module on Moonbeam
---

# Debug API & Trace Module

![Debug & Trace Moonbeam Banner](/images/builders/tools/debug-trace/debug-trace-banner.png)

## Introduction {: #introduction } 

Geth's debug and txpool APIs and OpenEthereum's trace module provide non-standard RPC methods for getting a deeper insight into transaction processing. As part of Moonbeam's goal of providing a seamless Ethereum experience for developers, there is support for some of these non-standard RPC methods. Supporting these RPC methods is an important milestone because many projects, such as [The Graph](https://thegraph.com/) or [Blockscout](https://docs.blockscout.com/), rely on them to index blockchain data.

This guide will cover the supported RPC methods available on Moonbeam as well as how to get started running a node with debug and tracing enabled.

## Supported RPC Methods

The following RPC methods are available: 

  - `debug_traceTransaction`
  - `debug_traceBlockByNumber`
  - `debug_traceBlockByHash`
  - `trace_filter`
  - `txpool_content`
  - `txpool_inspect`
  - `txpool_status`

## Get Started

To spin up a debug, txpool, or tracing node, you will need to use various flags to determine how the node will behave and what functionality the node will support. The flags to enable the debug, txpool, and tracing features are required and the features are unavailable unless specified due to the heavy nature of the calls on the node's side. 

=== "Moonbeam Development Node"
    You can run your own Moonbeam instance in a private development environment. To do so, you can follow the [Getting Started with a Moonbeam Development Node](/builders/get-started/moonbeam-dev/) guide. Make sure to check the [Advanced Flags](/builders/get-started/moonbeam-dev/#advanced-flags-and-options) section

    You will also need to start your node with the following flag(s) depending on the features you would like to enable:

      - `--ethapi=debug` flag for `debug_traceTransaction`, `debug_traceBlockByNumber`, and `debug_traceBlockByHash`
      - `--ethapi=trace --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing` flag for `trace_filter` 
      - `--ethapi=txpool` flag for `txpool_content`, `txpool_inspect`, and `txpool_status`

=== "Moonbase Alpha"
    You can run a full node of the TestNet and access your own private endpoints. To do so, you can follow the [Run a Node on Moonbeam](/node-operators/networks/full-node/) guide. Make sure to check the [Advanced Flags](/node-operators/networks/full-node/#advanced-flags-and-options) section.

    You will also need to start your node with the following flag(s) depending on the features you would like to enable:

    - `--ethapi=debug` flag for `debug_traceTransaction`, `debug_traceBlockByNumber`, and `debug_traceBlockByHash`
    - `--ethapi=trace --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing` flag for `trace_filter` 
    - `--ethapi=txpool` flag for `txpool_content`, `txpool_inspect`, and `txpool_status`

=== "Moonriver"
    You can run a full Moonriver node locally. To do so, please check out the [Run a Node on Moonbeam](/node-operators/networks/full-node/) guide and make sure to switch to the **Moonriver** tabs as you follow along. Also make sure to check the [Advanced Flags](/node-operators/networks/full-node/#advanced-flags-and-options) section

    You will also need to start your node with the following flag(s) depending on the features you would like to enable:

    - `--ethapi=debug` flag for `debug_traceTransaction`, `debug_traceBlockByNumber`, and `debug_traceBlockByHash`
    - `--ethapi=trace --wasm-runtime-overrides=/moonbeam/moonriver-substitutes-tracing` flag for `trace_filter` 
    - `--ethapi=txpool` flag for `txpool_content`, `txpool_inspect`, and `txpool_status`

## Debug API {: #geth-debug-api } 

The debug RPC implementations follow [Geth's debug API guidelines](https://geth.ethereum.org/docs/rpc/ns-debug):

  - [`debug_traceTransaction`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction) - requires the hash of the transaction to be traced. Works by attempting to replay the transaction in the same way it originally was executed on the network
  - [`debug_traceBlockByNumber`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_traceblockbynumber) - requires the block number of the block to be traced. 
  - [`debug_traceBlockByHash`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_traceblockbyhash) - requires the hash of the block to be traced.

As *optional* parameters for the supported debug methods, you can provide the following:

 - **disableStorage**(*boolean*) — (default: _false_). Setting this to true disables storage capture
 - **disableMemory**(*boolean*) — (default: _false_). Setting this to true disables memory capture
 - **disableStack**(*boolean*) — (default: _false_). Setting this to true disables stack capture

## Txpool API

The txpool RPC implementations follow [Geth's txpool API guidelines](https://geth.ethereum.org/docs/rpc/ns-txpool):

  - [`txpool_content`](https://geth.ethereum.org/docs/rpc/ns-txpool#txpool_content) - no required or optional parameters
  - [`txpool_inspect`](https://geth.ethereum.org/docs/rpc/ns-txpool#txpool_inspect) - no required or optional parameters 
  - [`txpool_status`](https://geth.ethereum.org/docs/rpc/ns-txpool#txpool_status) - no required or optional parameters

## Trace Module {: #trace-module } 

The `trace_filter` RPC implementation follows [OpenEthereum's trace module guidelines](https://openethereum.github.io/JSONRPC-trace-module#trace_filter). There is a seperate Docker image for the tracing module. The latest available image can be found on the [Docker Hub for the `moonbeam-tracing` image](https://hub.docker.com/r/purestake/moonbeam-tracing/tags).

The RPC method requires any of the following *optional* parameters:

 - **fromBlock**(*uint* blockNumber) — either block number (`hex`), `earliest` which is the genesis block or `latest` (default) best block available. Trace starting block
 - **toBlock**(*uint* blockNumber) — either block number (`hex`), `earliest` which is the genesis block or `latest` best block available. Trace ending block
 - **fromAddress**(*array* addresses) — filter transactions done from these addresses only. If an empty array is provided, no filtering is done with this field
 - **toAddress**(*array* addresses) — filter transactions done from these addresses only. If an empty array is provided, no filtering is done with this field
 - **after**(*uint* offset) — default offset is `0`. Trace offset (or starting) number
 - **count**(*uint* numberOfTraces) — number of traces to display in a batch

## Try it on Moonbase Alpha {: #try-it-on-moonbase-alpha } 

As mentioned before, to use the debug, txpool, and trace features you need to have a node running with the `debug`, `txpool`, and `trace` flags. 

To spin up a tracing node, you'll want to use the following command:

=== "Moonbeam Development Node"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --dev
    --base-path=/data \
    --chain alphanet \
    --name="Moonbeam-Tutorial" \
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonbase-substitutes-tracing \
    -- \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

=== "Moonbase Alpha"
    ```
    docker run --network="host" -v "/var/lib/alphanet-data:/data" \
    -u $(id -u ${USER}):$(id -g ${USER}) \
    purestake/moonbeam-tracing:v0.13.1-800 \
    --base-path=/data \
    --chain alphanet \
    --name="Moonbeam-Tutorial" \
    --execution wasm \
    --wasm-execution compiled \
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
    --execution wasm \
    --wasm-execution compiled \
    --pruning archive \
    --state-cache-size 1 \
    --ethapi=debug,trace,txpool \
    --wasm-runtime-overrides=/moonbeam/moonriver-substitutes-tracing \
    -- \
    --pruning archive \
    --name="Moonbeam-Tutorial (Embedded Relay)"
    ```

For this example, a local Moonbase Alpha full node is used, with the RPC HTTP endpoint at `http://127.0.0.1:9933`. If you have a running node, you should see a similar terminal log:

![Debug API](/images/builders/tools/debug-trace/debug-trace-1.png)

### Using the Debug API

For example, for the `debug_traceTransaction` call, you can make the following JSON RPC request in your terminal (in this case, for the transaction hash `0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf`):

```
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"debug_traceTransaction",
    "params": ["0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf"]
  }'
```

The node responds with the step-by-step replayed transaction information (response was cropped as it is quite long):

![Trace Debug Node Running](/images/builders/tools/debug-trace/debug-trace-2.png)

### Using the Tracing Module

For the `trace_filter` call, you can make the following JSON RPC request in your terminal (in this case, the filter is from block 20000 to 25000, only for transactions where the recipient is  `0x4E0078423a39EfBC1F8B5104540aC2650a756577`, it will start with a zero offset and provide the first 20 traces):

```
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"trace_filter", "params":[{"fromBlock":"0x4E20","toBlock":"0x5014","toAddress":["0x4E0078423a39EfBC1F8B5104540aC2650a756577"],"after":0,"count":20}]
  }'
```

The node responds with the trace information corresponding to the filter (response was cropped as it is quite long).

![Trace Filter Node Running](/images/builders/tools/debug-trace/debug-trace-3.png)

### Using the Txpool API

Since none of the currently supported txpool methods require a parameter, you can adapt the following curl command by changing the method for any of the txpool methods:

```
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"txpool_status", "params":[]
  }'
```

For this example, the `txpool_status` method will return the number of transactions currently pending or queued. 

![Txpool Request and Response](/images/builders/tools/debug-trace/debug-trace-4.png)