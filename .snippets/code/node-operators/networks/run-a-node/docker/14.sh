docker run -p 9944:9944 -v "/var/lib/alphanet-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
--base-path /data \
--chain alphanet \
--name "INSERT_YOUR_NODE_NAME" \
--state-pruning archive \
--trie-cache-size 1073741824 \
--pool-type=fork-aware \
-- \
--name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
--sync fast
