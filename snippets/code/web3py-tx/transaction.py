from web3 import Web3

#
# -- Define Provider & Variables --
#
# Provider
provider_rpc = {
    "development": "http://localhost:9933",
    "alphanet": "https://rpc.api.moonbase.moonbeam.network",
}
web3 = Web3(Web3.HTTPProvider(provider_rpc["development"]))  # Change to correct network

# Variables
account_from = {
    "private_key": "YOUR-PRIVATE-KEY-HERE",
    "address": "PUBLIC-ADDRESS-OF-PK-HERE",
}
address_to = "ADDRESS-TO-HERE"  # Change address_to

#
#  -- Create and Deploy Transaction --
#
print(
    f'Attempting to send transaction from { account_from["address"] } to { address_to }'
)

# Sign Tx with PK
tx_create = web3.eth.account.sign_transaction(
    {
        "nonce": web3.eth.get_transaction_count(account_from["address"]),
        "gasPrice": web3.toWei("1", "gwei"),
        "gas": 21000,
        "to": address_to,
        "value": web3.toWei("1", "ether"),
    },
    account_from["private_key"],
)

# Send Tx and Wait for Receipt
tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

print(f"Transaction successful with hash: { tx_receipt.transactionHash.hex() }")