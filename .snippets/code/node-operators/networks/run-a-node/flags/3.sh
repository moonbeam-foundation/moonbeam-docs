docker run --network="host" -v "{{ networks.moonbase.node_directory }}:/data" \
-u $(id -u ${USER}):$(id -g ${USER}) \
moonbeamfoundation/moonbeam:{{ networks.moonbase.parachain_release_tag }} \
--help
