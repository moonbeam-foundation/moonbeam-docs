from web3 import Web3

abi = 'XCM-UTILS-ABI-HERE' # Paste or import the x-tokens ABI
private_key = 'INSERT-YOUR-PRIVATE-KEY' # This is for demo purposes, never store your private key in plain text
address = 'INSERT-YOUR-ADDRESS' # The wallet address that corresponds to your private key

# Create Web3 wallet & contract instance
web3 = Web3(Web3.HTTPProvider('https://rpc.api.moonbase.moonbeam.network'))
xcm_utils = web3.eth.contract(
    address='0x000000000000000000000000000000000000080C', # XCM Utilities Precompile address
    abi=abi
)

def sendXcm():
    # Define parameters required for the xcmSend function
    encoded_calldata = '0x020c000400010000070010a5d4e81300010000070010a5d4e8000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67'
    dest = [
        1, # Parents: 1 
        [] # Interior: Here
    ]

    # Create transaction
    tx = xcm_utils.functions.xcmSend(
        dest,
        encoded_calldata
    ).buildTransaction(
        {
            'from': address,
            'nonce': web3.eth.get_transaction_count(address),
        }
    )

    # Sign transaction
    signed_tx = web3.eth.account.sign_transaction(tx, private_key)

    # Send tx
    hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f'Transaction receipt: { receipt.transactionHash.hex() }')

sendXcm()