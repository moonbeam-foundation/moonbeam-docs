forge create --rpc-url {{ networks.moonbase.rpc_url }} \
--constructor-args 100 \
--verify --verifier sourcify \
--private-key INSERT_YOUR_PRIVATE_KEY \
src/MyToken.sol:MyToken
