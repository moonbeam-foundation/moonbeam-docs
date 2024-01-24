---
title: Debug & Trace Transactions
description:  Learn how to leverage Geth's Debug and Txpool APIs, and OpenEthereum's Trace module to call non-standard RPC methods on Moonbeam.
---

# Debug API & Trace Module

## Introduction {: #introduction }

Geth's debug and txpool APIs and OpenEthereum's trace module provide non-standard RPC methods for getting a deeper insight into transaction processing. As part of Moonbeam's goal of providing a seamless Ethereum experience for developers, there is support for some of these non-standard RPC methods. Supporting these RPC methods is an important milestone because many projects, such as [The Graph](https://thegraph.com/){target=_blank}, rely on them to index blockchain data.

To view a list of tracing RPC providers, please check out the [Network Endpoints](/builders/get-started/endpoints#tracing-providers){target=_blank} page.

This guide will cover the supported RPC methods available on Moonbeam as well as how to invoke the methods using curl commands against a local Moonbase Alpha tracing node.

## Supported RPC Methods {: #supported-rpc-methods }

The following RPC methods are available:

  - [`debug_traceTransaction`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=_blank}
  - [`debug_traceBlockByNumber`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbynumber){target=_blank}
  - [`debug_traceBlockByHash`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash){target=_blank}
  - [`trace_filter`](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=_blank}
  - [`txpool_content`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=_blank}
  - [`txpool_inspect`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=_blank}
  - [`txpool_status`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=_blank}

## Debug API {: #geth-debug-api }

The debug RPC implementations follow [Geth's debug API guidelines](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=_blank}:

  - **[`debug_traceTransaction`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=_blank}** - requires the hash of the transaction to be traced
  - **[`debug_traceBlockByNumber`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbynumber){target=_blank}** - requires the block number of the block to be traced and an additional parameter that sets the tracer to `callTracer` (i.e., `{"tracer": "callTracer"}`)
  - **[`debug_traceBlockByHash`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash){target=_blank}** - requires the hash of the block to be traced and an additional parameter that sets the tracer to `callTracer` (i.e., `{"tracer": "callTracer"}`)

As *optional* parameters for the supported debug methods, you can provide the following:

 - **disableStorage**(*boolean*) — (default: `false`) setting this to `true` disables storage capture
 - **disableMemory**(*boolean*) — (default: `false`) setting this to `true` disables memory capture
 - **disableStack**(*boolean*) — (default: `false`) setting this to `true` disables stack capture

## Txpool API {: #txpool-api }

The txpool RPC implementations follow [Geth's txpool API guidelines](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool):

  - **[`txpool_content`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=_blank}** - no required or optional parameters
  - **[`txpool_inspect`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=_blank}** - no required or optional parameters
  - **[`txpool_status`](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=_blank}** - no required or optional parameters

## Trace Module {: #trace-module }

The [`trace_filter`](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=_blank} RPC implementation follows [OpenEthereum's trace module guidelines](https://openethereum.github.io/JSONRPC-trace-module){target=_blank}. The RPC method requires any of the following *optional* parameters:

 - **fromBlock**(*uint* blockNumber) — either block number (`hex`), `earliest`, which is the genesis block, or `latest` (default), which is the best block available. The trace starting block
 - **toBlock**(*uint* blockNumber) — either block number (`hex`), `earliest`, which is the genesis block, or `latest`, which is the best block available. The trace ending block
 - **fromAddress**(*array* addresses) — filter transactions from these addresses only. If an empty array is provided, no filtering is done with this field
 - **toAddress**(*array* addresses) — filter transactions to these addresses only. If an empty array is provided, no filtering is done with this field
 - **after**(*uint* offset) — default offset is `0`. The trace offset (or starting) number
 - **count**(*uint* numberOfTraces) — number of traces to display in a batch

There are a couple default values that you should be aware of:

 - The maximum number of trace entries a single request of `trace_filter` is allowed to return is `500`. A request exceeding this limit will return an error
 - Blocks processed by requests are temporarily stored in the cache for `300` seconds, after which they are deleted

To change the default values, you can add [Additional Flags](/node-operators/networks/tracing-node/#additional-flags){target=_blank} when spinning up your tracing node.

## Checking Prerequisites {: #checking-prerequisites }

For this guide, you will need to have a locally running instance of a Moonbase Alpha tracing node with the `debug`, `txpool`, and `tracing` flags enabled. You can also adapt the instructions for Moonbeam and Moonriver.

If you haven't already done so, you can follow the guide on [Running a Tracing Node](/node-operators/networks/tracing-node/){target=_blank}. The RPC HTTP endpoint should be at `{{ networks.development.rpc_url }}`.

If you have a running node, you should see a similar terminal log:

![Debug API](/images/builders/build/eth-api/debug-trace/debug-trace-1.webp)

## Using the Debug API {: #using-the-debug-api }

Once you have a running tracing node, you can open another tab in your terminal where you can run curl commands and start to call any of the available JSON-RPC methods. For example, for the `debug_traceTransaction` method, you can make the following JSON-RPC request in your terminal (in this case, for the transaction hash `0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf`):

```sh
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"debug_traceTransaction",
    "params": ["0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf"]
  }'
```

The node responds with the step-by-step replayed transaction information (the response was cropped as it is quite long):

![Trace Debug Node Running](/images/builders/build/eth-api/debug-trace/debug-trace-2.webp)

If you're using the `debug_traceBlockByNumber` or `debug_traceBlockByHash` methods, you will need to add `{"tracer": "callTracer"}` to the `"params"`. The `callTracer` will only return transactions and subcalls. Otherwise, the tracer will attempt to default to `raw`, which is not supported at this time due to the heavy nature of the call. For example, for the `debug_traceBlockByHash` method, you can make the following JSON-RPC request in your terminal (in this case, for the block hash `0x2633b66050c99d80f65fe96de6485fd407b87f0f59b485c33ab8f119e2c6f255`):

```sh
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"debug_traceBlockByHash",
    "params": ["0x2633b66050c99d80f65fe96de6485fd407b87f0f59b485c33ab8f119e2c6f255", {"tracer": "callTracer"}]
  }'
```

## Using the Tracing Module {: #using-the-tracing-module }

For the `trace_filter` call, you can make the following JSON-RPC request in your terminal (in this case, the filter is from block 20000 to 25000, only for transactions where the recipient is  `0x4E0078423a39EfBC1F8B5104540aC2650a756577`; it will start with a zero offset and provide the first 20 traces):

```sh
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"trace_filter", "params":[{"fromBlock":"0x4E20","toBlock":"0x5014","toAddress":["0x4E0078423a39EfBC1F8B5104540aC2650a756577"],"after":0,"count":20}]
  }'
```

The node responds with the trace information corresponding to the filter (the response was cropped as it is quite long).

![Trace Filter Node Running](/images/builders/build/eth-api/debug-trace/debug-trace-3.webp)

## Using the Txpool API {: #using-the-txpool-api }

Since none of the currently supported txpool methods require a parameter, you can adapt the following curl command by changing the method for any of the txpool methods:

```sh
curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"txpool_status", "params":[]
  }'
```

For this example, the `txpool_status` method will return the number of transactions currently pending or queued.

![Txpool Request and Response](/images/builders/build/eth-api/debug-trace/debug-trace-4.webp)
