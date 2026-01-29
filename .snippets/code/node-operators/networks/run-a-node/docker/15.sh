docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--base-path /data \
--chain {{ networks.moonbeam.chain_spec }} \
--name "INSERT_YOUR_NODE_NAME" \
--state-pruning archive \
--trie-cache-size 1073741824 \
--db-cache INSERT_RAM_IN_MB \
--pool-type=fork-aware \
--unsafe-rpc-external \
-- \
--name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
--sync fast
