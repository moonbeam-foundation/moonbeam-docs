---
title: Gelato Ops and Relay SDK
description: Use Gelato to automate your smart contract interactions and outsource your Moonbeam and Moonriver DevOps needs to the most reliable multi-chain bot network. 
---

# Getting Started with Gelato

## Introduction {: #introduction }

[Gelato Network](https://www.gelato.network/){target=_blank} is a decentralized automation network for Web3, enabling developers to automate & relay arbitrary smart contract executions on and across EVM-based compatible blockchains. The network relies on a broad set of transaction relayers called [executors](https://docs.gelato.network/introduction/executor-operators){target=_blank} that are rewarded for the infrastructure and automation services they provide. Gelato is designed to be a more robust, decentralized, and cost-efficient alternative to running your own bot infrastructure.

Gelato is live on both Moonbeam and Moonriver, enabling developers and end-users to automate smart contract interactions with Gelato Ops and the Gelato Relay SDK. First, this guide will demonstrate a step-by-step tutorial to automating a smart contract interaction with Gelato Ops. Next, you'll interact with the Gelato Relay SDK via a hands-on demo.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Gelato Ops {: #gelato-ops }

[Gelato Ops](https://app.gelato.network/){target=_blank} is a front-end for interacting with the Gelato network and managing your transaction automation. There's no sign up or registration step - your account is tied directly to your wallet. In this guide, you'll deploy a signature Gelato ice cream NFT that can be licked via a function call. Then, you'll automate the lick function according to specific parameters.

![Gelato Ops 1](/images/builders/integrations/relayers/gelato/gelato-1.png)

### Create an Automated Task {: #creating-an-automated-task }

To get started with this guide, you'll need to have some GLMR or MOVR in your free balance. Then, head to [Gelato Ops](https://app.gelato.network/tutorial){target=_blank} and ensure that you have selected the Moonbeam or Moonriver network in your wallet and connected it to Gelato. To kick off the tutorial, press **Start Tutorial**, then press **Mint NFT** and confirm the transaction in MetaMask.

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

And that's it! You've successfully set up your first recurring smart contract interaction with Gelato. Your automated smart contract interactions will continue according to the set schedule until the remaining funds for gas are drained or the automation is paused on Gelato Ops. This example was a simple demo, but you can automate much more complex interactions and build increasingly sophisticated logic into your automated tasks. Be sure to check out [docs.gelato.network](https://docs.gelato.network/developer-products/gelato-ops-smart-contract-automation-hub){target=_blank} for more information.

### Manage your Automated Tasks {: #managing-your-automated-tasks }

On [app.gelato.network](https://app.gelato.network/){target=_blank}, you'll see all of your automations and their associated statuses. You can click on an automation to see more details about the task and its execution history. Here you can also make any changes to the automated task, including pausing or resuming the task. To pause a task, press **Pause** in the upper right corner and confirm the transaction in your wallet. You can resume the automation at any time by pressing **Restart** and confirming the transaction in your wallet.

At the bottom of the page, you can see your task's execution history including the transaction status and the gas cost. You can click on the **Task Logs** tab to see a detailed debugging level history of your automated tasks, which may be especially helpful in the event a transaction failed or did not execute.  

![Gelato Ops 3](/images/builders/integrations/relayers/gelato/gelato-3.png)

### Manage your Gas Funds {: #managing-your-gas-funds }

To manage your gas funds on [app.gelato.network](https://app.gelato.network/){target=_blank}, click on the **Funds** box in the upper left corner. Here, you can top up your balance of gas funds or withdraw them. You can also register be notified with low balance alerts.

To deposit funds for gas, take the following steps:

1. Click on the **Funds** box in the upper left corner
2. Enter the amount of funds you'd like to deposit
3. Click **Deposit** and confirm the transaction in your wallet

You can follow a similar set of steps to withdraw your gas funds from Gelato.

![Gelato Ops 4](/images/builders/integrations/relayers/gelato/gelato-4.png)

## Gelato Relay SDK {: #gelato-relay-sdk }

[Gelato Relay SDK](https://docs.gelato.network/developer-products/gelato-relay-sdk){target=_blank} is a collection of functions that enable you to interact with the Gelato Relay API. Per Gelato Docs, *Gelato Relay API is a service that allows users and developers to get transactions mined fast, reliably and securely, without having to deal with the low-level complexities of blockchains.* A key feature of this offering is the ability to provide users with gasless transactions.

### Send a Gasless Transaction with Gelato Relay SDK {: #send-a-gasless-transaction-with-gelato-relay-sdk }

Gasless transactions, also referred to as meta transactions, allow end-users to interact with smart contracts without paying for gas. Instead of confirming a transaction in a wallet, a user signs a message that enables a transaction to take place once a relayer submits the transaction and pays the associated gas fee. [EIP-2771](https://eips.ethereum.org/EIPS/eip-2771){target=_blank} is a common standard that enables meta transactions, and is implemented by the [`HelloWorld.sol` contract](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#code){target=_blank} referenced later in the tutorial.

In this demo, you'll ask Gelato Relay SDK to call a `HelloWorld.sol` contract on your behalf. The script being built is sourced from the [quick start guide](https://docs.gelato.network/developer-services/relay/quick-start){target=_blank} on Gelato's Docs. Note, there is no dependency on RPC providers - once the transaction and signature are built, you simply pass them along to the Gelato Relay API.

### Get Started {: #getting-started }

Gelato Relay SDK is an [NPM package](https://www.npmjs.com/package/@gelatonetwork/gelato-relay-sdk){target=_blank} that can be installed locally in the current directory with the following command:

```bash
npm install @gelatonetwork/gelato-relay-sdk
```

You'll also want to install the Ethers.js library with the following command:

```bash
npm install ethers
```

Next, you'll need to create a javascript file for your script. You can create a `hello-world.js` file by running:

```bash
touch hello-world.js
```

Now you're ready to build. First, you need to import the Gelato Relay SDK and Ethers.js:

```js
import { Wallet, utils } from 'ethers';
import { GelatoRelaySDK } from '@gelatonetwork/gelato-relay-sdk';
```

Then, create a function to contain the logic of the script:

```js
const forwardRequestExample = async () => {

};
```

Within the `forwardRequestExample` function, define the chain ID and the [`HelloWorld.sol` contract](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#code){target=_blank} that you want to interact with.

```js
const chainId = {{ networks.moonbeam.chain_id }};
// `HelloWorld.sol` contract on Moonbeam
const target = '0x3456E168d2D7271847808463D6D383D079Bd5Eaa';
```

The [`HelloWorld.sol` contract](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#code){target=_blank}, reproduced below, is configured to have gasless transaction support.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {ERC2771Context} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

/// @title HelloWorld with meta transaction support (EIP-2771)
contract HelloWorld is ERC2771Context {
    event Success(
        address indexed user,
        address indexed feeToken,
        string message
    );

    constructor(address _gelatoMetaBox) ERC2771Context(_gelatoMetaBox) {}

    function sayHiVanilla(address _feeToken) external {
        string memory message = "Hello World";

        emit Success(msg.sender, _feeToken, message);
    }

    function sayHi(address _feeToken) external {
        string memory message = "Hello World";

        emit Success(_msgSender(), _feeToken, message);
    }
}
```

Next, you'll create a new test account that will submit the gasless transaction. This account is insecure and should not be used in production. This example defines a `test_token` with a default value for demonstration purposes, but you can specify any token here that you'd like.

```js
const test_token = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
// Create mock wallet
const wallet = Wallet.createRandom();
const sponsor = await wallet.getAddress();
console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
console.log(`Mock wallet address: ${sponsor}`);
```

### Add Request Data {: #add-request-data }

In this step you have to provide the ABI-encoded call data for the function you want to interact with. You can generate this by taking the following steps:

1. Navigate to the **Write Contract** heading of the [`HelloWorld.sol` contract on Moonscan](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#writeContract){target=_blank}
2. Press  **Connect to Web3**. After you accept the terms and conditions, you can connect your wallet
3. Head to the `sayHiVanilla` function and provide the following default value for the `_feeToken` parameter: `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
4. Press **Write**
5. Without confirming the transaction in MetaMask, click on the **Hex** tab
6. Press **Copy Raw Transaction Data**

The resulting ABI-encodeded call data should look like `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`

![Gelato Relay SDK](/images/builders/integrations/relayers/gelato/gelato-5.png)

The ABI-encoded call data specifies the contract function to call as well as any relevant parameters, and can be fetched via MetaMask or Remix. More commonly, you might fetch the ABI-encoded call data programmatically via Ethers.js or Web3.js. There are some additional parameters defined in the following example, such as `paymentType`, `maxFee`, and `gas`. There are a variety of possible payment types you can choose from. For simplicity, replay protection has not been considered in this example.

```js
// ABI encode for HelloWorld.sayHiVanilla(address _feeToken)
const data = '0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee';
const paymentType = 1;
// Maximum fee that sponsor is willing to pay worth of test_token
const maxFee = '1000000000000000000';
// Gas limit
const gas = '200000';

// Smart contract nonces are not enforced to simplify the example.
// In reality, this decision depends whether or not target
// address already implements replay protection. (More info in the docs)
const sponsorNonce = 0;
const enforceSponsorNonce = false;
// Only relevant when enforceSponsorNonce = true
const enforceSponsorNonceOrdering = false;

// Build ForwardRequest object
const forwardRequest = GelatoRelaySDK.forwardRequest(
  chainId,
  target,
  data,
  test_token,
  paymentType,
  maxFee,
  gas,
  sponsorNonce,
  enforceSponsorNonce,
  sponsor
);

```

Lastly, the `forwardRequest` object is created with all of the relevant parameters defined in prior steps. In the final step, the `forwardRequest` object will be sent to the Gelato Relay API with the required signature.

### Send Request Data {: #send-request-data }

The last few steps include hashing the request object and signing the resulting hash. The ultimate step is to submit the request and the signature to the Gelato Relay API. You can copy and paste the below code after the `forwardRequest` object:

```js
// Get EIP-712 hash (aka digest) of forwardRequest
const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

// Sign digest using mock private key
const sponsorSignature = utils.BytesLike = utils.joinSignature(
  await wallet._signingKey().signDigest(digest)
);

// Send forwardRequest and its sponsorSignature to Gelato Relay API
await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);

console.log('ForwardRequest submitted!');
```

The [EIP-712 standard](https://eips.ethereum.org/EIPS/eip-712){target=_blank} provides important context to users about the action they're authorizing. Instead of signing a long, unrecognizable bytestring (which is dangerous and could be exploited by bad actors), [EIP-712](https://eips.ethereum.org/EIPS/eip-712){target=_blank} provides a framework for encoding and displaying the contents of the message in a readable manner, making it substantially safer for end-users.

To execute the script and dispatch the gasless transaction to Gelato Relay API, use the following command:

```bash
node hello-world.js
```

You should see a message logged to the console that says `ForwardRequest submitted!` You can also verify your relayed transaction was successfully executed by checking the latest transactions of [this Gelato contract on Moonscan](https://moonscan.io/address/0x91f2a140ca47ddf438b9c583b7e71987525019bb){target=_blank}.

### Complete Script {: #complete-script }

The entire `hello-world.js` file should contain the following:

```js
import { Wallet, utils } from 'ethers';
import { GelatoRelaySDK } from '@gelatonetwork/gelato-relay-sdk';

const forwardRequestExample = async () => {
  const chainId = {{ networks.moonbeam.chain_id }};
  // `HelloWorld.sol` contract on Moonbeam
  const target = '0x3456E168d2D7271847808463D6D383D079Bd5Eaa';
  const test_token = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

  // Create mock wallet
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();
  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);

  // ABI encode for HelloWorld.sayHiVanilla(address _feeToken)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;
  const paymentType = 1;
  // Maximum fee that sponsor is willing to pay worth of test_token
  const maxFee = '1000000000000000000';
  // Gas limit
  const gas = '200000';

  // Smart contract nonces are not enforced to simplify the example.
  // In reality, this decision depends whether or not target
  // address already implements replay protection. (More info in the docs)
  const sponsorNonce = 0;
  const enforceSponsorNonce = false;
  // Only relevant when enforceSponsorNonce = true
  const enforceSponsorNonceOrdering = false;

  // Build ForwardRequest object
  const forwardRequest = GelatoRelaySDK.forwardRequest(
    chainId,
    target,
    data,
    test_token,
    paymentType,
    maxFee,
    gas,
    sponsorNonce,
    enforceSponsorNonce,
    sponsor
  );

  // Get EIP-712 hash (aka digest) of forwardRequest
  const digest = GelatoRelaySDK.getForwardRequestDigestToSign(forwardRequest);

  // Sign digest using mock private key
  const sponsorSignature = (utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  ));

  // Send forwardRequest and its sponsorSignature to Gelato Relay API
  await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);

  console.log('ForwardRequest submitted!');
};

forwardRequestExample();
```

--8<-- 'text/_disclaimers/third-party-content.md'
