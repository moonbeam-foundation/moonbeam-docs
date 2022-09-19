---
title: Gelato Ops and Relay SDK
description: Use Gelato to automate your smart contract interactions and outsource your Moonbeam and Moonriver dev ops needs to the most reliable multi-chain bot network.
---

# Getting Started with Gelato

![Gelato Banner](/images/builders/integrations/relayers/gelato/gelato-banner.png)

## Introduction {: #introduction }

[Gelato Network](https://www.gelato.network/){target=\_blank} is a decentralized automation network for Web3, enabling developers to automate & relay arbitrary smart contract executions on and across EVM-based compatible blockchains. The network relies on a broad set of transaction relayers called [executors](https://docs.gelato.network/introduction/executor-operators){target=\_blank} that are rewarded for the infrastructure and automation services they provide. Gelato is designed to be a more robust, decentralized, and cost-efficient alternative to running your own bot infrastructure.

Gelato is live on both Moonbeam and Moonriver, enabling developers and end-users to automate smart contract interactions with Gelato Ops and the Gelato Relay SDK. First, this guide will demonstrate a step-by-step tutorial to automating a smart contract interaction with Gelato Ops. Next, you'll interact with the Gelato Relay SDK via a hands-on demo.

--8<-- 'text/disclaimers/third-party-content-intro.md'

## Gelato Ops {: #gelato-ops }

[Gelato Ops](https://app.gelato.network/){target=\_blank} is a front-end for interacting with the Gelato network and managing your transaction automation. There's no sign up or registration step - your account is tied directly to your wallet. In this guide, you'll deploy a signature Gelato ice cream NFT that can be licked via a function call. Then, you'll automate the lick function according to specific parameters.

![Gelato Ops 1](/images/builders/integrations/relayers/gelato/gelato-1.png)

### Create an Automated Task {: #creating-an-automated-task }

To get started with this guide, you'll need to have some GLMR or MOVR in your free balance. Then, head to [Gelato Ops](https://app.gelato.network/tutorial){target=\_blank} and ensure that you have selected the Moonbeam or Moonriver network in your wallet and connected it to Gelato. To kick off the tutorial, press **Start Tutorial**, then press **Mint NFT** and confirm the transaction in MetaMask.

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

And that's it! You've successfully set up your first recurring smart contract interaction with Gelato. Your automated smart contract interactions will continue according to the set schedule until the remaining funds for gas are drained or the automation is paused on Gelato Ops. This example was a simple demo, but you can automate much more complex interactions and build increasingly sophisticated logic into your automated tasks. Be sure to check out [docs.gelato.network](https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub){target=\_blank} for more information.

### Manage your Automated Tasks {: #managing-your-automated-tasks }

On [app.gelato.network](https://app.gelato.network/){target=\_blank}, you'll see all of your automations and their associated statuses. You can click on an automation to see more details about the task and its execution history. Here you can also make any changes to the automated task, including pausing or resuming the task. To pause a task, press **Pause** in the upper right corner and confirm the transaction in your wallet. You can resume the automation at any time by pressing **Restart** and confirming the transaction in your wallet.

At the bottom of the page, you can see your task's execution history including the transaction status and the gas cost. You can click on the **Task Logs** tab to see a detailed debugging level history of your automated tasks, which may be especially helpful in the event a transaction failed or did not execute.

![Gelato Ops 3](/images/builders/integrations/relayers/gelato/gelato-3.png)

### Manage your Gas Funds {: #managing-your-gas-funds }

To manage your gas funds on [app.gelato.network](https://app.gelato.network/){target=\_blank}, click on the **Funds** box in the upper left corner. Here, you can top up your balance of gas funds or withdraw them. You can also register be notified with low balance alerts.

To deposit funds for gas, take the following steps:

1. Click on the **Funds** box in the upper left corner
2. Enter the amount of funds you'd like to deposit
3. Click **Deposit** and confirm the transaction in your wallet

You can follow a similar set of steps to withdraw your gas funds from Gelato.

![Gelato Ops 4](/images/builders/integrations/relayers/gelato/gelato-4.png)

## Gelato Relay SDK {: #gelato-relay-sdk }

[Gelato Relay SDK](https://docs.gelato.network/developer-products/gelato-relay-sdk){target=\_blank} offers a convenient suite of functions in order to interact with Gelato Relay. Gelato Relay is a service that allows users and developers to get transactions validated fast, reliably and securely, without having to deal with the low-level complexities of blockchains.

![Gelato Relay SDK Overview](/images/builders/integrations/relayers/gelato/gelato-5.png)

As requests are submitted to Gelato Relay, a network of decentralised Gelato Executors will execute and get the transactions validated as soon as possible. EIP-712 signatures enforce the integrity of data, while gas fee payments can be handled in any of our supported payment methods. In this way, developers can rely on Gelato's battle-tested blockchain infrastructure improving the UX, costs, security and liveness of their Web3 systems.​

### Gasless transactions with Gelato Relay SDK {: #gasless-transactions-with-gelato-relay-sdk }

Gasless transactions (AKA [meta-transactions](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#what-is-a-meta-transaction)) allow users to interact with their target smart contracts without requiring to have a native token balance, or even interact directly with the chain at all!

Instead of confirming a transaction in a wallet, a user can pay Gelato during the call forward using their own smart contract logic (or use Gelato's [premade logic](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#gelatos-relay-context) for easy integration). Otherwise, if they would like, they can sign a message using their wallet and send this signature using Gelato Relay SDK's [user authentication](https://docs.gelato.network/developer-products/gelato-relay-sdk/sdk-methods/relaywithsponsoreduserauthcall). Gelato's decentralised network of executors will then relay the message on-chain on the user's behalf.

### How does Gelato Relay enable gasless transactions? {: #gelato-enabled-gasless }

Gelato allows the user to send a transaction without a native token balance. We also give the option of utilising the excellent security of a user signature, but for the transaction to be sent by a different EOA, one controlled by a relayer. This is a very import context shift to understand. We have shifted from a user signing and sending a transaction themselves, to a user signing a standardised message and passing that on to a relayer. This relayer will, first, verify the user's signature for security, and then pass their message along on-chain. Gelato Relay does exactly this by taking a user's message off-chain and subsequently building a [meta-transaction](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#what-is-a-meta-transaction) which is executed on chain.

Gasless transactions are _not_ actually gasless. Of course, the blockchain primitive of gas is here to stay and rightly so for sake of the underlying network's security. What Gelato Relay does is abstract the _payment_ of gas away from the end-user. Someone still pays for the gas, but now it can be done using the [payment methods](https://docs.gelato.network/developer-products/gelato-relay-sdk/payment) that Gelato Relay supports, which offer superior features and convenience over on-ramps from fiat and KYC.

### Why use Gelato Relay as a developer? {: #why-gelato-relay }

Using Gelato Relay, we relay your user's transactions on-chain (with optional [ERC-2771](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#erc-2771) support), enabling secure gasless transactions for an ultra smooth UX for your dApp. This allows for a variety of new web3 experiences, as the user can now pay by only signing a message, or their transaction costs can be sponsored by the dApp developer. As long as the gas costs are covered in one of the multiple [payment methods](https://docs.gelato.network/developer-products/gelato-relay-sdk/payment) that Gelato supports, we handle the rest reliably, quickly and securely.

### Installation {: #installation }

#### Gelato Relay SDK

Gelato Relay SDK is an [NPM package](https://www.npmjs.com/package/@gelatonetwork/relay-sdk){target=\_blank} that can be installed locally with the following command:

```
npm install @gelatonetwork/relay-sdk
```

or

```
yarn add @gelatonetwork/relay-sdk
```

#### Gelato Relay Context

`GelatoRelayContext` is an [NPM package](https://www.npmjs.com/package/@gelatonetwork/relay-context){target=\_blank} which can be installed locally:

```
npm install --save-dev @gelatonetwork/relay-context
```

or

```
yarn add -DE @gelatonetwork/relay-context
```

If you would like your target contract to pay Gelato directly during the relay call forward, you can utilise your own logic (please make sure you have replay and re-entrancy protection and [whitelist GelatoRelay](https://docs.gelato.network/developer-products/gelato-relay-sdk/sdk-methods) for your target function) *or* you can inherit our ready-made `GelatoRelayContext` in your target contract. `GelatoRelayContext` is an extremely simple way to create a Gelato Relay compatible smart contract, with just one import. See more information [here](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#gelatos-relay-context).


### Smart Contract Example

*Please find all Gelato Relay code examples with tests and documentation [here](https://github.com/gelatodigital/relay-docs-examples).*

The [`myDummyWallet` contract](https://moonbeam.moonscan.io/address/0xA045eb75e78f4988d42c3cd201365bDD5D76D406) gives a simple example of using Gelato Relay with the [`SyncFee`](https://docs.gelato.network/developer-products/gelato-relay-sdk/payment#syncfee) payment method.

Specifically, the target smart contract is `myDummyWallet` which has two functions: `sendToFriend` and `balanceOf`. These are the target functions that we can ask Gelato Relay to call on our behalf.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import {
    GelatoRelayContext
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContext.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {
    SafeERC20
} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Importing GelatoRelayContext gives access to:
// 1. onlyGelatoRelayModifier
// 2. payment methods, i.e. _transferRelayFee
// 3. _getFeeCollector(), _getFeeToken(), _getFee()
contract MyDummyWallet is GelatoRelayContext {
    // emitting an event for testing purposes
    event LogSendToFriend(address indexed to, uint256 amount);
    event LogBalance(uint256 indexed balance);

    // this function uses this contract's token balance to send
    // an _amount of tokens to the _to address
    function sendToFriend(
        address _token,
        address _to,
        uint256 _amount
    ) external onlyGelatoRelay {
        // Payment to Gelato
        // NOTE: be very careful here!
        // if you do not use the onlyGelatoRelay modifier,
        // anyone could encode themselves as the fee collector
        // in the low-level data and drain tokens from this contract.
        _transferRelayFee();

        // transfer of ERC-20 tokens
        SafeERC20.safeTransfer(IERC20(_token), _to, _amount);

        emit LogSendToFriend(_to, _amount);
    }


    // this functions emits the current balance of the wallet contract
    // in an event that we can check on-chain.
    function balanceOf() external onlyGelatoRelay {
        // Payment to Gelato
        // NOTE: be very careful here!
        // if you do not use the onlyGelatoRelay modifier,
        // anyone could encode themselves as the fee collector
        // in the low-level data and drain tokens from this contract.
        _transferRelayFee();

        emit LogBalance(address(this).balance);

    }
}
```

`sendToFriend` takes as arguments the address of a friend, the token contract address, and the amount one would like to send. Notice that `sendToFriend` uses the `onlyGelatoRelay` modifier, inherited from `GelatoRelayContext`, which is very important! It means that only the Gelato Relay smart contract can call your function (`0xaBcC9b596420A9E9172FD5938620E265a0f9Df92` on all supported networks!) `_transferRelayFee()` is a function inherited from `GelatoRelayContext` which allows you to pay Gelato directly during the call forward.

Similarly, `balanceOf` is a very simple function, which takes no arguments, and emits an event with the current balance of the wallet. Let's try calling `balanceOf` on the [`myDummyWallet` contract](https://moonbeam.moonscan.io/address/0xA045eb75e78f4988d42c3cd201365bDD5D76D406) using Gelato Relay SDK!

### `balanceOf` Typescript Example

*Please find all Gelato Relay code examples with tests and documentation [here](https://github.com/gelatodigital/relay-docs-examples).* 

Below is a javascript code example `balanceOf.ts`, which uses Gelato Relay SDK to call `balanceOf` on [`myDummyWallet`](https://moonbeam.moonscan.io/address/0xA045eb75e78f4988d42c3cd201365bDD5D76D406).

```typescript
import { GelatoRelaySDK } from "@gelatonetwork/relay-sdk";
import { ethers, BytesLike } from "ethers";

// target contract address
const myDummyWallet = "0xA045eb75e78f4988d42c3cd201365bDD5D76D406";

const { data } = "0x722713f7"; // `balanceOf` function signature
const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // native token, GLMR

// populate the relay SDK request body
const request = {
  chainId: 1284; // Moonbeam
  target: myDummyWallet; // 0xA045eb75e78f4988d42c3cd201365bDD5D76D406
  data: data as BytesLike; // payload to call
  feeToken: feeToken;
};

// send relayRequest to Gelato Relay API
const relayResponse =
  await GelatoRelaySDK.relayWithSyncFee(request);
```

To run this script, run this terminal command in the same directory:

```
ts-node balanceOf.ts
```

Perfect! You have submitted your first Gelato Relay SDK transaction? How does it feel? Awesome, I bet. 

Now, go ahead and check the 'Events' tab on the moonscan page [here](https://moonscan.io/address/0xA045eb75e78f4988d42c3cd201365bDD5D76D406#events). Once Gelato receives the request, it will go ahead and execute the required transaction on-chain which calls `balanceOf` and, in turn, you should see an event emitted with the current balance. 

*Bear in mind, this only works if the `myDummyWallet` contract has a balance for the requested token.*


### Complete Front-end Code Example {: #complete-script }

`balanceOf` is a nice indicative example, but let's try a real world use-case: using Gelato Relay to initiate a gasless token transfer using `sendToFriend`! This code can be run in any javascript front-end using MetaMask as the browser wallet. MetaMask provides the RPC connection in order to generate the payload for the function call using [ethers.js](https://docs.ethers.io/v5/single-page/).

Any token can be used here, so feel free to create your own ERC-20 for testing and give the `myDummyWallet` contract a balance, or send GLMR to the contract, and send it back to yourself using `sendToFriend`! 

*Remember, if `myDummyWallet` holds no balance for the specified token, the relay request will not proceed!*

```typescript
import GelatoRelaySDK from "@gelatonetwork/relay-sdk";
import { ethers, BytesLike } from "ethers";

// target contract address
const myDummyWallet = "0xA045eb75e78f4988d42c3cd201365bDD5D76D406";

// using a human-readable ABI for generating the payload
const abi = ["function sendToFriend(address _token, address _to, uint256 _amount");
                                    
// sendToFriend arguments                                 
const feeToken = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // native token!
const vitalik = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
const amountToSend = ethers.utils.parseUnits("0.05");

// connect to the blockchain via a front-end provider
const provider = new ethers.providers.Web3Provider(window.ethereum);

// generate the target payload
const signer = provider.getSigner();
const contract = new ethers.Contract(counterAddress, abi, signer);
const { data } = 
    await contract.populateTransaction.sendToFriend(feeToken,
                                                    vitalik,
                                                    amountToSend);

// populate the relay SDK request body
const request = {
  chainId: provider.network.chainId; // make sure you are connected to Moonbeam!
  target: myDummyWallet;
  data: data as BytesLike;
  feeToken: feeToken;
};
  
// send relayRequest to Gelato Relay API
const relayResponse = 
  await GelatoRelaySDK.relayWithSyncFee(request);
```

To run this script, run this terminal command in the same directory:

```
ts-node sendToFriend.ts
```

Well done, you are now ready to incorporate Gelato Relay in your dApp!

*With Gelato Relay, the possibilities are endless, we are really looking forward to seeing what you build!*

### What's next?

Head over to the [Gelato Relay SDK](https://docs.gelato.network/developer-products/gelato-relay-sdk){target=\_blank} documentation to learn more about relaying, specific [ERC-2771](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#erc-2771) and [EIP-712](https://docs.gelato.network/developer-products/gelato-relay-sdk/prerequisites#what-is-a-meta-transaction) support for secure meta-transactions, and about more advanced payment methods such as [Gelato 1Balance](https://docs.gelato.network/developer-products/gelato-relay-sdk/payment#1balance).

If you want to see more code examples and explainers, head over to our example [github repo](https://github.com/gelatodigital/relay-docs-examples) for more information!

Finally, please feel free to join our [discord](https://discord.com/invite/ApbA39BKyJ) to chat, ask for support, and to learn about Gelato's ecosystem!

--8<-- 'text/disclaimers/third-party-content.md'
