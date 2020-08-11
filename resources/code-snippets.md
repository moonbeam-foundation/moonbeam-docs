---
title: Code Snippets
description: Code snippets of all tutorials
---

#Code Snippets
##Setting up a Local Moonbeam Node
**Clone moonbeam-tutorials repo:**
```
git clone -b moonbeam-tutorials https://github.com/PureStake/moonbeam
```

**Initialize and update git-submodules:**
```
cd moonbeam && git submodule update --init --recursive
```

**Install substrate and its pre-requisites:**
```	
curl https://getsubstrate.io -sSf | bash -s -- --fast
```

**Build the node:**
```	
cargo build --release
```

**Run node in dev mode:**
``` 
./target/release/node-moonbeam --dev
```

**Purge chain, clean up any old data from running a ‘dev’ node in the past:** 
```
./target/release/node-moonbeam purge-chain --dev
```

**Run node in dev mode suppressing block information but prints errors in console:**
```	
./target/release/node-moonbeam --dev -lerror
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

**Gas limit:**  
We are working through some issues related to gas estimation in Moonbeam. In the meantime, set the gas limit manually to:  
```
4294967295
```
Once these are fixed, this manual increase of the gas limit shouldn’t be necessary.

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
    },
    live: {
      provider: () => new PrivateKeyProvider(privateKey, "http://35.203.125.209:9933/", 43),
      network_id: 43
    },
    ganache: {
      provider: () => new PrivateKeyProvider(privateKey, "http://localhost:8545/", 43),
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
  deployer.deploy(MyToken, "8000000000000000000000000", { gas: 4294967295 });
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
const Web3 = require('web3');

// Variables definition
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551'; // Enter your  Address here
const web3 = new Web3('http://localhost:9933');

// Create transaction
const deploy = async () => {
   console.log(
      `Attempting to make transaction from ${addressFrom} to ${addressTo}`
   );

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: addressFrom,
         to: addressTo,
         value: web3.utils.toWei('100', 'ether'),
         gas: '4294967295',
      },
      privKey
   );

   // Deploy transaction
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );
};

deploy();
```

**The _balances.js_ file to check balances:**
```javascript
const Web3 = require('web3');

// Variables definition
const addressFrom = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const addressTo = '0xB90168C8CBcd351D069ffFdA7B71cd846924d551'; // Enter your  Address here
const web3 = new Web3('http://localhost:9933');

// Balance call
const balances = async () => {
   const balanceFrom = web3.utils.fromWei(
      await web3.eth.getBalance(addressFrom),
      'ether'
   );
   const balanceTo = await web3.utils.fromWei(
      await web3.eth.getBalance(addressTo),
      'ether'
   );

   console.log(`The balance of ${addressFrom} is: ${balanceFrom} ETH.`);
   console.log(`The balance of ${addressTo} is: ${balanceTo} ETH.`);
};

balances();
```

##Compiling and Deploying a Smart Contract with Web3 and JS
**The _Incrementer.sol_ example contract:**
```javascript
pragma solidity ^0.6.0;

contract Incrementer{
    uint public number ;

    constructor(uint _initialNumber) public {
        number = _initialNumber;
    }

    function increment(uint _value) public {
        number = number + _value;
    }

    function reset() public {
        number = 0;
    }
}
```


**The _compile.js_ file that compiles the contract:**
```javascript
const path = require('path');
const fs = require('fs');
const solc = require('solc');

// Compile contract
const contractPath = path.resolve(__dirname, 'Incrementer.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const input = {
   language: 'Solidity',
   sources: {
      'Incrementer.sol': {
         content: source,
      },
   },
   settings: {
      outputSelection: {
         '*': {
            '*': ['*'],
         },
      },
   },
};
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)));
const contractFile = tempFile.contracts['Incrementer.sol']['Incrementer'];
module.exports = contractFile;
```

**The _deploy.js_ file that deploys the contract:**
```javascript
const Web3 = require('web3');
const contractFile = require('./compile');

// Initialization
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const web3 = new Web3('http://localhost:9933');

// Deploy contract
const deploy = async () => {
   console.log('Attempting to deploy from account:', address);

   const incrementer = new web3.eth.Contract(abi);

   incrementerTx = incrementer.deploy({
      data: bytecode,
      arguments: [5],
   });

   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address,
         data: incrementerTx.encodeABI(),
         gas: '4294967295',
      },
      privKey
   );

   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log('Contract deployed at address', createReceipt.contractAddress);
};

deploy();
```

**The _get.js_ file to interact with the contract:**
```javascript
const Web3 = require('web3');
const { abi } = require('./compile');

// Initialization
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const web3 = new Web3('http://localhost:9933');
const contractAddress = '0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a';

// Contract Call
const incrementer = new web3.eth.Contract(abi, contractAddress);
const get = async () => {
   console.log(`Making a call to contract at address ${contractAddress}`);
   const data = await incrementer.methods
      .number()
      .call({ from: address });
   console.log(`The current number stored is: ${data}`);
};

get();
```

**The _increment.js_ file  to interact with the contract:**
```javascript
const Web3 = require('web3');
const { abi } = require('./compile');

// Initialization
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const web3 = new Web3('http://localhost:9933');
const contractAddress = '0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a';
const _value = 3;

// Contract Tx
const incrementer = new web3.eth.Contract(abi);
const encoded = incrementer.methods.increment(_value).encodeABI();

const increment = async () => {
   console.log(
      `Calling the increment by ${_value} function in contract at address ${contractAddress}`
   );
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address,
         to: contractAddress,
         data: encoded,
         gas: '4294967295',
      },
      privKey
   );

   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(`Tx successfull with hash: ${createReceipt.transactionHash}`);
};

increment();
```

**The _reset.js_ file  to interact with the contract:**
```javascript
const Web3 = require('web3');
const { abi } = require('./compile');

// Initialization
const privKey =
   '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const web3 = new Web3('http://localhost:9933');
const contractAddress = '0xC2Bf5F29a4384b1aB0C063e1c666f02121B6084a';

// Contract Tx
const incrementer = new web3.eth.Contract(abi);
const encoded = incrementer.methods.reset().encodeABI();

const reset = async () => {
   console.log(
      `Calling the reset function in contract at address ${contractAddress}`
   );
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         from: address,
         to: contractAddress,
         data: encoded,
         gas: '4294967295',
      },
      privKey
   );

   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(`Tx successfull with hash: ${createReceipt.transactionHash}`);
};

reset();
```
