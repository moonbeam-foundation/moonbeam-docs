## Network Endpoints {: #network-endpoints }

Moonbase Alpha has two types of endpoints available for users to connect to: one for HTTPS and one for WSS.

If you're looking for your own endpoints suitable for production use, you can check out the [Endpoint Providers](/builders/get-started/endpoints/#endpoint-providers){target=\_blank} section of our documentation. Otherwise, to get started quickly you can use one of the following public HTTPS or WSS endpoints.

--8<-- 'text/builders/get-started/endpoints/moonbase.md'

## Quick Start {: #quick-start }

For the [Ethers.js library](/builders/ethereum/libraries/ethersjs/){target=\_blank}, define the provider by using `ethers.JsonRpcProvider(providerURL, {object})` and setting the provider URL to Moonbase Alpha:

```js
const ethers = require('ethers'); // Load Ethers library

const providerURL = 'https://rpc.api.moonbase.moonbeam.network';
// Define provider
const provider = new ethers.JsonRpcProvider(providerURL, {
    chainId: 1287,
    name: 'moonbase-alphanet'
});
```

Any Ethereum wallet should be able to generate a valid address for Moonbeam (for example, [MetaMask](https://metamask.io){target=\_blank}).

## Chain ID {: #chain-id }

Moonbase Alpha TestNet chain ID is: `1287`, which is `0x507` in hex.
