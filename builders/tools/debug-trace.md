---
title: Debug & Trace
description:  Learn how to leverage Geth's Debug and Txpool APIs, and OpenEthereum's Trace module to call non-standard RPC methods on Moonbeam
---

# Debug API & Trace Module

![Debug & Trace Moonbeam Banner](/images/builders/tools/debug-trace/debug-trace-banner.png)

## Introduction {: #introduction } 

Geth's `debug` and `txpool` APIs and OpenEthereum's `trace` module provide non-standard RPC methods for getting a deeper insight into transaction processing. As part of Moonbeam's goal of providing a seamless Ethereum experience for developers, there is support for some of these non-standard RPC methods. Supporting these RPC methods is an important milestone because many projects, such as [The Graph](https://thegraph.com/) or [Blockscout](https://docs.blockscout.com/), rely on them to index blockchain data.

This guide will cover the supported RPC methods available on Moonbeam as well as how to invoke the methods using curl commands against a local Moonbase Alpha tracing node.

## Supported RPC Methods

The following RPC methods are available: 

  - [`debug_traceTransaction`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction)
  - [`debug_traceBlockByNumber`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_traceblockbynumber)
  - [`debug_traceBlockByHash`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_traceblockbyhash)
  - [`trace_filter`](https://openethereum.github.io/JSONRPC-trace-module#trace_filter)
  - [`txpool_content`](https://geth.ethereum.org/docs/rpc/ns-txpool#txpool_content)
  - [`txpool_inspect`](https://geth.ethereum.org/docs/rpc/ns-txpool#txpool_inspect)
  - [`txpool_status`](https://geth.ethereum.org/docs/rpc/ns-txpool#txpool_status)

## Debug API {: #geth-debug-api } 

The debug RPC implementations follow [Geth's debug API guidelines](https://geth.ethereum.org/docs/rpc/ns-debug):

  - [`debug_traceTransaction`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction) - requires the hash of the transaction to be traced
  - [`debug_traceBlockByNumber`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_traceblockbynumber) - requires the block number of the block to be traced
  - [`debug_traceBlockByHash`](https://geth.ethereum.org/docs/rpc/ns-debug#debug_traceblockbyhash) - requires the hash of the block to be traced 

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

The [`trace_filter`](https://openethereum.github.io/JSONRPC-trace-module#trace_filter) RPC implementation follows [OpenEthereum's trace module guidelines](https://openethereum.github.io/JSONRPC-trace-module). The RPC method requires any of the following *optional* parameters:

 - **fromBlock**(*uint* blockNumber) — either block number (`hex`), `earliest` which is the genesis block or `latest` (default) best block available. Trace starting block
 - **toBlock**(*uint* blockNumber) — either block number (`hex`), `earliest` which is the genesis block or `latest` best block available. Trace ending block
 - **fromAddress**(*array* addresses) — filter transactions done from these addresses only. If an empty array is provided, no filtering is done with this field
 - **toAddress**(*array* addresses) — filter transactions done from these addresses only. If an empty array is provided, no filtering is done with this field
 - **after**(*uint* offset) — default offset is `0`. Trace offset (or starting) number
 - **count**(*uint* numberOfTraces) — number of traces to display in a batch

There are a couple default values that you should be aware of:

 - The maximum number of trace entries a single request of `trace_filter` is allowed to return is `500`. A request exceeding this limit will return an error
 - Blocks processed by requests are temporarily stored on cache for `300` seconds, after which they are deleted

To change the default values you can add [Additional Flags](/node-operators/networks/tracing-node/#additional-flags) when spinning up your tracing node.

## Checking Prerequisites

For this guide, you will need to have a locally running instance of a Moonbase Alpha tracing node with the `debug`, `txpool`, and `tracing` flags enabled for this guide. You can also adapt the instructions for Moonbeam and Moonriver. 

If you haven't already done so, you can follow the guide on [Running a Tracing Node](/node-operators/networks/tracing-node/). The RPC HTTP endpoint should be at `http://127.0.0.1:9933`.

If you have a running node, you should see a similar terminal log:

![Debug API](/images/builders/tools/debug-trace/debug-trace-1.png)

## Using the Debug API

Once you have a running tracing node, you can open another tab in your terminal where you can run curl commands and start to call any of the available JSON RPC methods. For example, for the `debug_traceTransaction` method, you can make the following JSON RPC request in your terminal (in this case, for the transaction hash `0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf`):

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

## Using the Tracing Module

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

## Using the Txpool API

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

--8<-- 'text/disclaimers/third-party-content.md'