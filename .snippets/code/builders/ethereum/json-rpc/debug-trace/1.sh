curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
'{
  "jsonrpc":"2.0",
  "id": 1,
  "method": "debug_traceTransaction",
  "params": ["INSERT_TRANSACTION_HASH", {"tracer": "callTracer"}]
}'
