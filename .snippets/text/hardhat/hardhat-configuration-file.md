Next you can take the following steps to modify the `hardhat.config.js` file and add Moonbase Alpha as a network:

1. Import plugins
2. Create a variable for your private key(s)

    !!! remember
        This is for demo purposes only. Never store your private key in a JavaScript file.

3. Inside the `module.exports`, you need to provide the Solidity version
4. Add the Moonbase Alpha network configuration. You can modify the `hardhat.config.js` file to use any of the Moonbeam networks:

    === "Moonbeam"

        ```js
        moonbeam: {
            url: '{{ networks.moonbeam.rpc_url }}', // Insert your RPC URL here
            chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
            accounts: [privateKey]
          },
        ```

    === "Moonriver"

        ```js
        moonriver: {
            url: '{{ networks.moonriver.rpc_url }}', // Insert your RPC URL here
            chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
            accounts: [privateKey]
          },
        ```

    === "Moonbase Alpha"

        ```js
        moonbase: {
            url: '{{ networks.moonbase.rpc_url }}',
            chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
            accounts: [privateKey]
          },
        ```

    === "Moonbeam Dev Node"

        ```js
        dev: {
            url: '{{ networks.development.rpc_url }}',
            chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
            accounts: [privateKey]
          },
        ```
