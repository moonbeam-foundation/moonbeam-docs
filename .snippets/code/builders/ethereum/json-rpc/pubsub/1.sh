wscat -c {{ networks.moonbase.wss_url }} -x '
  {
    "jsonrpc": "2.0", 
    "id": 1, 
    "method": "eth_subscribe", 
    "params": ["INSERT_SUBSCRIPTION_NAME"]
  }'
