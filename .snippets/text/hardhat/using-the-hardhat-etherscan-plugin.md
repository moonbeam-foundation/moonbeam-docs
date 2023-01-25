
To get started with the Hardhat Etherscan plugin, you will need to first install the plugin library:

```
npm install --save-dev @nomiclabs/hardhat-etherscan
```

!!! note
    Support for Moonbeam-based networks was added in version 3.0.1 of `@nomiclabs/hardhat-etherscan`. You can double check what version you're using by looking under the `devDependencies` section of your `package.json` and updating to version 3.0.1 or greater if needed.

You can add your Moonscan API key to the `secrets.json` file alongside your private key. For this example, you'll need a [Moonbeam Moonscan](https://moonscan.io/){target=_blank} API key. If you want to verify a contract on Moonriver, you'll need a [Moonriver Moonscan](https://moonriver.moonscan.io/){target=_blank} API key.

From within your Hardhat project, open your `hardhat.config.js` file. You'll need to import the `hardhat-etherscan` plugin, your Moonscan API key, and add the config for Etherscan:

```js
require("@nomiclabs/hardhat-etherscan");

const { privateKey, moonbeamMoonscanAPIKey, moonriverMoonscanAPIKey } = require('./secrets.json');

module.exports = {
  networks: {
    moonbeam: { ... },
    moonriver: { ... },
    moonbase: { ... }
  },
  etherscan: {
    apiKey: {
      moonbeam: moonbeamMoonscanAPIKey, // Moonbeam Moonscan API Key
      moonriver: moonriverMoonscanAPIKey, // Moonriver Moonscan API Key
      moonbaseAlpha: moonbeamMoonscanAPIKey, // Moonbeam Moonscan API Key    
    }
  }
};
```
