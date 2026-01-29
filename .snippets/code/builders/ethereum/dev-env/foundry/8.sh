forge create src/MyToken.sol:MyToken \
--rpc-url {{ networks.moonbeam.rpc_url }} \
--broadcast \
--account deployer \
--constructor-args 100
