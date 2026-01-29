curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"eth_getTransactionByHash",
    "params": ["0x753588d6e59030eeffd31aabccdd0fb7c92db836fcaa8ad71512cf3a7d0cb97f"]
  }
'
