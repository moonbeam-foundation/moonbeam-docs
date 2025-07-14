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

This guide will provide a brief introduction to Hardhat and show you how to use Hardhat to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or a Moonbeam development node.

Please note that although Hardhat comes with a [Hardhat Network](https://hardhat.org/docs#hardhat-network){target=\_blank} component, which provides a local development environment, you should use a [local Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=\_blank} instead. You can connect a Moonbeam development node to Hardhat just like you would with any other network.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

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
    npm install hardhat@3.0.0-next.5
    ```

4. Create a Hardhat project

    ```sh
    npx hardhat --init
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, installing it locally in each project is recommended so you can control the version on a project-by-project basis.


5. You'll be prompted with a series of questions to set up your project:

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

To start, your `hardhat.config.js` should resemble the following:

```js
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.28',
};
```

For this example, you can leave the Solidity compiler version to `0.8.28`; however, if you are using a different contract that requires a newer version, don't forget to update the version here.

Next, you'll need to modify your configuration file to add the network configurations for the network you want to deploy your contract to. For Moonbeam networks, you'll need to specify the following:

- `url` - the [RPC endpoint](/builders/get-started/endpoints/){target=\_blank} of the node
- `chainId` - the chain ID, which is used to validate the network
- `accounts` - the accounts that can be used to deploy and interact with contracts. You can either enter an array of the private keys for your accounts or use an [HD Wallet](https://github.com/ethereumbook/ethereumbook/blob/develop/05wallets.asciidoc#hierarchical-deterministic-wallets-bip-32bip-44){target=\_blank}

Hardhat 3 includes an encrypted secrets manager that makes it easier to handle sensitive information like private keys. This ensures you don't have to hardcode secrets in your source code or store them in plain text.

!!! note
    The encrypted secrets manager is only available in Hardhat 3 or higher. As of writing this guide, Hardhat 3 is in alpha. You can install the latest alpha version with:

    ```bash
    npm install hardhat@3.0.0-next.5
    ```

    For the latest releases and updates, check the [Hardhat releases page](https://github.com/NomicFoundation/hardhat/releases/).

To use encrypted secrets, you'll need to:

1. Install Hardhat 3 or later:
```bash
npm install hardhat@3.0.0-next.5
```

2. Set up your secrets using the keystore:

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

Then, update your configuration file to use the encrypted secrets:

=== "Moonbeam"

    ```js
    module.exports = {
      solidity: '0.8.28',
      networks: {
        moonbeam: {
          type: "http",
          chainType: "generic",
          url: configVariable("MOONBEAM_RPC_URL"),
          chainId: {{ networks.moonbeam.chain_id }}, // (hex: {{ networks.moonbeam.hex_chain_id }}),
          accounts: [configVariable("MOONBEAM_PRIVATE_KEY")],
        },
      },
    };
    ```

=== "Moonriver"

    ```js
    module.exports = {
      solidity: '0.8.28',
      networks: {
        moonriver: {
          type: "http",
          chainType: "generic",
          url: configVariable("MOONRIVER_RPC_URL"),
          chainId: {{ networks.moonriver.chain_id }}, // (hex: {{ networks.moonriver.hex_chain_id }}),
          accounts: [configVariable("MOONRIVER_PRIVATE_KEY")],
        },
      },
    };
    ```

=== "Moonbase Alpha"

    ```js
    module.exports = {
      solidity: '0.8.28',
      networks: {
        moonbase: {
          type: "http",
          chainType: "generic",
          url: configVariable("MOONBASE_RPC_URL"),
          chainId: {{ networks.moonbase.chain_id }}, // (hex: {{ networks.moonbase.hex_chain_id }}),
          accounts: [configVariable("MOONBASE_PRIVATE_KEY")],
        },
      },
    };
    ```

=== "Moonbeam Dev Node"

    ```js
    module.exports = {
      solidity: '0.8.28',
      networks: {
        dev: {
          type: "http",
          chainType: "generic",
          url: configVariable("DEV_RPC_URL"),
          chainId: {{ networks.development.chain_id }}, // (hex: {{ networks.development.hex_chain_id }}),
          accounts: [configVariable("DEV_PRIVATE_KEY")],
        },
      },
    };
    ```

When you run tasks that require these secrets, Hardhat will prompt you for the password to decrypt them. The secrets are only decrypted when needed, meaning you only need to enter the password if a Hardhat task uses a secret.

If you are planning on using any plugins with your project, you'll need to install the plugin and import it into the `hardhat.config.js` file. Once a plugin has been imported, it becomes part of the [Hardhat Runtime Environment](https://hardhat.org/hardhat-runner/docs/advanced/hardhat-runtime-environment){target=\_blank}, and you can leverage the plugin's functionality within tasks, scripts, and more.

For this example, you can install the `hardhat-ethers` plugin and import it into the configuration file. This plugin provides a convenient way to use the [Ethers.js](/builders/ethereum/libraries/ethersjs/){target=\_blank} library to interact with the network.

```bash
npm install @nomicfoundation/hardhat-ethers ethers
```

Additionally, you'll need to install the `hardhat-ignition-ethers` plugin to enable deployment of smart contracts with Hardhat Ignition. You can install it with the following command:

```sh
npm install --save-dev @nomicfoundation/hardhat-ignition-ethers
```

To import both plugins, add the following `require` statements to the top of the Hardhat configuration file:

```js hl_lines="2 3"
/** @type import('hardhat/config').HardhatUserConfig */
require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-ignition-ethers');

module.exports = {
  solidity: '0.8.28',
  networks: {
    moonbase: {
      url: configVariable("MOONBASE_RPC_URL"),
      chainId: 1287, // 0x507 in hex,
      accounts: [configVariable("MOONBASE_PRIVATE_KEY")]
    }
  }
};
```

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

The next step is to compile the `Box.sol` smart contract. For this, you can use the built-in `compile` task, which will look for Solidity files in the `contracts` directory and compile them using the version and compiler settings defined in the `hardhat.config.js` file.

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

To run the script and deploy the `Box.sol` contract, use the following command, which requires you to specify the network name as defined in your `hardhat.config.js`. If you don't specify a network, hardhat will deploy the contract to a local Hardhat network by default. 

```sh
npx hardhat ignition deploy ./Box.js --network moonbase
```

!!! note
    If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match the one defined in the `hardhat.config.js` file.

You'll be prompted to enter your password for the Hardhat secrets manager. Next, you'll be prompted to confirm the network you wish to deploy to. A few seconds after you confirm, the contract is deployed, and you'll see the contract address in the terminal.

--8<-- 'code/builders/ethereum/dev-env/hardhat/terminal/deploy-moonbase.md'

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interact with the Contract {: #interacting-with-the-contract }

There are a couple of ways that you can interact with your newly deployed contract using Hardhat: you can use the `console` task, which spins up an interactive JavaScript console, or you can create another script and use the `run` task to execute it.

### Using the Hardhat Console {: #hardhat-console }

The [Hardhat console](https://hardhat.org/hardhat-runner/docs/guides/hardhat-console){target=\_blank} uses the same execution environment as the tasks and scripts, so it automatically uses the configurations and plugins defined in the `hardhat.config.js`.

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

The transaction will be signed by your account configured in the `hardhat.config.js` file and broadcasted to the network. The output should look similar to:

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
async function main() {
  // Create instance of the Box contract
  const Box = await ethers.getContractFactory('Box');

  // Connect the instance to the deployed contract
  const box = await Box.attach('INSERT-CONTRACT-ADDRESS');

  // Store a new value
  await box.store(2);

  // Retrieve the value
  const value = await box.retrieve();
  console.log(`The new value is: ${value}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
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

There is currently an issue related to forking Moonbeam, so in order to fix the issue, you'll need to manually patch Hardhat first. You can find out more information by following the [issue on GitHub](https://github.com/NomicFoundation/hardhat/issues/2395#issuecomment-1043838164){target=\_blank} as well as the related [PR](https://github.com/NomicFoundation/hardhat/pull/2313){target=\_blank}.

### Patching Hardhat {: #patching-hardhat }

Before getting started, you'll need to apply a temporary patch to workaround an RPC error until Hardhat fixes the root issue. The error is as follows:

```sh
Error HH604: Error running JSON-RPC server: Invalid JSON-RPC response's result.

Errors: Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/0: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined, Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/1: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined, Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/2: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined
```

To patch Hardhat, you'll need to open the `node_modules/hardhat/internal/hardhat-network/jsonrpc/client.js` file of your project. Next, you'll add an `addAccessList` function and update the `_perform` and `_performBatch` functions.

To get started, you can remove the preexisting `_perform` and `_performBatch` functions and, in their place, add the following code snippet:

```js
  addAccessList(method, rawResult) {
    if (
      method.startsWith('eth_getBlock') &&
      rawResult &&
      rawResult.transactions?.length
    ) {
      rawResult.transactions.forEach((t) => {
        if (t.accessList == null) t.accessList = [];
      });
    }
  }
  async _perform(method, params, tType, getMaxAffectedBlockNumber) {
    const cacheKey = this._getCacheKey(method, params);
    const cachedResult = this._getFromCache(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    if (this._forkCachePath !== undefined) {
      const diskCachedResult = await this._getFromDiskCache(
        this._forkCachePath,
        cacheKey,
        tType
      );
      if (diskCachedResult !== undefined) {
        this._storeInCache(cacheKey, diskCachedResult);
        return diskCachedResult;
      }
    }
    const rawResult = await this._send(method, params);
    this.addAccessList(method, rawResult);
    const decodedResult = (0, decodeJsonRpcResponse_1.decodeJsonRpcResponse)(
      rawResult,
      tType
    );
    const blockNumber = getMaxAffectedBlockNumber(decodedResult);
    if (this._canBeCached(blockNumber)) {
      this._storeInCache(cacheKey, decodedResult);
      if (this._forkCachePath !== undefined) {
        await this._storeInDiskCache(this._forkCachePath, cacheKey, rawResult);
      }
    }
    return decodedResult;
  }
  async _performBatch(batch, getMaxAffectedBlockNumber) {
    // Perform Batch caches the entire batch at once.
    // It could implement something more clever, like caching per request
    // but it's only used in one place, and those other requests aren't
    // used anywhere else.
    const cacheKey = this._getBatchCacheKey(batch);
    const cachedResult = this._getFromCache(cacheKey);
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    if (this._forkCachePath !== undefined) {
      const diskCachedResult = await this._getBatchFromDiskCache(
        this._forkCachePath,
        cacheKey,
        batch.map((b) => b.tType)
      );
      if (diskCachedResult !== undefined) {
        this._storeInCache(cacheKey, diskCachedResult);
        return diskCachedResult;
      }
    }
    const rawResults = await this._sendBatch(batch);
    const decodedResults = rawResults.map((result, i) => {
      this.addAccessList(batch[i].method, result);
      return (0, decodeJsonRpcResponse_1.decodeJsonRpcResponse)(
        result,
        batch[i].tType
      );
    });
    const blockNumber = getMaxAffectedBlockNumber(decodedResults);
    if (this._canBeCached(blockNumber)) {
      this._storeInCache(cacheKey, decodedResults);
      if (this._forkCachePath !== undefined) {
        await this._storeInDiskCache(this._forkCachePath, cacheKey, rawResults);
      }
    }
    return decodedResults;
  }
```

Then you can use [patch-package](https://www.npmjs.com/package/patch-package){target=\_blank} to automatically patch the package by running the following command:

```sh
npx patch-package hardhat
```

A `patches` directory will be created, and now you should be all set to fork Moonbeam without running into any errors.

### Forking Moonbeam {: #forking-moonbeam }

You can fork Moonbeam from the command line or configure your Hardhat project to always run the fork from your `hardhat.config.js` file. To fork Moonbeam or Moonriver, you will need to have your own endpoint and API key, which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}.

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

If you prefer to configure your Hardhat project, you can update your `hardhat.config.js` file with the following configurations:

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

To interact with an already deployed contract, you can create a new script in the `scripts` directory using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries. Inside the script, you can access a live contract on the network using the following snippet:

```js
const hre = require('hardhat');

async function main() {
  const provider = new ethers.JsonRpcProvider(
    'http://127.0.0.1:8545/'
  );

  const contract = new ethers.Contract(
    'INSERT_CONTRACT_ADDRESS',
    'INSERT_CONTRACT_ABI',
    provider
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

--8<-- 'text/_disclaimers/third-party-content.md'
