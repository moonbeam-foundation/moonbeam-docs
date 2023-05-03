from web3 import Web3

# Create provider
web3 = Web3(Web3.HTTPProvider('https://rpc.api.moonbase.moonbeam.network'))

# Create interface for the Precompile Registry
precompile_registry = web3.eth.contract(
    address='0x0000000000000000000000000000000000000815',
    abi=PRECOMPILE_REGISTRY_ABI
)

# Interact with the Precompile Registry
def is_active_precompile():
    proxy_precompile = '0x000000000000000000000000000000000000080b'

    # Check if the Proxy Precompile is a precompile
    is_precompile = precompile_registry.functions.isPrecompile(
        proxy_precompile).call()
    # Should return 'Address is a precompile: true'
    print('Address is a precompile: ', is_precompile)

    # Check if the Proxy Precompile is an active precompile
    is_active_precompile = precompile_registry.functions.isActivePrecompile(
        proxy_precompile).call()
    # Should return 'Address is an active precompile: true'
    print('Address is an active precompile: ', is_active_precompile)

is_active_precompile()
