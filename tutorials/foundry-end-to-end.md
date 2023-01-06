---
title: Using Foundry Start to End with Moonbeam
description: Learn what to consider when using the Foundry library to build a project on Moonbeam from start to end in this step-by-step tutorial.
---

# Using Foundry Start to End with Moonbeam

![Banner Image](/images/tutorials/batch-approve-swap/batch-banner.png)

_January 10th, 2022 | by Jeremy Boetticher_

## Introduction {: #introduction } 

Foundry has become an increasingly popular developer environment to develop smart contracts with, since utilizing it only requires a single language: solidity. Moonbeam offers [introductory documentation on using Foundry](/builders/build/eth-api/dev-env/foundry.md) with Moonbeam networks, which is recommended to read to get an introduction to using Foundry. In this tutorial we will be dipping our toes deeper into the library to get a more cohesive look at how to properly develop, test, and deploy.  

In this demonstration, we will deploy 2 smart contracts. One is a token and another will depend on that token. We will also write unit tests to ensure that the contracts work as expected. To deploy them, we will write a script that Foundry will use to determine the deployment logic. Finally, we will verify the smart contracts on a Moonbeam network's blockchain explorer.  

## Checking Prerequisites {: #checking-prerequisites } 

To get started, you will need the following:

 - Have an account with funds. 
  --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - Have [Foundry installed](https://book.getfoundry.sh/getting-started/installation){target=_blank}

## Setup a Foundry Project {: #setup-a-foundry-project }

The first step to start a Foundry project is of course to create it. If you have Foundry installed, you can run:

```
forge init foundry
```

This will have the forge utility initialize a new folder named `foundry` with a Foundry project initialized within it. The `script`, `src`, and `test` folders may have files in them already. Be sure to delete them, because we will be writing our own soon.  

From here, there are a few things to do first before writing any code. First, we want to add a dependency to [OpenZeppelin's smart contracts](https://github.com/OpenZeppelin/openzeppelin-contracts), because they include helpful contracts to use when writing token smart contracts. To do so, add them using their github repository name:  

```
forge install OpenZeppelin/openzeppelin-contracts
```

This will add the OpenZeppelin git submodule to your `lib` folder. To be sure that this dependency is mapped and to learn about Foundry's remappings system, you can override the mappings in a special file, `remappings.txt`:  

```
forge remappings > remappings.txt
```

Every line in this file is one of the dependencies that can be referenced in the project's smart contracts. Dependencies can be edited and renamed so that it's easier to reference different folders and files when working on smart contracts. It should look similar to this with OpenZeppelin installed properly:

```
ds-test/=lib/forge-std/lib/ds-test/src/
forge-std/=lib/forge-std/src/
openzeppelin-contracts/=lib/openzeppelin-contracts/
```

Finally, let's open up the `foundry.toml` file. In preparation for Etherscan verification and deployment, add this to the file:

```toml
[profile.default]
src = 'src'
out = 'out'
libs = ['lib']
solc_version = '0.8.17'

[rpc_endpoints]
moonbase = "https://rpc.api.moonbase.moonbeam.network"

[etherscan]
moonbase = { key = "${MOONSCAN_API_KEY}" }
```

The first addition is a specification of the `solc_version`, underneath `profile.default`. The `rpc_endpoints` tag allows you to define which RPC endpoints to use when deploying to a named network, in this case, Moonbase Alpha. The `etherscan` tag allows you to add Etherscan API keys for smart contract verification, which we will go over later.  

## Writing Smart Contracts {: #writing-smart-contracts-in-foundry }

Smart contracts in Foundry that are meant to be deployed will by default belong in the `src` folder. In this tutorial, we'll write two smart contracts. Starting with the token:

```
touch MyToken.sol
```

Open the file and add the following to it:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") {
    _mint(msg.sender, initialSupply);
  }
}
```

As you can see, the OpenZeppelin ERC20 smart contract is imported by the mapping defined in `remappings.txt`.  

The second smart contract will depend on this token contract:  

```
touch Container.sol
```

Open the file and add the following ot it:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import OpenZeppelin Contract
import {MyToken} from "./MyToken.sol";

enum ContainerStatus {
    Unsatisfied,
    Full,
    Overflowing
}

// This ERC-20 contract mints the specified amount of tokens to the contract creator
contract Container {
    MyToken token;
    uint256 capacity;
    ContainerStatus public status;

    constructor(MyToken _token, uint256 _capacity) {
        token = _token;
        capacity = _capacity;
        status = ContainerStatus.Unsatisfied;
    }

    function updateStatus() public {
        address container = address(this);
        uint256 balance = token.balanceOf(container);
        if (balance < capacity) {
            status = ContainerStatus.Unsatisfied;
        } else if (balance == capacity) {
            status = ContainerStatus.Full;
        } else if (_isOverflowing(balance)) {
            status = ContainerStatus.Overflowing;
        }
    }

    function _isOverflowing(uint256 balance) internal view returns (bool) {
        return balance > capacity;
    }
}
```

The `Container` smart contract can have its status updated based on how many tokens it holds. It requires a `MyToken` smart contract instance to function, so when we deploy it, we will need logic to ensure that it is deployed with a `MyToken` smart contract.  

## Unit Testing in Foundry {: #unit-testing-in-foundry }

Before we deploy anything to a testnet or mainnet, however, it's good to work with unit tests. Unit tests are tests that allow you to test specific parts of a smart contract's functionality. When writing your own smart contracts, it can be a good idea to break functionality into different sections so that it is easier to unit test.  


