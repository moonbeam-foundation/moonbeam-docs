With the release of Moonbase Alpha v7, nodes also provide access to some non-standard RPC methods, which allow developers to inspect and debug transactions during runtime. Currently, two features are available:

 - Geth debug API: more specifically the `debug_traceTransaction` method. This will attemp to run the transaction in the exact same manner as it was executed. You can read more about this RPC method in [this link](https://geth.ethereum.org/docs/rpc/ns-debug#debug_tracetransaction)
 - OpenEthereum trace module: more specifically the `trace_filter` method. This returns the trace matching an specific filter provided as input to the RPC call. You can read more about this RPC method in [this link](https://openethereum.github.io/JSONRPC-trace-module#trace_filter)

To enable each of the features mentioned above, the following flags need to be specified:

 - `--ethapi=debug`: enables the Geth debug API fo rthe `debug_traceTransaction` RPC call
 - `--ethapi=trace`: enables the OpenEthereum trace module for the `trace_filter` RPC call

You can combine both flags when running a node. For example, when running the binary: