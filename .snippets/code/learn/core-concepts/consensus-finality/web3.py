from web3 import Web3

# Define the transaction hash to check finality
tx_hash = "INSERT_TX_HASH"

# Define the Web3 provider for Moonbeam
# This can be adapted for Moonriver or Moonbase Alpha
web3_provider = Web3(Web3.HTTPProvider("INSERT_RPC_API_ENDPOINT"))

if __name__ == "__main__":
    # Get the latest finalized block
    finalized_block_header = web3_provider.eth.get_block("finalized")
    finalized_block_number = finalized_block_header.number

    # Get the transaction receipt of the given transaction hash
    tx_receipt = web3_provider.eth.get_transaction_receipt(tx_hash)

    # If block number of receipt is not null, compare it against finalized head
    if tx_receipt is not None:
        tx_block_number = tx_receipt.blockNumber

        # As a safety check, get given block to check if transaction is included
        tx_block = web3_provider.eth.get_block(tx_block_number)
        is_in_block = False
        for tx in tx_block.transactions:
            if tx_hash == web3_provider.to_hex(tx):
                is_in_block = True

        print(f"Current finalized block number is { str(finalized_block_number) }")
        print(
            f"Your transaction in block { str(tx_block_number) } is finalized? { str(finalized_block_number >= tx_block_number) }"
        )
        print(
            f"Your transaction is indeed in block { str(tx_block_number) }? { is_in_block }"
        )
    else:
        print("Your transaction has not been included in the canonical chain")
