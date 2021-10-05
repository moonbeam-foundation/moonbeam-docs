
The Moonriver RPC and WSS endpoints hosted by PureStake are for development purposes only and are not meant to be used in production applications. The following API providers do offer production level infrastructure (with some limited free tiers as well):

- [OnFinality](https://onfinality.io/)
- [Bware Labs](https://bwarelabs.com/)
- [Elara](https://elara.patract.io/)

### HTTPS DNS {: #https-dns } 

To connect to Moonriver via HTTPS, simply point your provider to one of the following RPC DNS:

=== "PureStake"
    ```
    https://rpc.moonriver.moonbeam.network
    ```

=== "OnFinality"
    ```
    https://moonriver.api.onfinality.io/public
    ```

=== "Elara"
    ```
    https://pub.elara.patract.io/moonriver
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

### WSS DNS {: #wss-dns } 

For WebSocket connections, you can use the following DNS:

=== "PureStake"
    ```
    wss://wss.moonriver.moonbeam.network
    ```

=== "OnFinality"
    ```
    wss://moonriver.api.onfinality.io/public-ws
    ```

=== "Elara"
    ```
    wss://pub.elara.patract.io/moonriver
    ```

### Chain ID {: #chain-id } 

The Moonriver chain ID is: `1285`, or `0x505` in hex.
