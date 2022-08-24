---
title: Bobabeam
description: Bobabeam is a compute-focused, Optimistic Layer Two (L2) Deployment on Moonbeam. Follow this tutorial to connect to Bobabeam.
---

# Get Started with Bobabeam

![Bobabeam Banner](/images/builders/get-started/networks/bobabeam/bobabeam-banner.png)

## Introduction {: #introduction }

[Boba](https://boba.network/){target=_blank} is a compute-focused Layer 2 (L2) built on the Optimistic Rollup developed by [Optimism](https://www.optimism.io/){target=_blank}. Boba augments the compute capabilities of EVM-compatible blockchains with a variety of features including [Turing hybrid compute](https://docs.boba.network/turing/turing){target=_blank}. After launching on Ethereum, Boba has brought its Layer 2 scaling solution to Moonbeam. [Bobabase](/builders/get-started/networks/layer2/bobabase){target=_blank} is the name of Boba's TestNet deployment on Moonbeam, while Bobabeam refers to Boba's MainNet deployment on Moonbeam.

## Network Endpoints {: #network-endpoints }

--8<-- 'text/endpoints/bobabeam.md'

## Quick Start {: #quick-start } 

It's easy to get started building on Bobabeam. If you're using the Web3.js library, you can create a local Web3 instance and set the provider to connect to Bobabeam (both HTTP and WS are supported):

```js
const Web3 = require('web3'); // Load Web3 library

// Create local Web3 instance - set Bobabeam as provider
const web3 = new Web3('{{ networks.bobabeam.rpc_url }}');
```

For the Ethers.js library, define the provider by using `ethers.providers.StaticJsonRpcProvider(providerURL, {object})` and setting the provider URL to Bobabeam:

```js
const ethers = require('ethers'); // Load Ethers library

const providerURL = '{{ networks.bobabeam.rpc_url }}';

// Define provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: {{ networks.bobabeam.chain_id }},
    name: 'bobabeam'
});
```

For more detailed tutorials on working with Ethers.js and Web3.js, head to [Ethereum API Libraries](/builders/build/eth-api/libraries/){target=_blank}. Any Ethereum wallet should be able to generate a valid address for Bobabeam (for example, [MetaMask](https://metamask.io/){target=_blank}).

## Chain ID {: #chain-id } 

Bobabeam chain ID is: `{{ networks.bobabeam.chain_id }}`, which is `{{ networks.bobabeam.hex_chain_id }}` in hex.

## Block Explorer {: #block-explorer}

The Bobabeam block explorer is an [instance of Blockscout]({{ networks.bobabeam.block_explorer }}){target=_blank}.

## Connect MetaMask {: #connect-metamask }

If you already have MetaMask installed, you can easily connect MetaMask to Bobabeam:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="bobabeam">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Bobabeam as a custom network. Once you approve permissions, MetaMask will switch your current network to Bobabeam.

If you do not have MetaMask installed, or would like to follow a tutorial to get started, please check out the [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/){target=_blank} guide.

## Bridge from Moonbeam to Bobabeam {: #bridge-from-moonbeam-to-bobabeam }

[Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank} enables you to bridge various assets to and from Bobabeam. To bridge assets from Moonbeam to Bobabeam, take the following steps:

1. Head to [Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank} and press **Connect**
2. Click on **Moonbase Wallet** in the upper left corner 
3. Next to the asset you'd like to bridge, press **Bridge to L2**
4. Enter the amount you'd like to bridge and press **Bridge**
5. Confirm the transaction in MetaMask
6. Your funds will be available shortly on Bobabeam. To confirm arrival, click on **Boba Wallet** in the upper left corner or look up your account on [Bobabeam explorer]({{ networks.bobabeam.block_explorer }}){target=_blank}

![Bridge to Bobabeam](/images/builders/get-started/networks/bobabeam/bobabeam-1.png)

Before you can make a transaction on Bobabeam, you'll need to have at least 1 BOBA. You can perform a gasless swap to exchange GLMR for BOBA by pressing **Emergency Swap** and signing the resulting signature request in MetaMask. To learn more about paying for gas on Bobabeam, see [Changing your Gas Fee Token](#changing-your-gas-fee-token).

## Bridge from Bobabeam to Moonbeam {: #bridge-from-bobabeam-to-moonbeam }

[Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank} enables you to bridge various assets to and from Bobabeam. Note, when bridging from Bobabeam to Moonbeam, there is a {{ networks.bobabeam.exit_delay_period_days }}-day delay before your funds are available. This delay is an inherent safety feature of the optimistic rollup architecture and applies only when bridging from Bobabeam back to Moonbeam. There is a bridge fee of 10 BOBA when bridging from Bobabeam to Moonbeam, so ensure you have a sufficient balance of BOBA before initiating a bridge transfer. To bridge assets from Bobabeam to Moonbeam, take the following steps:

1. Head to [Bobabeam Gateway]({{ networks.bobabeam.gateway }}){target=_blank} and press **Connect**
2. Click on **Boba Wallet** in the upper left corner
3. Next to the asset you'd like to bridge, press **Bridge to L1** 
4. Enter the amount you'd like to bridge and press **Bridge**
5. Confirm the transaction in MetaMask
6. Your funds will be available on Moonbeam in {{ networks.bobabeam.exit_delay_period_days }} days. Note, there is no follow up claim transaction necessary, Boba automatically handles this step on your behalf

![Bridge to Moonbeam](/images/builders/get-started/networks/bobabeam/bobabeam-2.png)

## Changing your Gas Fee Token {: #changing-your-gas-fee-token }

Either GLMR or BOBA can be used to pay for gas for transactions on Bobabeam. Note that in either case, the token you use for gas must be located on the Bobabeam network. See [Bridge from Moonbeam to Bobabeam](#bridge-from-moonbeam-to-bobabeam) to learn how to bridge GLMR or BOBA to Bobabeam. By default, the selected gas fee token is set to BOBA. To change it to GLMR, take the following steps:

1. Press the **Fee** dropdown at the top right
2. Click on **GLMR** or **BOBA** to select the new gas fee token 
3. Confirm the transaction in MetaMask

![Change gas fee token](/images/builders/get-started/networks/bobabeam/bobabeam-3.png)