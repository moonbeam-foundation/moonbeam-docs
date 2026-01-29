# 1. Import web3.py
from web3 import Web3

# 2. Create web3.py provider
web3 = Web3(Web3.HTTPProvider("{{ networks.moonbeam.rpc_url }}")) # Insert your RPC URL here
