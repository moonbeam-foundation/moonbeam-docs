from web3 import Web3

web3 = Web3(Web3.HTTPProvider("https://rpc.api.moonbase.moonbeam.network"))

# Replace with the address of the ERC-20 token
token_address = "0x9Aac6FB41773af877a2Be73c99897F3DdFACf576"
token_abi = [  # ERC-20 ABI
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "payable": False,
        "stateMutability": "view",
        "type": "function",
    },
]
token_contract = web3.eth.contract(address=token_address, abi=token_abi)


def get_token_metadata():
    try:
        name = token_contract.functions.name().call()
        symbol = token_contract.functions.symbol().call()
        decimals = token_contract.functions.decimals().call()
        print(f"Name: {name}")
        print(f"Symbol: {symbol}")
        print(f"Decimals: {decimals}")
    except Exception as e:
        print(f"Error fetching token metadata: {e}")


get_token_metadata()
