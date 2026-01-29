curl {{ networks.moonbase.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
'{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_estimateGas",
    "params":[{
        "to": "0xDFF8E772A9B212dc4FbA19fa650B440C5c7fd7fd",
        "data": "0xef5fb05b"
    }]
}'
