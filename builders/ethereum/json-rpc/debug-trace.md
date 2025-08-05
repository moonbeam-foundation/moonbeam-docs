---
title: Debug & Trace Transactions
description: Check out the non-standard JSON-RPC methods included in Geth's Debug and Txpool APIs and OpenEthereum's Trace module, which are supported on Moonbeam.
categories: JSON-RPC APIs, Ethereum Toolkit
---

# Debug API & Trace Module

## Introduction {: #introduction }

Geth's [debug](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug){target=\_blank} and [txpool](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool){target=\_blank} APIs and OpenEthereum's [trace](https://openethereum.github.io/JSONRPC-trace-module){target=\_blank} module provide non-standard RPC methods for deeper insight into transaction processing. Some of these non-standard RPC methods are supported as part of Moonbeam's goal of providing a seamless Ethereum experience for developers. Supporting these RPC methods is an essential milestone because many projects like [The Graph](https://thegraph.com){target=\_blank} rely on them to index blockchain data.

This guide will cover the supported RPC methods available on Moonbeam and how to invoke them using curl commands against a tracing node with the debug, txpool, and tracing flags enabled. You can access a tracing node in one of two ways: through a supported tracing RPC provider or by spinning up a tracing node of your own.

To view a list of tracing RPC providers, please check out the [Network Endpoints](/builders/get-started/endpoints/#tracing-providers){target=\_blank} page.

If you wish to set up your own tracing node, you can follow the [Running a Tracing Node](/node-operators/networks/tracing-node/){target=\_blank} guide. The RPC HTTP endpoint of your tracing node should be at `{{ networks.development.rpc_url }}` and your node should display similar logs to the following:

--8<-- 'code/builders/ethereum/json-rpc/debug-trace/terminal/start-up-logs.md'

## Supported Debug and Trace JSON-RPC Methods {: #supported-methods }

???+ function "debug_traceTransaction"

    This method attempts to replay a transaction in the same manner as it was executed on the network. Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracetransaction){target=\_blank} for more information.

    === "Parameters"

        - `transaction_hash` *string* - the hash of the transaction to be traced
        - `tracer_config` *string* - (optional) a JSON object for configuring the tracer that contains the following field: 
            - `tracer` *string* - sets the type of tracer
      
        If no `tracer_config` is provided, the opcode logger will be the default tracer. The opcode logger provides the following additional fields:

        - `opcode_config` *string* - (optional) a JSON object for configuring the opcode logger:
            - `disableStorage` *boolean* — (optional, default: `false`) setting this to `true` disables storage capture
            - `disableMemory` *boolean* — (optional, default: `false`) setting this to `true` disables memory capture
            - `disableStack` *boolean* — (optional, default: `false`) setting this to `true` disables stack capture

    === "Returns"

        If you supplied a `tracer_config`, the `result` object contains the following fields:
        
        - `type` - the type of the call
        - `from` - the address the transaction is sent from
        - `to` - the address the transaction is directed to
        - `value` - the integer of the value sent with this transaction
        - `gas` - the integer of the gas provided for the transaction execution
        - `gasUsed` - the integer of the gas used
        - `input` - the data given at the time of input
        - `output` - the data which is returned as an output
        - `error` - the type of error, if any
        - `revertReason` - the type solidity revert reason, if any
        - `calls` - a list of sub-calls, if any

        <br>
        If you used the default opcode logger, the `result` object contains the following fields:

        - `gas`- the integer of the gas provided for the transaction execution
        - `returnValue` - the output produced by the execution of the transaction
        - `structLogs` - an array of [objects containing a detailed log of each opcode](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#struct-opcode-logger){target=\_blank} executed during the transaction
        - `failed` - a boolean indicating whether the transaction execution failed or succeeded

    === "Example"

        Using the `tracer_config`:

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
        '{
          "jsonrpc":"2.0",
          "id": 1,
          "method": "debug_traceTransaction",
          "params": ["INSERT_TRANSACTION_HASH", {"tracer": "callTracer"}]
        }'
        ```

        <br>
        Using the default opcode logger:

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
        '{
          "jsonrpc":"2.0",
          "id": 1,
          "method": "debug_traceTransaction",
          "params": ["INSERT_TRANSACTION_HASH"]
        }'
        ```

???+ function "debug_traceBlockByNumber"

    This method attempts to replay a block in the same manner as it was executed on the network. Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbynumber){target=\_blank} for more information.

    === "Parameters"

        - `block_number` *string* - the block number of the block to be traced
        - `tracer_config` *string* - a JSON object for configuring the tracer that contains the following field: 
            - `tracer` *string* - sets the type of tracer. This must be set to `callTracer`, which only returns transactions and sub-calls. Otherwise, the tracer will attempt to default to the opcode logger, which is not supported at this time due to the heavy nature of the call

    === "Returns"

        The method returns a JSON object with a top-level result property that is an array. Each element in this array corresponds to a single transaction in the block and includes a `txHash` and a `result` object as follows: 
        
        - `txHash` - the transaction hash

        The `result` object contains the following fields:

        - `type` - the type of the call
        - `from` - the address the transaction is sent from
        - `to` - the address the transaction is directed to
        - `value` - the integer of the value sent with this transaction
        - `gas` - the integer of the gas provided for the transaction execution
        - `gasUsed` - the integer of the gas used
        - `input` - the data given at the time of input
        - `output` - the data which is returned as an output
        - `error` - the type of error, if any
        - `revertReason` - the type solidity revert reason, if any
        - `calls` - a list of sub-calls, if any

    === "Example"

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "debug_traceBlockByNumber",
            "params": ["INSERT_BLOCK_NUMBER", {"tracer": "callTracer"}]
          }'
        ```

???+ function "debug_traceBlockByHash"

    This method attempts to replay a block in the same manner as it was executed on the network. Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtraceblockbyhash){target=\_blank} for more information.

    === "Parameters"

        - `block_hash` *string* - the block hash of the block to be traced
        - `tracer_config` *string* - a JSON object for configuring the tracer that contains the following field: 
            - `tracer` *string* - sets the type of tracer. This must be set to `callTracer`, which only returns transactions and sub-calls. Otherwise, the tracer will attempt to default to the opcode logger, which is not supported at this time due to the heavy nature of the call

    === "Returns"

        The method returns a JSON object with a top-level result property that is an array. Each element in this array corresponds to a single transaction in the block and includes a `txHash` and a `result` object as follows: 
        
        - `txHash` - the transaction hash

        The `result` object contains the following fields:

        - `type` - the type of the call
        - `from` - the address the transaction is sent from
        - `to` - the address the transaction is directed to
        - `value` - the integer of the value sent with this transaction
        - `gas` - the integer of the gas provided for the transaction execution
        - `gasUsed` - the integer of the gas used
        - `input` - the data given at the time of input
        - `output` - the data which is returned as an output
        - `error` - the type of error, if any
        - `revertReason` - the type solidity revert reason, if any
        - `calls` - a list of sub-calls

    === "Example"

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "debug_traceBlockByHash",
            "params": ["INSERT_BLOCK_HASH", {"tracer": "callTracer"}]
          }'
        ```


???+ function "debug_traceCall"

    This method executes an eth_call within the context of the given block using the final state of the parent block as the base. Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-debug#debugtracecall){target=\_blank} for more information.

    === "Parameters"
        - `call_object` *object* the transaction object to be executed
        - `block_hash` *string* - the block hash of the base block

    === "Returns"
        - `gas`- the integer of the gas provided for the transaction execution
        - `returnValue` - the output produced by the execution of the transaction
        - `structLogs` - an array of [objects containing a detailed log of each opcode](https://geth.ethereum.org/docs/developers/evm-tracing/built-in-tracers#struct-opcode-logger){target=\_blank} executed during the transaction

    === "Example"

        ```bash
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "debug_traceCall",
            "params": [{
                "from": "INSERT_FROM_ADDRESS",
                "to":"INSERT_TO_ADDRESS",
                "data":"INSERT_CALL_DATA"
                }, "INSERT_BLOCK_HASH"]
          }'
        ```


???+ function "trace_filter"

    This method returns matching traces for the given filters. Refer to [Open Ethereum's documentation](https://openethereum.github.io/JSONRPC-trace-module#trace_filter){target=\_blank} for more information.

    === "Parameters"

        - `fromBlock` *string* — (optional) either block number (hex), `earliest`, which is the genesis block, or `latest` (default), which is the best block available. The trace starting block
        - `toBlock` *string* — (optional) either block number (hex), `earliest`, which is the genesis block, or `latest`, which is the best block available. The trace-ending block
        - `fromAddress` *array* — (optional) filter transactions from these addresses only. If an empty array is provided, no filtering is done with this field
        - `toAddress` *array* — (optional) filter transactions to these addresses only. If an empty array is provided, no filtering is done with this field
        - `after` *uint* — (optional) the default offset is `0`. The trace offset (or starting) number
        - `count` *uint* — (optional) number of traces to display in a batch

        There are a couple of default values that you should be aware of:

        - The maximum number of trace entries a single request of `trace_filter` is allowed to return is `500`. A request exceeding this limit will return an error
        - Blocks processed by requests are temporarily stored in the cache for `300` seconds, after which they are deleted

        You can configure [additional flags](/node-operators/networks/tracing-node/#additional-flags){target=\_blank} when spinning up your tracing node to change the default values.

    === "Returns"

        The `result` array contains an array of objects for the block traces. All objects will contain the following fields:
        
        - `blockHash`- the hash of the block where this transaction was in
        - `blockNumber` - the block number where this transaction was in
        - `subtraces` - the traces of contract calls made by the transaction
        - `traceAddress` - the list of addresses where the call was executed, the address of the parents, and the order of the current sub-call
        - `transactionHash` - the hash of the transaction
        - `transactionPosition` - the transaction position
        - `type` - the value of the method, such as `call` or `create`

        <br>
        If the `type` of the transaction is a `call`, these additional fields will exist:

        - `action` - an object containing the call information:
            - `from` - the address of the sender
            - `callType` - the type of method, such as `call` and `delegatecall`
            - `gas` - the gas provided by the sender, encoded as hexadecimal
            - `input` - the data sent along with the transaction
            - `to` - the address of the receiver
            - `value` - the integer of the value sent with this transaction, encoded as hexadecimal
        - `result` - an object containing the result of the transaction
            - `gasUsed`- the amount of gas used by this specific transaction alone
            - `output`- the value returned by the contract call, and it only contains the actual value sent by the return method. If the return method was not executed, the output is empty bytes

        If the `type` of the transaction is a `create`, these additional fields will exist:

        - `action` - an object containing information on the contract creation:
            - `from` - the address of the sender
            - `creationMethod` - the creation method, such as `create`
            - `gas` - the gas provided by the sender, encoded as hexadecimal
            - `init` - the initialization code of the contract
            - `value` - the integer of the value sent with this transaction, encoded as hexadecimal
        - `result` - an object containing the result of the transaction
            - `address` - the address of the contract
            - `code` - the bytecode of the contract
            - `gasUsed`- the amount of gas used by this specific transaction alone

    === "Example"

        This example starts with a zero offset and provides the first 20 traces:

        ```sh
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "trace_filter", "params": 
            [{
              "fromBlock": "INSERT_FROM_BLOCK",
              "toBlock": "INSERT_TO_BLOCK",
              "toAddress": ["INSERT_ADDRESS_TO_FILTER"],
              "after": 0,
              "count": 20
            }]
          }'
        ```

???+ function "txpool_content"

    Returns the details for all currently pending transactions waiting to be included in the next block(s) and all queued transactions for future execution. Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-content){target=\_blank} for more information.

    === "Parameters"

        None

    === "Returns"

        The `result` object contains the following fields:

        - `pending` - an object containing the pending transaction details, which maps an address to a batch of scheduled transactions
            - `address` - the address initiating a transaction, which maps the addresses' associating nonces with their transactions
                - `nonce` - the nonce of the sending address
                    - `blockHash` - the hash of the block where this transaction was included. For pending transactions, this is an empty 32-byte string in hexadecimal format
                    - `blockNumber` - the block number where this transaction was added encoded as a hexadecimal. For pending transactions, this is `null`
                    - `from` - the address of the sender
                    - `gas` - the total amount of gas units used in the transaction
                    - `gasPrice` - the total amount in Wei the sender is willing to pay for the transaction
                    - `maxFeePerGas` - the maximum amount of gas willing to be paid for the transaction
                    - `maxPriorityFeePerGas` - the maximum amount of gas to be included as a tip to the miner
                    - `hash` - the hash of the transaction
                    - `input` - the encoded transaction input data
                    - `nonce` - the number of transactions the sender has sent till now
                    - `to` - the address of the receiver. `null` when it's a contract creation transaction
                    - `transactionIndex` - an integer of the transactions index position in the block encoded as a hexadecimal format. For pending transactions, this is `null`
                    - `value` - the value transferred in Wei encoded as a hexadecimal format
        - `queued` - an object containing the queued transaction details, which maps an address to a batch of scheduled transactions
            - `address` - the address initiating a transaction, which maps the addresses' associating nonces with their transactions
                - `nonce` - the nonce of the sending address
                    - `blockHash` - the hash of the block where this transaction was included. For queued transactions, this is an empty 32-byte string in hexadecimal format
                    - `blockNumber` - the block number where this transaction was added encoded as a hexadecimal. For queued transactions, this is `null`
                    - `from` - the address of the sender
                    - `gas` - the total amount of gas units used in the transaction
                    - `gasPrice` - the total amount in wei the sender is willing to pay for the transaction
                    - `maxFeePerGas` - the maximum amount of gas willing to be paid for the transaction
                    - `maxPriorityFeePerGas` - the maximum amount of gas to be included as a tip to the miner
                    - `hash` - the hash of the transaction
                    - `input` - the encoded transaction input data
                    - `nonce` - the number of transactions the sender has sent till now
                    - `to` - the address of the receiver. `null` when it's a contract creation transaction
                    - `transactionIndex` - an integer of the transactions index position in the block encoded as a hexadecimal format. For queued transactions, this is `null`
                    - `value` - the value transferred in Wei encoded as a hexadecimal format

    === "Example"

        ```sh
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "txpool_content", "params":[]
          }'
        ```

???+ function "txpool_inspect"

    Returns a summary for all currently pending transactions waiting to be included in the next block(s) and all queued transactions for future execution. Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-inspect){target=\_blank} for more information.

    === "Parameters"

        None

    === "Returns"

        The `result` object contains the following fields:

        - `pending` - an object containing the pending transaction summary strings, which maps an address to a batch of scheduled transactions
            - `address` - the address initiating a transaction, which maps the addresses' associating nonces with their transaction summary strings
        - `queued` - an object containing the queued transaction summary strings, which maps an address to a batch of scheduled transactions
            - `address` - the address initiating a transaction, which maps the addresses' associating nonces with their transaction summary strings

    === "Example"

        ```sh
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "txpool_inspect", "params":[]
          }'
        ```

???+ function "txpool_status"

    Returns the total number of transactions currently pending transactions waiting to be included in the next block(s) and all queued transactions for future execution. Refer to [Geth's documentation](https://geth.ethereum.org/docs/interacting-with-geth/rpc/ns-txpool#txpool-status){target=\_blank} for more information.

    === "Parameters"

        None

    === "Returns"

        The `result` object contains the following fields:

        - `pending` - a counter representing the number of pending transactions
        - `queued` - a counter representing the number of queued transactions

    === "Example"

        ```sh
        curl {{ networks.development.rpc_url }} -H "Content-Type:application/json;charset=utf-8" -d \
          '{
            "jsonrpc": "2.0",
            "id": 1,
            "method": "txpool_status", "params":[]
          }'
        ```
