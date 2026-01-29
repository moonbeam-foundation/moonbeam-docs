forge verify-contract --chain-id {{ networks.moonbeam.chain_id }} \
--constructor-args 0x0000000000000000000000000000000000000000000000000000000000000064 \
--verifier sourcify INSERT_CONTRACT_ADDRESS src/MyToken.sol:MyToken 
