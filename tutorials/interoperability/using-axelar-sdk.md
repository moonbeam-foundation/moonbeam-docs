---
title: Mint a Cross-Chain NFT as a Connected Contract with Axelar
description: In this step-by-step tutorial, you'll learn how to use the Axelar SDK to send a message from Moonbeam to another connected chain to remotely mint an NFT.
---

# Minting a Cross-Chain NFT with the Axelar SDK
_by Jeremy Boetticher & Kevin Neilson_

## Introduction {: #introduction }

Axelar’s [general message passing (GMP)](https://docs.axelar.dev/dev/general-message-passing/overview){target=\_blank} allows smart contracts to communicate securely across chains. This enables developers to build cross-chain connected applications on Moonbeam that can tap into functionality from Polkadot, Ethereum, Avalanche, Cosmos, and beyond. In this blog, we'll introduce the JavaScript SDK package that Axelar packed with tools to aid developers in this cross-chain vision.

The [AxelarJS SDK](https://github.com/axelarnetwork/axelarjs-sdk){target=\_blank}  allows developers to estimate fees, track and recover transactions, and easily transfer tokens. To show off some of the tools that the SDK provides, we will walk through a demo that deploys an NFT that can be minted across chains. Before following along with the tutorial, you may wish to first familiarze yourself with this [Overview of Axelar](builders/interoperability/protocols/axelar/)

In this tutorial, we'll be minting an NFT on a remote chain by using Axelar to send a specific message to trigger the mint. We'll be using the AxelarJS SDK in conjunction with a minting script that will define the parameters of the cross-chain mint, such as the destination chain, destination contract address, and more.
 

## Axelar Refresher {: #axelar-refresher }

[Axelar](https://axelar.network/){target=\_blank} is a blockchain that connects blockchains, delivering secure cross-chain communication. Every validator in Axelar’s network runs light nodes on chains that Axelar supports. This dynamic validator set achieves consensus to confirm that messages are being sent from one chain to another by monitoring each chain’s Axelar gateway contract, which is one of the two Axelar contracts we will be interacting with later in the demo. 

![Axelar Diagram](/images/tutorials/interoperability/axelar-sdk/axelar-1.webp)

The other contract we will be working with is the Axelar Gas Receiver microservice. Whenever you use the Axelar gateway to send a cross-chain transaction, IAxelarGasReceiver lets you pay for the subsequent transaction on the destination chain. While not necessary, it allows the end user to only send one transaction to automatically update the destination chain, and to pay all transaction fees in the source-chain token they already hold.

## Building the Cross-Chain NFT Contract {: #building-the-cross-chain-nft-contract } 

We'll be deploying a [simple contract](https://github.com/jboetticher/axelar-sdk-demo/blob/main/contracts/CrossChainNFT.sol){target=\_blank} that can only mint an NFT if it receives a specific cross-chain message. Minting the NFT will require a token payment, which will be wrapped DEV (Moonbase Alpha’s native currency). A wrapped token for a native currency like DEV will mint one ERC-20 WDEV token for every one DEV sent to it, and gives the option to redeem one WDEV token for one DEV. Using WDEV instead of native DEV is required because Axelar requires all tokens sent to be ERC-20s.

So to mint in the cross-chain message, it must receive at least 0.05 WDEV.

We’re putting the same contract on two chains, so it has to both send and receive messages. From a high level, our contract does two things:

1. Send an encoded address message with WDEV across chains via Axelar’s gateway with the option to pay for its gas on the destination chain
2. Receive an encoded address message from Axelar, and execute only if it received at least 0.05 WDEV

You’ll be using a Hardhat project instead of using Remix, but before we set up let’s first take a look at a few parts of the contract. I encourage you to follow along!

Contracts that can be executed by the Axelar gateway, like ours here, inherit from [IAxelarExecutable](https://github.com/axelarnetwork/axelar-gmp-sdk-solidity/blob/main/contracts/executable/AxelarExecutable.sol){target=\_blank}. This parent contract has two overridable functions, `_execute` and `_executeWithToken`, that allow developers to change the logic when a contract receives a contract call from the Axelar gateway. Both functions have the same inputs, but `_executeWithToken` also includes tokenSymbol and amount to describe the token being sent cross-chain.

Now let’s finally take a look at our mint function. It takes three inputs: a destination address, a destination chain, and the amount of WDEV to send. Remember that this mint function is called on the origin chain (Moonbase Alpha), and causes an NFT to be minted on a different destination chain.

The logic itself has three steps. First, it takes WDEV from the caller. The caller will have to approve our NFT contract to transfer their WDEV beforehand. Then our NFT contract approves the gateway to transfer the WDEV that it takes from the caller since the gateway contract will try to transfer the tokens from our NFT contract in the final step.

Next, to pay for gas on the destination chain, we make use of the [IAxelarGasService contract](https://github.com/axelarnetwork/axelar-cgp-solidity/blob/main/contracts/interfaces/IAxelarGasService.sol){target=\_blank}. This contract has many [different configurations to pay for gas](https://docs.axelar.dev/dev/gas-service/pricing){target=\_blank}, like paying for execute versus executeWithToken or using an ERC-20 token as payment versus using native currency. Be careful if you plan on writing your own contract later!

In this case, since the origin chain is Moonbase Alpha, the native currency is DEV. We can use native DEV to pay for gas on the destination chain, based on the conversion rates between Moonbase Alpha’s native currency and the destination chain’s native currency. Since we’re sending a contract call that includes a token and plan on paying for destination gas in DEV, we will be using the payNativeGasForContractCallWithToken function.

Finally, we call the gateway to send our cross-chain message with callContractWithToken. Notice that the payload (generic data that can be sent in a cross-chain call) that we’re sending is just the caller’s address. This data will need to be decoded by the destination contract.


```solidity
--8<-- 'code/tutorials/interoperability/axelar-sdk/mintXCNFT.sol'
```

Now let’s take a look at what happens on the destination chain. Since we’re expecting tokens to be sent as payment for an NFT mint, we will override `_executeWithToken` from IAxelarExecutable.

In our implementation of `_executeWithToken`, we first check to make sure that the tokenSymbol provided by Axelar is “WDEV”. Then we expect 0.05 WDEV tokens for payment, and will revert if any other token or anything less than 0.05 WDEV gets sent. Afterwards we decode the payload to get the address of the origin chain’s caller so that we can mint an NFT to that address. Finally, we finish the minting!

```solidity
--8<-- 'code/tutorials/interoperability/axelar-sdk/executeWithToken.sol'
```

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

The repository contains two solidity files. The first file is the CrossChainNFT as expected, and the second is an Axelar library StringAddressUtils.sol that doesn’t have an npm package yet, but is still required for the Hardhat implementation.

There are also four Hardhat scripts within the repository’s scripts folder.

- axelarStatus.js: a Hardhat task that lets you view information about Axelar transactions
- deploy.js: deploys the CrossChainNFT to the network provided by Hardhat
- gatewayGasReceiver.js: returns hardcoded values for Axelar’s gateway and gas service contracts
- mint.js: mints the CrossChainNFT (only run on Moonbase Alpha)

Before we get into the fun part, you will need to get an account with a [private key funded with DEV](https://faucet.moonbeam.network/){target=\_blank} to deploy the contract and sign all future transactions. Place this within a secrets.json file within the repository’s main directory. It should be formatted like so:

```json
{
"privateKey":"INSERT-PRIVATE-KEY"
}
```

If everything goes well, you will be able to compile correctly:

```bash
npx hardhat compile
```

## Deploying the Cross-Chain Contract on Moonbase Alpha

This demo focuses on using the scripts, so it’s best to take a look at them, starting with deploy.js, which is similar to example Ethers.js deployment contracts.

`gatewayGasReceiver.js` stores many of the contract addresses in this repo, which are necessary for the deployment. You likely will not have to change any of the hardcoded addresses. Try deploying your contract to the origin chain:

```bash
npx hardhat run scripts/deploy.js --network moonbase
```

You should see the address deployed and printed in the console. Be sure to copy it! You will need it for interacting with the next script. You also need to deploy it to the destination chain. The choice of which destination network to use is up to you, but you will need its native currency to deploy. I’ve included some of the available networks and their faucets here:

| Network |                                                                          Deployment Command                                                                           |
|:-----------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|    [Sepolia](https://sepolia-faucet.pk910.de/){target=\_blank}    | `npx hardhat run scripts/deploy.js --network ethereum` |
|    [Polygon Mumbai](https://faucet.polygon.technology/)    | `npx hardhat run scripts/deploy.js --network mumbai`  |
|    [Avalanche Fuji](https://core.app/tools/testnet-faucet/){target=\_blank}     | `npx hardhat run scripts/deploy.js --network fuji`  |
|    [Fantom Testnet](https://faucet.fantom.network/){target=\_blank}    | `npx hardhat run scripts/deploy.js --network fantom` |


![Axelar Image 2](/images/tutorials/interoperability/axelar-sdk/axelar-2.webp)

--8<-- 'code/tutorials/interoperability/axelar-sdk/terminal/deploy.md'

![Axelar Image 3](/images/tutorials/interoperability/axelar-sdk/axelar-3.webp)

--8<-- 'text/_disclaimers/third-party-content-intro.md'



For more information on the AxelarJS SDK, be sure to check out the [Axelar Docs](https://docs.axelar.dev/dev/axelarjs-sdk/intro){target=\_blank}

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'