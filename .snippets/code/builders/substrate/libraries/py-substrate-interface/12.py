# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# Construct a transaction call
call = ws_provider.compose_call(
    call_module="Balances",
    call_function="transfer_allow_death",
    call_params={
        "dest": "0x44236223aB4291b93EEd10E4B511B37a398DEE55",
        "value": 1 * 10**18,
    },
)

# Generate the signature payload
signature_payload = ws_provider.generate_signature_payload(call=call)
