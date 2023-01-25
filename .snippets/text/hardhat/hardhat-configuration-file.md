Before you can deploy the contract to Moonbase Alpha, you'll need to modify the Hardhat configuration file and create a secure file to store your private key in.

You can create a `secrets.json` file to store your private key by running:

```
touch secrets.json
```

Then add your private key to it:

```json
{
    "privateKey": "YOUR-PRIVATE-KEY-HERE"
}
```

Make sure to add the file to your project's `.gitignore`, and to never reveal your private key.

!!! note
    Please always manage your private keys with a designated secret manager or similar service. Never save or commit your private keys inside your repositories.

Next you can take the following steps to modify the `hardhat.config.js` file and add Moonbase Alpha as a network:

1. Import the Ethers plugin
2. Import the `secrets.json` file
3. Inside the `module.exports`, you need to provide the Solidity version (`0.8.1` according to our contract file)
4. Add the Moonbase Alpha network configuration

```js
// 1. Import the Ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Moonbase Alpha testing account
const { privateKey } = require('./secrets.json');

module.exports = {
  // 3. Specify the Solidity version
  solidity: "0.8.1",

  networks: {
    // 4. Add the Moonbase Alpha network specification
    moonbase: {
      url: '{{ networks.moonbase.rpc_url }}',
      chainId: {{ networks.moonbase.chain_id }}, // {{ networks.moonbase.hex_chain_id }} in hex,
      accounts: [privateKey]
    }
  }
};
```

You can modify the `hardhat.config.js` file to use any of the Moonbeam networks:

=== "Moonbeam"
    ```
    moonbeam: {
        url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonriver"
    ```
    moonriver: {
        url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
        chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonbase Alpha"
    ```
    moonbase: {
        url: '{{ networks.moonbase.rpc_url }}',
        chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

=== "Moonbeam Dev Node"
    ```      
    dev: {
        url: '{{ networks.development.rpc_url }}',
        chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
        accounts: [privateKey]
      },
    ```

Congratulations! You are now ready for deployment!
