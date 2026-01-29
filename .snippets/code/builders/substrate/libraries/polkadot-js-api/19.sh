  curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"rpc_methods",
    "params": []
  }'
