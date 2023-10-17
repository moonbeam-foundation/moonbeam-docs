from web3 import Web3

abi = "INSERT_XTOKENS_ABI"  # Paste or import the x-tokens ABI
private_key = "INSERT_PRIVATE_KEY"  # This is for demo purposes, never store your private key in plain text
address = "INSERT_ADDRESS"  # The wallet address that corresponds to your private key

# Create Web3 wallet & contract instance
web3 = Web3(Web3.HTTPProvider("https://rpc.api.moonbase.moonbeam.network"))
x_tokens = web3.eth.contract(
    address="0x0000000000000000000000000000000000000804", abi=abi
)

# xcUNIT address in Moonbase Alpha
xcUnit_address = "0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080"

# Multilocation targeting Alice's account on the relay chain from Moonbase Alpha
alice_relay_account = [
    1,
    ["0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300"],
]


# Sends 1 xcUNIT to the relay chain using the transfer function
def transfer_to_alice():
    # Create transaction
    transferTx = x_tokens.functions.transfer(
        xcUnit_address,  # Asset
        1000000000000,  # Amount
        alice_relay_account,  # Destination
        1000000000,  # Weight
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


# Multilocation targeting the relay chain or its asset from a parachain
relay_chain_asset = [1, []]


# Sends 1 xcUNIT to the relay chain using the transferMultiasset function
def transfer_multiasset_to_alice():
    transferTx = x_tokens.functions.transferMultiasset(
        relay_chain_asset,  # Asset
        1000000000000,  # Amount
        alice_relay_account,  # Destination
        1000000000,  # Weight
    ).build_transaction(
        {
            "from": address,
            "nonce": web3.eth.get_transaction_count(address),
        }
    )
    signedTx = web3.eth.account.sign_transaction(transferTx, private_key)
    hash = web3.eth.send_raw_transaction(signedTx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f"Tx successful with hash: { receipt.transactionHash.hex() }")


transfer_to_alice()
transfer_multiasset_to_alice()

# Here are some additional multilocations for the Asset multilocation:
local_asset = [
    0,
    ["0x0424", "0x05FD9D0BF45A2947A519A741C4B9E99EB6"],
]  # Note that 0x0424 indicates the x-tokens pallet
dev_from_other_parachain = [
    1,
    ["0x00000003E8", "0x0403"],
]  # Use if you were targeting DEV from a non-Moonbeam network

# Here are some additional multilocations for the Destination multilocation:
address32_of_parachain = [
    1,
    [
        "0x00000007EF",
        "0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300",
    ],
]
address20_from_parachain_to_moonbase = [
    1,
    ["0x00000003E8", "0x03f24FF3a9CF04c71Dbc94D0b566f7A27B94566cac00"],
]
