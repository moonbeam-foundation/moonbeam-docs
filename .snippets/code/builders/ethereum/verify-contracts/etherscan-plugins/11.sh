forge create --rpc-url {{ networks.moonbase.rpc_url }} \
--constructor-args 100 \
--etherscan-api-key INSERT_YOUR_ETHERSCAN_API_KEY \
--verify --private-key YOUR_PRIVATE_KEY \
src/MyToken.sol:MyToken
