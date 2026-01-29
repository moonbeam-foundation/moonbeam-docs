# Imports
from substrateinterface import SubstrateInterface, Keypair, KeypairType

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# Define the signature from the offline machine
signature_payload = "INSERT_SIGNATURE_PAYLOAD"

# Construct a keypair with the Ethereum style wallet address of the sending account
keypair = Keypair(public_key="INSERT_ADDRESS_WITHOUT_0X", crypto_type=KeypairType.ECDSA)

# Construct the same transaction call that was signed
call = ws_provider.compose_call(
    call_module="Balances",
    call_function="transfer_allow_death",
    call_params={
        "dest": "0x44236223aB4291b93EEd10E4B511B37a398DEE55",
        "value": 1 * 10**18,
    },
)

# Construct the signed extrinsic with the generated signature
extrinsic = ws_provider.create_signed_extrinsic(
    call=call, keypair=keypair, signature=signature
)

# Submit the signed extrinsic
result = ws_provider.submit_extrinsic(extrinsic=extrinsic)

# Print the execution result
print(result.extrinsic_hash)
