## API Providers

There are some different API providers you can choose from depending upon your needs:

- [Development endpoints](#purestake-development-endpoints)
- [Public production endpoints](#public-production-endpoints)
- [Custom endpoints](/builders/get-started/api-providers)

### PureStake Development Endpoints

Moonbeam-based networks have two endpoints available for users to connect to: one for HTTPS and one for WSS. The RPC and WSS endpoints hosted by PureStake are for development purposes only and are **not** meant to be used in production applications.

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

### Public Production Endpoints

The following providers are suitable for production-use on Moonbase Alpha:

- [Bware Labs](https://bwarelabs.com/)
- [Elara](https://elara.patract.io/)
- [OnFinality](https://onfinality.io/)

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

You can also create your own custom endpoint for development or production-use, to do so check out the [API Providers](/builders/get-started/api-providers) page of our documentation.

## Quick Start {: #quick-start } 

For the web3.js library, you can create a local Web3 instance and set the provider to connect to Moonbase Alpha (both HTTP and WS are supported):

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonbase Alpha as provider
const web3 = new Web3('https://rpc.testnet.moonbeam.network'); 
```
For the ethers.js library, define the provider by using `ethers.providers.StaticJsonRpcProvider(providerURL, {object})` and setting the provider URL to Moonbase Alpha:

```js
const ethers = require('ethers');


const providerURL = 'https://rpc.testnet.moonbeam.network';
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1287,
    name: 'moonbase-alphanet'
});
```

Any Ethereum wallet should be able to generate a valid address for Moonbeam (for example, [MetaMask](https://metamask.io/)).

## Chain ID {: #chain-id } 

For the Moonbase Alpha TestNet the chain ID is: `1287`, which is `0x507` in hex.

## Relay Chain {: #relay-chain } 

To connect to the Moonbase Alpha relay chain, managed by PureStake, you can use the following WS Endpoint:

```
wss://wss-relay.testnet.moonbeam.network
```