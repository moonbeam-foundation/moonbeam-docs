# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)   

# List of available runtime constants in the metadata
constant_list = ws_provider.get_metadata_constants()
print(constant_list)

# Retrieve the Existential Deposit constant on Moonbeam, which is 0
constant = ws_provider.get_constant("Balances", "ExistentialDeposit")
print(constant.value)
