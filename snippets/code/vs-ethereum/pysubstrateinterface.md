```python
from substrateinterface import SubstrateInterface

# Define the Ethereum TxHash to Check Finality
txHash = 'txHash'

# Point API Provider to Moonriver Network
moonbeamAPIProvider = SubstrateInterface(
    url="wss://wss.moonriver.moonbeam.network",
)

if __name__ == "__main__":

    # Get the latest finalized block header of the Moonriver chain
    finalizedBlockHeader =  moonbeamAPIProvider.get_block_header(finalized_only = True)
    # Get the finalized block number from the block header
    finalizedBlockNumber = finalizedBlockHeader["header"]["number"]
    # Get the transaction receipt of the given tx hash through a custom RPC request
    txReceipt = moonbeamAPIProvider.rpc_request('eth_getTransactionReceipt', [txHash])

    # Check if txReceipt is null 
    if txReceipt is None:
        print('The transaction hash cannot be found in the canonical chain.')
    else:
        #Get the block number of the tx
        txBlockNumber = int(txReceipt["result"]["blockNumber"], 16)
        #Get the transaction block through a custom RPC request
        txBlock = moonbeamAPIProvider.rpc_request('eth_getBlockByNumber', [txBlockNumber, False])
        
        print("Current finalized block number is", finalizedBlockNumber)
        print("Your transaction in block", txBlockNumber, "is finalized? " + str(txBlockNumber <= finalizedBlockNumber))
        print("Your transaction is indeed in block", txBlockNumber, "? "+ str(txHash in txBlock["result"]["transactions"]))
```