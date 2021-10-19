If you are running a tracing node, you have the following flags available to you:

  - **`--ethapi=debug`** - enables the supported Geth Debug API methods
  - **`--ethapi=txpool`** - enables the supported Geth Txpool API methods
  - **`--ethapi=trace`** - enables OpenEthereum's Tracing Module method

You can use one or more of the above flag(s) at a given time, it's ultimately up to you and what your needs are but you must also run the following flag too:

  - **`--wasm-runtime-overrides=/moonbeam/<network>-substitutes-tracing`** - specifies the path where the local WASM runtimes are stored. These runtimes will override on-chain runtimes. Accepts the network as a parameter: `moonbase` (for development nodes and Moonbase Alpha) or `moonriver`. 

!!! note
    Debug/Trace features are still being actively developed. Because these requests are very CPU-demanding, it is recommended to run the node with the `--execution=Native` flag. This will use the native runtime included as part of the node executable instead of the Wasm binary stored on-chain.

By default, the maximum number of trace entries a single request of `trace_filter` is allowed to return is `500`. A request exceeding this limit will return an error. You can set a different maximum limit with the following flag:

  - **`--ethapi-trace-max-count <uint>`** - sets the maximum number of trace entries to be returned by the node

Blocks processed by requests are temporarily stored on cache for a certain amount of time (default is `300` seconds), after which they are deleted. You can set a different time for deletion with the following flag:

  - **`-ethapi-trace-cache-duration <uint>`** - sets the duration (in seconds) after which the cache of `trace_filter,` for a given block, is discarded
