---
title: Covalent API
description: Querying Blockchain Data with the Covalent API Moonbeam
---

# Getting Started with the Covalent API

![The Graph on Moonbeam](/images/builders/integrations/indexers/covalent/covalent-banner.png)

## Introduction {: #introduction } 

Covalent provides a unified API to bring full transparency and visibility to assets across all blockchain networks. Simply put, Covalent offers a single API that allows you to pull detailed, granular blockchain transaction data from multiple blockchains with no code. The unified Covalent API allows you to create entirely new applications or augment existing ones without configuring or maintaining infrastructure. Covalent currently supports Moonbase Alpha and Moonriver and plans to support Moonbeam.

This guide will cover all of the details needed to get started with the Covalent API and how to access the API endpoints for Moonbase Alpha using curl commands, and JavaScript and Python snippets. This guide can be adapted for use on Moonriver.

## Types of Endpoints {: #types-of-endpoints } 

The Covalent API has two classes of endpoints:

 - **Class A** — endpoints that return enriched blockchain data applicable to all blockchain networks, eg: balances, transactions, log events, etc
 - **Class B** — endpoints that are for a specific protocol on a blockchain, e.g. Uniswap is Ethereum-only and is not applicable to other blockchain networks

## Fundamentals of the Covalent API {: #fundamentals-of-the-covalent-api } 

 - The Covalent API is RESTful and it is designed around the main resources that are available through the web interface
 - The current version of the API is version 1 
 - The default return format for all endpoints is JSON 
 - All requests require authentication; you will need [a free API Key](https://www.covalenthq.com/platform/#/auth/register/) to use the Covalent API
 - The root URL of the API is https://api.covalenthq.com/v1/ 
 - All requests are done over HTTPS (calls over plain HTTP will fail)
 - The refresh rate of the APIs is real-time: 30s or 2 blocks, and batch 10m or 40 blocks  

## Supported Endpoints {: #supported-endpoints } 

 - **Balances** — Get token balances for an address. Returns a list of all ERC-20 and NFT token balances including ERC-721 and ERC-1155 along with their current spot prices (if available)
 - **Transactions** — Retrieves all transactions for an address including decoded log events. Does a deep-crawl of the blockchain to 
 retrieve all transactions that reference this address
 - **Transfers** — Get ERC-20 token transfers for an address along with historical token prices (if available)
 - **Token Holders** — Return a paginated list of token holders
 - **Log Events (Smart Contract)** — Return a paginated list of decoded log events emitted by a particular smart contract
 - **Log Events (Topic Hash)** — Return a paginated list of decoded log events with one or more topic hashes separated by a comma

### Request Formatting {: #request-formatting } 

| Endpoint                    |  | Format                                                              |
|:----------------------------|::|:--------------------------------------------------------------------|
| Balances                    |  | api.covalenthq.com/v1/1287/address/{address}/balances_v2/           |
| Transactions                |  | api.covalenthq.com/v1/1287/address/{address}/transactions_v2/       |
| Transfers                   |  | api.covalenthq.com/v1/1287/address/{address}/transfers_v2/          |
| Token Holders               |  | api.covalenthq.com/v1/1287/tokens/{contract_address}/token_holders/ |
| Log Events (Smart Contract) |  | api.covalenthq.com/v1/1287/events/address/{contract_address}/       |
| Log Events (Topic Hash)     |  | api.covalenthq.com/v1/1287/events/topics/{topic}/                   |

## Checking Prerequisites {: #checking-prerequisites } 

To get started with the Covalent API, you will need to have the following:

 - A free [Covalent API Key](https://www.covalenthq.com/platform/#/auth/register/)
 - MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/)
 - An account with funds, which you can get from [Mission Control](/builders/get-started/moonbase/#get-tokens/)

## Try it Out {: #try-it-out } 

First, make sure you have [your API Key](https://www.covalenthq.com/platform/#/auth/register/) which begins with `ckey_`. Once you have your API key you will be able to access any of the supported endpoints. To get information for a specific network, you will need to provide the chain ID:

=== "Moonriver"
    ```
    {{ networks.moonriver.chain_id }}
    ```

=== "Moonbase Alpha"
    ```
    {{ networks.moonbase.chain_id }}
    ```

### Using Curl {: #using-curl }

One of the supported endpoints is the token holders endpoint, which returns a list of all the token holders of a particular token. For this example, you can check the token holders for the ERTH token. The contract address for the ERTH token on Moonbase Alpha is `0x08B40414525687731C23F430CEBb424b332b3d35`.

Try running the command below in a terminal window after replacing the placeholder with your API key.

```
curl https://api.covalenthq.com/v1/1287/tokens/\
0x08B40414525687731C23F430CEBb424b332b3d35/token_holders/ \
-u {YOUR API KEY HERE}:
```

!!! note
    The colon `:` after the API key is important because otherwise you will be prompted for a password (which is not needed).

Unless you already owned some ERTH tokens, your address will be missing from that list. Head over to the [Moonbase Alpha ERC-20 Faucet](https://moonbase-minterc20.netlify.app/) to generate some ERTH tokens for yourself. Now repeat the same Covalent API request as above. The Covalent API updates in real-time, so you should now see your address in the list of token holders for the ERTH token.

## Javascript Examples {: #javascript-examples } 

Copy and paste the below code block into your preferred environment, or [JSFiddle](https://jsfiddle.net/). After setting the API key, set the address constant. Remember for Moonbase Alpha the chain ID is `{{ networks.moonbase.chain_id }}`.

=== "Using Fetch"
    ```js
    // set your API key
	const APIKEY = 'YOUR API KEY HERE';

	function getData() {
    const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // example
    const chainId = '{{ networks.moonbase.chain_id }}'; // Moonbase Alpha TestNet chain ID
    const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`);
    
    url.search = new URLSearchParams({
        key: APIKEY
    })

    // use fetch API to get Covalent data
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data) {
        const result = data.data;
  
        console.log(result)
        return result
        }
	)}

    getData();
    ```

=== "Using Async"
    ```js
    // set your API key
    const APIKEY = 'YOUR API KEY HERE';
	const address = '0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8'; // example
	const chainId = '{{ networks.moonbase.chain_id }}'; // Moonbase Alpha TestNet chain ID
	const url = new URL(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`);

    url.search = new URLSearchParams({
        key: APIKEY
    })

    async function getData() {
    	const response = await fetch(url);
    	const result = await response.json();
    	console.log(result)
    	return result;
	}

	getData();
    ```

The balances endpoint returns a list of all ERC-20 and NFT token balances, including ERC-721 and ERC-1155 balances, along with their current spot prices (if available).

![Javascript Console Output](/images/builders/integrations/indexers/covalent/covalentjs.png)

## Python Example {: #python-example } 

Covalent doesn’t have an official API wrapper. To query the API directly you will have to use the Python [requests library](https://pypi.org/project/requests/). Install requests into your environment from the command line with `pip install requests`. Then import it and use it in your code. Use the HTTP verbs get methods to return the information from the API. Copy and paste the below code block into your preferred environment and run it. The output should look similiar to the screenshot above, however the formatting may vary depending on your environment.

```python
import requests

def fetch_wallet_balance(address):
	api_url = 'https://api.covalenthq.com'
    endpoint = f'/v1/{{ networks.moonbase.chain_id }}/address/{address}/balances_v2/'
    url = api_url + endpoint
    response = requests.get(url, auth=('YOUR API KEY HERE',''))
    print(response.json())
    return(response.json())

# Example address request
fetch_wallet_balance('0xFEC4f9D5B322Aa834056E85946A32c35A3f5aDD8')
```

!!! note
    The 2nd parameter of `auth` is empty, because there is no password required - your API key is all that's needed.
