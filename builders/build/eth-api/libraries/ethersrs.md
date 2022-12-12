---
title: How to use Ethers.rs Ethereum Library
description: Follow this tutorial to learn how to use the Ethereum EthersRS Library to send transactions and deploy Solidity smart contracts to Moonbeam via the Rust language.
---

# Ethers.rs Rust Library

![Intro diagram](/images/builders/build/eth-api/libraries/ethers/ethersjs-banner.png)

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
    --8<-- 'text/common/assumes-mac-or-ubuntu-env.md'

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
3. Use a private key to create a wallet object (the private key will be used to sign transactions)
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

During this section, you'll be creating a couple of functions, which will be contained in the same `main.rs` file to avoid additional complexity from implementing modules. The first function will be to check the balances of your accounts before trying to send a transaction. The second script will actually send the transaction. To run each of these scripts, you will edit `main.rs` to reflect which script is running.  

Copy and paste the following code into the `main.rs` file so that it looks like the following boiler-plate code. It includes an additional `Client` type for convenience, a `tokio` attribute for asynchronous excution, a provider, and client. All future functions will be based off of this template's imports.  

You must set up the provider and wallet in `main.rs` in the way described in the [previous section](#setting-up-the-ethers-provider-and-client).

=== "Moonbeam"

    ```rust
    use ethers::prelude::*;
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
    use ethers::prelude::*;
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
    use ethers::prelude::*;
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
    use ethers::prelude::*;
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
5. Call the `print_balances` function in main.

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

You'll only need one file for executing a transaction between accounts. For this example, you'll be transferring 1 DEV token from an origin address (from which you hold the private key) to another address. To get started, you can create a `transaction.js` file by running:

```
touch transaction.js
```

Next, you will create the script for this file and complete the following steps:

1. [Set up the Ethers provider](#setting-up-the-ethers-provider)
2. Define the `privateKey` and the `addressTo` variables. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
3. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
4. Create the asynchronous `send` function which wraps the transaction object and the `wallet.sendTransaction` method
5. Create the transaction object which only requires the recipient's address and the amount to send. Note that `ethers.utils.parseEther` can be used, which handles the necessary unit conversions from Ether to Wei - similar to using `ethers.utils.parseUnits(value, 'ether')`
6. Send the transaction using the `wallet.sendTransaction` method and then use `await` to wait until the transaction is processed and the transaction receipt is returned
7. Lastly, run the `send` function

```js
// 1. Add the Ethers provider logic here:
// {...}

// 2. Create account variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const addressTo = 'ADDRESS-TO-HERE';

// 3. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 4. Create send function
const send = async () => {
  console.log(`Attempting to send transaction from ${wallet.address} to ${addressTo}`);

  // 5. Create tx object
  const tx = {
    to: addressTo,
    value: ethers.utils.parseEther('1'),
  };

  // 6. Sign and send tx - wait for receipt
  const createReceipt = await wallet.sendTransaction(tx);
  await createReceipt.wait();
  console.log(`Transaction successful with hash: ${createReceipt.hash}`);
};

// 7. Call the send function
send();
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-tx-local/transaction.js){target=_blank}.

To run the script, you can run the following command in your terminal:

```
node transaction.js
```

If the transaction was succesful, in your terminal you'll see the transaction hash has been printed out.

You can also use the `balances.js` script to check that the balances for the origin and receiving accounts have changed. The entire workflow would look like this:

![Send Tx Etherjs](/images/builders/build/eth-api/libraries/ethers/ethers-1.png)

## Deploy a Contract {: #deploy-a-contract }

--8<-- 'text/libraries/contract.md'

### Compile Contract Script {: #compile-contract-script }

--8<-- 'text/libraries/compile.md'

### Deploy Contract Script {: #deploy-contract-script }

With the script for compiling the `Incrementer.sol` contract in place, you can then use the results to send a signed transaction that deploys it. To do so, you can create a file for the deployment script called `deploy.js`:

```
touch deploy.js
```

Next, you will create the script for this file and complete the following steps:

1. Import the contract file from `compile.js`
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Define the `privateKey` for the origin account. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Save the `bytecode` and `abi` for the compiled contract
5. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
6. Create a contract instance with signer using the `ethers.ContractFactory` function, providing the `abi`, `bytecode`, and `wallet` as parameters
7. Create the asynchronous `deploy` function that will be used to deploy the contract
8. Within the `deploy` function, use the `incrementer` contract instance to call `deploy` and pass in the initial value. For this example, you can set the initial value to `5`. This will send the transaction for contract deployment. To wait for a transaction receipt you can use the `deployed` method of the contract deployment transaction
9. Lastly, run the `deploy` function

```js
// 1. Import the contract file
const contractFile = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create account variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};

// 4. Save the bytecode and ABI
const bytecode = contractFile.evm.bytecode.object;
const abi = contractFile.abi;

// 5. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 6. Create contract instance with signer
const incrementer = new ethers.ContractFactory(abi, bytecode, wallet);

// 7. Create deploy function
const deploy = async () => {
  console.log(`Attempting to deploy from account: ${wallet.address}`);

  // 8. Send tx (initial value set to 5) and wait for receipt
  const contract = await incrementer.deploy([5]);
  await contract.deployed();

  console.log(`Contract deployed at address: ${contract.address}`);
};

// 9. Call the deploy function
deploy();
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/deploy.js){target=_blank}.

To run the script, you can enter the following command into your terminal:

```
node deploy.js
```

If successful, the contract's address will be displayed in the terminal.

![Deploy Contract Etherjs](/images/builders/build/eth-api/libraries/ethers/ethers-2.png)


### Read Contract Data (Call Methods) {: #read-contract-data }

Call methods are the type of interaction that don't modify the contract's storage (change variables), meaning no transaction needs to be sent. They simply read various storage variables of the deployed contract.

To get started, you can create a file and name it `get.js`:

```
touch get.js
```

Then you can take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Create the `contractAddress` variable using the address of the deployed contract
4. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
5. Create the asynchronous `get` function
6. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `number` method which doesn't require any inputs. You can use `await` which will return the value requested once the request promise resolves
7. Lastly, call the `get` function

```js
// 1. Import the ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Contract address variable
const contractAddress = 'CONTRACT-ADDRESS-HERE';

// 4. Create contract instance
const incrementer = new ethers.Contract(contractAddress, abi, provider);

// 5. Create get function
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`);

  // 6. Call contract 
  const data = await incrementer.number();

  console.log(`The current number stored is: ${data}`);
};

// 7. Call get function
get();
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/get.js){target=_blank}.

To run the script, you can enter the following command in your terminal:

```
node get.js
```

If successful, the value will be displayed in the terminal.

### Interact with Contract (Send Methods) {: #interact-with-contract }

Send methods are the type of interaction that modify the contract's storage (change variables), meaning a transaction needs to be signed and sent. In this section, you'll create two scripts: one to increment and one to reset the incrementer. To get started, you can create a file for each script and name them `increment.js` and `reset.js`:

```
touch increment.js reset.js
```

Open the `increment.js` file and take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Define the `privateKey` for the origin account, the `contractAddress` of the deployed contract, and the `_value` to increment by. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
5. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
6. Create the asynchronous `increment` function
7. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `increment` method which requires the value to increment by as an input. You can use `await` which will return the value requested once the request promise resolves
8. Lastly, call the `increment` function

```js
// 1. Import the contract ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';
const _value = 3;

// 4. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create increment function
const increment = async () => {
  console.log(
    `Calling the increment by ${_value} function in contract at address: ${contractAddress}`
  );

  // 7. Sign and send tx and wait for receipt
  const createReceipt = await incrementer.increment([_value]);
  await createReceipt.wait();

  console.log(`Tx successful with hash: ${createReceipt.hash}`);
};

// 8. Call the increment function
increment();
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/increment.js){target=_blank}.

To run the script, you can enter the following command in your terminal:

```
node increment.js
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `increment.js` script to make sure that value is changing as expected:

![Increment Contract Ethers](/images/builders/build/eth-api/libraries/ethers/ethers-3.png)

Next you can open the `reset.js` file and take the following steps to create the script:

1. Import the `abi` from the `compile.js` file
2. [Set up the Ethers provider](#setting-up-the-ethers-provider)
3. Define the `privateKey` for the origin account and the `contractAddress` of the deployed contract. The private key is required to create a wallet instance. **Note: This is for example purposes only. Never store your private keys in a JavaScript file**
4. Create a wallet using the `privateKey` and `provider` from the previous steps. The wallet instance is used to sign transactions
5. Create an instance of the contract using the `ethers.Contract` function and passing in the `contractAddress`, `abi`, and `provider`
6. Create the asynchronous `reset` function
7. Use the contract instance to call one of the contract's methods and pass in any inputs if necessary. For this example, you will call the `reset` method which doesn't require any inputs. You can use `await` which will return the value requested once the request promise resolves
8. Lastly, call the `reset` function

```js
// 1. Import the contract ABI
const { abi } = require('./compile');

// 2. Add the Ethers provider logic here:
// {...}

// 3. Create variables
const account_from = {
  privateKey: 'YOUR-PRIVATE-KEY-HERE',
};
const contractAddress = 'CONTRACT-ADDRESS-HERE';

// 4. Create wallet
let wallet = new ethers.Wallet(account_from.privateKey, provider);

// 5. Create contract instance with signer
const incrementer = new ethers.Contract(contractAddress, abi, wallet);

// 6. Create reset function
const reset = async () => {
  console.log(`Calling the reset function in contract at address: ${contractAddress}`);

  // 7. sign and send tx and wait for receipt
  const createReceipt = await incrementer.reset();
  await createReceipt.wait();

  console.log(`Tx successful with hash: ${createReceipt.hash}`);
};

// 8. Call the reset function
reset();
```

You can view the [complete script on GitHub](https://raw.githubusercontent.com/PureStake/moonbeam-docs/master/.snippets/code/ethers-contract-local/reset.js){target=_blank}.

To run the script, you can enter the following command in your terminal:

```
node reset.js
```

If successful, the transaction hash will be displayed in the terminal. You can use the `get.js` script alongside the `reset.js` script to make sure that value is changing as expected:

![Reset Contract Ethers](/images/builders/build/eth-api/libraries/ethers/ethers-4.png)

--8<-- 'text/disclaimers/third-party-content.md'