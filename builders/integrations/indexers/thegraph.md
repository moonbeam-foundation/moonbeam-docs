---
title: Build APIs with The Graph
description: Learn how to build APIs, called subgraphs, to store and fetch on-chain data for a given smart contract using The Graph indexing protocol on Moonbeam. 
---

# Using The Graph on Moonbeam

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/MO8LKfz1XAc?si=bAma3bu-IQWdswg6' frameborder='0' allowfullscreen></iframe></div>
<style>.caption { font-family: Open Sans, sans-serif; font-size: 0.9em; color: rgba(170, 170, 170, 1); font-style: italic; letter-spacing: 0px; position: relative;}</style>

## Introduction  {: #introduction }

Indexing protocols organize information so that applications can access it more efficiently. For example, Google indexes the entire Internet to provide information rapidly when you search for something.

[The Graph](https://thegraph.com/){target=\_blank} is a decentralized and open-source indexing protocol for querying networks like Ethereum. In short, it provides a way to efficiently store data emitted by events from smart contracts so that other projects or dApps can access it easily.

Furthermore, developers can build APIs called subgraphs. Users or other developers can use subgraphs to query data specific to a set of smart contracts. Data is fetched with a standard GraphQL API. You can visit The Graph's documentation site to learn [about The Graph protocol](https://thegraph.com/docs/en/about/#what-the-graph-is){target=\_blank}.

Due to the support of Ethereum tracing modules on Moonbeam, The Graph can index blockchain data on Moonbeam. This guide takes you through the creation of a subgraph based on the [Exiled Racers Game Asset contract](https://moonscan.io/address/0x515e20e6275CEeFe19221FC53e77E38cc32b80Fb){target=\_blank} on Moonbeam.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Create a Subgraph {: #create-a-subgraph }

You can quickly create a subgraph from an existing contract. To get started, you'll follow these steps:

1. Initialize your subgraph project
2. Deploy your subgraph to the Subgraph Studio
3. Publish your subgraph to The Graph's decentralized network
4. Query your subgraph from your dApp

!!! note
    You can query your subgraph via the free, rate-limited development query URL, which can be used for development and staging. The free plan includes 100,000 queries per month. If you need to make more queries or want a production-ready plan, please check out [The Graph's documentation](https://thegraph.com/docs/en/billing/){target=\_blank}.

### Create a Subgraph on Subgraph Studio {: #create-a-subgraph }

To initialize your subgraph, you must head to the [Subgraph Studio](https://thegraph.com/studio/){target=\_blank} and connect your wallet. After you've connected your wallet, you'll be prompted to add an email address, which will be used to send notifications about your account. You can only associate one account with your email address, so make sure you've connected the account you intend to continue to use.

After you get your email address set up and verified, you can create a subgraph from your dashboard by clicking **Create a Subgraph**.

![Create a subgraph](/images/builders/integrations/indexers/the-graph/thegraph-1.webp)

Then, you can:

1. Enter a name. Note that it is recommended to use title case for the name (i.e., Subgraph Name Chain Name); the name cannot be changed once it has been created
2. Click **Create Subgraph**

![Enter a name for your subgraph](/images/builders/integrations/indexers/the-graph/thegraph-2.webp)

You will then land on your subgraph's page. Here, you can add additional information about your subgraph, such as the description, source code URL, website URL, and categories your subgraph belongs to. You'll also find all the CLI commands you need to initialize and deploy your subgraph.

![The landing page for your subgraph](/images/builders/integrations/indexers/the-graph/thegraph-3.webp)

### Install Graph CLI⁠ {: #install-graph-cli }

To install Graph CLI on your local machine, run the following:

=== "npm"

    ```bash
    npm install -g @graphprotocol/graph-cli
    ```

=== "yarn"

    ```bash
    yarn global add @graphprotocol/graph-cli
    ```

### Initialize Your Subgraph⁠ {: #initialize-your-subgraph }

Before you initialize your subgraph, you should verify the contract address from which you want to query data on Moonscan. This is so the Graph CLI can pull in the ABI directly from Moonscan for you. To learn how to verify your contracts, please refer to the [Verify Contracts](/builders/ethereum/verify-contracts/){target=\_blank} section of the docs.

You'll need to grab the initialization command from your subgraph's page on Subgraph Studio to initialize your subgraph. Or, if you know the name of your subgraph, you can use the following command:

```bash
graph init INSERT_SUBGRAPH_NAME
```

To initialize your subgraph, you'll need to provide some additional information, which you will be prompted to provide in your terminal:

1. For **Protocol**, select **ethereum**, as Moonbeam is an Ethereum-compatible chain
2. Hit enter for **Subgraph slug** to use the default one provided, or change as needed
3. Again, hit enter for **Directory to create the subgraph in** to use the default one provided, or change as needed
4. For **Ethereum network**, scroll down and select the Moonbeam network you are working with. Note that the Moonbase Alpha TestNet is labeled as **mbase**
5. Enter the contract address to index and query data from. The CLI will attempt to fetch the ABI from Moonscan. If it doesn't work, make sure that your contract has been verified and retry if needed. Otherwise, you will need to input it manually as a JSON file after your project has been successfully created. If you don't have a smart contract in mind and want to follow along with the tutorial, you can use the EXR contract address: 
```
0x515e20e6275CEeFe19221FC53e77E38cc32b80Fb
```
6. Enter a start block. The start block allows you to save time by only indexing the necessary blocks. To get all of the data for this contract, you can use the block the contract was deployed
7. **Contract Name** should be automatically populated for you, but if not, manually enter the name of the contract
8. For **Index contract events as entities**, it is recommended to set this to **true**, as it will automatically add mappings to your subgraph for every event emitted. In other words, you'll be able to capture and store the data emitted by these events

The CLI will generate your project for you, and you can continue to add additional contracts as needed.

--8<-- 'code/builders/integrations/indexers/thegraph/terminal/create-subgraph.md'

Your project will be created using the slug name you provided in step two. At this time, you can feel free to check out the project and modify the logic as needed for your project. For more information on how to write a subgraph, check out [The Graph's documentation](https://thegraph.com/docs/en/developing/creating-a-subgraph/){target=\_blank}. Note that for this quick start example, if you selected to index contract events as entities, you don't need to modify anything; you can deploy the project as is.

## Deploy a Subgraph {: #deploy }

To deploy your subgraph to Subgraph Studio, change to the subgraph directory in your terminal and run the following commands:

1. Generate types for your smart contract ABIs and the subgraph schema

    ```bash
    graph codegen
    ```

    --8<-- 'code/builders/integrations/indexers/thegraph/terminal/graph-codegen.md'

2. Compile your subgraph to Wasm

    ```bash
    graph build
    ```

    --8<-- 'code/builders/integrations/indexers/thegraph/terminal/graph-build.md'

3. Authenticate your subgraph with your deploy key. The exact command containing the deploy key can be found on your subgraph's page in Subgraph Studio

    ```bash
    graph auth INSERT_DEPLOY_KEY
    ```

    --8<-- 'code/builders/integrations/indexers/thegraph/terminal/graph-auth.md'

4. Deploy your subgraph and specify the slug for it. Again, you can get the exact command from your subgraph's page in Subgraph Studio

    ```bash
    graph deploy INSERT_SUBGRAPH_SLUG
    ```

    You will be asked for a version label. You can enter something like v0.0.1, but you're free to choose the format

    --8<-- 'code/builders/integrations/indexers/thegraph/terminal/graph-deploy.md'

Once you've successfully deployed your subgraph, you can query it using the subgraph endpoint that was printed to your terminal.

### Test Your Subgraph⁠ {: #test-your-subgraph }

You can test your subgraph by making a query in the **Playground** section of your subgraph's page on Subgraph Studio.

![The playground page for your subgraph](/images/builders/integrations/indexers/the-graph/thegraph-4.webp)

To test from your dApp, you can use the API endpoint that was printed to your terminal. You can also find the endpoint on your subgraph's page in Subgraph Studio under the **Details** tab.

![The playground page for your subgraph](/images/builders/integrations/indexers/the-graph/thegraph-5.webp)

You can use the following example code to query your subgraph. First, you'll need to install [Axios](https://axios-http.com/docs/intro){target=\_blank}:

=== "npm"

    ```bash
    npm install axios
    ```

=== "yarn"

    ```bash
    yarn add axios
    ```

Then, use the code snippet below. Be sure to insert your own query and endpoint:

```js
--8<-- 'code/builders/integrations/indexers/thegraph/example-query.js'
```

### Publish Your Subgraph to The Graph's Decentralized Network {: #publish-your-subgraph }

Once your subgraph is ready for production, you can publish it to the decentralized network.

!!! note
    Publishing requires Arbitrum ETH. When upgrading your subgraph, a small amount is airdropped to facilitate your initial protocol interactions.

For publishing instructions, please refer to [The Graph's documentation](https://thegraph.com/docs/en/publishing/publishing-a-subgraph/){target=\_blank}.

### Additional Resources {: #additional-resources }

- To explore all the ways you can optimize and customize your subgraph for better performance, read more about [creating a subgraph](https://thegraph.com/docs/en/developing/creating-a-subgraph/){target=\_blank}
- For more information on querying data from your subgraph, check out the [Querying the Graph](https://thegraph.com/docs/en/querying/querying-the-graph/){target=\_blank} guide

--8<-- 'text/_disclaimers/third-party-content.md'
