forge create src/MyToken.sol:MyToken \
--rpc-url {{ networks.development.rpc_url }} \
--broadcast \
--account deployer \
--constructor-args 100
