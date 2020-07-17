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
cd moonbeam && git submodule init && git submodule update && \
cd vendor/frontier && git submodule init && git submodule update && \
cd ../..
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

##Genesis account
**Public Address:**
```
0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b
```

**Private Key:**
```
99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342
```

##Metamask
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

**Gas Limit:**  
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