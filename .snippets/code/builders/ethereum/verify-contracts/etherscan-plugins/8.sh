forge verify-contract --chain-id {{ networks.moonbase.chain_id }} \
YOUR_CONTRACT_ADDRESS \
--constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
src/MyToken.sol:MyToken \
--etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY
