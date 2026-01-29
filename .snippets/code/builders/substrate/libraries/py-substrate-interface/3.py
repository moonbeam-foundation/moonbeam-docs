# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonriver.wss_url }}",
)   
