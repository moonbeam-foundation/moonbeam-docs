---
title: Moonbase Alpha Get Started Guide
description: The Moonbeam TestNet, named Moonbase Alpha, is the easiest way to get started with a Polkadot environment. Follow this tutorial to connect to the TestNet.
---

# Get Started with Moonbase Alpha

--8<-- 'text/testnet/connect.md'

## Block Explorers

For Moonbase Alpha, you can use any of the following block explorers:

 - **Ethereum API (Etherscan Equivalent)** — [Moonscan](https://moonbase.moonscan.io/){target=_blank}
 - **Ethereum API with Indexing** — [Blockscout](https://moonbase-blockscout.testnet.moonbeam.network/){target=_blank}
 - **Ethereum API JSON-RPC based** — [Moonbeam Basic Explorer](https://moonbeam-explorer.netlify.app/?network=MoonbaseAlpha){target=_blank}
 - **Substrate API** — [Subscan](https://moonbase.subscan.io/){target=_blank} or [Polkadot.js Apps](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fwss.api.moonbase.moonbeam.network#/explorer){target=_blank}
 
For more information on each of the available block explorers, please head to the [Block Explorers](/builders/get-started/explorers/) section of the documentation.

## Connect MetaMask

If you already have MetaMask installed, you can easily connect MetaMask to the Moonbase Alpha TestNet:

<div class="button-wrapper">
    <a href="#" class="md-button connectMetaMask" value="moonbase">Connect MetaMask</a>
</div>

!!! note
    MetaMask will popup asking for permission to add Moonbase Alpha as a custom network. Once you approve permissions, MetaMask will switch your current network to Moonbase Alpha.

If you do not have MetaMask installed, or would like to follow a tutorial to get started, please check out the [Interacting with Moonbeam using MetaMask](/tokens/connect/metamask/) guide.

## Get Tokens {: #get-tokens } 

To start building on Moonbase Alpha, you can get DEV tokens from the Moonbase Alpha Faucet or on Discord via a bot, named [Mission Control](https://discord.gg/PfpUATX). For specific amounts, you can always reach out directly to us via our community channels.

### Moonbase Alpha Faucet {: #moonbase-alpha-faucet }

You can enter your address to automatically request DEV tokens from the [Moonbase Alpha Faucet](https://apps.moonbeam.network/moonbase-alpha/faucet/){target=_blank} website. The faucet dispenses 5 DEV tokens every 24 hours.

### Discord - Mission Control {: #discord-mission-control } 

To request tokens automatically, we've created a Discord bot (named Mission Control :sunglasses:) that will automatically send a maximum of 1 DEV token every 24 hours (per Discord user) when you enter your address. You can check it out on our [Discord channel](https://discord.gg/PfpUATX).
 
Under the category **Miscellaneous**, you will find our **#Moonbase-Faucet** channel. 

![Moonbase faucet channel on Discord](/images/builders/get-started/networks/moonbase/moonbase-1.png)

To check your balance, enter the following message, replacing `<enter-address-here->` with your H160 address:

```
!balance <enter-address-here->
```

To get DEV tokens, enter the following message, replacing `<enter-address-here->` with your H160 address:
 
```
!faucet send <enter-address-here->
```

Mission Control will send you 1 DEV token and display your current account balance. Remember that Mission Control is limited to dispense once every 24 hours per Discord user.

![Faucet send command example](/images/builders/get-started/networks/moonbase/moonbase-2.png)

!!! note
    Moonbase Alpha DEV tokens have no value. Please don't spam the faucet with unnecessary requests.

## Demo DApps {: #Demo-DApps }

There are a variety of DApps deployed to Moonbase Alpha enabling you to experiment with various apps and integrations. You can also acquire a variety of test tokens through the [Moonbase ERC20 Minter](https://moonbase-minterc20.netlify.app/){target=_blank} or [Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank} DApps. For example, [Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank} can help you acquire cross chain assets such as xcUNITs or xcKarura for testing XCM related functions. In the below table, you'll find each sample DApp, its associated URL, and GitHub repository.

### Quick Links {: #quick-links }

|  DApp  | Description |                Repository                  |
|:------------:|:------------:|:-------------------------------------------------:|
| [Moonbase ERC-20 Minter](https://moonbase-minterc20.netlify.app/){target=_blank} | ERC-20 Faucet  |[https://github.com/PureStake/moonbase-mintableERC20](https://github.com/PureStake/moonbase-mintableERC20){target=_blank} |
| [Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank}  |  Uniswap V2 Fork  | [https://github.com/PureStake/moonbeam-uniswap](https://github.com/PureStake/moonbeam-uniswap){target=_blank}  |
| [MoonLink Dashboard](https://moonlink-dashboard.netlify.app/){target=_blank}  | Chainlink Demo  | [https://github.com/PureStake/moonlink-dashboard](https://github.com/PureStake/moonlink-dashboard){target=_blank}  |
| [MoonLotto Lottery](https://moonbase-moonlotto.netlify.app/){target=_blank}  | TheGraph Demo  | [Interface](https://github.com/PureStake/moonlotto-interface){target=_blank}, [Subgraph](https://github.com/PureStake/moonlotto-subgraph){target=_blank}  |
| [Moonbeam WalletConnect](https://moonbeam-walletconnect-demo.netlify.app/){target=_blank}  | WalletConnect Demo  | [https://github.com/PureStake/moonbeam-walletconnect-demo](https://github.com/PureStake/moonbeam-walletconnect-demo){target=_blank}  |
| [Moonbase ChainBridge](https://moonbase-chainbridge.netlify.app/transfer){target=_blank}  | ChainBridge Demo  | [https://github.com/PureStake/chainbridge-ui](https://github.com/PureStake/chainbridge-ui){target=_blank}  |
| [MoonGas](https://moonbeam-gasinfo.netlify.app/){target=_blank}  | Gas Price Tracker  | [https://github.com/albertov19/moonbeam-gas-station](https://github.com/albertov19/moonbeam-gas-station){target=_blank}  |


!!! note
    These DApps are intended for demonstration purposes only and may be incomplete or unsuitable for production deployments. 

### Moonbase ERC20 Minter {: #moonbase-erc20-minter } 

The [Moonbase ERC-20 Minter](https://moonbase-minterc20.netlify.app/){target=_blank} enables you to mint a variety of ERC-20 test tokens corresponding to the 8 planets of the solar system, and Pluto. To mint tokens, first press **Connect MetaMask** in the upper right hand corner. Then scroll to the **Mint Tokens** section and the choose desired ERC-20 contract. Press **Submit Tx** and confirm the transaction in MetaMask. Each mint will grant you 100 tokens, and you can mint tokens for each contract once per hour.

![ERC20 Minter](/images/builders/get-started/networks/moonbase/moonbase-3.png)

### Moonbeam Uniswap {: #moonbeam-uniswap } 

[Moonbeam Uniswap](https://moonbeam-swap.netlify.app/#/swap){target=_blank} is a fork of [Uniswap-V2](https://uniswap.org/blog/uniswap-v2){target=_blank} deployed to Moonbase Alpha. Notably, Moonbeam Uniswap allows developers to easily make a swap to acquire [cross chain assets](/builders/xcm/xc20/) such as xcKarura or xcUNITs for XCM testing purposes. To perform your first swap, take the following steps:

1. Press **Select a token** 
2. Connect your MetaMask wallet and ensure you're on the Moonbase Alpha network
3. Press **Choose a List** on the prompt
4. Select **Moon Menu** 
5. Search for or select your desired asset from the list then continue with the swap

![Moonbeam Swap](/images/builders/get-started/networks/moonbase/moonbase-4.png)

!!! note
    If you see only a partial list of assets under **Moon Menu**, your browser may have cached an older version of **Moon Menu**. Clearing the cache and re-adding **Moon Menu** will resolve this. 

### MoonLink Dashboard {: #moonlink-dashboard } 

The [MoonLink Dashboard](https://moonlink-dashboard.netlify.app/){target=_blank} showcases Chainlink price feeds in action. For more information, including a full listing of all Chainlink price feeds across all Moonbeam networks and a step-by-step guide of how to fetch price feed data, [head to the Oracles section of the Moonbeam Docs Site](/builders/integrations/oracles/chainlink/). You can also check out the [repository for the MoonLink Dashboard](https://github.com/PureStake/moonlink-dashboard){target=_blank}. 

![MoonLink Dashboard](/images/builders/get-started/networks/moonbase/moonbase-5.png)

### MoonLotto Lottery {: #moonlotto-lottery } 

[MoonLotto](https://moonbase-moonlotto.netlify.app/){target=_blank} is a simple lottery game on Moonbase Alpha derived from [The Graph's Example Subgraph](https://github.com/graphprotocol/example-subgraph){target=_blank}.  Purchasing a ticket costs 1 DEV and a winner is chosen each half hour if there are at least 10 participants. [MoonLotto.sol](https://github.com/PureStake/moonlotto-subgraph/blob/main/contracts/MoonLotto.sol){target=_blank} holds the contract logic for the lottery. To participate, take the following steps:

1. Connect your MetaMask wallet and ensure you're on the Moonbase Alpha network
2. Enter the address of the recipient of lotto ticket or check **I want to buy a ticket for my address**
3. Press **Submit on MetaMask** and confirm the transaction in MetaMask

![MoonLotto Lottery](/images/builders/get-started/networks/moonbase/moonbase-6.png)

### Moonbeam WalletConnect {: #moonbeam-walletconnect } 

[Moonbeam WalletConnect](https://moonbeam-walletconnect-demo.netlify.app/){target=_blank} shows how easy it is to integrate [WalletConnect](https://walletconnect.com/){target=_blank} into your DApps and unlock support for a great variety of crypto wallets. Be sure to check out the [demo app repository](https://github.com/PureStake/moonbeam-walletconnect-demo){target=_blank} to see exactly how the WalletConnect integration works. To get started, you can take the following steps:

1. Press **Connect Wallet**
2. Scan the QR code using a [wallet compatible with WalletConnect](https://walletconnect.com/registry?type=wallet){target=_blank}

![Moonbeam WalletConnect](/images/builders/get-started/networks/moonbase/moonbase-7.png)

### Moonbase ChainBridge {: #moonbase-chainbridge } 

[Moonbase ChainBridge](https://moonbase-chainbridge.netlify.app/transfer){target=_blank} enables you to bridge ERC-20 tokens from Moonbase Alpha to Ethereum's Rinkeby and Kovan testnets and vice versa. Be sure to check out [the step-by-step guide on using ChainBridge's Ethereum Moonbeam Bridge](/builders/integrations/bridges/chainbridge/){target=_blank} for more information on using ChainBridge's ERC-20, ERC-721, and Generic Handlers. You can also check out the [Moonbase ChainBridge repository](https://github.com/PureStake/chainbridge-ui){target=_blank}. To initiate a bridge transfer, connect your MetaMask wallet and ensure you're on the Moonbase Alpha network, and take the following steps:

1. Click **Mint ERC20S**
2. Specify a destination network (although the minted tokens will be the same regardless of destination)
3. Select **ERC20S** from the **Token** dropdown
4. Press **Mint Tokens** and confirm the transaction in MetaMask
5. Return to the **Transfer** tab
6. Select the destination network
7. Select **ERC20S** from the **Token** dropdown
8. Specify the amount to bridge
9. Enter a destination address or check **I want to send funds to my address**
10. Press **Start Transfer** and **Confirm** the transaction in MetaMask. The DApp will update you on the status of the bridge transfer

![Moonbase ChainBridge](/images/builders/get-started/networks/moonbase/moonbase-8.png)

### MoonGas {: #moongas } 

[MoonGas](https://moonbeam-gasinfo.netlify.app/){target=_blank} is a convenient dashboard for viewing the minimum, maximum, and average gas price of transactions in the prior block across all Moonbeam networks. Note, these statistics can fluctuate widely by block and occasionally include outlier values. You can check out the [repository for MoonGas](https://github.com/albertov19/moonbeam-gas-station){target=_blank}. 

You'll notice that the minimum gas price for Moonbeam is 100 Gwei, while the minimum for Moonriver and Moonbase Alpha is only 1 Gwei. This difference stems from the [100 to 1 re-denomination of GLMR](https://moonbeam.foundation/news/moonbeam-community-announcement/){target=_blank} and thus the 100 Gwei minimum on Moonbeam corresponds to a 1 Gwei minimum on Moonriver and Moonbeam. 

![MoonGas](/images/builders/get-started/networks/moonbase/moonbase-9.png)
