---
title: Using Tenderly to Debug and Simulate Transactions
description: Follow a step-by-step guide on getting started with Tenderly, including using the debugger, forking and simulating transactions, and monitoring smart contracts.
categories: Tutorials
---

# Using Tenderly to Simulate and Debug Transactions

## Introduction {: #introduction }

Tenderly is an all-in-one development platform for EVM networks that enables Web3 developers to build, test, monitor, and operate their smart contracts. Tenderly has a [full suite of product offerings](/builders/ethereum/dev-env/tenderly/) to help you as a developer throughout the lifecycle of a smart contract, from the earliest stages of development to maintenance and alerting on a live production dApp.

Most services offered by Tenderly are free to use, but you'll need to subscribe to a paid plan for advanced features like real-time alerting and war room functionality. Tenderly supports Moonbeam and Moonriver but does not support Moonbase Alpha at this time. For more information about Tenderly's product offerings, be sure to familiarize yourself with the [Introduction to Tenderly](/builders/ethereum/dev-env/tenderly/).

In this tutorial, we're going to explore two of Tenderly's most powerful features, the debugger and the simulator.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

 - Have a free [Tenderly Account](https://dashboard.tenderly.co/register?utm_source=homepage){target=\_blank}. You do not need a paid plan to complete this tutorial

## Create a Tenderly Project {: #create-a-tenderly-project }

Although not strictly required, it's a good idea to create a Tenderly project to keep things organized and access more of Tenderly's available features. Underneath the **Select Project** dropdown, you can press **Create Project** or head directly to the [Create Project](https://dashboard.tenderly.co/projects/create){target=\_blank} page of the dashboard.

Give your project a name, and then press **Create Project**. Although you can change your project name at a later point, the URL will remain the original one you created.

![Create a Tenderly account](/images/tutorials/eth-api/using-tenderly/tenderly-1.webp)

There is a limit of one project with a free account; however, you can have multiple smart contracts under the purview of a single project.

## Add Smart Contracts {: #add-smart-contracts }

Adding a smart contract to your Tenderly project is akin to bookmarking it. While not required, adding a contract will unlock additional Tenderly features over simply searching for the contract on the Tenderly platform.

To add a smart contract to your Tenderly project, click on the **Contracts** tab under the **Inspect** heading, then click **Add Contracts**. Then, take the following steps:

1. Enter the address of the contract. For this tutorial, we'll be using the FRAX stablecoin contract `0x322E86852e492a7Ee17f28a78c663da38FB33bfb`
2. Select the network the contract is deployed to. We'll select **Moonbeam** in this case
3. Give the contract a name to help you recognize it on the dashboard
4. Press **Add Contract**

![Add a smart contract](/images/tutorials/eth-api/using-tenderly/tenderly-2.webp)

## Simulate a Transaction {: #simulate-a-transaction }

Simulations allow you to see how a transaction will execute without actually sending it on the blockchain. You can simulate a transaction against any point in time or simply the latest block.

Head over to the **Simulator** tab, and let's craft a transaction to simulate against the Moonbeam network by taking the following steps:

1. Select the contract that you'd like to interact with. The name displayed here is the nickname that you gave the contract when [adding it to your Tenderly workspace](#add-smart-contracts)
2. Select the contract function you'd like to call. `Transfer` is selected for demonstration purposes
3. Next, we'll input the relevant function parameters. For destination address, you can input any address, such as Alith's address: `0xf24FF3a9CF04c71Dbc94D0b566f7A27B94566cac`
4. For amount, you can also specify any amount, such as `10000000000`
5. Select **Pending Block** to run the simulation against the latest Moonbeam block produced
6. Specify the from address as Baltathar: `0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0` or another address of your choice
7. Press **Simulate Transaction**

![Simulate a transaction against Moonbeam](/images/tutorials/eth-api/using-tenderly/tenderly-3.webp)

Clearly, this simulated transaction is going to fail because we're trying to send 10,000 FRAX that we don't have. But, with the [Tenderly Simulator](https://docs.tenderly.co/simulator-ui){target=\_blank}, we can tinker with the blockchain state and run simulations that assume different conditions. For example, let's run the simulation assuming that Baltathar actually holds a balance of 10,000 FRAX. Press **Re-Simulate** in the upper right corner, then take the following steps:

1. Expand the **State Overrides** section
2. Press **Add State Override**
3. Select the relevant contract, in this case the FRAX one
4. Under the **Storage Variables** section, we're going to override the mapping that holds the balance of Baltathar by specifying the key as: `balanceOf[0x3Cd0A705a2DC65e5b1E1205896BaA2be8A07c6e0]` and the value as: `10000000000`. Pay careful attention that you are performing this step in the **Storage Variables** section and not the **Balance** section
5. Press **Add** to confirm adding the state override
6. Press **Simulate Transaction**

![Simulate a transaction against Moonbeam with state overrides](/images/tutorials/eth-api/using-tenderly/tenderly-4.webp)

!!! note
    Remember that the Alith and Baltathar accounts are part of the [list of public developer accounts](/builders/get-started/networks/moonbeam-dev/#pre-funded-development-accounts){target=\_blank} with known private keys. You will lose any funds sent to these addresses.

If you correctly added the state override, you should now see a transaction simulation success screen upon running the simulation. If you get an error, you can press **Re-Simulate** and verify that you have configured the state override correctly.

![Transaction simulation with state override success](/images/tutorials/eth-api/using-tenderly/tenderly-5.webp)

You can also access Tenderly's transaction simulator via the [Simulations API](https://docs.tenderly.co/reference/api#tag/Simulations){target=\_blank}.

## Debugging {: #debugging }

The [Debugger](https://docs.tenderly.co/debugger){target=\_blank} is one of the most powerful and acclaimed features of Tenderly. It's also quite fast and requires minimal setup. In fact, if the contract you're investigating is already verified on chain, firing up the debugger is as easy as searching for the transaction hash on Tenderly. Let's try it out.

In the upper search bar, you can paste a contract address or a transaction hash. Recall that Tenderly supports Moonbeam and Moonriver but does not currently support Moonbase Alpha. Here's an example transaction hash of a GLMR / FRAX swap on StellaSwap:

```text
--8<-- 'code/tutorials/eth-api/using-tenderly/1.txt'
```

After finding the transaction hash, you're greeted at the top with all of the typical statistics about the transaction, such as status, gas price, gas used, etc. Following that, you'll see a breakdown of the tokens transferred. And at the bottom you'll see a long list of every function call. Given that a swap is a relatively complex interaction, and given that StellaSwap uses upgradable proxy contracts, you'll see quite a long list in this example.

![Debugger 1](/images/tutorials/eth-api/using-tenderly/tenderly-6.webp)

If you click on **Contracts** on the left-hand navigation bar, you'll see a list of every contract the transaction interacted with. You can click on a contract to see more details and view the entire source code if the contract is verified.

![Debugger 2](/images/tutorials/eth-api/using-tenderly/tenderly-7.webp)

Heading down the left-hand navigation bar, you'll see an **Events** tab followed by a **State Changes** tab, which shows a visual representation of each change to the chain state that occurred as a result of this transaction.

![Debugger 3](/images/tutorials/eth-api/using-tenderly/tenderly-8.webp)

If you scroll down to the **Debugger** tab, you'll be able to step through the contracts line by line and see key state information at the bottom, allowing you to pinpoint the source of any error.

![Debugger 4](/images/tutorials/eth-api/using-tenderly/tenderly-9.webp)

Finally, you'll see a **Gas Profiler**, which will give you a visual representation of where and how the gas was spent throughout the course of the transaction. You can click on any of the function calls (represented by the blue rectangles) to see how much gas was spent in each call.

![Debugger 4](/images/tutorials/eth-api/using-tenderly/tenderly-10.webp)

For a more detailed look, be sure to check out the [How to Use Tenderly Debugger](https://docs.tenderly.co/debugger){target=\_blank} guide. And that's it! You're well on your way to mastering Tenderly, which is sure to save you time and simplify your development experience building dApps on Moonbeam.

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
