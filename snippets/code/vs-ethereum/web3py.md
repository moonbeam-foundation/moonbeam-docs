```python
import asyncio
from aiohttp import ClientSession
from web3.providers.base import JSONBaseProvider
from web3.providers import HTTPProvider
from web3 import Web3

# Define the TxHash to Check Finality
txHash = 'tx_hash'

# Define the Web3 provider
RPC_address = 'https://rpc.moonriver.moonbeam.network'
web3 = Web3(HTTPProvider(RPC_address))


# synchronously request receipts for given transaction
def sync_receipts(web3, transaction):
    return web3.eth.getTransactionReceipt(transaction)

# asynchronous JSON RPC API request
async def customWeb3Request(web3, method, params):
    request_data = web3.encode_rpc_request(method, params)
    async web3
    response = base_provider.decode_rpc_response(content)
    return response

async def run(node_address, method_header, params):
    # Fetch all responses within one Client session,
    # keep connection alive for all requests.
    async with ClientSession() as session:       
        task = asyncio.ensure_future(async_make_request(session, node_address,
                                                            method_header, params))
        response = await task
        return response

if __name__ == "__main__":

    #Get the current event loop
    loop = asyncio.get_event_loop()
    
    #Get the latest finalized block of the Substrate chain
    finalizedHeadHash = loop.run_until_complete(run(RPC_address, 'chain_getFinalizedHead', []))['result']
    
    #Get finalized block header to retrieve number
    finalizedBlockHeader = loop.run_until_complete(run(RPC_address, 'chain_getHeader', [finalizedHeadHash]))['result']

    #Parse the finalized block number
    finalizedBlockNumber = int(finalizedBlockHeader["number"], 16)

    #Get the transaction receipt of the given tx hash
    txReceipt = sync_receipts(web3, txHash)

    #If block number of receipt is not null, compare it against finalized head
    if txReceipt is not None :
        txBlockNumber = txReceipt["blockNumber"]
        print('Current finalized block number is '+ str(finalizedBlockNumber))
        print('Your transaction in block '+str(txBlockNumber) + ' is finalized? ' + str(bool(finalizedBlockNumber >= txBlockNumber)))

    else:
        print("Your transaction has not been included in the canonical chain")
```