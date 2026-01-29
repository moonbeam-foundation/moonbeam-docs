curl --location \
     --request POST '{{ networks.development.rpc_url }}' \
     --header 'Content-Type: application/json' \
     --data-raw '{
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_feeHistory",
        "params": ["0xa", "latest"]
     }'
