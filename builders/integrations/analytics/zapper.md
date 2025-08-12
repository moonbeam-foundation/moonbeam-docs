---
title: Portfolio Tracking on Moonbeam with Zapper
description: Learn how to track your holdings on Moonbeam using Zapper and explore different DeFi platforms in the Moonbeam ecosystem.
categories: Integrations
---

# Portfolio Tracking with Zapper

## Introduction

[Zapper](https://zapper.xyz){target=\_blank} is a Web3 application that enables users to explore on-chain data, manage their portfolios, and interact with decentralized finance (DeFi) protocols across multiple networks, including Moonbeam. Through their integration with Zapper, users can monitor and manage assets across Moonbeam’s DeFi ecosystem, including platforms such as Moonwell, StellaSwap, OmniLST, and Prime Protocol.

This tutorial provides a detailed step-by-step guide for users and developers to integrate with Zapper and maximize their experience within the Moonbeam ecosystem.

## Get Started on Zapper

You can navigate to [Zapper's official website](https://zapper.xyz){target=\_blank} and take the following steps to start interacting with the application:

1. Click on the **Connect Wallet** button at the top right corner
![Zapper main site](/images/builders/integrations/analytics/zapper/zapper-1.webp)
2. Select your preferred wallet from the supported options (e.g., MetaMask, Talisman, Coinbase Wallet)
![Zapper wallet modal](/images/builders/integrations/analytics/zapper/zapper-2.webp)
3. Follow the on-screen prompts to connect securely to Zapper

### Explore Your Portfolio

Once your wallet is connected, Zapper will automatically detect and display your assets across supported networks, including Moonbeam. You can navigate to your main dashboard by clicking on **My profile** on the left sidebar or selecting it from the wallet icon on the top-right corner. The dashboard provides an overview of your holdings and activity split in the following categories:

- **Summary** - displays your total assets, liabilities, and net worth across all networks
- **Tokens** - lists all tokens held in your connected wallet, including GLMR (Moonbeam's native token) and any ERC-20 tokens
- **DeFi** - shows active positions in Moonbeam-based DeFi platforms such as lending, liquidity pools, and staking
- **NFTs** - displays any NFTs you own on Moonbeam or other supported chains
- **Activity** - Zapper's dashboard provides real-time data, enabling efficient management of your on-chain activities

![Zapper Dashboard](/images/builders/integrations/analytics/zapper/zapper-3.webp)

### Engage with Moonbeam's DeFi Ecosystem

Zapper provides access to view the activity on Moonbeam's DeFi protocols, such as:

- [**Moonwell**](https://moonwell.fi/){target=\_blank} - for accessing lending and borrowing services
- [**StellaSwap**](https://app.stellaswap.com/exchange/swap){target=\_blank} - for participating in token swaps and liquidity provision by depositing token pairs into StellaSwap's liquidity pools
- [**OmniLST**](https://omni.ls/){target=\_blank} - for engaging in liquid staking opportunities (stake GLMR tokens to receive liquid staking tokens and use them in other DeFi applications)
- [**Prime Protocol**](https://www.primeprotocol.xyz/){target=\_blank} - for managing cross-chain assets and accessing borrowing services (deposit assets as collateral to borrow across multiple chains)

You can follow these steps to review any of the aforementioned protocols:

1. Select **Moonbeam** from the chain filter in the left sidebar. This will display the most trending dApps in the ecosystem. Click on the protocol you wish to explore
![Zapper DeFi Section](/images/builders/integrations/analytics/zapper/zapper-4.webp)
2. In the **Activity** tab, view the latest transactions for the selected protocol, including token swaps, LP or staking on StellaSwap, lending and borrowing on Moonwell, staked GLMR on OmniLST, and activity on other supported dApps
![StellaSwap on Zapper](/images/builders/integrations/analytics/zapper/zapper-5.webp)
3. View additional details for the selected protocol, including daily active users and daily transactions in the left sidebar, deployed smart contracts in the **Contracts** tab, and your holdings in the protocol via the **Properties** tab


### Access and Manage Moonbeam Assets

Zapper also has an integrated modal for seamlessly swapping assets on Moonbeam. You can access this feature by selecting **Moonbeam** in the chain filter on the left sidebar and choosing the desired token on the right sidebar.

![Zapper Token Selection](/images/builders/integrations/analytics/zapper/zapper-6.webp)

Inside the token page, you'll be able to see the asset's performance and details such as price action, volumes, holders and transactions. 

![Zapper Swap Modal-1](/images/builders/integrations/analytics/zapper/zapper-7.webp)

To perform a swap you'll need to access the swap modal by clicking on the **Buy**/**Sell** buttons in the left sidebar. Once inside the modal you can select the assets for swapping, input the desired quantity for the token you want to sell, and click on **Review order** to sign and submit the transaction.

![Zapper Swap Modal-2](/images/builders/integrations/analytics/zapper/zapper-8.webp)

## Integrate with Zapper's API

Developers can leverage Zapper's API to enrich their applications with comprehensive DeFi data from the Moonbeam network.

You can register for an API key by visiting the [Zapper API portal](https://protocol.zapper.xyz){target=\_blank}. An API key is necessary to authenticate your application and access Zapper's endpoints. 

Zapper offers several endpoints to fetch relevant data, such as:

- **Balances** - retrieve asset balances for addresses on Moonbeam
- **Transactions** - access transaction histories
- **Prices** - obtain real-time token prices

Furthermore, you can familiarize yourself with the [Zapper API documentation](https://protocol.zapper.xyz/docs/api){target=\_blank}, which provides detailed information on the available endpoints, request structures, and response formats.

Depending on your preferred programming language, you can set up your environment to make HTTP requests to Zapper's API. Below is an example of retrieving token balances for a specified wallet address on Moonbeam using Node.js and [Axios](https://axios-http.com/docs/intro){target=\_blank}:

```javascript
--8<-- 'code/builders/integrations/analytics/zapper/token-balances.js'
```
!!! note 

	Ensure that your application handles API responses appropriately and includes error-handling mechanisms.


By following this tutorial, users and developers will have effectively learned how to integrate with Zapper and use it for exploring multiple DApps in the Moonbeam network. 

## Additional Resources

You can also explore the [Zapper API GitHub repository](https://github.com/Zapper-fi/Docs){target=\_blank} for code examples and community contributions, or refer to [Zapper's integration guides](https://zapper.gitbook.io/integrations){target=\_blank} for detailed instructions and best practices.

--8<-- 'text/_disclaimers/third-party-content.md'
