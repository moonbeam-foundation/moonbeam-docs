```python
from web3 import Web3

abi = 'XTOKENS_ABI_HERE' # Paste or import the xTokens ABI
privateKey = 'YOUR_PRIVATE_KEY_HERE' # This is for demo purposes, never store your private key in plain text
address = 'YOUR_ADDRESS_HERE' # The wallet address that corresponds to your private key

# Create ethers wallet & contract instance
web3 = Web3(Web3.HTTPProvider('https://rpc.api.moonbase.moonbeam.network'))
xTokens = web3.eth.contract(
    address='0x0000000000000000000000000000000000000804',
    abi=abi
)

# xcUNIT address in Moonbase Alpha
xcUNIT_ADDRESS = '0xFfFFfFff1FcaCBd218EDc0EbA20Fc2308C778080'

# Multilocation targeting Alice's account on the Relay Chain from Moonbase Alpha
ALICE_RELAY_ACC = [1, ['0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300']]

# Sends 1 xcUNIT to the relay chain using the transfer function
def transferToAlice():
    # Create transaction
    transferTx = xTokens.functions.transfer(
        xcUNIT_ADDRESS,         # Asset
        1000000000000,          # Amount
        ALICE_RELAY_ACC,        # Destination
        1000000000              # Weight
    ).buildTransaction(
        {
            'from': address,
            'nonce': web3.eth.get_transaction_count(address),
        }
    )

    # Sign transaction
    signedTx = web3.eth.account.sign_transaction(transferTx, privateKey)

    # 7. Send tx and wait for receipt
    hash = web3.eth.send_raw_transaction(signedTx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f'Tx successful with hash: { receipt.transactionHash.hex() }')

# Multilocation targeting the relay chain or its asset from a parachain
RELAY_CHAIN_ASSET = [1, []];

# Sends 1 xcUNIT to the relay chain using the transferMultiasset function
def transferMultiassetToAlice():
    transferTx = xTokens.functions.transfer_multiasset(
        RELAY_CHAIN_ASSET,      # Asset
        1000000000000,          # Amount
        ALICE_RELAY_ACC,        # Destination
        1000000000              # Weight
    ).buildTransaction(
        {
            'from': address,
            'nonce': web3.eth.get_transaction_count(address),
        }
    )
    signedTx = web3.eth.account.sign_transaction(transferTx, privateKey)
    hash = web3.eth.send_raw_transaction(signedTx.rawTransaction)
    receipt = web3.eth.wait_for_transaction_receipt(hash)
    print(f'Tx successful with hash: { receipt.transactionHash.hex() }')

transferToAlice()
transferMultiassetToAlice()

# Here are some additional Multilocations for the Asset multilocation:
LOCAL_ASSET = [0, ["0x0424", "0x05FD9D0BF45A2947A519A741C4B9E99EB6"]] # Note that 0x0424 indicates the xTokens pallet
DEV_FROM_OTHER_PARACHAIN = [1, ["0x00000003E8", "0x0403"]] # Use if you were targeting DEV from a non-moonbeam network

# Here are some additional Multilocations for the Destination multilocation:
ADDRESS32_OF_PARACHAIN = [1, ["0x00000007EF", "0x01c4db7bcb733e117c0b34ac96354b10d47e84a006b9e7e66a229d174e8ff2a06300"]]
ADDRESS20_FROM_PARACHAIN_TO_MOONBASE = [1, ["0x00000003E8", "0x03f24FF3a9CF04c71Dbc94D0b566f7A27B94566cac00"]]
```