curl -H "Content-Type: application/json" -X POST --data '{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "moon_isBlockFinalized",
  "params": ["INSERT_BLOCK_HASH"]
}' {{ networks.moonbase.rpc_url }}
