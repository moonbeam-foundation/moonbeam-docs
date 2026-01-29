docker run --network="host" \
-u $(id -u ${USER}):$(id -g ${USER}) \
{{ networks.development.tracing_tag }} \
--name "INSERT_YOUR_NODE_NAME" \
--ethapi debug,trace,txpool \
--wasm-runtime-overrides /moonbeam/moonbase-substitutes-tracing \
--runtime-cache-size 64 \
--dev
