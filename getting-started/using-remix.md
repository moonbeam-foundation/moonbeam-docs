---
title: Using Remix
description: Learn how to interact with the Moonbeam node using the Remix IDE for Ethereum.
---

#Interacting with Moonbeam Using Remix
##Introduction
This guide walks through the process of creating and deploying a Solidity-based smart contract to a Moonbeam dev node using the [Remix IDE](https://remix.ethereum.org/).  Remix is one of the commonly used development environments for smart contracts on Ethereum.  Given Moonbeam’s Ethereum compatibility features, Remix can be used directly with a Moonbeam node.

!!! note
    This tutorial was created using the pre-alpha release of [Moonbeam](https://github.com/PureStake/moonbeam/tree/moonbeam-tutorials). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development.  We have created this tutorial so you can test out Moonbeam’s Ethereum compatibility features.  Even though we are still in development, we believe it’s important that interested community members and developers have the opportunity to start to try things with Moonbeam and provide feedback.

This guide assumes that you have a running local moonbeam node running in `--dev mode`, and that you have a MetaMask installation configured to use this local node.  You can find instructions for running a local Moonbeam node [here](/getting-started/setting-up-a-node/) and to configure MetaMask for Moonbeam [here](/getting-started/using-metamask/).

##Checking Prerequisites
If you followed the guides above, you should have a local Moonbeam node producing blocks that looks like this:

![Local Moonbeam node producing blocks](/images/using-remix-1.png)

And you should have a MetaMask installation, connected to your local Moonbeam dev node with at least one account in it that has a balance.  It should look something like this (expanded view):

![MetaMask installation with a balance](/images/using-remix-2.png)

!!! note
    Make sure you are connected to your Moonbeam node and not another network!

Last, let's configure MetaMask to show gas controls on the confirmation screen.  We will need this, as some of the gas estimation related functionality in Moonbeam is under development.  

We will need to increase the gas limit in MetaMask on some of the transactions we will be sending in this guide.  You can do this under Settings -> Advanced -> Advanced Gas Controls = ON.  It should look like this:

![Increasing the gas limit in MetaMask](/images/using-remix-3.png)

##Interacting With Moonbeam Using Remix
Now let’s fire up Remix to exercise some more advanced functionality in Moonbeam.  

Launch Remix by navigating to [https://remix.ethereum.org/](https://remix.ethereum.org/).  Under Environments, select Solidity to configure Remix for Solidity development, then navigate to the File Explorers view:

![File explorer](/images/using-remix-4.png)

We will create a new file to save the Solidity smart contract.  Hit the + button under File Explorers and enter the name "MyToken.sol" into the popup dialog:

![Create a new file for your Solidity contract](/images/using-remix-5.png)

Now let's paste the following smart contract into the editor tab that comes up:

```
pragma solidity ^0.6.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC20/ERC20.sol';

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") public {
    _mint(msg.sender, initialSupply);
  }
}
```

This is a simple ERC-20 contract based on the current Open Zeppelin ERC-20 template.  It creates MyToken with symbol MYTOK and mints the entirety of the initial supply to the creator of the contract.

Once you have pasted the contract into the editor it should look like this:

![Paste the contract into the editor](/images/using-remix-6.png)

Now navigate to the compile sidebar option to press the “Compile MyToken.sol” button:

![Compile MyToken.sol](/images/using-remix-7.png)

You will see Remix download all of the Open Zeppelin dependencies and compile the contract.  

Now we can deploy the contract by navigating to the Deployment sidebar option.  You need to change the topmost ENVIRONMENT dropdown from “JavaScript VM” to “Injected Web3” which tells Remix to use the MetaMask injected provider.  As soon as you select this you will be prompted to allow Remix to connect to your MetaMask account.

![Replace](/images/using-remix-8.png)

Press “Connect” in Metamask to allow Remix access.

Back on the Remix side, you should see the account to be used for deployment as the one that is managed by MetaMask.  Next to the Deploy button, let’s specify an initial supply of 8M tokens.  Since this contract uses the default of 18 decimals, the value to put in the box is "8000000000000000000000000".

Once you have entered this value hit the Deploy button.

![Enter an account balance and deploy](/images/using-remix-9.png)

You will be prompted in MetaMask to confirm the contract deployment transaction.

Before you confirm on the MetaMask side, you need to increase the gas limit for the transaction.  Enter the value "4294967295" for the gas limit.  You should see the gas limit right on the confirmation screen if you enabled Advanced gas controls as was described at the beginning of this guide. 

As of the writing of this guide, we are working through some issues related to gas estimation in Moonbeam. Once these are fixed, this manual increase of the gas limit shouldn’t be necessary.

![Increase the gas limit for the transaction](/images/using-remix-10.png)

After you press confirm and the deployment is complete, you will see the “confirmed” label on the transaction in MetaMask and the contract will appear under Deployed Contracts in Remix.

![Confirmed label on a transaction](/images/using-remix-11.png)

Once the contract is deployed, you can interact with it from within Remix.

Drill down on the contract under “Deployed Contracts.”  Clicking on name, symbol, and totalSupply should return “MyToken,” “MYTOK,” and “8000000000000000000000000” respectively.  If you copy the address that you deployed the contract from, and paste it into the balanceOf field, you should see the entirety of the balance of the ERC20 as belonging to that user.

![Interact with the contract from Remix](/images/using-remix-12.png)

##Interacting with a Moonbeam-based ERC-20 from MetaMask
Now, open MetaMask to add the newly deployed ERC-20 tokens.  To do this, first copy the deployed contract address from Remix:

![Copy the deployed contract address](/images/using-remix-13.png)

Now go to MetaMask and click on “Add Token” as shown below.

![Add a token](/images/using-remix-14.png)

Paste the copied contract address into the “Custom Token” field.  The “Token Symbol” and “Decimals of Precision” fields should be automatically populated.

![Paste the copied contract address](/images/using-remix-15.png)

After hitting “Next,” you will need to confirm that you want to add these tokens to your MetaMask account.  Hit “Add Token” and you should see a balance of 8M MyTokens in MetaMask:

![Add the tokens to your MetaMask account](/images/using-remix-16.png)

Now we can send some of these ERC-20 tokens to the other account that we have set up in MetaMask.  Hit “send” to initiate the transfer of 500 MyTokens, select the destination account, and put in “1000000” as the gas limit.

After hitting “next,” you will be asked to confirm (similar to what is pictured below). 

![Confirmation of the token transfer](/images/using-remix-17.png)

Hit “Confirm” and, after the transaction is complete, you will see a confirmation and a reduction of the MyToken account balance from the sender account in MetaMask:

![Verify the reduction in account balance](/images/using-remix-18.png)

##We Want to Hear From You
This is obviously a simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features.  We are interested in hearing about your experience following the steps in this guide or your experience trying other Ethereum-based tools with Moonbeam.  Feel free to join us in the [Moonbeam Riot room here](https://matrix.to/#/!dzULkAiPePEaverEEP:matrix.org?via=matrix.org&via=web3.foundation).  We would love to hear your feedback on Moonbeam and answer any questions that you have.  
