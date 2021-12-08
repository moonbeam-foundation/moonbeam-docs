---
title: Remix
description: Learn how to use one of the most popular Ethereum developer tools, the Remix IDE, to interact with Moonbeam.
---

# Remix

![Intro diagram](/images/builders/tools/eth-dev-env/remix/remix-banner.png)

## Introduction {: #introduction } 

Another tool developers can use to interact with Moonbeam is the [Remix IDE](https://remix.ethereum.org/), one of the most commonly used development environments for smart contracts on Ethereum. It provides a web-based solution to quickly compile and deploy Solidity and Vyper based code to either a local VM or, more interestingly, an external Web3 provider, such as MetaMask. By combining both tools, one can get started very swiftly with Moonbeam.

## Deploying a Contract to Moonbeam {: #deploying-a-contract-to-moonbeam } 

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

Once you've compiled the contract and are ready to deploy you can navigate to the "Deploy & Run Transactions" tab in Remix and follow these steps:

1. Set the Remix environment to "Injected Web3"
2. Set your account and ensure you have funds. For Moonbase Alpha, you can use our [TestNet faucet](/builders/get-started/moonbase/#discord-mission-control/)
3. Pass in `Test Contract` as input to the contructor function and hit "Deploy"
4. MetaMask will pop-up and show the information regarding the transaction, which you'll need to sign by clicking "Confirm"

![Deploying Contract](/images/builders/tools/eth-dev-env/remix/remix-1.png)

Once the transaction is included, the contract appears in the "Deployed Contracts" section on Remix. In there, we can interact with the functions available from our contract.

![Interact with Contract](/images/builders/tools/eth-dev-env/remix/remix-2.png)

## Tutorial {: #tutorial } 

If you are interested in a more detailed step-by-step guide, go to our specific tutorials about [using Remix](/builders/interact/remix/) with Moonbeam.