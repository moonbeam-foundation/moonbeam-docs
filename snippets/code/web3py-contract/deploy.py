from compile import abi, bytecode
from web3 import Web3

#
# -- Define Provider & Variables --
#
# Provider
provider_rpc = {
    'development': 'http://localhost:9933',
    'alphanet': 'https://rpc.testnet.moonbeam.network',
}
web3 = Web3(Web3.HTTPProvider(provider_rpc['development']))  # Change to correct network

# Variables
account_from = {
    'private_key': 'YOUR-PRIVATE-KEY-HERE',
    'address': 'PUBLIC-ADDRESS-OF-PK-HERE',
}

#
#  -- Deploy Contract --
#
print(f'Attempting to deploy from account: { account_from["address"] }')

# Create Contract Instance
Incrementer = web3.eth.contract(abi=abi, bytecode=bytecode)

# Build Constructor Tx
construct_txn = Incrementer.constructor(5).buildTransaction(
    {
        'from': account_from['address'],
        'nonce': web3.eth.getTransactionCount(account_from['address']),
    }
)

# Sign Tx with PK
tx_create = web3.eth.account.signTransaction(construct_txn, account_from['private_key'])

# Send Tx and Wait for Receipt
tx_hash = web3.eth.sendRawTransaction(tx_create.rawTransaction)
tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)

print(f'Contract deployed at address: { tx_receipt.contractAddress }')
