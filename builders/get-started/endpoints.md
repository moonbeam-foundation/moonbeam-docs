---
title: Network Endpoints
description: Use one of the supported API providers to connect to a public endpoint or create custom JSON RPC and WSS endpoints to Moonbeam-based networks.
---

# Network Endpoints

![API Providers banner](/images/builders/get-started/endpoints/endpoints-banner.png)

## Public Endpoints

Moonbeam-based networks have two endpoints available for users to connect to: one for HTTPS and one for WSS. 

The endpoints in this section are for development purposes only and are not meant to be used in production applications.

If you are looking for an API provider suitable for production use, you can check out the [Endpoint Providers](#endpoint-providers) section of this guide. 

### Moonbase Alpha Endpoints

--8<-- 'code/endpoints/moonbase.md'

### Moonriver Endpoints

--8<-- 'code/endpoints/moonriver.md'

## Endpoint Providers

You can create your own endpoint suitable for development or production use using any of the following API providers:

- [Bware Labs](#bware-labs)
- [OnFinality](#onfinality)

### Bware Labs

As a user of the [Bware Labs](https://bwarelabs.com/) platform, you will be able to obtain your own free endpoint allowing you to interact with Moonbeam, just by performing a few simple clicks within a user-friendly interface.

To get started, you'll need to head to [Bware Labs](https://app.bwarelabs.com/), and launch the app, and connect your wallet. Once your wallet is connected you will be able to generate your own custom endpoint. To generate an endpoint:

1. Select a network for your endpoint. There are two options to choose from: Moonbeam and Moonriver. If you're looking for the Moonbase Alpha TestNet, you can choose Moonbeam 
2. Give your endpoint a name
3. Select the network from the dropdown
4. Click **Create Endpoint**

![Bware Labs](/images/builders/get-started/endpoints/endpoints-1.png)

### OnFinality

[OnFinality](https://onfinality.io/) provides a free API key based endpoint for customers that provide higher rate limits and performance than the free public endpoint. You also receive more in depth analytics of the usage of your application.

To create a custom OnFinality endpoint, go to [OnFinality](https://onfinality.io/) and sign up, or if you already have signed up you can go ahead and log in. From the OnFinality **Dashboard**, you can:

1. Click on **API Service**
2. Select the network from the dropdown
3. Your custom API endpoint will be generated automatically

![OnFinality](/images/builders/get-started/endpoints/endpoints-3.png)
