curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "trace_filter", "params": 
    [{
      "fromBlock": "INSERT_FROM_BLOCK",
      "toBlock": "INSERT_TO_BLOCK",
      "toAddress": ["INSERT_ADDRESS_TO_FILTER"],
      "after": 0,
      "count": 20
    }]
  }'
