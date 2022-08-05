---
title: Gelato
description: Use Dapplooker to analyze and query on-chain data, and create dashboards to visualize analytics for Moonbeam and Moonriver.
---

# Getting Started with Gelato

![Gelato Banner](/images/builders/integrations/relayers/gelato/gelato-banner.png)

## Introduction {: #introduction }

[Gelato Network](https://www.gelato.network/){target=_blank} is a decentralized automation network for Web3, enabling developers to automate & relay arbitrary smart contract executions on and across EVM-based compatible blockchains. The network relies on a broad set of transaction relayers called [executors](https://docs.gelato.network/introduction/executor-operators){target=_blank} that are rewarded for the infrastructure and automation services they provide. Gelato is designed to be a more robust, decentralized, and cost-efficient alternative to running your own bot infrastructure.

Gelato is live on both Moonbeam and Moonriver, enabling developers and end-users to automate smart contract interactions with Gelato Ops and the Gelato Relay SDK. First, this guide will demonstrate a step-by-step tutorial to automating a smart contract interaction with Gelato Ops. Next, you'll interact with the Gelato Relay SDK via a hands-on demo.   

## Gelato Ops {: #gelato-ops }

[Gelato Ops](https://app.gelato.network/){target=_blank} is a front-end for interacting with the Gelato network and managing your transaction automation. There's no sign up or registration step - your account is tied directly to your wallet. In this guide, you'll deploy a signature Gelato ice cream NFT that can be licked via a function call. Then, you'll automate the lick function according to specific parameters.

![Gelato Ops 1](/images/builders/integrations/relayers/gelato/gelato-1.png)

### Try It Out {: #try-it-out }

To get started with this guide, you'll need to have some GLMR or MOVR in your free balance. Then, head to [Gelato Ops](https://app.gelato.network/tutorial){target=_blank} and ensure that your wallet is connected. To kick off the tutorial, you'll need to press **Mint NFT** and confirm the transaction in MetaMask. 

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

### Managing your Automated Tasks {: #managing-your-automated-tasks }

On [app.gelato.network](https://app.gelato.network/){target=_blank}, you'll see all of your automations and their associated statuses. You can click on an automation to see more details about the task and its execution history. Here you can also make any changes to the automated task, including pausing or resuming the task. To pause a task, press **Pause** in the upper right corner and confirm the transaction in your wallet. You can resume the automation at any time by pressing **Restart** and confirming the transaction in your wallet.

At the bottom of the page, you can see your task's execution history including the transaction status and the gas cost. Note, Gelato does not charge any fees - the only fees are gas costs. You can click on the **Task Logs** tab to see a detailed debugging level history of your automated tasks, which may be especially helpful in the event a transaction failed or did not execute.  

![Gelato Ops 3](/images/builders/integrations/relayers/gelato/gelato-3.png)

### Managing your Gas Funds {: #managing-your-gas-funds }

To manage your gas funds on [app.gelato.network](https://app.gelato.network/){target=_blank}, click on the **Funds** Box in the upper left corner. Here, you can top up your balance of gas funds or withdraw them. You can also register be notified with low balance alerts. 

To deposit funds for gas, take the following steps:

1. Click on the **Funds** Box in the upper left corner
2. Enter the amount of funds you'd like to deposit
3. Click **Deposit** and confirm the transaction in your wallet

You can follow a similar set of steps to withdraw your gas funds from Gelato. 

![Gelato Ops 4](/images/builders/integrations/relayers/gelato/gelato-4.png)

## Gelato Relay SDK {: #gelato-relay-sdk }

[Gelato Relay SDK](https://docs.gelato.network/developer-products/gelato-relay-sdk){target=_blank} is a collection of functions that enable you to interact with the Gelato Relay API. Per Gelato Docs, *Gelato Relay API is a service that allows users and developers to get transactions mined fast, reliably and securely, without having to deal with the low-level complexities of blockchains.* A key feature of this offering is the ability to provide users with gasless transactions. 

### Checking Prerequisites {: #checking-prerequisites }

Running this service locally through NPM requires Node.js to be installed. 

--8<-- 'text/common/install-nodejs.md'

### Installation {: #installation }

Gelato Relay SDK is an [NPM package](https://www.npmjs.com/package/@gelatonetwork/gelato-relay-sdk){target=_blank} that can be installed locally in the current directory with the following command:

```
npm install @gelatonetwork/gelato-relay-sdk
```

### Try out the Gelato Relay SDK {: #try-out-the-gelato-relay-sdk }
In this demo, we'll ask Gelato Relay SDK to call a `HelloWorld` smart contract on our behalf. Note, there is no dependency on RPC providers - once the transaction and signature are built, we simply pass it along to the Gelato Relay API. 

#### Setup
First, we need to import the Gelato Relay SDK and EthersJS:

```
  import { Wallet, utils } from "ethers";
  import { GelatoRelaySDK } from "@gelatonetwork/gelato-relay-sdk";
```

#### Define the ChainID and Target Contract:
Next, we'll define the chain ID and the [HelloWorld contract](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa){target=_blank} that we want to interact with.

```
  const chainId = 1284;
  // Hello World smart contract on Moonbeam
  const target = "0x3456E168d2D7271847808463D6D383D079Bd5Eaa";
```

#### Create a Test Account:
In this step, we'll create a new test account that will submit the gasless transaction. This account is insecure and should not be used in production. We've defined a test_token with a default value since we won't actually be submitting any real funds with this gasless transaction. 

```
  const test_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  // Create Mock wallet
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();
  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);
```


#### Add Request Data:

In this step we have to provide the ABI-encoded call data for the function we want to interact with. You can generate this by taking the following steps:

1. Navigate to the **Write Contract** heading of the [Hello World Contract on Moonscan](https://moonscan.io/address/0x3456E168d2D7271847808463D6D383D079Bd5Eaa#writeContract){target=_blank} 
2. Press  **Connect to Web3**. After you accept the terms and conditions, you can connect your wallet
3. Head to the `2. sayHiVanilla` function and provide the following default value for the `_feeToken` parameter: `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE`
4. Press **Write**
5. Without confirming the transaction in MetaMask, click on the **Hex** tab
6. Press **Copy Raw Transaction Data**

The resulting ABI-encodeded call data should look like `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`

![Gelato Relay SDK](/images/builders/integrations/relayers/gelato/gelato-5.png)

There are some additional parameters defined here, such as paymentType, maxFee, and gas limit. There are a variety of possible [payment types](https://docs.gelato.network/developer-products/gelato-relay-sdk/payment-types){target=_blank} you can choose from. For simplicity, replay protection has not been considered in this example. 

```
  // abi encode for HelloWorld.sayHiVanilla(address _feeToken)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;
  // Async Gas Tank payment model (won't be enforced on testnets, 
  // hence no need to deposit into Gelato's Gas Tank smart contract)
  const paymentType = 1;
  // Maximum fee that sponsor is willing to pay worth of test_token
  const maxFee = "1000000000000000000";
  // Gas limit
  const gas = "200000";
  // We do not enforce smart contract nonces to simplify the example.
  // In reality, this decision depends whether or not target
  // address already implements replay protection. (More info in the docs)
  const sponsorNonce = 0;
  const enforceSponsorNonce = false;
  // Only relevant when enforceSponsorNonce=true
  const enforceSponsorNonceOrdering = false;
```

#### Putting it All Together

The last few steps are building the request object, hashing it, and finally, signing it. The last step is to submit the request and the signature to the Gelato Relay API. You can copy and paste the below code into a javascript file. You can name the file `hello-world.js` or a similar name. 

```
import { Wallet, utils } from "ethers";
import { GelatoRelaySDK } from "@gelatonetwork/gelato-relay-sdk";

const forwardRequestExample = async () => {

  const chainId = 1284;
  // Hello World smart contract on Moonbeam
  const target = "0x3456E168d2D7271847808463D6D383D079Bd5Eaa";
  const test_token = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  
  // Create Mock wallet
  const wallet = Wallet.createRandom();
  const sponsor = await wallet.getAddress();
  console.log(`Mock PK: ${await wallet._signingKey().privateKey}`);
  console.log(`Mock wallet address: ${sponsor}`);
  
  // abi encode for HelloWorld.sayHiVanilla(address _feeToken)
  const data = `0x4b327067000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeaeeeeeeeeeeeeeeeee`;
  
  // Async Gas Tank payment model (won't be enforced on testnets, 
  // hence no need to deposit into Gelato's Gas Tank smart contract)
  const paymentType = 1;
  // Maximum fee that sponsor is willing to pay worth of test_token
  const maxFee = "1000000000000000000";
  // Gas limit
  const gas = "200000";
 
  // We do not enforce smart contract nonces to simplify the example.
  // In reality, this decision depends whether or not target 
  // address already implements replay protection. (More info in the docs)
  const sponsorNonce = 0;
  const enforceSponsorNonce = false;
  // Only relevant when enforceSponsorNonce=true
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

  // Sign digest using Mock private key
  const sponsorSignature = utils.BytesLike = utils.joinSignature(
    await wallet._signingKey().signDigest(digest)
  );

  // Send forwardRequest and its sponsorSignature to Gelato Relay API
  await GelatoRelaySDK.sendForwardRequest(forwardRequest, sponsorSignature);

  console.log("ForwardRequest submitted!");

};

forwardRequestExample();
```

To execute the script and dispatch the gasless transaction to Gelato Relay API, use the following command: 

```
node hello-world.js
```

You should see a message logged to the console that says `ForwardRequest submitted!` You can also verify your relayed transaction was successfully executed by checking the latest transactions of [this Gelato contract on Moonscan](https://moonscan.io/address/0x91f2a140ca47ddf438b9c583b7e71987525019bb){target=_blank}.


--8<-- 'text/disclaimers/third-party-content.md'