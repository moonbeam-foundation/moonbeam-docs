---
title: Create a DApp with Scaffold-ETH
description: You can deploy a Solidity DApp with a React UI and subgraph on Moonbeam in minutes by using Scaffold-ETH. Learn how in this tutorial.
---

# Using Scaffold-ETH to Deploy a DApp on Moonbeam

## Introduction {: #introduction }

[Scaffold-ETH](https://github.com/scaffold-eth/scaffold-eth){target=_blank} is a collection of commonly used Ethereum development tools to quickly deploy a Solidity smart contract, and launch a DApp with a React frontend and a deployed subgraph. There are premade templates for common DApp types such as NFT’s, ERC-20 tokens, multi-sig wallets, simple DEXs, and so on.

Scaffold-ETH consists of several sub-components, including Hardhat, The Graph and a React UI. All of these components can be used on Moonbeam networks with some slight modifications. This guide will walk through the steps to deploy and run the default sample contract and DApp that Scaffold-ETH comes with on a Moonbeam network.

## Checking Prerequisites {: #checking-prerequisites }

To run The Graph component of Scaffold-ETH, you also need to have the following installed on your system to run a local The Graph node from Docker:

 - [Docker](https://docs.docker.com/get-docker/){target=_blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=_blank}
 - [JQ](https://stedolan.github.io/jq/download/){target=_blank}

--8<-- 'text/_common/endpoint-examples.md'

### Installing Scaffold-ETH {: #installing-scaffold-eth }

First, download Scaffold-ETH from its GitHub repository.

From the command line, enter:

```bash
git clone https://github.com/scaffold-eth/scaffold-eth.git
```

After the download completes, run:

```bash
yarn install
```

![Scaffold-ETH installation output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-1.png)

Once the dependencies have been installed without any errors in the console output as in the above screenshot, you can proceed to modifying the different components of Scaffold-ETH.

## Modify Configurations {: #modify-configurations }

You need to make modifications to the configurations of the three major components that make up Scaffold-ETH.

--8<-- 'text/_common/endpoint-examples.md'

### Hardhat Component {: #hardhat-component }

You can begin with making modifications to the Hardhat component under the `/packages/hardhat` folder.

1. The main file you need to modify is `scaffold-eth/packages/hardhat/hardhat.config.js`. First, set the constant `defaultNetwork` to the network you are deploying the smart contract to.

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

2. Within the same file, under the `module.exports/etherscan/apiKey` section, add the API key for [Moonscan](https://moonscan.io/){target=_blank}, so you can verify the deployed smart contracts. Check this [Etherscan Plugins](/builders/build/eth-api/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} section for how to generate a Moonscan API key

3. (Optional) Under the `function mnemonic()`, comment out a console warning for when the network is not set to `localhost`

    ```js
    if (defaultNetwork !== 'localhost') {
      //console.log(
      //  "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      //);
    }
    ```

4. Create a file named `mnemonic.txt` under `scaffold-eth/packages/hardhat/`, then copy and paste the mnemonic of the contract deployer account into this file.

For more information on using Hardhat with Moonbeam, please check the dedicated [Hardhat page](/builders/build/eth-api/dev-env/hardhat/){target=_blank} for more details.

### The Graph Component {: #the-graph-component }

In The Graph component of Scaffold-ETH, you need to modify two files to point the local The Graph node instance to the corresponding Moonbeam RPC endpoint.

1. First, modify the file `scaffold-eth/packages/services/graph-node/docker-compose.yaml`, under `servers/graph-node/environment/ethereum` to change the RPC endpoint for The Graph node to index.

    For Moonbeam or Moonriver, you can use your own [RPC API endpoint](/builders/get-started/endpoints/){target=_blank} and the corresponding network name prefix. For Moonbase Alpha or a Moonbeam development node, you can use the following:

    === "Moonbase Alpha"

        ```yaml
        ethereum: "moonbaseAlpha:{{ networks.moonbase.rpc_url }}"
        ```

    === "Moonbeam Dev Node"

        ```yaml
        ethereum: "moonbeamDevNode:{{ networks.development.rpc_url }}"
        ```

2. Next, you need to modify `subgraph/subgraph.yaml`. Change the `dataSources/network` field of the contract being deployed to the corresponding network name defined earlier in `docker-compose.yaml`:

    === "Moonbeam"

        ```yaml
        network: moonbeam
        ```

    === "Moonriver"

        ```yaml
        network: moonriver
        ```

    === "Moonbase Alpha"

        ```yaml
        network: moonbaseAlpha
        ```

    === "Moonbeam Dev Node"

        ```yaml
        network: moonbeamDevNode
        ```

3. Next, in the same file, `subgraph.yaml`, change the `dataSources/source/address` field to the contract's `0x` prefixed deployed address

4. And lastly, in the same file, `subgraph.template.yaml`, change the `dataSources/mapping/abis/file` field to:

    === "Moonbeam"

        ```yaml
        file: ./abis/moonbeam_YourContract.json
        ```

    === "Moonriver"

        ```yaml
        file: ./abis/moonriver_YourContract.json
        ```

    === "Moonbase Alpha"

        ```yaml
        file: ./abis/moonbaseAlpha_YourContract.json
        ```

    === "Moonbeam Dev Node"

        ```yaml
        file: ./abis/moonbeamDevNode_YourContract.json
        ```

    !!! note
        This file name here will be different if you are not deploying the example contract, but follows the same `<Network Name>_<Contract File Name>` format.

For more information on using The Graph with Moonbeam, please check the dedicated [The Graph page](/builders/integrations/indexers/thegraph/){target=_blank} for more details; or the dedicated [The Graph Node page](/node-operators/indexer-nodes/thegraph-node/){target=_blank} for more information on running a Graph node for Moonbeam.

### React Component {: #react-component }

Next, you need to modify two files in the React component to add Moonbeam networks.

1. First, modify `scaffold-eth/packages/react-app/src/App.jsx` and set the `initialNetwork` constant to the corresponding network definition exported from `constants.js` to be the default network:

    === "Moonbeam"

        ```js
        const initialNetwork = NETWORKS.moonbeam;
        ```

    === "Moonriver"

        ```js
        const initialNetwork = NETWORKS.moonriver;
        ```

    === "Moonbase Alpha"

        ```js
        const initialNetwork = NETWORKS.moonbaseAlpha;
        ```

    === "Moonbeam Dev Node"

        ```js
        const initialNetwork = NETWORKS.moonbeamDevNode;
        ```

2. Within the same file, `App.jsx`, set `networkOptions` to whichever networks your DApp will support, for example:

    ```js
    const networkOptions = [initialNetwork.name, 'moonbeam', 'moonriver'];
    ```

## Deploy and Launch the DApp {: #deploy-and-launch-the-dapp }

1. After all the modifications to the configuration files are done, launch the local The Graph node instance by typing:

    ```bash
    yarn run-graph-node
    ```

    This will launch a local node instance through a Docker image, and the console output should show that it's indexing blocks of the network that it's being pointed to

    ![The Graph node output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-2.png)

2. Open a new tab or window in the terminal. Next, compile and deploy the smart contract by running the command:

    ```bash
    yarn deploy
    ```

    ![Contract deployment output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-3.png)

    If you are going to use The Graph, be sure to edit `subgraph.yaml` with the deployed contract's address from the output. If not, you can skip to step 5 to start the React server

3. Next, create a local sub-graph by typing:

    ```bash
    yarn graph-create-local
    ```

    ![Create sub-graph output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-4.png)

4. Next, deploy the sub-graph to the local graph node by typing:

    === "Moonbeam"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonbeam && yarn graph-deploy-local
        ```

    === "Moonriver"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonriver && yarn graph-deploy-local
        ```

    === "Moonbase Alpha"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonbaseAlpha && yarn graph-deploy-local
        ```

    === "Moonbeam Dev Node"

        ```bash
        yarn graph-codegen && yarn graph-build --network moonbeamDevNode && yarn graph-deploy-local
        ```

    You will be prompted to enter a version name for the sub-graph being deployed

    ![Sub-graph deployment output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-5.png)

5. Finally, you can launch the React server by typing:

    ```bash
    yarn start
    ```

    This will launch the React based DApp UI at `http://localhost:3000/` by default

    ![React server output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-6.png)

6. You can then point your browser to `http://localhost:3000/` and interact with the React frontend

    ![React UI](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-7.png)

### Verifying Contracts {: #Verifying-Contracts }

If you would also like to use Scaffold-ETH to verify the smart contract deployed, and have entered the corresponding Moonscan API key into `hardhat.config.js`, you can use the following command to verify the smart contract.

=== "Moonbeam"

    ```bash
    yarn verify --network moonbeam INSERT_CONTRACT_ADDRESS
    ```

=== "Moonriver"

    ```bash
    yarn verify --network moonriver INSERT_CONTRACT_ADDRESS
    ```

=== "Moonbase Alpha"

    ```bash
    yarn verify --network moonbaseAlpha INSERT_CONTRACT_ADDRESS
    ```

!!! note
    If the smart contract you are verifying has constructor method parameters, you will also need to append the parameters used to the end of the above command.

After a short wait, the console output will display the verification result and if successful, the URL to the verified contract on Moonscan.

![Contract verify output](/images/builders/build/eth-api/dev-env/scaffold-eth/scaffold-eth-8.png)

For more information about verifying smart contracts on Moonbeam using Hardhat Etherscan plugin, please refer to the [Etherscan Plugins page](/builders/build/eth-api/verify-contracts/etherscan-plugins/#using-the-hardhat-etherscan-plugin){target=_blank}.

--8<-- 'text/_disclaimers/third-party-content.md'
