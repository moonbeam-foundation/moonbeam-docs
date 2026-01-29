  curl --location --request POST '{{ networks.moonbase.rpc_url }}' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"chain_getHeader",
    "params": []
  }'
