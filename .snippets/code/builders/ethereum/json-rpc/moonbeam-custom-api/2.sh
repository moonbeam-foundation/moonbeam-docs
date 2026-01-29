curl -H "Content-Type: application/json" -X POST --data '{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "moon_isTxFinalized",
  "params": ["INSERT_TRANSACTION_HASH"]
}' {{ networks.moonbase.rpc_url }}
