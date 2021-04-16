---
title: Remix IDE
description: Learn how to use one of the most popular Ethereum developer tools, the Remix IDE, to interact with Moonbeam.
---

# Interacting with Moonbeam Using Remix

![Intro diagram](/images/integrations/integrations-remix-banner.png)

## Introduction

Another tool developers can use to interact with Moonbeam is the [Remix IDE](https://remix.ethereum.org/), one of the most commonly used development environments for smart contracts on Ethereum. It provides a web-based solution to quickly compile and deploy Solidity and Vyper based code to either a local VM or, more interestingly, an external Web3 provider, such as MetaMask. By combining both tools, one can get started very swiftly with Moonbeam.
## Deploying a Contract to Moonbeam

To demonstrate how you can leverage [Remix](https://remix.ethereum.org/) to deploy smart contracts to Moonbeam, we will use the following basic contract:

```solidity
pragma solidity ^0.7.5;

contract SimpleContract{
    string public text;
    
    constructor(string memory _input) {
        text = _input;
    }
}
```

Once compiled, we can navigate to the "Deploy & Run Transactions" tab. We need first to set our environment to "Injected Web3." This uses the provider injected by MetaMask, which allows us to deploy contracts to the network it is connected to - in this case, the Moonbase Alpha TestNet. 

For this example, we'll be deploying the contract from a funded MetaMask account. You can use our [TestNet faucet](/getting-started/testnet/faucet/) to fund your account for deployments on Moonbase Alpha. Next, pass in `Test Contract` as input to our contructor function and hit deploy. A MetaMask pop-up will show the information regarding the transaction, which we'll need to sign by clicking "confirm."

![Deploying Contract](/images/remix/integrations-remix-1.png)

Once the transaction is included, the contract appears in the "Deployed Contracts" section on Remix. In there, we can interact with the functions available from our contract.

![Interact with Contract](/images/remix/integrations-remix-2.png)

## Step-by-step Tutorials
If you are interested in a more detailed step-by-step guide, go to our specific tutorials on using [Remix on a Moonbeam development node](/getting-started/local-node/using-remix/). The steps can also be adapted to deploy on the Moonbase Alpha TestNet by [connecting MetaMask to it](/getting-started/testnet/metamask/).

