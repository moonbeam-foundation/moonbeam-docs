---
title: Using Truffle
description: Learn how to deploy a Solidity-based smart contract to a Moonbeam node using Truffle.
---

#Interacting with Moonbeam Using Truffle
##Introduction
This guide walks through the process of deploying a Solidity-based smart contract to a Moonbeam node using [Truffle](https://www.trufflesuite.com/).  Truffle is one of the commonly used development tools for smart contracts on Ethereum.  Given Moonbeam’s Ethereum compatibility features, Truffle can be used directly with a Moonbeam node.

!!! note
    This tutorial was created using the pre-alpha release of [Moonbeam](https://github.com/PureStake/moonbeam/tree/crystalin-moonbeam-frontier). The Moonbeam platform, and the [Frontier](https://github.com/paritytech/frontier) components it relies on for Substrate-based Ethereum compatibility, are still under very active development.  We have created this tutorial so you can test out Moonbeam’s Ethereum compatibility features.  Even though we are still in development, we believe it’s important that interested community members and developers have the opportunity to start to try things with Moonbeam and provide feedback.

This guide is based on an Ubuntu 18.04 installation and assumes that you have a running local Moonbeam node running in `--dev` mode.  You can find instructions for running a local Moonbeam node [here](/getting-started/setting-up-a-node/).

##Installation and Setup  
You will need to install a specific branch from the Moonbeam repo to install the version that was used to create this guide. To do that, first clone the [crystallin-add-tools branch](https://github.com/PureStake/moonbeam/tree/crystalin-add-tools) using the following command:

```
git clone -b crystalin-add-tools https://github.com/PureStake/moonbeam
```

When building Moonbeam, you need to initialize and update the included submodules with the following command:

```
cd moonbeam && git submodule init && git submodule update && \
  cd vendor/frontier && git submodule init && git submodule update && \
  cd ../..
```

Install Substrate and its pre-requisites (including Rust):

```
curl https://getsubstrate.io -sSf | bash -s -- --fast 
```

And lastly, build the project using the Cargo command:

```
cargo build --release
```

!!! note
    If a _cargo not found_ error appears in the terminal, manually add Rust to your system path (or restart your system):
```bash
source $HOME/.cargo/env
```

This will likely take 30 minutes or more, depending on your hardware.  You may see a warning about the use of deprecated item `sc_service::AbstractService::spawn_essential_task` which won’t affect the scenarios we are trying to show in this guide.  

Once the build finishes, you can start the Moonbeam node with the following command:

```
./target/release/node-moonbeam --dev
```

##Checking Prerequisites and Setting Up Truffle  
If you followed the steps above, you should have a local Moonbeam node producing blocks that looks like this:

![Local Moonbeam node that's producing blocks](/images/using-truffle-1.png)

Navigate to the folder where you built Moonbeam and go into the `tools/truffle` directory.  In my case, this is `/home/derek/moonbeam/tools/truffle`, but replace this with the correct path for your environment.  This directory has a Truffle configuration that is designed to work with a locally running Moonbeam `--dev` node.

Let’s take a look at the `truffle-config.js` file:

``` javascript
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

!!! note
    We are using a `PrivateKeyProvider` as our Web3 provider (instantiation included in `private-provider.js`).  This provider is being set up in a very specific way to work around some issues we are currently working on related to `chainid`, `nonce handling`, and the `skipCache: true` setting when using the default Truffle-provided Web3 provider with Moonbeam nodes.  We also are using the same private key that we have been using in other guides, which comes pre-funded with tokens via the genesis config of a Moonbeam node running in `--dev` mode.  The public key for this account is: 0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b.

The contract we will be deploying with Truffle is a simple ERC-20 contract.  You can find this contract under `moonbeam/tools/truffle/contracts/MyToken.sol`.  The content of this file is:

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

This is a simple ERC-20 contract based on the OpenZepplin ERC-20 contract that creates MyToken and assigns the created initial token supply to the contract creator.

If we take a look at the Truffle migration script under `migrations/2_deploy_contracts.js`, it contains the following:

```
var MyToken = artifacts.require("MyToken");

module.exports = function (deployer) {
  // deployment steps
  deployer.deploy(MyToken, 8000000, { gas: 4294967295 });
};
```

"8000000" is the number of tokens to initially mint with the contract.

!!! note
    We are specifying the gas to send with the contract deployment transaction.  This is needed as we are still working on some of the gas estimation functionality in Moonbeam.

The last setup step is to install all of the dependencies.  Do this by running the following command in the `moonbeam/tools/truffle` folder: 

```
npm install
```

![Running the npm install command](/images/using-truffle-2.png)

As the installation proceeds, you may see errors related to the compilation of keccak, which can be safely ignored for purposes of this walkthrough.

At the end of the process you should see a note about the number of packages which have been added:

![Confirmation message with number of packages added](/images/using-truffle-3.png)

##Deploying a Contract to Moonbeam Using Truffle  
Before we can deploy our contracts, let's compile them. You can do this with the following command:

```
truffle compile
```

If successful, you should see output like the following:

![Truffle compile success message](/images/using-truffle-4.png)

Now we are ready to deploy the compiled contracts.  You can do this with the following command:

```
truffle migrate --network development
```

If successful, you will see deployment actions including the address of the deployed contracts:

![Successful contract deployment actions](/images/using-truffle-5.png)

Once you have followed the [MetaMask guide](/getting-started/using-metamask/) and [Remix guide](/getting-started/using-remix/), you will be able to take the deployed contract address that is returned and load it into MetaMask or Remix.

##We Want to Hear From You
This is obviously a simple example, but it provides context for how you can start working with Moonbeam and how you can try out its Ethereum compatibility features.  We are interested in hearing about your experience following the steps in this guide or your experience trying other Ethereum-based tools with Moonbeam.  Feel free to join us in the [Moonbeam Riot room here](https://matrix.to/#/!dzULkAiPePEaverEEP:matrix.org?via=matrix.org&via=web3.foundation).  We would love to hear your feedback on Moonbeam and answer any questions that you have.  
