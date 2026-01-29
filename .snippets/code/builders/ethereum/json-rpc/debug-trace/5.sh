curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
  '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "debug_traceCall",
    "params": [{
        "from": "INSERT_FROM_ADDRESS",
        "to":"INSERT_TO_ADDRESS",
        "data":"INSERT_CALL_DATA"
        }, "INSERT_BLOCK_HASH"]
  }'
