---
title: Moonbeam-specific RPC Methods
description: Discover Moonbeam's specialized API endpoints, featuring custom JSON-RPC methods designed exclusively for Moonbeam functionality.
---

# Moonbeam Custom API

## Introduction {: #introduction }

Moonbeam nodes include support for custom JSON-RPC endpoints: 

- `moon_isBlockFinalized` 
- `moon_isTxFinalized`
- `moon_getEthSyncBlockRange`

These endpoints provide valuable functionality for checking the finality of on-chain events.

To begin exploring Moonbeam's custom JSON-RPC endpoints, you can try out the provided curl examples below. These examples demonstrate how to query the public RPC endpoint of Moonbase Alpha. However, you can easily modify them to use with your own Moonbeam or Moonriver endpoint by changing the URL and API key. If you haven't already, you can obtain your endpoint and API key from one of our supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}.

## Supported Custom RPC Methods {: #rpc-methods }

???+ function "moon_isBlockFinalized"

    Checks for the finality of the block given by its block hash.

    === "Parameters"

        - `block_hash` *string* - the hash of the block, accepts either Substrate-style or Ethereum-style block hash as its input

    === "Returns"

        Returns a boolean: `true` if the block is finalized, `false` if the block is not finalized or not found.

    === "Example"

        ```bash
        curl -H "Content-Type: application/json" -X POST --data '{
          "jsonrpc": "2.0",
          "id": "1",
          "method": "moon_isBlockFinalized",
          "params": ["INSERT_BLOCK_HASH"]
        }' {{ networks.moonbase.rpc_url }}
        ```

???+ function "moon_isTxFinalized"

    Checks for the finality of a transaction given its EVM transaction hash.

    === "Parameters"

        - `tx_hash` *string* - the EVM transaction hash of the transaction 

    === "Returns"

        Returns a boolean: `true` if the transaction is finalized, `false` if the transaction is not finalized or not found.

    === "Example"

        ```bash
        curl -H "Content-Type: application/json" -X POST --data '{
          "jsonrpc": "2.0",
          "id": "1",
          "method": "moon_isTxFinalized",
          "params": ["INSERT_TRANSACTION_HASH"]
        }' {{ networks.moonbase.rpc_url }}
        ```

???+ function "moon_getEthSyncBlockRange"

    Returns the range of blocks that are fully indexed in frontier's backend.

    === "Parameters"

        None

    === "Returns"

        Returns the range of blocks that are fully indexed in frontier's backend. An example response below includes the Substrate block hashes of block `0` and the latest fully indexed block:

        ```[
        "0x91bc6e169807aaa54802737e1c504b2577d4fafedd5a02c10293b1cd60e39527",
        "0xb1b49bd709ca9fe0e751b8648951ffbb2173e1258b8de8228cfa0ab27003f612"
        ]```

    === "Example"

        ```bash
        curl -H "Content-Type: application/json" -X POST --data '{
          "jsonrpc": "2.0",
          "id": "1",
          "method": "moon_getEthSyncBlockRange",
          "params": []
        }' {{ networks.moonbase.rpc_url }}
        ```



    