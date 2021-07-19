
The Moonriver RPC and WSS endpoints hosted by PureStake are for development purposes only and are not meant to be used in production applications. The following are alternative endpoint providers:

- [OnFinality](https://onfinality.io/)
- [Elara](https://elara.patract.io/)

### HTTPS DNS

To connect to Moonriver via HTTPS, simply point your provider to the following RPC DNS:

```
https://rpc.moonriver.moonbeam.network
```

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

### WSS DNS

For WebSocket connections, you can use the following DNS:

```
wss://wss.moonriver.moonbeam.network
```

### Chain ID

The Moonriver chain ID is: `1285`
