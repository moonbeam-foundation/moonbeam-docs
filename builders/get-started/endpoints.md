---
title: Moonbeam API Providers and Endpoints
description: Use one of the supported API providers to connect to a public endpoint or create custom JSON RPC and WSS endpoints for Moonbeam-based networks.
---

# Network Endpoints

![API Providers banner](/images/builders/get-started/endpoints/endpoints-banner.png)

## Public Endpoints {: #public-endpoints }

There are public endpoints available for development on the Moonbase Alpha TestNet. For Moonbeam or Moonriver, you'll need to get your own endpoint from one of the supported [Endpoint Providers](#endpoint-providers).

Moonbase Alpha has two endpoints available for users to connect to: one for HTTPS and one for WSS.

### HTTPS {: #https }

--8<-- 'code/endpoints/moonbase-https.md'

### WSS {: #wss }

--8<-- 'code/endpoints/moonbase-wss.md'

### Relay Chain {: #relay-chain }

--8<-- 'text/testnet/relay-chain.md'

Moonriver has two endpoints available for users to connect to: one for HTTPS and one for WSS.

### HTTPS {: #https }

--8<-- 'code/endpoints/moonriver-https.md'

### WSS {: #wss }

--8<-- 'code/endpoints/moonriver-wss.md'

Moonbeam has two endpoints available for users to connect to: one for HTTPS and one for WSS.

### HTTPS {: #https }

--8<-- 'code/endpoints/moonbeam-https.md'

### WSS {: #wss }

--8<-- 'code/endpoints/moonbeam-wss.md'

## Endpoint Providers {: #endpoint-providers }

You can create your own endpoint suitable for development or production use using any of the following API providers:

- [Blast](#blast)
- [OnFinality](#onfinality)

### Blast {: #blast}

As a user of [Blast](https://blastapi.io/){target=_blank} powered by Bware Labs, you will be able to obtain your own free endpoint allowing you to interact with Moonbeam, just by performing a few simple clicks within a user-friendly interface.

To get started, you'll need to head to [Blast](https://blastapi.io/){target=_blank}, and launch the app, and connect your wallet. Once your wallet is connected you will be able to create a project and then generate your own custom endpoint. To generate an endpoint:

1. Create a new project
2. Click on **Available Endpoints**
3. Select a network for your endpoint. There are three options to choose from: Moonbeam, Moonriver and Moonbase Alpha
4. Confirm the selected network and Press **Activate**
5. You'll now see your chosen network under **Active Endpoints**. Click on the network and you'll see your custom RPC and WSS endpoints on the next page 

![Bware Labs](/images/builders/get-started/endpoints/endpoints-1.png)

### OnFinality {: #onfinality }

[OnFinality](https://onfinality.io/){target=_blank} provides a free API key based endpoint for customers that provide higher rate limits and performance than the free public endpoint. You also receive more in depth analytics of the usage of your application.

To create a custom OnFinality endpoint, go to [OnFinality](https://onfinality.io/){target=_blank} and sign up, or if you already have signed up you can go ahead and log in. From the OnFinality **Dashboard**, you can:

1. Click on **API Service**
2. Select the network from the dropdown
3. Your custom API endpoint will be generated automatically

![OnFinality](/images/builders/get-started/endpoints/endpoints-2.png)
