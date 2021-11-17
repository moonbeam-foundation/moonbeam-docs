## API Providers

There are some different API providers you can choose from depending upon your needs:

- [Development endpoints](#purestake-development-endpoints)
- [Public production endpoints](#public-production-endpoints)
- [Custom endpoints](/builders/get-started/api-providers)

### PureStake Development Endpoints

Moonbeam-based networks have two endpoints available for users to connect to: one for HTTPS and one for WSS. The RPC and WSS endpoints hosted by PureStake are for development purposes only and are **not** meant to be used in production applications.

=== "HTTPS RPC"
    ```
    https://rpc.moonriver.moonbeam.network
    ```

=== "WSS"
    ```
    wss://wss.moonriver.moonbeam.network
    ```

### Public Production Endpoints

The following providers are suitable for production-use on Moonriver:

- [Bware Labs](https://bwarelabs.com/)
- [Elara](https://elara.patract.io/)
- [OnFinality](https://onfinality.io/)

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

## Quick Start {: #quick-start } 

For the web3.js library, you can create a local Web3 instance and set the provider to connect to Moonriver (both HTTP and WS are supported):

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonriver as provider
const web3 = new Web3("https://rpc.moonriver.moonbeam.network"); 
```

For the ethers.js library, define the provider by using `ethers.providers.StaticJsonRpcProvider(providerURL, {object})` and setting the provider URL to Moonriver:

```js
const ethers = require('ethers');


const providerURL = "https://rpc.moonriver.moonbeam.network";
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1285,
    name: 'moonriver'
});
```

Any Ethereum wallet should be able to generate a valid address for Moonbeam (for example, [MetaMask](https://metamask.io/)).

## Chain ID {: #chain-id } 

The Moonriver chain ID is: `1285`, or `0x505` in hex.
