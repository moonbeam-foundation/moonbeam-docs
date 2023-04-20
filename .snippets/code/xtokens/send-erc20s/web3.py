from web3 import Web3

abi = 'X_TOKENS_ABI_HERE' # Paste or import the x-tokens ABI
private_key = 'YOUR_PRIVATE_KEY_HERE' # This is for demo purposes, never store your private key in plain text
address = 'YOUR_ADDRESS_HERE' # The wallet address that corresponds to your private key

# Create Web3 wallet & contract instance
web3 = Web3(Web3.HTTPProvider('https://rpc.api.moonbase.moonbeam.network'))
x_tokens = web3.eth.contract(
    address='0x0000000000000000000000000000000000000804',
    abi=abi
)

# ERC-20 contract address in Moonbase Alpha
ERC20_ADDRESS = 'INSERT_ERC20_ADDRESS'

# Multilocation targeting an account on the relay chain from Moonbase Alpha
# Example interior: 0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300
RELAY_ACC = [1, ['0x0' + 'INSERT_ADDRESS_32_BYTES' + '00']]

# Sends 1 ERC-20 token to the relay chain using the transfer function
def transfer_to_relay_chain_account():
    # Create transaction
    transfer_tx = x_tokens.functions.transfer(
        ERC20_ADDRESS,       # Asset
        1000000000000000000, # Amount
        RELAY_ACC,           # Destination
        4000000000           # Weight
    ).buildTransaction(
        {
            'from': address,
            'nonce': web3.eth.get_transaction_count(address),
        }
    )

    # Sign transaction
    signed_tx = web3.eth.account.sign_transaction(transfer_tx, private_key)

    # Send tx and wait for receipt
    hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f'Tx successful with hash: { receipt.transactionHash.hex() }')

transfer_to_relay_chain_account()

