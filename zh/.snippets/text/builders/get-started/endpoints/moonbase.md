===
"HTTPS"
    |      Provider       |                              RPC URL                               |   Limits    |
    |:-------------------:|:------------------------------------------------------------------:|:-----------:|
    |     OnFinality      |  <pre>https://moonbeam-alpha.api.onfinality.io/public</pre>  | 40 req/sec  |
    | Moonbeam Foundation |     <pre>https://rpc.api.moonbase.moonbeam.network</pre>     | 25 req/sec  |
    |     UnitedBloc      |          <pre>https://moonbase.unitedbloc.com</pre>          | 32 req/sec  |
    |     RadiumBlock     | <pre>https://moonbase.public.curie.radiumblock.co/http</pre> | 200 req/sec |

===
"WSS"
    |      Provider       |                              RPC URL                              |   Limits    |
    |:-------------------:|:-----------------------------------------------------------------:|:-----------:|
    |     OnFinality      | <pre>wss://moonbeam-alpha.api.onfinality.io/public-ws</pre> | 40 req/sec  |
    | Moonbeam Foundation |     <pre>wss://wss.api.moonbase.moonbeam.network</pre>      | 25 req/sec  |
    |     UnitedBloc      |          <pre>wss://moonbase.unitedbloc.com</pre>           | 32 req/sec  |
    |     RadiumBlock     |  <pre>wss://moonbase.public.curie.radiumblock.co/ws</pre>   | 200 req/sec |

#### 中继链 {: #relay-chain }

要连接到 Moonbase Alpha 中继链，您可以使用以下 WS 终端节点：

|   提供商   |                          RPC URL                           |
|:--------:|:----------------------------------------------------------:|
| OpsLayer | <pre>wss://relay.api.moonbase.moonbeam.network</pre> |
