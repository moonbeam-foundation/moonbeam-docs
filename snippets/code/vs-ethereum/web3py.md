```py
from web3 import Web3

# Define the TxHash to Check Finality
txHash = 'tx_hash'

# Set the RPC_address for Moonbeam
# This can also be adapted for Moonriver or Moonbase Alpha
RPC_address = 'https://moonbeam.api.onfinality.io/rpc?apikey=<insert-api-key>'

# Define the Web3 provider
web3Provider = Web3(Web3.HTTPProvider(RPC_address))

# asynchronous JSON RPC API request
def customWeb3Request(method, params):
    response = web3Provider.provider.make_request(method, params)
    return response

if __name__ == "__main__":
    # Get the latest finalized block of the Substrate chain
    # Uses Polkadot JSON-RPC
    finalizedHeadHash = customWeb3Request('chain_getFinalizedHead', [])

    # Get finalized block header to retrieve number
    # Uses Polkadot JSON-RPC
    finalizedBlockHeader =  customWeb3Request('chain_getHeader', [finalizedHeadHash["result"]])
    finalizedBlockNumber = int(finalizedBlockHeader["result"]["number"], 16)

    # Get the transaction receipt of the given tx hash
    # Uses Ethereum JSON-RPC
    txReceipt =  customWeb3Request('eth_getTransactionReceipt', [txHash])

    # If block number of receipt is not null, compare it against finalized head
    if txReceipt is not None :
        txBlockNumber = int(txReceipt["result"]["blockNumber"], 16)

        # As a safety check, get given block to check if transaction is included
        # Uses Ethereum JSON-RPC
        txBlock = customWeb3Request('eth_getBlockByNumber', [txBlockNumber, bool(0)])

        print('Current finalized block number is ' + str(finalizedBlockNumber))
        print('Your transaction in block ' +str(txBlockNumber) + ' is finalized? ' + str(finalizedBlockNumber >= txBlockNumber))
        print('Your transaction is indeed in block ' +str(txBlockNumber) + '? ' + str(txHash in txBlock["result"]["transactions"]) )
    else:
        print("Your transaction has not been included in the canonical chain")
```