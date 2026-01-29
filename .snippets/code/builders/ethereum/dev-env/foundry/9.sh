forge create src/MyToken.sol:MyToken \
--rpc-url {{ networks.moonriver.rpc_url }} \
--broadcast \
--account deployer \
--constructor-args 100
