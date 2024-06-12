# 1. Add imports
from web3.gas_strategies.rpc import rpc_gas_price_strategy
from web3 import Web3

# 2. Add the Web3 provider logic here:
provider_rpc = {
    "development": "http://localhost:9944",
    "moonbase": "https://rpc.api.moonbase.moonbeam.network",
}
web3 = Web3(Web3.HTTPProvider(provider_rpc["moonbase"]))  # Change to correct network

# 3. Create address variables
account_from = {
    'private_key': 'INSERT_YOUR_PRIVATE_KEY',
    'address': 'INSERT_PUBLIC_ADDRESS_OF_PK',
}
address_to = 'INSERT_TO_ADDRESS'

print(
    f'Attempting to send transaction from { account_from["address"] } to { address_to }'
)

# 4. Set the gas price strategy
web3.eth.set_gas_price_strategy(rpc_gas_price_strategy)

# 5. Sign tx with PK
tx_create = web3.eth.account.sign_transaction(
    {
        "nonce": web3.eth.get_transaction_count(
            Web3.to_checksum_address(account_from["address"])
        ),
        "gasPrice": web3.eth.generate_gas_price(),
        "gas": 21000,
        "to": Web3.to_checksum_address(address_to),
        "value": web3.to_wei("1", "ether"),
    },
    account_from["private_key"],
)

# 6. Send tx and wait for receipt
tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

print(f"Transaction successful with hash: { tx_receipt.transactionHash.hex() }")
