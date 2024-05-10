---
title: Moonbeam-specific RPC Methods
description: Discover Moonbeam's specialized API endpoints, featuring custom JSON-RPC methods designed exclusively for Moonbeam functionality.
---

# Moonbeam Custom API

## Introduction {: #introduction }

Moonbeam nodes include support for two custom JSON-RPC endpoints: `moon_isBlockFinalized` and `moon_isTxFinalized`. These endpoints provide valuable functionality for checking the finality of on-chain events.

To begin exploring Moonbeam's custom JSON-RPC endpoints, you can try out the provided curl examples below. These examples demonstrate how to query the public RPC endpoint of Moonbase Alpha. However, you can easily modify them to use with your own Moonbeam or Moonriver endpoint by changing the URL and API key. If you haven't already, you can obtain your endpoint and API key from one of our supported [Endpoint Providers](/builders/get-started/endpoints){target=\_blank}.

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
