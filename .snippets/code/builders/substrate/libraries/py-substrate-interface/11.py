# Imports
from substrateinterface import SubstrateInterface, Keypair, KeypairType
from substrateinterface.exceptions import SubstrateRequestException

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# Define the shortform private key of the sending account
privatekey = bytes.fromhex("INSERT_PRIVATE_KEY_WITHOUT_0X_PREFIX")

# Generate the keypair
keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

# Form a transaction call
call = ws_provider.compose_call(
    call_module="Balances",
    call_function="transfer_allow_death",
    call_params={
        "dest": "0x44236223aB4291b93EEd10E4B511B37a398DEE55",
        "value": 1 * 10**18,
    },
)

# Form a signed extrinsic
extrinsic = ws_provider.create_signed_extrinsic(call=call, keypair=keypair)

# Submit the extrinsic
try:
    receipt = ws_provider.submit_extrinsic(extrinsic, wait_for_inclusion=True)
    print(
        "Extrinsic '{}' sent and included in block '{}'".format(
            receipt.extrinsic_hash, receipt.block_hash
        )
    )
except SubstrateRequestException as e:
    print("Failed to send: {}".format(e))
