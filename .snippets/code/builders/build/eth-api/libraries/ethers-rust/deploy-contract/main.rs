use ethers::providers::{Provider, Http};
use ethers::{prelude::*};
use ethers_solc::Solc;
use std::{path::Path, sync::Arc};

type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider: Provider<Http> = Provider::<Http>::try_from("https://rpc.api.moonbase.moonbeam.network")?; // Change to correct network
    // Do not include the private key in plain text in any produciton code. This is just for demonstration purposes
    // Do not include '0x' at the start of the private key
    let wallet: LocalWallet = "PRIVATE KEY OF YOUR FROM ADDRESS"
        .parse::<LocalWallet>()?
        .with_chain_id(Chain::Moonbase);
    let client = SignerMiddleware::new(provider.clone(), wallet.clone());

    // Deploy contract and read initial incrementer value
    let addr = compile_deploy_contract(&client).await?;
    read_number(&client, &addr).await?;

    // Increment and read the incremented number
    increment_number(&client, &addr).await?;
    read_number(&client, &addr).await?;

    // Reset the incremented number and read it
    reset(&client, &addr).await?;
    read_number(&client, &addr).await?;

    Ok(())
}

// Need to install solc for this tutorial: https://github.com/crytic/solc-select
async fn compile_deploy_contract(client: &Client) -> Result<H160, Box<dyn std::error::Error>> {
    // Incrementer.sol is located in the root directory
    let source = Path::new(&env!("CARGO_MANIFEST_DIR"));

    // Compile it
    let compiled = Solc::default()
        .compile_source(source)
        .expect("Could not compile contracts");

    // Get ABI & Bytecode for Incrementer.sol
    let (abi, bytecode, _runtime_bytecode) = compiled
        .find("Incrementer")
        .expect("could not find contract")
        .into_parts_or_default();

    // Create a contract factory which will be used to deploy instances of the contract
    let factory = ContractFactory::new(abi, bytecode, Arc::new(client.clone()));

    // Deploy
    let contract = factory.deploy(U256::from(5))?.send().await?;
    let addr = contract.address();

    println!("Incrementer.sol has been deployed to {:?}", addr);

    Ok(addr)
}

// Generates a type-safe interface for the Incrementer smart contract
abigen!(
    Incrementer,
    "./Incrementer_ABI.json",
    event_derives(serde::Deserialize, serde::Serialize)
);

async fn read_number(client: &Client, contract_addr: &H160) -> Result<U256, Box<dyn std::error::Error>> {
    // Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // Call contract's number function
    let value = contract.number().call().await?;

    // Print out value
    println!("Incrementer's number is {}", value);

    Ok(value)
}

async fn increment_number(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Incrementing number...");

    // Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // Send contract transaction
    let tx = contract.increment(U256::from(5)).send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}

async fn reset(client: &Client, contract_addr: &H160) -> Result<(), Box<dyn std::error::Error>> {
    println!("Resetting number...");

    // Create contract instance
    let contract = Incrementer::new(contract_addr.clone(), Arc::new(client.clone()));

    // Send contract transaction
    let tx = contract.reset().send().await?.await?;
    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);
    
    Ok(())
}