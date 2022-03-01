---
title: Waffle
description: Learn how to configure Waffle for testing Solidity smart contracts to either a locally running Moonbeam development node or the Moonbase Alpha TestNet.
---

# Waffle

![Waffle Introduction](/images/builders/tools/eth-dev-env/waffle-banner.png)

## Introduction {: #introduction } 

[Waffle](https://www.getwaffle.io/) is a popular development framework for testing Solidity smart contracts. Since Moonbeam is Ethereum compatible, with a few lines of extra configuration, you can use Waffle as you normally would with Ethereum to develop on Moonbeam.

## Configure Waffle to Connect to Moonbeam {: #configure-waffle-to-connect-to-moonbeam } 

--8<-- 'text/common/endpoint-setup.md'

Assuming you already have a JavaScript or TypeScript project, install Waffle:

```
npm install ethereum-waffle
```

To configure Waffle to run tests against a Moonbeam development node or the Moonbase Alpha TestNet, within your tests create a custom provider and add network configurations:

=== "JavaScript"

    ```js
    describe ('Test Contract', () => {
      // Use custom provider to connect to Moonbase Alpha or Moonbeam development node
      const moonbaseAlphaProvider = new ethers.providers.JsonRpcProvider('{{ networks.moonbase.rpc_url }}');
      const devProvider = new ethers.providers.JsonRpcProvider('{{ networks.development.rpc_url }}');
    })
    ```

=== "TypeScript"

    ```typescript
    describe ('Test Contract', () => {
      // Use custom provider to connect to Moonbase Alpha or Moonbeam development node
      const moonbaseAlphaProvider: Provider = new ethers.providers.JsonRpcProvider('{{ networks.moonbase.rpc_url }}');
      const devProvider: Provider = new ethers.providers.JsonRpcProvider('{{ networks.development.rpc_url }}');
    })
    ```

## Tutorial {: #tutorial } 

If you are interested in a more detailed step-by-step guide on how to use Waffle, go to our specific tutorial about using [Waffle & Mars](/builders/interact/waffle-mars/) on Moonbeam.

--8<-- 'text/disclaimers/third-party-content.md'
