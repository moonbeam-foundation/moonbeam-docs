# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)

# Retrieve the latest block
block = ws_provider.get_block()

# Retrieve the latest finalized block
block = ws_provider.get_block_header(finalized_only=True)

# Retrieve a block given its Substrate block hash
block_hash = "0xa499d4ebccdabe31218d232460c0f8b91bd08f72aca25f9b25b04b6dfb7a2acb"
block = ws_provider.get_block(block_hash=block_hash)

# Iterate through the extrinsics inside the block
for extrinsic in block["extrinsics"]:
    if "address" in extrinsic:
        signed_by_address = extrinsic["address"].value
    else:
        signed_by_address = None
    print(
        "\nPallet: {}\nCall: {}\nSigned by: {}".format(
            extrinsic["call"]["call_module"].name,
            extrinsic["call"]["call_function"].name,
            signed_by_address,
        )
    )
