---
title: Using Scaffold-ETH
description: You can deploy a Solidity DApp with a React UI and subgraph on Moonbeam in minutes by using Scaffold-ETH. Learn how in this tutorial.
---

# Using Scaffold-ETH to Deploy a DApp on Moonbeam

![Scaffold-ETH Banner](/images/builders/interact/scaffold-eth/scaffold-eth-banner.png)

## Introduction {: #introduction } 

[Scaffold ETH](https://github.com/scaffold-eth/scaffold-eth){target=blank} is a collection of commonly used Ethereum development tools to quickly deploy a Solidity smart contract, and launch a DApp with a React frontend and a deployed subgraph. There are premade templates for common DApp types such as NFT’s, ERC20 tokens, multi-sig wallets, simple DEXs, and so on.

Scaffold-ETH consists of several sub-components, including Hardhat, The Graph and a React UI. All of these components can be used on Moonbeam networks with some slight modifications. This guide will walk through the steps to deploy and run the default sample contract and DApp that Scaffold-ETH comes with on a Moonbeam network. 

## Checking Prerequisites {: #checking-prerequisites } 

--8<-- 'text/common/install-nodejs.md'

To run The Graph component of Scaffold-ETH, you also need to have the following installed on your system to run a local The Graph node from Docker:

 - [Docker](https://docs.docker.com/get-docker/){target=blank}
 - [Docker Compose](https://docs.docker.com/compose/install/){target=blank}
 - [JQ](https://stedolan.github.io/jq/download/){target=blank}

### Installing Scaffold-ETH {: #installing-scaffold-eth } 

First, we need to download Scaffold-ETH from its GitHub repository. 

From the command line, enter:

```
git clone https://github.com/scaffold-eth/scaffold-eth.git
```

After the download completes, run:

```
yarn install
```

![Scaffold-ETH installation output](/images/builders/interact/scaffold-eth/scaffold-eth-1.png)

Once the dependencies have been installed without any errors in the console output as in the above screenshot, we can proceed to modifying the different components of Scaffold-ETH. 

## Modify Configurations {: #modify-configurations }

We need to make modifications to the configurations of the three major components that make up Scaffold-ETH.

### Hardhat Component {: #hardhat-component }

Let's begin with making some modifications to the Hardhat component under the `/packages/hardhat` folder.

1. The file we need to modify is `scaffold-eth/packages/hardhat/hardhat.config.js`. Under the `module.exports/networks` section, we want to add the network definitions for the Moonbeam network(s) that we would like to use, including the RPC endpoint, the chain ID, and the contract deployment account's private key. 

    === "Moonbeam"
        ```js
        moonbeam: {
            url: 'https://rpc.api.moonbeam.network',
            chainId: 1284,  // 0x504 in hex,
            accounts: ["Deployment Account Private Key"]
        }
        ```

    === "Moonriver"
        ```js
        moonriver: {
            url: 'https://rpc.api.moonriver.moonbeam.network',
            chainId: 1285,  // 0x505 in hex,
            accounts: ["Deployment Account Private Key"] 
        }
        ```

    === "Moonbase Alpha"
        ```js
        moonbaseAlpha: {
            url: 'https://rpc.api.moonbase.moonbeam.network',
            chainId: 1287,  // 0x507 in hex,
            accounts: ["Deployment Account Private Key"]
        }
        ```

    === "Moonbeam Dev Node"
        ```js
        moonbeamDevNode: {
            url: 'http://127.0.0.1:9933',
            chainId: 1281,  // 0x501 in hex,
            accounts: ["Deployment Account Private Key"]
        }
        ```

2. In the same file, set the constant `defaultNetwork` to the network you would like to deploy the smart contract to, using the network name we defined above. 

    === "Moonbeam"
        ```
        defaultNetwork = "moonbeam";
        ```
    === "Moonriver"
        ```
        defaultNetwork = "moonriver";
        ```
    === "Moonbase Alpha"
        ```
        defaultNetwork = "moonbaseAlpha";
        ```
    === "Moonbeam Dev Node"
        ```
        defaultNetwork = "moonbeamDevNode";
        ```

3. Within the same file, under the `module.exports/etherscan/apiKey` section, we want to add the API key for [Moonscan](https://moonscan.io/){target=blank}, so we can verify our deployed smart contracts. Check this [Etherscan Plugins](/builders/tools/verify-contracts/etherscan-plugins/#generating-a-moonscan-api-key){target=_blank} section for how to generate a Moonscan API key. 


4. (Optional) Under the `function mnemonic()`, comment out a console warning for when the network is not set to `localhost`. 

    ```js
    if (defaultNetwork !== "localhost") {
      //console.log(
      //  "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
      //);
    }
    ```

For more information on using Hardhat with Moonbeam, please check the dedicated [Hardhat page](/builders/interact/hardhat/){target=blank} for more details.

### The Graph Component {: #the-graph-component }

In The Graph component of Scaffold-ETH, we need to modify two files to point the local The Graph node instance to the corresponding Moonbeam RPC endpoint. 

1. First, modify the file `scaffold-eth/packages/services/graph-node/docker-compose.yaml`, under `servers/graph-node/environment/ethereum` to change the RPC endpoint for The Graph node to index:


    === "Moonbeam"
        ```
        'moonbeam:https://rpc.api.moonbeam.network'
        ```
    === "Moonriver"
        ```
        'moonriver:https://moonriver.api.onfinality.io/public'
        ```
    === "Moonbase Alpha"
        ```
        'mbase:https://rpc.api.moonbase.moonbeam.network'
        ```
    === "Moonbeam Dev Node"
        ```
        'mbase:http://127.0.0.1:9933'
        ```

    !!! note
        We are using Moonbeam's public RPC endpoints for this example, but for production DApp's, it's recommended to use a private API endpoint provider. See [this page](/builders/get-started/endpoints/#endpoint-providers){target=_blank} for more information.

2. Next, we need to modify `subgraph/src/subgraph.template.yaml`. Change the `dataSources/network` field of the contract being deployed to the corresponding network name we defined in `docker-compose.yaml`:

    === "Moonbeam"
        ```
        network: moonbeam 
        ```
    === "Moonriver"
        ```
        network: moonriver
        ```
    === "Moonbase Alpha"
        ```
        network: mbase 
        ```
    === "Moonbeam Dev Node"
        ```
        network: mbase 
        ```

3. Next, in the same file, `subgraph.template.yaml`, we want to change the `dataSources/source/address` field to:

    === "Moonbeam"
        ```
        {% raw %}
        address: "{{moonbeam_YourContractAddress}}"
        {% endraw %}
        ```
    === "Moonriver"
        ```
        {% raw %}
        address: "{{moonriver_YourContractAddress}}"
        {% endraw %}
        ```
    === "Moonbase Alpha"
        ```
        {% raw %}
        address: "{{moonbaseAlpha_YourContractAddress}}"
        {% endraw %}
        ```
    === "Moonbeam Dev Node"
        ```
        {% raw %}
        address: "{{moonbeamDevNode_YourContractAddress}}"
        {% endraw %}
        ```

4. And lastly, in the same file, `subgraph.template.yaml`, we want to change the `dataSources/mapping/abis/file` field to:

    === "Moonbeam"
        ```
        file: ./abis/moonbeam_YourContract.json
        ```
    === "Moonriver"
        ```
        file: ./abis/moonriver_YourContract.json
        ```
    === "Moonbase Alpha"
        ```
        file: ./abis/moonbaseAlpha_YourContract.json
        ```
    === "Moonbeam Dev Node"
        ```
         file: ./abis/moonbeamDevNode_YourContract.json
        ```

For more information on using The Graph with Moonbeam, please check the dedicated [The Graph page](/builders/intergrations/indexers/thegraph/){target=blank} for more details; or the dedicated [The Graph Node page](/node-operators/indexer-nodes/thegraph-node/){target=blank} for more information on running a Graph node for Moonbeam.

### React Component {: #react-component }

Next, we need to modify two files in the React component to have 

1. First, we need to add the corresponding Moonbeam networks to `scaffold-eth/packages/react-app/src/constants.js`, under the `NETWORKS` constant:

    === "Moonbeam"
        ```js
        moonbeam: {
            name: "moonbeam",
            color: "#42A2A0",
            chainId: 1284, // 0x504 in hex,
            blockExplorer: "https://moonbeam.moonscan.io/",
            rpcUrl: `https://rpc.api.moonbeam.network`,
            gasPrice: 100000000000,
            faucet: "",
        },
        ```

    === "Moonriver"
        ```js
        moonriver: {
            name: "moonriver",
            color: "#42A2A0",
            chainId: 1285, // 0x505 in hex,
            blockExplorer: "https://moonriver.moonscan.io/",
            rpcUrl: `https://rpc.api.moonriver.moonbeam.network`,
            gasPrice: 1000000000,
            faucet: "",
        },
        ```

    === "Moonbase Alpha"
        ```js
        moonbaseAlpha: {
            name: "moonbaseAlpha",
            color: "#42A2A0",
            chainId: 1287, // 0x507 in hex,
            blockExplorer: "https://moonbase.moonscan.io/",
            rpcUrl: `https://rpc.api.moonbase.moonbeam.network`,
            gasPrice: 1000000000,
            faucet: "https://discord.gg/SZNP8bWHZq",
        },
        ```

    === "Moonbeam Dev Node"
        ```js
        moonbeamDevNode: {
            name: "moonbeamDevNode",
            color: "#42A2A0",
            chainId: 1281, // 0x501 in hex,
            blockExplorer: "",
            rpcUrl: `http://127.0.0.1:9933`,
            gasPrice: 1000000000,
            faucet: "",
        }
        ```

2. Next, we need to modify `scaffold-eth/packages/react-app/src/App.jsx`. Set the `initialNetwork` constant to the corresponding network definition exported from `constants.js` to be the default network:

    === "Moonbeam"
        ```
        const initialNetwork = NETWORKS.moonbeam;
        ```
    === "Moonriver"
        ```
        const initialNetwork = NETWORKS.moonriver;
        ```
    === "Moonbase Alpha"
        ```
        const initialNetwork = NETWORKS.moonbaseAlpha;
        ```
    === "Moonbeam Dev Node"
        ```
        const initialNetwork = NETWORKS.moonbeamDevNode;
        ```

3. Within the same file, `App.jsx`, set `networkOptions` to whichever networks your DApp will support, for example:

    ```
    const networkOptions = [initialNetwork.name, "moonbeam", "moonriver"];
    ```

## Deploy and Launch the DApp {: #deploy-and-launch-the-dapp }

1. After the all the modifications to the configuration files are done, we can launch our local The Graph node instance by typing:

    ```
    yarn run-graph-node
    ```

    This will launch a local node instance through a Docker image, and the console output should show that it's indexing blocks of the network that it's being pointed to. 

    ![The Graph node output](/images/builders/interact/scaffold-eth/scaffold-eth-2.png)

2. Open a new tab or window in the terminal. Next, We can compile and deploy the smart contract by running the command:

    ```
    yarn deploy
    ```

    ![Contract deployment output](/images/builders/interact/scaffold-eth/scaffold-eth-3.png)

3. We will create a local sub-graph by typing:

    ```
    yarn graph-create-local
    ```

    ![Create sub-graph output](/images/builders/interact/scaffold-eth/scaffold-eth-4.png)

4. Next, we will deploy the sub-graph to our local graph node: 

    ```
    yarn graph-ship-local
    ```

    You will be prompted to enter a version name for the sub-graph being deployed. 

    ![Sub-graph deployment output](/images/builders/interact/scaffold-eth/scaffold-eth-5.png)

5. Finally, we can launch the React server by typing:

    ```
    yarn start
    ```

    This will launch the the React based DApp UI at `http://localhost:3000/` by default. 

    ![React server output](/images/builders/interact/scaffold-eth/scaffold-eth-6.png)

6. You can then point your browser to `http://localhost:3000/` and interact with the React frontend.

    ![React UI](/images/builders/interact/scaffold-eth/scaffold-eth-7.png)

### Verifying Contracts {: #Verifying-Contracts }

If you would also like to use Scaffold-ETH to verify the smart contract deployed, and have entered the corresponding Moonscan API key into `hardhat.config.js`, you can use the following command to verify the smart contract.

=== "Moonbeam"
    ```
    yarn verify --network moonbeam contract-deployment-address
    ```
=== "Moonriver"
    ```
    yarn verify --network moonriver contract-deployment-address
    ```
=== "Moonbase Alpha"
    ```
    yarn verify --network moonbaseAlpha contract-deployment-address
    ```

After a short wait, the console output will display the verification result and if successful, the URL to the verified contract on Moonscan. 

![Contract verify output](/images/builders/interact/scaffold-eth/scaffold-eth-8.png)