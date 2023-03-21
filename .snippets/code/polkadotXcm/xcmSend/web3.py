from web3 import Web3

abi = 'XCM-UTILS-ABI-HERE' # Paste or import the x-tokens ABI
privateKey = 'INSERT-YOUR-PRIVATE-KEY' # This is for demo purposes, never store your private key in plain text
address = 'INSERT-YOUR-ADDRESS' # The wallet address that corresponds to your private key

# Create Web3 wallet & contract instance
web3 = Web3(Web3.HTTPProvider('https://rpc.api.moonbase.moonbeam.network'))
xcmUtils = web3.eth.contract(
    address='0x000000000000000000000000000000000000080C', # XCM Utilities Precompile address
    abi=abi
)

def sendXcm():
    # Define parameters required for the xcmSend function
    encodedCalldata = '0x020c0004000100000f0000c16ff2862313000100000f0000c16ff28623000d010004010101000c36e9ba26fa63c60ec728fe75fe57b86a450d94e7fee7f9f9eddd0d3f400d67'
    dest = [
        1, # Parents: 1 
        [] # Interior: Here
    ]

    # Create transaction
    tx = xcmUtils.functions.xcmSend(
        dest,
        encodedCalldata
    ).buildTransaction(
        {
            'from': address,
            'nonce': web3.eth.get_transaction_count(address),
        }
    )

    # Sign transaction
    signedTx = web3.eth.account.sign_transaction(tx, privateKey)

    # Send tx
    hash = web3.eth.send_raw_transaction(signedTx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f'Transaction receipt: { receipt.transactionHash.hex() }')

sendXcm()