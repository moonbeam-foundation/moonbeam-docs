---
title: Create a DApp with Scaffold-ETH 2
description: You can deploy a Solidity DApp with a React UI and subgraph on Moonbeam in minutes by using Scaffold-ETH 2. Learn how in this tutorial.
---

# Using Scaffold-ETH 2 to Deploy a DApp on Moonbeam

## Introduction {: #introduction }

[Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2/){target=\_blank} is a collection of commonly used Ethereum development tools to quickly deploy a Solidity smart contract and launch a DApp with a React frontend.

Scaffold-ETH 2 consists of several sub-components, including [Hardhat](https://hardhat.org/docs/){target=\_blank} for creating, deploying, and testing smart contracts and [Next.js](https://nextjs.org/docs/){target=\_blank} for building a React frontend. These components can be used on Moonbeam networks with some slight modifications.

This guide will walk through the steps to deploy and run the default example contract and DApp that Scaffold-ETH 2 comes with on a Moonbeam network.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

- An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- [A Moonscan API key](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=\_blank}
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

### Installing Scaffold-ETH 2 {: #installing-scaffold-eth }

First, download [Scaffold-ETH 2 from GitHub](https://github.com/scaffold-eth/scaffold-eth-2/){target=\_blank}.

From the command line, enter:

```bash
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
```

After the download completes, run:

```bash
yarn install
```

## The Development Process with Scaffold-ETH 2 {: #development-process }

The process for developing a project with Scaffold-ETH 2 can be outlined as follows:

1. Update the network configurations in Hardhat for Moonbeam
2. Add your smart contracts to the `packages/hardhat/contracts`
3. Edit your deployment scripts in the `packages/hardhat/deploy`
4. Deploy your smart contracts to Moonbeam
5. Verify your smart contracts with the Etherscan plugin and your Moonscan API key
6. Configure your frontend to target Moonbeam in the `packages/nextjs/scaffold.config.ts` file
7. Edit your frontend as needed in the `packages/nextjs/pages` directory

In this guide, you can use the default contract and frontend that you get out of the box when you clone the Scaffold-ETH 2 repository. All you'll have to do is modify these components for Moonbeam.

## The Hardhat Component {: #hardhat-component }

In the following sections, you'll update the network configurations in the Hardhat configuration file to target the Moonbeam-based network you want to interact with, and deploy and verify the example contract to that network.

### Configure Hardhat for Moonbeam {: #configure-hardhat-for-moonbeam }

You can begin by making modifications to the Hardhat component under the `packages/hardhat` folder. You'll primarily be editing the `hardhat.config.js` file to configure it for Moonbeam. However, you'll also need to create a `.env` file to store a couple of variables that will be consumed by the `hardhat.config.js` file.

You can refer to the `.env.example` file for the variables that are already used in the `hardhat.config.js` file. For Moonbeam, you'll only need to create two variables: `DEPLOYED_PRIVATE_KEY` and `ETHERSCAN_API_KEY`.

Check out the [Etherscan Plugins](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=\_blank} documentation to learn how to generate a Moonscan API key.

To get started, create a `.env` file:

```bash
touch packages/hardhat/.env
```

Edit your `.env` file to include the following variables:

```text
DEPLOYER_PRIVATE_KEY=INSERT_PRIVATE_KEY
ETHERSCAN_API_KEY=INSERT_MOONSCAN_API_KEY
```

The private key you add to your `.env` file corresponds to the account that will deploy and interact with the smart contracts in your Hardhat project. Additionally, the Etherscan API key will correspond to your Moonscan API key and will be used to verify your deployed smart contracts. To learn how to generate a Moonscan API key, check out the [Etherscan Plugins](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=\_blank} documentation.

With the environment variables taken care of, next you can modify the `hardhat.config.js` file for Moonbeam:

1. Set the constant `defaultNetwork` to the network you are deploying the smart contract to

    === "Moonbeam"

        ```js
        defaultNetwork = 'moonbeam';
        ```

    === "Moonriver"

        ```js
        defaultNetwork = 'moonriver';
        ```

    === "Moonbase Alpha"

        ```js
        defaultNetwork = 'moonbaseAlpha';
        ```

    === "Moonbeam Dev Node"

        ```js
        defaultNetwork = 'moonbeamDevNode';
        ```

2. Add the network configurations for the Moonbeam network you want to interact with under the `networks` configuration object

    === "Moonbeam"

        ```js
        moonbeam: {
          url: "{{ networks.moonbeam.rpc_url }}",
          accounts: [deployerPrivateKey],
        },
        ```

    === "Moonriver"

        ```js
        moonriver: {
          url: "{{ networks.moonriver.rpc_url }}",
          accounts: [deployerPrivateKey],
        },
        ```

    === "Moonbase Alpha"

        ```js
        moonbaseAlpha: {
          url: "{{ networks.moonbase.rpc_url }}",
          accounts: [deployerPrivateKey],
        },
        ```

    === "Moonbeam Dev Node"

        ```js
        moonbeamDevNode: {
          url: "{{ networks.development.rpc_url }}",
          accounts: [deployerPrivateKey],
        },
        ```

        --8<-- 'text/_common/endpoint-examples.md'

For more information on using Hardhat with Moonbeam, please check the dedicated [Hardhat page](/builders/build/eth-api/dev-env/hardhat/){target=\_blank} for more details.

### Deploy Your Contract to Moonbeam {: #deploy-contract }

After all the modifications to the configuration files are done, you can deploy your contract to the configured Moonbeam-based network.

First, you can compile your contract by running:

```bash
yarn compile
```

![The terminal output from running the compile command.](/images/builders/build/eth-api/dev-env/scaffold-eth/new/scaffold-eth-1.webp)

Then, you can run the following command from the root directory of your project:

```bash
yarn deploy
```

![The terminal output from running the deploy command.](/images/builders/build/eth-api/dev-env/scaffold-eth/new/scaffold-eth-2.webp)

!!! note
    If you did not set the `defaultNetwork` config in the `hardhat.config.js` file, you can append `--network INSERT_NETWORK` to the command. For example, the following command would deploy a contract to Moonbeam.

    ```bash
    yarn deploy --network moonbeam
    ```

### Verify Your Deployed Contract {: #verify-contracts }

If you would also like to use Scaffold-ETH 2 to verify the deployed smart contract and have entered your Moonscan API key into the `.env` file, you can go ahead and verify your deployed contract.

If the smart contract you are verifying has constructor method parameters, you will also need to append the parameters used to the end of the command.

You can use the following command to verify the smart contract:

=== "Moonbeam"

    ```bash
    yarn verify --api-url https://api-moonbeam.moonscan.io
    ```

=== "Moonriver"

    ```bash
    yarn verify --api-url https://api-moonriver.moonscan.io
    ```

=== "Moonbase Alpha"

    ```bash
    yarn verify --api-url https://api-moonbase.moonscan.io
    ```

!!! note
    If you did not set the `defaultNetwork` configuration in the `hardhat.config.js` file, you can append `--network INSERT_NETWORK` to the command. For example, the following command would verify a contract on Moonbeam.

    ```bash
    yarn verify --network moonbeam --api-url https://api-moonbeam.moonscan.io
    ```

After a short wait, the console output will display the verification result and, if successful, the URL to the verified contract on Moonscan.

![The terminal outut from running the verify command.](/images/builders/build/eth-api/dev-env/scaffold-eth/new/scaffold-eth-3.webp)

For more information about verifying smart contracts on Moonbeam using the Hardhat Etherscan plugin, please refer to the [Etherscan Plugins page](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=\_blank}.

## The Next.js Component {: #nextjs-component }

In the following sections, you'll modify the Next.js configuration so that it targets the Moonbeam-based network that your contract has been deployed to, and then you'll launch the dApp.

### Configure the DApp for Moonbeam {: #configure-dapp }

To target the Moonbeam-based network that you deployed your smart contract to, you'll need to edit the configurations in the `packages/nextjs/scaffold.config.ts` file. More specifically, you'll need to modify the `targetNetworks` array in the `scaffoldConfig` object. You can use the [list of chains that viem provides](https://github.com/wevm/viem/blob/main/src/chains/index.ts){target=\_blank} to specify the chain(s) you've deployed your contract to.

=== "Moonbeam"

    ```js
    targetNetworks: [chains.moonbeam],
    ```

=== "Moonriver"

    ```js
    targetNetworks: [chains.moonriver],
    ```

=== "Moonbase Alpha"

    ```js
    targetNetworks: [chains.moonbaseAlpha],
    ```

=== "Moonbeam Dev Node"

    ```js
    targetNetworks: [chains.moonbeamDev],
    ```

That's all you have to do to configure Next.js! Next, you can launch the dApp.

### Launch the DApp {: #launch-the-dapp }

After all the modifications to the configuration files are done, you can launch the example dApp. To do so, you can run:

```bash
yarn start
```

![The terminal outut from running the start command.](/images/builders/build/eth-api/dev-env/scaffold-eth/new/scaffold-eth-4.webp)

This will launch the React-based DApp frontend at [http://localhost:3000/](http://localhost:3000/){target=\_blank} by default. You can then point your browser to [http://localhost:3000/](http://localhost:3000/){target=\_blank} and interact with the React frontend by connecting your wallet or checking out the contract debugger page.

![The frontend of the DApp on the browser.](/images/builders/build/eth-api/dev-env/scaffold-eth/new/scaffold-eth-5.webp)

And that's it! Now that you have the basics down, feel free to create and deploy your own smart contracts and modify the frontend to fit your dApp's needs! For more information, you can check out the [Scaffold-ETH 2 docs](https://docs.scaffoldeth.io/){target=\_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
