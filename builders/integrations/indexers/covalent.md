---
title: GoldRush API
description: Querying blockchain data such as balances, transactions, transfers, token holders, and event logs on Moonbeam with the GoldRush (formerly Covalent) API.
categories: Indexers and Queries
---

# Getting Started with the GoldRush API

## Introduction {: #introduction }

[GoldRush](https://goldrush.dev/){target=\_blank}, formerly known as Covalent, is a hosted blockchain data solution providing access to historical and current on-chain data for [100+ supported blockchains](https://goldrush.dev/docs/networks/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}, including [Moonbeam](https://goldrush.dev/chains/moonbeam/){target=\_blank}, [Moonriver](https://goldrush.dev/chains/moonriver/){target=\_blank}, and [Moonbase Alpha](https://goldrush.dev/chains/moonbeam-moonbase-alpha-testnet/){target=\_blank}. GoldRush maintains a full archival copy of every supported blockchain, meaning every balance, transaction, log event, and NFT asset data is available from the genesis block. This data is available via:

- [Unified API](#unified-api-overview) - incorporate blockchain data into your app with a familiar REST API

This guide will cover all of the details needed to get started with the [GoldRush API](https://goldrush.dev/docs/unified-api/){target=\_blank} and how to access the API endpoints for Moonbeam using curl commands and JavaScript and Python snippets.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Unified API Overview {: #unified-api-overview }

GoldRush's Unified API is a powerful but easy-to-use REST API that offers visibility to assets across all blockchain networks. It features a consistent request and response object format across networks. For example, a user can fetch all the token balances for a wallet address across any supported blockchain by changing the unique blockchain name or ID path parameter in the request URL. GoldRush's Unified API can offer more data flexibility than JSON-RPC interfaces, which are typically limited to queries on a specific block. It also allows queries on multiple objects and batch exports of data.

### Querying the Unified API {: #querying-the-unified-api }

It's easy to get started querying the Unified API after you've secured a GoldRush API Key. Make sure you have [your API Key](https://goldrush.dev/platform/auth/register/){target=\_blank} which begins with `cqt_` or `ckey_`. 

You can interact with any of the API methods in the web interface of the GoldRush docs. To try out the token balances API, head to the [token balances docs](https://goldrush.mintlify.app/docs/api/balances/get-token-balances-for-address){target=\_blank} and take the following steps:

1. Paste in your API key
2. Enter the desired `chainName`, such as `moonbeam-moonbase-alpha` for Moonbase Alpha. Reference the [Quick Start section](#quick-start) if you're unsure what the chainName should be for your desired network
3. Enter the address you wish to check the token balances of
4. Press **Send**

[![Example API response in JSON](/images/builders/integrations/indexers/covalent/covalent-1.webp)](https://goldrush.mintlify.app/docs/api/balances/get-token-balances-for-address){target=\_blank}

### Quick Start {: #quick-start }

If you're familiar with GoldRush and ready to dive in, you need the chainID and network name to get started.

=== "Moonbeam"
    |  Parameter  |               Value                |
    |:-----------:|:----------------------------------:|
    | `chainName` |         `moonbeam-mainnet`         |
    |  `chainID`  | `{{ networks.moonbeam.chain_id }}` |

=== "Moonriver"
    |  Parameter  |                Value                |
    |:-----------:|:-----------------------------------:|
    | `chainName` |        `moonbeam-moonriver`         |
    |  `chainID`  | `{{ networks.moonriver.chain_id }}` |

=== "Moonbase Alpha"
    |  Parameter  |               Value                |
    |:-----------:|:----------------------------------:|
    | `chainName` |     `moonbeam-moonbase-alpha`      |
    |  `chainID`  | `{{ networks.moonbase.chain_id }}` |

### Fundamentals of the Unified API {: #fundamentals-of-the-unified-api }

 - The GoldRush API is RESTful and it is designed around the main resources that are available through the web interface
 - The current version of the API is version 1
 - The default return format for all endpoints is JSON
 - All requests require authentication; you will need [an API Key](https://goldrush.dev/platform/auth/register/){target=\_blank} to use the GoldRush API
 - The cost of an API call is denominated in credits and varies depending on the particular call. Upon creating an API key, you're given a substantial amount of free credits to get started (25,000 at the time of writing). You can track your usage of these free credits on the [GoldRush Dashboard](https://goldrush.dev/platform/){target=\_blank}
 - Note that free development API keys are rate limited to `4` requests per second. Subscribers to a professional plan can make up to `50` requests per second.
 - The root URL of the API is: `https://api.covalenthq.com/v1/`
 - All requests are done over HTTPS (calls over plain HTTP will fail)
 - The refresh rate of the APIs is real-time: 30s or two blocks, and batch 30m or 40 blocks

### Types of Endpoints {: #types-of-endpoints }

The GoldRush API has three classes of endpoints:

 - **Class A** — endpoints that return enriched blockchain data applicable to all blockchain networks, eg: balances, transactions, log events, etc
 - **Class B** — endpoints that are for a specific protocol on a blockchain, e.g. Uniswap is Ethereum-only and is not applicable to other blockchain networks
 - **Class C** — endpoints that are community-built and maintained but powered by GoldRush infrastructure

### Sample Supported Endpoints {: #sample-supported-endpoints }

For a full list of supported endpoints, refer to the [GoldRush API reference](https://goldrush.mintlify.app/api-reference/overview){target=\_blank}. A subset of the supported endpoints include:

- **Token balances**- get all token balances (native, ERC-20, ERC-721, ERC-1155) with current market prices for an address
- **Native token balances**- retrieve native token balance for an address
- **Get a transaction**- fetch and render a single transaction with decoded log events
- **Transaction summary**- retrieve key wallet activity data for an address
- **Earliest transactions**- get the earliest transactions for an address
- **Recent transactions**- fetch the most recent transactions for an address
- **Paginated transactions**- get paginated transactions for an address
- **Bulk time bucket transactions**- fetch all transactions in 15-minute time buckets
- **Block transactions**- get all transactions in a specific block
- **ERC-20 token transfers**- fetch transfer history of a specific ERC-20 token for an address
- **Cross-chain activity**- locate chains on which an address is active
- **Token approvals**- get a list of token approvals for an address
- **NFT approvals**- retrieve NFT approvals for an address

## Unified API Methods {: #unified-api-methods }

For more information on each of the methods of the Unified API and for an interactive interface to try out each of the methods, be sure to check out the [GoldRush docs](https://goldrush.mintlify.app/api-reference/overview){target=\_blank}.  

### Balances {: #balances }

???+ function "Token Balances"

    The [token balances endpoint](https://goldrush.mintlify.app/docs/api/balances/get-token-balances-for-address){target=\_blank} retrieves native tokens, fungible (ERC-20) tokens, and non-fungible (ERC-721 & ERC-1155) tokens associated with a given address. The returned data includes current market prices and additional token metadata.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to check the token balances of

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/token-balances/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/token-balances/response.sh'
        ```

??? function "Native Token Balances"

    The [native token balances endpoint](https://goldrush.mintlify.app/docs/api/balances/get-native-token-balance){target=\_blank} retrieves the native token balance for a given address in a streamlined manner. 

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to check the token balances of

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/native-token-balances/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/native-token-balances/response.sh'
        ```

??? function "Get ERC-20 Token Transfers for Address"

    [Get ERC-20 Token Transfers for Address](https://goldrush.mintlify.app/docs/api/balances/get-erc20-token-transfers-for-address){target=\_blank} is used to fetch the transfer-in and transfer-out of a token along with historical prices from an address, when provided both a wallet address and an ERC-20 token contract address

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query
        - `contractAddress` *string* - the ERC-20 token contract to query

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-erc20-transfers/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-erc20-transfers/response.sh'
        ```

### Transactions {: #transactions }

???+ function "Get a transaction"

    [Get a transaction](https://goldrush.mintlify.app/docs/api/transactions/get-a-transaction){target=\_blank} is used fetch and render a single transaction including its decoded log events. 

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `txHash` *string* - the transaction hash

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-a-transaction/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-a-transaction/response.sh'
        ```

??? function "Get transaction summary for address"

    [Get transaction summary for address](https://goldrush.mintlify.app/docs/api/transactions/get-transaction-summary-for-address){target=\_blank} retrieves key wallet activity data, including the first and most recent transactions, and total transaction count. It enables quick analysis of wallet age, inactive periods, and overall Web3 engagement levels.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/transaction-summary/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/transaction-summary/response.sh'
        ```

??? function "Get earliest transactions for address (v3)"

    [Get earliest transactions for address](https://goldrush.mintlify.app/docs/api/transactions/get-earliest-transactions-for-address-v3){target=\_blank} retrieves the earliest transactions involving an address.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/earliest-transactions/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/earliest-transactions/response.sh'
        ```

??? function "Get recent transactions for address (v3)"

    [Get recent transactions for address](https://goldrush.mintlify.app/docs/api/transactions/get-recent-transactions-for-address-v3){target=\_blank} retrieves the most recent transactions involving an address.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/recent-transactions/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/recent-transactions/response.sh'
        ```

??? function "Get paginated transactions for address (v3)"

    [Get paginated transactions for address (v3)](https://goldrush.mintlify.app/docs/api/transactions/get-paginated-transactions-for-address-v3){target=\_blank} fetches the transactions involving an address and the specified page, starting from a 0 index.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query
        - `page` *integer* - the requested page, 0-indexed. 

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-paginated-transactions/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-paginated-transactions/response.sh'
        ```

??? function "Get bulk time bucket transactions for address (v3)"

    [Get bulk time bucket transactions for address (v3)](https://goldrush.mintlify.app/docs/api/transactions/get-time-bucket-transactions-for-address-v3){target=\_blank} is used to fetch all transactions including their decoded log events in a 15-minute time bucket interval.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query
        - `timeBucket` *integer* - The 0-indexed 15-minute time bucket. E.g. 8 9 Oct 2024 01:49 GMT = 1728420540 (Unix time). 1728420540/900 = 1920467 timeBucket.

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-bulk-time/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-bulk-time/response.sh'
        ```

??? function "Get all transactions in a block by page (v3)"

    [Get all transactions in a block by page (v3)](https://goldrush.mintlify.app/docs/api/transactions/get-all-transactions-in-a-block-by-page){target=\_blank} is used to fetch all transactions including their decoded log events in a block and further flag interesting wallets or transactions.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `blockHeight` *integer* - the request block height. Also accepts the `latest` keyword
        - `page` *integer* - the requested page, 0-indexed.

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-all-txns-in-block/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/get-all-txns-in-block/response.sh'
        ```

??? function "Get all transactions in a block (v3)"

    [Get all transactions in a block (v3)](https://goldrush.mintlify.app/docs/api/transactions/get-all-transactions-in-a-block){target=\_blank} is used to used to fetch all transactions including their decoded log events in a block and further flag interesting wallets or transactions. It takes a blockhash as a parameter and it does not accept a page parameter.

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `blockHash` *integer* - the request block hash

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/all-txns-by-block-hash/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/all-txns-by-block-hash/response.sh'
        ```

### Cross Chain {: #cross-chain }

???+ function "Get cross-chain activity for address"

    [Get cross-chain activity for address](https://goldrush.mintlify.app/docs/api/cross-chain/get-address-activity){target=\_blank} is used to locate chains which an address is active on with a single API call

    === "Parameters"

        - `walletAddress` *string* - the address you wish to query

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/cross-chain/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/cross-chain/response.sh'
        ```


### Security {: #security }

???+ function "Get token approvals for address"

    [Get token approvals for address](https://goldrush.mintlify.app/docs/api/security/get-token-approvals-for-address){target=\_blank} is used to get a list of approvals across all token contracts categorized by spenders for a wallet’s assets

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/erc20-approvals/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/erc20-approvals/response.sh'
        ```


??? function "Get NFT approvals for address"

    [Get NFT approvals for address](https://goldrush.mintlify.app/docs/api/security/get-nft-approvals){target=\_blank} is used to get a list of NFT approvals across all token contracts categorized by spenders for a wallet’s assets

    === "Parameters"

        - `chainName` *string* - e.g. `moonbeam-mainnet`, `moonbeam-moonriver`, or `moonbeam-moonbase-alpha` 
        - `walletAddress` *string* - the address you wish to query

    === "Example Request"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/nft-approvals/request.sh'
        ```

    === "Example Response"

        ```bash
        --8<-- 'code/builders/integrations/indexers/covalent/nft-approvals/response.sh'
        ```

Many more methods are offered by the GoldRush API, including NFT and Utility methods. Be sure to check out the [GoldRush docs](https://goldrush.mintlify.app/docs/api/overview){target=\_blank} for more information on each of these methods.  

## API Parameters and Resources {: #api-parameters-and-resources }

### API Parameters {: #api-parameters }

=== "Moonbeam"
    |       Parameter        |      Value      |
    |:----------------------:|:---------------:|
    |    Response Formats    |    JSON, CSV    |
    | Real-Time Data Latency |    2 blocks     |
    |   Batch Data Latency   |   30 minutes    |
    |     API Free Tier      | Limit of 4 RPS  |
    |    API Premium Tier    | Limit of 50 RPS |

=== "Moonriver"
    |       Parameter        |      Value      |
    |:----------------------:|:---------------:|
    |    Response Formats    |    JSON, CSV    |
    | Real-Time Data Latency |    2 blocks     |
    |   Batch Data Latency   |   30 minutes    |
    |     API Free Tier      | Limit of 4 RPS  |
    |    API Premium Tier    | Limit of 50 RPS |

=== "Moonbase Alpha"
    |       Parameter        |      Value      |
    |:----------------------:|:---------------:|
    |    Response Formats    |    JSON, CSV    |
    | Real-Time Data Latency |    2 blocks     |
    |   Batch Data Latency   |   30 minutes    |
    |     API Free Tier      | Limit of 4 RPS  |
    |    API Premium Tier    | Limit of 50 RPS |

### API Resources {: #api-resources }

- [API Reference and In-Browser Endpoint Demo](https://goldrush.mintlify.app/docs/api/overview){target=\_blank}
- [GoldRush Quickstart](https://goldrush.mintlify.app/docs/quickstart){target=\_blank}
- [Written Guides](https://goldrush.dev/docs/unified-api/guides/?utm_source=moonbeam&utm_medium=partner-docs){target=\_blank}

## How to Use the Unified API {: #how-to-use-the-unified-api }

First, make sure you have [your API Key](https://goldrush.dev/platform/auth/register/){target=\_blank} which begins with `cqt_` or `ckey_`. Once you have your API key, you can access any of the supported endpoints. To get information for a specific network, you must provide the chain ID.

### Checking Prerequisites {: #checking-prerequisites }

To get started with the GoldRush API, you will need to have the following:

 - A free [GoldRush API Key](https://goldrush.dev/platform/auth/register/){target=\_blank}
 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=\_blank}
 - An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'

### Using Curl {: #using-curl }

One of the supported endpoints is the token holders endpoint, which returns a list of all the token holders of a particular token. For this example, you can check the token holders for the ERTH token. The contract address for the ERTH token on Moonbase Alpha is `0x08B40414525687731C23F430CEBb424b332b3d35`.

Try running the command below in a terminal window after replacing the placeholder with your API key.

```bash
curl https://api.covalenthq.com/v1/1287/tokens/\
0x08B40414525687731C23F430CEBb424b332b3d35/token_holders/ \
-u INSERT_YOUR_API_KEY:
```

!!! note
    The colon `:` after the API key is required to skip the password prompt.

Unless you already owned some ERTH tokens, your address will be missing from that list. Head over to the [Moonbase Alpha ERC-20 Faucet](https://moonbase-minterc20.netlify.app){target=\_blank} to generate some ERTH tokens for yourself. Now repeat the same GoldRush API request as above. The GoldRush API updates in real-time, so you should now see your address in the list of token holders for the ERTH token.

### Using Javascript {: #using-javascript }

Copy and paste the below code block into your preferred environment or [JSFiddle](https://jsfiddle.net){target=\_blank}. After setting the API key, set the address constant. Remember for Moonbase Alpha the chain ID is `{{ networks.moonbase.chain_id }}`.

=== "Using Fetch"

    ```js
    --8<-- 'code/builders/integrations/indexers/covalent/javascript-using-fetch.js'
    ```

=== "Using Async"

    ```js
    --8<-- 'code/builders/integrations/indexers/covalent/javascript-using-async.js'
    ```

The balances endpoint returns a list of all ERC-20 and NFT token balances, including ERC-721 and ERC-1155 balances, along with their current spot prices (if available).

![JavaScript Console Output](/images/builders/integrations/indexers/covalent/covalent-2.webp)

### Using Python {: #using-python }

GoldRush doesn’t have an official API wrapper. To query the API directly, you will have to use the Python [requests library](https://pypi.org/project/requests){target=\_blank}. Install requests into your environment from the command line with `pip install requests`. Then import it and use it in your code. Use the HTTP verbs get methods to return the information from the API. Copy and paste the below code block into your preferred environment and run it. The output should look similar to the screenshot above, however the formatting may vary depending on your environment.

```python
--8<-- 'code/builders/integrations/indexers/covalent/python-example.py'
```

!!! note
    The second parameter of `auth` is empty because no password is required—your API key is all that's needed.

--8<-- 'text/_disclaimers/third-party-content.md'
