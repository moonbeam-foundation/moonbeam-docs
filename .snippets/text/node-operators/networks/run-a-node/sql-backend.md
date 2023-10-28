#### Use a SQL Backend for Frontier {: #use-sql }

The default [Frontier](/learn/features/eth-compatibility/#frontier){target=_blank} database, which comes standard with Moonbeam nodes and contains all of the Ethereum-related elements, such as transactions, blocks, and logs, can be modified to use a SQL backend. Since `eth_getLogs` is a very resource-intensive method, the SQL backend aims to provide a more performant alternative for indexing and querying Ethereum logs in comparison to the default RocksDB database.

To spin up a node with a Frontier SQL backend, you'll need to add the `--frontier-backend-type sql` flag to your start-up command.

There are additional flags you can use to configure the pool size, query timeouts, and more for your SQL backend; please refer to the [Flags](/node-operators/networks/run-a-node/flags#flags-for-sql-backend){target=_blank} page for more information.
