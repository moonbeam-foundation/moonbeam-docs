from web3 import Web3

# 1. Add the Web3 provider logic here:
provider_rpc = {
    "development": "http://localhost:9944",
    "moonbase": "https://rpc.api.moonbase.moonbeam.network",
}
web3 = Web3(Web3.HTTPProvider(provider_rpc["moonbase"]))  # Change to correct network

# 2. Create address variables
address_from = 'INSERT_FROM_ADDRESS'
address_to = 'INSERT_TO_ADDRESS'

# 3. Fetch balance data
balance_from = web3.from_wei(
    web3.eth.get_balance(Web3.to_checksum_address(address_from)), "ether"
)
balance_to = web3.from_wei(
    web3.eth.get_balance(Web3.to_checksum_address(address_to)), "ether"
)

print(f"The balance of { address_from } is: { balance_from } DEV")
print(f"The balance of { address_to } is: { balance_to } DEV")
