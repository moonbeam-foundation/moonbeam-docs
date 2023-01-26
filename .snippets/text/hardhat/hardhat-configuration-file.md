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
