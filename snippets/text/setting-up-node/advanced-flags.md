Nodes also provide access to some non-standard RPC methods, which allow developers to inspect and debug transactions during runtime. Currently, a few features are available:

 - Geth debug API: more specifically, the `debug_traceTransaction`, `debug_traceBlockByNumber`, and `debug_traceBlockByHash` methods. This will attempt to run the transaction or block in the same manner as it was executed.
    - Required flag: `--ethapi=debug`
 - Geth txpool API: `txpool_content`, `txpool_inspect`, `txpool_status` methods. These methods return information about the transaction pool, specifically about pending and queued transactions.
    - Required flag: `--ethapi=txpool`
 - OpenEthereum trace module: more specifically, the `trace_filter` method. This returns the trace matching a specific filter provided as input to the RPC call. The tracing module uses a separate Docker image to build and run the node. The required command is as follows:

--8<-- 'code/debug-trace/tracing-node.md'


You can read more about how to use these RPC methods in the [Debug & Trace](/builders/tools/debug-trace/) guide.

!!! note
    Debug/Trace features are still being actively developed. Because these requests are very CPU-demanding, it is recommended to run the node with the `--execution=Native` flag. This will use the native runtime included as part of the node executable instead of the Wasm binary stored on-chain.

You can combine both flags when running a node. 

By default, the maximum number of trace entries a single request of `trace_filter` is allowed to return is `500`. A request exceeding this limit will return an error. You can set a different maximum limit with the following flag:

 - `--ethapi-trace-max-count <uint>`: sets the maximum number of trace entries to be returned by the node

Blocks processed by requests are temporarily stored on cache for a certain amount of time (default is `300` seconds), after which they are deleted. You can set a different time for deletion with the following flag:

 - `-ethapi-trace-cache-duration <uint>`: sets the duration (in seconds) after which the cache of `trace_filter,` for a given block, is discarded