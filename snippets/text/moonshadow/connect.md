### HTTPS DNS

To connect to Moonshadow via HTTPS, simply point your provider to the following RPC DNS:

```
https://rpc.moonshadow.moonbeam.network
```

For the web3.js library, you can create a local Web3 instance and set the provider to connect to Moonshadow (both HTTP and WS are supported):

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set Moonshadow as provider
const web3 = new Web3('https://rpc.moonshadow.moonbeam.network'); 
```
For the ethers.js library, define the provider by using `ethers.providers.StaticJsonRpcProvider(providerURL, {object})` and setting the provider URL to Moonshadow:

```js
const ethers = require('ethers');


const providerURL = 'https://rpc.moonshadow.moonbeam.network';
// Define Provider
const provider = new ethers.providers.StaticJsonRpcProvider(providerURL, {
    chainId: 1288,
    name: 'moonshadow'
});
```

Any Ethereum wallet should be able to generate a valid address for all Moonbeam deployment (for example, [MetaMask](https://metamask.io/)).

### WSS DNS

For WebSocket connections, you can use the following DNS:

```
wss://wss.moonshadow.moonbeam.network
```

### Chain ID

For the Moonshadow parachain the chain ID is: `1288`.
