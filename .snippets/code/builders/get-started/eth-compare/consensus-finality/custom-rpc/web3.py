from web3 import Web3

# Define the block hash to check finality
block_hash = 'INSERT_BLOCK_HASH'

# Set the RPC_address for Moonbeam
# This can also be adapted for Moonriver or Moonbase Alpha
RPC_address = 'INSERT_RPC_API_ENDPOINT'

# Define the Web3 provider
web3_provider = Web3(Web3.HTTPProvider(RPC_address))

# Asynchronous JSON-RPC API request
def custom_web3_request(method, params):
    response = web3_provider.provider.make_request(method, params)
    return response

if __name__ == "__main__":
    # Check if the block has been finalized
    is_finalized = custom_web3_request(
       'moon_isBlockFinalized', [block_hash])
    print(
        f'Block is finalized? { is_finalized["result"] }')
