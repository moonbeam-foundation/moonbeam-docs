---
title: Cross-Chain via Wormhole
description: Learn how to bridge assets, set up a relayer, and other ways you can connect your Moonbeam DApp to assets and functions on multiple blockchains using Wormhole.
---

# Wormhole Network

## Introduction

[Wormhole](https://wormhole.com/){target=\_blank} is a protocol that validates and secures cross-chain communication for Web3, through messages known as verifiable action approvals (VAAs). Wormhole's infrastructure enables dApp users to interact with any asset or application, on any connected chain, with one click. Powered by a multi-signature schemed protocol and 19 signing [Guardians](https://docs.wormhole.com/wormhole/explore-wormhole/guardian/){target=\_blank}, Wormhole allows dApps to pass arbitrary messages across chains.

Wormhole consists of multiple modular swap-in components that can be leveraged independently and supports an increasing number of composable applications built by numerous teams. Building xDapps on top of their protocol allows for quick cross-chain asset transfers and cross-chain logic to deliver maximal Web3 interoperability. Wormhole's architecture includes a signing Guardian network, bridging smart contracts, and relayers. Take a look at the tech stack diagram for more details.

![Wormhole Technology Stack diagram](/images/builders/interoperability/protocols/wormhole/wormhole-1.webp)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Getting Started {: #getting-started }

There are a couple of resources to get you started building cross-chain applications with Wormhole:

- **[Developer documentation](https://docs.wormhole.com/wormhole/){target=\_blank}** - for technical guides
- **[Portal](https://www.portalbridge.com/#/transfer){target=\_blank}** - a bridging UI used to transfer assets across chains

## Contracts {: #contracts }

See the list of Wormhole contracts deployed to Moonbeam, and the networks connected to Moonbeam through Wormhole.

- **MainNet Contracts** - [Moonbeam](https://docs.wormhole.com/wormhole/blockchain-environments/evm#moonbeam){target=\_blank}
- **TestNet Contracts** - [Moonbase Alpha](https://docs.wormhole.com/wormhole/blockchain-environments/evm#testnet-contracts-moonbase-alphanet-1287){target=\_blank}

## Setting up a Specialized Relayer With the Relayer Engine {: #setting-up-a-specialized-relayer-with-the-relayer-engine }

In this section, you will deploy a basic Wormhole connected smart contract and spin up a specialized relayer to send messages across chains.

First, some context. VAAs, or verifiable action approvals, are Wormhole’s version of validated cross-chain messages. If 13 out of Wormhole's 19 signing Guardians validate a particular message, the message becomes approved and can be received on other chains. Adjacent to the guardian network (which act as the validators of Wormhole’s protocol) are the network spies. They don’t do any validation work. Instead, they watch the guardian network and act as an interface to allow users and applications to see what VAAs have been approved.

The relayer’s role is to pay for the destination chain’s execution, and in many protocols, in turn a relayer is paid by the user. Wormhole does not have general relayers available yet, so Wormhole’s architecture requires dApp developers to create and maintain their own specialized relayers (instead of having a relayer that can execute for many different smart contracts). A developer would have to design their own system if they wished to have the contract caller pay for gas on the destination chain. This might seem like a greater amount of work, but it allows for more fine-tuning of how messages are handled. For example, a relayer could send the same message to multiple chains at the same time, known as multicasting.

### Checking Prerequisites {: #checking-prerequisites }

To follow along with this tutorial, you will need to have:

- [MetaMask installed and connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
- [Docker installed](https://docs.docker.com/get-docker/){target=\_blank}
- Have an account be funded with `DEV` tokens.
 --8<-- 'text/_common/faucet/faucet-list-item.md'
- Have the same account be funded with native currency from a Wormhole connected EVM of your choice. Faucets [are in the table below](#deploying-the-wormhole-contract-with-remix-on-moonbase-alpha)

### Deploying the Wormhole Contract with Remix on Moonbase Alpha {:deploying-the-wormhole-contract-with-remix-on-moonbase-alpha}

To send a cross-chain message, in this guide, you will need to deploy and use a smart contract. Every chain connected to Wormhole will have some sort of implementation of the [Wormhole core bridge](https://github.com/wormhole-foundation/wormhole/blob/main/ethereum/contracts/interfaces/IWormhole.sol){target=\_blank}, whose purpose is to publish and verify VAAs. Each implementation of the core bridge contract (one per chain) is watched by every guardian in the guardian network, which is how they know when to start validating a message.  

Unlike other cross-chain protocols, Wormhole doesn’t provide a parent smart contract to inherit from for users to build off of. This is because Wormhole’s first chain, Solana, doesn’t have typical inheritance in their smart contracts like Solidity provides. To keep the design experience similar on each chain, Wormhole has their Solidity developers interact directly with the Wormhole core bridge smart contract on EVM chains.  

The [smart contract](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/SimpleGeneralMessage.sol){target=\_blank} that you will be deploying today is stored in a Git repository that is forked from Wormhole’s relayer engine repository. It sends a string from one chain to another, and stores strings when received through Wormhole's protocol. To deploy the script, either copy and paste the contract into Remix or open up this [Remix gist link](https://remix.ethereum.org/?gist=6aac8f954e245d6394f685af5d404b4b/){target=\_blank}.  

First things first, the code in this smart contract is based off of [Wormhole’s best practices documentation](https://docs.wormhole.com/wormhole/quick-start/cross-chain-dev/){target=\_blank}, but simplified in certain areas (like security). When writing a smart contract for production, review their documentation for a better understanding of standards. To be clear, **do not use the following smart contract in production**.  

1. Go to the **Solidity Compiler** tab
2. Press the **Compile** button
3. Then, go to the **Deploy & Run Transactions** tab of Remix
4. Set the environment to **Injected Web3**. This will use MetaMask as the Web3 provider. Ensure that your MetaMask is connected to the Moonbase Alpha network

![Set up smart contract deployment](/images/builders/interoperability/protocols/wormhole/wormhole-2.webp)

To deploy on each chain, you will need the local instance of the Wormhole core bridge and the chain ID of the chain mentioned. All of this data has been provided for a select few TestNets in the table below. You can find other networks’ endpoints on Wormhole’s [documentation site](https://docs.wormhole.com/wormhole/blockchain-environments/evm#testnet-contracts-moonbase-alphanet-1287){target=\_blank}. Keep in mind that you should only use EVMs for this demonstration, since the smart contract and relayer designed for this demonstration only supports EVMs.

|                           Network & Faucet                           |            Core Bridge Address             | Wormhole Chain ID |
|:--------------------------------------------------------------------:|:------------------------------------------:|:-----------------:|
| [Polygon Mumbai](https://faucet.polygon.technology/){target=\_blank} | 0x0CBE91CF822c73C2315FB05100C2F714765d5c20 |         5         |
|    [Avalanche Fuji](https://faucet.avax.network/){target=\_blank}    | 0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C |         6         |
|   [Fantom TestNet](https://faucet.fantom.network/){target=\_blank}   | 0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7 |        10         |
|       [Sepolia](https://www.sepoliafaucet.io/){target=\_blank}       | 0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78 |       10002       |
|  [Moonbase Alpha](https://faucet.moonbeam.network/){target=\_blank}  | 0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901 |        16         |

1. Ensure that the contract chosen is **SimpleGeneralMessage**
2. Open up the deploy menu with the arrow button
3. Input the relevant chain ID in the **_CHAINID** input
4. Input the relevant core bridge address in the **WORMHOLE_CORE_BRIDGE_ADDRESS** input
5. Press the **transact** button to start a deployment transaction
6. Press the **Confirm** button in MetaMask to deploy

Once the contract has been deployed on Moonbase Alpha make sure to copy down its address and repeat the process with one of any of the other [EVM TestNets](https://docs.wormhole.com/wormhole/blockchain-environments/evm/){target=\_blank} that are connected to Wormhole so that you can send a message across chains. Remember that you will have to change your network in MetaMask to deploy to the right network.

### Whitelisting Moonbase Alpha’s Connected Contract {:whitelisting-moonbase-alpha-connected-contract}

At this point, you should have the same smart contracts deployed twice. One on Moonbase Alpha, and another on another EVM chain.  

Wormhole recommends including a whitelisting system in their connected contracts, which you will have to use in `SimpleGeneralMessage` before attempting to send a cross-chain message.

To add a whitelisted contract, you must invoke the `addTrustedAddress(bytes32 sender, uint16 _chainId)` function, which requires a *bytes32* formatted address and a chain ID. You can find the chain ID in the [table above](#deploying-the-wormhole-contract-with-remix-on-moonbase-alpha) and on [Wormhole’s documentation](https://docs.wormhole.com/wormhole/blockchain-environments/evm/){target=\_blank}.

```solidity
function addTrustedAddress(bytes32 sender, uint16 _chainId) external {
    myTrustedContracts[sender][_chainId] = true;
}
```

Note that the `sender` parameter is a `bytes32` type instead of an `address` type. Wormhole’s VAAs provide emitter (origin) addresses in the form of `bytes32`, so they are stored and checked as `bytes32`. To convert an `address` type to `bytes32`, you will need to pad an additional 24 zeros. This is because an `address` value is 20 bytes, less than the 32 for `bytes32`. Every byte has 2 hexadecimal characters, so:

```text
zeros to add = (32 bytes - 20 bytes) * 2 hexadecimal characters
zeros to add = 24
```

For example, if your connected contract’s address was `0xaf108eF646c8214c9DD9C13CBC5fadf964Bbe293`, you would input the following into Remix:

```text
0x000000000000000000000000af108ef646c8214c9dd9c13cbc5fadf964bbe293
```

Now use Remix to ensure that your two connected contracts trust each other. You will have to do this on both contracts that you have deployed if you intend to send messages back and forth. To switch between contracts on different chains, connect to the destination network through MetaMask.

1. Make sure that you are in the **Injected** **Provider** environment
2. Ensure that you are on the right account
3. Also check that the contract is still **SimpleGeneralMessage**
4. Finally, take the address of the destination contract, and paste it into the **At Address** input

![At address](/images/builders/interoperability/protocols/wormhole/wormhole-4.webp)

To add trusted remote addresses:

1. Find the **addTrustedAddress** function within the deployed contract and open it
2. When you are on Moonbase Alpha, set the **sender** as the properly formatted (padded with 24 zeros) address of the contract you deployed on the other EVM TestNet
3. Set the **_chainId** as the Wormhole chain ID of the chain that the other contract is deployed on. Afterwards, transact and confirm in MetaMask

When you are on the alternate EVM TestNet, set the **sender** as the properly formatted (padded with 24 zeros) address of the contract you deployed on Moonbase Alpha. Set the **_chainId** as Moonbase Alpha’s Wormhole chain ID (16). Finally, transact and confirm in MetaMask.

![Add trusted address](/images/builders/interoperability/protocols/wormhole/wormhole-5.webp)

In this section you should have sent two transactions on two chains to whitelist addresses in both contracts. Afterwards, you should be allowed to send messages between the connected contracts.

### Running a Wormhole Guardian Network Spy {: #running-wormhole-guardian-spy }

Now you will run a TestNet relayer for Wormhole! This walkthrough is based off of Wormhole’s [relayer-engine](https://github.com/wormhole-foundation/relayer-engine/){target=\_blank} GitHub repository, which as of time of writing, is on commit [`cc0aad4`](https://github.com/wormhole-foundation/relayer-engine/commit/cc0aad43787a87ecd9f0d9893d8ccf92901d7adb/){target=\_blank}. It’s in relatively active development, which can cause great changes in the structure of the folders.

Clone the [fork of the relayer-engine](https://github.com/jboetticher/relayer-engine-docs-example/){target=\_blank} that has been prepared specifically for interacting with `SimpleGeneralMessage`. [Docker](https://docs.docker.com/get-docker/){target=\_blank} and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/){target=\_blank} are required to run this relayer, so be sure to install them to your device.  

First things first: the setup. Use the npm package manager to install dependencies (like ethers and the relayer engine itself) using the command line.  

```bash
npm install
cd plugins/simplegeneralmessage_plugin
npm install 
```

Once that’s finished, take a look around at the different folders. There are three folders: `src`, `relay-engine-config`, and `plugins`. The `src` folder contains the script that acts as the starting point for the entire application, so it includes setup. The `relay-engine-config` include JSON configuration files that are specific to the `SimpleGeneralMessage` smart contract. The `plugins` folder contains the plugin that has logic pertaining to relaying for the `SimpleGeneralMessage` smart contract.  

Before going into detail about how to run anything or how any of the plugin scripts work, you need to understand the different components of the relayer and what the relayer does.

The relayer filters and receives VAAs from the guardian network and does "something" with it. In this case, the relayer will filter messages approved by the Guardians that originate from your deployed connected contracts, then parse the VAA, then determine its destination, and finally attempt to execute a function called `processMyMessage(bytes32 VAA)` at the destination. It is important to understand that other relayers from other actors can receive this VAA and that other relayers can execute any VAA in any way they see fit.

From a technical standpoint, the implementation of this relayer has four parts.

1. A non-validating spy node that watches the Wormhole guardian network for all VAAs
2. A component known as a listener, which receives the output of the spy node, filters out which ones are relevant to the relayer, and packages them into workflow objects
3. A Redis database that stores the workflow objects that the listener outputs
4. A component known as an executor, which pops workflows off the database and processes them in some way (in this case, sends a transaction on the destination chain)

Starting from scratch, this can be a lot. Fortunately, Wormhole provides a `relayer-engine` package to help with the setup.

It’s best to tackle the configuration and setup of these four components in order, so start with the spy node. The spy node uses Docker, so ensure that Docker is active before attempting to start the node. The command to start the Docker container is long, so to simplify things, it has been added as an npm script to the repository's parent directory. Just run:

```bash
npm run testnet-spy
```

First, you should see a few logs from the startup of the Docker container. Then, a lot of logs should be spamming the console. These are all the VAAs that are going through the Wormhole TestNet, and there are a lot! Don’t worry, you won’t have to decipher any of these logs: the code can do that for you. Leave this running in the background and get another terminal instance to move on to the next step.

![Run the spy relayer](/images/builders/interoperability/protocols/wormhole/wormhole-6.webp)

### Setting up the Listener Component {:setting-up-the-listener-component}

Now to break down the custom code and configurable component of the relayer. The listener component, aptly named, listens to the spy node for relevant messages. To define what the relevant messages are, you must edit a config file.

In `plugins/simplegeneralmessage_plugin/config/devnet.json`, there exists an array named `spyServiceFilters`. Each object within this array whitelists a contract’s VAAs as relevant to the relayer. The object contains a `chainId` (a Wormhole chain ID) and an `emitterAddress`. For example, in the image below, the first object will watch for VAAs sent by `0x428097dCddCB00Ab65e63AB9bc56Bb48d106ECBE` on Moonbase Alpha (Wormhole chain ID is 16).

Be sure to edit the `spyServiceFilters` array so that the relayer listens to the two contracts that you deployed.

```json
"spyServiceFilters": [
    {
        "chainId": 16,
        "emitterAddress": "0x428097dCddCB00Ab65e63AB9bc56Bb48d106ECBE"
    },
    {
        "chainId": 10,
        "emitterAddress": "0x5017Fd40aeA8Ab94693bE41b3bE4e90F45860bA4"
    }
]
```

In the `simplegeneralmessage_plugin` folder, open up `src/plugin.ts`. This file contains plugin code for both the listener and executor components of the relayer, but the comments should make it obvious which functions are relevant to which component. Snippets of the file are shown below and you should be following along, but in case you aren’t, the entire file can be accessed in [its GitHub repository](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=\_blank}.

Look at the `getFilters()` function below. Notice something familiar? The `spyServiceFilters` object is injected into the plugin class that `getFilters()` is part of. Note that no filtering is being done, this is only the preparation of the filters. The actual filtering of VAAs occurs within the `relayer-engine` package, which uses this `getFilters()` function to understand what to filter.

If a developer wanted to add additional logic to the filters, they could here, but for your purposes, simply listing some hard-coded addresses is fine.

```ts
 // How the relayer injects the VAA filters.
 // This is the default implementation provided by the dummy plugin.
 getFilters(): ContractFilter[] {
   if (this.pluginConfig.spyServiceFilters) {
     return this.pluginConfig.spyServiceFilters;
   }
   this.logger.error('Contract filters not specified in config');
   throw new Error('Contract filters not specified in config');
 }
```

After filtering, the listener needs to write to the Redis database with workflow data in the `consumeEvent(vaa, stagingArea)` function below.

A workflow is just data that the executor needs from the listener to do a proper execution with. In this case, the only information that is being added to the workflow is the time at which the VAA was received and the parsed data in the VAA itself. If a developer wanted to add more relevant information to the workflow, they could do so in the `workflowData` object.

The `nextStagingArea` object is a way for consumed events (filtered VAAs) to affect each other. For example, if a developer wanted to package two VAAs together into one workflow, they wouldn’t return a `workflowData` every time.  

```ts
 // Receives VAAs and returns workflows.
  async consumeEvent(
    vaa: ParsedVaaWithBytes,
    stagingArea: StagingAreaKeyLock,
  ): Promise<
    | {
      workflowData: WorkflowPayload;
      workflowOptions?: WorkflowOptions;
    }
    | undefined
  > {
    this.logger.debug(`VAA hash: ${vaa.hash.toString('base64')}`);

    return {
      workflowData: {
        vaa: vaa.bytes.toString('base64'),
      },
    };
  }
```

That’s all that’s necessary for the listener component. Fortunately, most of the code is hidden from the user within the `relayer-engine` package.

If you recall the list of components, the third is the Redis database component. Most of the code that has to do with the database is hidden from the user, since the `relayer-engine` package will write & read from it, then inject any relevant data back into the plugin code. To run the Redis database, simply run the following command in the parent directory:  

```bash
npm run redis
```

### Setting up the Executor Component {: #setting-up-the-executor-component}

Finally, you must handle the executor component. Recall that the executor component takes workflow data from the Redis database and does some sort of execution action with that data. For most relayers, this execution will involve an on-chain transaction, since a relayer acts as a trustless oracle for VAAs.

The `relayer-engine` package helps handle the wallets for the plugin. Currently, the package only supports Solana and EVM wallets, but with further development more chains will be supported. But it’s not impossible to integrate NEAR or Algorand into the relayer, since you would just have to write your own wallet handling system in addition to the one already provided by the package.

To work with the built-in wallet handling system provided by the package, open the file at `relayer-engine-config/executor.json.example`. This example script is provided to show you how to format your private keys (the current key is provided by Wormhole).

Rename the example file to `executor.json`. In the `privateKeys` object of `executor.json`, replace the content of each array with your private key. The account of the private key entries will be the one that pays for execution fees in the relayer’s executor component.

Please manage your keys with care, as exposing them can result in loss of funds. While `executor.json` is ignored by git in this repository, please be sure that the wallet you are using for TestNet has no MainNet funds just to be safe.

```json
{
   "privateKeys": {
       "16": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "2": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "5": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "6": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],
       "10": [
           "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
       ],

   }
}
```

Remove any entries from the `privateKeys` object if their key belongs to a chain that you are not using.  

If you are using a chain that wasn’t listed in the EVM TestNet table above, you will have to add your own array. The key for this array should be the Wormhole chain ID of the other EVM that you chose to deploy on before. For example, if you deployed on the Fantom TestNet, you would add the following object, since the Wormhole chain ID of the Fantom TestNet is `10`.

```json
"10": [
    "INSERT_YOUR_PRIVATE_KEY"
]
```

Now that the wallets are sorted out for the executor, look at the code of the executor itself, which is in the `plugins/simplegeneralmessage_plugin/src/plugin.ts` file. If you haven’t been following along, the entire file can be accessed in [its GitHub repository](https://github.com/jboetticher/relayer-engine-docs-example/blob/main/plugins/simplegeneralmessage_plugin/src/plugin.ts){target=\_blank}.

The `handleWorkflow(workflow, providers, execute)` function is where all of the logic is, though there are some helper functions underneath it. This is the function that the `relayer-engine` package invokes when there is a workflow in the Redis database that’s to be used. Notice the three parameters that are injected into the function: `workflow`, `providers`, and `execute`.

- The `workflow` object provides the data that was stored in the database during the listener component’s execution of the `consumeEvent(vaa, stagingArea)` function. In this case, only the VAA and time it was received was stored in the database, which are stored in the local `payload` variable
- The `providers` object injects Ethers and other chains’ providers, which might be helpful for querying on-chain data or doing other blockchain related actions. As mentioned before, the only providers that are currently supported by the package are Solana and EVMs. The `providers` object isn’t used in this implementation
- The `execute` object currently has two functions in it: `onEVM(options)` and `onSolana(options)`. These functions require a Wormhole chain ID and a callback function that has a wallet object injected into it. The wallet included is based off of the private key that was configured in the `executor.json` file

The first substantial thing this function does is parse the workflow object, then parse its VAA with some helper functions. Afterwards, it takes the parsed VAA payload, converts it into a hexadecimal format, and uses the Ethers utility to ABI-decode the payload into its separate values that were defined way-back-when in the smart contract.

With the data that was decoded by Ethers, it’s possible to figure out to which contract and which chain the payload is being sent to, since that data was packaged into the message. The function checks if the specified destination chain ID belongs to an EVM, and will execute using the `execute.onEVM(options)` function mentioned before. Otherwise, it logs an error since this system doesn’t expect to interact with non-EVM chains for simplicity.

```ts
// Consumes a workflow for execution
async handleWorkflow(
  workflow: Workflow,
  providers: Providers,
  execute: ActionExecutor
): Promise<void> {
  this.logger.info(`Workflow ${workflow.id} received...`);

  const { vaa } = this.parseWorkflowPayload(workflow);
  const parsed = wh.parseVaa(vaa);
  this.logger.info(`Parsed VAA. seq: ${parsed.sequence}`);

  // Here we are parsing the payload so that we can send it to the right recipient
  const hexPayload = parsed.payload.toString('hex');
  let [recipient, destID, sender, message] =
    ethers.utils.defaultAbiCoder.decode(
      ['bytes32', 'uint16', 'bytes32', 'string'],
      '0x' + hexPayload
    );
  recipient = this.formatAddress(recipient);
  sender = this.formatAddress(sender);
  const destChainID = destID as ChainId;
  this.logger.info(
    `VAA: ${sender} sent "${message}" to ${recipient} on chain ${destID}.`
  );

  // Execution logic
  if (wh.isEVMChain(destChainID)) {
    // This is where you do all of the EVM execution.
    // Add your own private wallet for the executor to inject in 
    // relayer-engine-config/executor.json
    await execute.onEVM({
      chainId: destChainID,
      f: async (wallet, chainId) => {
        const contract = new ethers.Contract(recipient, abi, wallet.wallet);
        const result = await contract.processMyMessage(vaa);
        this.logger.info(result);
      },
    });
  } else {
    // The relayer plugin has a built-in Solana wallet handler, which you could use
    // here. NEAR & Algorand are supported by Wormhole, but they're not supported by
    // the relayer plugin. If you want to interact with NEAR or Algorand you'd have
    // to make your own wallet management system, that's all
    this.logger.error(
      'Requested chainID is not an EVM chain, which is currently unsupported.'
    );
  }
};
```

In the callback function, it creates a [contract object](https://docs.ethers.org/v6/api/contract/#Contract){target=\_blank} with the Ethers package. The ABI that it imports is exported from the `SimpleGeneralMessage` contract’s compilation, so this code is assuming that the recipient of the message specified in the VAA is or inherits from a `SimpleGeneralMessage` contract.

Then, the code attempts to execute the `processMyMessage(bytes32 VAA)` function with the VAA, which was previously defined as the function that messages are relayed to. Recall that this function name was arbitrarily chosen for the smart contract because the relayer could specify any function to call. That freedom is expressed in the ability for a developer to change this relayer’s code!

```ts
await execute.onEVM({
  chainId: destChainID,
  f: async (wallet, chainId) => {
    const contract = new ethers.Contract(recipient, abi, wallet.wallet);
    const result = await contract.processMyMessage(vaa);
    this.logger.info(result);
  },
});
```

The final piece is to check `relayer-engine-config/common.json`. This config file controls the execution of the entire relayer. Ensure that the TestNet EVMs that you are using are listed within the `supportedChains` object of this file. The plugin will not run properly if it’s not listed. If a chain that you are using is not listed, you will have to import the data from [Wormhole’s developer documentation](https://docs.wormhole.com/wormhole/blockchain-environments/evm/){target=\_blank} into the config file in a format like below.

There are also additional configurations for the relayer. For example, the `mode` string is set to `"BOTH"` to ensure that both the listener and executor plugins are used, but a developer could decide to run only one if they wanted. Additionally, there are multiple log levels to specify, such as `"error"` for just error messages. For this demo, however, just leave the configuration settings as is.

```json
 "mode": "BOTH",
 "logLevel": "debug",
 ...
    {
        "chainId": 16,
        "chainName": "Moonbase Alpha",
        "nodeUrl": "https://rpc.api.moonbase.moonbeam.network",
        "bridgeAddress": "0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901",
        "tokenBridgeAddress": "0xbc976D4b9D57E57c3cA52e1Fd136C45FF7955A96"
    },
```

That’s it for the configuration! Now to run it. In your terminal instance (one that isn’t running the spy node), navigate to the parent folder. Run the following command:

```bash
npm run start
```

You should see something similar to the logs below in the console.

![Run the relayer](/images/builders/interoperability/protocols/wormhole/wormhole-7.webp)

### Sending a Cross-Chain Message from Moonbase with Wormhole {: #send-message-from-moonbase }

Now, to send a cross-chain message, you just need to call the `sendMessage(string memory message, address destAddress, uint16 destChainId)` function.

Use the Remix interface. This example is going to send a cross-chain message to the Fantom TestNet, but you can substitute the `destChainId` for whichever EVM you desire. Check the following things:

1. The environment is **Injected Provider** on network 1287 (Moonbase Alpha)
2. You have substantial funds in your wallet from [the faucet](https://faucet.moonbeam.network/){target=\_blank} to cover the transaction gas cost on both the origin and destination chains
3. Put a short message of your choice in the **message** input of the **sendMessage** section (in this case, "this is a message")
4. Put the address of your instance of SimpleGeneralMessage on destination chain in the **destAddress** input
5. Put the destination chain’s Wormhole chain ID in the **destChainId** input of the **sendMessage** section
6. Once this is all done, transact the execution and confirm it in MetaMask

![Send a transaction](/images/builders/interoperability/protocols/wormhole/wormhole-8.webp)

After a few seconds to a minute, cross-chain messages should be properly relayed through the relayer that you are hosting on your local machine.  

![Message relay in the logs](/images/builders/interoperability/protocols/wormhole/wormhole-9.webp)

## Moonbeam Routed Liquidity Integration {: #moonbeam-routed-liquidity-integration }

Wormhole will provide liquidity to parachains through the Moonbeam Routed Liquidity (MRL) program. This program allows one-click transfers of liquidity from Wormhole connected chains into parachain wallets by sending liquidity through Moonbeam networks.  

[MRL](/builders/interoperability/mrl/){target=\_blank} utilizes the [GMP Precompile](/builders/pallets-precompiles/precompiles/gmp/){target=\_blank}, whose documentation explains how cross-chain messages should be constructed to properly use the precompile.

--8<-- 'text/_disclaimers/third-party-content.md'
