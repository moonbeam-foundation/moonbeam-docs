{
  "data": {
    "address": "0x28a2b98793fd1e20fd79824cd29d36d3eb9a8f0e",
    "updated_at": "2024-10-09T01:47:40.617173773Z",
    "next_update_at": "2024-10-09T01:52:40.617176953Z",
    "quote_currency": "USD",
    "chain_id": 1287,
    "chain_name": "moonbeam-moonbase-alpha",
    "complete": true,
    "current_bucket": 1920467,
    "links": {
      "prev": "https://api.covalenthq.com/v1/moonbeam-moonbase-alpha/bulk/transactions/0x28a2b98793fd1e20fd79824cd29d36d3eb9a8f0e/1920466/",
      "next": "https://api.covalenthq.com/v1/moonbeam-moonbase-alpha/bulk/transactions/0x28a2b98793fd1e20fd79824cd29d36d3eb9a8f0e/1920468/"
    },
    "items": [
      {
        "block_signed_at": "2024-10-08T20:48:42Z",
        "block_height": 8957260,
        "tx_hash": "0x587f0121ea9c51b93e1915a20370f0a2f004adee99d00ef8d1c0f9cc681a9772",
        "from_address": "0x28a2b98793fd1e20fd79824cd29d36d3eb9a8f0e",
        "to_address": "0x916b54696a70588a716f899be1e8f2a5ffd5f135",
        "value": "0",
        "gas_offered": 582957,
        "gas_spent": 551928,
        "gas_price": 31250000,
        "fees_paid": "68991000000000",
        "log_events": [
          {
            "sender_address": "0x916b54696a70588a716f899be1e8f2a5ffd5f135",
            "decoded": {
              "name": "SessionStarted",
              "signature": "SessionStarted(indexed uint64 chainId, indexed uint64 blockHeight, uint64 deadline)",
              "params": [
                {
                  "name": "chainId",
                  "type": "uint64",
                  "value": "1"
                },
                {
                  "name": "blockHeight",
                  "type": "uint64",
                  "value": "20923350"
                },
                {
                  "name": "deadline",
                  "type": "uint64",
                  "value": "8957360"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "error": false,
  "error_message": null,
  "error_code": null
}