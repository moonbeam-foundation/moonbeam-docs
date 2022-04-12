---
title: Verify Smart Contracts on Moonbeam using Block Explorers
description: Learn how to verify smart contracts on Moonbeam-based networks using one of the available block explorers such as Moonscan. 
---

# Verify Smart Contracts using Block Explorers

![Explorer Banner](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-banner.png)

## Introduction {: #introduction } 

Verifying smart contracts on a block explorer is great way of improving the transparency and security of deployed smart contracts on Moonbeam. Users can directly view the source code for verified smart contracts, and for some block explorers, can also directly interact with the contract's public methods through the block explorer's interface. 

This page will outline the steps for verifying smart contracts on Moonbeam networks.

## Deploying the Contract {: #deploying-the-contract }

In order to verify a smart contract on a block explorer, the contract must be first deployed on the target network first. This tutorial will be deploying the smart contract to [Moonbase Alpha](/builders/get-started/moonbase/). 

You can check this page for a tutorial on [deploying smart contracts](/builders/interact/eth-libraries/deploy-contract/) using Ethereum libraries on Moonbeam. You may also use a developer tool such as [Remix](/builders/interact/remix/#deploying-a-contract-to-moonbeam-using-remix), [Truffle](/builders/interact/truffle/#deploying-a-contract-to-moonbeam-using-truffle), or another tool if preferred, to deploy the smart contract to Moonbeam. 

This tutorial will use the same contract as the above deployment tutorial for the contract verification example. 

The contract used is a simple incrementer, arbitrarily named _Incrementer.sol_. The Solidity code is the following:

```solidity
--8<-- 'code/web3-contract-local/Incrementer.sol'
```

### Collecting Information for Contract Verification

You will need to collect some information related to the contract's compiler and deployment in order to verify it successfully. 

1. Take note of the Solidity compiler version used to compile and deploy the contract. The Solidity compiler version can usually be selected or specified in the deployment tool used
2. Take note of any SPDX license identifier used at the beginning of the Solidity source file (the example uses MIT license):
    ```
    // SPDX-License-Identifier: MIT
    ```
3. (Optional) If optimization is enabled during compilation, take note of the value of the optimization runs parameter
4. (Optional) If the contract constructor method accepts arguments, take note of the [ABI-encoded form](https://docs.soliditylang.org/en/develop/abi-spec.html) of the constructor arguments
5. After deployment, take note the deployed contract address of the smart contract. The deployment address of the contract can be found either in the console output if using a command line based tool such as Truffle, Hardhat, or an Ethereum library, or it can be copied from the GUI in tools such as Remix IDE
![Example Compiler Options in Remix IDE](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-1.png)
![Contract Address in Remix IDE](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-2.png)

## Verify the Contract  {: #verifying-the-contract }

The next step will be verifying the smart contract in an EVM compatible explorer for the Moonbeam network that you deployed to. 

### Moonscan {: #moonscan }

Take the following steps to verify the contract on Moonscan: 

1. Go to the [Verify & Publish Contract Source Code](https://moonbase.moonscan.io/verifyContract) page of Moonscan
2. Fill in the contract's deployed address in the first field including the `0x` prefix
3. Select the compiler type. For the current `Incrementer.sol` example, select **Solidity (Single file)**
4. After selecting the compiler type, select the compiler version used to compile the contract. If the compiler version used was a nightly commit, uncheck the box under the field to select the nightly version
5. Select the open source license used. For the current `Incrementer.sol` example, select the option, **MIT License (MIT)**. If there was none used, select **No License (None)**
6. Click the **Continue** button at the bottom of the form to continue on to the next page
    ![First Page Screenshot](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-3.png)

On the second page, the **Contract Address**, **Compiler**, and **Constructor Arguments** fields should be prefilled, fill in the rest of the information: 

1. Copy and paste the entirely of the contract's content into the text field labeled as such
2. (Optional) Select **Yes** for **Optimization** if it was enabled during compilation, and filled in the number of runs under **Misc Settings/Runs(Optimizer)**
3. (Optional) Add contract libraries and their addresses if any were used in the contract
4. (Optional) Check any other optional fields that may apply to your contract, and fill them out accordingly
5. Click on the CAPTCHA at the bottom and the **Verify and Publish** button to confirm and begin verification
    ![Second Page Screenshot](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-4.png)

After a short wait, the result of verification will be displayed in the browser, and a success result page will display the contract's ABI encoded constructor arguments, the contract name, bytecode, and ABI.
    ![Result Page Screenshot](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-5.png)

### BlockScout {: #blockscout }

Go to the contract's page on [BlockScout](https://moonbase-blockscout.testnet.moonbeam.network/) for the respective network by searching for its address, and click on **Verify & Publish** under the **Code** tab.
   ![BlockScout Verify Button](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-6.png)

On the verification page, the contract address will be prefilled. Fill in the following information:

1. Fill in the contract name; this must be the same name as the contract definition. In the example, the contract name is `Incrementer`
2. Fill in the **Compiler**, **EVM Version**, and **Optimization** fields (if optimization was enabled during compiling)
3. Copy and paste the entirety of the Solidity smart contract into the text field
4. (Optional) Toggle **Try to fetch constructor arguments automatically** to **Yes**, or fill in the ABI-encoded constructor arguments manually if the contract constructor accepts arguments
5. (Optional) Add contract libraries and their addresses if any were used in the contract
6. Click **Verify & Publish** at the bottom when all the information is filled out
    ![BlockScout Verify Page](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-7.png)

After a short wait, if the verification is completed successfully, the browser will return to the contract's **Code** page, displaying information including the contract's ABI encoded constructor arguments, the contract name, bytecode, ABI and source code. The contract page will also have two additional tabs, **Read Contract** and **Write Contract** for users to read or write to the contract directly.
   ![BlockScout Result Page](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-8.png)


## Smart Contract Flattening {: #smart-contract-flattening }

For verifying smart contracts that are made up of multiple files, the process is slightly different and requires some pre-processing to combine all dependencies of the target smart contract into a single Solidity file. 

This pre-processing is usually referred to as smart contract flattening. There are a number of tools that can be used to flatten a multi-part smart contract into a single Solidity file, such as [Truffle Flattener](https://www.npmjs.com/package/truffle-flattener). Please refer to the respective smart contract flattening tool's documentation for more detailed instructions on its usage. 

After flattening the multi-part smart contract, it can be verified using the new flattened Solidity file on a block explorer the same way that a single-file smart contract is verified as described in this tutorial. 

### Verify Multi-Part Smart Contract on Moonscan {: #verify-multi-part-smart-contract-on-moonscan }

For verifying on Moonscan, there is a built-in feature to process multi-part smart contract. 

Select **Solidity (Multi-part files)** under **Compiler Type** (step 3 of the above example). Then on the next page, select and upload all different Solidity files that the contract consists of, including their nested dependency contract files. 
 ![Moonscan Multifile Page](/images/builders/build/eth-api/verify-contracts/block-explorers/verify-contract-9.png)

Aside from that, the process is the largely the same as verifying a single-file contracts on Moonscan.
