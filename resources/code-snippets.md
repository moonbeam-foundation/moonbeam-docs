---
title: Code Snippets
description: Code snippets of all tutorials
---

#Code Snippets
##Setting up a Local Moonbeam Node
**Clone moonbeam-tutorials repo:**
```
git clone -b tutorial-v2 https://github.com/PureStake/moonbeam
cd moonbeam
```

**Install substrate and its pre-requisites:**
```	
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

**Add Rust to system path:**
```
source $HOME/.cargo/env
```

**Run the initialization script:**
```
./scripts/init.sh
```

**Build the standalone node:**
```	
cd ./node/standalone
cargo build --release
```

**Run node in dev mode:**
``` 
./target/release/node-moonbeam --dev
```

**Purge chain, clean up any old data from running a ‘dev’ node in the past:** 
```
./target/release/moonbase-standalone --dev
```

**Run node in dev mode suppressing block information but prints errors in console:**
```	
./target/release/moonbase-standalone --dev -lerror
```

##Polkadot JS Apps
**Add Moonbeam custom types to Polkadot JS:**
```json
{
  "Address": "AccountId",
  "LookupSource": "AccountId",
  "Account": {
    "nonce": "U256",
    "balance": "U256"
  },
  "Transaction": {
    "nonce": "U256",
    "action": "String",
    "gas_price": "u64",
    "gas_limit": "u64",
    "value": "U256",
    "input": "Vec<u8>",
    "signature": "Signature"
  },
  "Signature": {
    "v": "u64",
    "r": "H256",
    "s": "H256"
  }
}
```

##Genesis Account
**Public address:**
```
0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b
```

**Private key:**
```
99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342
```

##MetaMask
**Local Moonbeam node details:**  
Network Name: 
```
Moonbeam Dev  
```
New RPC URL:
```
http://127.0.0.1:9933
```
ChainID:
```
43
```

##Remix
**ERC-20 contract Open Zeppeling template:**
```
pragma solidity ^0.6.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/token/ERC20/ERC20.sol';

// This ERC-20 contract mints the specified amount of tokens to the contract creator.
contract MyToken is ERC20 {
  constructor(uint256 initialSupply) ERC20("MyToken", "MYTOK") public {
    _mint(msg.sender, initialSupply);
  }
}
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
--8<-- "web3-tx/transaction.js"
```

**The _balances.js_ file to check balances:**
```javascript
--8<-- "web3-tx/balances.js"
```

##Compiling and Deploying a Smart Contract with Web3 and JS
**The _Incrementer.sol_ example contract:**
```javascript
--8<-- "web3-contract/Incrementer.sol"
```

**The _compile.js_ file that compiles the contract:**
```javascript
--8<-- "web3-contract/compile.js"
```

**The _deploy.js_ file that deploys the contract:**
```javascript
--8<-- "web3-contract/deploy.js"
```

**The _get.js_ file to interact with the contract:**
```javascript
--8<-- "web3-contract/get.js"
```

**The _increment.js_ file  to interact with the contract:**
```javascript
--8<-- "web3-contract/increment.js"
```

**The _reset.js_ file  to interact with the contract:**
```javascript
--8<-- "web3-contract/reset.js"
```
