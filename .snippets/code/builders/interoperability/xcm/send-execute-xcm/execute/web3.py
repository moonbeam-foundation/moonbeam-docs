from web3 import Web3

abi = "INSERT_XCM_UTILS_ABI"  # Paste or import the XCM Utils ABI
# This is for demo purposes, never store your private key in plain text
private_key = "INSERT_PRIVATE_KEY"
# The wallet address that corresponds to your private key
address = "INSERT_ADDRESS"
xcm_utils_address = "0x000000000000000000000000000000000000080C"

## Create Web3 provider ##
web3 = Web3(Web3.HTTPProvider("https://rpc.api.moonbase.moonbeam.network"))

## Create contract instance of the XCM Utilities Precompile ##
xcm_utils = web3.eth.contract(
    # XCM Utilities Precompile address
    address=xcm_utils_address,
    abi=abi,
)


def execute_xcm_message_locally():
    ## Define parameters required for the xcmExecute function ##
    encoded_calldata = "INSERT_ENCODED_CALLDATA"
    max_weight = 400000000

    ## Execute the custom XCM message ##
    # Craft the extrinsic
    tx = xcm_utils.functions.xcmExecute(encoded_calldata, max_weight).build_transaction(
        {
            "from": address,
            "nonce": web3.eth.get_transaction_count(address),
        }
    )
    # Sign transaction
    signedTx = web3.eth.account.sign_transaction(tx, private_key)
    # Send tx
    hash = web3.eth.send_raw_transaction(signedTx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f"Transaction receipt: { receipt.transactionHash.hex() }")


execute_xcm_message_locally()
