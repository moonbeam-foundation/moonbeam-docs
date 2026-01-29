# Imports
from substrateinterface import SubstrateInterface

# Construct the API provider
ws_provider = SubstrateInterface(
    url="{{ networks.moonbeam.wss_url }}",
) 
