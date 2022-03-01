# 1. Import the ABI
from compile import abi

# 2. Add the Web3 provider logic here:
# {...}

# 3. Create address variable
contract_address = 'CONTRACT-ADDRESS-HERE'

print(f'Making a call to contract at address: { contract_address }')

# 4. Create contract instance
Incrementer = web3.eth.contract(address=contract_address, abi=abi)

# 5. Call Contract
number = Incrementer.functions.number().call()

print(f'The current number stored is: { number } ')
