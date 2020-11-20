---
title: Code Snippets
description: In order to make it easier to get up-and-running with Moonbeam, here are some code snippets for each of the tutorials we’ve created.
---

# Code Snippets
## Setting up a Local Moonbeam Node
**Clone moonbeam-tutorials repo:**
```
--8<-- "setting-up-local/clone.md"
```

**Install substrate and its pre-requisites:**
```
--8<-- "setting-up-local/substrate.md"
```

**Run initialization script:**
```
--8<-- "setting-up-local/initscript.md"
```

**Add Rust to system path:**
```
--8<-- "setting-up-local/cargoerror.md"
```

**Build the standalone node:**
```
--8<-- "setting-up-local/build.md"
```

**Run node in dev mode:**
```
--8<-- "setting-up-local/runnode.md"
```

**Purge chain, clean up any old data from running a ‘dev’ node in the past:** 
```
./target/release/moonbase-standalone purge-chain --dev
```

**Run node in dev mode suppressing block information but prints errors in console:**
```	
./target/release/moonbase-standalone --dev -lerror
```

## Genesis Account
--8<-- 'metamask-local/dev-account.md'

## MetaMask
**Local Moonbeam node details:**  
--8<-- 'metamask-local/network-details.md'

## Remix
**ERC-20 contract Open Zeppeling template:**
```solidity
--8<-- 'remix-local/contract.md'
```

##Truffle
**Truffle configuration file _truffle-config.js_:**
```javascript
const PrivateKeyProvider = require ('./private-provider')
var privateKey = "99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342";

module.exports = {
  networks: {
    development: {
      provider: () => new PrivateKeyProvider(privateKey, "http://localhost:9933/", 43),
      network_id: 43
    }
  }
}
```

**ERC-20 contract for Truffle example:**
```
pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20, ERC20Detailed {
    constructor(uint256 initialSupply)
        public
        ERC20Detailed("MyToken", "MYTOK", 18)
    {
        _mint(msg.sender, initialSupply);
    }
}
```

**Truffle migration script _2_deploy_contracts.js_:**
```javascript
var MyToken = artifacts.require("MyToken");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(MyToken, "8000000000000000000000000");
};
```

**Compile contracts in Truffle:**
```
node_modules/.bin/truffle compile
```

**Deploy contracts in Truffle:**
```
node_modules/.bin/truffle migrate --network development
```

##Installing NodeJS, npm, Web3 JS Library, and the Solidity Compiler
**Install NodeJS and npm:**
```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```
```
sudo apt install -y nodejs
```

**Install the Web3 Javascript library with npm:**
```
npm install --save web3
```

**Install the Solidity Compiler (for versions v0.6.x) with npm:**
```pypy
npm install --save solc@0.6.10
```

##Signing Transactions with Web3 and JS
**The _transaction.js_ file to make transaction:**
```javascript
--8<-- "web3-tx-local/transaction.js"
```

**The _balances.js_ file to check balances:**
```javascript
--8<-- 'web3-tx-local/balances.js'
```

##Compiling and Deploying a Smart Contract with Web3 and JS
**The _Incrementer.sol_ example contract:**
```javascript
--8<-- "web3-contract-local/Incrementer.sol"
```

**The _compile.js_ file that compiles the contract:**
```javascript
--8<-- "web3-contract-local/compile.js"
```

**The _deploy.js_ file that deploys the contract:**
```javascript
--8<-- "web3-contract-localdeploy.js"
```

**The _get.js_ file to interact with the contract:**
```javascript
--8<-- "web3-contract-local/get.js"
```

**The _increment.js_ file  to interact with the contract:**
```javascript
--8<-- "web3-contract-local/increment.js"
```

**The _reset.js_ file  to interact with the contract:**
```javascript
--8<-- "web3-contract-local/reset.js"
```
