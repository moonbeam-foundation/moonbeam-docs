---
title: How to use the Python Substrate Interface
description: Learn the basics of how to use the Python Substrate Interface library to query chain data, send transactions, and more on Moonbeam networks.
categories: Substrate Toolkit, Libraries and SDKs
---

# Python Substrate Interface

## Introduction {: #introduction }

[Python Substrate Interface](https://github.com/polkascan/py-substrate-interface){target=\_blank} library allows application developers to query a Moonbeam node and interact with the node's Polkadot or Substrate features using a native Python interface. Here you will find an overview of the available functionalities and some commonly used code examples to get you started on interacting with Moonbeam networks using Python Substrate Interface.

## Checking Prerequisites {: #checking-prerequisites }

For the examples in this guide, you will need to have the following:

 - An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
  --8<-- 'text/_common/endpoint-examples-list-item.md'
 - Have [`pip`](https://pypi.org/project/pip){target=\_blank} installed

!!! note
    --8<-- 'text/_common/assumes-mac-or-ubuntu-env.md'

### Installing Python Substrate Interface {: #installing-python-substrate-interface }

You can install Python Substrate Interface library for your project through `pip`. Run the following command in your project directory:

```bash
--8<-- 'code/builders/substrate/libraries/py-substrate-interface/1.sh'
```

## Creating an API Provider Instance {: #creating-an-API-provider-instance }

Similar to ETH API libraries, you must first instantiate an API instance of Python Substrate Interface API. Create the `WsProvider` using the websocket endpoint of the Moonbeam network you wish to interact with.

--8<-- 'text/_common/endpoint-examples.md'

=== "Moonbeam"

    ```python
    --8<-- 'code/builders/substrate/libraries/py-substrate-interface/2.py'
    ```

=== "Moonriver"

    ```python
    --8<-- 'code/builders/substrate/libraries/py-substrate-interface/3.py'
    ```

=== "Moonbase Alpha"

    ```python
    --8<-- 'code/builders/substrate/libraries/py-substrate-interface/4.py'
    ```

=== "Moonbeam Dev Node"

    ```python
    --8<-- 'code/builders/substrate/libraries/py-substrate-interface/5.py'
    ```

## Querying for Information {: #querying-for-information }

In this section, you will learn how to query for on-chain information of Moonbeam networks using Python Substrate Interface library.

### Accessing Runtime Constants {: #accessing-runtime-constants }

All runtime constants, such as `BlockWeights`, `DefaultBlocksPerRound` and `ExistentialDeposit`, are provided in the metadata. You can use the [`get_metadata_constants`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_metadata_constants){target=\_blank} method to see a list of available runtime constants within Moonbeam network's metadata.

Runtime constants available in the metadata can be queried through the [`get_constant`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_constant){target=\_blank} method.

```python
--8<-- 'code/builders/substrate/libraries/py-substrate-interface/6.py'
```

### Retrieving Blocks and Extrinsics {: #retrieving-blocks-and-extrinsics }

You can retrieve basic information about Moonbeam networks, such as blocks and extrinsics, using the Python Substrate Interface API.

To retrieve a block, you can use the [`get_block`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_block){target=\_blank} method. You can also access extrinsics and their data fields inside a block object, which is simply a Python dictionary.

To retrieve a block header, you can use the [`get_block_header`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_block_header){target=\_blank} method.  

```python
--8<-- 'code/builders/substrate/libraries/py-substrate-interface/7.py'
```

!!! note
    The block hash used in the above code sample is the Substrate block hash. The standard methods in Python Substrate Interface assume you are using the Substrate version of primitives, such as block or tx hashes.

### Subscribing to New Block Headers {: #subscribing-to-new-block-headers }

You can also adapt the previous example to use a subscription based model to listen to new block headers.

```python
--8<-- 'code/builders/substrate/libraries/py-substrate-interface/8.py'
```

### Querying for Storage Information {: #querying-for-storage-information }

You can use the [`get_metadata_storage_functions`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.get_metadata_storage_functions){target=\_blank} to see a list of available storage functions within Moonbeam network's metadata.

Chain states that are provided in the metadata through storage functions can be queried through the [`query`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.query){target=\_blank} method.

The Substrate system modules, such as `System`, `Timestamp`, and `Balances`, can be queried to provide basic information such as account nonce and balance. The available storage functions are read from the metadata dynamically, so you can also query for storage information on Moonbeam custom modules, such as `ParachainStaking` and `Democracy`, for state information that's specific to Moonbeam.

```python
--8<-- 'code/builders/substrate/libraries/py-substrate-interface/9.py'
```

## Signing and Transactions {: #signing-and-transactions }

### Creating a Keypair {: #creating-a-keypair }

The keypair object in Python Substrate Interface is used in the signing of any data, whether it's a transfer, a message, or a contract interaction.  

You can create a keypair instance from the shortform private key or from the mnemonic. For Moonbeam networks, you also need to specify the `KeypairType` to be `KeypairType.ECDSA`.

```python
--8<-- 'code/builders/substrate/libraries/py-substrate-interface/10.py'
```

### Forming and Sending a Transaction {: #forming-and-sending-a-transaction }

The [`compose_call`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.compose_call){target=\_blank} method can be used to compose a call payload which can be used as an unsigned extrinsic or a proposal.

Then the payload can be signed using a keypair through the [`create_signed_extrinsic`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.create_signed_extrinsic){target=\_blank} method.

The signed extrinsic can then be submitted using the [`submit_extrinsic`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.submit_extrinsic){target=\_blank} method.

This method will also return an `ExtrinsicReceipt` object which contains information about the on-chain execution of the extrinsic. If you need to examine the receipt object, you can set the `wait_for_inclusion` to `True` when submitting the extrinsic to wait until the extrinsic is successfully included into the block.

The following sample code will show a complete example for sending a transaction.

```python
--8<-- 'code/builders/substrate/libraries/py-substrate-interface/11.py'
```

### Offline Signing {: #offline-signing }

You can sign transaction payloads or any arbitrary data using a keypair object through the [`sign`](https://jamdottech.github.io/py-polkadot-sdk/reference/keypair/#substrateinterface.keypair.Keypair.sign){target=\_blank} method. This can be used for offline signing of transactions.

1. First, generate the signature payload on an online machine:

    ```python
    --8<-- 'code/builders/substrate/libraries/py-substrate-interface/12.py'
    ```

2. On an offline machine, create a keypair with the private key of the sending account, and sign the signature payload:

    ```python
    --8<-- 'code/builders/substrate/libraries/py-substrate-interface/13.py'
    ```

3. On an online machine, create a keypair with the public key of the sending account, and submit the extrinsic with the generated signature from the offline machine:

    ```python
    --8<-- 'code/builders/substrate/libraries/py-substrate-interface/14.py'
    ```

## Custom RPC Requests {: #custom-rpc-requests }

You can also make custom RPC requests with the [`rpc_request`](https://jamdottech.github.io/py-polkadot-sdk/reference/base/#substrateinterface.base.SubstrateInterface.rpc_request){target=\_blank} method.

This is particularly useful for interacting with Moonbeam's [Ethereum JSON-RPC](/builders/ethereum/json-rpc/eth-rpc/){target=\_blank} endpoints or Moonbeam's [custom RPC](/builders/ethereum/json-rpc/moonbeam-custom-api/){target=\_blank} endpoints.

The [Consensus and Finality page](/learn/core-concepts/consensus-finality/#checking-tx-finality-with-substrate-libraries){target=\_blank} has examples for using the custom RPC calls through Python Substrate Interface to check the finality of a transaction given its transaction hash.

--8<-- 'text/_disclaimers/third-party-content.md'
