#### 为 Frontier 使用 SQL 后端 {: #use-sql }

默认的 [Frontier](https://polkadot-evm.github.io/frontier/){target=\_blank} 数据库是 Moonbeam 节点的标配，其中包含所有以太坊相关的元素，例如交易、区块和日志，可以修改为使用 SQL 后端。由于 `eth_getLogs` 是一种非常消耗资源的方法，因此 SQL 后端旨在提供一种更高效的替代方案，用于索引和查询以太坊日志，与默认的 RocksDB 数据库相比。

要使用 Frontier SQL 后端启动节点，您需要在启动命令中添加 `--frontier-backend-type sql` 标志。

您还可以使用其他标志来配置 SQL 后端的池大小、查询超时等；有关更多信息，请参阅[标志](/node-operators/networks/run-a-node/flags/#flags-for-sql-backend){target=\_blank}页面。
