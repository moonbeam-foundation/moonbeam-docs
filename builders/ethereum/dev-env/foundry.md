---
title: Deploy Contracts with Foundry
description: Learn how to use Foundry, an Ethereum development environment, to compile, deploy, and debug Solidity smart contracts on Moonbeam.
categories: Dev Environments, Ethereum Toolkit
---

# Using Foundry to Deploy To Moonbeam

## Introduction {: #introduction }

[Foundry](https://github.com/foundry-rs/foundry){target=\_blank} is an Ethereum development environment written in Rust that helps developers manage dependencies, compile projects, run tests, deploy contracts, and interact with blockchains from the command line. Foundry can directly interact with Moonbeam's Ethereum API so it can be used to deploy smart contracts into Moonbeam.

Four tools make up Foundry:  

- **[Forge](https://getfoundry.sh/forge/overview/){target=\_blank}** - compiles, tests, and deploys contracts
- **[Cast](https://getfoundry.sh/cast/overview/){target=\_blank}** - a command line interface for interacting with contracts
- **[Anvil](https://getfoundry.sh/anvil/overview/){target=\_blank}** - a local TestNet node for development purposes that can fork preexisting networks
- **[Chisel](https://getfoundry.sh/chisel/overview/){target=\_blank}** - a Solidity REPL for quickly testing Solidity snippets

This guide will cover how to use Foundry to compile, deploy, and debug Ethereum smart contracts on the Moonbase Alpha TestNet. This guide can also be adapted for Moonbeam, Moonriver, or a Moonbeam development node.

## Checking Prerequisites {: #checking-prerequisites }

To get started, you will need the following:

 - Have an account with funds.
  --8<-- 'text/_common/faucet/faucet-list-item.md'
 - 
--8<-- 'text/_common/endpoint-examples-list-item.md'
 - Have [Foundry installed](https://getfoundry.sh/introduction/installation/){target=\_blank}

## Creating a Foundry Project {: #creating-a-foundry-project }

You will need to create a Foundry project if you don't already have one. You can create one by completing the following steps:

1. Install Foundry if you haven't already. If on Linux or MacOS, you can run these commands:
  
    ```bash
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
    ```

    If on Windows, you'll have to install Rust and then build Foundry from source:

    ```bash
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh
    cargo install --git https://github.com/foundry-rs/foundry foundry-cli anvil --bins --locked
    ```

2. Create the project, which will create a folder with three folders within it, and open it:

    ```bash
    forge init foundry && cd foundry
    ```

With the default project created, you should see three folders.  

- `lib` - all of the project's dependencies in the form of git submodules
- `src` - where to put your smart contracts (with functionality)
- `test` - where to put the forge tests for your project, which are written in Solidity

In addition to these three folders, a git project will also be created along with a prewritten `.gitignore` file with relevant file types and folders ignored.

## The Source Folder {: #the-src-folder }

The `src` folder may already contain `Counter.sol`, a minimal Solidity contract. Feel free to delete it. To avoid errors, you should also delete the `Counter.s.sol` file in the `scripts` folder and the `Counter.t.sol` file in the `test` folder. In the following steps, you will be deploying an ERC-20 contract. In the contracts directory, you can create the `MyToken.sol` file:

```bash
cd src
touch MyToken.sol
```

Open the file and add the following contract to it:

```solidity
--8<-- 'code/builders/ethereum/dev-env/foundry/ERC20.sol'
```

Before you attempt to compile, install OpenZeppelin contracts as a dependency. You may have to commit previous changes to git beforehand. By default, Foundry uses git submodules instead of npm packages, so the traditional npm import path and command are not used. Instead, use the name of OpenZeppelin's GitHub repository:

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

## Compiling Solidity {: #compiling-solidity }

Once all dependencies have been installed, you can compile the contract:

```bash
forge build
```

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/compile.md'

After compilation, two folders will be created: `out` and `cache`. The ABI and bytecode for your contracts will be contained within the `out` folder. These two folders are already ignored by the `.gitignore` included in the default Foundry project initialization.

## Deploying the Contract {: #deploying-the-contract }

There are two primary ways to deploy contracts using Foundry. The first is the straightforward command `forge create`. There's also the more flexible and powerful option of foundry scripting, which runs simulations before any deployments. In the following sections, `forge create` and foundry scripting will both be covered.

### Using Forge Create {: #using-forge-create }

Before deploying, you'll need to set up your keystore by importing your private key. You can do this using the `cast wallet import` command as follows:

```bash
cast wallet import deployer --interactive
```

This will prompt you to:

1. Enter your private key
2. Enter a password to encrypt the keystore

The account will be saved as "deployer" in your keystore. You can then use this account name in the deployment commands. You'll be prompted for your keystore password when deploying contracts or sending transactions. 

Deploying the contract with `forge create` takes a single command, but you must include an RPC endpoint and constructor arguments. `MyToken.sol` asks for an initial supply of tokens in its constructor, so each of the following commands includes 100 as a constructor argument. You can deploy the `MyToken.sol` contract using the following command for the correct network:

=== "Moonbeam"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonriver"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonbase Alpha"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --account deployer \
    --constructor-args 100
    ```

=== "Moonbeam Dev Node"

    ```bash
    forge create src/MyToken.sol:MyToken \
    --rpc-url {{ networks.development.rpc_url }} \
    --account deployer \
    --constructor-args 100
    ```

After you've deployed the contract and a few seconds have passed, you should see the address in the terminal.

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/deploy.md'

Congratulations! Your contract is live! Save the address, as you will use it to interact with this contract instance in the next step.

### Deploying via Solidity Scripting {: #deploying-via-solidity-scripting }  

Solidity scripting is a more powerful and flexible way to deploy contracts than [`forge create`](#deploying-the-contract). Writing a Solidity script is identical to writing a typical Solidity smart contract, though you won't ever deploy this contract.

You can tailor the behavior of `forge script` with various parameters. All components are optional except for local simulation, which is a required part of every run. The `forge script` command will attempt to execute all applicable steps in the following order:

1. **Local simulation** - simulate the transaction(s) in a local EVM
2. **Onchain simulation** - simulate the transaction(s) via the provided RPC URL
3. **Broadcasting** - when the `--broadcast` flag is provided, and simulations succeed, the transaction(s) are dispatched
4. **Verification** - API-based smart contract verification when the `--verify` flag and a valid API key are provided

Now, go ahead and write the script. In the script folder, create a file named `MyToken.s.sol`. Copy and paste the contents of the below file. 

```solidity
--8<-- 'code/builders/ethereum/dev-env/foundry/MyToken-script.sol'
```

Notice that even though the above script is not being deployed, it still requires all the typical formatting for a Solidity contract, such as the pragma statement.

For this example, Foundry will first attempt a local simulation and a simulation against the provided RPC before deploying the contract. Remember that it will execute all relevant steps in order. Foundry won't proceed with the deployment if any of the simulations fail. You can deploy the `MyToken.sol` contract with this command.

```bash
forge script script/MyToken.s.sol --rpc-url {{ networks.moonbase.rpc_url }} --broadcast --account deployer
```

If your script's execution succeeds, your terminal should resemble the output below.

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/script.md'

And that's it! For more information about Solidity scripting with Foundry, be sure to check out [Foundry's documentation site](https://getfoundry.sh/guides/scripting-with-solidity/){target=\_blank}.

## Interacting with the Contract {: #interacting-with-the-contract }

Foundry includes cast, a CLI for performing Ethereum RPC calls.

Try to retrieve your token's name using Cast, where `INSERT_YOUR_CONTRACT_ADDRESS` is the address of the contract that you deployed in the previous section:

=== "Moonbeam"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.moonbase.rpc_url }}
    ```

=== "Moonbeam Dev Node"

    ```bash
    cast call INSERT_YOUR_CONTRACT_ADDRESS "name()" --rpc-url {{ networks.development.rpc_url }}
    ```

You should get this data in hexadecimal format:

```text
0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

This is far from readable, but you can use Cast to convert it into your desired format. In this case, the data is text, so you can convert it into ASCII characters to see "My Token":

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/cast.md'

```bash
cast --to-ascii 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000074d79546f6b656e00000000000000000000000000000000000000000000000000
```

You can also mutate data with cast as well. Try burning tokens by sending them to the zero address.

=== "Moonbeam"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbeam.rpc_url }} \
    --chain {{ networks.moonbeam.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonriver"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonriver.rpc_url }} \
    --chain {{ networks.moonriver.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbase Alpha"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.moonbase.rpc_url }} \
    --chain {{ networks.moonbase.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

=== "Moonbeam Dev Node"

    ```bash
    cast send --private-key INSERT_YOUR_PRIVATE_KEY \
    --rpc-url {{ networks.development.rpc_url }} \
    --chain {{ networks.development.chain_id }} \
    INSERT_YOUR_CONTRACT_ADDRESS \
    "transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
    ```

The transaction will be signed by your Moonbase account and be broadcast to the network. The output should look similar to:

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/burn.md'

Congratulations, you have successfully deployed and interacted with a contract using Foundry!

## Forking with Anvil {: #forking-with-cast-anvil }

As previously mentioned, [Anvil](https://getfoundry.sh/anvil/overview/#anvil){target=\_blank} is a local TestNet node for development purposes that can fork preexisting networks. Forking Moonbeam allows you to interact with live contracts deployed on the network.

There are some limitations to be aware of when forking with Anvil. Since Anvil is based on an EVM implementation, you cannot interact with any of the Moonbeam precompiled contracts and their functions. Precompiles are a part of the Substrate implementation and therefore cannot be replicated in the simulated EVM environment. This prohibits you from interacting with cross-chain assets on Moonbeam and Substrate-based functionality such as staking and governance.

To fork Moonbeam or Moonriver, you will need to have your own endpoint and API key which you can get from one of the supported [Endpoint Providers](/builders/get-started/endpoints/){target=\_blank}.

To fork Moonbeam from the command line, you can run the following command from within your Foundry project directory:

=== "Moonbeam"

    ```bash
    anvil --fork-url {{ networks.moonbeam.rpc_url }}
    ```

=== "Moonriver"

    ```bash
    anvil --fork-url {{ networks.moonriver.rpc_url }}
    ```

=== "Moonbase Alpha"

    ```bash
    anvil --fork-url {{ networks.moonbase.rpc_url }}
    ```

Your forked instance will have 10 development accounts that are pre-funded with 10,000 test tokens. The forked instance is available at `http://127.0.0.1:8545/`. The output in your terminal should resemble the following:

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/fork-anvil.md'

To verify you have forked the network, you can query the latest block number:

```bash
curl --data '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8545 
```

If you convert the `result` from [hex to decimal](https://www.rapidtables.com/convert/number/hex-to-decimal.html){target=\_blank}, you should get the latest block number from the time you forked the network. You can cross reference the block number using a [block explorer](/builders/get-started/explorers/){target=\_blank}.

From here you can deploy new contracts to your forked instance of Moonbeam or interact with contracts already deployed. Building off of the previous example in this guide, you can make a call using Cast to check the balance of the minted MYTOK tokens in the account you deployed the contract with:

```bash
cast call INSERT_CONTRACT_ADDRESS  "balanceOf(address)(uint256)" INSERT_YOUR_ADDRESS --rpc-url http://localhost:8545
```

## Using Chisel {: #using-chisel }

Chisel is a Solidity REPL or shell. It allows a developer to write Solidity directly in the console for testing small snippets of code, letting developers skip the project setup and contract deployment steps for what should be a quick process.  

Since Chisel is mainly useful for quick testing, it can be used outside of a Foundry project. But, if executed within a Foundry project, it will keep the configurations within `foundry.toml` when running.  

For this example, you will be testing out some of the features of `abi` within Solidity because it is complex enough to demonstrate how Chisel could be useful. To get started using Chisel, run the following in the command line to start the shell:

```bash
chisel
```

In the shell, you can write Solidity code as if it were running within a function:

```solidity
bytes memory myData = abi.encode(100, true, "Develop on Moonbeam");
```

Let's say you were interested in how `abi` encoded data because you're looking into how to most efficiently store data on the blockchain and thus save gas. To view how the `myData` is stored in memory, you can use the following command while in the Chisel shell:

```bash
!memdump
```

`memdump` will dump all of the data in your current session. You'll likely see something like this below. If you aren't good at reading hexadecimal or if you don't know how ABI encoding works, then you might not be able to find where the `myData` variable has been stored.

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/memdump.md'

Fortunately, Chisel lets you easily figure out where this information is stored. Using the `!rawstack` command, you can find the location in the stack where the value of a variable:  

```bash
!rawstack myData
```

In this situation, since bytes is over 32 bytes in length, the memory pointer is displayed instead. But that's exactly what's needed since you already know the entirety of the stack from the `!memdump` command.

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/rawstack.md'

The `!rawstack` command shows that the `myData` variable is stored at `0x80`, so when comparing this with the memory dump retrieved from the `!memdump` command, it looks like `myData` is stored like this:  

```text
[0x80:0xa0]: 0x00000000000000000000000000000000000000000000000000000000000000a0
[0xa0:0xc0]: 0x0000000000000000000000000000000000000000000000000000000000000064
[0xc0:0xe0]: 0x0000000000000000000000000000000000000000000000000000000000000001
[0xe0:0x100]: 0x0000000000000000000000000000000000000000000000000000000000000060
[0x100:0x120]: 0x0000000000000000000000000000000000000000000000000000000000000013
[0x120:0x140]: 0x446576656c6f70206f6e204d6f6f6e6265616d00000000000000000000000000
```

At first glance, this makes sense, since `0xa0` has a value of `0x64` which is equal to 100, and `0xc0` has a value of `0x01` which is equal to true. If you want to learn more about how ABI-encoding works, the [Solidity documentation for ABI is helpful](https://docs.soliditylang.org/en/v0.8.18/abi-spec.html){target=\_blank}. In this case, there are a lot of zeros in this method of data packing, so as a smart contract developer you might instead try to use structs or pack the data together more efficiently with bitwise code.  

Since you're done with this code, you can clear the state of Chisel so that it doesn't mess with any future logic that you want to try out (while running the same instance of Chisel):  

```bash
!clear
```

There's an even easier way to test with Chisel. When writing code that ends with a semicolon (`;`), Chisel will run it as a statement, storing its value in Chisel's runtime state. But if you only needed to see how the ABI-encoded data was represented, then you could get away with running the code as an expression. To try this out with the same `abi` example, write the following in the Chisel shell:

```bash
abi.encode(100, true, "Develop on Moonbeam")
```

You should see something like the following:  

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/expression.md'

While it doesn't display the data in the same way, you still get the contents of the data, and it also further breaks down how the information is coded, such as letting you know that the `0xa0` value defines the length of the data.  

By default, when you leave the Chisel shell, none of the data is persisted. But you can instruct chisel to do so. For example, you can take the following steps to store a variable:

1. Store a `uint256` in Chisel
    ```bash
    uint256 myNumber = 101;
    ```

2. Store the session with `!save`. For this example, you can use the number `1` as a save ID
    ```bash
    !save 1
    ```

3. Quit the session  
    ```bash
    !quit
    ```

Then to view and interact with your stored Chisel states, you can take the following steps:

1. View a list of saved Chisel states
     ```bash
     chisel list
     ```

2. Load your stored states
    ```bash
    chisel load 1
    ```

3. View the `uint256` saved in Chisel from the previous set of steps
    ```bash
    !rawstack myNumber
    ```  

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/save-state.md'

You can even fork networks while using Chisel:

```bash
!fork {{ networks.moonbase.rpc_url }}
```

Then, for example, you can query the balance of one of Moonbase Alpha's collators:  

```text
{{ networks.moonbase.staking.candidates.address1 }}.balance
```

--8<-- 'code/builders/ethereum/dev-env/foundry/terminal/query-balance.md'

If you want to learn more about Chisel, download Foundry and refer to its [official reference page](https://getfoundry.sh/chisel/reference/){target=\_blank}.

## Foundry With Hardhat {: #foundry-with-hardhat }  

Often, there will be the case where a project that you wish to integrate with has all of its setup within [Hardhat](/builders/ethereum/dev-env/hardhat/){target=\_blank}, making it an arduous task to convert the entirety of the project into Foundry. This additional work is avoidable by creating a hybrid project that uses both Hardhat and Foundry features together. This is possible with Hardhat's [hardhat-foundry plugin](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-foundry){target=\_blank}.  

To convert your preexisting Foundry project to a hybrid project, you will essentially have to install a Hardhat project into the same folder:  

```bash
npm init
npm install --save-dev hardhat @nomicfoundation/hardhat-foundry
npx hardhat init
```

For more information, please refer to our documentation on [Creating a Hardhat Project](/builders/ethereum/dev-env/hardhat/#creating-a-hardhat-project){target=\_blank}.

After initializing the new Hardhat project, a few new folders and files should appear: `contracts`, `hardhat.config.js`, `scripts`, and `test/Lock.js`. You'll need to make a few modifications to create a hybrid project:

1. Edit the `hardhat.config.js` file within your repository. Open it up, and at the top, add the following:  

    ```javascript
    require("@nomicfoundation/hardhat-foundry");
    ```

    After adding the `hardhat-foundry` plugin, the typical `contracts` folders for Hardhat will not work because now Hardhat expects all smart contracts to be stored within Foundry's `src` folder

2. Move all smart contracts within the `contracts` folder into the `src` folder, and then delete the `contracts` folder
3. Edit the `foundry.toml` file to ensure that dependencies installed via Git submodules and npm can be compiled by the Forge tool. Edit the `profile.default` to ensure that the `libs` entry has both `lib` and `node_modules`:  

    ```toml
    [profile.default]
    src = 'src'
    out = 'out'
    libs = ['lib', 'node_modules']
    solc = '0.8.20'
    evm_version = 'london'
    ```

Now both `forge build` and `npx hardhat compile` should work regardless of the dependencies.  

Both `forge test` and `npx hardhat test` should now be able to access all smart contracts and dependencies. `forge test` will only test the Solidity tests, whereas `npx hardhat test` will only test the JavaScript tests. If you would like to use them in conjunction, then you can create a new script within your `package.json` file:  

```json
"scripts": {
    "test": "npx hardhat test && forge test"
}
```

You can run this command with:  

```bash
npm run test
```

Finally, while not necessary, it could be worthwhile to move all JavaScript scripts from the `scripts` folder into Foundry's `script` folder and delete the `scripts` folder so that you don't have two folders that serve the same purpose.

--8<-- 'text/_disclaimers/third-party-content.md'
