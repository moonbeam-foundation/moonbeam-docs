---
title: Mint a Cross-Chain NFT with Axelar
description: In this step-by-step tutorial, you'll learn how to use the Axelar SDK to send a message from Moonbeam to another connected chain to remotely mint an NFT.
---

# Minting a Cross-Chain NFT with the Axelar SDK
_by Jeremy Boetticher & Kevin Neilson_

## Introduction {: #introduction }

Axelar’s [general message passing (GMP)](https://docs.axelar.dev/dev/general-message-passing/overview){target=\_blank} allows smart contracts to communicate securely across chains. This enables developers to build cross-chain connected applications on Moonbeam that can tap into functionality from Polkadot, Ethereum, Avalanche, Cosmos, and beyond. In this tutorial, we'll introduce the JavaScript SDK package that Axelar packed with tools to aid developers in this cross-chain vision.

The [AxelarJS SDK](https://github.com/axelarnetwork/axelarjs-sdk){target=\_blank}  allows developers to estimate fees, track and recover transactions, and easily transfer tokens. To show off some of the tools that the SDK provides, we will walk through a demo that deploys an NFT that can be minted across chains. Before following along with the tutorial, you may wish to first familiarze yourself with this [Overview of Axelar](/builders/interoperability/protocols/axelar/){target=\_blank}.

In this tutorial, we'll be minting an NFT on a remote chain by using Axelar to send a specific message to trigger the mint. We'll be using the AxelarJS SDK in conjunction with a minting script that will define the parameters of the cross-chain mint, such as the destination chain, destination contract address, and more.
 
--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Axelar Refresher {: #axelar-refresher }

[Axelar](https://axelar.network/){target=\_blank} is a blockchain that connects blockchains, delivering secure cross-chain communication. Every validator in Axelar’s network runs light nodes on chains that Axelar supports. This dynamic validator set achieves consensus to confirm that messages are being sent from one chain to another by monitoring each chain’s Axelar Gateway contract, which is one of the two Axelar contracts we will be interacting with later in the demo. 

![Axelar Diagram](/images/tutorials/interoperability/axelar-sdk/axelar-1.webp)

The other contract we will be working with is the [Axelar Gas Receiver microservice](https://docs.axelar.dev/learn#gas-receiver){target=\_blank}. Whenever you use the Axelar Gateway to send a cross-chain transaction, the Gas Receiver lets you pay for the subsequent transaction on the destination chain. While not necessary, it allows the end user to only send one transaction to automatically update the destination chain, and to pay all transaction fees in the source-chain token they already hold.

## Building the Cross-Chain NFT Contract {: #building-the-cross-chain-nft-contract } 

We'll be deploying a [simple contract](https://github.com/jboetticher/axelar-sdk-demo/blob/main/contracts/CrossChainNFT.sol){target=\_blank} that can only mint an NFT if it receives a specific cross-chain message. Minting the NFT will require a token payment, which will be wrapped DEV (Moonbase Alpha’s native currency). A wrapped token for a native currency like DEV will mint one ERC-20 WDEV token for every one DEV sent to it, and gives the option to redeem one WDEV token for one DEV. Using WDEV instead of native DEV is required because Axelar requires all tokens sent to be ERC-20s.

So to mint in the cross-chain message, it must receive at least 0.05 WDEV.

We’re putting the same contract on two chains, so it has to both send and receive messages. From a high level, our contract does two things:

1. Send an encoded address message with WDEV across chains via Axelar’s Gateway with the option to pay for its gas on the destination chain
2. Receive an encoded address message from Axelar, and execute only if it received at least 0.05 WDEV

You’ll be using a Hardhat project, but before we set it up, let’s first take a look at a few parts of the contract. I encourage you to follow along!

Contracts that can be executed by the Axelar Gateway, like ours here, inherit from [IAxelarExecutable](https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/executable/AxelarExecutable.sol){target=\_blank}. This parent contract has two overridable functions, `_execute` and `_executeWithToken`, that allow developers to change the logic when a contract receives a contract call from the Axelar Gateway. Both functions have the same inputs, but `_executeWithToken` also includes tokenSymbol and amount to describe the token being sent cross-chain.

Now let’s finally take a look at our mint function. It takes three inputs: a destination address, a destination chain, and the amount of WDEV to send. Remember that this mint function is called on the origin chain (Moonbase Alpha), and causes an NFT to be minted on a different destination chain.

???+ code "mintXCNFT function"

    ```solidity
    --8<-- 'code/tutorials/interoperability/axelar-sdk/mintXCNFT.sol'
    ```

The logic itself has three steps. First, it takes WDEV from the caller. The caller will have to approve our NFT contract to transfer their WDEV beforehand. Then our NFT contract approves the gateway to transfer the WDEV that it takes from the caller since the gateway contract will try to transfer the tokens from our NFT contract in the final step.

Next, to pay for gas on the destination chain, we make use of the [IAxelarGasService contract](https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarGasService.sol){target=\_blank}. This contract has many [different configurations to pay for gas](https://docs.axelar.dev/dev/gas-service/pricing){target=\_blank}, like paying for [`execute`](https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/executable/AxelarExecutable.sol#L17-L29){target=\_blank} versus [`executeWithToken`](https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/executable/AxelarExecutable.sol#L31-L53){target=\_blank} or using an ERC-20 token as payment versus using native currency. Be careful if you plan on writing your own contract later!

In this case, since the origin chain is Moonbase Alpha, the native currency is DEV. We can use native DEV to pay for gas on the destination chain, based on the conversion rates between Moonbase Alpha’s native currency and the destination chain’s native currency. Since we’re sending a contract call that includes a token and plan on paying for destination gas in DEV, we will be using the `payNativeGasForContractCallWithToken` function.

Finally, we call the gateway to send our cross-chain message with `callContractWithToken`. Notice that the payload (generic data that can be sent in a cross-chain call) that we’re sending is just the caller’s address. This data will need to be decoded by the destination contract.

Now let’s take a look at what happens on the destination chain. Since we’re expecting tokens to be sent as payment for an NFT mint, we will override `_executeWithToken` from `IAxelarExecutable`.

???+ code "executeWithToken function"

    ```solidity
    --8<-- 'code/tutorials/interoperability/axelar-sdk/executeWithToken.sol'
    ```

In our implementation of `_executeWithToken`, we first check to make sure that the tokenSymbol provided by Axelar is “WDEV”. Then we expect 0.05 WDEV tokens for payment, and will revert if any other token or anything less than 0.05 WDEV gets sent. Afterwards we decode the payload to get the address of the origin chain’s caller so that we can mint an NFT to that address. Finally, we finish the minting!

You can find the full code for the `CrossChainNFT.sol` below.

??? code "CrossChainNFT.sol"

    ```solidity
    --8<-- 'code/tutorials/interoperability/axelar-sdk/CrossChainNFT.sol'
    ```


## Setting Up the Repository {: #setting-up-the-repository} 

Make sure to clone the [Github Repository](https://github.com/jboetticher/axelar-sdk-demo/tree/main){target=\_blank} for this tutorial. We need to install some dependencies, including Hardhat, OpenZeppelin contracts, some Axelar contracts, and the Axelar SDK. To configure the dependencies properly, run the following command:

```bash
npm install
```

The repository contains two solidity files. The first file is the CrossChainNFT as expected, and the second is an Axelar library `StringAddressUtils.sol` that doesn’t have an npm package yet, but is still required for the Hardhat implementation.

There are also four Hardhat scripts within the repository’s scripts folder.

- `axelarStatus.js`: a Hardhat task that lets you view information about Axelar transactions
- `deploy.js`: deploys the CrossChainNFT to the network provided by Hardhat
- `gatewayGasReceiver.js`: returns hardcoded values for Axelar’s Gateway and gas service contracts
- `mint.js`: mints the CrossChainNFT (only run on Moonbase Alpha)

Before we get into the fun part, you will need to get an account with a [private key funded with DEV](https://faucet.moonbeam.network/){target=\_blank} to deploy the contract and sign all future transactions. Place this within a `secrets.json` file within the repository’s main directory. It should be formatted like so:

```json
{
"privateKey":"INSERT-PRIVATE-KEY"
}
```

If everything goes well, you will be able to compile correctly:

```bash
npx hardhat compile
```

## Deploying the Cross-Chain Contract to Moonbase Alpha {: #deploying-the-cross-chain-contract-to-moonbase-alpha} 

This demo focuses on using the scripts, so it’s best to take a look at them, starting with `deploy.js`, which is similar to example Ethers.js deployment contracts.

`gatewayGasReceiver.js` stores many of the contract addresses in this repo, which are necessary for the deployment. You likely will not have to change any of the hardcoded addresses. Try deploying your contract to the origin chain:

```bash
npx hardhat run scripts/deploy.js --network moonbase
```

You should see the address deployed and printed in the console. Be sure to copy it! You will need it for interacting with the next script. You also need to deploy it to the destination chain. The choice of which destination network to use is up to you, but you will need its native currency to deploy. I’ve included some of the available networks and their faucets here:

|                                 Network                                  |                   Deployment Command                   |
|:------------------------------------------------------------------------:|:------------------------------------------------------:|
|       [Sepolia](https://sepolia-faucet.pk910.de/){target=\_blank}        | `npx hardhat run scripts/deploy.js --network ethereum` |
|           [Polygon Mumbai](https://faucet.polygon.technology/)           |  `npx hardhat run scripts/deploy.js --network mumbai`  |
| [Avalanche Fuji](https://core.app/tools/testnet-faucet/){target=\_blank} |   `npx hardhat run scripts/deploy.js --network fuji`   |
|     [Fantom Testnet](https://faucet.fantom.network/){target=\_blank}     |  `npx hardhat run scripts/deploy.js --network fantom`  |

After running a deployment command, you'll see output like the below. Be sure to copy and destination chain's contract address, because you'll need to provide that in a later step. 

--8<-- 'code/tutorials/interoperability/axelar-sdk/terminal/deploy.md'

## Building the Mint.js Script {: #building-the-mint-js-script}

The minting contract is quite exciting, and will require Axelar’s SDK. At the top of the script, Ethers.js is initialized in a Hardhat script. The Axelar SDK is also initialized. There are multiple Axelar APIs available in the SDK, but in this case we will only be using the AxelarQueryAPI sinceit includes all of the gas estimation functionality that we’ll need for paying gas fees across chains. 

```js
--8<-- 'code/tutorials/interoperability/axelar-sdk/mint-1.js'
```

There are also some constants for you to change right after. This walkthrough is using Fantom as the destination chain, but you can use whichever chains you deployed to. Note that even though we’re using a testnet environment, the chain names are still their mainnet equivalents, hence why the origin chain is “MOONBEAM” and not “MOONBASE”.

```js
--8<-- 'code/tutorials/interoperability/axelar-sdk/mint-2.js'
```

Next, we have to work with wrapped DEV to send across chains. First, we must wrap our DEV and then we approve the contract on the origin chain to take some of our WDEV. This is necessary because the origin chain’s contract has to send your WDEV to pay for minting the NFT on the destination chain.

Note here that instead of hardcoding the WDEV contract address, we’re using the IAxelarGateway contract to find the address. We could have also done this in the smart contract itself, but I wanted to show off how you would do it with Ethers.js. As expected, we sign two transactions: first to wrap 0.13 WDEV, then to approve our CrossChainNFT contract to send that WDEV.

You may be wondering why we’re wrapping 0.13 WDEV when the price of the mint is only 0.05. At time of writing, Axelar collects a small fee (0.08 WDEV in this case) when transferring tokens between networks, which can be calculated on their website. This is done automatically by the gateways, but this responsibility may be delegated to theIAxelarGasService contract in the future.

```js
--8<-- 'code/tutorials/interoperability/axelar-sdk/mint-3.js'
```

Now we have to estimate the amount of DEV that we send to the mintXCNFT function to pay for gas on the destination chain. This is where the Axelar SDK kicks in.

We must estimate the amount of gas to spend on the destination chain, because it is difficult to estimate a function that can only be called by a specific contract. In this case, we overestimate the amount of gas we will spend as 400,000. In an actual production environment, you may want to benchmark the amount of gas that you spend. However, if you do end up overestimating by a lot, you will get refunded by Axelar’s gas services.

The estimateGasFee function provided by the Axelar SDK will find the conversion between the origin chain’s native currency and the destination chain’s native currency to find the right amount to send to the destination chain.

You, the astute reader, might wonder why we’re using “GLMR” instead of “DEV”. Similar to how Axelar uses the mainnet chain names instead of using the testnet names, Axelar will interpret “GLMR” as “DEV” since we’re using the testnet environment.

```js
--8<-- 'code/tutorials/interoperability/axelar-sdk/mint-4.js'
```

Calling this function from the SDK will return a string that represents the amount of DEV WEI to pay, like `241760932800000`. That’s hard for us simple humans to understand, so we use Ethers.js to convert it into a more human-readable version to print to the console later.

```js
--8<-- 'code/tutorials/interoperability/axelar-sdk/mint-5.js'
```

Finally, we call the mintXCNFT contract function. The important takeaway here is that we’re sending the gasFee not as a gas limit, but as value. Ethers.js can calculate how much gas to send on the origin chain, but to pay for the destination chain, we have to calculate with the Axelar SDK and send it as value to the IAxelarGasReceiver contract.

```js
--8<-- 'code/tutorials/interoperability/axelar-sdk/mint-6.js'
```

That’s the entire script! Before we run the script, check again to make sure that the four constants (ORIGIN_CHAIN, DESTINATION_CHAIN, ORIGIN_CHAIN_ADDRESS, DESTINATION_CHAIN_ADDRESS) at the top of the script are set correctly.

Here’s the command to mint your NFT!

```bash
npx hardhat run scripts/mint.js --network moonbase
```

The console should output something similar to this:

--8<-- 'code/tutorials/interoperability/axelar-sdk/terminal/mint.md'

The most important data here is the minting transaction because that’s how you track the status of your transaction. So don’t lose it! But if you do, you can look at all of the recent transactions on Axelar’s testnet scanner.

## Viewing Axelar Transaction Status {: #viewing-axelar-transaction-status}

Axelar has a [testnet explorer](https://testnet.axelarscan.io/gmp/search){target=\_blank}, and a successful transaction for the interaction you just completed would look something like this:

![Axelar Image 2](/images/tutorials/interoperability/axelar-sdk/axelar-2.webp)

But it would be good practice to try to use the SDK to view the status of your transactions because it gives more information about your transaction and any possible errors. To do this, I wrote a Hardhat task for us to use. You can view the code in axelarStatus.js, but we’ll take a dive here too.

The main meat of the code is in these 5 lines. First, we initialize the SDK module that we will be using, the AxelarGMPRecoveryAPI. Unlike the AxelarQueryAPI that we used in the minting script, the AxelarGMPRecoveryAPI helps track and recover stalled transactions. All we have to do next is query for the transaction status and the SDK takes care of it for us.

```js
--8<-- 'code/tutorials/interoperability/axelar-sdk/query.js'
```

You can learn a bit more about the AxelarGMPRecoveryAPI in [Axelar’s documentation](https://docs.axelar.dev/dev/axelarjs-sdk/tx-status-query-recovery){target=\_blank}. It includes additional functionality in case a transaction goes wrong, especially if there isn’t enough gas sent along with the cross-chain transaction.

To run the script, run the following command, where “INSERT_TRANSACTION_HASH” is the transaction of hash on the origin chain that you sent a cross-chain message in:

```bash
npx hardhat run scripts/mint.js --network INSERT_TRANSACTION_HASH
```

If you run the Hardhat script, you’ll end up with something like this in your console (I didn’t include all of it since it’s so large). You’re likely most interested in the status, where a list of possible ones is in [Axelar’s documentation](https://docs.axelar.dev/dev/axelarjs-sdk/tx-status-query-recovery#query-transaction-status-by-txhash){target=\_blank}. You’re looking for destination_executed to indicate that it was received and executed correctly, but if you’re too early you might find source_gateway_called or destination_gateway_approved.


![Axelar Image 3](/images/tutorials/interoperability/axelar-sdk/axelar-3.webp)


You can learn more about debugging contracts in [Axelar’s documentation](https://docs.axelar.dev/dev/general-message-passing/debug/error-debugging){target=\_blank}, where they go into depth on specific error messages and how to use tools like Tenderly for logic errors.

## Conclusion {: #conclusion}

You’re well on your way to creating your own connected contracts with Axelar! Learn more about Axelar on their [docs site](https://docs.axelar.dev/){target=\_blank}, and read about how Moonbeam is shaping up to be the leader in blockchain interoperability in our introduction to connected contracts. For more information on the AxelarJS SDK, be sure to check out the [Axelar Docs](https://docs.axelar.dev/dev/axelarjs-sdk/intro){target=\_blank}.

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'