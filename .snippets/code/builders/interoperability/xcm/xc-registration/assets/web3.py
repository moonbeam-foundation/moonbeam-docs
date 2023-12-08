from web3 import Web3

private_key = "INSERT_PRIVATE_KEY"
abi = "INSERT_PRECOMPILE_REGISTRY_ABI"  # Paste or import the Precompile Registry ABI
xc20_address = "INSERT_XC_20_PRECOMPILE_ADDRESS"
registry_address = "0x0000000000000000000000000000000000000815"

# Create provider
web3 = Web3(Web3.HTTPProvider("https://rpc.api.moonbase.moonbeam.network"))

# Create interface for the Precompile Registry
precompile_registry = web3.eth.contract(address=registry_address, abi=abi)


def update_account_code():
    # Update the precompile bytecode
    precompile_registry.functions.updateAccountCode(xc20_address).call()

    # Check the precompile bytecode
    bytecode = web3.eth.get_code(xc20_address)
    print("The XC-20 precompile's bytecode is: ", web3.to_hex(bytecode))


update_account_code()
