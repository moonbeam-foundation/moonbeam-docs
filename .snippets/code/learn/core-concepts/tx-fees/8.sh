curl https://sepolia.publicgoods.network -H "Content-Type:application/json;charset=utf-8" -d \
'{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_estimateGas",
    "params":[{
        "to": "0x8D0C059d191011E90b963156569A8299d7fE777d",
        "data": "0xef5fb05b"
    }]
}'
