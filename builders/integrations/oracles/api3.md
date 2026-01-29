---
title: Request Off-Chain Data with API3
description: Learn how to use API3 to request and receive off-chain data from within your smart contracts using API3 Airnodes and dAPIs (data feeds) on Moonbeam networks.
categories: Oracle Nodes
---

# Use API3 To Request Off-Chain Data on Moonbeam

## Introduction {: #introduction }

API3 is a decentralized solution for delivering traditional API services to smart contract platforms in an easily accessible and scalable way. It is governed by a Decentralized Autonomous Organization (DAO), the API3 DAO. API3 enables developers to access off-chain resources from within their smart contracts without worrying about security implications. API3 makes this possible through Airnodes, which are first-party oracles, and on-chain data feeds sourced from these oracles.

Developers can use [Airnode](https://airnode-docs.api3.org/reference/airnode/latest/understand/){target=_blank} to request off-chain data inside their smart contracts on Moonbeam networks. An Airnode is a first-party oracle that pushes off-chain API data to your on-chain contract. Airnode lets API providers easily run their own first-party oracle nodes. That way, they can provide data to any on-chain dApp interested in their services, all without an intermediary.

An on-chain smart contract requests the [RRP (Request Response Protocol)](https://airnode-docs.api3.org/reference/airnode/latest/developers/){target=_blank} contract ([`AirnodeRrpV0.sol`](https://github.com/api3dao/airnode/blob/v0.11/packages/airnode-protocol/contracts/rrp/AirnodeRrpV0.sol){target=_blank}) that adds the request to the event logs. The Airnode then accesses the event logs, fetches the API data, and performs a callback to the requester with the requested data.

![A diagram detailing the Airnode flow.](/images/builders/integrations/oracles/api3/api3-1.webp)

--8<-- 'text/_disclaimers/third-party-content-intro.md'

## Request Off-Chain Data From an Airnode {: #calling-an-airnode }

Requesting off-chain data essentially involves triggering an Airnode and getting its response through your smart contract. The smart contract in this case would be the requester contract, which will make a request to the desired off-chain Airnode and then capture its response.

The requester calling an Airnode primarily focuses on two tasks:

- Making the request
- Accepting and decoding the response

![A diagram detailing the process of requesting off-chain data from an Airnode.](/images/builders/integrations/oracles/api3/api3-2.webp)

Here is an example of a basic requester contract to request data from an Airnode:

```solidity
--8<-- 'code/builders/integrations/oracles/api3/1.sol'
```

You can also try [deploying the example contract on Remix](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/RequesterWithWithdrawal.sol&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.9+commit.e5eed63a.js){target=_blank}.

### Contract Addresses {: #contract-addresses }

The `_rrpAddress` is the main `airnodeRrpAddress`. The RRP contracts have already been deployed on-chain. The [addresses for the `_rrpAddress`](https://airnode-docs.api3.org/reference/airnode/latest/){target=_blank} on Moonbeam networks are as follows:

=== "Moonbeam"

    |   Contract   |             Addresses              |
    |:------------:|:----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonbeam.api3.rrp }}` |

=== "Moonriver"

    |   Contract   |              Addresses              |
    |:------------:|:-----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonriver.api3.rrp }}` |

=== "Moonbase Alpha"

    |   Contract   |             Addresses              |
    |:------------:|:----------------------------------:|
    | AirnodeRrpV0 | `{{ networks.moonbase.api3.rrp }}` |

### Request Parameters {: #request-params }

The `makeRequest()` function expects the following parameters to make a valid request:

- [**`airnode`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/airnode.html){target=_blank} - specifies the Airnode address
- [**`endpointId`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/endpoint.html){target=_blank} - specifies which endpoint to be used
- [**`sponsor`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/sponsor.html){target=_blank} and [**`sponsorWallet`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/sponsor.html#sponsorwallet){target=_blank} - specifies which wallet will be used to fulfill the request
- [**`parameters`**](https://airnode-docs.api3.org/reference/airnode/latest/specifications/reserved-parameters.html){target=_blank} - specifies the API and Reserved Parameters (see [Airnode ABI specifications](https://airnode-docs.api3.org/reference/airnode/latest/specifications/airnode-abi.html){target=_blank} for how these are encoded). Parameters can be encoded off-chain using the `@airnode-abi` library

### Response Parameters {: #response-params }

The callback to the requester contract contains two parameters:

- [**`requestId`**](https://airnode-docs.api3.org/reference/airnode/latest/concepts/request.html#requestid){target=_blank} - first acquired when making the request and passed here as a reference to identify the request for which the response is intended
- **`data`** - in case of a successful response, this is the requested data encoded and contains a timestamp in addition to other response data. Decode it using the `decode()` function from the `abi` object

!!! note
    Sponsors should not fund a `sponsorWallet` with more than they can trust the Airnode with, as the Airnode controls the private key to the `sponsorWallet`. The deployer of such Airnode undertakes no custody obligations, and the risk of loss or misuse of any excess funds sent to the `sponsorWallet` remains with the sponsor.

## dAPIs: API3 Data Feeds {: #dapis }

[dAPIs](https://docs.api3.org/oev-searchers/in-depth/data-feeds/){target=_blank} are continuously updated streams of off-chain data, such as the latest cryptocurrency, stock, and commodity prices. They can power decentralized applications such as DeFi lending, synthetic assets, stablecoins, derivatives, NFTs, and more.

The data feeds are continuously updated by [first-party oracles](https://docs.api3.org/oev-searchers/glossary.html#first-party-oracles){target=_blank} using signed data. DApp owners can read the on-chain value of any dAPI in real-time.

Because they are composed of first-party data feeds, dAPIs offer security, transparency, cost-efficiency, and scalability in a turnkey package.

![The API3 Market dashboard.](/images/builders/integrations/oracles/api3/api3-3.webp)

To learn more about how dAPIs work, please refer to [API3's documentation](https://docs.api3.org/oev-searchers/in-depth/data-feeds/){target=_blank}.

### Subscribe to dAPIs {: #subscribing-to-dapis }

The [API3 Market](https://market.api3.org/){target=_blank} lets users access dAPIs on [Moonbeam](https://market.api3.org/moonbeam){target=_blank}, [Moonriver](https://market.api3.org/moonriver){target=_blank}, and the [Moonbase Alpha TestNet](https://market.api3.org/moonbeam-testnet){target=_blank} (currently labeled as the Moonbeam TestNet).

From the [API3 Market home page](https://market.api3.org/){target=_blank}, you can search for a given chain. After selecting the chain, you can view the list of available dAPIs and click on one for more information. For example, you can click on the `USDT/USD` pair available for Moonbeam to view the parameters of the dAPI, including the deviation and the heartbeat.

The supported parameters for dAPIs are:

| Deviation | Heartbeat |
|-----------|-----------|
| 0.25%     | 24 hours  |
| 0.5%      | 24 hours  |
| 1%        | 24 hours  |
| 5%        | 24 hours  |

![The USDT/USD dAPI detail page.](/images/builders/integrations/oracles/api3/api3-4.webp)

### Configure and Activate a dAPI {: #select-a-dapi }

Once you've selected a dAPI to interact with, check the expiration date and update the parameters as needed. You can update the parameters and extend the subscription by purchasing a new configuration. If the dAPI has been activated and the configurations listed will work for you, you can skip ahead to the next section to learn how to [interact with the dAPI](#get-data).

To purchase a plan with new configurations, click on **Purchase new plan** and take the following steps:

1. Select your parameters
2. Click on **Connect Wallet**

![The activate data feed page.](/images/builders/integrations/oracles/api3/api3-5.webp)

Once connected, you'll be able to purchase your new plan. Click on **Purchase** and sign the transaction. After the transaction has been confirmed, you will be able to see the updated configuration for the dAPI.

### Get Data from a dAPI {: #get-data}

To interact with a dAPI, you'll need to get the proxy address for it. Click on the **Integrate** button from the dAPI details page. Then, on the integration page, copy the proxy address.

![The integrate data feed page.](/images/builders/integrations/oracles/api3/api3-6.webp)

With the proxy address in hand, you'll be able to integrate the dAPI into a smart contract. Here's an example of a basic contract that reads from a dAPI:

```solidity
--8<-- 'code/builders/integrations/oracles/api3/2.sol'
```

The example contract contains two functions:

- `setProxyAddress()` - used to set the address of the dAPI proxy contract
- `readDataFeed()` - a `view` function that returns the latest price of the set dAPI

[Try deploying it on Remix](https://remix.ethereum.org/#url=https://github.com/api3-ecosystem/remix-contracts/blob/master/contracts/DapiReader.sol&lang=en&optimize=false&runs=200&evmVersion=null&version=soljson-v0.8.18+commit.87f61d96.js){target=_blank}!


## Additional Resources {: #additional-resources }

Here are some additional developer resources:

- [API3 Market](https://market.api3.org/moonbeam){target=_blank}
- [API3 Docs](https://docs.api3.org){target=_blank}
- [API3 DAO GitHub](https://github.com/api3dao){target=_blank}
- [API3 Medium](https://medium.com/api3){target=_blank}
- [API3 YouTube](https://www.youtube.com/API3DAO){target=_blank}

--8<-- 'text/_disclaimers/third-party-content.md'
