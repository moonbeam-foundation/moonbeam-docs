---
title: Web3.py
description: Follow this tutorial to learn how to use the Ethereum Web3 Python Library to deploy Solidity smart contracts to Moonbeam.
---
# Web3.py Python Library

![Intro diagram](/images/builders/tools/eth-libraries/web3py-banner.png)

## Introduction {: #introduction } 

[Web3.py](https://web3py.readthedocs.io/) is a set of libraries that allow developers to interact with Ethereum nodes using HTTP, IPC, or WebSocket protocols with Python. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the web3.py library to interact with a Moonbeam node as if they were doing so on Ethereum.

## Setup Web3.py with Moonbeam {: #setup-web3py-with-moonbeam } 

To get started with the web3.py library, install it using the following command:

```
pip3 install web3
```

You can configure ethers.js to work with any of the Moonbeam networks.
--8<-- 'text/common/endpoint-setup.md'

The simplest way to get started with each of the networks is as follows:

=== "Moonbeam"

    ```python
    from web3 import Web3

    web3 = Web3(Web3.HTTPProvider('{{ networks.moonbeam.rpc_url }}')) # Insert your RPC URL here
    ```

=== "Moonriver"

    ```python
    from web3 import Web3

    web3 = Web3(Web3.HTTPProvider('{{ networks.moonriver.rpc_url }}')) # Insert your RPC URL here
    ```

=== "Moonbase Alpha"

    ```python
    from web3 import Web3

    web3 = Web3(Web3.HTTPProvider('{{ networks.moonbase.rpc_url }}'))
    ```

=== "Moonbeam Dev Node"

    ```python
    from web3 import Web3

    web3 = Web3(Web3.HTTPProvider('{{ networks.development.rpc_url }}'))
    ```

## Tutorials {: #tutorials } 

If you are interested in a more detailed step-by-step guide, go to our specific tutorials about using web3.py on Moonbeam to [send a transaction](/builders/interact/eth-libraries/send-transaction/) or [deploy a contract](/builders/interact/eth-libraries/deploy-contract/).

--8<-- 'text/disclaimers/third-party-content.md'