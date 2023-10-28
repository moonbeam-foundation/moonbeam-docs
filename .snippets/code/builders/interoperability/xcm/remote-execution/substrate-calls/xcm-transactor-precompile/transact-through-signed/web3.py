from web3 import Web3

abi = "INSERT_ABI"  # Paste or import the XCM Transactor V2 ABI
private_key = "INSERT_PRIVATE_KEY"  # This is for demo purposes, never store your private key in plain text
address = "INSERT_ADDRESS"  # The wallet address that corresponds to your private key

# Create Web3 provider
web3 = Web3(Web3.HTTPProvider("https://rpc.api.moonbase.moonbeam.network"))

# Create contract instance
xcm_transactor_v2 = web3.eth.contract(
    address="0x000000000000000000000000000000000000080d", abi=abi
)

# Arguments for the transactThroughSigned function
dest = [
    1,  # parents = 1
    [
        # interior = X1 (the array has a length of 1)
        "0x0000000378",  # Parachain selector + Parachain ID 888
    ],
]
feeLocationAddress = "0xFFFFFFFF1AB2B146C526D4154905FF12E6E57675"
transactRequiredWeightAtMost = 1000000000
call = "0x030044236223ab4291b93eed10e4b511b37a398dee5513000064a7b3b6e00d"
feeAmount = 50000000000000000
overallWeight = 2000000000


# Sends 1 xcUNIT to the relay chain using the transferMultiasset function
def transact_through_signed():
    # Create transaction
    transferTx = xcm_transactor_v2.functions.transactThroughSigned(
        dest,
        feeLocationAddress,
        transactRequiredWeightAtMost,
        call,
        feeAmount,
        overallWeight,
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


transact_through_signed()
