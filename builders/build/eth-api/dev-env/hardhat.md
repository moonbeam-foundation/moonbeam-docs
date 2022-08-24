---
title: Deploy Contracts with Hardhat
description: Learn how to use Hardhat, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Moonbeam.
---

# Using Hardhat to Deploy To Moonbeam

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-banner.png)

## Introduction {: #introduction } 

[Hardhat](https://hardhat.org/){target=_blank} is an Ethereum development environment that helps developers manage and automate the recurring tasks inherent to building smart contracts and DApps. Hardhat can directly interact with Moonbeam's Ethereum API so it can also be used to deploy smart contracts into Moonbeam.

This guide will cover how to use Hardhat to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or Moonbeam development node.

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you will need the following:

 - Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
 - Have an account with funds.
  --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'

## Creating a Hardhat Project {: #creating-a-hardhat-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Create a directory for your project
    ```
    mkdir hardhat && cd hardhat
    ```
2. Initialize the project which will create a `package.json` file
    ```
    npm init -y
    ```
3. Install Hardhat
    ```
    npm install hardhat
    ```
4. Create a project
    ```
    npx hardhat
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, it is recommended to install it locally in each project so that you can control the version on a project by project basis.
            
5. A menu will appear which will allow you to create a new project or use a sample project. For this example, you can choose **Create an empty hardhat.config.js**

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-1.png)

This will create a Hardhat config file (`hardhat.config.js`) in your project directory.

Once you have your Hardhat project, you can also install the [Ethers plugin](https://hardhat.org/plugins/nomiclabs-hardhat-ethers.html){target=_blank}. This provides a convenient way to use the [Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank} library to interact with the network. To install it, run the following command:

```
npm install @nomiclabs/hardhat-ethers ethers
```

## The Contract File {: #the-contract-file } 

With your empty project created, next you are going to create a `contracts` directory. You can do so by running the following command:

```
mkdir contracts && cd contracts
```

The smart contract that you'll deploy as an example will be called `Box`, it will let you store a value that can be retrieved later. In the `contracts` directory, you can create the `Box.sol` file:

```
touch Box.sol
```

Open the file and add the following contract to it:

```solidity
// contracts/Box.sol
pragma solidity ^0.8.1;

contract Box {
    uint256 private value;

    // Emitted when the stored value changes
    event ValueChanged(uint256 newValue);

    // Stores a new value in the contract
    function store(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    // Reads the last stored value
    function retrieve() public view returns (uint256) {
        return value;
    }
}
```

## Hardhat Configuration File {: #hardhat-configuration-file } 

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

## Compiling Solidity {: #compiling-solidity } 

To compile the contract you can simply run:

```
npx hardhat compile
```

![Hardhat Contract Compile](/images/builders/build/eth-api/dev-env/hardhat/hardhat-2.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to your `.gitignore`.

## Deploying the Contract {: #deploying-the-contract } 

In order to deploy the `Box.sol` smart contract, you will need to write a simple deployment script. You can create a new directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

```
mkdir scripts && cd scripts
touch deploy.js
```

Next, you need to write your deployment script which can be done using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries.

To get started start, take the following steps:

1. Create a local instance of the contract with the `getContractFactory` method
2. Use the `deploy` method that exists within this instance to instantiate the smart contract
3. Wait for the deployment by using `deployed`
4. Once deployed, you can fetch the address of the contract using the contract instance.

```js
// scripts/deploy.js
async function main() {
   // 1. Get the contract to deploy
   const Box = await ethers.getContractFactory('Box');
   console.log('Deploying Box...');

   // 2. Instantiating a new Box smart contract
   const box = await Box.deploy();

   // 3. Waiting for the deployment to resolve
   await box.deployed();

   // 4. Use the contract instance to get the contract address
   console.log('Box deployed to:', box.address);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

You can now deploy the `Box.sol` contract using the `run` command and specifying `moonbase` as the network:

```
  npx hardhat run --network moonbase scripts/deploy.js
```

If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match how it's defined in the `hardhat.config.js`.

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Hardhat Contract Deploy](/images/builders/build/eth-api/dev-env/hardhat/hardhat-3.png)

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interacting with the Contract {: #interacting-with-the-contract } 

To interact with your newly deployed contract on Moonbase Alpha, you can launch the Hardhat `console` by running:

```
npx hardhat console --network moonbase
```

Next you can take the following steps, entering in one line at a time:

1. Create a local instance of the `Box.sol` contract
    ```js
    const Box = await ethers.getContractFactory('Box');
    ```
2. Connect the local instance to the deployed contract, using the address of the contract
    ```js
    const box = await Box.attach('0x425668350bD782D80D457d5F9bc7782A24B8c2ef');
    ```
3. Interact with the attached contract. For this example, you can call the `store` method and store a simple value
    ```js
    await box.store(5)
    ```

The transaction will be signed by your Moonbase account and be broadcasted to the network. The output should look similar to:

![Transaction output](/images/builders/build/eth-api/dev-env/hardhat/hardhat-4.png)

Notice your address labeled `from`, the address of the contract, and the `data` that is being passed. Now, you can retrieve the value by running:

```js
(await box.retrieve()).toNumber()
```

You should see `5` or the value you have stored initially.

Congratulations, you have successfully deployed and interacted with a contract using Hardhat!

--8<-- 'text/disclaimers/third-party-content.md'