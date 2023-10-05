from web3 import Web3

# Paste or import the Identity Precompile ABI
abi = "INSERT_IDENTITY_PRECOMPILE_ABI"
account_from = {
    "private_key": "INSERT_PRIVATE_KEY",
    "address": "INSERT_ADDRESS",
}
identity_precompile_address = "0x0000000000000000000000000000000000000818"

# Create provider
web3 = Web3(Web3.HTTPProvider("https://rpc.api.moonbase.moonbeam.network"))

# Create interface for the Precompile Registry
identity_precompile = web3.eth.contract(address=identity_precompile_address, abi=abi)


def set_identity():
    # Assemble identity info
    identity_info = {
        "additional": [],
        "display": {
            "hasData": True,
            "value": "0x416c696365",  # Alice in hex
        },
        "legal": {
            "hasData": False,
            "value": "0x",
        },
        "web": {
            "hasData": False,
            "value": "0x",
        },
        "riot": {
            "hasData": False,
            "value": "0x",
        },
        "email": {
            "hasData": False,
            "value": "0x",
        },
        "hasPgpFingerprint": False,
        "pgpFingerprint": "0x",
        "image": {
            "hasData": False,
            "value": "0x",
        },
        "twitter": {
            "hasData": False,
            "value": "0x",
        },
    }

    # Set the identity
    submit_identity = identity_precompile.functions.setIdentity(
        identity_info
    ).build_transaction(
        {
            "from": Web3.to_checksum_address(account_from["address"]),
            "nonce": web3.eth.get_transaction_count(
                Web3.to_checksum_address(account_from["address"])
            ),
        }
    )
    # Sign and send the transaction to set the identity
    tx_create = web3.eth.account.sign_transaction(
        submit_identity, account_from["private_key"]
    )
    tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Identity set. Transaction hash: { tx_receipt.transactionHash.hex() }")

    # Retrieve the identity
    identity = identity_precompile.functions.identity(account_from["address"]).call()
    print(f"Identity is valid: { identity[0] }")
    print(f"Judgements provided for this identity: { identity[1] }")
    print(f"Deposit paid for this identity: { identity[2] }")
    print(f"Identity information: { identity[3] }")
    print(f"Display name: { web3.to_text(identity[3][1][1]) }")


set_identity()
