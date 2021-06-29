```
docker run -p 9933:9933 -p 9944:9944 -v "{{ networks.moonbase.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
purestake/moonbeam:{{ networks.moonbase.parachain_docker_tag }} \
--base-path=/data \
--chain {{ networks.moonbase.chain_spec }} \
--name="YOUR-NODE-NAME" \
--execution wasm \
--wasm-execution compiled \
--pruning archive \
--state-cache-size 1 \
-- \
--pruning archive \
--name="YOUR-NODE-NAME (Embedded Relay)"
```
