### API Providers

The following API providers are supported on the Moonbase Alpha TestNet: 

- [PureStake](/builders/get-started/api-providers#purestake-development-endpoints) - for development purposes only
- [Bware Labs](https://bwarelabs.com/)
- [Elara](https://elara.patract.io/)
- [OnFinality](https://onfinality.io/)

For more information on each of the supported API Providers, head over to the [API Providers](/builders/get-started/api-providers) section of our documentation.

### Quick Start {: #quick-start } 

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

### Chain ID {: #chain-id } 

For the Moonbase Alpha TestNet the chain ID is: `1287`, which is `0x507` in hex.

### Relay Chain {: #relay-chain } 

To connect to the Moonbase Alpha relay chain, managed by PureStake, you can use the following WS Endpoint:

```
wss://wss-relay.testnet.moonbeam.network
```