# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# List of available storage functions in the metadata
method_list = ws_provider.get_metadata_storage_functions()
print(method_list)

# Query basic account information
account_info = ws_provider.query(
    module="System",
    storage_function="Account",
    params=["0x578002f699722394afc52169069a1FfC98DA36f1"],
)
# Log the account nonce
print(account_info.value["nonce"])
# Log the account free balance
print(account_info.value["data"]["free"])

# Query candidate pool information from Moonbeam's Parachain Staking module
candidate_pool_info = ws_provider.query(
    module="ParachainStaking", storage_function="CandidatePool", params=[]
)
print(candidate_pool_info)
