---
title: Debug & Trace
description:  Learn how to leverage the Geth Debug API and OpenEthereum Trace module on Moonbeam
---

# Debug API & Trace Module

![Full Node Moonbeam Banner](/images/debugtrace/debugtrace-banner.png)

## Introduction

Both Geth's debug API and OpenEthereum's trace module provide non-standard RPC methods for getting a deeper insight into transaction processing.

With the release of Moonbase Alpha v7, as part of Moonbeam's goal of providing a seamless Ethereum experience for developers, both `debug_traceTransaction` and `trace_filter` RPC methods are now available.

Supporting both RPC methods is an important milestone because many projects, such as [The Graph](https://thegraph.com/) or [Blockscout](https://docs.blockscout.com/), rely on them to index blockchain data.

Both calls are quite heavy on the node's side. Therefore, it is required to make this RPC against a locally running node with either the `--ethapi=debug` flag for `debug_traceTransaction`, and/or the `--ethapi=trace` flag for `trace_filter`. Currently, you can spin up two different kinds of nodes:

 - **Moonbeam development node** — run your own Moonbeam instance in your private environment. To do so, you can follow [this guide](/getting-started/local-node/setting-up-a-node/). Make sure to check the [advanced flags section](/getting-started/local-node/setting-up-a-node/#advanced-flags-and-options)
 - **Moonbase Alpha node** — run a full node of the TestNet and access your own private endpoints. To do so, you can follow [this guide](/node-operators/networks/full-node/). Make sure to check the [advanced flags section](/node-operators/networks/full-node/#advanced-flags-and-options)

## Geth Debug API

The `debug_traceTransaction` RPC implementation follows [Geth's debug API guidelines](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction).

The RPC method requires the transaction hash to run. As optional parameters you can provide the following:

 - **disableStorage** — one input: boolean (default: _false_). Setting this to true disables storage capture
 - **disableMemory** — one input: boolean (default: _false_). Setting this to true disables memory capture
 - **disableStack** — one input: boolean (default: _false_). Setting this to true disables stack capture

JavaScript based transaction tracing is not supported at the moment.

## Trace Module

The `trace_filter` RPC implementation follows [OpenEthereum's trace module guidelines](https://openethereum.github.io/JSONRPC-trace-module#trace_filter).

The RPC method requires any of the following optional parameters:

 - **fromBlock** — one input: either block number (`hex`), `earliest` which is the genesis block or `latest` (default) best block available. Trace starting block
 - **toBlock** — one input: either block number (`hex`), `earliest` which is the genesis block or `latest` best block available. Trace ending block
 - **fromAddress** — one input: array of addresses. Filter transactions done from these addresses only. If an empty array is provided, no filtering is done with this field
 - **toAddress** — one input: array of addresses. Filter transactions done from these addresses only. If an empty array is provided, no filtering is done with this field
 - **after** — one input: offset (`uint`), default is `0`. Trace offset (or starting) number
 - **count** — one input: number of traces (`uint`). Number of traces to display in a batch

## Try it on Moonbase Alpha

As mentioned before, to use both features you need to have a node running with the `debug` and `trace` flags. For this example, a local Moonbase Alpha full node is used, with the RPC HTTP endpoint at `http://127.0.0.1:9933`. If you have a running node, you should see a similar terminal log:

![Debug API](/images/debugtrace/debugtrace-images1.png)

For example, for the `debug_traceTransaction` call, you can make the following JSON RPC request in your terminal (in this case, for the transaction hash `0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf`):

```
curl http://localhost:9933 -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"debug_traceTransaction",
    "params": ["0x04978f83e778d715eb074352091b2159c0689b5ae2da2554e8fe8e609ab463bf"]
  }'
```

The node responds with the step-by-step replayed transaction information (response was cropped as it is quite long):

![Trace Debug Node Running](/images/debugtrace/debugtrace-images2.png)

For the `trace_filter` call, you can make the following JSON RPC request in your terminal (in this case, the filter is from block 20000 to 25000, only for transactions where the recipient is  `0x4E0078423a39EfBC1F8B5104540aC2650a756577`, it will start with a zero offset and provide the first 20 traces):

```
curl http://localhost:9933 -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"trace_filter", "params":[{"fromBlock":"0x4E20","toBlock":"0x5014","toAddress":["0x4E0078423a39EfBC1F8B5104540aC2650a756577"],"after":0,"count":20}]
  }'
```

The node responds with the trace information corresponding to the filter (response was cropped as it is quite long).

![Trace Filter Node Running](/images/debugtrace/debugtrace-images3.png)

## We Want to Hear From You

If you have any feedback regarding using the Debug API or the Trace module, or any other Moonbeam-related topic, feel free to reach out through our official development [Discord channel](https://discord.gg/PfpUATX).
