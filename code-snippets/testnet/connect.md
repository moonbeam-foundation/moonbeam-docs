### HTTPS DNS

To connect to Moonbase via HTTPS, simply point your provider to the following RPC DNS:

```
https://rpc.testnet.moonbeam.network
```

For the Web3 library, create a local Web3 instance and set the provider to connect to the Moonbeam TestNet:

```js
const Web3 = require('web3'); //Load Web3 library
.
.
.
//Create local Web3 instance - set the Moonbeam TestNet as provider
const web3 = new Web3('https://rpc.testnet.moonbeam.network'); 
```
Any Ethereum wallet should be able to generate a valid address for Moonbeam (for example, [MetaMask](https://metamask.io/)).

### WSS DNS

For WebSocket connections, you can use the following RPC DNS:

```
wss://wss.testnet.moonbeam.network
```
