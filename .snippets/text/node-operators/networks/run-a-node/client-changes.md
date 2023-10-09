!!! note
    For client versions prior to v0.30.0, `--rpc-port` was used to specify the port for HTTP connections, and `--ws-port` was used to specify the port for WS connections. As of client v0.30.0, these flags have been combined, and the default port for the `--ws-port` flag, which is `9944`, is used for both HTTP and WS connections. The maximum number of connections to that port has been hardcoded to 100 and could be modified with the `--ws-max-connections` flag.

    As of client v0.33.0, the `--ws-port` and `--ws-max-connections` flags have been deprecated and removed in favor of the `--rpc-port` and `--rpc-max-connections` flags. The default port is still `9944`, and the default maximum number of connections is still set to 100.
