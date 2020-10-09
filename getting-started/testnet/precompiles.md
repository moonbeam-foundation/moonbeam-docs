---
title: Precompiled Contracts
description: Explanation and demo on the Precompiles Contracts
---

# Precompiled Contracts on Moonbase Alpha

## Introduction

Another feature added with the [release of Moonbase Alpha v2](TODO LINK), is a few of the [precompiled contracts](https://docs.klaytn.com/smart-contract/precompiled-contracts) that are natively available on Ethereum. Currently, the first four precompiles are included, which are: ecrecover, sha256, ripemd-160 and the identity function.

In this guide, we will show how to use and/or verify this four precompiles.

## Checking Prerequisites

For this tutorial, we need to install Node.js (we'll go for v14.x) and the npm package manager. You can do this by running in your terminal:

```
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
```
```
sudo apt install -y nodejs
```

We can verify that everything installed correctly by querying the version for each package:

```
node -v
```
```
npm -v
```

As of the writing of this guide, versions used were 14.6.0 and 6.14.6, respectively. Also, we need to install the Web3 package by executing:

```
npm install --save web3
```

To verify the installed version of Web3, you can use the `ls` command:

```
npm ls web3
```

As of the writing of this guide, the version used was 1.3.0. 

## Verify signatures with ECRECOVER

The main function of this precompile is to verify the signature of a message. In general terms, you feed `ecrecover` the transaction's signature values and it returns an address. The signature is verified if the address returned is the same as the public address who sent the transaction.

Lets jump into a small example to showcase how we can leverage this precompiled function. To do so we need to retrieve the transaction's signature values (v, r, s). To do so, we'll sign and retrieved the signed message were these values are as well:

```js
const Web3 = require('web3');

// Provider
const web3 = new Web3('https://rpc.testnet.moonbeam.network');

// Address and Private Key
const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
const pk1 = '99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342';
const msg = web3.utils.sha3('supercalifragilisticexpialidocious');

async function signMessage(pk) {
   try {
   // Sign and get Signed Message
      const smsg = await web3.eth.accounts.sign(msg, pk);
      console.log(smsg);
   } catch (error) {
      console.error(error);
   }
}

signMessage(pk1);
```

This code will return the following object in the terminal:

```js
{
  message: '0xc2ae6711c7a897c75140343cde1cbdba96ebbd756f5914fde5c12fadf002ec97',
  messageHash: '0xc51dac836bc7841a01c4b631fa620904fc8724d7f9f1d3c420f0e02adf229d50',
  v: '0x1b',
  r: '0x44287513919034a471a7dc2b2ed121f95984ae23b20f9637ba8dff471b6719ef',
  s: '0x7d7dc30309a3baffbfd9342b97d0e804092c0aeb5821319aa732bc09146eafb4',
  signature: '0x44287513919034a471a7dc2b2ed121f95984ae23b20f9637ba8dff471b6719ef7d7dc30309a3baffbfd9342b97d0e804092c0aeb5821319aa732bc09146eafb41b'
}
```
With the necessary values, we can go to Remix to test the precompiled contract. Note that this can be verified as well with the Web3 JS library, but in our case we'll go to Remix to be sure that this is using the precompiled contract. The Solidity code we can use to verify the signature is the following:

```solidity
pragma solidity ^0.7.0;

contract ECRECOVER{
    address addressTest = 0x12Cb274aAD8251C875c0bf6872b67d9983E53fDd;
    bytes32 msgHash = 0xc51dac836bc7841a01c4b631fa620904fc8724d7f9f1d3c420f0e02adf229d50;
    uint8 v = 0x1b;
    bytes32 r = 0x44287513919034a471a7dc2b2ed121f95984ae23b20f9637ba8dff471b6719ef;
    bytes32 s = 0x7d7dc30309a3baffbfd9342b97d0e804092c0aeb5821319aa732bc09146eafb4;
    
    
    function verify() public view returns(bool) {
        //bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        //bytes32 prefixedHash = keccak256(abi.encode(prefix, hash));
        return (ecrecover(msgHash, v, r, s) == (addressTest));
    }
}
```

Using the [Remix compiler and deployment](/getting-started/local-node/using-remix), and with [MetaMask pointing to Moonbase Alpha](/getting-started/testnet/metamask), we can deploy the contract and call the `verify` method that returns _true_ if the address returned by `ecrecover` is equal to the address used to signed the message (related to the private key and needs to be manually set in the contract).

## Hashing with SHA256

This hashing function is widely used. It returns a SHA256 hash from the given data. To test this precompile, you can use this [online tool](https://emn178.github.io/online-tools/sha256.html) to calculate the SHA256 hash of any string you want, in our case we'll do so with `Hello World!`. We can head directly to Remix and deploy the following code, where the calculated hash is set for the `expectedHash` variable:

```solidity
pragma solidity ^0.7.0;

contract Hash256{
    bytes32 public expectedHash = 0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069;

    function calculateHash() internal pure returns (bytes32) {
        string memory word = 'Hello World!';
        bytes32 hash = sha256(bytes (word));
        
        return hash;        
    }
    
    function checkHash() public view returns(bool) {
        return (calculateHash() == expectedHash);
    }
}

```


