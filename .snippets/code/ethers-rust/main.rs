use ethers::{utils, prelude::*};
use ethers_solc::Solc;
use std::{path::Path, sync::Arc};

type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider: Provider<Http> = Provider::<Http>::try_from("http://localhost:9933")?;
    // Do not include the private key in plain text in any produciton code. This is just for demonstration purposes.
    let wallet: LocalWallet = "99b3c12287537e38c90a9219d4cb074a89a16e9cdb20bf85728ebd97c343e342"
        .parse::<LocalWallet>()?
        .with_chain_id(Chain::MoonbeamDev);
    let client = SignerMiddleware::new(provider.clone(), wallet.clone());

    send_transaction(&client).await?;
    print_balances(&provider).await?;
    let addr = compile_deploy_contract(&client).await?;
    read_number(&client, &addr).await?;
    increment_number(&client, &addr).await?;
    read_number(&client, &addr).await?;

    Ok(())
}

// Print the balance of a wallet
async fn print_balances(provider: &Provider<Http>) -> Result<(), Box<dyn std::error::Error>> {
    let address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".parse::<Address>()?;
    let balance = provider.get_balance(address, None).await?;

    println!("{} has {}", address, balance);
    Ok(())
}


// Sends some native currency
async fn send_transaction(client: &Client) -> Result<(), Box<dyn std::error::Error>> {
    let address_from = "0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b".parse::<Address>()?;
    let address_to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045".parse::<Address>()?;

    println!(
        "Beginning transfer of 1 native currency from {} to {}.",
        address_from, address_to
    );
    let tx = TransactionRequest::new()
        .to(address_to)
        .value(U256::from(utils::parse_ether(1)?))
        .from(address_from);
    let tx = client.send_transaction(tx, None).await?.await?;

    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);

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