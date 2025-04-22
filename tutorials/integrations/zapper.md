---
title: Portfolio Tracking on Moonbeam with Zapper
description: Learn how to track your holdings on Moonbeam using Zapper and interact with different DeFi platforms on the Moonbeam Ecosystem.
---

# Portfolio Tracking with Zapper

## Introduction

[Zapper](https://zapper.xyz){target=\_blank} is a powerful Web3 application that allows users to explore on-chain data, manage portfolios, and interact with various decentralized finance (DeFi) protocols across multiple networks, including Moonbeam. Integrating with Zapper allows users to seamlessly monitor and manage assets across Moonbeam's DeFi ecosystem, including Moonwell, StellaSwap, OmniLST, and Prime Protocol.

This tutorial provides a detailed step-by-step guide for both users and developers to integrate with Zapper and maximize their experience within the Moonbeam ecosystem.

## Get Started on Zapper

You can navigate to [Zapper's official website](https://zapper.xyz){target=\_blank} and take the following steps to start interacting with the application:

1. Click on the **Connect Wallet** button at the top right corner
![Zapper main site](/images/tutorials/integrations/Zapper/zapper-1.webp)
2. Select your preferred wallet from the supported options (e.g., MetaMask, Talisman, Coinbase Wallet)
![Zapper wallet modal](/images/tutorials/integrations/Zapper/zapper-2.webp)
3. Follow the on-screen prompts to connect securely to Zapper

### Explore Your Portfolio

Once your wallet is connected, Zapper will automatically detect and display your assets across supported networks, including Moonbeam. You can navigate to your main dashboard by clicking on **My profile** on the left sidebar or selecting it from the wallet icon on the top-right corner. The dashboard provides an overview of your holdings and activity split in the following categories:

- **Summary**: displays your total assets, liabilities, and net worth across all networks
- **Tokens**: lists all tokens held in your connected wallet, including GLMR (Moonbeam's native token) and any ERC-20 tokens
- **DeFi**: shows active positions in Moonbeam-based DeFi platforms such as lending, liquidity pools, and staking
- **NFTs**: displays any NFTs you own on Moonbeam or other supported chains
- **Activity**: Zapper's dashboard provides real-time data, enabling efficient management of your on-chain activities

![Zapper Dashboard](/images/tutorials/integrations/Zapper/zapper-3.webp)

### Engage with Moonbeam's DeFi Ecosystem

Zapper provides access to view the activity on Moonbeam's DeFi protocols, such as:

- [**Moonwell**](https://moonwell.fi/){target=\_blank}: for accessing lending and borrowing services
- [**StellaSwap**](https://app.stellaswap.com/exchange/swap){target=\_blank}: for participating in token swaps and liquidity provision by depositing token pairs into StellaSwap's liquidity pools
- [**OmniLST**](https://omni.ls/){target=\_blank}: for engaging in liquid staking opportunities (stake GLMR tokens to receive liquid staking tokens and use them in other DeFi applications)
- [**Prime Protocol**](https://www.primeprotocol.xyz/){target=\_blank}: for managing cross-chain assets and accessing borrowing services (deposit assets as collateral to borrow across multiple chains)

You can follow these steps to review any of the aforementioned protocols:

1. Select **Moonbeam** in the chain filter on the left sidebar. You'll be able to view the most trending DApps in the ecosystem and click on the protocol you want to explore 
![Zapper DeFi Section](/images/tutorials/integrations/Zapper/zapper-4.webp)
2. In the **Activity** tab, you'll be able to see the latest transactions for the selected protocol: token swaps, LP or staking on StellaSwap’s decentralized exchange, lending and borrowing transactions on Moonwell, staked GLMR on OmniLST and any other supported DApp on Zapper
![StellaSwap on Zapper](/images/tutorials/integrations/Zapper/zapper-5.webp)
3. You'll also be able to view other details of the selected protocol, such as the daily active users and the daily transactions in the left side-bar, all deployed smart contracts in the **Contracts** tab and your own holdings on the protocol by going to the **Properties** tab


### Access Moonbeam Assets on Zapper

Zapper also has an integrated modal for seamlessly swapping assets on Moonbeam. Users can access this feature by selecting **Moonbeam** in the chain filter on the left sidebar and choosing the desired token on the right sidebar.

![Zapper Token Selection](/images/tutorials/integrations/Zapper/zapper-6.webp)

Inside the token page, users will be able to see the asset's performance (price action, volumes, holders, and transactions). The swap modal will be accesible by clicking on the **Buy**/**Sell** buttons on the left sidebar. 

![Zapper Swap Modal](/images/tutorials/integrations/Zapper/zapper-7.webp)

Inside the swap modal you can select the assets for swapping, input the desired quantity for the token you want to sell, and click on **Review order** to sign and submit the transaction.

![Zapper Swap Modal](/images/tutorials/integrations/Zapper/zapper-8.webp)

## Integrate with Zapper's API

Developers can leverage Zapper's API to enrich their applications with comprehensive DeFi data from the Moonbeam network.

You can register for an API key by visiting the [Zapper API portal](https://protocol.zapper.xyz){target=\_blank}. An API key is necessary to authenticate your application and access Zapper's endpoints. 

Zapper offers several endpoints to fetch relevant data, such as:

- **Balances**: retrieve asset balances for addresses on Moonbeam
- **Transactions**: access transaction histories
- **Prices**: obtain real-time token prices

Furthermore, you can familiarize yourself with the [Zapper API documentation](https://protocol.zapper.xyz/docs/api){target=\_blank}, which provides detailed information on the available endpoints, request structures, and response formats.

Depending on your preferred programming language, you can set up your environment to make HTTP requests to Zapper's API. Below is an example using Node.js:

??? code "Retrieve token balances"
    ```javascript
    --8<-- 'code/tutorials/integrations/Zapper/token-balances.js'
    ```

This script retrieves token balances for a specified wallet address on the Moonbeam network.


!!! note 

	Ensure that your application handles API responses appropriately and includes error-handling mechanisms.


By following this tutorial, users and developers can effectively integrate with the Zapper DApp, building powerful applications to enhance their interaction with the Moonbeam network and its DeFi ecosystem. 

## Additional Resources

You can explore the [Zapper API GitHub repository](https://github.com/Zapper-fi/Docs){target=\_blank} for code examples and community contributions, or refer to [Zapper's integration guides](https://zapper.gitbook.io/integrations){target=\_blank} for detailed instructions and best practices.

--8<-- 'text/_disclaimers/educational-tutorial.md'

--8<-- 'text/_disclaimers/third-party-content.md'
