---
title: Tenderly Development Platform
description: Learn how to use Tenderly, an Ethereum development platform, to build, debug, and monitor Solidity smart contracts on Moonbeam.
---

# Using Tenderly on Moonbeam

## Introduction {: #introduction }

[Tenderly](https://tenderly.co){target=\_blank} is a Web3 development platform that contains a suite of tools designed to help developers throughout the DApp development life cycle. With Tenderly, you can build, debug, test, optimize, monitor, set up alerts, and view analytics for your smart contracts on Moonbeam and Moonriver.

The Tenderly platform provides the following features:

- **[Contract Verification](https://docs.tenderly.co/contract-verification){target=\_blank}** - as it is essential to verify your smart contracts to take full advantage of all of Tenderly's features, Tenderly provides several methods of verification. You can verify smart contracts through [the Tenderly dashboard](https://docs.tenderly.co/contract-verification/dashboard){target=\_blank}, [the Tenderly CLI and Foundry](https://docs.tenderly.co/contract-verification/foundry){target=\_blank}, or [the Tenderly Hardhat plugin](https://docs.tenderly.co/contract-verification/hardhat){target=\_blank}

- **[Debugger](https://docs.tenderly.co/debugger){target=\_blank}** - use the visual debugger to inspect transactions and get better insight into the behavior of your code. With the debugger, you can review a transaction's stack trace, view the calls made in a transaction, step through a contract, and review decoded inputs, outputs, and state variables. You can use the debugger on the Tenderly dashboard or the [Tenderly Debugger Chrome Extension](https://docs.tenderly.co/debugger/tenderly-debugger-extension){target=\_blank}

- **[Gas Profiler](https://docs.tenderly.co/debugger/gas-profiler){target=\_blank}** - view how much gas you're spending on a granular level, so you can optimize your smart contracts and reduce transaction gas costs

- **[Simulator](https://docs.tenderly.co/simulator-ui){target=\_blank}** - simulate transactions in a TestNet development environment to learn how your transactions will behave without having to send them on-chain. This way, you can know the outcome of the transaction and make sure it works as expected before sending it to the network. You can experiment with different parameters, simulate historical and current transactions, and edit the contract source code. You can access the simulator from the Tenderly dashboard or you can use the [Tenderly Simulation API](https://docs.tenderly.co/reference/api#tag/Simulations){target=\_blank} to take advantage of the simulator programmatically

- **[Virtual TestNets](https://docs.tenderly.co/virtual-testnets){target=\_blank}** - simulate the live Moonbeam network in an isolated environment, allowing interaction with deployed contracts and real-time on-chain data. These test environments provide a controlled setting for developing, testing, and debugging dApps, covering smart contracts, UI, backend, and data indexing layers. They also support transaction simulations by enabling multiple simulations to be executed sequentially, allowing for the testing of complex scenarios where one transaction depends on another. There are some limitations to be aware of when using this feature. You cannot interact with any of the [Moonbeam precompiled contracts](/builders/ethereum/precompiles/){target=\_blank} and their functions. Precompiles are a part of the Substrate implementation and, therefore, cannot be replicated in the simulated EVM environment. This prohibits you from interacting with cross-chain assets on Moonbeam and Substrate-based functionality such as staking and governance

- **[Alerting](https://docs.tenderly.co/alerts/intro-to-alerts){target=\_blank}** - configure real-time alerts to notify you whenever a specific event occurs, allowing you to stay informed about what's going on with your smart contracts

- **[Web3 Actions](https://docs.tenderly.co/web3-actions/intro-to-web3-actions){target=\_blank}** - create programmable functions in JavaScript or TypeScript that are executed automatically by Tenderly when a specific smart contract or chain event occurs

- **[Sandbox](https://sandbox.tenderly.co){target=\_blank}** - write, compile, execute, and debug your smart contracts directly in your browser with baked-in JavaScript and Solidity editors. Every time you run your code, Tenderly creates a temporary fork that comes with 10 pre-funded accounts, each with 100 tokens for testing purposes

!!! note
    Moonbeam and Moonriver is fully supported by Tenderly with the exception of the Web3 Gateway. Moonbase Alpha is not currently supported by Tenderly. For more information, check out Tenderly's documentation on [Supported Networks](https://docs.tenderly.co/supported-networks-and-languages#supported-networks){target=\_blank}.

## Getting Started

The Tenderly dashboard provides access to the all-in-one Web3 development platform. To get started with the dashboard, you'll need to [sign up](https://dashboard.tenderly.co/register){target=\_blank} for an account. Once you've signed up, you'll be able to start exploring your Tenderly dashboard.

![Tenderly dashboard](/images/builders/ethereum/dev-env/tenderly/tenderly-1.webp)

If you prefer not to set up an account, you can also access limited features using [Tenderly's explorer](https://dashboard.tenderly.co/explorer){target=\_blank}. Without an account, you can still gain insights for contracts and transactions. However, you won't be able to simulate transactions or create Virtual TestNets.

To interact with Tenderly's features programmatically, you can check out the [Tenderly CLI](https://github.com/Tenderly/tenderly-cli){target=\_blank} GitHub repository for more information.

The following sections will show you how to get started with Tenderly on Moonbeam. For more detailed documentation, please refer to [Tenderly's documentation site](https://docs.tenderly.co){target=\_blank}.

### Create a Sandbox {: #create-a-moonbeam-sandbox }

To deploy contracts to Moonbeam with a Tenderly Sandbox, you can navigate to [sandbox.tenderly.co](https://sandbox.tenderly.co){target=\_blank} and take the following steps:

1. Enter your smart contract into the Solidity editor on the left-hand side
2. Select **Moonbeam** or **Moonriver** from the **Network** menu, adjust any of the compilation settings, and specify the block to run your code on if needed
3. Update the JavaScript editor on the right-hand side for your contract. [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} and [Web3.js](/builders/ethereum/libraries/web3js/){target=\_blank} are included in the Sandbox by default and can be instantiated with `ethers` and `web3`, respectively. It's also important to note that the Sandbox includes [global variables](https://docs.tenderly.co/tenderly-sandbox#available-javascript-global-variables){target=\_blank} to ease development, so you don't need to worry about updating the RPC URL for Moonbeam
4. Click on **RUN** when you're ready to compile your contract and execute your code

If your code contained logic to deploy your contract or send a transaction, you'll see the transaction(s) appear under the **Simulated Transactions** section on the bottom left-hand side.

![Tenderly Sandbox](/images/builders/ethereum/dev-env/tenderly/tenderly-2.webp)

### Add a Contract {: #add-a-contract }

A good place to start with the Tenderly dashboard is to add a deployed smart contract. Once you've added a contract, you'll be able to create transaction simulations and Virtual TestNets, use the debugger, set up monitoring and alerts, and more.

To add a new contract, you can click on **Contracts** on the left-side panel and click **Add Contract**. A pop-up will appear and you can take the following steps:

1. Enter the contract address
2. Choose **Moonbeam** or **Moonriver** as the network, depending on which network you've deployed your smart contract to
3. (Optional) You can give your contract a name
4. (Optional) You can toggle the **Add more** slider to on if you'd like to add additional contracts. This will allow you to add more contracts after the initial contract has been added
5. Finally to add the contract to the dashboard, click **Add contract**

![Add a contract](/images/builders/ethereum/dev-env/tenderly/tenderly-3.webp)

After a contract has been added, it will appear in the list of contracts on the **Contracts** dashboard. If the contract hasn't been verified yet, the dashboard will display an **Unverified** status along with a **Verify** button.

![Contract in list of contracts](/images/builders/ethereum/dev-env/tenderly/tenderly-4.webp)

To take full advantage of the Tenderly tool set, it is recommended that you verify your smart contracts, which you can do by clicking on **Verify**. You can choose to verify your contract by uploading the contract's JSON, ABI, or source code. For more information, please refer to Tenderly's documentation on [Smart Contract Verification](https://docs.tenderly.co/contract-verification#verifying-a-smart-contract){target=\_blank}.

### Create a Virtual TestNets {: #virtual-testnets-moonbeam }

Tenderly's Virtual TestNets feature simulates the live Moonbeam network in an isolated environment, which enables you to interact with deployed contracts and live on-chain data.

There are some limitations to be aware of when using this feature. You cannot interact with any of the [Moonbeam precompiled contracts](/builders/ethereum/precompiles/){target=\_blank} and their functions. Precompiles are a part of the Substrate implementation and therefore cannot be replicated in the simulated EVM environment. This prohibits you from interacting with cross-chain assets on Moonbeam and Substrate-based functionality such as staking and governance.

Tenderly makes creating a TestNet through the dashboard quite simple. To get started, click on **Virtual TestNets** on the left-side menu and then click **Create Virtual TestNet**. From there, you can take the following steps:

1. Select **Moonbeam**, **Moonriver**, or **Moonbase Alpha** from the **Network** dropdown
2. (Optional) Give your TestNet a name
3. Select your **Chain ID** you can use a custom one or the original network ID. It is recommended to set a custom Chain ID to prevent replay attacks and avoid issues when adding the Virtual TestNet to wallets
4. Choose whether to enable or disable the **Public Explorer**
5. Enable **State Sync** if you want to keep your Virtual TestNet updated in real-time with the parent network
6. To limit data to a specific block, disable **Use Latest Block** and enter the block number. Otherwise, keep it enabled to include all blocks up to the latest
7. Click **Create**

![Virtual TestNet Moonbeam](/images/builders/ethereum/dev-env/tenderly/tenderly-5.webp)

Once you've created your Virtual TestNet, you can start using it by deploying a contract to it or creating a transaction simulation using it.

To deploy a contract, go to Contracts in the left menu. Use one from **Watched Contracts** or add a new one via **Watch Contract**. Once added, it will appear in **Contracts**, where you can view its details.

![TestNet simulations](/images/builders/ethereum/dev-env/tenderly/tenderly-6.webp)

To create a simulation, click the **Simulation** button and enter the configurations for the simulation. For more information on simulations, please refer to Tenderly's [Simulator UI Overview](https://docs.tenderly.co/simulator-ui/using-simulation-ui){target=\_blank} documentation.

Now that you've learned how to get started with a few of Tenderly's features on Moonbeam, please feel free to dive in and check out the other tools available in their development platform. You can visit [Tenderly's documentation site](https://docs.tenderly.co){target=\_blank} for more information. You can also check out Moonbeam's tutorial on [Using Tenderly to Simulate and Debug Transactions](/tutorials/eth-api/using-tenderly/){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
