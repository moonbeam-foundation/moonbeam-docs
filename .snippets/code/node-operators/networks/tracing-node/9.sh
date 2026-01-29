docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
{{ networks.moonbase.tracing_tag }} \
--base-path /data \
--chain {{ networks.moonbase.chain_spec }} \
--name "INSERT_YOUR_NODE_NAME" \
--state-pruning archive \
--trie-cache-size 1073741824 \
--db-cache INSERT_RAM_IN_MB \
--ethapi debug,trace,txpool \
--wasm-runtime-overrides /moonbeam/moonbase-substitutes-tracing \
--runtime-cache-size 64 \
-- \
--name "INSERT_YOUR_NODE_NAME (Embedded Relay)"
