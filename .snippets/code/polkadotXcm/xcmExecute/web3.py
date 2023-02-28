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

def executeXcmMessageLocally():
    # Define parameters required for the xcmExecute function
    encodedCalldata = '0x020c00040000010403001300008a5d78456301130000010403001300008a5d78456301000d010004000103003cd0a705a2dc65e5b1e1205896baa2be8a07c6e0'
    maxWeight = '1000000000'

    # Create transaction
    tx = xcmUtils.functions.xcmExecute(
        encodedCalldata,
        maxWeight
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
