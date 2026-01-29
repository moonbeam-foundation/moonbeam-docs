# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbase.wss_url }}",
)


def subscription_handler(obj, update_nr, subscription_id):
    print(f"New block #{obj['header']['number']}")

    if update_nr > 10:
        return {
            "message": "Subscription will cancel when a value is returned",
            "updates_processed": update_nr,
        }


result = ws_provider.subscribe_block_headers(subscription_handler)
