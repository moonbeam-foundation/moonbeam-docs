docker run --network="host" -v "{{ networks.moonriver.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
--base-path /data \
--chain {{ networks.moonriver.chain_spec }} \
--name "INSERT_YOUR_NODE_NAME" \
--collator \
--trie-cache-size 1073741824 \
--db-cache INSERT_RAM_IN_MB \
--pool-type=fork-aware \
-- \
--name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
--sync fast
