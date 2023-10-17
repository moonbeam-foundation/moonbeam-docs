from substrateinterface import SubstrateInterface

# Define the Ethereum transaction hash to check finality
tx_hash = "INSERT_TX_HASH"

# Point API provider to Moonbeam
# This can be adapted for Moonriver or Moonbase Alpha
moonbeam_API_provider = SubstrateInterface(
    url="INSERT_WSS_API_ENDPOINT",
)

if __name__ == "__main__":
    # Get the latest finalized block header of the chain
    finalized_block_header = moonbeam_API_provider.get_block_header(finalized_only=True)
    # Get the finalized block number from the block header
    finalized_block_number = finalized_block_header["header"]["number"]
    # Get the transaction receipt of the given transaction hash through a
    # custom RPC request
    tx_receipt = moonbeam_API_provider.rpc_request(
        "eth_getTransactionReceipt", [tx_hash]
    )

    # Check if tx_receipt is null
    if tx_receipt is None:
        print("The transaction hash cannot be found in the canonical chain.")
    else:
        # Get the block number of the transaction
        tx_block_number = int(tx_receipt["result"]["blockNumber"], 16)
        # Get the transaction block through a custom RPC request
        tx_block = moonbeam_API_provider.rpc_request(
            "eth_getBlockByNumber", [tx_block_number, False]
        )

        print(f"Current finalized block number is { str(finalized_block_number) }")
        print(
            f"Your transaction in block { str(tx_block_number) } is finalized? { str(finalized_block_number >= tx_block_number) }"
        )
        print(
            f'Your transaction is indeed in block { str(tx_block_number) }? { str(tx_hash in tx_block["result"]["transactions"]) }'
        )
