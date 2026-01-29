docker run -p 9944:9944 -v "/var/lib/moonriver-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonriver.parachain_release_tag }} \
--base-path /data \
--chain moonriver \
--name "INSERT_YOUR_NODE_NAME" \
--state-pruning archive \
--trie-cache-size 1073741824 \
--pool-type=fork-aware \
-- \
--name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
--sync fast
