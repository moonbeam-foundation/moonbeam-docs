cast send --private-key INSERT_YOUR_PRIVATE_KEY \
--rpc-url {{ networks.development.rpc_url }} \
--chain {{ networks.development.chain_id }} \
INSERT_YOUR_CONTRACT_ADDRESS \
"transfer(address,uint256)" 0x0000000000000000000000000000000000000001 1
