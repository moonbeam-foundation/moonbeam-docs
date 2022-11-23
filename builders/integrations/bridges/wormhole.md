---
title: Cross-Chain Via Wormhole
description: Learn how to bridge assets, set up a relayer, and other ways you can connect your Moonbeam dApp to assets and functions on multiple blockchains using Wormhole.
---

# Wormhole Network

insert banner image

## Introduction

Wormhole is a protocol that validates and secures cross-chain communication for Web3, through VAAs. Wormhole's infrastructure enables dApp users to interact with any asset or application, on any connected chain, with one click. Powered by a multi-signature schemed protocol and 19 signing guardians, Wormhole  allows dApps to pass arbitrary messages across chains.

Wormhole consists of multiple modular swap-in components that can be leveraged independently and supports an increasing number of composable applications built by numerous teams. Building xDapps on top of their protocol allows for quick cross-chain asset transfers and cross-chain logic to deliver maximal Web3 interoperability. Wormhole's architecture includes a signing Guardian network, bridging smart contracts, and relayers. Take a look at the Tech Stack Diagram for more details.

![Wormhole Technology Stack diagram](/images/builders/integrations/bridges/wormhole/wormhole-1.png)

--8<-- 'text/disclaimers/third-party-content-intro.md'

## Getting Started {: #getting-started }

There are a couple of resources to get you started building cross-chain applications with Axelar:

- **[Developer documentation](https://book.wormhole.com/introduction/introduction.html){target=_blank}** - for technical guides
- **[Portal](https://www.portalbridge.com/#/transfer){target=_blank}** - a bridging UI used to transfer assets across chains

## Contracts {: #contracts }

See the list of Wormhole contracts deployed to Moonbeam, and the networks connected to Moonbeam through Wormhole.

- **MainNet Contracts** - [Moonbeam](https://book.wormhole.com/reference/contracts.html#mainnet){target=_blank}

- **TestNet Contracts** - [Moonbase Alpha](https://book.wormhole.com/reference/contracts.html#testnet){target=_blank}

## Setting up a Specialized Relayer With the Relayer Engine {: #setting-up-a-specialized-relayer-with-the-relayer-engine }

vvv Put this stuff in the relayer section vvv

VAAs, or verifiable action approvals, are Wormhole’s version of validated cross-chain messages. If 13 out of Wormhole's 19 signing guardians validate a particular message, the message becomes approved and can be received on other chains. Adjacent to the guardian network (which act as the validators of Wormhole’s protocol) are the network spies. They don’t do any validation work. Instead, they watch the guardian network and act as an interface to allow users and applications to see what VAAs have been approved.

The relayer’s role is to pay for the destination chain’s execution, and in many general relayers, in turn the relayer is paid by the user. Wormhole does not have this available yet, so instead Wormhole’s architecture requires dApp developers to create and maintain their own specialized relayers. A developer would have to design their own system if they wished to have the contract caller pay for gas on the destination chain. This might seem like a greater amount of work, but it allows for more fine-tuning of how messages are handled. For example, a relayer could send the same message to multiple chains at the same time.




Image from [Wormhole](https://wormhole.com/)

To send a cross-chain message, you will need to use a smart contract. Every chain connected to Wormhole will have some sort of implementation of the [Wormhole core bridge](https://github.com/wormhole-foundation/wormhole/blob/dev.v2/ethereum/contracts/interfaces/IWormhole.sol), whose purpose is to publish and verify VAAs. Each implementation of the core bridge contract (one per chain) is watched by every guardian in the guardian network, which is how they know when to start validating a message.

You as a developer will interact directly with the core wormhole smart contract by both sending and validating VAAs. You will also have to run a non-validating spy node and a specialized relayer. Don’t worry though, this blog will take you through it step by step to make it as understandable as possible.


## Connected _SimpleGeneralMessage _Contract

Unlike other cross-chain protocols, Wormhole doesn’t provide a parent smart contract to inherit from for users to build off of. This is because Wormhole’s first chain, Solana, doesn’t have typical inheritance in their smart contracts like Solidity provides. To keep the design experience similar on each chain, Wormhole has their solidity developers interact directly with the Wormhole core bridge smart contract on EVM chains.

The [smart contract](https://github.com/jboetticher/relayer-engine/blob/main/SimpleGeneralMessage.sol) that you will be deploying today is stored in a Git repository that is forked from Wormhole’s relayer engine repository. You will deploy it with Remix, and the contract can be automatically accessed with [this Remix link](https://remix.ethereum.org/?#gist=6aac8f954e245d6394f685af5d404b4b&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.17+commit.8df45f5f.js).

First things first, the code in this smart contract is based off of [Wormhole’s best practices documentation](https://book.wormhole.com/technical/evm/bestPractices.html), but simplified in certain areas (like security). When writing a smart contract for production, review their documentation for a better understanding of standards. To be clear, **do not use the following smart contract in production**. For today’s demonstration purposes, however, you’re aiming to simply get the system to work.


### Sending VAAs

Take a look at the message sending portion of the smart contract in either the source file or the pictures below. The external facing _sendMessage_ function includes three parameters: the message string, the destination address, and a destination chainId. The _destChainId_ value to blockchain mapping can be found in [Wormhole’s documentation](https://book.wormhole.com/reference/contracts.html).

Note that the destination address is an address type, and not a bytes32 type. This is significant because chains like NEAR, Algorand, and Solana use bytes32 addresses, which are larger. The _SimpleGeneralMessage_ smart contract uses the address type because previous blog posts also used this type, but if you were to build your own dApp it is recommended to use a bytes32 address input so that you can communicate with non-EVM blockchains.

The function itself has two lines. The first invokes a private function that will interact with the Wormhole core bridge. The reason this functionality is segregated from the _sendMessage_ function is that Wormhole has a convention to return a sequence value from all message-publishing functions. The sequence value represents the number of times that a Wormhole message has been sent from a smart contract. For example, the first message sent will return 0, then the second message will return 1, and so on. This value can be helpful for receiving messages in order, but is out of scope for this blog post.

The second line increases the global nonce (number used once) value. Nonces can be reused to batch VAAs together, but that is also out of scope for this blog post. In this case, each message will have a unique nonce value just for good practice to ensure that the nonce is, in fact, a nonce. Though you could leave the nonce as 0 for all messages and the system would still work.


```
   // Public facing function to send a message across chains
   function sendMessage(
       string memory message,
       address destAddress,
       uint16 destChainId
   ) external payable {
       // Wormhole recommends that message-publishing functions should return their sequence
       _sendMessageToRecipient(destAddress, destChainId, message, nonce);
       nonce++;
   }
```


Continuing our break-down of message sending, take a look at the private function called by the _sendMessage_ function, __sendMessageToRecipient_, which is shown below. The first line of code encodes data into a bytes payload. It encodes the address of the recipient, the chainId that the message should be sent to, the sender of the message, and the message itself. This information will be important for both the relayer and the destination connected contract to parse.

The second line of code interacts with the Wormhole core bridge contract to publish a message. Note that the inputs include a nonce, a payload, and a consistency level value. The nonce value was injected from _sendMessage_, and isn’t useful for this scenario. The payload is what was encoded in the previous line of code. The consistency level controls how many blocks since the transaction originally occurred the guardian network should wait before the message begins the validation process. This can be helpful for security reasons, as some blocks have slower finality than others, like Ethereum. For testing, however, 1 should be enough.


```
   // This function defines a super simple Wormhole 'module'.
   // A module is just a piece of code which knows how to emit a composable message
   // which can be utilized by other contracts.
   function _sendMessageToRecipient(
       address recipient,
       uint16 _chainId,
       string memory message,
       uint32 _nonce
   ) private returns (uint64) {
       bytes memory payload = abi.encode(
           recipient,
           _chainId,
           msg.sender,
           message
       );

       // 1 is the consistency level, this message will be emitted after only 1 block
       uint64 sequence = core_bridge.publishMessage(_nonce, payload, 1);
       return sequence;
   }
```


That’s it for sending the message. If you have experimented with other connected contract protocols, then you might notice that there is no method of paying for the destination chain’s transaction with the origin chain’s currency. That is because in protocols where that is possible, the relayer is managed by the protocol. The relayer pays for the destination chain’s execution, and in turn the relayer is paid by the user. In this case, however, you will be running your own relayer. You would have to design your own system if you wished to have the contract caller pay for gas on the destination chain.

Moving forward, look at how the _SimpleGeneralMessage_ smart contract receives a VAA.


### Receiving VAAs

Wormhole recommends some sort of whitelisting of VAA emitters, so the function that receives a VAA will check for trusted addresses. To add trusted addresses, _SimpleGeneralMessage_ includes the helper function _addTrustedAddress_. In a production environment, this helper function should also check to see if the caller has permission to add a trusted address (such as using OpenZeppelin’s _onlyOwner_ modifier), but for a testnet, this is as far as you’ll go with security.


```
// TODO: A production app would add onlyOwner security, but this is for testing.
   function addTrustedAddress(bytes32 sender, uint16 _chainId) external {
       myTrustedContracts[sender][_chainId] = true;
   }
```


Now into the thick of things. _processMyMessage_ (seen below) is how _SimpleGeneralMessage_ receives VAAs. This name was chosen arbitrarily, since the custom relayer will be able to call any function with any name. In other connected contract protocols, where a public generic relayer handles the destination chain’s execution, a specifically named external facing function is often required. But since Wormhole dApp developers run their own specialized relayer, the receiving function can be whatever the developer wants.

The only parameter that _processMyMessage_ takes in is a bytes object called VAA. Developers won’t have to manually create the VAA object, since Wormhole largely automatically does it. The VAA has a lot of information packed into it, which gets decoded into a _VM_ struct if valid. This struct can be viewed in its entirety in [Wormhole’s repository](https://github.com/wormhole-foundation/wormhole/blob/dev.v2/ethereum/contracts/interfaces/IWormhole.sol). 

This first line of code, with _core_bridge.parseAndVerifyVM_, has the Wormhole core bridge verify on-chain that the signatures included with the VAA are correct. It returns parsed data, a boolean to indicate success or failure, and a string to represent an error if it occurred. The second line of code reverts if the _parseAndVerifyVM_ function returns false for its boolean (VAA is not valid), and will display the reason for the failure.

The third line of code, the _require_ statement with _myTrustedContracts_, invokes the whitelisting functionality that was previously mentioned. Trusted contracts are stored in a nested map, and checking it against the VAA’s emitter will ensure that the emitter (the connected contract on the origin chain) is trusted.

The fourth line of code, another _require_ statement with _processedMessages_, checks to ensure that the VAA has not already been processed. Remember that VAAs can be picked up by anyone with a spy node, and if there are multiple relayers that are looking to do the same thing, then the message will attempt to be processed multiple times. You’ll see later (line eight) that the _processMyMessage_ function will write to _processedMessages_ with a VAA hash to make sure that the message its processing won’t be processed more than once.

The fifth line of code with _abi.decode_ decodes the payload into four values so that the message can be stored. Note that it was decoded in the same way that it was encoded.

The sixth line of code, a _require_ statement with _intendedRecipient_, checks to make sure that the _intendedRecipient_ of the message, which was included in the payload, is the same address as this smart contract. Cross-chain messages sent through the Wormhole protocol are only verified to occur. It does not verify if a message is meant to be sent to one or more specific contracts. This is why the contract must check manually if incoming messages are intended for it. Along similar lines, the seventh line of code checks to ensure that the message is sent to the right chain.

The eighth line of code, which adds to the _processedMessages_ map, writes to a map within the smart contract to ensure that the same message doesn’t get parsed twice (told you that you’d see it later). The message hasn’t been completely processed at this point, but it might be better to finish this step lest a complex interaction (for contracts more important than this) further along the line leads to a reentrancy attack.

Finally, on the ninth line with _lastMessage_, at long last, the string that was sent from the origin chain to the destination chain is written to the smart contract.


```
   // Verification accepts a single VAA, and is publicly callable.
   function processMyMessage(bytes memory VAA) public {
       // This call accepts single VAAs and headless VAAs
       (IWormhole.VM memory vm, bool valid, string memory reason) = 
           core_bridge.parseAndVerifyVM(VAA);

       // Ensure core contract verifies the VAA
       require(valid, reason);

       // Ensure the emitterAddress of this VAA is a trusted address
       require(
           myTrustedContracts[vm.emitterAddress][vm.emitterChainId],
           "Invalid emitter address!"
       );

       // Check that the VAA hasn't already been processed (replay protection)
       require(!processedMessages[vm.hash], "Message already processed");

       // Parse intended data
       // You could attempt to parse the sender from the bytes32 but that's hard. 
       // (hence why address was included in the payload)
       (
           address intendedRecipient,
           uint16 _chainId,
           address sender,
           string memory message
       ) = abi.decode(vm.payload, (address, uint16, address, string));

       // Check that the contract which is processing this VAA is the intendedRecipient
       // If the two aren't equal, this VAA may have bypassed its intended entrypoint.
       // This exploit is referred to as 'scooping'.
       require(
           intendedRecipient == address(this),
           "Not the intended receipient!"
       );

       // Check that the contract that is processing this VAA is the intended chain.
       // By default, a message is accessible by all chains, 
       // so we have to define a destination chain & check for it.
       require(_chainId == chainId, "Not the intended chain!");

       // Add the VAA to processed messages so it can't be replayed
       processedMessages[vm.hash] = true;

       // The message content can now be trusted, slap into messages
       lastMessage[sender] = message;
   }
```


You might want to take a bit of a breather, but soon you will deploy the contract! Doing is the best way to learn, so try to follow along with the deployment and message passing yourself on Moonbase Alpha. 


## Deploying the Wormhole Contract with Remix on Moonbase Alpha

The easiest way to deploy the single demo contract is [through Remix](https://docs.moonbeam.network/builders/build/eth-api/dev-env/remix/). You’ll need DEV to deploy on Moonbase Alpha, which you can get from [our faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/) if you don’t have any already.

To deploy the script, either copy and paste [the contract](https://gist.github.com/jboetticher/6aac8f954e245d6394f685af5d404b4b) into Remix or open up this [Remix gist link](https://remix.ethereum.org/?gist=6aac8f954e245d6394f685af5d404b4b). 



1. Then compile in the **Solidity Compiler** tab. Ensure that your MetaMask is connected to the Moonbase Alpha network
2. Then, go to the **Deploy & Run Transactions** tab of Remix 
3. Set the environment to **Injected Web3**. This will use MetaMask as the Web3 provider




image 3


To deploy on each chain, you will need the local instance of the Wormhole core bridge and the chain Id of the chain mentioned. All of this data has been provided for a select few TestNets in the table below. You can find other networks’ endpoints on Wormhole’s [documentation site](https://book.wormhole.com/reference/contracts.html#testnet). Keep in mind that you should only use EVMs for this demonstration, since the smart contract and relayer designed for this blog post only supports EVMs.

Once the contract has been deployed on Moonbase Alpha make sure to copy down its address and repeat the process with one of any of the other [EVM TestNets](https://layerzero.gitbook.io/docs/technical-reference/testnet/testnet-addresses) that are connected to Wormhole so that you can send a message across chains. 


<table>
  <tr>
   <td>Network & Faucet
   </td>
   <td>Wormhole Core Bridge
   </td>
   <td>Wormhole Chain ID
   </td>
  </tr>
  <tr>
   <td><a href="https://faucet.polygon.technology/">Polygon Mumbai</a>
   </td>
   <td>0x0CBE91CF822c73C2315FB05100C2F714765d5c20
   </td>
   <td>5
   </td>
  </tr>
  <tr>
   <td><a href="https://faucet.avax.network/">Avalanche Fuji</a>
   </td>
   <td>0x7bbcE28e64B3F8b84d876Ab298393c38ad7aac4C
   </td>
   <td>6
   </td>
  </tr>
  <tr>
   <td><a href="https://faucet.fantom.network/">Fantom</a>
   </td>
   <td>0x1BB3B4119b7BA9dfad76B0545fb3F531383c3bB7
   </td>
   <td>10
   </td>
  </tr>
  <tr>
   <td><a href="https://goerlifaucet.com/">Goerli</a>
   </td>
   <td>0x706abc4E45D419950511e474C7B9Ed348A4a716c
   </td>
   <td>2
   </td>
  </tr>
  <tr>
   <td><a href="https://docs.moonbeam.network/builders/get-started/networks/moonbase/#moonbase-alpha-faucet">Moonbase Alpha</a>
   </td>
   <td>0xa5B7D85a8f27dd7907dc8FdC21FA5657D5E2F901
   </td>
   <td>16
   </td>
  </tr>
</table>



### Whitelisting Moonbase Alpha’s Connected Contract

As previously mentioned, Wormhole recommends to include a whitelisting system in their connected contracts, which you will have to use in _SimpleGeneralMessage_ before attempting to send a cross-chain message.

Recall that to add a whitelisted contract, you must invoke the _addTrustedAddress_ function, which requires a _bytes32 _formatted address and a domain ID. You can find the domain ID in the table above and on [Wormhole’s documentation](https://book.wormhole.com/reference/contracts.html#testnet).


```
   function addTrustedAddress(bytes32 sender, uint16 _chainId) external {
       myTrustedContracts[sender][_chainId] = true;
   }
```


You might notice that the __router_ parameter is a _bytes32_ instead of an _address_. Even though this blog post only expects to work EVMs, Wormhole’s VAAs provide emitter (origin) addresses in the form of bytes32, so they are stored and checked as _bytes32_.

To convert an _address_ type to _bytes32_, you will need to pad an additional 24 zeros. This is because an _address_ value is 20 bytes, less than the 32 for _bytes32_. Every byte has 2 hexadecimal characters, so:

(32 bytes - 20 bytes) * 2 “0”s to add/byte = 24 “0s” to add

For example, if your connected contract’s address was _0xaf108eF646c8214c9DD9C13CBC5fadf964Bbe293_, you would input the following into Remix:

_0x000000000000000000000000af108ef646c8214c9dd9c13cbc5fadf964bbe293_

Now go ahead and use Remix to ensure that your two connected contracts trust each other. You will have to do this on both contracts that you have deployed if you intend to send messages back and forth. To switch between contracts on different chains, connect to the destination network through MetaMask. 



1. Make sure that you are in the **Injected** **Provider** environment
2. Ensure that you are on the right account
3. Also check that the contract is still **SimpleGeneralMessage**.
4. Finally, take the address of the destination contract, and paste it into the **At Address **input






image 4


To add trusted remote addresses: 



1. Find the _addTrustedAddress_ function within the deployed contract and open it. 
2. When you are on Moonbase Alpha, set the **sender** as the properly formatted (padded with 24 zeros) address of the contract you deployed on the other EVM TestNet. 
3. Set the **_chainId** as the Wormhole chainId of the chain that the other contract is deployed on. Afterwards, transact and confirm in MetaMask. 

When you are on the alternate EVM TestNet, set the **sender** as the properly formatted (padded with 24 zeros) address of the contract you deployed on Moonbase Alpha. Set the **_chainId** as the Moonbase Alpha’s Wormhole chainId (16). Finally, transact and confirm in MetaMask. 


### 



image 5


In this section you should have sent two transactions on two chains to whitelist addresses in both contracts. Afterwards, you should be allowed to send messages between the connected contracts.


## How to Run a Wormhole Testnet Relayer & Guardian Network Spy
This project will require you to [install Docker](https://docs.docker.com/get-docker/)

Now you will run a TestNet relayer for Wormhole! This walkthrough is based off of Wormhole’s [relayer-engine](https://github.com/wormhole-foundation/relayer-engine) Github repository, which as of time of writing, is on commit [dac6012](https://github.com/wormhole-foundation/relayer-engine/tree/dac6012cc7ed9c3ca79d911b47f39bfe9dd76a23). It’s in relatively active development, which can cause great changes in the structure of the folders. 

Clone the [fork of the relayer-engine](https://github.com/jboetticher/relayer-engine) that has been prepared specifically for interacting with SimpleGeneralMessage. [Docker](https://docs.docker.com/get-docker/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) are required to run this relayer, so be sure to install them to your device.

First things first: the setup. Use the npm package manager to install dependencies using the command line.


```
npm install
cd example-project
npm install
```


Once that’s finished, take a look around at the different folders. There are two main folders: _relayer-engine_ and _example-project_. The _relayer-engine_ includes the components that help run the relayer, whereas the _example-project_ folder contains the plugin scripts and configuration files that are specific to the _SimpleGeneralMessage_ smart contract. There’s also a _README.md_ file in the root directory, which will include additional information about the relayer and how to set it up.

But before going into detail about how to run anything or how any of the plugin scripts work, you need to understand the different components of the relayer and what the relayer does.

The relayer filters and receives VAAs from the guardian network and does “something” with it. In this case, the relayer will filter messages approved by the guardians that originate from your deployed connected contracts, then parse the VAA, then determine its destination, and finally attempt to execute a function called _processMyMessage_ at the destination. It is important to understand that other relayers from other actors can receive this VAA and that other relayers can execute any VAA in any way they see fit.

From a technical standpoint, the implementation of this relayer has four parts.



1. A non-validating spy node that watches the Wormhole guardian network for all VAAs
2. A component known as a listener, which receives the output of the spy node, filters out which ones are relevant to the relayer, and packages them into workflow objects
3. A Redis database that stores the workflow objects that the listener outputs
4. A component known as an executor, which pops workflows off the database and processes them in some way (in this case, sends a transaction on the destination chain)

There is a docker container that takes care of the spy node, which is easy to spin up. The _relayer-engine_ package, stored in the similarly named folder, contains much of the code for the listener and database portions. Much of the logic for the executor will depend on the plugin that the developer writes (which you cloned from the repo), but much of the boiler-plate code is still handled by the _relayer-engine_ package.

It’s best to tackle the configuration and setup of these four components in order, so start with the spy node. First, in the command line, make sure that you are in the _example-project_ directory. The spy node uses docker, so ensure that docker is active before attempting to start the node. The command to start the container is long, so to simplify things, it’s been added as an npm script. Just run:


```
npm run spy
```


First, you should see a few logs from the startup of the docker container. Then, a lot of logs should be spamming the console. These are all the VAAs that are going through the Wormhole testnet, and there are a lot! Don’t worry, you won’t have to decipher any of these logs: the code can do that for us. Leave this running in the background and get another terminal instance to move on to the next step.




image 6



### Listener Component

Now to break down the custom code and configurable component of the relayer. The listener component, aptly named, listens to the spy node for relevant messages. To define what the relevant messages are, you must edit a config file.

In _example-project/plugins/simplegeneralmessage_plugin/config/devnet.json_, there exists an array named _spyServiceFilters_. Each object within this array whitelists a contract’s VAAs as relevant to the relayer. The object takes in a _chainId _(Wormhole _chainId_) and an _emitterAddress_. For example, in the image below, the first object will watch for VAAs sent by 0x428097dCddCB00Ab65e63AB9bc56Bb48d106ECBE on Moonbase Alpha (Wormhole _chainId_ is 16).

Be sure to edit the _spyServiceFilters_ array so that the relayer listens to the two contracts that you deployed.


```
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


In the _simplegeneralmessage_plugin_ folder, open up _src/plugin.ts_. This file contains plugin code for both the listener and executor components of the relayer, but the comments should make it obvious which functions are relevant to which component. Snippets of the file are shown below and you should be following along, but in case you aren’t, the entire file can be accessed in [its Github repository](https://github.com/jboetticher/relayer-engine/blob/main/example-project/plugins/simplegeneralmessage_plugin/src/plugin.ts).

Look at the _getFilters_ function below. Notice something familiar? The _spyServiceFilters_ object is injected into the plugin class that the _getFilters_ is part of. Note that no filtering is being done, this is only the preparation of the filters. The actual filtering of VAAs occurs within the _relayer-engine_ package, which uses this _getFilters_ function to understand what to filter.

If a developer wanted to add additional logic to the filters, they could here, but for your purposes, simply listing some hard-coded addresses is fine.


```
 // How the relayer injects the VAA filters.
 // This is the default implementation provided by the dummy plugin.
 getFilters(): ContractFilter[] {
   if (this.pluginConfig.spyServiceFilters) {
     return this.pluginConfig.spyServiceFilters;
   }
   this.logger.error("Contract filters not specified in config");
   throw new Error("Contract filters not specified in config");
 }
```


After filtering, the listener needs to write to the Redis database with workflow data in the _consumeEvent_ function below. 

A workflow is just data that the executor needs from the listener to do a proper execution with. In this case, the only information that is being added to the workflow is the time at which the VAA was received and the parsed data in the VAA itself. If a developer wanted to add more relevant information to the workflow, they could do so in the _workflowData_ object. 

The _nextStagingArea_ object is a way for consumed events (filtered VAAs) to affect each other. For example, if a developer wanted to package two VAAs together into one workflow, they wouldn’t return a _workflowData_ every time. Instead, they would leave the VAA in the _nextStagingArea_ object. The next time an event is to be consumed, the _stagingArea_ object injected into the _consumeEvent_ function would have that previous VAA to work with. In this case, nothing special is happening, and the relayer just handles each workflow in order. 


```
 // Receives VAAs and returns workflows.
 // This is the default implementation provided by the dummy plugin.
 async consumeEvent(
   vaa: Buffer,
   stagingArea: { counter?: number }
 ): Promise<{ workflowData: WorkflowPayload; nextStagingArea: StagingArea }> {
   this.logger.debug("Parsing VAA...");
   const parsed = wh.parseVaa(vaa);
   this.logger.debug(`Parsed VAA: ${parsed && parsed.hash}`);
   return {
     workflowData: {
       time: new Date().getTime(),
       vaa: vaa.toString("base64"),
     },
     nextStagingArea: {
       counter: stagingArea?.counter ? stagingArea.counter + 1 : 0,
     },
   };
 }
```


That’s all that’s necessary for the listener component. Fortunately, most of the code is hidden from the user within the _relayer-engine_ package.

If you recall the list of components, the third is the Redis database component. Everything that has to do with the database is hidden from the user as well, since the _relayer-engine_ package will write & read from it, then inject any relevant data back into the plugin code. There’s nothing more that needs to be done for it, so feel free to take a break.


### Executor Component

Finally, you must handle the executor component. Recall that the executor component takes workflow data from the Redis database and does some sort of execution action with that data. For most relayers, this execution will involve an on-chain transaction, since a relayer acts as a trustless oracle for VAAs.

The _relayer-engine_ package helps handle the wallets for the plugin. Currently, the package only supports Solana and EVM wallets, but with further development more chains will be supported. But it’s not impossible to integrate NEAR or Algorand into the relayer, since you would just have to write your own wallet handling system in addition to the one already provided by the package.

To work with the built-in wallet handling system provided by the package, open the file at _example-project/relayer-engine-config/executor.json.example_. This example script is provided to show you how to format your private keys (the current key is provided by Wormhole). 

Rename the example file to _executor.json_. In the _privateKeys_ object of _executor.json_, replace the content of each array with your private key. The account of the private key entries will be the one that pays for execution fees in the relayer’s executor component.

Please manage your keys with care, as exposing them can result in loss of funds. While _executor.json_ is ignored by git in this repository, please be sure that the wallet you are using for testnet has no mainnet funds.


```
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


If you are using a chain that wasn’t listed in the EVM TestNet table above, you will have to add your own array. The key for this array should be the Wormhole _chainId_ of the other EVM that you chose to deploy on before. For example, if you deployed on the Fantom TestNet, you would add the following object, since the Wormhole _chainId_ of the Fantom TestNet is 10. 


```
       "10": [
           "YOUR PRIVATE KEY"
       ]
```


Now that the wallets are sorted out for the executor, look at the code of the executor itself, which is in the _example-project/plugins/simplegeneralmessage_plugin/src/plugin.ts_ file. If you haven’t been following along, the entire file can be accessed in [its Github repository](https://github.com/jboetticher/relayer-engine/blob/main/example-project/plugins/simplegeneralmessage_plugin/src/plugin.ts).

The _handleWorkflow _function is where all of the logic is, though there are some helper functions underneath it. This is the function that the _relayer-engine_ package invokes when there is a workflow in the Redis database that’s to be used. Notice the three parameters that are injected into the function: _workflow_, _providers_, and _execute_. 



* The _workflow_ object provides the data that was stored in the database during the listener component’s execution of the _consumeEvent_ function. In this case, only the VAA and time it was received was stored in the database, which are stored in the local _payload_ variable.
* The _providers_ object injects ethers and other chains’ providers, which might be helpful for querying on-chain data or doing other blockchain related actions. As mentioned before, the only providers that are currently supported by the package are Solana and EVMs. The _providers_ object isn’t used in this implementation.
* The _execute_ object currently has two functions in it: _onEVM_ and _onSolana_. These functions require a Wormhole chainId and a callback function that has a wallet object injected into it. The wallet included is based off of the private key that was configured in the _executor.json_ file.

The first substantial thing this function does is parse the payload object, then parse its VAA with some helper functions. Afterwards, it takes the payload, converts it into a hexadecimal format, and uses the ethers utility to ABI-decode the payload into its separate values that were defined way-back-when in the smart contract. 

With the data that was decoded by ethers, it’s possible to figure out to which contract and which chain the payload is being sent to, since that data was packaged into the message. The function checks if the specified destination chainID belongs to an EVM, and will execute using the _execute.onEVM_ function mentioned before. Otherwise, it logs an error since this system doesn’t expect to interact with non-EVM chains for simplicity.


```
 // Consumes a workflow for execution
 async handleWorkflow(
   workflow: Workflow,
   providers: Providers,
   execute: ActionExecutor
 ): Promise<void> {
   this.logger.info("Workflow received...");
   this.logger.debug(JSON.stringify(workflow, undefined, 2));

   const payload = this.parseWorkflowPayload(workflow);
   const parsed = wh.parseVaa(payload.vaa);
   this.logger.info(`Parsed VAA. seq: ${parsed.sequence}`);

   // Here we are parsing the payload so that we can send it to the right recipient
   const hexPayload = parsed.payload.toString("hex");
   let [recipient, destID, sender, message] = ethers.utils.defaultAbiCoder.decode(
["bytes32", "uint16", "bytes32", "string"], "0x" + hexPayload
   );
   recipient = this.formatAddress(recipient);
   sender = this.formatAddress(sender);
   const destChainID = destID as ChainId;
   this.logger.info(`VAA: ${sender} sent "${message}" to ${recipient} on chain ${destID}.`);

   // Execution logic
   if (isEVMChain(destChainID)) {
     // This is where you do all of the EVM execution.
     // Add your own private wallet for the executor to inject in executor.json
     await execute.onEVM({
       chainId: destChainID,
       f: async (wallet, chainId) => {
         const contract = new ethers.Contract(recipient, abi, wallet.wallet);
         const result = await contract.processMyMessage(payload.vaa);
         this.logger.info(result);
       },
     });
   }
   else {   
     this.logger.error("Requested chainID is not an EVM chain, which is unsupported.");
   }
 }
```


In the callback function, it creates a [contract object](https://docs.ethers.io/v5/api/contract/contract/#Contract) with the ethers package. The ABI that it imports is exported from the _SimpleGeneralMessage_ contract’s compilation, so this code is assuming that the recipient of the message specified in the VAA is or inherits from a _SimpleGeneralMessage_ contract. 

Then, the code attempts to execute the _processMyMessage_ function with the VAA, which was previously defined as the function that messages are relayed to. Recall that this function name was arbitrarily chosen for the smart contract because the relayer could specify any function to call. That freedom is expressed in the ability for a developer to change this relayer’s code!


```
     await execute.onEVM({
       chainId: destChainID,
       f: async (wallet, chainId) => {
         const contract = new ethers.Contract(recipient, abi, wallet.wallet);
         const result = await contract.processMyMessage(payload.vaa);
         this.logger.info(result);
       },
     });
```


The final piece is to check _example-project/relayer-engine-config/common.json_. This config file controls the execution of the entire relayer. Ensure that the TestNet EVMs that you are using are listed within the _supportedChains_ object of this file. The plugin will not run properly if it’s not listed. If a chain that you are using is not listed, you will have to import the data from [Wormhole’s developer documentation](https://book.wormhole.com/reference/contracts.html#testnet) into the config file in a format like below.

There are also additional configurations for the relayer. For example, the _mode_ string is set to “BOTH” to ensure that both the listener and executor plugins are used, but a developer could decide to run only one if they wanted. Additionally, there are multiple log levels to specify, such as “error” for just error messages. For this demo, however, just leave the configuration settings as is.


```
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


That’s it for the configuration! Now to run it. In your terminal instance (one that isn’t running the spy node), navigate to the _example-project_ folder. Run the following command:


```
npm run start
```


You should see something similar to the logs below in the console.




image 7


Oh boy, you got through that whole section too? Pat yourself on the back! When you’re ready, move on to the next step.


### Sending a Cross Chain Message from Moonbase with Wormhole

Now, to send a cross chain message, you just need to call the _sendMessage_ function.

Use the Remix interface. This example is going to send a cross-chain message to the Fantom TestNet, but you can substitute the _destChainId_ for whichever EVM you desire. Check the following things:



1. The environment is **Injected Provider **on network 1287 (Moonbase Alpha)
2. You have substantial funds in your wallet from [the faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/) to cover the transaction gas cost on both the origin and destination chains
3. Put a short message of your choice in the **message** input of the _sendMessage _call (in this case “this is a message”)
4. Put the address of your instance of SimpleGeneralMessage on destination chain in the **destAddress** input
5. Put the destination chain’s Wormhole chainId_ _in the **destChainId_ _**input of the _sendMessage _call
6. Once this is all done, transact the execution and confirm it in MetaMask




image 8



### Tracking Cross Chain Messages

After sending your transaction, you should be able to go into the [Moonbase block explorer](https://moonbase.moonscan.io/) to take a look at the transaction using its transaction hash. If everything went well, it should be confirmed, and you’ll be able to see traces of the input of your transaction at the very bottom when viewing it as UTF-8. 






image 9


In a typical transaction, you would be able to see the status and data of the transaction on a single page on a single explorer. But, since this is cross-chain messaging, there are really two EVM transactions happening on two chains.

You should be able to see your relayer output some logs in the console within 60 seconds of sending the message on Moonbase Alpha. Note that the relayer printed out a lot of information about the VAA, including the message itself. Any relayer will be able to see all of the information in your VAAs.




image 10


If everything goes smoothly, your transaction will be approved and you will be able to see the _lastMessage _updated in the origin chain from your successful cross-chain transaction! If it doesn’t automatically update, don’t worry. It’ll take a few seconds for it to properly go through.

If you want to see the message stored in the contract, you can do so through Remix. Like when setting the trusted addresses, connect to the destination network through MetaMask. Make sure that you are in the **Injected Provider** environment and that the contract is still **SimpleGeneralMessage**. Then take the address of the destination contract, and paste it into the **At Address **input. 



1. Press it, and you should be able to use the outcome contract to view the **lastMessage** button 
2. Paste your wallet address in the input 
3. Finally, click **call** to see the resulting message




image 11

--8<-- 'text/disclaimers/third-party-content.md'
