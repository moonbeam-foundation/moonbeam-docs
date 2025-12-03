---
title: Deploy Contracts with Hardhat
description: Learn how to use Hardhat, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Moonbeam.
categories: Dev Environments, Ethereum Toolkit
---

# Using Hardhat to Deploy To Moonbeam

## Introduction {: #introduction }

[Hardhat](https://hardhat.org){target=\_blank} is a flexible and extensible Ethereum development environment that streamlines the smart contract development process. Since Moonbeam is Ethereum-compatible, you can use Hardhat to develop and deploy smart contracts on Moonbeam.

Hardhat takes a task-based approach to development, where you can define and execute [tasks](https://hardhat.org/hardhat-runner/docs/advanced/create-task){target=\_blank} that perform specific actions. These actions include compiling and deploying contracts, running tests, and more. Tasks are highly configurable, so you can create, customize, and execute tasks that are tailored to meet your needs.

You can also extend Hardhat's functionality through the use of [plugins](https://hardhat.org/hardhat-runner/plugins){target=\_blank}. Plugins are external extensions that integrate with Hardhat to provide additional features and tools for your workflow. For example, there are plugins for common Ethereum libraries, like [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} and [viem](/builders/ethereum/libraries/viem/){target=\_blank}, a plugin that extends the Chai assertion library to include Ethereum-specific functionality, and more. All of these plugins can be used to extend your Hardhat project on Moonbeam.

This guide will provide a brief introduction to Hardhat and show you how to use Hardhat to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or a Moonbeam development node. The content below targets Hardhat 3 (current release: 3.0.17).

Please note that although Hardhat comes with a [Hardhat Network](https://hardhat.org/docs#hardhat-network){target=\_blank} component, which provides a local development environment, you should use a [local Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} instead. You can connect a Moonbeam development node to Hardhat just like you would with any other network.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

- Have Node.js 22.10.0 or later (Hardhat 3 only supports even-numbered LTS versions) and npm
- Have [MetaMask installed](/tokens/connect/metamask/#install-the-metamask-extension){target=\_blank} and [connected to Moonbase Alpha](/tokens/connect/metamask/#connect-metamask-to-moonbeam){target=\_blank}
- Have an account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

## Create a Hardhat Project {: #creating-a-hardhat-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Create a directory for your project

    ```sh
    mkdir hardhat && cd hardhat
    ```

2. Initialize the project, which will create a `package.json` file

    ```sh
    npm init -y
    ```

3. Install Hardhat

    ```sh
    npm install --save-dev hardhat
    ```

4. Create a Hardhat project

    ```sh
    npx hardhat init
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, installing it locally in each project is recommended so you can control the version on a project-by-project basis.


5. You'll be prompted with a series of questions to set up your project:

    - Choose **Hardhat 3 Beta (recommended for new projects)** rather than Hardhat 2 (legacy)
    - Choose where to initialize the project (default is current directory)
    - Confirm converting to ESM (required for Hardhat v3)
    - Select the type of project to initialize:
        - A TypeScript Hardhat project using Node Test Runner and Viem
        - A TypeScript Hardhat project using Mocha and Ethers.js

    For this example, you can choose either option based on your preference. If you choose the Mocha and Ethers.js option, you'll get a project structure with:
    
    - A sample contract in `contracts/Counter.sol`
    - A test file in `test/Counter.ts`
    - TypeScript configuration
    - Mocha and Ethers.js dependencies

    The project will be set up with all necessary dependencies and configurations for you to start developing.

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/hardhat-create.md'

## Hardhat Configuration File {: #hardhat-configuration-file }

The Hardhat configuration file is the entry point into your Hardhat project. It defines various settings and options for your Hardhat project, such as the Solidity compiler version to use and the networks you can deploy your contracts to.

Hardhat 3 is ESM-first. If you stay with JavaScript, keep `"type": "module"` in your `package.json`. A minimal `hardhat.config.js` looks like:

```js
import { defineConfig } from "hardhat/config";

export default defineConfig({
  solidity: "0.8.28",
});
```

If you chose a TypeScript template, the file will be `hardhat.config.ts`; the config content is the same. For this example, you can leave the Solidity compiler version to `0.8.28`; however, if you are using a different contract that requires a newer version, don't forget to update the version here.

Install the plugins and libraries used in this guide if your project template did not add them:

```bash
npm install --save-dev @nomicfoundation/hardhat-ethers @nomicfoundation/hardhat-ignition-ethers @nomicfoundation/hardhat-keystore ethers
```

Next, you'll need to modify your configuration file to add the network configurations for the network you want to deploy your contract to. For Moonbeam networks, you'll need to specify the following:

- `url` - the [RPC endpoint](/builders/get-started/endpoints/){target=\_blank} of the node
- `chainId` - the chain ID, which is used to validate the network
- `accounts` - the accounts that can be used to deploy and interact with contracts. You can either enter an array of the private keys for your accounts or use an [HD Wallet](https://github.com/ethereumbook/ethereumbook/blob/develop/05wallets.asciidoc#hierarchical-deterministic-wallets-bip-32bip-44){target=\_blank}
- `type` and `chainType` - in Hardhat 3, external RPC networks use `type: "http"` and `chainType: "l1"` for Moonbeam networks

Hardhat 3 includes an encrypted secrets manager via the `@nomicfoundation/hardhat-keystore` plugin, which keeps sensitive data out of source control. After installing and importing the plugin, set your secrets with the keystore:

=== "Moonbeam"

    ```bash
    npx hardhat keystore set MOONBEAM_RPC_URL
    npx hardhat keystore set MOONBEAM_PRIVATE_KEY
    ```

=== "Moonriver"

    ```bash
    npx hardhat keystore set MOONRIVER_RPC_URL
    npx hardhat keystore set MOONRIVER_PRIVATE_KEY
    ```

=== "Moonbase Alpha"

    ```bash
    npx hardhat keystore set MOONBASE_RPC_URL
    npx hardhat keystore set MOONBASE_PRIVATE_KEY
    ```

=== "Moonbeam Dev Node"

    ```bash
    npx hardhat keystore set DEV_RPC_URL
    npx hardhat keystore set DEV_PRIVATE_KEY
    ```

!!! warning
    The Hardhat console task does not currently prompt for keystore secrets. Use environment variables for your config variables before running `npx hardhat console`, or interact through scripts/tasks instead of the console when using the keystore.

Then, update your configuration file to use the encrypted secrets and ESM syntax:

=== "Moonbeam"

    ```js
    import hardhatEthers from "@nomicfoundation/hardhat-ethers";
    import hardhatIgnitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
    import hardhatKeystore from "@nomicfoundation/hardhat-keystore";
    import { configVariable, defineConfig } from "hardhat/config";

    export default defineConfig({
      plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
      solidity: "0.8.28",
      networks: {
        moonbeam: {
          type: "http",
          chainType: "l1",
          url: configVariable("MOONBEAM_RPC_URL"),
          chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
          accounts: [configVariable("MOONBEAM_PRIVATE_KEY")],
        },
      },
    });
    ```

=== "Moonriver"

    ```js
    import hardhatEthers from "@nomicfoundation/hardhat-ethers";
    import hardhatIgnitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
    import hardhatKeystore from "@nomicfoundation/hardhat-keystore";
    import { configVariable, defineConfig } from "hardhat/config";

    export default defineConfig({
      plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
      solidity: "0.8.28",
      networks: {
        moonriver: {
          type: "http",
          chainType: "l1",
          url: configVariable("MOONRIVER_RPC_URL"),
          chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
          accounts: [configVariable("MOONRIVER_PRIVATE_KEY")],
        },
      },
    });
    ```

=== "Moonbase Alpha"

    ```js
    import hardhatEthers from "@nomicfoundation/hardhat-ethers";
    import hardhatIgnitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
    import hardhatKeystore from "@nomicfoundation/hardhat-keystore";
    import { configVariable, defineConfig } from "hardhat/config";

    export default defineConfig({
      plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
      solidity: "0.8.28",
      networks: {
        moonbase: {
          type: "http",
          chainType: "l1",
          url: configVariable("MOONBASE_RPC_URL"),
          chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
          accounts: [configVariable("MOONBASE_PRIVATE_KEY")],
        },
      },
    });
    ```

=== "Moonbeam Dev Node"

    ```js
    import hardhatEthers from "@nomicfoundation/hardhat-ethers";
    import hardhatIgnitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
    import hardhatKeystore from "@nomicfoundation/hardhat-keystore";
    import { configVariable, defineConfig } from "hardhat/config";

    export default defineConfig({
      plugins: [hardhatEthers, hardhatIgnitionEthers, hardhatKeystore],
      solidity: "0.8.28",
      networks: {
        dev: {
          type: "http",
          chainType: "l1",
          url: configVariable("DEV_RPC_URL"),
          chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
          accounts: [configVariable("DEV_PRIVATE_KEY")],
        },
      },
    });
    ```

When you run tasks that require these secrets, Hardhat will prompt you for the password to decrypt them. The secrets are only decrypted when needed, meaning you only need to enter the password if a Hardhat task uses a secret.

If you are planning on using any plugins with your project, you'll need to install the plugin and import it into your Hardhat config file (`hardhat.config.ts` or `hardhat.config.js`). Once a plugin has been imported, it becomes part of the [Hardhat Runtime Environment](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment){target=\_blank}, and you can leverage the plugin's functionality within tasks, scripts, and more.

For more information on the available configuration options, please refer to Hardhat's documentation on [Configuration](https://hardhat.org/hardhat-runner/docs/config#networks-configuration){target=\_blank}.

## The Contract File {: #the-contract-file }

Now that you've configured your project, you can begin the development process by creating your smart contract. The contract will be a simple one that will let you store a value that can be retrieved later, called `Box`.

To add the contract, you'll take the following steps:

1. Change into the `contracts` directory

    ```sh
    cd contracts
    ```

2. Create a `Box.sol` file

    ```sh
    touch Box.sol
    ```

3. Open the file and add the following contract to it:

    ```solidity
    // contracts/Box.sol
    // SPDX-License-Identifier: MIT
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

## Compile the Contract {: #compiling-solidity }

The next step is to compile the `Box.sol` smart contract. For this, you can use the built-in `compile` task, which will look for Solidity files in the `contracts` directory and compile them using the version and compiler settings defined in your Hardhat config file.

To use the `compile` task, all you have to do is run:

```sh
npx hardhat compile
```

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/compile.md'

After compilation, an `artifacts` directory is created that holds the bytecode and metadata of the contract, which are `.json` files. It's a good idea to add this directory to a `.gitignore` file.

If you make changes to the contract after you've compiled it, you can compile it again using the same command. Hardhat will look for any changes and recompile the contract. If no changes are found, nothing will be compiled. If needed, you can force a compilation using the `clean` task, which will clear the cache and delete the old artifacts.

## Deploy the Contract {: #deploying-the-contract }

To deploy the contract, you'll use Hardhat Ignition, a declarative framework for deploying smart contracts. Hardhat Ignition is designed to make it easy to manage recurring tasks surrounding smart contract deployment and testing. For more information, be sure to check out the [Hardhat Ignition docs](https://hardhat.org/ignition/docs/getting-started#overview){target=\_blank}. 

To set up the proper file structure for your Ignition module, create a folder named `ignition` and a subdirectory called `modules`. Then add a new file to it called `Box.js`. You can take all three of these steps with the following command:

```sh
cd ignition/modules && touch Box.js
```

Next, you can write your Hardhat Ignition module. To get started, take the following steps:

1. Import the `buildModule` function from the Hardhat Ignition module
2. Export a module using `buildModule`
3. Use the `getAccount` method to select the deployer account
4. Deploy the `Box` contract
5. Return an object from the module. This makes the `Box` contract accessible for interaction in Hardhat tests and scripts

```js
// 1. Import the `buildModule` function from the Hardhat Ignition module
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// 2. Export a module using `buildModule`
// Use `export default` instead of `module.exports`
export default buildModule("BoxModule", (m) => {
  // 3. Use the `getAccount` method to select the deployer account
  const deployer = m.getAccount(0);
  
  // 4. Deploy the `Box` contract
  const box = m.contract("Box", [], {
    from: deployer, 
  });
  
  // 5. Return an object from the module
  return { box };
});
```

To run the script and deploy the `Box.sol` contract, use the following command, which requires you to specify the network name as defined in your Hardhat config file. If you don't specify a network, hardhat will deploy the contract to a local Hardhat network by default. 

```sh
npx hardhat ignition deploy ./ignition/modules/Box.js --network moonbase
```

!!! note
    If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match the one defined in your Hardhat config file.

You'll be prompted to enter your password for the Hardhat secrets manager. Next, you'll be prompted to confirm the network you wish to deploy to. A few seconds after you confirm, the contract is deployed, and you'll see the contract address in the terminal.

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/deploy-moonbase.md'

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interact with the Contract {: #interacting-with-the-contract }

There are a couple of ways that you can interact with your newly deployed contract using Hardhat: you can use the `console` task, which spins up an interactive JavaScript console, or you can create another script and use the `run` task to execute it.

### Using the Hardhat Console {: #hardhat-console }

The [Hardhat console](https://hardhat.org/hardhat-runner/docs/guides/hardhat-console){target=\_blank} uses the same execution environment as the tasks and scripts, so it automatically uses the configurations and plugins defined in your Hardhat config file.

If you configured secrets with the keystore, export the corresponding environment variables (for example, `MOONBASE_RPC_URL` and `MOONBASE_PRIVATE_KEY`) before opening the console. The console task cannot prompt for keystore secrets in Hardhat 3.

To launch the Hardhat `console`, you can run:

```sh
npx hardhat console --network moonbase
```

Next, you can take the following steps, entering one line at a time:

1. Create a local instance of the `Box.sol` contract

    ```js
    const Box = await ethers.getContractFactory('Box');
    ```

2. Connect the local instance to the deployed contract, using the address of the contract shown in the prior step under **Deployed Addresses**

    ```js
    const box = await Box.attach('INSERT-CONTRACT-ADDRESS');
    ```

3. Interact with the attached contract. For this example, you can call the `store` method and store a simple value

    ```js
    await box.store(5);
    ```

The transaction will be signed by your account configured in the Hardhat config file and broadcasted to the network. The output should look similar to:

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/interact.md'

Notice your address labeled `from`, the address of the contract, and the `data` that is being passed. Now, you can retrieve the value by running:

```js
await box.retrieve();
```

You should see `5`, or the value you initially stored.

### Using a Script {: #using-a-script }

Similarly to the deployment script, you can create a script to interact with your deployed contract, store it in the `scripts` directory, and run it using the built-in `run` task.

To get started, create a `set-value.js` file in the `scripts` directory:

```sh
cd scripts && touch set-value.js
```

Now paste the following contract into the `set-value.js` file:

```js
// scripts/set-value.js
import { ethers } from "hardhat";

async function main() {
  // Create instance of the Box contract
  const Box = await ethers.getContractFactory("Box");

  // Connect the instance to the deployed contract
  const box = await Box.attach("INSERT-CONTRACT-ADDRESS");

  // Store a new value
  await box.store(2);

  // Retrieve the value
  const value = await box.retrieve();
  console.log(`The new value is: ${value}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

To run the script, you can use the following command:

```sh
npx hardhat run --network moonbase set-value.js
```

The script should return `2` as the value.

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/run.md'

## Hardhat Forking {: #hardhat-forking }

You can [fork](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks){target=\_blank} any EVM-compatible chain using Hardhat, including Moonbeam. Forking simulates the live Moonbeam network locally, enabling you to interact with deployed contracts on Moonbeam in a local test environment. Since Hardhat forking is based on an EVM implementation, you can interact with the fork using standard [Ethereum JSON-RPC methods supported by Moonbeam](/builders/ethereum/json-rpc/eth-rpc/){target=\_blank} and [Hardhat](https://hardhat.org/hardhat-network/docs/reference#json-rpc-methods-support){target=\_blank}.

There are some limitations to be aware of when using Hardhat forking. You cannot interact with any of the Moonbeam precompiled contracts or their functions. Precompiles are a part of the Substrate implementation and therefore cannot be replicated in the simulated EVM environment. This prohibits you from interacting with cross-chain assets on Moonbeam and Substrate-based functionality such as staking and governance.

Earlier versions of Hardhat required a manual patch to fork Moonbeam. Hardhat 3 includes the fix, so no manual patching is needed.

### Forking Moonbeam {: #forking-moonbeam }

You can fork Moonbeam from the command line or configure your Hardhat project to always run the fork from your Hardhat config file. To fork Moonbeam or Moonriver, you will need to have your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}.

To fork Moonbeam from the command line, you can run the following command from within your Hardhat project directory:

=== "Moonbeam"

    ```sh
    npx hardhat node --fork {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```sh
    npx hardhat node --fork {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```sh
    npx hardhat node --fork {{ networks.moonbase.rpc_url }}
    ```

If you prefer to configure your Hardhat project, you can update your Hardhat config file with the following configurations:

=== "Moonbeam"

    ```js
    ...
    networks: {
      hardhat: {
        forking: {
          url: '{{ networks.moonbeam.rpc_url }}',
        },
      },
    },
    ...
    ```

=== "Moonriver"

    ```js
    ...
    networks: {
      hardhat: {
        forking: {
          url: '{{ networks.moonriver.rpc_url }}',
        },
      },
    },
    ...
    ```

=== "Moonbase Alpha"

    ```js
    ...
    networks: {
      hardhat: {
        forking: {
          url: '{{ networks.moonbase.rpc_url }}',
        },
      },
    },
    ...
    ```

When you spin up the Hardhat fork, you'll have 20 development accounts that are pre-funded with 10,000 test tokens. The forked instance is available at `http://127.0.0.1:8545/`. The output in your terminal should resemble the following:

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/private-keys.md'

To verify you have forked the network, you can query the latest block number:

```sh
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

If you convert the `result` from [hex to decimal](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=\_blank}, you should get the latest block number from the time you forked the network. You can cross-reference the block number using a [block explorer](/builders/get-started/explorers/){target=\_blank}.

From here, you can deploy new contracts to your forked instance of Moonbeam or interact with contracts already deployed by creating a local instance of the deployed contract.

To interact with an already deployed contract, you can create a new script in the `scripts` directory using `ethers`. Because you'll be running it with Hardhat, you can import `ethers` directly from the Hardhat runtime without extra setup. Inside the script, you can access a live contract on the network using the following snippet:

```js
import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

  const contract = new ethers.Contract(
    "INSERT_CONTRACT_ADDRESS",
    "INSERT_CONTRACT_ABI",
    provider
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

--8<-- 'text/_disclaimers/third-party-content.md'
