---
title: Moonbeam-specific RPC Methods
description: This page contains information on Moonbeam custom API endpoints (JSON-RPC methods specific to Moonbeam).
---

# Moonbeam Custom API 

## Finality RPC Endpoints {: #finality-rpc-endpoints }

Moonbeam node has added support for two custom JSON-RPC endpoints, `moon_isBlockFinalized` and `moon_isTxFinalized`, that are useful for checking whether an on-chain event is finalized. The information on these two endpoints are as follows:

=== "moon_isBlockFinalized"
    |  Variable   |                                                          Value                                                           |
    |:-----------:|:------------------------------------------------------------------------------------------------------------------------:|
    |  Endpoint   |                                                 `moon_isBlockFinalized`                                                  |
    | Description |                               Check for the finality of the block given by its block hash                                |
    | Parameters  | `block_hash`: **STRING** The hash of the block, accepts either Substrate-style or Ethereum-style block hash as its input |
    |   Returns   |    `result`: **BOOLEAN** Returns `true` if the block is finalized, `false` if the block is not finalized or not found    |

=== "moon_isTxFinalized"
    |  Variable   |                                                    Value                                                     |
    |:-----------:|:------------------------------------------------------------------------------------------------------------:|
    |  Endpoint   |                                             `moon_isTxFinalized`                                             |
    | Description |                      Check for the finality of the transaction given by its EVM tx hash                      |
    | Parameters  |                           `tx_hash`: **STRING** The EVM tx hash of the transaction                           |
    |   Returns   | `result`: **BOOLEAN** Returns `true` if the tx is finalized; `false` if the tx is not finalized or not found |

You can try out these endpoints with the following curl examples. These examples query the public RPC endpoint of Moonbase Alpha, but they can be modified to use with Moonbeam and Moonriver by changing the URL of the RPC endpoint to use your own endpoint and API key which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}.

=== "moon_isBlockFinalized"

    ```bash
    curl -H "Content-Type: application/json" -X POST --data 
        '[{
            "jsonrpc":"2.0",
            "id":"1",
            "method":"moon_isBlockFinalized",
            "params":["Put-Block-Hash-Here"
        ]}]' 
        {{ networks.moonbase.rpc_url }}
    ```

=== "moon_isTxFinalized"

    ```bash
    curl -H "Content-Type: application/json" -X POST --data 
        '[{
            "jsonrpc":"2.0",
            "id":"1",
            "method":"moon_isTxFinalized",
            "params":["Put-Tx-Hash-Here"
        ]}]' 
        {{ networks.moonbase.rpc_url }}
    ```

