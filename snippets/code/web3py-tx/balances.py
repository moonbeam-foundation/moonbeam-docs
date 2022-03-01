# 1. Add the Web3 provider logic here:
# {...}

# 2. Create address variables
address_from = "ADDRESS-FROM-HERE"
address_to = "ADDRESS-TO-HERE"

# 3. Fetch balance data
balance_from = web3.fromWei(web3.eth.get_balance(address_from), "ether")
balance_to = web3.fromWei(web3.eth.get_balance(address_to), "ether")

print(f"The balance of { address_from } is: { balance_from } ETH")
print(f"The balance of { address_to } is: { balance_to } ETH")
