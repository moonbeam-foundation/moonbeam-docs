# Import packages
import json
from substrateinterface import *
from web3 import Web3
from eth_account import Account

# Initialize variables
ABI = [{'inputs':[],'name':'latestRelayBlockNumber','outputs':[{'internalType':'uint32','name':'relayBlockNumber','type':'uint32'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'uint32','name':'relayBlockNumber','type':'uint32'},{'components':[{'internalType':'bytes32','name':'at','type':'bytes32'},{'internalType':'bytes[]','name':'proof','type':'bytes[]'}],'internalType':'structRelayDataVerifier.ReadProof','name':'readProof','type':'tuple'},{'internalType':'bytes[]','name':'keys','type':'bytes[]'}],'name':'verifyEntries','outputs':[{'internalType':'bytes[]','name':'values','type':'bytes[]'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'uint32','name':'relayBlockNumber','type':'uint32'},{'components':[{'internalType':'bytes32','name':'at','type':'bytes32'},{'internalType':'bytes[]','name':'proof','type':'bytes[]'}],'internalType':'structRelayDataVerifier.ReadProof','name':'readProof','type':'tuple'},{'internalType':'bytes','name':'key','type':'bytes'}],'name':'verifyEntry','outputs':[{'internalType':'bytes','name':'value','type':'bytes'}],'stateMutability':'nonpayable','type':'function'}]

privateKey = 'INSERT_PRIVATE_KEY';
precompileAddress = '0x0000000000000000000000000000000000000819';
moonbeamURL = 'https://rpc.api.moonbase.moonbeam.network';
relayURL = 'wss://frag-moonbase-relay-rpc-ws.g.moonbase.moonbeam.network';

# Create provider for Moonbeam network
web3 = Web3(Web3.HTTPProvider(moonbeamURL))
account = Account.from_key(privateKey)
precompileContract = web3.eth.contract(address=precompileAddress,abi=ABI)

# Create provider for relay chain
substrate = SubstrateInterface(url= relayURL)

# Get storage key
key = substrate.generate_storage_hash(storage_module = "System",storage_function = "Account",params = ["5CBATpb3yvEM4mhX9Dw3tyuqiWKhq9YBG6ugSbodRUSbodoU"])

# Find the latest available block number(relay chain) from moonbeam
blockNum = precompileContract.functions.latestRelayBlockNumber().call()

# Get the blockHash from relay chain
blockHash = substrate.get_block_hash(blockNum);

# Get the storage proof from relay chain
response =  substrate.rpc_request("state_getReadProof",[[key],blockHash])
proof = response["result"]

# Call smart contract
tx = precompileContract.functions.verifyEntry(blockNum,proof,key).build_transaction(
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