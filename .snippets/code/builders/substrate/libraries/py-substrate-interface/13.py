# Imports
from substrateinterface import Keypair, KeypairType

# Define the signature payload from the offline machine
signature_payload = "INSERT_SIGNATURE_PAYLOAD"

# Define the shortform private key of the sender account
privatekey = bytes.fromhex("INSERT_PRIVATE_KEY_WITHOUT_0X_PREFIX")

# Generate the keypair from shortform private key
keypair = Keypair.create_from_private_key(privatekey, crypto_type=KeypairType.ECDSA)

# Sign the signature_payload 
signature = keypair.sign(signature_payload)
