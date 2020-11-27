---
title: Code Snippets
description: In order to make it easier to get up-and-running with Moonbeam, here are some code snippets for each of the tutorials we’ve created.
---

# Code Snippets
## Setting up a Local Moonbeam Node
**Clone moonbeam-tutorials repo:**
```
--8<-- 'setting-up-local/clone.md'
```

**Install substrate and its pre-requisites:**
```
--8<-- 'setting-up-local/substrate.md'
```

**Run initialization script:**
```
--8<-- 'setting-up-local/initscript.md'
```

**Add Rust to system path:**
```
--8<-- 'setting-up-local/cargoerror.md'
```

**Build the standalone node:**
```
--8<-- 'setting-up-local/build.md'
```

**Run node in dev mode:**
```
--8<-- 'setting-up-local/runnode.md'
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
**Moonbeam Standalone node details:**

--8<-- 'metamask-local/network-details.md'

**Moonbase Alpha TestNet:**

--8<-- 'testnet/metamask-testnet.md'

## Remix
**ERC-20 contract Open Zeppeling template:**
```solidity
--8<-- 'remix-local/contract.md'
```

## Truffle
**Download Moonbeam Truffle box:**
```
git clone https://github.com/PureStake/moonbeam-truffle-box
cd moonbeam-truffle-box
``` 

**Compile contracts in Truffle:**
```
node_modules/.bin/truffle compile
```

**Deploy contracts in Truffle:**
```
node_modules/.bin/truffle migrate --network <network_name>
```

## Installing NodeJS, npm, Web3 JS Library, and the Solidity Compiler
**Install NodeJS and npm:**
```
curl -sL https://deb.nodesource.com/setup_15.x | sudo -E bash -
```
```
sudo apt install -y nodejs
```

**Install the Web3 Javascript library with npm:**
```
npm install web3
```

**Install the Solidity Compiler (for versions v0.7.x) with npm:**
```pypy
npm install solc@0.7.0
```

## Signing Transactions with Web3 and JS
**The _transaction.js_ file to make transaction:**
```js
--8<-- 'web3-tx-local/transaction.js'
```

**The _balances.js_ file to check balances:**
```js
--8<-- 'web3-tx-local/balances.js'
```

## Compiling and Deploying a Smart Contract with Web3 and JS
**The _Incrementer.sol_ example contract:**
```js
--8<-- "web3-contract-local/Incrementer.sol"
```

**The _compile.js_ file that compiles the contract:**
```js
--8<-- "web3-contract-local/compile.js"
```

**The _deploy.js_ file that deploys the contract:**
```js
--8<-- "web3-contract-local/deploy.js"
```

**The _get.js_ file to interact with the contract:**
```js
--8<-- "web3-contract-local/get.js"
```

**The _increment.js_ file  to interact with the contract:**
```js
--8<-- "web3-contract-local/increment.js"
```

**The _reset.js_ file  to interact with the contract:**
```js
--8<-- "web3-contract-local/reset.js"
```
