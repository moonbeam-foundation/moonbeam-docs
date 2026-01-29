docker run -p 9944:9944 -v "/var/lib/moonbeam-data:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonbeam.parachain_release_tag }} \
--base-path /data \
--chain moonbeam \
--name "INSERT_YOUR_NODE_NAME" \
--collator \
--trie-cache-size 1073741824 \
--pool-type=fork-aware \
-- \
--name "INSERT_YOUR_NODE_NAME (Embedded Relay)" \
--sync fast
