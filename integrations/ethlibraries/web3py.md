---
title: Web3.py
description: Follow this tutorial to learn how to use the Ethereum Web3 Python Library to deploy Solidity smart contracts to Moonbeam.
---
# Web3.py Python Library

![Intro diagram](/images/integrations/integrations-web3py-banner.png)

## Introduction

[Web3.py](https://web3py.readthedocs.io/) is a set of libraries that allow developers to interact with Ethereum nodes using HTTP, IPC, or WebSocket protocols with Python. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the web3.py library to interact with a Moonbeam node as if they were doing so on Ethereum.

## Setup Web3.py with Moonbeam

To get started with the web3.py library, install it using the following command:

```
npm install web3
```

Once done, the simplest setup to start using the library and its methods is the following:

```py
from web3 import Web3

web3 = Web3(Web3.HTTPProvider('RPC_URL'))
```

Depending on which network you want to connect to, you can set the `RPC_URL` to the following values:

 - Moonbeam development node: `http://127.0.0.1:9933`
 - Moonbase Alpha TestNet: `https://rpc.testnet.moonbeam.network`

## Step-by-step Tutorials

If you are interested in a more detailed step-by-step guide, go to our specific tutorials about using web3.py on Moonbeam to [send a transaction](/getting-started/local-node/send-transaction/) or [deploy a contract](/getting-started/local-node/deploy-contract/).

