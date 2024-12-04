# Import packages
from eth_account import Account
from substrateinterface import SubstrateInterface
from web3 import Web3

# Initialize variables
abi = INSERT_ABI

privateKey = "INSERT_PRIVATE_KEY"
precompileAddress = "0x0000000000000000000000000000000000000819"
moonbeamURL = "https://rpc.api.moonbase.moonbeam.network"
relayURL = "wss://relay.api.moonbase.moonbeam.network"

# Create provider for Moonbeam network
web3 = Web3(Web3.HTTPProvider(moonbeamURL))
account = Account.from_key(privateKey)
precompileContract = web3.eth.contract(address=precompileAddress, abi=abi)

# Create provider for relay chain
substrate = SubstrateInterface(url=relayURL)

# Get storage key
key = substrate.generate_storage_hash(
    storage_module="System",
    storage_function="Account",
    params=["5CBATpb3yvEM4mhX9Dw3tyuqiWKhq9YBG6ugSbodRUSbodoU"],
)

# Find the latest available relay chain block number from Moonbeam
blockNum = precompileContract.functions.latestRelayBlockNumber().call()

# Get the block hash from relay chain
blockHash = substrate.get_block_hash(blockNum)

# Get the storage proof from relay chain
response = substrate.rpc_request("state_getReadProof", [[key], blockHash])
proof = response["result"]

# Call smart contract
tx = precompileContract.functions.verifyEntry(blockNum, proof, key).build_transaction(
    {
        "from": Web3.to_checksum_address(account.address),
        "nonce": web3.eth.get_transaction_count(
            Web3.to_checksum_address(account.address)
        ),
    }
)
tx_create = web3.eth.account.sign_transaction(tx, privateKey)
tx_hash = web3.eth.send_raw_transaction(tx_create.rawTransaction)
tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
