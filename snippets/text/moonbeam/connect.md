## Connect to Moonbeam

### Network Endpoints

Moonbeam has two types of endpoints available for users to connect to: one for HTTPS and one for WSS. 

If you're looking for your own endpoints suitable for production use, you can check out the [Endpoint Providers](/builders/get-started/endpoints/#endpoint-providers) section of our documentation. Otherwise, to get started quickly you can use one of the following public HTTPS or WSS endpoints:

--8<-- 'code/endpoints/moonbeam.md'

### Quick Start {: #quick-start } 

For the web3.js library, you can create a local Web3 instance and set the provider to connect to Moonbeam (both HTTP and WS are supported):

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonbeam as provider
const web3 = new Web3("https://rpc.api.moonbeam.network"); 
```

For the ethers.js library, define the provider by using `ethers.providers.StaticJsonRpcProvider(providerURL, {object})` and setting the provider URL to Moonbeam:

```js
const ethers = require('ethers');


const providerURL = "https://rpc.api.moonbeam.network";
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1284,
    name: 'moonbeam'
});
```

Any Ethereum wallet should be able to generate a valid address for Moonbeam (for example, [MetaMask](https://metamask.io/)).

### Chain ID {: #chain-id } 

Moonbeam chain ID is: `1284`, or `0x504` in hex.
