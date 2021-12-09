---
title: Substrate API Sidecar
description: Information on how to use Substrate-based REST service with Moonbeam networks
---

# Using Substrate API Sidecar with Moonbeam

## Introduction {: #introduction } 

Substrate API Sidecar allows applications to access blocks, account balance, and other information of Substrate-based blockchains through a REST API. This can be useful for exchanges, wallets or other types of applications that need to keep track of account balance and other state changes on a Moonbeam network. This page will describe how to install and run a Substrate API Sidecar for Moonbeam, and the commonly used API endpoints.

## Installing and Running Substrate API Sidecar {: #installing-and-running-substrate-api-sidecar } 

There are multiple ways of installing and running the Substrate API Sidecar. This guide will describe the steps for installing and running it locally through NPM. For running Substrate API Sidecar through Docker, or building and running it from source, please refer to the [Substrate API Sidecar Github Repository](https://github.com/paritytech/substrate-api-sidecar#readme).

### Prerequisites {: #prerequisites }

Running this service locally through NPM requires node.js to be installed. 

--8<-- 'text/common/install-nodejs.md'

### Installation {: #installation }

To install the Substrate API Sidecar service globally, run this from the command line:

```
npm install -g @substrate/api-sidecar@9.2.0
```

Substrate API Sidecar v9.2.0 is the current stable version that has been tested to work with Moonbeam networks. You can verify the installation was successful by typing:

```
substrate-api-sidecar --version
```

### Set Environmental Variables {: #set-environmental-variables }

In the shell that Sidecar will run, export the environmental variable for the WS endpoint of the network: 

```
export SAS_SUBSTRATE_WS_URL=WEBSOCKET ENDPOINT OF THE NODE/NETWORK
```

Examples: 

For local node (default endpoint):

```
export SAS_SUBSTRATE_WS_URL=ws://127.0.0.1:9944
```

For Moonriver Public Endpoint:

```
export SAS_SUBSTRATE_WS_URL=wss://wss.moonriver.moonbeam.network
```

Please reference the [Public Endpoints](/builders/get-started/endpoints/) page for a full list of Moonbeam network endpoints.

After setting the environmental variable, you can use the `echo` command to check that the environmental variable has been set correctly, by typing:

```
echo SAS_SUBSTRATE_WS_URL
```

And it should display the network endpoint you have just set. 

### Running Substrate API Sidecar {: #running-substrate-api-sidecar } 

In the current shell with the environmental variables, run:

```
substrate-api-sidecar  
```

If the installation and configuration are successful, you should see this output in the console: 

![Successful Output](/images/builders/tools/sidecar/sidecar-1.png)

## Substrate API Sidecar Endpoints {: #substrate-api-sidecar-endpoints } 

Some of the commonly used Substrate API Sidecar endpoints include:

 - **GET /blocks​/head** — Get the most recently finalized block. The optional parameter `finalized` can be set to `false` to the get the newest known block, which may not be finalized.
 - **GET /blocks/head/header** — Get the most recently finalized block header. The optional parameter `finalized` can be set to `false` to the get the newest known block header, which may not be finalized. 
 - **GET /blocks/{blockId}** — Get a block by its height or hash.
 - **GET /accounts/{accountId}/balance-info** — Get balance information for an account.
 - **GET /node/version** — Get information about the Substrates node's implementation and versioning.
 - **GET /runtime/metadata** — Get the runtime metadata in decoded, JSON form.

For a full list of API endpoints available on Substrate API Sidecar, please refer to the [official documentation](https://paritytech.github.io/substrate-api-sidecar/dist/).

## Public Moonbeam Sidecar Deployments  {: #public-moonbeam-sidecar-deployments }

There are public Substrate API Sidecar deployments for Moonbeam networks and can be used by querying their endpoints according to the API. 

=== "Moonriver"
    ```
    https://moonriver-rest-api.moonriver.moonbeam.network
    ```

=== "Moonbase Alpha Relay"
    ```
    https://alphanet-rest-api.testnet.moonbeam.network
    ```