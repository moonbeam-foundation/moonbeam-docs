---
title: API Providers
description: Use one of the supported API providers to connect via JSON RPC and WSS endpoints to Moonbeam-based networks.
---

# API Providers

![API Providers banner](/images/builders/get-started/api-providers/api-providers-banner.png)

## PureStake Development Endpoints

Moonbeam-based networks have two endpoints available for users to connect to: one for HTTPS and one for WSS. The RPC and WSS endpoints hosted by PureStake are for development purposes only and are **not** meant to be used in production applications.

### Moonbase Alpha

=== "HTTPS RPC"
    ```
    https://rpc.testnet.moonbeam.network
    ```

=== "WSS"
    ```
    wss://wss.testnet.moonbeam.network
    ```

To connect to the Moonbase Alpha relay chain, managed by PureStake, you can use the following WS Endpoint:

```
wss://wss-relay.testnet.moonbeam.network
```

### Moonriver

=== "HTTPS RPC"
    ```
    https://rpc.moonriver.moonbeam.network
    ```

=== "WSS"
    ```
    wss://wss.moonriver.moonbeam.network
    ```

## Production Endpoints

The following providers are suitable for production-use on Moonbeam:

- [Bware Labs](https://bwarelabs.com/)
- [Elara](https://elara.patract.io/)
- [OnFinality](https://onfinality.io/)

If you're looking to get started quickly, you can use one of the [Public Endpoints](#public-endpoints), or you can also create your own [Custom Endpoints](#custom-endpoints) for each of your projects.

### Public Endpoints

#### Moonbase Alpha

The following HTTPS RPC endpoints are available:

=== "OnFinality"
    ```
    https://moonbeam-alpha.api.onfinality.io/public
    ```

The following WSS endpoints are available:

=== "Elara"
    ```
    wss://moonbase.moonbeam.elara.patract.io
    ```

=== "OnFinality"
    ```
    wss://moonbeam-alpha.api.onfinality.io/public-ws
    ```

#### Moonriver

The following HTTPS RPC endpoints are available:

=== "Elara"
    ```
    https://pub.elara.patract.io/moonriver
    ```
    
=== "OnFinality"
    ```
    https://moonriver.api.onfinality.io/public
    ```

The following WSS endpoints are available:

=== "Elara"
    ```
    wss://pub.elara.patract.io/moonriver
    ```

=== "OnFinality"
    ```
    wss://moonriver.api.onfinality.io/public-ws
    ```

### Custom Endpoints

#### Bware Labs

To get started, you'll need to head to [Bware Labs](https://app.bwarelabs.com/), and launch the app, and connect your wallet. Once your wallet is connected you will be able to generate your own custom endpoint. To generate an endpoint:

1. Select a network for your endpoint. There are two options to choose from: Moonbeam and Moonriver. If you're looking for the Moonbase Alpha TestNet, you can choose Moonbeam 
2. Give your endpoint a name
3. Select the network from the dropdown
4. Click **Create Endpoint**

#### Elara

To get started, navigate to [Elara](https://elara.patract.io/) and create an account using your GitHub credentials. Once signed in, from the **Dashboard** you can generate a API endpoint by creating a new project:

1. Click **Create New Project**
2. Enter your project name
3. Select the network
4. Click **Create** to the project

#### OnFinality

To create a custom OnFinality endpoint, go to [OnFinality](https://onfinality.io/) and sign up, or if you already have signed up you can go ahead and log in. From the OnFinality **Dashboard**, you can:

1. Click on **API Service**
2. Select the network from the dropdown
3. Your custom API endpoint will be generated automatically