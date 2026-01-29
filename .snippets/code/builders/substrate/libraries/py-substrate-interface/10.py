# Imports
from substrateinterface import Keypair, KeypairType

# Define the shortform private key
privatekey = bytes.fromhex("INSERT_PRIVATE_KEY_WITHOUT_0X_PREFIX")

# Define the account mnemonic
mnemonic = "INSERT_MNEMONIC"

# Generate the keypair from shortform private key
keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

# Generate the keypair from mnemonic
keypair = Keypair.create_from_mnemonic(mnemonic, crypto_type=KeypairType.ECDSA)
