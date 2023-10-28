from web3 import Web3

abi = "INSERT_XTOKENS_ABI"  # Paste or import the x-tokens ABI
private_key = "INSERT_PRIVATE_KEY"  # This is for demo purposes, never store your private key in plain text
address = "INSERT_ADDRESS"  # The wallet address that corresponds to your private key

# Create Web3 provider
web3 = Web3(Web3.HTTPProvider("https://rpc.api.moonbase.moonbeam.network"))

# Create contract instance
x_tokens = web3.eth.contract(
    address="0x0000000000000000000000000000000000000804", abi=abi
)

# Arguments for the transfer function
asset = [1, []]  # Multilocation targeting the relay chain
amount = 1000000000000
dest = [
    # Target the relay chain from Moonbase Alpha
    1,
    # Target Alice's 32-byte relay chain account
    ["0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300"],
]
weight = 304217000


# Sends 1 xcUNIT to the relay chain using the transferMultiasset function
def transfer_multiasset_to_alice():
    # Create transaction
    transferTx = x_tokens.functions.transferMultiasset(
        asset, amount, dest, weight
    ).build_transaction(
        {
            "from": address,
            "nonce": web3.eth.get_transaction_count(address),
        }
    )

    # Sign transaction
    signedTx = web3.eth.account.sign_transaction(transferTx, private_key)

    # Send tx and wait for receipt
    hash = web3.eth.send_raw_transaction(signedTx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f"Tx successful with hash: { receipt.transactionHash.hex() }")


transfer_multiasset_to_alice()
