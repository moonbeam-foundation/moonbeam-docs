use ethers::providers::{Provider, Http};
use ethers::{utils, prelude::*};

type Client = SignerMiddleware<Provider<Http>, Wallet<k256::ecdsa::SigningKey>>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let provider: Provider<Http> = Provider::<Http>::try_from("https://rpc.api.moonbase.moonbeam.network")?; // Change to correct network
    // Do not include the private key in plain text in any produciton code. This is just for demonstration purposes
    let wallet: LocalWallet = "PRIVATE KEY OF YOUR FROM ADDRESS"
        .parse::<LocalWallet>()?
        .with_chain_id(Chain::Moonbase);  // Change to correct network
    let client = SignerMiddleware::new(provider.clone(), wallet.clone());

    let address_from = "YOUR FROM ADDRESS".parse::<Address>()?;
    let address_to = "YOUR TO ADDRESS".parse::<Address>()?;

    send_transaction(&client, &address_from, &address_to).await?;
    print_balances(&provider, &address_from, &address_to).await?;

    Ok(())
}

// Print the balance of a wallet
async fn print_balances(provider: &Provider<Http>, address_from: &Address, address_to: &Address) -> Result<(), Box<dyn std::error::Error>> {
    let balance_from = provider.get_balance(address_from.clone(), None).await?;
    let balance_to = provider.get_balance(address_to.clone(), None).await?;

    println!("{} has {}", address_from, balance_from);
    println!("{} has {}", address_to, balance_to);
    Ok(())
}


// Sends some native currency
async fn send_transaction(client: &Client, address_from: &Address, address_to: &Address) -> Result<(), Box<dyn std::error::Error>> {
    println!(
        "Beginning transfer of 1 native currency {} to {}.",
        address_from, address_to
    );
    let tx = TransactionRequest::new()
        .to(address_to.clone())
        .value(U256::from(utils::parse_ether(1)?))
        .from(address_from.clone());
    let tx = client.send_transaction(tx, None).await?.await?;

    println!("Transaction Receipt: {}", serde_json::to_string(&tx)?);

    Ok(())
}