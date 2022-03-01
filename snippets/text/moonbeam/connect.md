## Connect to Moonbeam

### Network Endpoints

Moonbeam has two types of endpoints available for users to connect to: one for HTTPS and one for WSS. You can check out the [Endpoint Providers](/builders/get-started/endpoints/){target=blank} section of the documentation to get your own endpoint and API key from one of the supported providers.

### Quick Start {: #quick-start } 

Before getting started, make sure you've retrieved your own endpoint and API key from one of the custom [Endpoint Providers](/builders/get-started/endpoints/){target=blank}. Then for the web3.js library, you can create a local Web3 instance and set the provider to connect to Moonbeam (both HTTP and WS are supported):

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonbeam as provider
const web3 = new Web3("RPC-API-ENDPOINT-HERE"); 
```

For the ethers.js library, define the provider by using `ethers.providers.StaticJsonRpcProvider(providerURL, {object})` and setting the provider URL to Moonbeam:

```js
const ethers = require('ethers');

const providerURL = "RPC-API-ENDPOINT-HERE";
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1284,
    name: 'moonbeam'
});
```

Any Ethereum wallet should be able to generate a valid address for Moonbeam (for example, [MetaMask](https://metamask.io/)).

### Chain ID {: #chain-id } 

Moonbeam chain ID is: `1284`, or `0x504` in hex.
