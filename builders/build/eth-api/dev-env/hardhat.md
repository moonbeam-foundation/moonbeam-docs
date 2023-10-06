---
title: Deploy Contracts with Hardhat
description: Learn how to use Hardhat, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Moonbeam.
---

# Using Hardhat to Deploy To Moonbeam

## Introduction {: #introduction }

[Hardhat](https://hardhat.org/){target=_blank} is an Ethereum development environment that helps developers manage and automate the recurring tasks inherent to building smart contracts and DApps. Hardhat can directly interact with Moonbeam's Ethereum API so it can also be used to deploy smart contracts into Moonbeam.

This guide will cover how to use Hardhat to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or Moonbeam development node.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

- Have MetaMask installed and [connected to Moonbase Alpha](/tokens/connect/metamask/){target=_blank}
- Have an account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
- 
  --8<-- 'text/_common/endpoint-examples-list-item.md'

## Creating a Hardhat Project {: #creating-a-hardhat-project }

You will need to create a Hardhat project if you don't already have one. You can create one by completing the following steps:

1. Create a directory for your project

    ```sh
    mkdir hardhat && cd hardhat
    ```

2. Initialize the project which will create a `package.json` file

    ```sh
    npm init -y
    ```

3. Install Hardhat

    ```sh
    npm install hardhat
    ```

4. Create a project

    ```sh
    npx hardhat init
    ```

    !!! note
        `npx` is used to run executables installed locally in your project. Although Hardhat can be installed globally, it is recommended to install it locally in each project so that you can control the version on a project by project basis.

5. A menu will appear which will allow you to create a new project or use a sample project. For this example, you can choose **Create an empty hardhat.config.js**

![Hardhat Create Project](/images/builders/build/eth-api/dev-env/hardhat/hardhat-1.png)

This will create a Hardhat config file (`hardhat.config.js`) in your project directory.

Once you have your Hardhat project, you can also install the [Ethers plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-ethers){target=_blank}. This provides a convenient way to use the [Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=_blank} library to interact with the network. To install it, run the following command:

```sh
npm install @nomicfoundation/hardhat-ethers ethers@6
```

## The Contract File {: #the-contract-file }

With your empty project created, next you are going to create a `contracts` directory. You can do so by running the following command:

```sh
mkdir contracts && cd contracts
```

The smart contract that you'll deploy as an example will be called `Box`, it will let you store a value that can be retrieved later. In the `contracts` directory, you can create the `Box.sol` file:

```sh
touch Box.sol
```

Open the file and add the following contract to it:

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

## Hardhat Configuration File {: #hardhat-configuration-file }

Before you can deploy the contract to Moonbase Alpha, you'll need to modify the Hardhat configuration file and create a secure file to store your private key in.

--8<-- 'text/builders/build/eth-api/dev-env/hardhat/hardhat-configuration-file.md'
    You can modify the `hardhat.config.js` file to use any of the Moonbeam networks:

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

```js
// 1. Import the Ethers plugin required to interact with the contract
require('@nomicfoundation/hardhat-ethers');

// 2. Add your private key from your pre-funded Moonbase Alpha testing account
const privateKey = 'INSERT_PRIVATE_KEY';

module.exports = {
  // 3. Specify the Solidity version
  solidity: '0.8.1',
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

Congratulations! You are now ready for deployment!

## Compiling Solidity {: #compiling-solidity }

To compile the contract you can simply run:

```sh
npx hardhat compile
```

![Hardhat Contract Compile](/images/builders/build/eth-api/dev-env/hardhat/hardhat-2.png)

After compilation, an `artifacts` directory is created: it holds the bytecode and metadata of the contract, which are `.json` files. It’s a good idea to add this directory to your `.gitignore`.

## Deploying the Contract {: #deploying-the-contract }

In order to deploy the `Box.sol` smart contract, you will need to write a simple deployment script. You can create a new directory for the script and name it `scripts` and add a new file to it called `deploy.js`:

```sh
mkdir scripts && cd scripts
touch deploy.js
```

Next, you need to write your deployment script which can be done using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries.

To get started, take the following steps:

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
   await box.waitForDeployment();

   // 4. Use the contract instance to get the contract address
   console.log('Box deployed to:', box.target);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
```

You can now deploy the `Box.sol` contract using the `run` command and specifying `moonbase` as the network:

```sh
npx hardhat run --network moonbase scripts/deploy.js
```

If you're using another Moonbeam network, make sure that you specify the correct network. The network name needs to match how it's defined in the `hardhat.config.js`.

After a few seconds, the contract is deployed, and you should see the address in the terminal.

![Hardhat Contract Deploy](/images/builders/build/eth-api/dev-env/hardhat/hardhat-3.png)

Congratulations, your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

## Interacting with the Contract {: #interacting-with-the-contract }

To interact with your newly deployed contract on Moonbase Alpha, you can launch the Hardhat `console` by running:

```sh
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
    await box.store(5);
    ```

The transaction will be signed by your Moonbase account and be broadcasted to the network. The output should look similar to:

![Transaction output](/images/builders/build/eth-api/dev-env/hardhat/hardhat-4.png)

Notice your address labeled `from`, the address of the contract, and the `data` that is being passed. Now, you can retrieve the value by running:

```js
await box.retrieve();
```

You should see `5` or the value you have stored initially.

Congratulations, you have successfully deployed and interacted with a contract using Hardhat!

## Hardhat Forking {: #hardhat-forking }

You can [fork](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks){target=_blank} any EVM compatible chain using Hardhat, including Moonbeam. Forking simulates the live Moonbeam network locally, enabling you to interact with deployed contracts on Moonbeam in a local test environment. Since Hardhat forking is based on an EVM implementation, you can interact with the fork using standard Ethereum JSON-RPC methods supported by [Moonbeam](/builders/get-started/eth-compare/rpc-support/){target=_blank} and [Hardhat](https://hardhat.org/hardhat-network/docs/reference#json-rpc-methods-support){target=_blank}.

There are some limitations to be aware of when using Hardhat forking. You cannot interact with any of the Moonbeam precompiled contracts and their functions. Precompiles are a part of the Substrate implementation and therefore cannot be replicated in the simulated EVM environment. This prohibits you from interacting with cross-chain assets on Moonbeam and Substrate-based functionality such as staking and governance.

There is currently an issue related to forking Moonbeam, so in order to fix the issue you'll need to manually patch Hardhat first. You can find out more information by following the [issue on GitHub](https://github.com/NomicFoundation/hardhat/issues/2395#issuecomment-1043838164){target=_blank} as well as the related [PR](https://github.com/NomicFoundation/hardhat/pull/2313){target=_blank}.

### Patching Hardhat {: #patching-hardhat }

Before getting started, you'll need to apply a temporary patch to workaround an RPC error until Hardhat fixes the root issue. The error is as follows:

```sh
Error HH604: Error running JSON-RPC server: Invalid JSON-RPC response's result.

Errors: Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/0: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined, Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/1: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined, Invalid value null supplied to : RpcBlockWithTransactions | null/transactions: RpcTransaction Array/2: RpcTransaction/accessList: Array<{ address: DATA, storageKeys: Array<DATA> | null }> | undefined
```

To patch Hardhat, you'll need to open the `node_modules/hardhat/internal/hardhat-network/jsonrpc/client.js` file of your project. Next, you'll add a `addAccessList` function and update the `_perform` and `_performBatch` functions.

To get started, you can remove the preexisting `_perform` and `_performBatch` functions and in their place add the following code snippet:

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

Then you can use [patch-package](https://www.npmjs.com/package/patch-package){target=_blank} to automatically patch the package by running the following command:

```sh
npx patch-package hardhat
```

A `patches` directory will be created and now you should be all set to fork Moonbeam without running into any errors.

### Forking Moonbeam {: #forking-moonbeam }

You can fork Moonbeam from the command line or configure your Hardhat project to always run the fork from your `hardhat.config.js` file. To fork Moonbeam or Moonriver, you will need to have your own endpoint and API key which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=_blank}.

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
            }
        }
    }
    ...
    ```

=== "Moonriver"

    ```js
    ...
    networks: {
        hardhat: {
            forking: {
            url: '{{ networks.moonriver.rpc_url }}',
            }
        }
    }
    ...
    ```

=== "Moonbase Alpha"

    ```js
    ...
    networks: {
        hardhat: {
            forking: {
            url: '{{ networks.moonbase.rpc_url }}',
            }
        }
    }
    ...
    ```

When you spin up the Hardhat fork, you'll have 20 development accounts that are pre-funded with 10,000 test tokens. The forked instance is available at `http://127.0.0.1:8545/`. The output in your terminal should resemble the following:

![Forking terminal screen](/images/builders/build/eth-api/dev-env/hardhat/hardhat-5.png)

To verify you have forked the network, you can query the latest block number:

```sh
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

If you convert the `result` from [hex to decimal](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=_blank}, you should get the latest block number from the time you forked the network. You can cross reference the block number using a [block explorer](/builders/get-started/explorers){target=_blank}.

From here you can deploy new contracts to your forked instance of Moonbeam or interact with contracts already deployed by creating a local instance of the deployed contract. 

To interact with an already deployed contract, you can create a new script in the `scripts` directory using `ethers`. Because you'll be running it with Hardhat, you don't need to import any libraries. Inside the script, you can access a live contract on the network using the following snippet:

```js
const hre = require('hardhat');

async function main() {
  const provider = new ethers.providers.StaticJsonRpcProvider('http://127.0.0.1:8545/');
  
  const contract = new ethers.Contract(
      'INSERT_CONTRACT_ADDRESS', 'INSERT_CONTRACT_ABI', provider
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

--8<-- 'text/_disclaimers/third-party-content.md'
