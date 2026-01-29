docker run --network="host" -v "{{ networks.moonbeam.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--base-path /data \
--chain {{ networks.moonbeam.chain_spec }} \
--name "INSERT_YOUR_NODE_NAME" \
--state-pruning archive \
--trie-cache-size 1073741824 \
# This is a comment
--db-cache INSERT_RAM_IN_MB \
--pool-type=fork-aware \
--frontier-backend-type sql \
-- \
--name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
--sync fast
