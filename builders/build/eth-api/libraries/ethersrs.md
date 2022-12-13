---
title: How to use Ethers.rs Ethereum Library
description: Follow this tutorial to learn how to use the Ethereum EthersRS Library to send transactions and deploy Solidity smart contracts to Moonbeam via the Rust language.
---

# Ethers.rs Rust Library

![Intro diagram](/images/builders/build/eth-api/libraries/ethersrs/ethers-rust-banner.png)

## Introduction {: #introduction } 

The [Ethers.rs](https://ethers.rs){target=_blank} library provides a set of tools to interact with Ethereum Nodes via the Rust programming language that works similar to [Ethers.js](/ethersjs){target=_blank}. Moonbeam has an Ethereum-like API available that is fully compatible with Ethereum-style JSON RPC invocations. Therefore, developers can leverage this compatibility and use the Ethers.rs library to interact with a Moonbeam node as if they were doing so on Ethereum. You can read more about how to use Ethers.rs on their [official crate documentation](https://docs.rs/ethers/latest/ethers/){target=_blank}.

In this guide, you'll learn how to use the Ethers.rs library to send a transaction and deploy a contract on Moonbase Alpha. This guide can be adapted for [Moonbeam](/builders/get-started/networks/moonbeam/){target=_blank}, [Moonriver](/builders/get-started/networks/moonriver/){target=_blank}, or a [Moonbeam development node](/builders/get-started/networks/moonbeam-dev/){target=_blank}.

## Checking Prerequisites {: #checking-prerequisites } 

For the examples in this guide, you will need to have the following:

 - An account with funds.
  --8<-- 'text/faucet/faucet-list-item.md'
 - 
--8<-- 'text/common/endpoint-examples.md'
 - Have [Rust installed](https://www.rust-lang.org/tools/install){target=_blank} on your device
 - Have [solc installed](https://docs.soliditylang.org/en/v0.8.9/installing-solidity.html) on your device. Using [solc-select](https://github.com/crytic/solc-select){target=_blank} is recommended by the Ethers.rs package

!!! note
    The examples in this guide assumes you have a MacOS or Ubuntu 20.04-based environment and will need to be adapted accordingly for Windows.

## Create a Rust Project {: #create-a-rust-project }

To get started, you can create a new Rust project with the Cargo tool:

```
cargo init ethers-examples && cd ethers-examples
```

For this guide, you'll need to install the Ethers.rs library among others. To tell the Rust project to install it, you must edit the `Cargo.toml` file that's included with the document to include it under dependencies:

```toml
[package]
name = "ethers-examples"
version = "0.1.0"
edition = "2021"

[dependencies]
ethers = "1.0.2"
ethers-solc = "1.0.2"
tokio = { version = "1", features = ["full"] }
serde_json = "1.0.89"
serde = "1.0.149"
```

This example is using the `ethers` and `ethers-solc` crate versions `1.0.2` for RPC interactions and Solidity compiling. It also includes the `tokio` crate to run asynchronous Rust environments, since interacting with RPCs requires asynchronous code. Finally, it includes the `serde_json` and `serde` crates to help serialize/deserialize this example's code.

## Setting up the Ethers Provider and Client {: #setting-up-the-ethers-provider-and-client }

Throughout this guide, you'll be writing multiple functions that provide different functionality such as sending a transaction, deploying a contract, and interacting with a deployed contract. In most of these scripts you'll need to use an [Ethers provider](https://docs.rs/ethers/latest/ethers/providers/index.html){target=_blank} or an [Ethers signer client](https://docs.rs/ethers/1.0.2/ethers/middleware/struct.SignerMiddleware.html){target=_blank} to interact with the network.

--8<-- 'text/common/endpoint-setup.md'

There are multiple ways to create a provider and signer, but the easiest way is through `try_from`:

1. Import `Provider` and `Http` from the `ethers` crate
2. Use `try_from` to attempt to instantiate a JSON RPC provider object from an RPC endpoint
3. Use a private key to create a wallet object (the private key will be used to sign transactions). **Note: This is for example purposes only. Never store your private keys in a plain Rust file**
4. Wrap the provider and wallet together into a client by providing them to a `SignerMiddleware` object

=== "Moonbeam"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};

    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 2. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.moonbeam.rpc_url }}"
        )?;
        // 3. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::Moonbeam);

        // 4. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

=== "Moonriver"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};

    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 2. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.moonriver.rpc_url }}"
        )?;
        // 3. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::Moonriver);

        // 4. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

=== "Moonbase Alpha"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};

    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 2. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.moonbase.rpc_url }}"
        )?;
        // 3. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::Moonbase);

        // 4. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

=== "Moonbeam Dev Node"

    ```rust
    // 1. Import ethers crate
    use ethers::providers::{Provider, Http};

    fn main() -> Result<(), Box<dyn std::error::Error>> {
        // 2. Use try_from with RPC endpoint
        let provider = Provider::<Http>::try_from(
            "{{ networks.development.rpc_url }}"
        )?;
        // 3. Use a private key to create a wallet
        // Do not include the private key in plain text in any production code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::MoonbeamDev);

        // 4. Wrap the provider and wallet together to create a signer client
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());
        Ok(())
    }
    ```

## Send a Transaction {: #send-a-transaction }

During this section, you'll be creating a couple of functions, which will be contained in the same `main.rs` file to avoid additional complexity from implementing modules. The first function will be to check the balances of your accounts before trying to send a transaction. The second function will actually send the transaction. To run each of these functions, you will edit the `main` function and run the `main.rs` script.  

Copy and paste the following code into the `main.rs` file so that it looks like the following boiler-plate code. It includes an additional `Client` type for convenience, a `tokio` attribute for asynchronous excution, a provider, and client. All future functions will be based off of this template's imports.  

You must set up the provider and wallet in `main.rs` in the way described in the [previous section](#setting-up-the-ethers-provider-and-client).

=== "Moonbeam"

    ```rust
    use ethers::{utils, prelude::*};
    use ethers_solc::Solc;
    use std::{path::Path, sync::Arc};

    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
        let provider: Provider<Http> = Provider::<Http>::try_from(
          "{{ networks.moonbeam.rpc_url }}"
        )?;
        // Do not include the private key in plain text in any produciton code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::MoonbeamDev);
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());

        Ok(())
    }
    ```

=== "Moonriver"

    ```rust
    use ethers::{utils, prelude::*};
    use ethers_solc::Solc;
    use std::{path::Path, sync::Arc};

    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
        let provider: Provider<Http> = Provider::<Http>::try_from(
          "{{ networks.moonriver.rpc_url }}"
        )?;
        // Do not include the private key in plain text in any produciton code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::MoonbeamDev);
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());

        Ok(())
    }
    ```

=== "Moonbase Alpha"

    ```rust
    use ethers::{utils, prelude::*};
    use ethers_solc::Solc;
    use std::{path::Path, sync::Arc};

    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
        let provider: Provider<Http> = Provider::<Http>::try_from(
          "{{ networks.moonbase.rpc_url }}"
        )?;
        // Do not include the private key in plain text in any produciton code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::MoonbeamDev);
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());

        Ok(())
    }
    ```

=== "Moonbeam Dev Node"

    ```rust
    use ethers::{utils, prelude::*};
    use ethers_solc::Solc;
    use std::{path::Path, sync::Arc};

    type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

    #[tokio::main]
    async fn main() -> Result<(), Box<dyn std::error::Error>> {
        let provider: Provider<Http> = Provider::<Http>::try_from(
          "{{ networks.development.rpc_url }}"
        )?;
        // Do not include the private key in plain text in any produciton code. 
        // This is just for demonstration purposes.
        let wallet: LocalWallet = "YOUR PRIVATE KEY"
            .parse::<LocalWallet>()?
            .with_chain_id(Chain::MoonbeamDev);
        let client = SignerMiddleware::new(provider.clone(), wallet.clone());

        Ok(())
    }
    ```

The provider and client objects will be injected into the following functions so that the same objects do not have to be recreated multiple times.  

### Check Balances Function {: #check-balances-function }

Next, you will create the function for this file and complete the following steps:

1. Create a new asynchronous function named `print_balances` that takes a provider object's reference as input
2. Define the `address` variable as the address you would like to check the balance of
3. Use the `provider` object's `get_balance` function to receive the amount
4. Print the resultant balance
5. Call the `print_balances` function in the `main` function

```rust
// 1. Create an asynchronous function that takes a provider reference as input
async fn print_balances(provider: &Provider<Http>) -> Result<(), Box<dyn std::error::Error>> {
    // 2. Define the address variable as your address of choice
    let address = "YOUR ADDRESS".parse::<Address>()?;

    // 3. Use the get_balance function
    let balance = provider.get_balance(address, None).await?;

    // Print the resultant balance
    println!("{} has {}", address, balance);
    Ok(())
}
// ...
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...
    // 5. Call print_balances function in main
    print_balances(&provider).await?;

    Ok(())
}
```

You can view the [complete function on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-rust/main.rs#L27){target=_blank}.

To run the script and fetch the account balances, you can run the following command:

```
cargo run
```

If successful, the balances for the address you inserted into the script will be displayed in your terminal.

### Send Transaction Script {: #send-transaction-script }

For this example, you'll be transferring 1 DEV from an origin address (of which you hold the private key) to another address.  

1. Create a new asynchronous function named `send_transaction` that takes a client object's reference as input
2. Define the `address_from` and `address_to` variables as the addresses that the transaction should be sent from and to, respectively. Note: the `address_from` value should correspond to the private key that was used in the `main` function
3. Create a `TransactionRequest` object, and include the `to`, `value`, and `from`. When writing the `value` input, use the `ethers::utils::parse_ether` function 
4. Use the `client` object to send the transaction
5. Print the transaction after it is confirmed
6. Call the `send_transaction` function in the `main` function

```rust
// 1. Define an asynchronous that takes a client provider as input
async fn send_transaction(client: &Client) -> Result<(), Box<dyn std::error::Error>> {
    // 2. Define address_from and address_to
    let address_from = "YOUR ADDRESS FROM".parse::<Address>()?;
    let address_to = "YOUR ADDRESS TO".parse::<Address>()?;

    println!(
        "Beginning transfer of 1 native currency from {} to {}.",
        address_from, address_to
    );

    // 3. Create a TransactionRequest object
    let tx = TransactionRequest::new()
        .to(address_to)
        .value(U256::from(utils::parse_ether(1)?))
        .from(address_from);
        
    // 4. Send the transaction with the client
    let tx = client.send_transaction(tx, None).await?.await?;

    // 5. Print out the result
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);

    Ok(())
}
// ...
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...
    // 6. Call send_transaction function in main
    send_transaction(&client).await?;

    Ok(())
}
```

You can view the [complete function on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-rust/main.rs#L37){target=_blank}.

To run the script and fetch the account balances, you can run the following command:

```
cargo run
```

If the transaction was succesful, in your terminal you'll see the transaction details printed out.  

## Deploy a Contract {: #deploy-a-contract }

--8<-- 'text/libraries/contract.md'

During the rest of this section, you'll be creating a couple of functions, which will be contained in the same `main.rs` file to avoid additional complexity from implementing modules. The first function will be to compile and deploy the contract. The remaining functions will interact with the deployed contract.  

This section will also depend on the template introduced in the start of the [Send a Transaction section](#send-a-transaction). Please make sure that the `main.rs` file is set up accordingly.

### Compile and Deploy Contract Script {: #compile-and-deploy-contract-script }

This example function will compile and deploy the `Incrementer.sol` smart contract you created in the previous section. The `Incrementer.sol` smart contract should be in the root directory.  

1. Create a new asynchronous function named `compile_deploy_contract` that takes a client object's reference as input, and returns an address in the form of `H160`
2. Define a variable named `source` as the path for the directory that hosts all of the smart contracts that should be compiled, which is the root directory 
3. Use the `Solc` crate to compile all of the smart contracts in the root directory
4. Get the ABI and bytecode from the compiled result, searching for the `Incrementer.sol` contract
5. Create a contract factory for the smart contract using the ABI, bytecode, and client. The client must be wrapped into an `Arc` type for thread safety
6. Use the factory to deploy. For this example, the value `5` is used as the initial value in the constructor
7. Print out the address after the deployment
8. Return the address
9. Call the `compile_deploy_contract` function in `main`

```rust
// 1. Define an asynchronous function that takes a client provider as input and returns H160
async fn compile_deploy_contract(client: &Client) -> Result<H160, Box<dyn std::error::Error>> {
    // 2. Define a path as the directory that hosts the smart contracts in the project
    let source = Path::new(&env!("CARGO_MANIFEST_DIR"));

    // 3. Compile all of the smart contracts
    let compiled = Solc::default()
        .compile_source(source)
        .expect("Could not compile contracts");

    // 4. Get ABI & Bytecode for Incrementer.sol
    let (abi, bytecode, _runtime_bytecode) = compiled
        .find("Incrementer")
        .expect("could not find contract")
        .into_parts_or_default();

    // 5. Create a contract factory which will be used to deploy instances of the contract
    let factory = ContractFactory::new(abi, bytecode, Arc::new(client.clone()));

    // 6. Deploy
    let contract = factory.deploy(U256::from(5))?.send().await?;
    
    // 7. Print out the address
    let addr = contract.address();
    println!("Incrementer.sol has been deployed to {:?}", addr);

    // 8. Return the address
    Ok(addr)
}
// ...
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...
    // 9. Call compile_deploy_contract function in main
    let addr = compile_deploy_contract(&client).await?;

    Ok(())
}
```

You can view the [complete function on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-rust/main.rs#L57){target=_blank}.

To run the script, you can enter the following command into your terminal:

```
cargo run
```

If successful, the contract's address will be displayed in the terminal.


### Read Contract Data (Call Methods) {: #read-contract-data }

Call methods are the type of interaction that don't modify the contract's storage (change variables), meaning no transaction needs to be sent. They simply read various storage variables of the deployed contract.  

Rust is typesafe, which is why the ABI for the `Incrementer.sol` contract is required to generate a typesafe Rust struct. For this example, you should create a new file in the root of the Cargo project called `Incrementer_ABI.json`:

```
touch Incrementer_ABI.json
```

The ABI for `Incrementer.sol` is below, which should be copied and pasted into the `Incrementer_ABI.json` file:

```json
[
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "number",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "reset",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
```

Then you can take the following steps to create a function that reads and returns the `number` method of the `Incrementer.sol` contract:

1. Generate a type-safe interface for the Incrementer smart contract with the `abigen` macro
2. Create a new asynchronous function named `read_number` that takes a client object's reference and a contract address reference as input, and returns a U256
3. Create a new instance of the `Incrementer` object generated by the abigen macro with the client and contract address values
4. Call the `number` function in the new `Incrementer` object
5. Print out the resultant value
6. Return the resultant value
7. Call the `read_number` function in `main`

```rust
// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input and returns a U256
async fn read_number(client: &Client, contract_addr: &H160) -> Result<U256, Box<dyn std::error::Error>> {
    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Call contract's number function
    let value = contract.number().call().await?;

    // 5. Print out number
    println!("Incrementer's number is {}", value);

    // 6. Return the number
    Ok(value)
}
// ...
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...
    // 7. Call read_number function in main
    read_number(&client, &addr).await?;

    Ok(())
}
```

You can view the [complete function on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-rust/main.rs#L85){target=_blank}.

To run the script, you can enter the following command into your terminal:

```
cargo run
```

If successful, the number value will be displayed in the terminal.

### Interact with Contract (Send Methods) {: #interact-with-contract }

Send methods are the type of interaction that modify the contract's storage (change variables), meaning a transaction needs to be signed and sent. In this section, you'll create two functions: one to increment and one to reset the incrementer. This section will also require the `Incrementer_ABI.json` file initialized when [reading from the smart contract](#read-contract-data).  

Take the following steps to create the function to increment:

1. Ensure that the abigen macro is called for the `Incrementer_ABI.json` somewhere in the `main.rs` file (if it is already in the `main.rs` file, you do not have to have a second one)
2. Create a new asynchronous function named `increment_number` that takes a client object's reference and an address as input
3. Create a new instance of the `Incrementer` object generated by the abigen macro with the client and contract address values
4. Call the `increment` function in the new `Incrementer` object by including a `U256` object as input. In this instance, the value provided is 5
5. Call the `read_number` function in `main`

```rust
// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input
async fn increment_number(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Incrementing number...");

    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Send contract transaction
    let tx = contract.increment(U256::from(5)).send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}
// ...
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...
    // 5. Call increment_number function in main
    increment_number(&client, &addr).await?;

    Ok(())
}
```

You can view the [complete function on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-rust/main.rs#L104){target=_blank}.

To run the script, you can enter the following command into your terminal:

```
cargo run
```

If successful, the transaction receipt will be displayed in the terminal. You can use the `print_balances` function alongside the `increment_number` function in the `main` function to make sure that value is changing as expected.

Next you can interact with the reset function:

1. Ensure that the abigen macro is called for the `Incrementer_ABI.json` somewhere in the `main.rs` file (if it is already in the `main.rs` file, you do not have to have a second one)
2. Create a new asynchronous function named `reset` that takes a client object's reference and an address as input
3. Create a new instance of the `Incrementer` object generated by the abigen macro with the client and contract address values
4. Call the `reset` function in the new `Incrementer` object 
5. Call the `reset` function in `main`

```rust
// 1. Generate a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

// 2. Define an asynchronous function that takes a client provider and address as input
async fn increment_number(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Resetting number...");

    // 3. Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // 4. Send contract transaction
    let tx = contract.reset().send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}
// ...
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // ...
    // 5. Call reset function in main
    reset(&client, &addr).await?;

    Ok(())
}
```

If successful, the transaction receipt will be displayed in the terminal. You can use the `print_balances` function alongside the `reset` function in the `main` function to make sure that value is changing as expected.

--8<-- 'text/disclaimers/third-party-content.md'