=== "HTTPS"
    |      Provider       |                             RPC URL                              |   Limits   |
    |:-------------------:|:----------------------------------------------------------------:|:----------:|
    |        Blast        |    <pre>```https://moonbase-alpha.public.blastapi.io```</pre>    | 80 req/sec |
    |       Dwellir       |        <pre>```https://moonbase-rpc.dwellir.com```</pre>         | 20 req/sec |
    |     OnFinality      | <pre>```https://moonbeam-alpha.api.onfinality.io/public```</pre> | 40 req/sec |
    | Moonbeam Foundation |    <pre>```https://rpc.api.moonbase.moonbeam.network```</pre>    | 25 req/sec |
    |     UnitedBloc      |         <pre>```https://moonbase.unitedbloc.com```</pre>         | 32 req/sec |
    | RadiumBlock | <pre>```https://moonbase.public.curie.radiumblock.co/http```</pre> | 200 req/sec |

=== "WSS"
    |      Provider       |                              RPC URL                              |   Limits   |
    |:-------------------:|:-----------------------------------------------------------------:|:----------:|
    |        Blast        |     <pre>```wss://moonbase-alpha.public.blastapi.io```</pre>      | 80 req/sec |
    |       Dwellir       |          <pre>```wss://moonbase-rpc.dwellir.com```</pre>          | 20 req/sec |
    |     OnFinality      | <pre>```wss://moonbeam-alpha.api.onfinality.io/public-ws```</pre> | 40 req/sec |
    | Moonbeam Foundation |     <pre>```wss://wss.api.moonbase.moonbeam.network```</pre>      | 25 req/sec |
    |     UnitedBloc      |          <pre>```wss://moonbase.unitedbloc.com```</pre>           | 32 req/sec |
    | RadiumBlock | <pre>```wss://moonbase.public.curie.radiumblock.co/ws```</pre> | 200 req/sec |


#### Relay Chain {: #relay-chain }

To connect to the Moonbase Alpha relay chain, you can use the following WS Endpoint:

| Provider |                          RPC URL                           |
|:--------:|:----------------------------------------------------------:|
| OpsLayer | <pre>```wss://relay.api.moonbase.moonbeam.network```</pre> |
