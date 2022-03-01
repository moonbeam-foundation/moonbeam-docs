# 1. Import the ABI
from compile import abi

# 2. Add the Web3 provider logic here:
# {...}

# 3. Create variables
account_from = {
    'private_key': 'YOUR-PRIVATE-KEY-HERE',
    'address': 'PUBLIC-ADDRESS-OF-PK-HERE',
}
contract_address = 'CONTRACT-ADDRESS-HERE'

print(f'Calling the reset function in contract at address: { contract_address }')

# 4. Create contract instance
Incrementer = web3.eth.contract(address=contract_address, abi=abi)

# 5. Build reset tx
reset_tx = Incrementer.functions.reset().buildTransaction(
    {
        'from': account_from['address'],
        'nonce': web3.eth.get_transaction_count(account_from['address']),
    }
)

# 6. Sign tx with PK
tx_create = web3.eth.account.sign_transaction(reset_tx, account_from['private_key'])

# 7. Send tx and wait for receipt
tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

print(f'Tx successful with hash: { tx_receipt.transactionHash.hex() }')
