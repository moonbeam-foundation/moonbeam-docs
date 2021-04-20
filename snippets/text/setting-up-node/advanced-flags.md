With the release of Moonbase Alpha v7, nodes also provide access to some non-standard RPC methods, which allow developers to inspect and debug transactions during runtime. Currently, two features are available:

 - Geth debug API: more specifically, the `debug_traceTransaction` method. This will attempt to run the transaction in the same manner as it was executed. You can read more about this RPC method in [this link](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction)
 - OpenEthereum trace module: more specifically, the `trace_filter` method. This returns the trace matching a specific filter provided as input to the RPC call. You can read more about this RPC method in [this link](https://openethereum.github.io/JSONRPC-trace-module#trace_filter)

The features mentioned above can be activated using the following flags:

 - `--ethapi=debug`: enables the Geth debug API for the `debug_traceTransaction` RPC call
 - `--ethapi=trace`: enables the OpenEthereum trace module for the `trace_filter` RPC call

!!! note
    Debug/Trace features are still being actively developed. Because these requests are very CPU-demanding, it is recommended to run the node with the `--execution=Native` flag. This will use the native runtime included as part of the node executable instead of the Wasm binary stored on-chain.

You can combine both flags when running a node. 

By default, the maximum number of trace entries a single request of `trace_filter` is allowed to return is `500`. A request exceeding this limit will return an error. You can set a different maximum limit with the following flag:

 - `--ethapi-trace-max-count <uint>`: sets the maximum number of trace entries to be returned by the node

Blocks processed by requests are temporarily stored on cache for a certain amount of time (default is `300` seconds), after which they are deleted. You can set a different time for deletion with the following flag:

 - `-ethapi-trace-cache-duration <uint>`: sets the duration (in seconds) after which the cache of `trace_filter,` for a given block, is discarded