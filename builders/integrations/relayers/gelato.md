---
title: Gelato
description: Use Dapplooker to analyze and query on-chain data, and create dashboards to visualize analytics for Moonbeam and Moonriver.
---

# Getting Started with Gelato

![Gelato Banner](/images/builders/integrations/relayers/gelato/gelato-banner.png)

## Introduction {: #introduction }

[Gelato Network](https://www.gelato.network/){target=_blank} is a decentralized automation network for Web3, enabling developers to automate & relay arbitrary smart contract executions on and across EVM-based compatible blockchains. The network relies on a broad set of transaction relayers called [executors](https://docs.gelato.network/introduction/executor-operators){target=_blank} that are rewarded for the infrastructure and automation services they provide. Gelato is designed to be a more robust, decentralized, and cost-efficient alternative to running your own bot infrastructure.

Gelato is live on both Moonbeam and Moonriver, enabling developers and end-users to automate smart contract interactions with Gelato Relay SDK and Gelato Ops. First, this guide will demonstrate a step-by-step tutorial to automating a smart contract interaction with Gelato Ops. Next, you'll interact with the Gelato Relay SDK via a hands-on demo.   

## Gelato Ops {: #gelato-ops }

[Gelato Ops](https://app.gelato.network/){target=_blank} is a front-end for interacting with the Gelato network and managing your transaction automation. There's no sign up or registration step - your account is tied directly to your wallet. In this guide, you'll deploy a signature Gelato ice cream NFT that can be licked via a function call. Then, you'll automate the lick function according to specific parameters.

![Gelato Ops 1](/images/builders/integrations/relayers/gelato/gelato-1.png)

### Try It Out {: #try-it-out }

To get started with this guide, you'll need to have some GLMR or MOVR in your free balance. Then, head to [Gelato Ops](https://app.gelato.network/tutorial){target=_blank} and ensure that your wallet is connected. To kick off the tutorial, you'll need to press **Mint NFT** and confirm the transaction in MetaMask. 

Then, take the following steps:

1. Enter the amount of GLMR / MOVR you'd like to use to fund your Gelato Ops account. These funds will be used to pay for gas. Then press **Deposit** and confirm the transaction in MetaMask
2. Press **Create Task**
3. Copy the contract address of your ice cream NFT
4. Paste the contract address to allow the ABI to be automatically fetched by Gelato
5. Next, select the function you'd like to automate. For this example, choose the lick function
6. The lick function takes a single parameter, namely, the tokenId of the NFT to lick. Enter the tokenId that corresponds to your ice cream NFT
7. Next, choose how you'd like your automation scheduled. You can choose from a time-based schedule or Gelato can automatically execute the function whenever possible
8. Select **Gelato Balance** to use your deposited funds to pay for the gas of the automated transactions
9. Enter a task name
10. Press **Create Task** and confirm the transaction in MetaMask. Then, sign the next pop-up in MetaMask to confirm your task name    

![Gelato Ops 2](/images/builders/integrations/relayers/gelato/gelato-2.png)

And that's it! You've successfully set up your first recurring smart contract interaction with Gelato. Your automated smart contract interactions will continue according to the set schedule until the remaining funds for gas are drained or the automation is paused on Gelato Ops. 

### Managing your Automated Tasks {: #managing-your-automated-tasks }

On [app.gelato.network](https://app.gelato.network/){target=_blank}, you'll see all of your automations and their associated statuses. You can click on an automation to see more details about the task and its execution history. Here you can also make any changes to the automated task, including pausing or resuming the task. To pause a task, press **Pause** in the upper right corner and confirm the transaction in your wallet. You can resume the automation at any time by pressing **Restart** and confirming the transaction in your wallet.

At the bottom of the page, you can see your task's execution history including the transaction status and the gas cost. Note, Gelato does not charge any fees - the only fees are gas costs. You can click on the **Task Logs** tab to see a detailed debugging level history of your automated tasks, which may be especially helpful in the event a transaction failed or did not execute.  

![Gelato Ops 3](/images/builders/integrations/relayers/gelato/gelato-3.png)

### Managing your Gas Funds {: #managing-your-gas-funds }

To manage your gas funds on [app.gelato.network](https://app.gelato.network/){target=_blank}, click on the **Funds** Box in the upper left corner. Here, you can top up your balance of gas funds or withdraw them. You can also register be notified with low balance alerts. 

To deposit funds for gas, take the following steps:

1. Click on the **Funds** Box in the upper left corner
2. Enter the amount of funds you'd like to deposit
3. Click **Deposit** and confirm the transaction in your wallet

You can follow a similar set of steps to withdraw your gas funds from Gelato. 

![Gelato Ops 4](/images/builders/integrations/relayers/gelato/gelato-4.png)

--8<-- 'text/disclaimers/third-party-content.md'