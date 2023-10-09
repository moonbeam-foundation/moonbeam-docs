---
title: Covalent API
description: Querying blockchain data such as balances, transactions, transfers, token holders, and event logs on Moonbeam with the Covalent API.
---

# Getting Started with the Covalent API

## Introduction {: #introduction }

[Covalent](https://www.covalenthq.com/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank} is a hosted blockchain data solution providing access to historical and current on-chain data for [100+ supported blockchains](https://www.covalenthq.com/docs/networks/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}, including [Moonbeam, Moonriver, and Moonbase Alpha](https://www.covalenthq.com/docs/networks/moonbeam/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}. Covalent maintains a full archival copy of every supported blockchain, meaning every balance, transaction, log event, and NFT asset data is available from the genesis block. This data is available via:

- [Unified API](#unified-api) - incorporate blockchain data into your app with a familiar REST API
- [Increment](#increment) - create and embed custom charts with no-code analytics

This guide will cover all of the details needed to get started with the [Covalent API](https://www.covalenthq.com/docs/api/){target=_blank} and how to access the API endpoints for Moonbeam using curl commands and JavaScript and Python snippets.

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Unified API {: #unified-api }

Covalent's Unified API is a powerful but easy-to-use REST API that offers visibility to assets across all blockchain networks. It features a consistent request and response object format across networks. For example, a user can fetch all the token balances for a wallet address across any supported blockchain by changing the unique blockchain name or id path parameter in the request URL. Covalent's Unified API can offer more data flexibility than JSON-RPC interfaces, which are typically limited to queries on a specific block. It also allows queries on multiple objects and batch exports of data.

[![Example API response in JSON](/images/builders/integrations/indexers/covalent/covalent-1.png)](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank} *Click on the above image to try out the request yourself.*

### Quick Start {: #quick-start }

If you're already familiar with Covalent and ready to dive in, you simply need the chainID and network name to get started.

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

 - The Covalent API is RESTful and it is designed around the main resources that are available through the web interface
 - The current version of the API is version 1
 - The default return format for all endpoints is JSON
 - All requests require authentication; you will need [a free API Key](https://www.covalenthq.com/platform/#/auth/register/){target=_blank} to use the Covalent API
 - The cost of an API call is denominated in credits and varies depending on the particular call. Upon creating an API key, you're given a substantial amount of free credits to get started (100,000 at the time of writing). You can track your usage of these free credits on the [Increment Dashboard](https://www.covalenthq.com/platform/increment/#/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
 - The root URL of the API is: [https://api.covalenthq.com/v1/](https://api.covalenthq.com/v1/){target=_blank}
 - All requests are done over HTTPS (calls over plain HTTP will fail)
 - The refresh rate of the APIs is real-time: 30s or 2 blocks, and batch 30m or 40 blocks

### Types of Endpoints {: #types-of-endpoints }

The Covalent API has three classes of endpoints:

 - **Class A** — endpoints that return enriched blockchain data applicable to all blockchain networks, eg: balances, transactions, log events, etc
 - **Class B** — endpoints that are for a specific protocol on a blockchain, e.g. Uniswap is Ethereum-only and is not applicable to other blockchain networks
 - **Class C** — endpoints that are community built and maintained but powered by Covalent infrastructure.

### Sample Supported Endpoints {: #sample-supported-endpoints }

For a full list of supported endpoints, refer to the [Covalent API reference](https://www.covalenthq.com/docs/api/guide/overview/){target=_blank}. A subset of the supported endpoints include:

 - **Balances** — get token balances for an address. Returns a list of all ERC-20 and NFT token balances including ERC-721 and ERC-1155 along with their current spot prices (if available)
 - **Transactions** — retrieves all transactions for an address including decoded log events. Does a deep-crawl of the blockchain to
 retrieve all transactions that reference this address
 - **Transfers** — get ERC-20 token transfers for an address along with historical token prices (if available)
 - **Token holders** — return a paginated list of token holders
 - **Log events (smart contract)** — return a paginated list of decoded log events emitted by a particular smart contract
 - **Log events (topic hash)** — return a paginated list of decoded log events with one or more topic hashes separated by a comma
 - **Security (Token Approvals)** - return a list of approvals across all token contracts categorized by spenders for a wallet’s assets

### Request Formatting {: #request-formatting }

=== "Moonbeam"
    |                                                                                Endpoint                                                                                |                                             Format                                              |
    |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
    |          [Balances](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}           |      api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/address/{ADDRESS}/balances_v2/      |
    |       [Transactions](https://www.covalenthq.com/docs/api/transactions/get-transactions-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}        |    api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/address/{ADDRESS}/transactions_v2/    |
    |                            [Transfers](https://www.covalenthq.com/docs/api/balances/get-erc20-token-transfers-for-address/){target=_blank}                             |     api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/address/{ADDRESS}/transfers_v2/      |
    |                   [Token holders](https://www.covalenthq.com/docs/api/balances/#balances/get-token-holders-as-of-any-block-height-v2){target=_blank}                   | api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/tokens/{CONTRACT_ADDRESS}/token_holders/ |
    | [Log events (smart contract)](https://www.covalenthq.com/docs/api/base/get-log-events-by-contract-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank} |    api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/events/address/{CONTRACT_ADDRESS}/    |
    |                            [Log events (topic hash)](https://www.covalenthq.com/docs/api/base/get-log-events-by-topic-hash/){target=_blank}                            |          api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/events/topics/{TOPIC}/          |
    |                       [Security (Token Approvals)](https://www.covalenthq.com/docs/api/security/get-token-approvals-for-address/){target=_blank}                       |           api.covalenthq.com/v1/{{ networks.moonbeam.chain_id }}/approvals/{ADDRESS}/           |

=== "Moonriver"
    |                                                                                Contract                                                                                |                                             Address                                              |
    |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------------:|
    |          [Balances](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}           |      api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/address/{ADDRESS}/balances_v2/      |
    |       [Transactions](https://www.covalenthq.com/docs/api/transactions/get-transactions-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}        |    api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/address/{ADDRESS}/transactions_v2/    |
    |                            [Transfers](https://www.covalenthq.com/docs/api/balances/get-erc20-token-transfers-for-address/){target=_blank}                             |     api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/address/{ADDRESS}/transfers_v2/      |
    |                   [Token holders](https://www.covalenthq.com/docs/api/balances/#balances/get-token-holders-as-of-any-block-height-v2){target=_blank}                   | api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/tokens/{CONTRACT_ADDRESS}/token_holders/ |
    | [Log events (smart contract)](https://www.covalenthq.com/docs/api/base/get-log-events-by-contract-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank} |    api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/events/address/{CONTRACT_ADDRESS}/    |
    |                            [Log events (topic hash)](https://www.covalenthq.com/docs/api/base/get-log-events-by-topic-hash/){target=_blank}                            |          api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/events/topics/{TOPIC}/          |
    |                       [Security (Token Approvals)](https://www.covalenthq.com/docs/api/security/get-token-approvals-for-address/){target=_blank}                       |           api.covalenthq.com/v1/{{ networks.moonriver.chain_id }}/approvals/{ADDRESS}/           |

=== "Moonbase Alpha"
    |                                                                                Contract                                                                                |                                             Address                                             |
    |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------------------:|
    |          [Balances](https://www.covalenthq.com/docs/api/balances/get-token-balances-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}           |      api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/address/{ADDRESS}/balances_v2/      |
    |       [Transactions](https://www.covalenthq.com/docs/api/transactions/get-transactions-for-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}        |    api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/address/{ADDRESS}/transactions_v2/    |
    |                            [Transfers](https://www.covalenthq.com/docs/api/balances/get-erc20-token-transfers-for-address/){target=_blank}                             |     api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/address/{ADDRESS}/transfers_v2/      |
    |                   [Token holders](https://www.covalenthq.com/docs/api/balances/#balances/get-token-holders-as-of-any-block-height-v2){target=_blank}                   | api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/tokens/{CONTRACT_ADDRESS}/token_holders/ |
    | [Log events (smart contract)](https://www.covalenthq.com/docs/api/base/get-log-events-by-contract-address/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank} |    api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/events/address/{CONTRACT_ADDRESS}/    |
    |                            [Log events (topic hash)](https://www.covalenthq.com/docs/api/base/get-log-events-by-topic-hash/){target=_blank}                            |          api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/events/topics/{TOPIC}/          |
    |                       [Security (Token Approvals)](https://www.covalenthq.com/docs/api/security/get-token-approvals-for-address/){target=_blank}                       |           api.covalenthq.com/v1/{{ networks.moonbase.chain_id }}/approvals/{ADDRESS}/           |

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

- [API Reference & In-Browser Endpoint Demo](https://www.covalenthq.com/docs/api/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Covalent Quickstart](https://www.covalenthq.com/docs/unified-api/quickstart/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Written Guides](https://www.covalenthq.com/docs/unified-api/guides/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}

## How to Use the Unified API {: #how-to-use-the-unified-api }

First, make sure you have [your API Key](https://www.covalenthq.com/platform/#/auth/register/){target=_blank} which begins with `ckey_`. Once you have your API key you will be able to access any of the supported endpoints. To get information for a specific network, you will need to provide the chain ID.

### Checking Prerequisites {: #checking-prerequisites }

To get started with the Covalent API, you will need to have the following:

 - A free [Covalent API Key](https://www.covalenthq.com/platform/#/auth/register/){target=_blank}
 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - An account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'

### Using Curl {: #using-curl }

One of the supported endpoints is the token holders endpoint, which returns a list of all the token holders of a particular token. For this example, you can check the token holders for the ERTH token. The contract address for the ERTH token on Moonbase Alpha is `0x08B40414525687731C23F430CEBb424b332b3d35`.

Try running the command below in a terminal window after replacing the placeholder with your API key.

```bash
curl https://api.covalenthq.com/v1/1287/tokens/\
0x08B40414525687731C23F430CEBb424b332b3d35/token_holders/ \
-u { INSERT_YOUR_API_KEY }:
```

!!! note
    The colon `:` after the API key is important because otherwise you will be prompted for a password (which is not needed).

Unless you already owned some ERTH tokens, your address will be missing from that list. Head over to the [Moonbase Alpha ERC-20 Faucet](https://moonbase-minterc20.netlify.app/){target=_blank} to generate some ERTH tokens for yourself. Now repeat the same Covalent API request as above. The Covalent API updates in real-time, so you should now see your address in the list of token holders for the ERTH token.

### Using Javascript {: #using-javascript }

Copy and paste the below code block into your preferred environment, or [JSFiddle](https://jsfiddle.net/){target=_blank}. After setting the API key, set the address constant. Remember for Moonbase Alpha the chain ID is `{{ networks.moonbase.chain_id }}`.

=== "Using Fetch"

    ```js
    // set your API key
    const apiKey = 'INSERT_YOUR_API_KEY';

    function getData() {
    const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // example
    const chainId = '{{ networks.moonbase.chain_id }}'; // Moonbase Alpha TestNet chain ID
    const url = new URL(
        `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
    );

    url.search = new URLSearchParams({
        key: apiKey,
    });

    // use fetch API to get Covalent data
    fetch(url)
        .then((resp) => resp.json())
        .then(function (data) {
        const result = data.data;

        console.log(result);
        return result;
        });
    }

    getData();
    ```

=== "Using Async"

    ```js
    // set your API key
    const apiKey = 'INSERT_YOUR_API_KEY';
    const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // example
    const chainId = '{{ networks.moonbase.chain_id }}'; // Moonbase Alpha TestNet chain ID
    const url = new URL(
    `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`
    );

    url.search = new URLSearchParams({
    key: apiKey,
    });

    async function getData() {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);
    return result;
    }

    getData();
    ```

The balances endpoint returns a list of all ERC-20 and NFT token balances, including ERC-721 and ERC-1155 balances, along with their current spot prices (if available).

![JavaScript Console Output](/images/builders/integrations/indexers/covalent/covalent-2.png)

### Using Python {: #using-python }

Covalent doesn’t have an official API wrapper. To query the API directly you will have to use the Python [requests library](https://pypi.org/project/requests/){target=_blank}. Install requests into your environment from the command line with `pip install requests`. Then import it and use it in your code. Use the HTTP verbs get methods to return the information from the API. Copy and paste the below code block into your preferred environment and run it. The output should look similar to the screenshot above, however the formatting may vary depending on your environment.

```python
import requests

def fetch_wallet_balance(address):
	api_url = 'https://api.covalenthq.com'
    endpoint = f'/v1/{{ networks.moonbase.chain_id }}/address/{address}/balances_v2/'
    url = api_url + endpoint
    response = requests.get(url, auth=('INSERT_YOUR_API_KEY',''))
    print(response.json())
    return(response.json())

# Example address request
fetch_wallet_balance('0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8')
```

!!! note
    The second parameter of `auth` is empty, because there is no password required - your API key is all that's needed.

## Increment {: #increment }

[Increment](https://www.covalenthq.com/docs/increment/){target=_blank} is a no-code charting and reporting tool that enables users to build dynamic, personalized charts with data models. The tool directly encodes business logic—reach, retention, and revenue—into an SQL compiler that outputs valid SQL. Increment can convert any chart made with SQL and bake them into a standardized, open-sourced set of dimensions and measures, known as a model.

[![Example Increment chart](/images/builders/integrations/indexers/covalent/covalent-3.png)](https://www.covalenthq.com/platform/increment/#/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank} *Click on the above image to try out Increment.*

### Common Use Cases {: #common-use-cases }

Increment can be used for:

- [Analyzing blockchain networks](https://www.covalenthq.com/docs/increment/data-models/chain-gdp/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Analyzing DEXs](https://www.covalenthq.com/docs/increment/data-models/swap-land/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Analyzing NFT marketplaces](https://www.covalenthq.com/docs/increment/data-models/jpeg-analysis/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Tracking monthly active wallets](https://www.covalenthq.com/docs/networks/moonbeam/?utm_source=moonbeam&utm_medium=partner-docs#network-status){target=_blank}

[![Example network status increment](/images/builders/integrations/indexers/covalent/covalent-4.png)](https://www.covalenthq.com/docs/networks/moonbeam/?utm_source=moonbeam&utm_medium=partner-docs#network-status){target=_blank} *Click on the above image to get the latest number of Moonbeam network active wallets, transactions and tokens by day, week, month or year.*

### Increment Resources {: #increment-resources }

- [Increment platform](https://www.covalenthq.com/platform/increment/#/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Increment docs](https://www.covalenthq.com/docs/increment/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Data models overview](https://www.covalenthq.com/docs/increment/data-models/model-intro/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Browse all data models](https://www.covalenthq.com/platform/increment/#/pages/covalent/chain-gdp/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}
- [Interact with a data model](https://www.covalenthq.com/platform/increment/#/sql/query_b6c88fd8604f49d5920ca86fa7/?utm_source=moonbeam&utm_medium=partner-docs){target=_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
