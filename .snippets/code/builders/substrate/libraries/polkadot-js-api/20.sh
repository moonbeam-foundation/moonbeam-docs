  curl --location --request POST 'https://rpc.api.moonbase.moonbeam.network' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "jsonrpc":"2.0",
    "id":1,
    "method":"chain_getBlock",
    "params": ["0x870ad0935a27ed8684048860ffb341d469e091abc2518ea109b4d26b8c88dd96"]
  }'
