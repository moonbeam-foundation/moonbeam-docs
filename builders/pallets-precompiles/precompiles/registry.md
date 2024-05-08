---
title: Precompile Registry
description: Learn how to access and interact with the Precompile Registry on Moonbeam, which can be used to check if a given address is a precompile and if it is supported.
---

# Precompile Registry on Moonbeam

## Introduction {: #introduction }

The Precompile Registry serves as a single source of truth for the available [precompiles on Moonbeam](/builders/pallets-precompiles/precompiles/overview/){target=\_blank}. The Precompile Registry can be used to determine if an address corresponds to a precompile and whether or not a precompile is active or deprecated. This is particularly useful when there are upstream changes within the Substrate and Polkadot ecosystems that result in backward-incompatible changes to precompiles. Developers can design an exit strategy to ensure their dApp recovers gracefully in these scenarios.

The Precompile Registry also serves an additional purpose, as it allows any user to set "dummy code" (`0x60006000fd`) for precompiles, which makes precompiles callable from Solidity. This is necessary as precompiles on Moonbeam, by default, don't have bytecode. The "dummy code" can bypass checks in Solidity that ensure contract bytecode exists and is non-empty.

The Registry Precompile is located at the following address:

=== "Moonbeam"

     ```text
     {{networks.moonbeam.precompiles.registry }}
     ```

=== "Moonriver"

     ```text
     {{networks.moonriver.precompiles.registry }}
     ```

=== "Moonbase Alpha"

     ```text
     {{networks.moonriver.precompiles.registry }}
     ```

--8<-- 'text/builders/pallets-precompiles/precompiles/security.md'

## The Precompile Registry Solidity Interface {: #the-solidity-interface }

[`PrecompileRegistry.sol`](https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank} is a Solidity interface that allows developers to interact with the precompile's methods.

??? code "PrecompileRegistry.sol"

    ```solidity
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/PrecompileRegistry.sol'
    ```

- **isPrecompile**(*address* a) - returns a *bool* indicating whether a given address is a precompile or not. Returns `true` for active and deprecated precompiles
- **isActivePrecompile**(*address* a) - returns a *bool* indicating whether a given address is an active precompile or not. Returns `false` if a precompile has been deprecated
- **updateAccountCode**(*address* a) - updates a given precompile's bytecode with dummy code (`0x60006000fd`) given the address of the precompile. Precompiles, by default, don't have bytecode associated with them. This function can be used to add dummy bytecode to bypass requirements in Solidity that check if a contract's bytecode is not empty before its functions can be called

## Interact with the Precompile Registry Solidity Interface {: #interact-with-precompile-registry-interface }

The following sections will cover how to interact with the Registry Precompile from [Remix](/builders/build/eth-api/dev-env/remix/){target=\_blank} and [Ethereum libraries](/builders/build/eth-api/libraries/){target=\_blank}, such as [Ethers.js](/builders/build/eth-api/libraries/ethersjs/){target=\_blank}, [Web3.js](/builders/build/eth-api/libraries/web3js/){target=\_blank}, and [Web3.py](/builders/build/eth-api/libraries/web3py/){target=\_blank}.

The examples in this guide will be on Moonbase Alpha.
--8<-- 'text/_common/endpoint-examples.md'

### Use Remix to Interact with the Precompile Registry {: #use-remix }

To quickly get started with [Remix](/builders/build/eth-api/dev-env/remix/){target=\_blank}, the [Precompile Registry contract has been loaded from GitHub](https://remix.ethereum.org/#url=https://github.com/moonbeam-foundation/moonbeam/blob/master/precompiles/precompile-registry/PrecompileRegistry.sol){target=\_blank}. You can also create a new file in Remix and manually paste in the contents of the [`PrecompileRegistry.sol`](#the-solidity-interface) contract.

![Add the Precompile Registry Interface to Remix](/images/builders/pallets-precompiles/precompiles/registry/registry-1.webp)

Then you can take the following steps to compile, deploy, and interact with the Precompile Registry:

1. From the **Compile** tab, click on **Compile PrecompileRegistry.sol** to compile the contract.  A green checkmark will appear upon successfully compiling the contract

    ![Compile the Precompile Registry contract](/images/builders/pallets-precompiles/precompiles/registry/registry-2.webp)

2. From the **Deploy and run transactions** tab, you can load the Precompile Registry using its address:

    1. Make sure **Injected Provider - Metamask** is selected in the **ENVIRONMENT** drop down and you've connected MetaMask to Moonbase Alpha
    2. Ensure **PrecompileRegistry** is selected in the **CONTRACT** dropdown. Since this is a precompiled contract there is no need to deploy, instead you are going to provide the address of the Precompile in the **At Address** field
    3. Provide the address of the Precompile Registry for Moonbase Alpha: `{{ networks.moonbase.precompiles.registry }}` and click **At Address**
    4. The Precompile Registry will appear in the list of **Deployed Contracts**

    ![Access the Precompile Registry contract](/images/builders/pallets-precompiles/precompiles/registry/registry-3.webp)

3. You can interact with any of the precompile's methods. Under **Deployed Contracts**, expand the Precompile Registry to view the list of methods. For example, you can use the **isPrecompile** function to check if an address is a precompile

    ![Interact with the Precompile Registry contract](/images/builders/pallets-precompiles/precompiles/registry/registry-4.webp)

### Use Ethereuem Libraries to Interact with the Precompile Registry {: #use-ethereum-libraries }

To interact with the Precompile Registry's Solidity interface with an Ethereum library, you'll need the Precompile Registry's ABI.

??? code "Precompile Registry ABI"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/abi.js'
    ```

Once you have the ABI, you can interact with the Registry using the Ethereum library of your choice. Generally speaking, you'll take the following steps:

1. Create a provider
2. Create a contract instance of the Precompile Registry
3. Interact with the Precompile Registry's functions

!!! remember
    The following snippets are for demo purposes only. Never store your private keys in a JavaScript or Python file.

=== "Ethers.js"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/ethers.js'
    ```

=== "Web3.js"

    ```js
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/web3.js'
    ```

=== "Web3.py"

    ```py
    --8<-- 'code/builders/pallets-precompiles/precompiles/registry/web3.py'
    ```
