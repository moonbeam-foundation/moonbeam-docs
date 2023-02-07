Next you can take the following steps to modify the `hardhat.config.js` file and add Moonbase Alpha as a network:

1. Import plugins. The Hardhat Ethers plugin comes out of the box with Hardhat, so you don't need to worry about installing it yourself
2. Import the `secrets.json` file
3. Inside the `module.exports`, you need to provide the Solidity version (`0.8.1` according to our contract file)
4. Add the Moonbase Alpha network configuration
