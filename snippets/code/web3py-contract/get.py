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
web3 = Web3(Web3.HTTPProvider(provider_rpc["development"]))  # Change to correct network

# Variables
contract_address = 'CONTRACT-ADDRESS-HERE'

#
#  -- Call Function --
#
print(f'Making a call to contract at address: { contract_address }')

# Create Contract Instance
Incrementer = web3.eth.contract(address=contract_address, abi=abi)

# Call Contract
number = Incrementer.functions.number().call()

print(f'The current number stored is: { number } ')
